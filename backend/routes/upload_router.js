const express = require("express");
const router = express.Router();
const fs = require("fs");
const upload = require("../middlewares/multer_config");
const albumService = require("../services/album_service");
const sharp = require("sharp");
const path = require("path");

// =========================================================
// 사진 업로드 (로그인 필수)
// =========================================================
router.post("/", upload.single("file"), async (req, res) => {
  try {
    // 1. 로그인 여부 확인 (Passport가 제공하는 함수)
    if (!req.isAuthenticated())
      return res.status(401).json({ error: "로그인이 필요합니다." });

    // 2. 파일 유효성 검사
    if (!req.file) {
      return res.status(400).json({ error: "파일 없음" });
    }
    // 원본 파일 경로
    const inputPath = req.file.path;
    // 리사이즈된 파일 저장 경로
    const outputPath = path.join("uploads", "r-" + req.file.originalname);

    // sharp으로 리사이즈 (예: 가로 1024px, 세로는 비율 유지)
    await sharp(inputPath)
      .resize({ width: 1024 })
      .jpeg({ quality: 70 })
      .toFile(outputPath);
    console.log("업로드 및 리사이즈 성공");

    // 원본 삭제 (원본을 남기고 싶으면 이 줄 제거)
    fs.unlinkSync(inputPath);

    // const result = await albumService.uploadProcess(req.user.id, req.file);

    // res.status(200).json(result);
  } catch (err) {
    console.error(err);
    // 에러 발생 시 임시 파일 정리
    if (req.file && require("fs").existsSync(req.file.path)) {
      fs.unlink(req.file.path, () => {});
    }
    res.status(500).json({ error: "서버 내부 에러" });
  }
});

module.exports = router;
