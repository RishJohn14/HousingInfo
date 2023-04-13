const { getMapData, getTransactionsFromPin } = require('./Controllers/MapController');
require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_LINK);
const http = require('node-mocks-http');

afterAll(() => mongoose.disconnect())

describe('Map Controller - getMapData function', () => {
  test('Testing of getMapData function - BBT 1.1', (done) => {
    const req = http.createRequest({
      query: { houseType: 'EXECUTIVE', minPrice: 0,maxPrice: 1000000 }
    });
    const res = http.createResponse();
    getMapData(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('success');
      done();
    }, 3000);
  });

  test('Testing of getMapData function - BBT 1.2', (done) => {
    const req = http.createRequest({
      query: { houseType: '', minPrice: 0, maxPrice: 1000000 }
    });
    const res = http.createResponse();
    getMapData(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('Invalid Inputs - HouseType');
      done();
    }, 2000);
  });

  test('Testing of getMapData function - BBT 1.3', (done) => {
    const req = http.createRequest({
      query: { houseType: '5 ROOM', minPrice: 100000, maxPrice: 100000 }
    });
    const res = http.createResponse();
    getMapData(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('Invalid Inputs - Price Range');
      done();
    }, 2000);
  });

  test('Testing of getMapData function - BBT 1.4', (done) => {
    const req = http.createRequest({
      query: { houseType: '5 ROOM', minPrice: 100000, maxPrice: 100001 }
    });
    const res = http.createResponse();
    getMapData(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('success');
      done();
    }, 2000);
  });
});

describe('Map Controller - getTransactionsFromPin function', () => {
  test('Testing of getTransactionsFromPin - BBT 2.1', (done) => {
    const req = http.createRequest({
      query: {
        latitude: 1.25,
        longitude: 103.81,
        flat_type: 'MULTI-GENERATIONAL'
      }
    });
    const res = http.createResponse();
    getTransactionsFromPin(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('success');
      done();
    }, 2000);
  });

  test('Testing of getTransactionsFromPin function - BBT 2.2', (done) => {
    const req = http.createRequest({
      query: {
        latitude: 1.25,
        longitude: 103.81,
        flat_type: ''
      }
    });
    const res = http.createResponse();
    getTransactionsFromPin(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('Invalid Inputs - House Type');
      done();
    }, 2000);
  });

  test('Testing of getTransactionsFromPin function - BBT 2.3.1', (done) => {
    const req = http.createRequest({
      query: {
        latitude: 1.2258860606437172,
        longitude: 103.81,
        flat_type: '5 ROOM'
      }
    });
    const res = http.createResponse();
    getTransactionsFromPin(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('success');
      done();
    }, 2000);
  });

  test('Testing of getTransactionsFromPin function - BBT 2.3.2', (done) => {
    const req = http.createRequest({
      query: {
        latitude: 1.225,
        longitude: 103.81,
        flat_type: '5 ROOM'
      }
    });
    const res = http.createResponse();
    getTransactionsFromPin(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('Invalid Inputs - Latitude');
      done();
    }, 2000);
  });

  test('Testing of getTransactionsFromPin function - BBT 2.3.3', (done) => {
    const req = http.createRequest({
      query: {
        latitude: 1.3578242506601004,
        longitude: 103.81,
        flat_type: '5 ROOM'
      }
    });
    const res = http.createResponse();
    getTransactionsFromPin(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('success');
      done();
    }, 2000);
  });

  test('Testing of getTransactionsFromPin function - BBT 2.3.4', (done) => {
    const req = http.createRequest({
      query: {
        latitude: 1.358,
        longitude: 103.81,
        flat_type: '5 ROOM'
      }
    });
    const res = http.createResponse();
    getTransactionsFromPin(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('Invalid Inputs - Latitude');
      done();
    }, 2000);
  });

  test('Testing of getTransactionsFromPin function - BBT 2.4.1', (done) => {
    const req = http.createRequest({
      query: {
        latitude: 1.25,
        longitude: 103.80877010434992,
        flat_type: '5 ROOM'
      }
    });
    const res = http.createResponse();
    getTransactionsFromPin(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('success');
      done();
    }, 2000);
  });

  test('Testing of getTransactionsFromPin function - BBT 2.4.2', (done) => {
    const req = http.createRequest({
      query: {
        latitude: 1.25,
        longitude: 103.8,
        flat_type: '5 ROOM'
      }
    });
    const res = http.createResponse();
    getTransactionsFromPin(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('Invalid Inputs - Longitude');
      done();
    }, 2000);
  });

  test('Testing of getTransactionsFromPin function - BBT 2.4.3', (done) => {
    const req = http.createRequest({
      query: {
        latitude: 1.25,
        longitude: 103.83315507774375,
        flat_type: '5 ROOM'
      }
    });
    const res = http.createResponse();
    getTransactionsFromPin(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('success');
      done();
    }, 2000);
  });

  test('Testing of getTransactionsFromPin function - BBT 2.4.4', (done) => {
    const req = http.createRequest({
      query: {
        latitude: 1.25,
        longitude: 103.84,
        flat_type: '5 ROOM'
      }
    });
    const res = http.createResponse();
    getTransactionsFromPin(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('Invalid Inputs - Longitude');
      done();
    }, 2000);
  });
});