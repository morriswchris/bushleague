require("console.table");
var request = require("request");
var cli = require("cli");
var ApiHelper = require("./api_helper");
var leagues = ["nfl", "nba", "mlb", "mls", "nhl", "wjhc", "cfl", "ncaaf",
  "ncaab", "uefa", "chlg", "epl", "bund", "liga", "seri", "fran"
];
var league_string = "[" + leagues.toString().replace(/,/g, "|") + "]";

cli.parse({
  league: ["l", "The League you wish to search. These include: " +
    league_string, "string"
  ],
  debug: ["d", "Add verbose output", "bool"]
});

cli.main(function(args, options) {
  var server, middleware = [];

  if (!options.debug) {
    cli.enable("status");
  }

  if (!options.league || leagues.indexOf(options.league) < 0) {
    cli.fatal(
      "Please specify a valid league using the -l or --league command followed by:\n\n" +
      league_string
    );
  }

  ApiHelper.get_scores(options.league, function(results) {
    console.table(results);
  });
});
