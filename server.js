const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "temp/" });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append(
      "file",
      fs.createReadStream(req.file.path)
    );

    const response = await axios.post(
      "https://yourdomain.com/upload.php",
      formData,
      { headers: formData.getHeaders() }
    );

    fs.unlinkSync(req.file.path); // delete temp file

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
});

app.listen(5000, () => console.log("Server running"));
