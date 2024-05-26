const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://sohailkhan9606801:JUurltXOosOWXIMW@cluster0.cytgznn.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Define a schema
const formDataSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  contact: String,
  gender: String,
  selectedOption: String,
  subjects: String,
  resumePath: String,
  url: String,
  about: String
});

// Create a model
const FormData = mongoose.model('FormData', formDataSchema);

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors())
// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'resume'); // Save files to 'resume' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Use a unique filename
  }
});
const upload = multer({ storage: storage });

// Route to handle form submission
app.post('/submit', upload.single('resume'), (req, res) => {
  const {
    firstName,
    lastName,
    email,
    contact,
    gender,
    selectedOption,
    subjects,
    url,
    about
  } = req.body;

  const newFormData = new FormData({
    firstName,
    lastName,
    email,
    contact,
    gender,
    selectedOption,
    subjects,
    resumePath: req.file ? path.join('resume', req.file.filename) : '',
    url,
    about
  });

  newFormData.save()
    .then(() => res.status(200).send('Form data received and saved to MongoDB.'))
    .catch(err => res.status(500).send('Error saving data to MongoDB'));

  console.log('First Name:', firstName);
  console.log('Last Name:', lastName);
  console.log('Email:', email);
  console.log('Contact:', contact);
  console.log('Gender:', gender);
  console.log('Selected Option:', selectedOption);
  console.log('Subjects:', subjects);
  console.log('Resume Path:', req.file ? path.join('resume', req.file.filename) : ''); // Log resume file path
  console.log('URL:', url);
  console.log('About:', about);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
