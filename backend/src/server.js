const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./auth/auth.routes');
const studentRoutes = require('./student/student.routes');
const internshipRoutes = require('./internship/internship.routes');

const app = express();

app.use(cors());
app.use(express.json());


app.use('/auth', authRoutes);
app.use('/students', studentRoutes);
app.use('/internships', internshipRoutes);

app.get('/', (req, res) => {
  res.send('Server Running');
});




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});