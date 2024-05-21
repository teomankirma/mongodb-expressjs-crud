const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.get("/", (req, res) => {
  res.send("Hello World");
});

mongoose
  .connect(
    "mongodb+srv://teomankirma:v6dfZPzqqIe6VZRY@crud.dce1fia.mongodb.net/MyApp?retryWrites=true&w=majority&appName=CRUD"
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch(() => {
    console.log("Connection failed");
  });
