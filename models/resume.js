const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const projectSchema = new Schema({
  projectName: String,
  link: String,
  description: String,
  duration: String
});
const accountLinksSchema = new Schema({
  linkTitle: String,
  link: String,
});
const personalProjectsSchema = new Schema({
  name: String,
  description: String,
  link: String,
})
const skillsSchema = new Schema({
  skillName: String,
  description: String,
});
const educationalDetailsSchema = new Schema({
  instituteName: String,
  passingYear: Number,
  percentage: String,
  degreeName: String,

})
const resumesSchema = new Schema({
  name: String,
  contact: String,
  email: String,
  education: [educationalDetailsSchema],
  skills: [skillsSchema],
  personalProjects: [personalProjectsSchema],
  achievements: [String],
  hobbies: [String],
  accountLinks: [accountLinksSchema],
  work_projects: [projectSchema],
  author: {
    googleId: String,
    name: String,
  },
});

module.exports = mongoose.model("Resumes", resumesSchema);
