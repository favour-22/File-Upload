const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config();
const port = process.env.port||8000;

const app = express();


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
});

// POST request to upload image to cloudinary
app.post('/upload/:filepath', async (req, res) => {
  try {
    const filepath = req.params.filepath;

    // Check if filepath is provided
    if (!filepath) {
      return res.status(400).json({ error: 'No filepath provided' });
    }

    // Check if file exists
    if (!fs.existsSync(filepath)) {
      return res.status(400).json({ error: 'File not found' });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(filepath);

    // Get the image URL and public ID from Cloudinary response
    const imageUrl = result.secure_url;
    
    // Send the response with the image URL and public ID
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
