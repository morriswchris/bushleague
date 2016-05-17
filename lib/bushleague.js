require("console.table");
var program = require("commander");
var ApiHelper = require("./api_helper");
var pkg = require("../package.json");
var leagues = ["nfl", "nba", "mlb", "mls", "nhl", "wjhc", "cfl", "ncaaf",
  "ncaab", "uefa", "chlg", "epl", "bund", "liga", "seri", "fran"
];

program.version(pkg.version).description(pkg.description);

program.arguments("<league> [days]")
.description("List a set of games for the following leagues: " + leagues.toString())
.action(function(league, days){
  cmdLeague = league;
  ApiHelper.get_scores(league, days || 0);
});

program.parse(process.argv);
if (typeof cmdLeague === "undefined") {
  //Show help by default
  program.outputHelp();
}
