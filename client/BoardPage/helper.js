// javascript controlling events and helpers of the templates from helper.html
// var boardData = {name: 'firstBoard', winnerNumbers: [0,1,2,3,4,5,6,7,8,9], loserNumbers: [0,1,2,3,4,5,6,7,8,9], sq00: 'N/A', sq01: 'N/A', sq02: 'N/A', sq03: 'N/A', sq04: 'N/A', sq05: 'N/A', sq06: 'N/A', sq07: 'N/A', sq08: 'N/A', sq09: 'N/A', sq10: 'N/A', sq11: 'N/A', sq12: 'N/A', sq13: 'N/A', sq14: 'N/A', sq15: 'N/A', sq16: 'N/A', sq17: 'N/A', sq18: 'N/A', sq19: 'N/A', sq20: 'N/A', sq21: 'N/A', sq22: 'N/A', sq23: 'N/A', sq24: 'N/A', sq25: 'N/A', sq26: 'N/A', sq27: 'N/A', sq28: 'N/A', sq29: 'N/A', sq30: 'N/A', sq31: 'N/A', sq32: 'N/A', sq33: 'N/A', sq34: 'N/A', sq35: 'N/A', sq36: 'N/A', sq37: 'N/A', sq38: 'N/A', sq39: 'N/A', sq40: 'N/A', sq41: 'N/A', sq42: 'N/A', sq43: 'N/A', sq44: 'N/A', sq45: 'N/A', sq46: 'N/A', sq47: 'N/A', sq48: 'N/A', sq49: 'N/A', sq50: 'N/A', sq51: 'N/A', sq52: 'N/A', sq53: 'N/A', sq54: 'N/A', sq55: 'N/A', sq56: 'N/A', sq57: 'N/A', sq58: 'N/A', sq59: 'N/A', sq60: 'N/A', sq61: 'N/A', sq62: 'N/A', sq63: 'N/A', sq64: 'N/A', sq65: 'N/A', sq66: 'N/A', sq67: 'N/A', sq68: 'N/A', sq69: 'N/A', sq70: 'N/A', sq71: 'N/A', sq72: 'N/A', sq73: 'N/A', sq74: 'N/A', sq75: 'N/A', sq76: 'N/A', sq77: 'N/A', sq78: 'N/A', sq79: 'N/A', sq80: 'N/A', sq81: 'N/A', sq82: 'N/A', sq83: 'N/A', sq84: 'N/A', sq85: 'N/A', sq86: 'N/A', sq87: 'N/A', sq88: 'N/A', sq89: 'N/A', sq90: 'N/A', sq91: 'N/A', sq92: 'N/A', sq93: 'N/A', sq94: 'N/A', sq95: 'N/A', sq96: 'N/A', sq97: 'N/A', sq98: 'N/A', sq99: 'N/A'}
// [[0,0,"a"],[0,1,"a"],[0,2,"a"],[0,3,"a"],[0,4,"a"],[0,5,"a"],[0,6,"a"],[0,7,"a"],[0,8,"a"],[0,9,"a"],[1,0,"a"],[1,1,"a"],[1,2,"a"],[1,3,"a"],[1,4,"a"],[1,5,"a"],[1,6,"a"],[1,7,"a"],[1,8,"a"],[1,9,"a"],[2,0,"a"],[2,1,"a"],[2,2,"a"],[2,3,"a"],[2,4,"a"],[2,5,"a"],[2,6,"a"],[2,7,"a"],[2,8,"a"],[2,9,"a"],[3,0,"a"],[3,1,"a"],[3,2,"a"],[3,3,"a"],[3,4,"a"],[3,5,"a"],[3,6,"a"],[3,7,"a"],[3,8,"a"],[3,9,"a"],[4,0,"a"],[4,1,"a"],[4,2,"a"],[4,3,"a"],[4,4,"a"],[4,5,"a"],[4,6,"a"],[4,7,"a"],[4,8,"a"],[4,9,"a"],[5,0,"a"],[5,1,"a"],[5,2,"a"],[5,3,"a"],[5,4,"a"],[5,5,"a"],[5,6,"a"],[5,7,"a"],[5,8,"a"],[5,9,"a"],[6,0,"a"],[6,1,"a"],[6,2,"a"],[6,3,"a"],[6,4,"a"],[6,5,"a"],[6,6,"a"],[6,7,"a"],[6,8,"a"],[6,9,"a"],[7,0,"a"],[7,1,"a"],[7,2,"a"],[7,3,"a"],[7,4,"a"],[7,5,"a"],[7,6,"a"],[7,7,"a"],[7,8,"a"],[7,9,"a"],[8,0,"a"],[8,1,"a"],[8,2,"a"],[8,3,"a"],[8,4,"a"],[8,5,"a"],[8,6,"a"],[8,7,"a"],[8,8,"a"],[8,9,"a"],[9,0,"a"],[9,1,"a"],[9,2,"a"],[9,3,"a"],[9,4,"a"],[9,5,"a"],[9,6,"a"],[9,7,"a"],[9,8,"a"],[9,9,"a"]];


