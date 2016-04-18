SB.namespacer('SB.Game.query', { unfinished : 
  [ {'finished': false} ]
});


SB.namespacer('SB.Game.query', { playedYesterday :
  [ {'date': {
      $gte: SB.Date.beginningYesterday(),
      $lt: SB.Date.beginningToday()
    }}
  ]
});

SB.namespacer('SB.Game.query', { yesterdayUnfinished :
  SB.Game.query.unfinished.concat(SB.Game.query.playedYesterday)
});

// same teams same day
SB.namespacer('SB.Game.query.function', { exists :
  function exists(game) {
    return [
      {'homeTeam.name': game.homeTeam.name},
      {'awayTeam.name': game.awayTeam.name},
      {'date': {
        $gte: game.date.clearTime(),
        $lte: game.date.maxTime()
      }}
    ];
  }
});

SB.namespacer('SB.Game.query.function', { mostRecentWeeks :
  function mostRecentWeeks() {
    var mostRecentGameDate = SB.Date.mostRecentGameDate();
    if (!mostRecentGameDate) return [];
    var mostRecentMonday = mostRecentGameDate.mostRecentMonday().clearTime();
    return [{date: {$gte: mostRecentMonday, $lt: SB.Date.endToday()}}];
  }
});

// mostRecentDaysQuery = function mostRecentDaysQuery() {
//   var mostRecentGameDate = getMostRecentGameDate();
//   if (!mostRecentGameDate) return [];
//   return [{date: {$gte: mostRecentGameDate, $lt: getEndTodayDate()}}];
// }
