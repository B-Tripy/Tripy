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
    if (!req.isAuthenticated())
      return res.status(401).json({ error: "로그인이 필요합니다." })

    if (!req.file) {
      return res.status(400).json({ error: "파일 없음" })
    }

    const ext = path.extname(req.file.originalname).toLowerCase()
    const tempPath = req.file.path + ".tmp" // 임시 파일 경로

    let pipeline = sharp(req.file.path).withMetadata().resize({ width: 1024 })

    if (ext === ".jpg" || ext === ".jpeg") {
      pipeline = pipeline.jpeg({ quality: 80 })
    } else if (ext === ".png") {
      pipeline = pipeline.png({ compressionLevel: 8 })
    } else if (ext === ".webp") {
      pipeline = pipeline.webp({ quality: 80 })
    }

    // 압축본을 임시 파일에 저장
    await pipeline.toFile(tempPath)

    // 원본 삭제 후 임시 파일을 원본 이름으로 교체
    fs.unlinkSync(req.file.path)
    fs.renameSync(tempPath, req.file.path)

    // 이제 req.file.path는 압축된 파일을 가리킴
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
