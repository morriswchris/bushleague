require("console.table");
const program = require("commander");
const request = require("request");
const sleep = require("sleep");
const cli = require("cli");
const ApiHelper = require("./api_helper");
const leagues = ["nfl", "nba", "mlb", "mls", "nhl", "wjhc", "cfl", "ncaaf",
  "ncaab", "uefa", "chlg", "epl", "bund", "liga", "seri", "fran"
];
const league_string = "[" + leagues.toString().replace(/,/g, "|") + "]";

function print_scores(league, options){
  if (!options.verbose) {
    cli.enable("status");
  }
  if(!league) {
    program.outputHelp();
    process.exit();
  }

  ApiHelper.get_scores(league, function(results) {
    console.table(results);
    console.log("\n", "*All results provided by " + ApiHelper.host_name + " (" + ApiHelper.host + ")*");
  });
}

// generate events
program
  .arguments("<league>")
  .option("-v --verbose", "Verbose mode")
  .description(
    `Print the current scores for a given sports league \n \
     supported leagues include: ${league_string} \n`)
  .action(print_scores);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit();
}
