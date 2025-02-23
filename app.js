const express = require('express');
const app = express();
const port = 3000;
const { MongoClient, Collection, ObjectId } = require('mongodb'); // Note that Collection is only used with JSDocs. It is NOT required.
const passport = require('passport');
const session = require('express-session')
const GitHubStrategy = require('passport-github2').Strategy;

const mongoUser = "nnewt";
const mongoPass = "pass";
const mongoHost = "webware.mteac.mongodb.net";
const mongoDBName = "CS4241";
const mongoDBCollection = "a3v2assignments";
const githubClientID = "Ov23liPM4E4fUwGnaxHN";
const githubClientSecret = "3512a617885b7e7b5b56d38b6aa23a60a7cfd75f";
const expressSessionSecret = "secret";

app.use(session({
    secret: expressSessionSecret,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// region DB Connection
// Connect to the DB
// These JSDocs make it more convenient to work with the collections since the IDE knows that functions each Collection can use.
/**
 * @type {Collection}
 */
let DBCollection = null;

/**
 * Connects to the MongoDB database
 */
async function connectToDB() {
    const uri = `mongodb+srv://${mongoUser}:${mongoPass}@${mongoHost}/?retryWrites=true&w=majority&appName=Webware`;
    const client = new MongoClient(uri);

    // Note that this connect call is not intended for use in production
    await client.connect();
    const db = client.db(mongoDBName);
    DBCollection = db.collection(mongoDBCollection);
}

connectToDB();

// Middleware to check connection to DB
app.use((req, res, next) => {
    if (DBCollection !== null) {
        next();
    } else {
        // Could not connect to the DB. Send an error.
        res.sendStatus(503);
    }
});
// endregion

// region User Serialization
/**
 * Serialize the user.
 * Every time the user logs in, it stores the data in `done`'s `id` parameter (the one after null) in `req.user`.
 */
passport.serializeUser(function (user, done) {
    // I use user._id || user.id to allow for more flexibility of this with MongoDB.
    // If using Passport Local, you might want to use the MongoDB id object as the primary key.
    // However, we are using GitHub, so what we want is user.id
    // Feel free to remove the user._id || part of it, but the `user.id` part is necessary.
    done(null, { username: user.username, id: user._id || user.id });
});

/**
 * Deserialize the user.
 * Every time the user's session is ended, it removes `obj` from the user's req.
 */
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});
// endregion
// region Strategy

/**
 * Create the GitHub Strategy.
 *
 * Note that the callback URL is OPTIONAL. If it is not provided, it will default to the one configured
 * in GitHub. See the README for information on how to set that up.
 *
 * If you do decide to include the callbackURL, it must be EXACT. Any missmatch from the GitHub one and it will
 * fail.
 */
passport.use(new GitHubStrategy({
        clientID: githubClientID,
        clientSecret: githubClientSecret,
        // callbackURL: "http://localhost:3000/auth/github/callback"
    },
    async function (accessToken, refreshToken, profile, done) {
        // This code will run when the user is successfully logged in with GitHub.
        process.nextTick(function () {
            return done(null, profile);
        });
    }
));
// endregion
// region GitHub Routes
// This is the callback to put in GitHub. If the authentication fails, it will redirect them to '/login'.
app.get('/auth/github/callback',
    passport.authenticate('github', { session: true, failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

// The route to redirect the user to when you want to actually have them log in with GitHub.
// It is what happens when you click on the "Log in with GitHub" button.
// Note that the scope is 'user:email'. You can read more about possible scopes here:
// https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps
// You should not need anything other than the 'user:email' if just authenticating with GitHub.
// <a href="/auth/github">Login with GitHub</a>
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
// endregion

function ensureAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}

// region login and root routes
app.get('/', ensureAuth, (req, res) => {
    // User is logged in
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/login", (req, res) => {
    // User is logged in
    if (req.user) {
        res.redirect("/");
    } else {
        // User is not logged in
        res.sendFile(__dirname + "/public/login.html");
    }
});
// endregion

// Have the user go to /logout and it will log them out.
// i.e. <a href="/logout">Logout</a>
app.get("/logout", (req, res) => {
    req.logout(() => { });
    res.redirect('/');
});

app.use(express.static('public'));

app.get("/load", ensureAuth, async (req, res) => {
    // Note that here I am using the username as the key.
    const userdata = await DBCollection.find({ username: req.user.username }).toArray();
    // What I am doing here is attaching the username to the front of the array
    // and then putting the rest of the data after the username
    res.json([{ username: req.user.username }, ...userdata]);
});

app.get("/assignments", ensureAuth, async (req, res) => {
    const userdata = await DBCollection.find({ username: req.user.username }).toArray();
    res.json(userdata);
});

// Form submission route
app.post("/submit", ensureAuth, async (req, res) => {
    const { assignmentname, classname, deadline } = req.body;

    let priority = function() {
        let today = new Date();
        let due = new Date(deadline);
        let diff = due - today;
        let days = diff / (1000 * 60 * 60 * 24);
        if (days < 1) {
            return "High";
        } else if (days < 3) {
            return "Medium";
        } else {
            return "Low";
        }
    }

    const newAssignment = {
        username: req.user.username,
        assignmentname: assignmentname,
        classname: classname,
        deadline: deadline,
        priority: priority()
    }

    DBCollection.insertOne(newAssignment).then(r => {
        res.json(newAssignment);
    }).catch(e => {
        res.sendStatus(500);
    });

});

// Delete route
app.delete("/delete/:id", ensureAuth, async (req, res) => {
    const id = req.params.id;
    await DBCollection.deleteOne({ _id: new ObjectId(id) }).then(r => {
        res.sendStatus(200);
    }).catch(e => {
        res.sendStatus(500);
    });
});

// Update route
app.put("/update/:id", ensureAuth, async (req, res) => {
    const id = req.params.id;
    const { assignmentname, classname, deadline } = req.body;

    let priority = function() {
        let today = new Date();
        let due = new Date(deadline);
        let diff = due - today;
        let days = diff / (1000 * 60 * 60 * 24);
        if (days < 1) {
            return "High";
        } else if (days < 3) {
            return "Medium";
        } else {
            return "Low";
        }
    }

    const updatedAssignment = {
        assignmentname: assignmentname,
        classname: classname,
        deadline: deadline,
        priority: priority()
    }

    await DBCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedAssignment }).then(r => {
        res.json(updatedAssignment);
    }).catch(e => {
        res.sendStatus(500);
    });
});

app.listen(process.env.PORT || port, () => {
    console.log("Server listening on port " + port);
});
