var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser')
var app = express();
var sql = require('mssql');
var env = require('dotenv');
var multer = require('multer');
var path = require('path');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+'.'+getExtension(file.originalname))
    }
})

function getExtension(filename) {
    var ext = path.extname(filename||'').split('.');
    return ext[ext.length - 1];
}

var upload = multer({ storage: storage })

const result = env.config();
app.use(cors());
app.use(bodyParser());

const sqlConfig = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
    debug: true,
    options: {
        encrypt: false
    }
};

app.use(function(err, req, res, next){
    console.error(err);
    res.send({ success: false, message: err })
})

app.listen(parseInt(process.env.APP_PORT), function(){
    console.log("el servidor esta corriendo");
    console.log(result.parsed);
    console.log(sqlConfig);
});

require("./movies")(upload, app, sql, sqlConfig);
require("./users")(app, sql, sqlConfig);

module.exports = app.listen(3000);