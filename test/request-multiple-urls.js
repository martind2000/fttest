
const assert = require('chai').assert;

const nock = require('nock');

const requestMultipleUrls = require('../request-multiple-urls');

const ftseShort = { 'item':'ftse' };

const ftsefsi = {
  'data': {
    'items': [
      {
        'symbolInput': 'FTSE:FSI',
        'basic': {
          'symbol': 'FTSE:FSI',
          'name': 'FTSE 100 Index',
          'exchange': 'FTSE International',
          'exhangeCode': 'FSI',
          'bridgeExchangeCode': 'GBFT',
          'currency': 'GBP'
        },
        'quote': {
          'lastPrice': 7259.31,
          'openPrice': 7292.76,
          'high': 7335.55,
          'low': 7258.83,
          'previousClosePrice': 7292.76,
          'change1Day': -33.44999999999982,
          'change1DayPercent': -0.45867408224046613,
          'change1Week': -100.06999999999971,
          'change1WeekPercent': -1.359761284238614,
          'timeStamp': '2019-11-15T10:53:16',
          'volume': 165239344
        }
      }
    ]
  },
  'timeGenerated': '2019-11-15T11:08:17'
};

describe('Test Request-multiple-urls', () => {
  describe('Initial Rejects', () => {
    it('Rejects: Function called with no parameters', () => {
      requestMultipleUrls().
        catch(err => {
          assert.equal(err, 'ERROR:Missing listArray');
        });
    });

    it('Rejects: Function called with null', () => {
      requestMultipleUrls(null).
        catch(err => {
          assert.equal(err, 'ERROR:Missing listArray');
        });
    });

    describe('Rejects: Function called with non array', () => {
      it('Rejects: Function called with a string', () => {
        requestMultipleUrls('one').
          catch(err => {
            assert.equal(err, 'ERROR:listArray should be an array');
          });
      });

      it('Rejects: Function called with a number', () => {
        requestMultipleUrls(2).
          catch(err => {
            assert.equal(err, 'ERROR:listArray should be an array');
          });
      });

      it('Rejects: Function called with an object', () => {
        requestMultipleUrls({ 'three':'four' }).
          catch(err => {
            assert.equal(err, 'ERROR:listArray should be an array');
          });
      });
    });
  });

  describe('Resolve tests', () => {
    it('Resolves: Function called with empty array', () => {
      const expected = [];
      
      requestMultipleUrls([]).
        then(v => {
          assert.deepEqual(v, expected);
        });
    });

    it('Resolves: Handles correct response', () => {
      const expected = [ { 'item': 'ftse' } ];
      const scope = nock('https://local.test')
        .get('/ftse-fsi.json')
        .reply(200, ftseShort);

      return requestMultipleUrls(['https://local.test/ftse-fsi.json']).then(v => {
        assert.deepEqual(v, expected);
      });
    });

    it('Resolves: Handles 404 response', () => {
      const expected = [ { 'url': 'https://local.test/should-fail.json', 'status': 404, 'statusText': null } ];
      const scope = nock('https://local.test')
        .get('/should-fail.json')
        .reply(404);

      return requestMultipleUrls(['https://local.test/should-fail.json']).then(v => {
        assert.deepEqual(v, expected);
      });
    });

    it('Resolves: Mix 200 & 404 responses', () => {
      const expected = [ { 'item': 'ftse' }, { 'url': 'https://local.test/should-fail.json', 'status': 404, 'statusText': null } ];

      const scope = nock('https://local.test')
        .get('/ftse-fsi.json')
        .reply(200, ftseShort)
        .get('/should-fail.json')
        .reply(404);

      return requestMultipleUrls(['https://local.test/ftse-fsi.json', 'https://local.test/should-fail.json']).then(v => {
        assert.deepEqual(v, expected);
      });
    });

    it('Resolves: Real data', () => {
      const expected = [ftsefsi];

      const scope = nock('https://local.test')
        .get('/ftse-fsi.json')
        .reply(200, ftsefsi);

      return requestMultipleUrls(['https://local.test/ftse-fsi.json']).then(v => {
        assert.deepEqual(v, expected);
      });
    });
  });
});
