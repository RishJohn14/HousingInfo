const { getAdvice } = require('./Controllers/DetailsController');
const { getNeighbourhoodPriceComparisonChart } = require('./Controllers/ChartController');
require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_LINK);
const http = require('node-mocks-http');

afterAll(() => mongoose.disconnect())

describe('Details Controller - getAdvice function', () => {
  test('Testing of getAdvice function - WBT 1A', (done) => {
    const req = http.createRequest({
      query: { maxValue: 1000000, workplaceLocation: 'North', householdPax: 5}
    });
    const res = http.createResponse();
    getAdvice(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('error');
      done();
    }, 3000);
  });

  test('Testing of getAdvice function - WBT 1B', (done) => {
    const req = http.createRequest({
      query: { minValue: 100000, workplaceLocation: 'North', householdPax: 5}
    });
    const res = http.createResponse();
    getAdvice(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('error');
      done();
    }, 3000);
  });

  test('Testing of getAdvice function - WBT 1C', (done) => {
    const req = http.createRequest({
      query: { minValue: 100000, maxValue: 1000000, householdPax: 5}
    });
    const res = http.createResponse();
    getAdvice(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('error');
      done();
    }, 3000);
  });

  test('Testing of getAdvice function - WBT 1D', (done) => {
    const req = http.createRequest({
      query: { minValue: 0, maxValue: 1000000, workplaceLocation: 'North' }
    });
    const res = http.createResponse();
    getAdvice(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('error');
      done();
    }, 3000);
  });

  test('Testing of getAdvice function - WBT 1E', (done) => {
    const req = http.createRequest({
      query: { minValue: 100000, maxValue: 1000000, workplaceLocation: 'North', householdPax: 2 }
    });
    const res = http.createResponse();
    getAdvice(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('success');
      done();
    }, 3000);
  });

  test('Testing of getAdvice function - WBT 1F', (done) => {
    const req = http.createRequest({
      query: { minValue: 100000, maxValue: 1000000, workplaceLocation: 'East', householdPax: 2 }
    });
    const res = http.createResponse();
    getAdvice(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('success');
      done();
    }, 3000);
  });

  test('Testing of getAdvice function - WBT 1G', (done) => {
    const req = http.createRequest({
      query: { minValue: 100000, maxValue: 1000000, workplaceLocation: 'West', householdPax: 2 }
    });
    const res = http.createResponse();
    getAdvice(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('success');
      done();
    }, 3000);
  });

  test('Testing of getAdvice function - WBT 1H', (done) => {
    const req = http.createRequest({
      query: { minValue: 100000, maxValue: 1000000, workplaceLocation: 'South', householdPax: 2 }
    });
    const res = http.createResponse();
    getAdvice(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('success');
      done();
    }, 3000);
  });

  test('Testing of getAdvice function - WBT 1I', (done) => {
    const req = http.createRequest({
      query: { minValue: 100000, maxValue: 1000000, workplaceLocation: 'North', householdPax: 3 }
    });
    const res = http.createResponse();
    getAdvice(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('success');
      done();
    }, 3000);
  });

  test('Testing of getAdvice function - WBT 1I', (done) => {
    const req = http.createRequest({
      query: { minValue: 100000, maxValue: 1000000, workplaceLocation: 'North', householdPax: 3 }
    });
    const res = http.createResponse();
    getAdvice(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('success');
      done();
    }, 3000);
  });

  test('Testing of getAdvice function - WBT 1J', (done) => {
    const req = http.createRequest({
      query: { minValue: 100000, maxValue: 1000000, workplaceLocation: 'East', householdPax: 3 }
    });
    const res = http.createResponse();
    getAdvice(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('success');
      done();
    }, 3000);
  });

  test('Testing of getAdvice function - WBT 1K', (done) => {
    const req = http.createRequest({
      query: { minValue: 100000, maxValue: 1000000, workplaceLocation: 'West', householdPax: 3 }
    });
    const res = http.createResponse();
    getAdvice(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('success');
      done();
    }, 3000);
  });

  test('Testing of getAdvice function - WBT 1L', (done) => {
    const req = http.createRequest({
      query: { minValue: 100000, maxValue: 1000000, workplaceLocation: 'South', householdPax: 3 }
    });
    const res = http.createResponse();
    getAdvice(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('success');
      done();
    }, 3000);
  });

  test('Testing of getAdvice function - WBT 1M', (done) => {
    const req = http.createRequest({
      query: { minValue: 100000, maxValue: 1000000, workplaceLocation: 'North', householdPax: 4 }
    });
    const res = http.createResponse();
    getAdvice(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('success');
      done();
    }, 3000);
  });

  test('Testing of getAdvice function - WBT 1N', (done) => {
    const req = http.createRequest({
      query: { minValue: 100000, maxValue: 1000000, workplaceLocation: 'East', householdPax: 4 }
    });
    const res = http.createResponse();
    getAdvice(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('success');
      done();
    }, 3000);
  });

  test('Testing of getAdvice function - WBT 1O', (done) => {
    const req = http.createRequest({
      query: { minValue: 100000, maxValue: 1000000, workplaceLocation: 'West', householdPax: 4 }
    });
    const res = http.createResponse();
    getAdvice(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('success');
      done();
    }, 3000);
  });

  test('Testing of getAdvice function - WBT 1P', (done) => {
    const req = http.createRequest({
      query: { minValue: 100000, maxValue: 1000000, workplaceLocation: 'South', householdPax: 4 }
    });
    const res = http.createResponse();
    getAdvice(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('success');
      done();
    }, 3000);
  });

  test('Testing of getAdvice function - WBT 1R', (done) => {
    const req = http.createRequest({
      query: { minValue: 100000, maxValue: 1000000, workplaceLocation: 'North', householdPax: 8 }
    });
    const res = http.createResponse();
    getAdvice(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('success');
      done();
    }, 3000);
  });

  test('Testing of getAdvice function - WBT 1S', (done) => {
    const req = http.createRequest({
      query: { minValue: 100000, maxValue: 1000000, workplaceLocation: 'East', householdPax: 8 }
    });
    const res = http.createResponse();
    getAdvice(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('success');
      done();
    }, 3000);
  });

  test('Testing of getAdvice function - WBT 1T', (done) => {
    const req = http.createRequest({
      query: { minValue: 100000, maxValue: 1000000, workplaceLocation: 'West', householdPax: 8 }
    });
    const res = http.createResponse();
    getAdvice(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('success');
      done();
    }, 3000);
  });

  test('Testing of getAdvice function - WBT 1U', (done) => {
    const req = http.createRequest({
      query: { minValue: 100000, maxValue: 1000000, workplaceLocation: 'South', householdPax: 8 }
    });
    const res = http.createResponse();
    getAdvice(req, res);
    setTimeout(() => {
      expect(res._getStatusCode()).toBe(200);
      expect((res._getData())?.status).toEqual('success');
      done();
    }, 3000);
  });
});

