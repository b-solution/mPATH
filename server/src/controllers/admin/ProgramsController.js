const { db } = require("../../database/models");

// Function for retrieving all programs
const programs = async (req, res) => {
  try {
    // Fetch all users from the database
    const allPrograms = await db.Project.findAll();
    res.json(allPrograms);
    // console.log("All (Backend) Programs: ", allPrograms);
  } catch (error) {
    res.code(500)
    return({ error: "Error fetching programs" });
  }
};

// Function for retrieving all programs
const findProgram = async (req, res) => {
  try {
    programId = req.params.id;
    // console.log(req.params)
    // console.log(db)
    // Fetch all users from the database
    const program = await db.Project.findOne({ where: { id: programId } });
    res.json(program);
    // console.log("Program: ", program);
  } catch (error) {
    res.code(500)
    return({ error: "Error fetching program"+error });
  }
};

const createProgram = async (req, res) => {
  try {
    const { name, description } = req.body.program;
    const newProgram = await db.Project.create({ name, description });
    return({ program: newProgram });
    // console.log("Newly created program: ", newProgram);
  } catch (error) {
    res.code(500)
    return({ error: "Error creating program" });
  }
};

// Destructive actions below will be removed in production.  Production will have a soft delete and functionality 
// to restore soft-deleted programs.  These will have to be handled accordingly in the routes directory.
const deleteProgram = async (req, res) => {
  try {
    const programId = req.params.id;
    const deletedProgram = await db.Project.destroy({ where: { id: programId } });
    if (deletedProgram === 0) {
      return res.code(404).json({ error: "Program not found" });
    }
    return({ message: "Program deleted successfully" });
    // console.log("Deleted program ID: ", programId);
  } catch (error) {
    res.code(500)
    return({ error: "Error deleting program" });
  }
};

const deleteAllPrograms = async (req, res) => {
  try {
    const deletedPrograms = await  db.Project.destroy({ where: {} });
    return({ message: "All programs deleted successfully" });
    // console.log("Deleted programs count: ", deletedPrograms);
  } catch (error) {
    res.code(500)
    return({ error: "Error deleting programs" });
  }
};


module.exports = {
  programs,
  findProgram,
  createProgram,
  deleteProgram,
  deleteAllPrograms,
};