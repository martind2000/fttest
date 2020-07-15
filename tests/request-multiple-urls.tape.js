const tape = require('tape');
const _test = require('tape-promise').default;
const test = _test(tape);

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

test('Test Request-multiple-urls', async function(t) {
  t.test('Initial Rejects', async function (t) {
    t.test('Rejects: Function called with no parameters', async function (t) {
      await t.rejects(requestMultipleUrls);
      await t.rejects(requestMultipleUrls());
    });

    t.test('Rejects: Function called with null', async function (t) {
      await t.rejects(requestMultipleUrls(null));
    });

    t.test('Rejects: Function called with non array', async function (t) {
      await t.rejects(requestMultipleUrls('one'));
      await t.rejects(requestMultipleUrls(2));
      await t.rejects(requestMultipleUrls({ 'three':'four' }));
    });
  });
  
  t.test('Resolves: Function called with empty array', async function (t) {
    // await t.doesNotReject(requestMultipleUrls([]));
    const expected = [];

    return requestMultipleUrls([]).then(v => {
      t.deepEqual(v, expected);
    });
  });

  t.test('Resolves: Handles correct response', async function (t) {
    const expected = [ { 'item': 'ftse' } ];

    const scope = nock('https://local.test')
      .get('/ftse-fsi.json')
      .reply(200, ftseShort);

    return requestMultipleUrls(['https://local.test/ftse-fsi.json']).then(v => {
      t.deepEqual(v, expected);
    });
  });

  t.test('Resolves: Handles 404 response', async function (t) {
    const expected = [ { 'url': 'https://local.test/should-fail.json', 'status': 404, 'statusText': null } ];

    const scope = nock('https://local.test')
      .get('/should-fail.json')
      .reply(404);

    return requestMultipleUrls(['https://local.test/should-fail.json']).then(v => {
      t.deepEqual(v, expected);
    });
  });
  
  t.test('Resolves: Mix 200 & 404 responses', async function (t) {
    const expected = [ { 'item': 'ftse' }, { 'url': 'https://local.test/should-fail.json', 'status': 404, 'statusText': null } ];

    const scope = nock('https://local.test')
      .get('/ftse-fsi.json')
      .reply(200, ftseShort)
      .get('/should-fail.json')
      .reply(404);

    return requestMultipleUrls(['https://local.test/ftse-fsi.json', 'https://local.test/should-fail.json']).then(v => {
      t.deepEqual(v, expected);
    });
  });

  t.test('Resolves: Real data', async function (t) {
    const expected = [ftsefsi];

    const scope = nock('https://local.test')
      .get('/ftse-fsi.json')
      .reply(200, ftsefsi);

    return requestMultipleUrls(['https://local.test/ftse-fsi.json']).then(v => {
      t.deepEqual(v, expected);
    });
  });
});
