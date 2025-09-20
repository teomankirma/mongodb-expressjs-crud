require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const signupRoute = require("./routes/signup.route");
const signinRoute = require("./routes/signin.route");
const dashboardRoute = require("./routes/dashboard.route");
const changePasswordRoute = require("./routes/change-password.route");
const newReservationRoute = require("./routes/new-reservation.route");
const deleteReservationRoute = require("./routes/delete-reservation.route");
const ticketTypeRoute = require("./routes/ticket-type.route");
const savedCreditCardsRoute = require("./routes/saved-credit-cards.route");

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
app.use("/new-reservation", newReservationRoute);
app.use("/delete-reservation", deleteReservationRoute);
app.use("/ticket-types", ticketTypeRoute);
app.use("/saved-credit-cards", savedCreditCardsRoute);

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI environment variable.");
  process.exit(1);
}

app.get("/", (req, res) => {
  // Send the "index.html" file
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch(() => {
    console.log("Connection failed");
  });
