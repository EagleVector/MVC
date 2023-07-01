const User = require("../models/user");

async function handleGetAllUsers(req, res) {
  const allDbUsers = await User.find({});
  return res.json(allDbUsers);
}

async function handleGetUserById(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error : "user not found" });
  }
  return res.json(user);
}

async function handleUpdateUserById(req, res) {
  await User.findByIdAndUpdate(req.params.id, { lastName: "Updated" });
  return res.json({ status : "Successfull Update" });
}

async function handleDeleteUserById(req, res) {
  await User.findByIdAndDelete(req.params.id);
  return res.json({ status : "Deleted"});
}

async function handleCreateNewUser(req, res) {
  const body = req.body;
  if((!body) || 
  (!body.first_name) || 
  (!body.last_name) || 
  (!body.email) || 
  (!body.job_title) || 
  (!body.gender)) {
    return res.status(400).json({ error : "Please enter the req fields" });
  }
  const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    job_title: body.job_title
  });

  console.log("Result: ", result);

  return res.status(201).json({ msg : "successfully inserted" , id : result._id});
}

module.exports = {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateNewUser
}