const express = require("express")
const router = express.Router() // 라우터 객체 생성
const axios = require("axios")
const FormData = require("form-data")
const fs = require("fs")
const exifr = require("exifr")

const upload = require("../middlewares/multer_config")
const { Photo, PhotoCategoryMap, Category } = require("../models")

// =========================================================
// [POST] 사진 업로드 (로그인 필수)
// =========================================================
router.post("/", upload.single("file"), async (req, res) => {
  try {
    // 1. 로그인 여부 확인 (Passport가 제공하는 함수)
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: "로그인이 필요합니다." })
    }

    const currentUserId = req.user.id

    // 2. 파일 유효성 검사
    if (!req.file) {
      return res.status(400).json({ error: "사진 파일 없음" })
    }

    const file = req.file
    let finalPath = file.path // DB에 저장할 경로 (기본값: 방금 올린 파일)
    let finalFilename = file.filename // DB에 저장할 파일명

    // ---------------------------------------------------------
    // 3. [메타데이터 추출] (중복 체크를 위해 가장 먼저 수행)
    // ---------------------------------------------------------
    let meta = {}
    try {
      meta = await exifr.parse(file.path, { gps: true, tiff: true })
    } catch (e) {
      console.log("메타데이터 추출 실패:", e.message)
    }

    const takenAt = meta?.DateTimeOriginal || null
    const lat = meta?.latitude || null
    const lon = meta?.longitude || null

    console.log("-----------------------------------------")
    console.log("UserId:", currentUserId)
    console.log("파일명:", file.originalname)

    // ---------------------------------------------------------
    // 4. [중복 체크 및 파일 재사용 로직] 이미 같은 날짜에 찍은 사진이 있는지 확인
    // ---------------------------------------------------------
    if (takenAt) {
      // (1) [본인 중복] 내가 이미 올린 사진인가? -> 저장 거부
      const myPhoto = await Photo.findOne({
        where: {
          takenAt: takenAt,
          UserId: currentUserId,
        },
        include: [{ model: PhotoCategoryMap, include: [Category] }],
      })

      if (myPhoto) {
        console.log("이미 등록한 사진입니다.")
        // 방금 업로드된 임시 파일 삭제
        fs.unlink(file.path, () => {})

        const mainCategory =
          myPhoto.PhotoCategoryMaps?.[0]?.Category?.category || "기타"
        return res.status(200).json({
          message: "이미 저장된 사진입니다.",
          isDuplicate: true,
          photoId: myPhoto.id,
          category: mainCategory,
          results: [],
        })
      }

      // (2) [타인 중복] 남이 올린 적이 있는가? -> 파일 재사용 (서버 용량 절약)
      const otherUserPhoto = await Photo.findOne({
        where: { takenAt: takenAt }, // 유저 구분 없이 전체 검색
      })

      if (otherUserPhoto) {
        console.log(`User ${otherUserPhoto.UserId}이 올린 파일이 존재합니다.`)

        // 1. 방금 내가 올린 파일은 필요 없으니 삭제
        fs.unlink(file.path, (err) => {
          if (err) console.error("임시 파일 삭제 실패:", err)
        })

        // 2. 기존에 있떤 파일의 경로를 내 DB에 저장하기 위해 변수 교체
        finalPath = otherUserPhoto.url
        finalFilename = otherUserPhoto.photo
      }
    }

    // =========================================================
    // [새로운 파일 등록 / 파일 재사용]
    // =========================================================

    // ---------------------------------------------------------
    // 5. [역지오코딩] (위도/경도 -> 주소 변환)
    // ---------------------------------------------------------
    let addressValue = "위치 정보 없음" // 기본값

    if (lat && lon) {
      try {
        // OpenStreetMap (Nominatim) 무료 API 호출
        const geoRes = await axios.get(
          `https://nominatim.openstreetmap.org/reverse`,
          {
            params: {
              format: "json",
              lat: lat,
              lon: lon,
              "accept-language": "ko",
              zoom: 18, // 상세 주소 레벨
              addressdetails: 1,
            },
            headers: {
              // 중요: Nominatim은 User-Agent 헤더가 없으면 차단함
              "User-Agent": "MyPhotoAbumApp/1.0",
            },
          }
        )

        // 응답에서 주소 추출
        if (geoRes.data && geoRes.data.address) {
          const addr = geoRes.data.address

          // geoRes.data.address 객체에서 시/구/동만 추출
          // 1. 시/도 (우선순위: city > province)
          const si = addr.city || addr.province || null

          // 2. 구/군 (우선순위: borough > district > county)
          // 서울의 '구'는 보통 borough, 지방의 '군'은 county
          const gu = addr.borough || addr.district || addr.county || null

          // 3. 동/읍/면 (우선순위: quarter > neighbourhood > hamlet > village)
          // quarter가 가장 흔한 '동', hamlet은 '리' 단위
          const dong =
            addr.quarter ||
            addr.neighbourhood ||
            addr.hamlet ||
            addr.village ||
            null

          // 4. 문자열 합치기 (공백 제거)
          const validAddress = [si, gu, dong].filter((v) => v).join(" ")

          // 만약 셋 다 null이라서 빈 문자열이 되면 기존 기본값 유지, 아니면 덮어쓰기
          if (validAddress) {
            addressValue = validAddress
          }

          console.log("변환된 주소(시/구/동):", addressValue)
        }
      } catch (geoErr) {
        console.error("주소 변환 실패:", geoErr.message)
        // 실패해도 업로드는 진행되어야 하므로 에러를 던지지는 않음
      }
    }

    // ---------------------------------------------------------
    // 6. [AI 분석 요청] (FastAPI)
    // ---------------------------------------------------------

    // [FastAPI 연동]
    const formData = new FormData()

    // 중요: 타인 파일을 재사용하는 경우, 이미 삭제된 file.path가 아니라 finalPath를 읽어야 함
    // finalPath가 실제 존재하는지 안전장치 확인
    if (!fs.existsSync(finalPath)) {
      throw new Error("분석할 이미지 파일이 서버에 존재하지 않습니다.")
    }

    formData.append("file", fs.createReadStream(finalPath))

    const aiResponse = await axios.post(
      "http://localhost:8000/album/category",
      formData,
      {
        headers: { ...formData.getHeaders() },
      }
    )

    const aiResults = aiResponse.data.results

    // ---------------------------------------------------------
    // 7. [DB 저장]
    // ---------------------------------------------------------
    const newPhoto = await Photo.create({
      UserId: currentUserId,
      photo: finalFilename,
      url: finalPath,
      takenAt: takenAt || new Date(),
      latitude: meta?.latitude || null,
      longitude: meta?.longitude || null,
      address: addressValue || null,
    })

    // [DB 저장 - Category Map]
    // 점수 0.3 이상만 필터링
    const validCategories = aiResults.filter((r) => r.score >= 0.3)

    if (validCategories.length > 0) {
      const mapData = validCategories.map((item) => ({
        PhotoId: newPhoto.id, // 방금 생성된 사진 ID
        CategoryId: item.category_id, // FastAPI가 준 카테고리 ID (1~8)
        confidence_score: item.score,
      }))

      await PhotoCategoryMap.bulkCreate(mapData)
    }

    return res.status(200).json({
      message: "업로드 및 분석 완료",
      photoId: newPhoto.id,
      results: aiResults,
      address: addressValue,
    })
  } catch (err) {
    console.error("업로드 중 에러 발생:", err)
    // 업로드 실패 시 찌꺼기 파일 삭제 (단, 파일 재사용 로직이 아니었을 때만)
    if (req.file && fs.existsSync(req.file.path)) {
      // finalPath와 file.path가 같다는 건 새 파일을 의미함
      // 만약 다르다면(재사용 중이라면) 지우면 안 됨!
      if (req.file.path === req.file.path) {
        // 변수가 아니라 로직 흐름상 임시파일인지 확인 필요
        // 안전하게 그냥 둡니다. OS나 크론탭이 청소하게 두거나, 로직을 더 정교하게 짜야함
        // 여기선 일단 패스
      }
    }
    return res.status(500).json({ error: "서버 내부 에러 발생" })
  }
})

