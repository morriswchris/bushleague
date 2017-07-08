# BushLeague
> Substandard sports tracking on the cli

![Bushleague Screen Shot](http://i.imgur.com/49RWw6c.png)

Ever wanted to check sports scores without leaving the safety of your terminal. We'll the struggle is over. Introducing Bush League. Simply pass in the league you wish to get updates for, and like magic your terminal is updated with all the scores of the night.

Bushleague uses the [Tally](https://github.com/morriswchris/tally) library to gather sports scores with streams.

## Installation
To install simply run `npm install -g bushleague`. That's it!

## Usage
To use, run 
``` shell
$ bushleague <league>
```
to begin streaming that leagues scores. This will continually run, grabbing new results at an interval of once per minute. 

### Options

#### Standalone
Running bushleague in standalone mode, will fetch results exactly once, and then terminate the script
```shell
$ bushleague mlb -s
```

#### Interval
Specifying an interval using `-i <interval in ms>` will change the rate in which bushleague fetches data.

```shell
$ bushleague nhl -i 0.05 // will result in 3 requests/minute
```

Running `bushleague --help` will show you a list of all the supported leagues and options.

### Supported leagues
- [x] nfl
- [x] nba
- [x] mlb
- [x] mls
- [x] nhl
- [x] wjhc
- [x] cfl
- [x] ncaaf
- [x] ncaab
- [x] uefa
- [x] chlg
- [x] epl
- [x] bund
- [x] liga
- [x] seri
- [x] fran
