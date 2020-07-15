const axios = require('axios');

/**
 * Checks that the url is correct or not
 * @param newUrl
 * @returns {boolean}
 */
function checkUrl(newUrl) {
  try {
    new URL(newUrl);
  }
  catch (_) {
    return false;
  }

  return true;
}

/**
 * Makes a request to a specific url returning a promise
 * @param newUrl
 * @returns {*|AxiosPromise}
 */
function doRequestUrl(newUrl) {
  if (!checkUrl(newUrl)) Promise.reject('ERROR:Invalid url');
  
  return axios(newUrl);
}

/**
 * Requests multiple urls from a list of urls
 * @param listArray
 * @returns {Promise<never>|Promise<number[]>|Promise<*[]>}
 */
function requestMultipleUrls(listArray) {
  // ensure parameter is not missing
  if (arguments.length === 0 || listArray === null ) return Promise.reject('ERROR:Missing listArray');

  // ensure parameter is an array
  if (!Array.isArray(listArray)) return Promise.reject('ERROR:listArray should be an array');

  // quick exit if there is an array but it is empty
  if (listArray.length === 0) return Promise.resolve([]);

  const data = listArray.map((itemUrl) => doRequestUrl(itemUrl).then(res => {
    // There is no major error so return the data object
    return res.data;
  }).catch(err => {
    // reduce the error object to a smaller error message
    return { 'url':err.config.url, 'status':err.response.status, 'statusText':err.response.statusText };
  }));

  return Promise.all(data);
}

module.exports = requestMultipleUrls;
