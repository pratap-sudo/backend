import express from 'express'
import cors from 'cors'
import multer from 'multer'
import dotenv from 'dotenv'
import {supabase} from './config/Supabase.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const upload = multer({ storage: multer.memoryStorage() })



// ✅ ROOT ROUTE
app.get('/', (req, res) => {
  res.send('Backend is running 🚀')
})

// ✅ UPLOAD ROUTE
app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file
  if (!file) {
    return res.status(400).json({ message: 'No file provided' })
  }

  const filePath = `uploads/${Date.now()}-${file.originalname}`

  const { error } = await supabase.storage
    .from('uploads')
    .upload(filePath, file.buffer, {
      contentType: file.mimetype
    })

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  const { data } = supabase.storage
    .from('uploads')
    .getPublicUrl(filePath)

  res.json({
    message: 'Upload successful',
    url: data.publicUrl
  })
})

app.listen(process.env.PORT, () => {
  console.log('Server running')
})
