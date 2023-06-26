const data = require("./d_data.json");

const express = require("express");
const app = express();
const PORT = 3001;

app.get("/", (req, res) => {
  res.send(data);
});

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}.`);
});

const addNotes = (note, title, allNotes, res) => {
  const noteElement = {
    id: allNotes.length === 0 ? 1 : allNotes[data.length - 1].id + 1,
    date: new Date().toString(),
    completed: true,
    note,
    title,
  };
  allNotes.push(noteElement);
  const newNotes = JSON.stringify(allNotes);
  res.send({
    newNotes,
    message: "For testing only",
    success: "Saved the note",
  });
};

app.post("/new_note", (req, res) => {
  const title = req.query.title;
  const note = req.query.note;

  if (!note) {
    throw new Error("Note is required");
  }
  if (!title) {
    throw new Error("Title is required");
  }

  addNotes(note, title, data, res);
});
