const supabase = require("../config/supabase");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// REGISTER
exports.register = async (req, res) => {

  try {

    const { name, email, password, role } = req.body;

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // INSERT USER
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name,
          email,
          password: hashedPassword,
          role
        }
      ]);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully"
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};



// LOGIN
exports.login = async (req, res) => {

  try {

    const { email, password } = req.body;

    // FIND USER
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    // CHECK PASSWORD
    const validPassword = await bcrypt.compare(
      password,
      data.password
    );

    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid password"
      });
    }

    // CREATE TOKEN
    const token = jwt.sign(
      {
        user_id: data.user_id,
        role: data.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        user_id: data.user_id,
        name: data.name,
        email: data.email,
        role: data.role
      }
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};