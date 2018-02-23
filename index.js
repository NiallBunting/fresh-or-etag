'use strict';

const cache = require('memory-cache');

class FreshEtag {
  constructor () {
  }

  /*
  * Try and get values from the cache if not return the header
  */
  cacheTry(name, headers = {}){
    var filters = cache.get(name + 'Data');

    if(filters) {
      // Tests if the cache is still fresh if so return it.
      if(cache.get(name + 'Fresh')) {
        return [new Promise(function(resolve, reject){resolve(filters);}), null];
      }

      // Add etag if we have it and the data (since else it's not returned)
      let eTag = cache.get(name + 'Etag');
      if(eTag) {
        headers["If-None-Match"] = eTag;
      }
    }

    return [null, headers];
  }

  /*
  * Cache the response if needed or return the cached response if 304
  */
  cacheResponse(name, res){
    // No change since Etag, return cache.
    if(res.status == 304) {return cache.get(name + 'Data');}
    if(res.status == 200) {
      // The data has changed. Set the data for next time
      if(res.headers) {
        if(res.headers.etag) {
          cache.put(name + 'Etag', res.headers.etag);
        }
        if(res.headers["cache-control"]) {
          let cacheTime = /max-age=([0-9]*)/.exec(res.headers["cache-control"]);
          if(cacheTime && cacheTime.length > 1 && !isNaN(cacheTime[1])){
            cache.put(name + 'Fresh', true, 1000 * cacheTime[1]);
          }
        }
        // Storing data now could be Etag or cached.
        cache.put(name + 'Data', res);
      }
    }
    return res;
  }
}

module.exports = new FreshEtag();
