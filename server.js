require("dotenv").config();
const express = require("express");
const fs = require("fs");
const { MongoClient, ServerApiVersion } = require("mongodb");
const data = JSON.parse(fs.readFileSync("./db/d_users.json", "utf-8"));
const cors = require("cors");
const app = express();
const PORT = 3001;

console.log(data);

const { MDB_USERNAME, MDB_PASSWORD } = process.env;

// Require mongoose package
const mongoose = require("mongoose");

// Set "strictQuery" to false to filter by props that may not
// be in the schema
mongoose.set("strictQuery", false);
const uri = `mongodb+srv://${MDB_USERNAME}:${MDB_PASSWORD}@cluster0.c8olaue.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

// database and collection code goes here
const db = client.db("Flashcard");
const coll = db.collection("Users");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: new Date().toString(),
  },
});
const User = mongoose.model("users", UserSchema);
User.createIndexes();

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
mongoose.connect(uri).then(() => console.log("db connected"));

const adminUser = new User({
  email: "admin@email.com",
  password: "password",
});
adminUser.save().then(() => console.log("meow"));

// main().catch((err) => console.log(err));
// async function main() {
//
//   console.log("Connection status:", mongoose.connection.readyState);
// }

// import data to MongoDB
const importData = async () => {
  try {
    await User.create(data);
    console.log("data successfully imported");
    // to exit the process
    process.exit();
  } catch (error) {
    console.log("error", error);
  }
};

importData();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("App is working");
});

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}.`);
  console.log(mongoose.connection.readyState);
});

app.post("/new_user", (req, res) => {
  const email = req.query.emaill;
  const password = req.query.password;

  // if (!email) {
  //   throw new Error("Email is required");
  // }
  // if (!password) {
  //   throw new Error("Password is required");
  // }
  res.send("User Created");
});

// const addNotes = (note, title, allNotes) => {
//   const noteElement = {
//     id: allNotes.length === 0 ? 1 : allNotes[data.length - 1].id + 1,
//     date: new Date().toString(),
//     completed: true,
//     note,
//     title,
//   };
//   allNotes.push(noteElement);
//   const newNotes = JSON.stringify(allNotes);
//   return newNotes;
// };

// const sendTestResponse = (allNotes, res) => {
//   res.send({
//     allNotes,
//     message: "For testing only",
//     success: "Saved the note",
//   });
// };

// app.post("/new_note", (req, res) => {
//   const title = req.query.title;
//   const note = req.query.note;

//   if (!note) {
//     throw new Error("Note is required");
//   }
//   if (!title) {
//     throw new Error("Title is required");
//   }

//   const newNotes = addNotes(note, title, data);
//   sendTestResponse(newNotes, res);
// });
