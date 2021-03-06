const mongoose = require("mongoose");
const express = require("express");

const cors = require("cors");
const passport = require("passport");
const dotenv = require("dotenv");
const session = require("express-session");

const user = require("./routes/user");
const memo = require("./routes/memo");

dotenv.config();


////////////////////  MongoDB Connection ////////////////////////

// using mongodb://mongodb:27017/mymemo instead of mongodb://localhost:27017/mymemo
// coz mongodb was used as a link in docker-compose, so everything is set up for us

mongoose
    .connect("mongodb://mongodb:27017/mymemo", {  // change localhost to mongodb:27017
        //process.env.DATABASE
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("MongoDB connection success");
    })
    .catch((err) => {
        console.log("Error in DB Connection: " + err);
    });

//////////////////////////////////////////////////////////////////

const app = express();

app.use(express.static("uploads"));

////////////////// CORS middleware   //////////////////////////
//if (process.env.NODE_ENV === "development") {
app.use(
    cors(/* {
            origin: `${process.env.FRONT_URL}`,
            credentials: true, //access-control-allow-credentials:true
            optionSuccessStatus: 200,
        } */)
); // 'http://localhost:3000'
// }
//////////////////////////////////////////////////////////////

////////////////// middleware   //////////////////////////
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // http://localhost:3000
    // update to match the domain you will make the request from
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
////////////////////////////////////////////////////////////////

//////////// Bodyparser middleware //////////////
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
/////////////////////////////////////////////////

//////// EXPRESS-SESSION middleware ////////////
app.use(
    session({
        secret: "secret", // can be anything
        resave: true,
        saveUninitialized: true,
    })
);
///////////////////////////////////////////////

/////////// PASSPORT middleware   /////////////////
require("./config/passport")(passport);

app.use(passport.initialize());
app.use(passport.session());
// Important where you put this, so put after express session
////////////////////////////////////////////////////

app.use("/users", user);
app.use("/newMemo", memo);

//////////////////// Server start //////////////////
const PORT = 8000; // process.env.PORT ||
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});
/////////////////////////////////////////////////////
