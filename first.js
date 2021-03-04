var express = require("express"),
    app = express(),
    mongoose = require('mongoose'),
    bodyparser = require("body-parser"),
    request = require("request");

const cookieParser = require('cookie-parser');
const session = require("express-session");
const crypto = require('crypto');


app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.set("view engine", "ejs");


app.use(require("express-session")({
    secret: "Something is usual but in secret",
    resave: false,
    saveUninitialized: false
}));


const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

app.get("/", function(req, res) {
    res.render("home", { currentUser: req.user });
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

    const hashedPassword = getHashedPassword(password);
    let student = {
        name: name,
        email: email,
        password: hashedPassword,
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


// show login form 
app.get("/addRoom", function(req, res) {

    if (!req.session.user_id) {
        res.redirect("loginAdmin");
    }
    if (req.session.user_id) {
        res.render("addRoom");
    }
})

// handling login logic

app.post("/addRoom", (req, res) => {
    if (!req.session.user_id) {
        res.redirect("loginAdmin");
    }
    if (req.session.user_id) {
        let student = {
            "hostel": req.body.hostel,
            "number": req.body.roomNumber,
        };
        const options = {
            url: `https://desolate-coast-16520.herokuapp.com/addRoom/`,
            method: 'POST',
            json: true,
            headers: {
                'Content-Type': 'application/json'
            },
            body: student
        };
        request(options, async function(err, ress, body) {
            if (body.statusCode === 402) {
                //Authentication Failed
                res.render('AddRoom', {
                    message: 'already exist',
                    messageClass: 'alert-danger'
                });
            }
            if (body.statusCode === 200) {
                res.render("adminMainPage");
            }
        });
    }
});



app.get("/goaddRoom", function(req, res) {

    if (!req.session.user_id) {
        res.redirect("loginAdmin");
    }
    if (req.session.user_id) {
        res.render("addRoom");
    }
})

// handling login logic

app.post("/goaddRoom", (req, res) => {
    console.log("ewrgty");
    if (!req.session.user_id) {
        res.redirect("loginAdmin");
    }
    if (req.session.user_id) {
        res.render("addRoom");
    }
});






// show login form 
app.get("/testResult", function(req, res) {

    if (!req.session.user_id) {
        res.redirect("loginAdmin");
    }
    if (req.session.user_id) {
        res.render("testResult");
    }
})

// handling login logic

app.post("/testResult", (req, res) => {
    if (!req.session.user_id) {
        res.redirect("loginAdmin");
    }
    if (req.session.user_id) {
        console.log("Rajan");
        let student = {
            "rollno": req.body.rollno,
            "status": req.body.status,
        };
        const options = {
            url: `https://desolate-coast-16520.herokuapp.com/testResult/`,
            method: 'POST',
            json: true,
            headers: {
                'Content-Type': 'application/json'
            },
            body: student
        };
        request(options, async function(err, ress, body) {
            if (body.statusCode === 200) {
                res.render("adminMainPage");
            }
        });
    }
});





app.get("/gotestResult", function(req, res) {

    if (!req.session.user_id) {
        res.redirect("loginAdmin");
    }
    if (req.session.user_id) {
        res.render("testResult");
    }
})

// handling login logic

app.post("/gotestResult", (req, res) => {
    console.log("ewrgty");
    if (!req.session.user_id) {
        res.redirect("loginAdmin");
    }
    if (req.session.user_id) {
        res.render("testResult");
    }
});






app.get("/studentMainPage", function(req, res) {
    if (!req.session.user_id) {
        res.redirect("Login");
    }
    if (req.session.user_id) {
        res.render("studentMainPage");
    }

})


app.get("/adminMainPage", function(req, res) {
    if (!req.session.user_id) {
        res.redirect("loginAdmin");
    }
    if (req.session.user_id) {
        res.render("adminMainPage");
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
    const hashedPassword = getHashedPassword(password);
    
    let student = {
        email: email,
        password: hashedPassword
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
            req.session.user_id = email;
            res.render("studentMainPage");
        }

    });

});

// Student Request

// show login form 
app.get("/Send_Requst", function(req, res) {
    if (!req.session.user_id) {
        res.redirect("Login");
    }
    if (req.session.user_id) {
        res.render("studentMainPage");
    }
})

// handling login logic

app.post("/Send_Requst", (req, res) => {
    if (!req.session.user_id) {
        res.redirect("Login");
    }
    if (req.session.user_id) {
        var rollno = req.body.rollno;

        let student = {
            rollno: rollno
        };
        const options = {
            url: `https://desolate-coast-16520.herokuapp.com/StudentRequestToAdmin/`,
            method: 'POST',
            json: true,
            headers: {
                'Content-Type': 'application/json'
            },
            body: student
        };
        request(options, async function(err, ress, body) {
            console.log(body.statusCode);
            res.render("studentMainPage");
        });
    }

});





// Admin Login

// show login form 
app.get("/loginAdmin", function(req, res) {
    res.render("loginAdmin");
})

// handling login logic

app.post("/loginAdmin", (req, res) => {

    var email = req.body.email;
    var password = req.body.password;
    const hashedPassword = getHashedPassword(password);

    let student = {
        email: email,
        password: hashedPassword
    };
    const options = {
        url: `https://desolate-coast-16520.herokuapp.com/loginAdmin/`,
        method: 'POST',
        json: true,
        headers: {
            'Content-Type': 'application/json'
        },
        body: student
    };
    request(options, async function(err, ress, body) {

        console.log(body);
        console.log(body.statusCode);

        if (body.statusCode === 402) {
            // email is not valid

            res.render('loginAdmin', {
                message: 'Email not valid',
                messageClass: 'alert-danger'
            });
        }
        if (body.statusCode === 403) {
            //Authentication Failed
            res.render('loginAdmin', {
                message: 'Authentication Failed',
                messageClass: 'alert-danger'
            });
        }
        if (body.statusCode === 200) {
            req.session.user_id = email;
            res.render("adminMainPage");
        }

    });

});




// show login form 
app.get("/sstatsRoom", function(req, res) {
    if (!req.session.user_id) {
        res.redirect("Login");
    }
    if (req.session.user_id) {
        rres.render("statsRoom");
    }
})

// handling login logic

app.post("/sstatsRoom", (req, res) => {
    if (!req.session.user_id) {
        res.redirect("Login");
    }
    if (req.session.user_id) {

        var url = "https://desolate-coast-16520.herokuapp.com/statusRoom";
        console.log(url);
        request(url, function(error, response, body1) {
            var mv = JSON.parse(body1);
            console.log(mv);
            res.render("statsRoom", { mvd: mv });
        });

    }

});

// approve


// show login form 
app.get("/statsRoom", function(req, res) {
    if (!req.session.user_id) {
        res.redirect("loginAdmin");
    }
    if (req.session.user_id) {
        rres.render("statsRoom");
    }
})

// handling login logic

app.post("/statsRoom", (req, res) => {
    if (!req.session.user_id) {
        res.redirect("loginAdmin");
    }
    if (req.session.user_id) {

        var url = "https://desolate-coast-16520.herokuapp.com/statusRoom";
        console.log(url);
        request(url, function(error, response, body1) {
            var mv = JSON.parse(body1);
            console.log(mv);
            res.render("statsRoom", { mvd: mv });
        });

    }

});













// show login form 
app.get("/approve", function(req, res) {
    if (!req.session.user_id) {
        res.redirect("loginAdmin");
    }
    if (req.session.user_id) {
        rres.render("pending");
    }
})

// handling login logic

app.post("/approve", (req, res) => {
    if (!req.session.user_id) {
        res.redirect("loginAdmin");
    }
    if (req.session.user_id) {
        var rollno = req.body.rollno;

        let student = {
            rollno: rollno
        };
        const options = {
            url: `https://desolate-coast-16520.herokuapp.com/StudentAddedInWaiting/`,
            method: 'POST',
            json: true,
            headers: {
                'Content-Type': 'application/json'
            },
            body: student
        };
        request(options, async function(err, ress, body) {

            console.log(body);
            if (body.statusCode === 200) {


                var url = "https://desolate-coast-16520.herokuapp.com/getListOfWaitingRequestStudent";
                console.log(url);
                request(url, function(error, response, body1) {
                    var mv = JSON.parse(body1);
                    console.log(mv);
                    res.render("pending", { mvd: mv });
                });

            }

        });
    }

});



// Queue of students
app.get("/aList", (req, res) => {
    if (!req.session.user_id) {
        res.redirect("loginAdmin");
    }
    if (req.session.user_id) {
        res.render("List");
    }
})


app.post("/aList", (req, res) => {
    if (!req.session.user_id) {
        res.redirect("loginAdmin");
    }
    if (req.session.user_id) {
        var url = "https://desolate-coast-16520.herokuapp.com/getListOfWaitingStudent";
        console.log(url);
        request(url, function(error, response, body) {
            var mv = JSON.parse(body);
            console.log(mv);
            res.render("List", { mvd: mv });
        });
    }
});









// Queue of students
app.get("/List", (req, res) => {
    if (!req.session.user_id) {
        res.redirect("Login");
    }
    if (req.session.user_id) {
        res.render("List");
    }
})


app.post("/List", (req, res) => {
    if (!req.session.user_id) {
        res.redirect("Login");
    }
    if (req.session.user_id) {
        var url = "https://desolate-coast-16520.herokuapp.com/getListOfWaitingStudent";
        console.log(url);
        request(url, function(error, response, body) {
            var mv = JSON.parse(body);
            console.log(mv);
            res.render("List", { mvd: mv });
        });
    }
});



// pending


app.get("/pending", (req, res) => {
    if (!req.session.user_id) {
        res.redirect("loginAdmin");
    }
    if (req.session.user_id) {
        res.render("pending");
    }
})


app.post("/pending", (req, res) => {
    if (!req.session.user_id) {
        res.redirect("loginAdmin");
    }
    if (req.session.user_id) {
        var url = "https://desolate-coast-16520.herokuapp.com/getListOfWaitingRequestStudent";
        console.log(url);
        request(url, function(error, response, body) {
            var mv = JSON.parse(body);
            console.log(mv);
            res.render("pending", { mvd: mv });
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

app.listen(2298, function(req, res) {
    console.log("Client Started !!! ");
})
