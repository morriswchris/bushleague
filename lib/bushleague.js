const program = require("commander");
const chalk = require("chalk");
const logUpdate = require("log-update");
const Columnify = require("columnify");
const cli = require("cli");
const Tally = require("tally-rx");
const ScoreBoard = require("./scoreboard");

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

  if(options.interval) {
    tallyOpts.requests_per_second = options.interval;
  }

  cli.debug(`League: ${league}`);
  let tally = new Tally(tallyOpts);

  tally.subscribe(events => {
    let output = [];
    events.map(event => {
      output.push(ScoreBoard(event));
    });
    output.push({status: ""});
    output.push({status: ""});
    output.push({status: "------"});
    output.push({status: `Updated: ${new Date()}`}); //use moment here
    output.push({status: "Provider: TheScore"});
    logUpdate(Columnify(output, { headingTransform: (heading) => chalk.underline.bold(heading.toUpperCase())}));
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
  .option("-i --interval <requests_per_second>", "Specify how often you want to fetch scores. Default is 0.01 (or 1 per minute)")
  .description(
    `Print the current scores for a given sports league \n \
     supported leagues include: ${league_string} \n`)
  .action(print_scores);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit();
}
