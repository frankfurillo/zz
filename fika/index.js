var args = process.argv.slice(2);

var appConfig = {
  host:'gunnarfranklin.com',
  getPath : '/Apps/fika/getObj.php?id=',
  postPath: '/Apps/fika/updateObj.php?id='

}


args.forEach(function(a){
  if(a==='listMembers'){
    listMembers();
  }
})

var fika;

function listMembers(){
    fika = getFika(0); //TODO pass id later...
    process.stdout.write(fika+"lkjlkj");
}


function getFika(id){

  var http = require('http');

  /**
   * HOW TO Make an HTTP Call - GET
   */
  // options for GET
  var optionsget = {
      host : appConfig.host, // here only the domain name
      // (no http/https !)
      port : 80,
      path : appConfig.getPath+id, // the rest of the url with parameters if needed
      method : 'GET' // do GET
  };

  // do the GET request
  var returnData;
  var reqGet = http.request(optionsget, function(res) {
      console.log("statusCode: ", res.statusCode);
      // uncomment it for header details
  //  console.log("headers: ", res.headers);


      res.on('data', function(d) {
          console.info('GET result:\n');
          returnData= d;

          process.stdout.write(d);
          console.info('\n\nCall completed');
          return d;
      });

  });

  reqGet.end();
  reqGet.on('error', function(e) {
      console.error(e);
  });
  return returnData;
}

function updateFika(){
  /**
 * HOW TO Make an HTTP Call - POST
 */
// do a POST request
// create the JSON object
  jsonObject = JSON.stringify(
      {
        fikalist:[
          {},
          {}
        ]
      }

  );

// prepare the header
  var postheaders = {
      'Content-Type' : 'application/json',
      'Content-Length' : Buffer.byteLength(jsonObject, 'utf8')
  };

  // the post options
  var optionspost = {
      host : appConfig.host,
      port : 443,
      path : appConfig.postPath,
      method : 'POST',
      headers : postheaders
  };

  console.info('Options prepared:');
  console.info(optionspost);
  console.info('Do the POST call');

  // do the POST call
  var reqPost = https.request(optionspost, function(res) {
      console.log("statusCode: ", res.statusCode);
      // uncomment it for header details
  //  console.log("headers: ", res.headers);

      res.on('data', function(d) {
          console.info('POST result:\n');
          process.stdout.write(d);
          console.info('\n\nPOST completed');
      });
  });

  // write the json data
  reqPost.write(jsonObject);
  reqPost.end();
  reqPost.on('error', function(e) {
      console.error(e);
  });

}