// =========================================================
// 사진 목록 조회 API (GET /api/album)
// =========================================================
router.get("/", async (req, res) => {
  try {
    // 1. 로그인 확인
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: "로그인이 필요합니다." })
    }

    const currentUserId = req.user.id

    // 2. 내 사진만 DB 조회
    // include를 사용해 연결된 카테고리 정보 가져오기.
    const allPhotos = await Photo.findAll({
      where: { UserId: currentUserId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: PhotoCategoryMap,
          attributes: ["confidence_score"],
          include: [
            {
              model: Category,
              attributes: ["category"],
            },
          ],
        },
      ],
    })

    // 프론트엔드가 쓰기 편하게 데이터 가공
    const formattedPhotos = allPhotos.map((photo) => {
      // 카테고리 중 가장 점수가 높은 것 하나만 대표로 선정 (없으면 '기타')
      const maps = photo.PhotoCategoryMaps || []
      maps.sort((a, b) => b.confidence_score - a.confidence_score)
      const mainCategory = maps[0]?.Category?.category || "기타"

      // 날짜 포맷 (YYYY-MM-DD)
      const dateObj = new Date(photo.takenAt)
      const dateStr = dateObj.toISOString().split("T")[0]

      // 이미지 URL 처리 (서버 주소 붙여주기)
      const fullURL = `http://localhost:5000/${photo.url}`

      return {
        id: photo.id,
        url: fullURL,
        date: dateStr,
        location: photo.address || "위치 정보 없음",
        category: mainCategory || "기타",
        title: photo.id,
      }
    })

    res.json(formattedPhotos)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "사진 목록 로드 실패" })
  }
})

// 4. 라우터 객체 내보내기
module.exports = router