describe('Chart Controller - getNeighbourhoodPriceComparisonChart function', () => {
    test('Testing of getNeighbourhoodPriceComparisonChart function - WBT 2A', (done) => {
      const req = http.createRequest({
        query: {}
      });
      const res = http.createResponse();
      getNeighbourhoodPriceComparisonChart(req, res);
      setTimeout(() => {
        expect(res._getStatusCode()).toBe(200);
        expect((res._getData())?.status).toEqual('error');
        done();
      }, 3000);
    });

    test('Testing of getNeighbourhoodPriceComparisonChart function - WBT 2B', (done) => {
        const req = http.createRequest({
            query: { userType: 'revaluate+' }
        });
        const res = http.createResponse();
        getNeighbourhoodPriceComparisonChart(req, res);
        setTimeout(() => {
            expect(res._getStatusCode()).toBe(200);
            expect((res._getData())?.status).toEqual('error');
            done();
        }, 3000);
    });

    test('Testing of getNeighbourhoodPriceComparisonChart function - WBT 2C', (done) => {
        const req = http.createRequest({
            query: { userType: 'buyer', flat_type: '5 ROOM', town: 'BEDOK' }
        });
        const res = http.createResponse();
        getNeighbourhoodPriceComparisonChart(req, res);
        setTimeout(() => {
            expect(res._getStatusCode()).toBe(200);
            expect((res._getData())?.status).toEqual('error');
            done();
        }, 3000);
    });

    test('Testing of getNeighbourhoodPriceComparisonChart function - WBT 2D', (done) => {
        const req = http.createRequest({
            query: { userType: 'seller', flat_type: '5 ROOM', latitude: 1.25, longitude: 103.81 }
        });
        const res = http.createResponse();
        getNeighbourhoodPriceComparisonChart(req, res);
        setTimeout(() => {
            expect(res._getStatusCode()).toBe(200);
            expect((res._getData())?.status).toEqual('error');
            done();
        }, 3000);
    });

    test('Testing of getNeighbourhoodPriceComparisonChart function - WBT 2E', (done) => {
        const req = http.createRequest({
            query: { userType: 'random', flat_type: '5 ROOM' }
        });
        const res = http.createResponse();
        getNeighbourhoodPriceComparisonChart(req, res);
        setTimeout(() => {
            expect(res._getStatusCode()).toBe(200);
            expect((res._getData())?.status).toEqual('error');
            done();
        }, 3000);
    });
});