const supabase = require('../config/supabaseClient');


// CREATE INTERNSHIP
exports.createInternship = async (req, res) => {

  const {
    student_id,
    company_name,
    start_date,
    end_date,
    status
  } = req.body;

  const { data, error } = await supabase
    .from('internship')
    .insert([
      {
        student_id,
        company_name,
        start_date,
        end_date,
        status
      }
    ]);

  if (error) {
    return res.status(500).json(error);
  }

  res.status(201).json({
    message: 'Internship added',
    data
  });
};


// GET INTERNSHIPS
exports.getInternships = async (req, res) => {

  const { data, error } = await supabase
    .from('internship')
    .select('*');

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
};