const request = require("request");
const cli = require("cli");
const Rx = require("rxjs");
const host = "http://api.thescore.com/";
const api_name = "TheScore";
const api_link = "http://www.thescore.com";
const schedule_uri = "/schedule?utc_offset=-";
const events_uri = "/events?id.in=";

module.exports = function(league, cb) {
  function endpoint(league, data_set, param_data) {
    var uri = data_set === "schedule" ? schedule_uri : events_uri;
    cli.debug(host + league + uri + encodeURIComponent(param_data));
    return host + league + uri + encodeURIComponent(param_data);
  }


  // stream to get event ids
  const requests_per_second = 0.1;
  const request_interval = 1000 / requests_per_second;

  const timer_ticks = Rx.Observable.timer(0, request_interval)
    .timeInterval();
  const utc_offset = new Rx.BehaviorSubject(new Date().getTimezoneOffset() * 60);
  const requests = timer_ticks
    .withLatestFrom(utc_offset, function(_, date) { return date; });

  const responses = new Rx.Subject();

  requests.subscribe(function(utc_offset){
    cli.debug("Fetching schedule data for: " + league);
    request(endpoint(league, "schedule", utc_offset), function(error, response,
      body) {
      if (error) {
        cli.fatal(error);
      }
      else {
        responses.next(JSON.parse(body));
      }
    });
  });

  function containsEvents(events) {
    if (!events.current_group) {
      cli.fatal("No scheduled events found");
      return false;
    }
    else {
      cli.debug("Events" + JSON.stringify(events.current_group));
    }
    return events.current_group && events.current_group.event_ids.length > 0;
  }

  const eventResponses = responses
    .filter(containsEvents);

  //stream to get scores for the event ids
  const eventIds = eventResponses
    // .flatMap(function(events){
    //   const ids = events.current_group.event_ids;
    //   cli.debug("ids: " + ids)
    //   return ids;
    // });

  eventIds.subscribe(function(events) {
    let event_ids = events.current_group.event_ids;
    cli.debug("getting event details " + JSON.stringify(event_ids) );
    request(endpoint(league, "event", event_ids), function(error, response, body) {
      if (error) {
        cli.fatal(error);
      }

      cli.debug("getting events");
      s = parse_scores(JSON.parse(body));
      cli.debug(JSON.stringify(s));
      cb(s);
    });
  });

  //combine and print
  function game_date(game){
    var date = new Date(game.game_date);
    return date.toTimeString();
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
      if(score.status === "pre_game"){
        output.STATUS += " [" + game_date(score) + "]";
      }
      outputs.push(output);
    }
    return outputs;
  }
}
