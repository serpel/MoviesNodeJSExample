var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser')
var app = express();
var sql = require('mssql');

app.use(cors())
app.use(bodyParser());

//10.48.0.45
const sqlConfig = {
    user: 'student',
    password: 'Admin123',
    server: 'clasedesarrolloweb1.database.windows.net',
    database: 'movies',
    port: 1433,
    debug: true,
    options: {
        encrypt: true,
        //intanceName: 'DESKTOP-I8V7NM6\\MSSQLSERVER'
    }
};

app.listen(8090, function(){
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


