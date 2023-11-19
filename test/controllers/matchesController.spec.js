const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;

chai.use(chaiHttp);
const app = require("../../app");

describe("Testing nextMatch endpoint", () => {
  it("should return an error if no teamName is provided", (done) => {
    chai
      .request(app)
      .get("/matches/nextMatch")
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.errorCode).to.be.equal("TEAM_NAME_NOT_PROVIDED");
        done();
      });
  });

  it("should return the expected result for team JOTAKE", (done) => {
    chai
      .request(app)
      .get("/matches/nextMatch")
      .query({ teamName: "jotake" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.nextMatch).to.have.keys(
          "local",
          "visitor",
          "date",
          "hour",
          "field",
          "address",
          "locality"
        );
        done();
      });
  });
});
