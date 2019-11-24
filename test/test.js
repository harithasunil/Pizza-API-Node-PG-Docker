var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);

const base_url = 'http://localhost:8010'

describe('Pizza API Base URL', function() {
  it('It ', function(done) {
    chai.request(base_url)
    .get('/')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });
});

describe("Add One Pizza  - POST", () => {
  it("Adding new Item", done => {
    chai
      .request(base_url)
      .post("/api/items")
      .send({
        "name": "Peri Peri Pizza",
        "size": "Medium",
        "isExtra": false,
        "price": 99,
        "status": "available"
      })
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });
});

describe("/GET items", () => {
  it("it should GET all times", done => {
    chai
      .request(base_url)
      .get("/api/items")
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

describe("Add One Order  - POST", () => {
  it("Adding new Order", done => {
    chai
      .request(base_url)
      .post("/api/orders")
      .send({
        "customerName": "Akshay N Shaju",
        "phoneNumber": "+918129267093",
        "email": "mail@akshaynshaju.com",
        "address": 'Kerala, India',
        "postalCode": 680303,
        "city": "Thrissur"
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.property('id');
        done();
      });
  });
});

