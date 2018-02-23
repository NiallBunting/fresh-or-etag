# fresh-or-etag

This checks if cache is fresh if not it uses appends an etag.

The cache will time out once the value passed by max-age has passed.

## Installation

    npm install fresh-or-etag --save

## Usage
```javascript
  const requestCache = require('fresh-or-etag');
  const request = require('request');

  function getSomeData() {
    var options = {
      url: 'https://api.github.com/repos/request/request',
      headers: {
        'Some-Header': 'xxx'
      }
    }

    // Try the cache passing in the current headers.
    var values = requestCache.cacheTry('data/1', options.headers);

    console.log(values);
    // Use the return values
    if(values[0]){
      return values[0];
    }

    // Set the headers for the request
    options.headers = values[1];

    // Make the actual request.
    var res = request(options);

    // Cache the response for the future.
    res = requestCache.cacheResponse('data/1', res.body, res.statusCode, res.headers);

    return res;
  }
```

## API
### cacheTry
### cacheResponse

## Contributing

* Fork project and send me the pull request.
