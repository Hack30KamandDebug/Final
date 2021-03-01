var express = require("express"),
    app = express(),
    mongoose = require('mongoose'),
    bodyparser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportlocalMongoose = require("passport-local-mongoose"),
    request = require("request");


app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.set("view engine", "ejs");






// Register form

app.get("/Signup", function(req, res) {
    res.render("Signup");
})
app.get("/", function(req, res) {
    res.render("Signup", { currentUser: req.user });
})

// handle Sign Up logic

app.post("/Signup", function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var rollno = req.body.rollno;
    var emergencyStatus = req.body.emergencyStatus;


    let student = {
        name: name,
        email: email,
        password: password,
        rollno: rollno,
        emergencyStatus: emergencyStatus
    };
    const options = {
        url: `http://localhost:8000/SignUpStudent/`,
        method: 'POST',
        json: true,
        headers: {
            'Content-Type': 'application/json'
        },
        body: student
    };
    request(options, async function(err, res, body) {
        if (body.statusCode === 401) {
            // rollno already register
            res.render("Signup");
        }
        if (body.statusCode === 200) {
            //student added
            res.render("Login");
        }
    });
})


// handle Sign Up logic

app.post("/add_Student_To_Waiting", function(req, res) {
    var rollno = req.body.rollno;
    var emergencyStatus = req.body.emergencyStatus;


    let student = {
        rollno: rollno,
        emergencyStatus: emergencyStatus
    };
    const options = {
        url: `http://localhost:8000/StudentAddedInWaiting/`,
        method: 'POST',
        json: true,
        headers: {
            'Content-Type': 'application/json'
        },
        body: student
    };
    request(options, async function(err, res, body) {
        if (body.statusCode === 401) {
            // rollno already register
        }
        if (body.statusCode === 200) {
            //student added
        }
    });
})


// show login form 
app.get("/Login", function(req, res) {
    res.render("Login");
})

// handling login logic

app.post('/Login', (req, res) => {
    const { email, password } = req.body;

    const user_1 = Users_1.find(u => {
        return u.email === email && password === u.password
    });

    if (user_1) {
        req.authenticate();
        res.render("Student_login_page_view_database");
    } else {
        res.render('Login_Student', {
            message: 'Invalid username or password',
            messageClass: 'alert-danger'
        });
    }
});




// logout route 
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

// login check

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/")
}

app.listen(1099, function(req, res) {
    console.log("Client Started !!! ");
})