/*
    TODO:
    X size labels within squares  
    X color squares 
    X all selecting of multiple squares and assigning to an email 
      X send an invitation email to that person 
    X create lock board functionality
      X assing random numbers to column on locking
    X create layout 
    - sort member columns
    X display games on board 
    - test updating board data
    - be able to select a game from gameList or member from memberlist and highlight all effected squares
    - enable/test realtime game updates
    - enforce square numbers

    priorities for beta:
    X ensuring login works with usernames
    - data entry 
    - annotating games as old
    - sortable member list
    - recording member activity 

    - chat widget
    - realtime board updates with changing game information
*/


Session.set('boardPageselectedSquares', []);
Session.set('boardPageselectedGames', []);
Session.set('boardPageselectedMembers', []);
Session.set('boardPageEditMode', false);

Template.editCheckBox.events({
  'click #editCheckBox' : function(event){
    //event.preventDefault();
    var val = document.querySelector('#editCheckBox:checked');
    console.log("editCheckBox.events(: ", val);
    if (val) Session.set('boardPageEditMode', true);
    else {
      Session.set('boardPageEditMode', false);
      Session.set('boardPageselectedSquares', []);
    }
    console.log(Session.get('boardPageEditMode'));
  }
})

// Template.assignSquaresModal.events({
//   'click #assignSelectedSquares' : function(event){
//     //event.preventDefault();
//     Modal.show('assignSquaresModal');

//   }
// })

Template.editWidget.helpers({
  boardOwner: function() {
    return isOwner(getBoard(), Meteor.user());
  },
  squareSize: function () {
    return JSON.stringify(Session.get('size'));
  },
  selectedSquares: function () {
    return JSON.stringify(Session.get('boardPageselectedSquares'));
  },
  inEditMode: function () {
    return Session.get('boardPageEditMode')  
           //&& Session.get('boardPageselectedSquares').length > 0;
  }
})


