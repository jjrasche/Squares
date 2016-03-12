var Future = Npm.require("fibers/future");
// // var express = Npm.require('express');
// var phantomjs = Npm.require('phantomjs');
// var page = Npm.require('webpage').create();
var request = Npm.require('request');
var cheerio = Npm.require('cheerio');
var baseUrl = "http://espn.go.com/mens-college-basketball/scoreboard/";
Meteor.methods({
// Specs:KV(RPM/V): 920KVLipo cells:  3SDimensions: 28x31mmMax current: 255WMax Amps: 18ANo Load Current: 0.55A/10VNumber of Poles:  12/14Motor Shaft:  4mmprop shaft: CW/CCW 8mm/6mm threads quick release styleWeight: 58gbolt hole spacing: 16mm x 19mmLamination thickness: 0.2 mmMagnets: N45 SHBearing: EZO JapanBalancing spec: 0.005g
// I20160222-20:24:38.592(-5)? Included:1 x CCW 2216 920kv motor1 x Anodised prop nut

  'scrapeGameData' : function scrape(args) {
    var url = baseUrl + "_/date/20150405";
    // 20150319  20150406 
    var future = new Future();
    var d = "20150319".parseYYYYmmddDate();
    var endDate = "20150406";
    var games = [];

    while (d.yyyymmdd() <= endDate) {
      var dateStr = d.yyyymmdd();
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
          
          console.log("dates: ", d.yyyymmdd(), endDate)
          if (d.yyyymmdd() == endDate){
            console.log("last game")
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
      d.setDate(d.getDate()+1)
    }
    future.wait();

    for (var i = 0; i < games.length; i++) {
      console.log("json: ", JSON.stringify(games[i]));
      Game.insert(games[i]);
    }
  }
})

// Meteor.startup(function() {
//   Meteor.call('scrapeGameData', function(err, res) {
//     if (err) console.log(err);
//     if (res) {
//       //console.log(res);
//     }
//   });
// })

convertJsonToGames = function convertJsonToGames(json) {
  var games = json.events;
  var gameObjects = [];
  games.map(function(game){ 
    var awayTeamData = game.competitions[0].competitors[0].homeAway=="away" ? game.competitions[0].competitors[0] : game.competitions[0].competitors[1];
    var homeTeamData = game.competitions[0].competitors[0].homeAway=="home" ? game.competitions[0].competitors[0] : game.competitions[0].competitors[1];
    var awayTeam = homeTeam = {};

    // console.log(JSON.stringify(homeTeamData));
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

    var game = {
      awayTeam: awayTeam,
      homeTeam: homeTeam,
      homeScore: homeTeamData.score,
      awayScore: awayTeamData.score,
      date: new Date(game.competitions[0].startDate)
    }

    gameObjects.push(game);
  });
  return gameObjects;
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

