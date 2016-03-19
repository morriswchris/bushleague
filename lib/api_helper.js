var request = require("request");
var cli = require("cli");
var host = "http://api.thescore.com/";
var schedule_uri = "/schedule?utc_offset=-";
var events_uri = "/events?id.in=";

function endpoint(league, data_set, param_data) {
  var uri = data_set === "schedule" ? schedule_uri : events_uri;
  return host + league + uri + encodeURIComponent(param_data);
}

function parse_scores(scores) {
  cli.debug("parsing scores");
  var outputs = [];
  for (var index in scores) {
    var output = {};
    var score = scores[index];
    output.HOME = score.home_team.full_name;
    output.SCORE = score.box_score.score.home.score + " - " + score.box_score.score
      .away.score;
    output.AWAY = score.away_team.full_name;
    output.STATUS = score.box_score.progress.clock_label;
    outputs.push(output);
  }
  return outputs;
}

function get_events(league, event_ids, cb) {
  request(endpoint(league, "event", event_ids), function(error, response, body) {
    if (error) {
      cli.fatal(error);
    }

    cli.debug("getting events");
    cb(parse_scores(JSON.parse(body)));
  });
}

function get_schedule(league, cb) {
  var utc_offset = new Date().getTimezoneOffset() * 60;
  request(endpoint(league, "schedule", utc_offset), function(error, response,
    body) {
    cli.debug("gettig schedule");
    if (error) {
      cli.fatal(error);
    }

    var events = JSON.parse(body);
    if (!events.current_group) {
      cli.fatal("No events found for league ", league);
    }
    get_events(league, events.current_group.event_ids, cb);
  });
}

function get_scores(league, cb) {
  get_schedule(league, cb);
}

module.exports = {
  get_scores: get_scores
};
