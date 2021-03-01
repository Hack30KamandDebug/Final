var express = require("express"),
    app = express(),
    mongoose = require('mongoose'),
    bodyparser = require("body-parser"),
    request = require("request");

const session = require("express-session");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.set("view engine", "ejs");


app.use(require("express-session")({
    secret: "Something is usual but in secret",
    resave: false,
    saveUninitialized: false
}));


app.get("/", function(req, res) {
    res.render("Signup", { currentUser: req.user });
})



// Register form

app.get("/Signup", function(req, res) {
    res.render("Signup");
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
        url: `https://desolate-coast-16520.herokuapp.com/SignUpStudent/`,
        method: 'POST',
        json: true,
        headers: {
            'Content-Type': 'application/json'
        },
        body: student
    };
    request(options, async function(err, ress, body) {
        console.log(body);
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
    if (!req.session.user_id) {
        res.redirect("Login");
    }
    if (req.session.user_id) {
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
    }

})



// show login form 
app.get("/Login", function(req, res) {
    res.render("Login");
})

// handling login logic

app.post("/Login", (req, res) => {

    var email = req.body.email;
    var password = req.body.password;


    let student = {
        email: email,
        password: password
    };
    const options = {
        url: `https://desolate-coast-16520.herokuapp.com/loginStudent/`,
        method: 'POST',
        json: true,
        headers: {
            'Content-Type': 'application/json'
        },
        body: student
    };
    request(options, async function(err, ress, body) {
        
        console.log(body);
        if (body.statusCode === 402) {
            // email is not valid

            res.render('Login', {
                message: 'Email not valid',
                messageClass: 'alert-danger'
            });
        }
        if (body.statusCode === 403) {
            //Authentication Failed
            res.render('Login', {
                message: 'Authentication Failed',
                messageClass: 'alert-danger'
            });
        }
        if (body.statusCode === 200) {
            req.session.user_id = user._id;
            res.render("Student/mainpage");
        }

    });

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
