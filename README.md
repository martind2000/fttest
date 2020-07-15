# Request-multiple-urls

## Usage

```js

const requestMultipleUrls = require('request-multiple-urls');

( () => {
  const urls = [
    'https://ft-tech-test-example.s3-eu-west-1.amazonaws.com/ftse-fsi.json',
    'https://ft-tech-test-example.s3-eu-west-1.amazonaws.com/gbp-hkd.json',
    'https://ft-tech-test-example.s3-eu-west-1.amazonaws.com/gbp-usd.json'
  ];

  requestMultipleUrls(urls).then(urlContent => {
    urlContent.forEach((item) => {
      if (item.hasOwnProperty('status')) 
        console.error(item);
      else
        console.log(item.data.items);
    });
  });
})();

```

## Test

Tests are implemented using Tape and requests are mocked using Nock. They can be run using the following from the command line:

```bash
# Run Tape test
npm run test

# Run Mocha test
npm run test:mocha
```
Currently all tests are passing:
```
> node tests/request-multiple-urls.tape.js

TAP version 13
# Test Request-multiple-urls
# Initial Rejects
# Rejects: Function called with no variables
ok 1 should reject
ok 2 should reject
# Rejects: Function called with null
ok 3 should reject
# Rejects: Function called with non array
ok 4 should reject
ok 5 should reject
ok 6 should reject
# Resolves: Function called with empty array
ok 7 should be deeply equivalent
# Resolves: Handles correct response
ok 8 should be deeply equivalent
# Resolves: Handles 404 response
ok 9 should be deeply equivalent
# Resolves: Mix 200 & 404 responses
ok 10 should be deeply equivalent
# Resolves: Real data
ok 11 should be deeply equivalent

1..11
# tests 11
# pass  11

# ok



> mocha

  Test Request-multiple-urls
    Initial Rejects
      ✓ Rejects: Function called with no parameters
      ✓ Rejects: Function called with null
      Rejects: Function called with non array
        ✓ Rejects: Function called with a string
        ✓ Rejects: Function called with a number
        ✓ Rejects: Function called with an object
    Resolve tests
      ✓ Resolves: Function called with empty array
      ✓ Resolves: Handles correct response
      ✓ Resolves: Handles 404 response
      ✓ Resolves: Mix 200 & 404 responses
      ✓ Resolves: Real data


  10 passing (42ms)

```

## Dependencies

Axios was used as the sole dependency to avoid having to use either HTTP or HTTPS and the older event based handling of a request.

As Axios uses promises, a call can be made to Axios and return the promise object instead of using code similar to:

```js
https.get(newUrl, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    resolve(d)
  });

}).on('error', (e) => {
  reject(e);
});
```


## Thoughts

requestMultipleUrls could be modified to accept a single string, by pushing it into an array and expanding functionality slightly.

Better checking could be implemented to ensure that JSON is actually returned. This has just been written with the assumption that JSON will be returned from he remote server.
