unfinishedGamesQuery = [ 
  {'finished': false}
];

yesterdayGamesQuery = [ 
  {'date': {
    $gte: getBeginningYesterdayDate(),
    $lt: getBeginningTodayDate()
  }}
];

yesterdaysGamesUnfinishedQuery = 
  unfinishedGamesQuery.concat(
    yesterdayGamesQuery);

// same teams same day 
gameExistsQuery = function gameExistsQuery(game) {
  return [
    {'homeTeam.name': game.homeTeam.name},
    {'awayTeam.name': game.awayTeam.name},
    {'date': {
      $gte: game.date.getClearedTimeOfDateTime(),
      $lte: game.date.getMaxTimeOfDateTime()
    }}
  ];
}

mostRecentDaysQuery = function mostRecentDaysQuery() {
  var mostRecentGameDate = getMostRecentGameDate();
  if (!mostRecentGameDate) return [];
  return [{date: {$gte: mostRecentGameDate, $lt: getEndTodayDate()}}];
}


DEFAULT_DATA_REFRESH = 30000000; 
// retrieve new game data at set interval
var automateGameData
if (Meteor.isServer) {
  automateGameData = Meteor.setInterval( function(){ 
    Meteor.call('scrapeGameData', function(err, res) {
      if (err) console.log(err);
    })
  }, DEFAULT_DATA_REFRESH);
}

Meteor.methods({
  'changeRefreshRate' : function changeRefreshRate(rate) {
    if (Meteor.isServer) {
      console.log("changed data refresh rate to " + rate);
      clearInterval(automateGameData);
      automateGameData = Meteor.setInterval( function(){ 
        Meteor.call('scrapeGameData', function(err, res) {
          if (err) console.log(err);
        })
      }, rate * 1000);
    }
  },
  'refreshGamesBetweenDates' : function refreshGamesBetweenDates(startDate, endDate) {
    if (Meteor.isServer) {
      Meteor.call("scrapeGameData", startDate, endDate, function(err, res) {
        if (err) console.log(err);        
      })
    }
  },
  // defualt search is current date unless specified via inputs
  'scrapeGameData' : function scrapeGameData(start, end) {
    if (Meteor.isServer) {
      var Future = Npm.require("fibers/future");
      var request = Npm.require('request');
      var cheerio = Npm.require('cheerio');
      var baseUrl = "http://espn.go.com/mens-college-basketball/scoreboard/";

      // 20150319  20150406 
      var future = new Future();
      var startDate = new Date(), endDate = new Date();//"20150319".parseYYYYmmddDate();
      if (start) startDate = start, endDate = start;
      if (end) endDate = end;

      if (startDate > endDate) 
        throw new Meteor.Error("startDate '" + startDate + "' cannot be greater than endDate '" + endDate + "'");

      // if unfinished games from the day before, look at yesterday's page too
      if (Game.find({$and: yesterdaysGamesUnfinishedQuery}).count()) {
        startDate.addDays(-1);
        console.log("yesterdaysGamesUnfinishedQuery: ", startDate);
      }

      var games = [];

      while (startDate.yyyymmdd() <= endDate.yyyymmdd()) {
        var dateStr = startDate.yyyymmdd();
        var url = baseUrl + "_/date/" + dateStr;
        console.log("url: ", url);
        var future2 = new Future();
        request(url, function(error, response, html){
          if(!error){
            var str;
            var $ = cheerio.load(html);
            $('script').each( function () {
              var scriptText = $(this).text();
              if (scriptText.indexOf("window.espn.scoreboardData") != -1) {
                str = scriptText;
                str = str.split(";window.espn.scoreboardSettings")[0];
                str = str.substring(str.indexOf("{"));
              }
            });
            var gamesJson = JSON.parse(str);
            var newGames = convertJsonToGames(gamesJson);
            
            // console.log("dates: ", startDate.yyyymmdd(), endDate.yyyymmdd(), (startDate.yyyymmdd() == endDate.yyyymmdd()))
            if (startDate.yyyymmdd() == endDate.yyyymmdd()){
              future.return();
            }
            future2.return(newGames);
          }
          else {
            console.log(error)
            future.return(error);
          }
        });  
        games = games.concat(future2.wait());
        startDate.setDate(startDate.getDate()+1)
      }
      future.wait();
      for (var i = 0; i < games.length; i++) {
        // console.log("json: ", JSON.stringify(games[i]));
        insertOrUpdateGame(games[i]);
      }
    }
  }
});

