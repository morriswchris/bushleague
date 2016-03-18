require("console.table");
var request = require("request");
var yargs = require("yargs").argv;
if(!(yargs.l || yargs.league)){
  console.log("Please specify a league using -l or --league");
  return;
}
var league = yargs.l || yargs.league;
var utcOffset = new Date().getTimezoneOffset()*60; //since we want seconds
var host = "http://api.thescore.com/";
var scheduleUrl = host + league + "/schedule?utc_offset=-"+ utcOffset;

request(scheduleUrl, function(error, response, body){
  if(error){
    console.log("Error: ", error);
    return;
  }

  var events = JSON.parse(body);
  var events_to_find = events.current_group.event_ids;
  var eventsUrl = host + league + "/events?id.in=" + encodeURIComponent(events_to_find);

  request(eventsUrl, function (error, response, body) {
    if(error){
      console.log("Error: ", error);
      return;
    }
    var scores = JSON.parse(body);
    var outputs = [];
    for(var index in scores){
      var output = {};
      var score = scores[index];
      output["HOME"] = score.home_team.full_name;
      output["SCORE"] = score.box_score.score.home.score + " - " + score.box_score.score.away.score;
      output["AWAY"] = score.away_team.full_name;
      output["STATUS"] = score.box_score.progress.clock_label
      outputs.push(output);
    }
    console.table(outputs);
  });
});
