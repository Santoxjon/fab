// test/matchesController.test.js

const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const cache = require('../config/cache');
const { getDom } = require('../helpers/puppeteer.helper');
require('dotenv').config();

describe('Cache', () => {
  it('Should store an example object', () => {
    cache.set('example', { foo: 'bar' }, 3600);
    const cachedData = cache.get('example');
    expect(cachedData).to.be.an('object');
    expect(cachedData).to.have.keys('foo');
    expect(cachedData.foo).to.be.equal('bar');
  });
  it('Should clear the cache', () => {
    cache.flushAll();
    const cachedData = cache.get('example');
    assert.isUndefined(cachedData);
  });
  it('Cache next matches', async function () {
    this.timeout(10000); // Timeout neccessary to wait for the puppeteer to load the page
    const dom = await getDom(process.env.NEXT_MATCH_URL);
    cache.set('matches:nextMatch', dom, process.env.CACHE_TTL);
  });
});
