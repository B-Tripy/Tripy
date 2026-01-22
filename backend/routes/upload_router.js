const express = require("express")
const router = express.Router()
const fs = require("fs")
const upload = require("../middlewares/multer_config")
const albumService = require("../services/album_service")
const sharp = require("sharp")
const path = require("path")
// =========================================================
// 사진 업로드 (로그인 필수)
// =========================================================
router.post("/", upload.single("file"), async (req, res) => {
  try {
    // 1. 로그인 여부 확인 (Passport가 제공하는 함수)
    if (!req.isAuthenticated())
      return res.status(401).json({ error: "로그인이 필요합니다." })
    // 2. 파일 유효성 검사
    if (!req.file) {
      return res.status(400).json({ error: "파일 없음" })
    }
    // 원본 파일 경로
    const inputPath = req.file.path
    const outputPath = path.join(
      "uploads",
      Date.now() + "-" + req.file.originalname,
    )
    // sharp으로 리사이즈 및 압축
    await sharp(inputPath)
      .resize({ width: 1024 }) // 가로 1024px, 세로는 비율 유지
      .jpeg({ quality: 70 }) // JPEG 품질 70%
      .toFile(outputPath)
    // 원본 삭제 → 압축본만 남김
    fs.unlinkSync(inputPath)
    // req.file 정보를 압축본으로 교체
    req.file.path = outputPath
    req.file.filename = path.basename(outputPath)
    const result = await albumService.uploadProcess(req.user.id, req.file)
    res.status(200).json(result)
  } catch (err) {
    console.error(err)
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlink(req.file.path, () => {})
    }
    res.status(500).json({ error: "서버 내부 에러" })
  }
})
module.exports = router
