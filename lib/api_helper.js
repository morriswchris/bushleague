var request = require("request");
var cli = require("cli");
var inquirer = require("inquirer");
var chalk = require("chalk");
var host = "http://api.thescore.com/";
var api_name = "TheScore";
var api_link = "http://www.thescore.com";
var schedule_uri = "/schedule?utc_offset=-";
var events_uri = "/events?id.in=";

function endpoint(league, data_set, param_data) {
  var uri = data_set === "schedule" ? schedule_uri : events_uri;
  return host + league + uri + encodeURIComponent(param_data);
}

function game_date(game){
  return game.game_date;
}

function parse_scores(scores) {
  cli.debug("parsing scores");

  var choices = [];
  choices.push(chalk.gray("Reload"));
  scores.forEach(function(score, index){
    var line = "";
    var space = " ";
    var separator = " - ";
    var number = index + 1;
    var home_team = score.home_team.full_name;
    var away_team = score.away_team.full_name;
    var match = home_team + " VS " + away_team;
    var home_score = score.box_score.score.home.score;
    var away_score = score.box_score.score.away.score;
    var scores = true;
    var time = score.box_score.progress.clock_label;
    if (score.status == "pre_game"){
      time = game_date(score);
      scores = false;
    }

    line += chalk.gray(number) + space;
    line += chalk.yellow(match) + space;
    if (scores){
      line += chalk.green(home_score + separator + away_score) + space;
    }
    line += chalk.cyan(time) + space;

    var choice = {
      name: line,
      short: match,
      value: score.api_url
    };
    choices.push(choice);
  });

  choices.push(chalk.gray("Exit"));

  inquirer.prompt([
    {
      type: 'list',
      name: 'url',
      message: 'Select Game to view details :',
      choices: choices,
      pageSize: 20
    }], function (game) {
      cli.debug(game);
     var url = game.url;
    });
}

function get_events(league, event_ids, cb) {
  request(endpoint(league, "event", event_ids), function(error, response, body) {
    if (error) {
      cli.fatal(error);
    }

    cli.debug("getting events");
    parse_scores(JSON.parse(body));
  });
}

function get_schedule(league, past_games_length) {
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
    var event_ids = events.current_group.event_ids;
    var today = new Date();
    cli.debug("events in last " + past_games_length);
    if (events.current_season && past_games_length){
      var matches = 0;
      // reverse search our current season to get games before today up to the limit
      for(i = events.current_season.length; matches <= past_games_length; i--){
        var l = i;
        var e = events.current_season[l - 1];
        var event_date = new Date(e.id + " 00:00:00");
        if(today <= event_date){
          continue;
        }
        event_ids = event_ids.concat(e.event_ids);
        matches++;
      }
    }
    cli.debug("events: " + event_ids.toString());
    get_events(league, event_ids);
  });
}

function get_scores(league, past_days) {
  get_schedule(league, past_days || 0);
}

module.exports = {
  get_scores: get_scores,
  host_name: api_name,
  host: api_link
};
