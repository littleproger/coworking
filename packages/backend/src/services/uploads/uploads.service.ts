// src/services/uploads/uploads.service.js

import multer from 'multer';
import path from 'path';
import { BACKEND_URL } from '../../envVariables';

// Configure where the files should be stored and what they should be named
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../../public/uploads')); // Make sure this path exists and is writable
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

export default function (app:any) {
  // Set up the route for file uploads
  app.use('/uploads',
    // 'image' is the field name in the form where the file is sent
    upload.single('image'),
    function(req:any, res:any) {
      if (req.file) {
        // You can perform any custom logic here
        // For example, you might want to save the file info in a database

        // The file was successfully processed, send back the file info
        res.json({ fileUrl: `${BACKEND_URL}/uploads/${req.file.filename}` });
      } else {
        // No file was uploaded, send an error
        res.status(400).send('No file uploaded.');
      }
    },
  );
  

  // ... any other configuration for your service ...
}
