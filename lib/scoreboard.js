const chalk = require("chalk");

function game_date(game){
  var date = new Date(game);
  return date.toTimeString();
}

module.exports = function(event, loading = false) {

  let output = {};

  //away team + score
  let awayTeam = event.away_team;
  // output.push(`${chalk.bgHex(awayTeam.colour_1).inverse(awayTeam.full_name)} ${event.box_score.score.away.score} -`);
  output.away = `${awayTeam.full_name}`;

  //score
  output.score = `${event.box_score.score.away.score} - ${event.box_score.score.home.score}`;

  // Home team + score
  let homeTeam = event.home_team;
  // output.push(`${event.box_score.score.home.score} ${chalk.bgHex(homeTeam.colour_1).bold(homeTeam.full_name)}`);
  output.home = `${homeTeam.full_name}`;

  //time left
  output.status = event.box_score.progress.clock_label;
  if(event.status === "pre_game"){
    output.status += ` [${game_date(event.game_date)}]`;
  }

  return output;
};
