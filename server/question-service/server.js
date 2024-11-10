const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const Seed = require("./seedQuestions");
const questionsRoutes = require("./routes/questionRoute");
const testingRoutes = require("./routes/testingRoute");

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const port = process.env.PORT || 3002;

mongoose
    .connect(process.env.DB_CLOUD_URI)
    .then(() => {
        console.log("Question service connected to MongoDB");
        app.listen(port, () => {
            console.log("Question service is listening on port " + port);
        });
    })
    .catch((error) => {
        console.error("Question service failed to connect to DB");
        console.log(error);
    });


if (process.env.DB_CLOUD_URI) {
    Seed.seedQuestions();
}

//routes
app.use("/questions", questionsRoutes);

if (process.env.ENV === "TEST") {
    app.use("/test", testingRoutes);
}
