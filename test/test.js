var chai = require('chai')
var chaiHttp = require('chai-http');

var server = require('../index');
var should = chai.should();

chai.use(chaiHttp);

describe('Movies', ()=>{
    it('Deberia de mostrar todas las peliculas GET: /v1/movies', (done)=>{
        chai.request(server)
        .get('/v1/movies')
        .end(function(err, res){
            res.should.have.status(200); 
            res.should.be.json;
            res.body.data.should.be.a('array');
            res.body.should.have.property('success');
            res.body.success.should.equal(true);         
            done();
        })
    });
    it('Deberia de eliminar una pelicula DELETE: /v1/movies/:id/delete');
})