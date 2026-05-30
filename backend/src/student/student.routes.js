const express = require('express');
const router = express.Router();

const {
  getStudents,
  createStudent,
  updateStudent
} = require('./student.controller');

router.get('/', getStudents);
router.post('/', createStudent);
router.put('/:id', updateStudent);

module.exports = router;