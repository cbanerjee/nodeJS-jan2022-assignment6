// const mongoDbClient = require("mongodb").MongoClient;
const mongoose = require('mongoose');

const url = "" //please enter the url

var dbClient;

exports.connect = () => {

    mongoose.connect(url, { useNewUrlParser: true })
        .then(
            (client) => {
                dbClient = client;
                console.log("MongoDb has been connected");
            },
            (err) => {
                console.log(err)
                console.log("retrying");
                this.connect();
            }
        )
}

exports.getCollection = (name) => {
    return dbClient.db("myFirstDatabase").collection(name);
}