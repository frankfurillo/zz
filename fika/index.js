var args = process.argv.slice(2);

var appConfig = {
  host:'gunnarfranklin.com',
  getPath : '/Apps/fika/getObj.php?id=',
  postPath: '/Apps/fika/updateObj.php?id='

}

var fikalistObj ={
    startDate: new Date(),
    owner : "Gunnar The Great",
    members: [
        "Marcus",
        "Gabriella",
        "Banarne"
    ]
}

function spawn(){
    console.log(JSON.stringify(fikalistObj));
}

args.forEach(function(a){
  if(a==='listMembers'){
    listMembers();
  }
  if(a === "spawn"){
      spawn();
  }
})

var fika;

function listMembers(){
    fika = getFika(0); //TODO pass id later...
//    process.stdout.write(fika);
}


function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getFika(id){
    console.log("muuuu");
     var http = require('http');
    var url = "http://"+ appConfig.host + appConfig.getPath+ id;
    http.get(url, res => {
  res.setEncoding("utf8");
  var body = "";
  res.on("data", data => {
      console.log(data);
       var p = JSON.parse(data);
       var fikalistItem = JSON.parse(p[0].value);
       var d = fikalistItem.startDate;
       console.log(d.substring(0,4));
       console.log(parseInt(d.substring(5,2)));
       var startDate = new Date(d.substring(0,4),parseInt(d.substring(5,7)), parseInt(d.substring(8,10)));
       var occurrance = parseInt(fikalistItem.occuranceDays,10);
       d = startDate;
       var lastIteratedMember = "";
       console.log(startDate);
       
       while(d <  addDays(new Date(),occurrance+1)){
                
               fikalistItem.members.forEach(function(a){
                   d = addDays(startDate,occurrance);
                    lastIteratedMember = a;
               });
       }
        console.log("Next weeks fika belongs to" + lastIteratedMember)
        console.log("\r\nAll members of this fikalist");
        fikalistItem.members.forEach(function(a){
            console.log("\n\n"+ a);
        })
  });
  res.on("end", () => {
    console.info('\n\nCall completed');
  });
});
}

function getFika2(id){

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
