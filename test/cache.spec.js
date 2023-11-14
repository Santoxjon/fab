// test/matchesController.test.js

const chai = require("chai");
const expect = chai.expect;
const cache = require("../config/cache");

const nextMatchMock = {
  local: "JOTAKE",
  visitor: "CLOSNET.COM SAN PRUDENCIO B",
  date: "19-11-2023",
  hour: "17:45",
  field: "POL. IBAIONDO",
  address: "LANDABERDE, 31",
  locality: "VITORIA-GASTEIZ",
};

describe("Cache", () => {
  it("Should store an example object", () => {
    cache.set("example", { foo: "bar" }, 3600);
    const cachedData = cache.get("example");
    expect(cachedData).to.be.an("object");
    expect(cachedData).to.have.keys("foo");
    expect(cachedData.foo).to.be.equal("bar");
  });
  it("Should clear the cache", () => {
    cache.flushAll();
    const cachedData = cache.get("example");
    expect(cachedData).to.be.undefined;
  });

  describe("nextMatch", () => {
    it("Should store data in the cache for the next match of the team JOTAKE", () => {
      cache.set("nextMatch:JOTAKE", nextMatchMock, 3600);
      const cachedData = cache.get("nextMatch:JOTAKE");
      expect(cachedData).to.be.an("object");
      expect(cachedData).to.have.keys(
        "local",
        "visitor",
        "date",
        "hour",
        "field",
        "address",
        "locality"
      );
    });
  });
});
