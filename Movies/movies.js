
module.exports = (upload, app, sql, sqlConfig) => {
    app.get('/v1/movies', (req, res, next) => {
        //var limit = req.params.limit;
        var limit = req.query.limit || 10;
        var genre = req.query.genre || 'drama';
        var year = req.query.year || 2000;

        sql.connect(sqlConfig).then(() => {
            return sql.query(`select * from dbo.Movies where [Genre] like '${genre}'`)
        }).then(result => {

            console.log(result.recordsets.length) // count of recordsets returned by the procedure
            console.log(result.recordsets[0].length) // count of rows contained in first recordset
            console.log(result.recordset) // first recordset from result.recordsets
            console.log(result.returnValue) // procedure return value
            console.log(result.output) // key/value collection of output values
            console.log(result.rowsAffected)

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

    app.del("/v1/movies/:id/delete", (req, res, next) => {
        var id = req.params.id;

        if(!id){
            res.status(403).send(
                { 
                    success: false, 
                    message: "Error id no proporcionado"
                });
        }

        
        var q = `delete from dbo.Movies where dbo.Movies.MovieId = ${id}`;
        console.log(q);

        new sql.ConnectionPool(sqlConfig).connect().then(pool => {
            return pool.query(q);
        }).then(result => {
            var data = {
                success: true,
                message: `deleted movie with id = ${id}`
            }
            res.send(data);
        }).catch(err => {
            return next(err);
        })
    })
}
