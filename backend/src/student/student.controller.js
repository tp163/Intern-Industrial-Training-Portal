const supabase = require('../config/supabaseClient');


// GET ALL STUDENTS
exports.getStudents = async (req, res) => {

  const { data, error } = await supabase
    .from('student_profile')
    .select('*');

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
};


// CREATE STUDENT
exports.createStudent = async (req, res) => {

  const {
    user_id,
    degree_program,
    year,
    contact_no
  } = req.body;

  const { data, error } = await supabase
    .from('student_profile')
    .insert([
      {
        user_id,
        degree_program,
        year,
        contact_no
      }
    ]);

  if (error) {
    return res.status(500).json(error);
  }

  res.status(201).json({
    message: 'Student profile created',
    data
  });
};


// UPDATE STUDENT
exports.updateStudent = async (req, res) => {

  const { id } = req.params;

  const {
    degree_program,
    year,
    contact_no
  } = req.body;

  const { data, error } = await supabase
    .from('student_profile')
    .update({
      degree_program,
      year,
      contact_no
    })
    .eq('student_id', id);

  if (error) {
    return res.status(500).json(error);
  }

  res.json({
    message: 'Student updated',
    data
  });
};