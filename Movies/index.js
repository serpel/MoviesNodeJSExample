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

app.get('/v1/movies', function(req, res, next){
    //var limit = req.params.limit;
    var limit = req.query.limit || 10;
    var genre = req.query.genre || 'drama';
    var year = req.query.year || 2000;

    sql.connect(sqlConfig).then(() => {
        return sql.query(`select * from dbo.Movies where [Genre] like '${genre}'`)
    }).then(result => {
        var data= {
            success: true,
            message: '',
            data: result.recordset
        }
        res.send(data);

        sql.close();
    }).catch(err => {
        return next(err);
    });
})

app.post('/v1/movies/create', upload.single('file'), function(req, res, next){
    var name = req.body.name;
    var genre = req.body.genre;
    var description = req.body.description;
    var year = req.body.year;
    var filename = req.file != null ? req.file.filename : '';

    if(!name && !genre && !year){
        res.send("error");
    }

    var q = `insert into dbo.Movies([Name], [ReleaseDate], [Genre]) values('${name}', cast(${year} as smalldatetime), '${genre}')`;
     
    new sql.ConnectionPool(sqlConfig).connect().then(pool => {
        return pool.query(q)
    })
    .then(result => {
        var data = {
            success: true,
            message: `Se ha creado ${result.rowsAffected} registro nuevo`
        }
        res.send(data);
    })
    .catch(err => {
        console.error(err);
    })
})


app.put("/v1/movies/:id/edit", (req, res, next) => {
    
    console.log("entro");

    var id = req.params.id;
    var txt = '';

    if(!id){
        res.send("Error parametro id no existe");
    }

    var name = req.body.name;
    if(!name){
        res.send("Error se espera el parametro name");
    }else{
       txt += `set Name = '${name}'`
    }

    var genre = req.body.genre;
    if(genre){
        txt += `, Genre = '${genre}'`
    }

    var q = `update dbo.Movies 
             ${txt}
             where MovieId = ${id}`

    console.log(q);

    new sql.ConnectionPool(sqlConfig).connect().then(pool => {
        return pool.query(q)
    })
    .then(result => {
        var data = {
            sucess: true,
            message: `Se actualizo el registro con id = ${id}`
        }
        res.send(data);
    })
    .catch(err => {
        return next(err);
    })
})


