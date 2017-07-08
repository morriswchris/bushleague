function game_date(game){
  var date = new Date(game);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

module.exports = function(event, loading = false) {

  let output = {};

  let awayTeam = event.away_team;
  let homeTeam = event.home_team;

  output.away = `${awayTeam.full_name}`;

  let boxScore = event.box_score;

  output.score = boxScore && boxScore.score ? `${boxScore.score.away.score} - ${boxScore.score.home.score}` : "0 - 0";

  output.home = `${homeTeam.full_name}`;

  output.status = boxScore ? event.box_score.progress.clock_label : event.event_status;
  if(event.status === "pre_game"){
    output.status += ` [${game_date(event.game_date)}]`;
  }

  return output;
};
