var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser')
var app = express();
var sql = require('mssql');
var env = require('dotenv');
var multer = require('multer');

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
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
    debug: true,
    options: {
        encrypt: true,
        //intanceName: 'DESKTOP-I8V7NM6\\MSSQLSERVER'
    }
};

app.listen(parseInt(process.env.APP_PORT), function(){
    console.log("el servidor esta corriendo");
});

app.get('/v1/movies', function(req, res){
    //var limit = req.params.limit;
    var limit = req.query.limit || 10;
    var genre = req.query.genre || 'drama';
    var year = req.query.year || 2000;
    
    const pool = new sql.ConnectionPool(sqlConfig, err => {

        var querytext = `select * from movies`;

        var request = pool.request();

        request.query(querytext, (err, recordset) => {
            
            if(err) {
                console.log(err);
            }

            var result = {
                success: true,
                message: "",
                movies: recordset.recordset
            }

            res.send(result);  
        })

        pool.on('error', err => {
            res.send({error: err, success: false});
        });
    })


    //aqui va consulta en la db

    /*
    var result = {
        success: true,
        message: '',
        limit: limit,
        genre: genre,
        year: year,
    };

    res.send(result);
    */
})

app.post('/v1/movies/create', function(req, res){
    var name = req.body.name;
    var genre = req.body.genre;
    var images = req.body.images;
    var description = req.body.description;
    var year = req.body.year;

    var result = {
        success: true,
        message: '',
        name: name,
        genre: genre,
        description: description,
        images: images,
        year: year,
    };

    res.send(result);
})