Template.grid.helpers({
  createChart: function () {
    var board = this;
    var winnerNumbers = board.winnerNumbers == null ? ['','','','','','','','','',''] : board.winnerNumbers;
    var loserNumbers = board.loserNumbers == null ? ['','','','','','','','','',''] : board.loserNumbers;

    var selectedSquares = Session.get('boardPageselectedSquares');
    var selectedGames = Session.get('boardPageselectedGames');
    var games = Game.find().fetch();
    var gameMatrix = getGamesMatrix(games);
      // Use Meteor.defer() to craete chart after DOM is ready:
      Meteor.defer(function() {
        // Create standard Highcharts chart with options:
        Highcharts.chart('chart1', {
          chart: { 
              // renderTo: 'chart1'
              type: 'heatmap', 
              // Edit chart spacing
              spacingBottom: 15,
              spacingTop: 0,
              spacingLeft: 10,
              spacingRight: 10,

              // Explicitly tell the width and height of a chart
              // width: 1000,//480,
              // height: 1000//480
          },
          title: { text: '' },
          xAxis: { categories: winnerNumbers, 
                   tickLength: 0,
                   minorTickLength: 0,
                   opposite: true, 
                   title: {
                      text: 'Winners',
                      style: {
                        fontWeight: "bold",
                        fontSize: 30
                      },
                      // margin: 10,
                      // offset: 2
                   }
                 },
          yAxis: { categories: loserNumbers,  
                   tickLength: 0,
                   minorTickLength: 0,
                   title: {
                      text: 'Losers',
                      style: {
                        fontWeight: "bold",
                        fontSize: 30
                      }
                   }
                 },
          plotOptions: {
              series: {
                  events: {
                      click: function(e) {
                        var x = e.point.x; 
                        var y = e.point.y;

                        // if in edit mode, change color of selected squares save in session
                        if (Session.get('boardPageEditMode')) {
                          if (squareSelected(x, y)) {
                            selectedSquares = selectedSquares.filter(function(ele) {
                                return !(ele.x == x && ele.y == y)
                            });
                          } else {
                            selectedSquares.push({x: x, y: y});
                          }
                          Session.set('boardPageselectedSquares', selectedSquares);
                        } 
                        else {
                          // console.log("event: ", board);
                          Meteor.call('modifyBoard', board._id, Meteor.userId(), [{x,y}], function(err, res) {
                            if (err) 
                              handleServerError(err);
                          });
                        }
                      }
                  }
              }
          },
          tooltip: {
              formatter: function () {
                var x = this.point.x;
                var y = this.point.y;
                var realx = this;
                var games = gameMatrix[x][y];
                var ret = "<b><u>Games Hit:</u></b><br>";
                for (var i = 0; i < games.length; i++) {
                  var game = games[i];
                  ret += game.homeTeam.name + " " + game.homeScore + " " +
                         game.awayTeam.name + " " + game.awayScore + "<br>"
                }
                return ret;
                        //gameMatrix[x][y] + calculateNumPoints(x,y); //"(" + x + "," + y + ")";
              }
          },
          colorAxis: {
              stops: [
                  [0, '#3060cf'],
                  [0.5, '#fffbbc'],
                  [0.9, '#c4463a']]
          },
          series: [{
              name: '',
              title: '',
              borderWidth: 3,
              backgroundColor: '#303030',
              data: formatBoardData(),
              dataLabels: {
                formatter: function () {
                      // only do this once per board to be uniform
                      var square = {x: this.point.x, y: this.point.y};
                      if (square.x==0 && square.y==0) {
                        var size = this.point.shapeArgs.height;
                        // console.log(this);
                        var charactersPerLine = (size < 30) ? 5 : Math.floor(size/10);
                        Session.set('boardPageCharactersPerLine', charactersPerLine);
                        Session.set('size', {chars:  charactersPerLine, size: size});
                        // console.log('charperline: ', charactersPerLine);
                      }
                      var squareScore = getSquareScoreFromMatrix(board, square, gameMatrix);
                      var charactersPerLine = Session.get('boardPageCharactersPerLine');
                      var text = this.point.value;
                      var formatted = text.length > charactersPerLine ? text.substring(0, charactersPerLine) + '...' : text;
                      // console.log("formatter: ", text, size, charactersPerLine, formatted, this.x, this.y);
                      return '<div class="js-ellipse" style="" title="' 
                              + text + '">' + formatted + '<br>' + squareScore + '</br>' + '</div>'
                              ;
                },
                allowOverlap: false,
                enabled: true,
                color: '#000000',
                crop: true,
                borderColor: 'red',
                borderWidth: 0,
                padding: 0,
                //shadow: true,
                style: {
                    fontWeight: 'bold'
                }
              },
    //          tooltip: {
    //              headerFormat: '<b>Games hit</b> <br/>',
    //              pointFormat: 'uconn 52 delaware 43 rnd 1 <br/> miami 52 Michigan 43 rnd 2 <br/>'
    //          }
          }],
          legend: {
            enabled: false
          },            
      })
    });
  }
})

Template.lockBoardButton.events({
  'click #lockBoardButton': function(event) {
    if (window.confirm('cannot undo')) {
      Meteor.call('randomizeBoardNumbers', this._id, function(err, res) {
        if (err) console.log(err);
      })
    }
  }
})

Template.invitePlayersModal.events({
  'click #invitePlayersButton' : function(event){
    //event.preventDefault();
    if($('#invitePlayersButton').hasClass('disabled')) return;
    console.log("click #invitePlayersButton: ", this);
    Modal.show('invitePlayersModal', this);
  },
  'submit #invitePlayerForm' : function(event) {
    event.preventDefault();
    var squares = Session.get('boardPageselectedSquares');
    var email = event.target.email.value == '' ? null : event.target.email.value;
    var userName = event.target.userName.value;
    var board = getBoard();
    var boardID = board._id;
    var userID;
    console.log("submit #invitePlayerForm  this: ", this, userName, email);

    // if email address is attached to user and user already a member, error
    var existingUser = Meteor.users.findOne({$and: [
      {'emails.address': {$in: [null]}}, 
      {'emails.address': {$exists: true}}
      ]})
    if (existingUser && userIsMemberOfBoard(board, existingUser)) {
      console.log("existingUser: ", existingUser);
      throw new Meteor.Error("User already on board, try re-assigning squares");
    }

    // create user if doesn't exist
    if (!existingUser) {
      console.log("inserting new user",  boardID, email, userName, squares);
      Meteor.call('createUserAndInvitation', boardID, email, userName, squares, 
        function(err, res) {
          console.log("createUser callback: ", err, res);
            if (err)
              handleServerError(err);
            userID = res
      })
    }
    else {
      console.log("found existing user: ", existingUser);
      userID = existingUser._id;
      Meteor.call('sendInvitation', boardID, userID, squares, 
        function(err, res) {
          if (err)
            handleServerError(err);
      });
    }

    Session.set('boardPageselectedSquares', []);
    Modal.hide('invitePlayersModal');
  }
});


