const express = require("express");
const Router = express.Router();
const mongodb = require('../mongodb');

const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');

const usermodel = require("../models/user");
const shoppingmodel = require("../models/shopping");
const productmodel = require("../models/product");

const jwt = require('jsonwebtoken');
const jwtsecret = "secret";

const tocken_decoder = (token) => {
    jwt.verify(token, jwtsecret, (err, decoded) => {
        if (err) {
            console.log(err);
            return 'NaN';
        } else if (decoded) {
            return decoded;
        }
    })
}

const isadmin = (token) => {
    var id = tocken_decoder(token)._id;
    usermodel.findOne({ id }).then((data) => {
        return (data.isAdmin == true);
    }, (err) => {
        console.log(err);
        return false;
    })
}

Router.get('/',(req, res)=>{
    res.render('register',{user :{type: 'admin'}});
})

Router.get("/shopping_list/", (req, res) => {
    const token = localStorage.getItem('authtoken');
    if (isadmin(token)) {
        shoppingmodel().find({}).toArray().then(
            data => res.render('shoppinglist', { user: { isadmin: true }, data })
        )
    } else {
        const user = tocken_decoder(token)._id;
        shoppingmodel().find({ Userid: userID }).toArray().then(
            data => res.render('shoppinglist', { user: { isadmin: false }, data })
        )
    }

})

Router.get("/login/", (req, res) => {
    res.render("login");
})

Router.get("/add_product/", (req, res) => {
    const token = localStorage.getItem('authtoken');
    if (isadmin(token)) {
        return res.render('addproduct');
    } else {
        res.send("not admin");
    }

})

Router.get("/add_user/", (req, res) => {
    const token = localStorage.getItem('authtoken');
    if (isadmin(token)) {
        return res.render('adduser');
    } else {
        res.send("not admin");
    }

})

Router.get("/user_list/", (req, res) => {
    const token = localStorage.getItem('authtoken');
    if (isadmin(token)) {
        usermodel().find({}).toArray().then(
            data => res.render('userlist', { data })
        )
    }
})

Router.post("/registeruser/", (req, res) => { //not admin

    console.log(req.body); //body-parser is included in index.js
    usermodel.create(
        {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            isAdmin: req.body.admin
        },
        (err, user) => {
            if (err) { console.log(err); res.redirect("/login/") }
            else {
                res.redirect("/login/")
            }
        }
    )
})

Router.post("/add_user/", (req, res) => {
    const token = localStorage.getItem('authtoken');
    if (isadmin(token)) {
        usermodel.create(
            {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                isAdmin: req.body.admin
            },
            (err, user) => {
                if (err) { console.log(err); res.redirect("/add_user/") }
                else {
                    htmlMsg = encodeURIComponent('Added New User DONE !');
                    res.redirect("/add_user/")
                }
            }
        )
    } else {
        res.send("You are not admin");
    }

})

Router.post("/login/", (req, res) => {
    console.log(req.body);
    usermodel.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            return res.status(500).send('Login Error');
        } else if (user.password == req.body.password) {
            var token = jwt.sign({ id: user._id }, jwtsecret, {
                expiresIn: 86400 // expires in 24 hours
            });

            localStorage.setItem('authtoken', token)

            return res.redirect("/shopping_list/");
        } else {
            res.send("Invalid Login");
        }
    });
})

Router.post("/add_order/", (req, res) => {
    const token = localStorage.getItem('authtoken');
    user = tocken_decoder(token);
    const date = Date.now();
    const order = { ...req.body, date: d, userID: user._id }
    shoppingmodel.create(
        order
        , (err, data) => {
            console.log(`Inserted ... ${data} `)
            res.redirect("/shopping_list");
        })
})

Router.post("/add_product/", (req, res) => {
    const token = localStorage.getItem('authtoken');
    if (isadmin(token)) {
        productmodel.create(
            {
                name: req.body.name,
                price: req.body.price
            },
            (err, user) => {
                if (err) { console.log(err); res.redirect("/add_product/") }
                else {
                    res.redirect("/add_product/")
                }
            }
        )
    }
})

module.exports = Router