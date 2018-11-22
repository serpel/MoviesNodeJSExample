let auth = require("./auth");

module.exports = (app, sql, sqlConfig) => {
    app.post("/v1/users/autenticate", (req, res, next) => {

        var email = req.body.email;
        var password = req.body.password;

        if(!email || !password){
            res.status(403).send({ message: "missing parameters"});
        }

        var q = `select top 1 * from dbo.Users u where u.email = '${email}' and u.password = '${password}'`

        new sql.ConnectionPool(sqlConfig).connect().then(request => {
            return request.query(q);
        })
        .then(result => {

            if(result.recordset.length > 0)
            {
                res.send({ 
                        success: true, 
                        message: "",
                        token: auth.CreateToken(result.recordset.UserId),
                        user: result.recordset
                    });
            } else {
                res.status(403).send({
                    success: false,
                    message: "wrong user or password"
                })
            }
        })
        .catch(err =>{
            return next(err);
        })
    })

    app.post("/v1/users/signup", (req, res, next) => {
        
        var email = req.body.email;
        var password = req.body.password;

        if(!email && !password){
            res.status(403).send({ message: "missing parameters"});
        }

        var q = `insert into dbo.Users(Email, [Password]) values('${email}', '${password}')`

        new sql.ConnectionPool(sqlConfig).connect().then(request => {
            return request.query(q);
        })
        .then(result => {
            res.send({ success: true, message: "user was created sucessful" });
        })
        .catch(err =>{
            return next(err);
        })

    })
}