Template.assignSquaresModal.events({
  'click #assignSelectedSquares' : function(event){
    //event.preventDefault();
    if($('#assignSelectedSquares').hasClass('disabled')) return;
    console.log("click #assignSelectedSquares: ", this);
    Modal.show('assignSquaresModal', this);
  },
  'submit #assignSquareForm' : function(event) {
    event.preventDefault();
    var squares = Session.get('boardPageselectedSquares');
    var userID = $(event.target.members).find(':selected').data("id");

    try {
      Meteor.call('modifyBoard', this._id, userID, squares, function(err, res) {
        if (err)
          handleServerError(err);
      });
    } catch (e) {}
    Session.set('boardPageselectedSquares', []);
    Modal.hide('assignSquaresModal');
  }
});


Template.changeBoardOwnershipModal.events({
  'click #changeBoardOwnershipButton' : function(event){
    //event.preventDefault();
    Modal.show('changeBoardOwnershipModal', this);
  },
  'submit #addBoardOwnerForm' : function(event) {
    event.preventDefault();
    var userID = $(event.target.members).find(':selected').data("id");

    Meteor.call('addOwner', this._id, userID, function(err, res) {
      if (err)
        handleServerError(err);
    });

    Modal.hide('changeBoardOwnershipModal');
  }
});


Template.boardMemeberSelector.helpers({
  boardMembers : function() {
    return getBoardMemberUsers(this);
  }
})


Template.gameList.events({
  "click .gameItems": function(event) {
    var selectedGame = $(event.currentTarget).attr("data-id");
    var games = Session.get('boardPageselectedGames');

    if (!gameIsSelected(selectedGame)) 
      games.push(selectedGame);                       // add
    else
      games.splice(games.indexOf(selectedGame), 1);   // remove

    console.log("click .gameItems", games);
    Session.set('boardPageselectedGames', games);
  }
})
Template.gameList.helpers({
  games : function() {
    var games = Game.find();
    return games;
  }
});
Template.gameItem.helpers({
  backgroundColor : function(){
    var games = Session.get('boardPageselectedGames');
    if (games.indexOf(this._id) != -1) {
      return "blue";
    }
    return "white";
  }
})

Template.memberList.helpers({
  members : function() {
    var memberIDs = this.members.map(function(m) {return m._id});
    var members = Meteor.users.find({_id: {$in: memberIDs}})
    // console.log("members: ", memberIDs, members);
    return members;
  },
  header : function() {
    return {
      name: "member",
      numSquares: "#",
      winnings: "$",
      paid: "paid"
    }
  }
});
Template.memberItem.helpers({
  name: function() {
    if (this == "header") return "member";
    return this.profile.userName;
  },
  numSquares: function(board) {
    if (this == "header") return "#";
    return getUserTotalNumSquares(board, this);    
  },
  winnings: function(board) {
    if (this == "header") return "$";
    var games = Game.find({finished: true}).fetch();
    var ret = getUserWinnings(board, games, this);
    return ret;
  },
  paid: function(board) {
    if (this == "header") return "paid";
    var ret = getUserPaid(board, this);
    return getUserPaid(board, this)== true ? 'Y' : 'N'
  },
})



Template.registerHelper('boardPageEditButtonDisabled', 
  function(){
    if (Session.get('boardPageEditMode') ) {
        //&& Session.get('boardPageselectedSquares').length > 0)
      return "";
    }
    else 
      return "disabled";
  }
);


handleServerError = function handleServerError(err) {
  console.log(err);
  alert(err);
}

Template.registerHelper('printThis',
  function(name) {
    console.log("printThis (" + name + "): " , this);
})

