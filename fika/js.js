"use strict"
var appConfig = {
  host:'gunnarfranklin.com',
  getPath : '/Apps/fika/getObj.php?id=',
  postPath: '/Apps/fika/updateObj.php?id='

}




function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getFika(id){
    console.log("muuuu");
    var url = "http://"+ appConfig.host + appConfig.getPath+ id;
    $.get(url, (data) => {
  var body = "";
      console.log(data);
       var p = JSON.parse(data);
       var fikalistItem = JSON.parse(p[0].value);
       var d = fikalistItem.startDate;
       console.log(d);
       console.log(d.substring(0,4));
       console.log(parseInt(d.substring(5,2)));
       var month = parseInt(d.substring(8,10));
       console.log("d",month);
       var startDate = new Date(d.substring(0,4),parseInt(d.substring(6,7))-1, parseInt(d.substring(8,10)));
       var occurrance = parseInt(fikalistItem.occuranceDays,10);
       d = startDate;
       var lastIteratedMember = "";
       console.log(startDate);
       var membersFromToday = [];
       while(d <  addDays(new Date(),(occurrance* fikalistItem.members.length))){
               fikalistItem.members.forEach(function(a){
                    if(d>new Date()){
                        membersFromToday.push({member: a,date: d});
                    }
                    d = addDays(d,occurrance);
                    lastIteratedMember = a;
               });
       }
       
        console.log("Next weeks fika belongs to" + lastIteratedMember +"<br>");
        console.log("Members from this date and forward" );
        membersFromToday.forEach(p=>{
            console.log("members", p.member + "<br>");
        })
       
        console.log("\r\nAll members of this fikalist");
        fikalistItem.members.forEach(function(a){
            console.log("\n\n"+ a);
        })
});
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
