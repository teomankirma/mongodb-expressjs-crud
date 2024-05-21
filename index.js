const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const signupRoute = require("./routes/signup.route");
const signinRoute = require("./routes/signin.route");
const dashboardRoute = require("./routes/dashboard.route");
const changePasswordRoute = require("./routes/change-password.route");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/signup", signupRoute);
app.use("/signin", signinRoute);
app.use("/dashboard", dashboardRoute);
app.use("/change-password", changePasswordRoute);

app.get("/", (req, res) => {
  // Send the "index.html" file
  res.sendFile(path.join(__dirname, "public", "index.html"));
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
