const program = require("commander");
const cli = require("cli");
const Tally = require("tally-rx");
const leagues = ["nfl", "nba", "mlb", "mls", "nhl", "wjhc", "cfl", "ncaaf",
  "ncaab", "uefa", "chlg", "epl", "bund", "liga", "seri", "fran"
];
const league_string = "[" + leagues.toString().replace(/,/g, "|") + "]";

function print_scores(league, options){
  let tallyOpts = {league};

  if(!league) {
    cli.error("No league was specified!");
    program.outputHelp();
    process.exit();
  }
  if (!options.verbose) {
    cli.enable("status");
  }

  if(options.standalone) {
    cli.debug("Max requests set to: 1");
    tallyOpts.max_requests = 1;
  }

  cli.debug(`League: ${league}`);
  let tally = new Tally(tallyOpts);
  tally.subscribe(events => {
    events.map(event => {
      console.log(`Home: ${event.home_team.full_name} - Away: ${event.away_team.full_name}`);
    });
  }, (error) => {
    cli.error(error);
    process.exit();
  });
}

// generate events
program
  .arguments("<league>")
  .option("-s --standalone", "Returns a single score summary request")
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