insertOrUpdateGame = function insertOrUpdateGame(game) {
  // attempt to find game. Unique = (homeTeam, awayTeam, started same day)
  var beginningOfDay = getBeginningTodayDate();
  var endOfDay = getEndTodayDate();

  var exists = Game.findOne({
    $and: gameExistsQuery(game)
  });

  if (exists) {
    var ret = Game.update({_id: exists._id},{
      $set: {
        'homeScore': game.homeScore,
        'awayScore': game.awayScore,
        'finished': game.finished,
        'round': game.round,
        'time': game.time,
        'date': game.date
      }
    });
    console.log("updated: ", exists._id, game.homeScore + ' ' + game.awayScore + ' ' + game.date + ' ' + game.finished, game.time);
  }
  else {
    var ret = Game.insert(game);
    console.log("inserted: ", game.homeScore + ' ' + game.awayScore + ' ' + game.date + ' ' + game.finished, game.time);
  }
}




// Meteor.startup(function() {
//   Meteor.call('scrapeGameData', function(err, res) {
//     if (err) console.log(err);
//     if (res) {
//       //console.log(res);
//     }
//   });
// })


convertJsonToGames = function convertJsonToGames(json) {
  var events = json.events;
  var gameObjects = [];
  events.map(function(event){ 
    var game = convertJsonGame(event);

    gameObjects.push(game);
  });
  return gameObjects;
}

convertJsonGame = function (event) {
  var awayTeamData = event.competitions[0].competitors[0].homeAway=="away" ? 
                      event.competitions[0].competitors[0] : 
                      event.competitions[0].competitors[1];
  var homeTeamData = event.competitions[0].competitors[0].homeAway=="home" ? 
                      event.competitions[0].competitors[0] : 
                      event.competitions[0].competitors[1];
  var awayTeam = homeTeam = {};

  var awayTeam = {
    name: awayTeamData.team.shortDisplayName,
    record: {
      wins: awayTeamData.records[0].summary.split('-')[0],
      loses: awayTeamData.records[0].summary.split('-')[1]
    },
    seed: awayTeamData.curatedRank.current
  };
  var homeTeam = {
    name: homeTeamData.team.shortDisplayName,
    record: {
      wins: homeTeamData.records[0].summary.split('-')[0],
      loses: homeTeamData.records[0].summary.split('-')[1]
    },
    seed: homeTeamData.curatedRank.current
  };

  var dbGame = {
    awayTeam: awayTeam,
    homeTeam: homeTeam,
    homeScore: homeTeamData.score,
    awayScore: awayTeamData.score,
    date: new Date(event.competitions[0].startDate),
    time: formatGameTime(event.competitions[0].status),
    finished: event.status.type.completed
  }

  var locAndRound = event.competitions[0].notes[0].headline.split('-').map(function(s){ return s.trim() });
  if (locAndRound.length == 3) {
    dbGame.location = locAndRound[1];
    dbGame.round = getRoundIndex(locAndRound[2]);
  }
  else if (locAndRound.length == 2)
    dbGame.round = getRoundIndex(locAndRound[1]);    
  else 
    throw new Meteor.Error("could not properly format (" + event.competitions[0].notes[0].headline + ")");  

  return dbGame;
}

formatGameTime = function formatGameTime(status) {
  var time = {};
  time.period = status.period;
  time.secLeft = status.clock;
  return time;
}

getRoundIndex = function getRoundIndex(roundName) {
  switch(roundName) {
    case "FIRST FOUR":
      return 0;
    case "1ST ROUND": 
      return 1;
    case "2ND ROUND": 
      return 2;
    case "SWEET 16": 
      return 3;
    case "ELITE 8": 
      return 4;
    case "FINAL FOUR": 
      return 5;
    case "NATIONAL CHAMPIONSHIP": 
      return 6;
    default: 
      throw new Meteor.Error("roundName not valid: " + roundName);
  }
}


String.prototype.parseYYYYmmddDate = function() {
    var y = this.substr(0,4),
        m = this.substr(4,2) - 1,
        d = this.substr(6,2);
    var D = new Date(y,m,d);
    return (D.getFullYear() == y && D.getMonth() == m && D.getDate() == d) ? D : 'invalid date';
}


 Date.prototype.yyyymmdd = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
  };

