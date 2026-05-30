const express = require('express');
const router = express.Router();

const {
  createInternship,
  getInternships
} = require('./internship.controller');

router.post('/', createInternship);
router.get('/', getInternships);

module.exports = router;