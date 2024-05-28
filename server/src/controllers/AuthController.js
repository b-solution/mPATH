const { db } = require("../database/models");
const jwt = require("jsonwebtoken");
const { cryptPassword, comparePassword } = require("../utils/helpers");

// Function for verifying JWT token
const verifyToken = async (req, res, next) => {
  const token = req.headers["x-token"];
  console.log("Token: ", token);
  if (token) {
    try {
      let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log("verify decoded", decoded.userId);
      let user = await db.User.findOne({ where: { id: decoded.userId } });
      console.log("Current user: ", user);
      if (user) {
        console.log("User if");
        res.code(200);
        req.userId = user.id;
        return { message: "Token is valid" };
      } else {
        res.code(401);
        return { error: "Invalid token" };
      }
    } catch (err) {
      res.code(401);
      return { error: err };
    }
  } else {
    res.code(401);
    return { error: "Token not provided" };
  }
};

// User registration function
const register = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    console.log(username);
    console.log(email);
    console.log(password);
    if (!username) {
      return res.code(400).json({ error: "Username field is required" });
    } else if (!email) {
      return res.code(400).json({ error: "Email field is required" });
    } else if (!password) {
      return res.code(400).json({ error: "Password field is required" });
    } else {
      const user_db = await db.User.findOne({ where: { email } });
      if (user_db) {
        return res.code(400).json({ error: "Email already exists" });
      } else {
        // Hash the password
        const hashedPassword = await cryptPassword(password);
        // Create a user record in the database
        const new_user = await db.User.create({
          username,
          email,
          password: hashedPassword,
        });
        // Generate JWT token
        const token = jwt.sign({ userId: new_user.id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        return { message: "User registered successfully", token };
      }
    }
  } catch (error) {
    console.log(error); // Log the caught error for debugging
    res.code(500);
    return { error: "Registration failed" };
  }
};
// User login function
const login = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    // console.log("login", req.body)

    if (!email) {
      res.code(400).json({ error: "Email field is required" });
    } else if (!password) {
      res.code(400).json({ error: "Password field is required" });
    } else {
      // Find the user by email
      const user_db = await db.User.findOne({ where: { email } });

      // console.log("user", user_db)

      if (!user_db) {
        res.code(404);
        return { error: "User not found" };
      } else {
        // Compare the provided password with the hashed password
        const passwordMatch = await comparePassword(password, user_db.encrypted_password);
        if (!passwordMatch) {
          res.code(401);
          return { error: "Invalid password" };
        } else {
          // Generate JWT token
          const token = jwt.sign({ userId: user_db.id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
          user_hash = {
            id: user_db.id,
            email: user_db.email,
            first_name: user_db.first_name,
            last_name: user_db.last_name,
            title: user_db.title,
            phone_number: user_db.phone_number,
            address: user_db.address,
            role: user_db.role,
            provider: user_db.provider,
            uid: null,
            login: null,
            status: "active",
            lat: "",
            lng: "",
            country_code: "",
            color: null,
            organization_id: 4,
            full_name: "admin@example.com admin@example.com",
            organization: "Test Org",
          };
          res.send({ message: "Login successful", token: token, current_user: user_hash });
        }
      }
    }
  } catch (error) {
    res.code(500);
    return { error: "Login failed", message: error };
  }
};

module.exports = {
  verifyToken,
  register,
  login,
};
