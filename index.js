const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");

const app = express();
const PORT = 8000;

// Connection
mongoose.connect('mongodb://127.0.0.1:27017/test-db')
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("Mongo Error", err));

// Schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true 
  },
  gender: {
    type: String
  },
  job_title: {
    type: String
  }
}, { timestamps: true });

const User = mongoose.model('user', userSchema);

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  fs.appendFile("log.txt", 
  `\n${Date.now()} : ${req.ip} : ${req.method} : ${req.path}`, (err, data) => {
    next();
  });
});

app.get("/users", async (req, res) => {
  const allDbUsers = await User.find({});
  const html = `
    <ul>
      ${allDbUsers.map((user) => `<li>${user.firstName} - ${user.email}</li>`).join("")}
    </ul>
  `;
  res.send(html);
});

app.get('/api/users', async (req, res) => {
  const allDbUsers = await User.find({});
  return res.json(allDbUsers);
});

app.post('/api/users', async (req, res) => {
  const body = req.body;
  if((!body) || 
  (!body.first_name) || 
  (!body.last_name) || 
  (!body.email) || 
  (!body.job_title) || 
  (!body.gender)) {
    res.status(400).json({ error : "Please enter the req fields"});
  }
  const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    job_title: body.job_title
  });

  console.log("Result: ", result);

  return res.status(201).json({ msg : "successfully inserted" });
});

app
  .route('/api/users/:id')
  .get(async (req, res) => {
    const user = await User.findById(req.params.id);
    return res.json(user);
  })
  .patch(async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { lastName: "Updated" });
    return res.json({ status : "Success" });
  })
  .delete(async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ status : "Deleted"});
  });

app.listen(PORT, console.log(`Server Started at PORT: ${PORT}`));