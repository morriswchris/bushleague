# Bush League
> Substandard sports tracking on the cli

Ever wanted to check sports scores without leaving the safety of your terminal. We'll the struggle is over. Introducing Bush League. Simply pass in the league you wish to get updates for, and like magic your terminal is updated with all the scores of the night.

## Installation / Usage
To install simply run `npm install -g bushleague`. That's it!

To use, run `bushleague -l <league identifier>`. Running `bushleague --help` will show you a list of all the supported leagues.

```shell
someone at codes in ~/ ➜  bushleague -l nhl
HOME                 SCORE  AWAY                 STATUS
-------------------  -----  -------------------  ---------
Buffalo Sabres       3 - 1  Ottawa Senators      Final
Washington Capitals  4 - 1  Nashville Predators  Final
Winnipeg Jets        0 - 4  Chicago Blackhawks   8:50 3rd
Calgary Flames       3 - 1  Colorado Avalanche   14:12 2nd
Edmonton Oilers      0 - 0  Vancouver Canucks    12:03 2nd
Anaheim Ducks        2 - 0  Boston Bruins        14:50 1st
```

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
