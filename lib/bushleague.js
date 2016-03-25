require("console.table");
var request = require("request");
var cli = require("cli");
var ApiHelper = require("./api_helper");
var leagues = ["nfl", "nba", "mlb", "mls", "nhl", "wjhc", "cfl", "ncaaf",
  "ncaab", "uefa", "chlg", "epl", "bund", "liga", "seri", "fran"
];
var league_string = "[" + leagues.toString().replace(/,/g, "|") + "]";
var cached_options;

function print_scores(){
  ApiHelper.get_scores(cached_options.league, function(results) {
    console.table(results);
    console.log("\n", "*All results provided by " + ApiHelper.host_name + " (" + ApiHelper.host + ")*");
  });
}

cli.parse({
  league: ["l", "The League you wish to search. These include: " +
    league_string, "string"
  ],
  debug: ["d", "Add verbose output", "bool"],
  interval: ["i", "Rerun bushleague at an interval", "int"]
});

cli.main(function(args, options) {
  var server, middleware = [];
  cached_options = options;
  if (!options.debug) {
    cli.enable("status");
  }

  if (!options.league || leagues.indexOf(options.league) < 0) {
    cli.fatal(
      "Please specify a valid league using the -l or --league command followed by:\n\n" +
      league_string
    );
  }

  if (options.interval){
   cli.enable("daemon");
   var interval = options.interval * 1000;
   var intervalID = setInterval(print_scores, interval);
   this.ok("Running bushleague with interval of " + options.interval + " seconds");
  }
  print_scores();
});
