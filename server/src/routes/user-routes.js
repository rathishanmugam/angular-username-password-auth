const express = require('express')
const Users = require('../models/Users-model')
const auth = require('../middlewares/auth')
const routes = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const checkAuth = require("../middlewares/auth");

// User create (signup)
routes.post('/signup', function (req, res) {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new Users({
            name: req.body.name,
            email: req.body.email,
            password: hash
        });

        Users.findOne({email: req.body.email}).then(user1 => {
            if (user1) {
                return res.status(401).json({
                    message: "User Already Exist"
                })
            }

            user.save().then(result => {
                if (!result) {
                    return res.status(500).json({
                        message: "Error Creating USer"
                    })
                }
                res.status(201).json({
                    message: "User created!",
                    result: result
                });
            })
        })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    })
});
// check if previously loggeding
routes.post('/init', auth, (req, res) => {
    try {
        const cookieOptions = {
            httpOnly: true,
        };
        console.log('I AM IN INIT===>', req.user);
        console.log('IAM IN INIT====>', req.token);
        const {token, user} = req
        if (token && user) {
            res.cookie('todo-jt', req.token, cookieOptions).send({user, token})
        }
    } catch (e) {
        res.status(400).send()
    }
})

// Login user
routes.post('/login', (req, res) => {
    let fetchedUser;

    Users.findOne({email: req.body.email}).then(user => {
        if (!user) {
            return res.status(401).json({
                message: "Auth failed no such user"
            })
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
    }).then(result => {
        console.log(fetchedUser)
        if (!result) {
            return res.status(401).json({
                message: "Auth failed inccorect password"
            })
        }
        const token = jwt.sign(
            {email: fetchedUser.email, userId: fetchedUser._id},
            "secret_this_should_be_longer",
            {expiresIn: "1h"}
        );
        res.status(200).json({
            user: fetchedUser.name,
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id
        });
    })
        .catch(e => {

            console.log(e)

        })
})
//logout user
routes.post('/logout', auth, (req, res) => {
    console.log('THE LOGOUT REQ====>', req.user);
    console.log('THE LOGOUT REQ====>', req.token);

    const {user, token} = req
    user.tokens = user.tokens.filter((t) => t.token !== token)
    user.save(error => {
        if (error) console.log(error);
        res.clearCookie('todo-jt')
        res.status(201).json({
            message: `User token deleted successfully`
        });
    });
})

routes.get("/books", checkAuth,
    (req, res, next) => {
        console.log(' iam in books route');
        Users.find({}).then(prof => {
            if (prof) {
                console.log('i find some data =====>', prof);
                res.status(200).json({
                    message: "User fetched successfully!",
                    users: prof
                });
            } else {
                res.status(404).json({message: "User not found!"});
            }
        });
    })

module.exports = routes
