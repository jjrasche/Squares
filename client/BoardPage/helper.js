// javascript controlling events and helpers of the templates from helper.html
// var boardData = {name: 'firstBoard', winnerNumbers: [0,1,2,3,4,5,6,7,8,9], loserNumbers: [0,1,2,3,4,5,6,7,8,9], sq00: 'N/A', sq01: 'N/A', sq02: 'N/A', sq03: 'N/A', sq04: 'N/A', sq05: 'N/A', sq06: 'N/A', sq07: 'N/A', sq08: 'N/A', sq09: 'N/A', sq10: 'N/A', sq11: 'N/A', sq12: 'N/A', sq13: 'N/A', sq14: 'N/A', sq15: 'N/A', sq16: 'N/A', sq17: 'N/A', sq18: 'N/A', sq19: 'N/A', sq20: 'N/A', sq21: 'N/A', sq22: 'N/A', sq23: 'N/A', sq24: 'N/A', sq25: 'N/A', sq26: 'N/A', sq27: 'N/A', sq28: 'N/A', sq29: 'N/A', sq30: 'N/A', sq31: 'N/A', sq32: 'N/A', sq33: 'N/A', sq34: 'N/A', sq35: 'N/A', sq36: 'N/A', sq37: 'N/A', sq38: 'N/A', sq39: 'N/A', sq40: 'N/A', sq41: 'N/A', sq42: 'N/A', sq43: 'N/A', sq44: 'N/A', sq45: 'N/A', sq46: 'N/A', sq47: 'N/A', sq48: 'N/A', sq49: 'N/A', sq50: 'N/A', sq51: 'N/A', sq52: 'N/A', sq53: 'N/A', sq54: 'N/A', sq55: 'N/A', sq56: 'N/A', sq57: 'N/A', sq58: 'N/A', sq59: 'N/A', sq60: 'N/A', sq61: 'N/A', sq62: 'N/A', sq63: 'N/A', sq64: 'N/A', sq65: 'N/A', sq66: 'N/A', sq67: 'N/A', sq68: 'N/A', sq69: 'N/A', sq70: 'N/A', sq71: 'N/A', sq72: 'N/A', sq73: 'N/A', sq74: 'N/A', sq75: 'N/A', sq76: 'N/A', sq77: 'N/A', sq78: 'N/A', sq79: 'N/A', sq80: 'N/A', sq81: 'N/A', sq82: 'N/A', sq83: 'N/A', sq84: 'N/A', sq85: 'N/A', sq86: 'N/A', sq87: 'N/A', sq88: 'N/A', sq89: 'N/A', sq90: 'N/A', sq91: 'N/A', sq92: 'N/A', sq93: 'N/A', sq94: 'N/A', sq95: 'N/A', sq96: 'N/A', sq97: 'N/A', sq98: 'N/A', sq99: 'N/A'}
// [[0,0,"a"],[0,1,"a"],[0,2,"a"],[0,3,"a"],[0,4,"a"],[0,5,"a"],[0,6,"a"],[0,7,"a"],[0,8,"a"],[0,9,"a"],[1,0,"a"],[1,1,"a"],[1,2,"a"],[1,3,"a"],[1,4,"a"],[1,5,"a"],[1,6,"a"],[1,7,"a"],[1,8,"a"],[1,9,"a"],[2,0,"a"],[2,1,"a"],[2,2,"a"],[2,3,"a"],[2,4,"a"],[2,5,"a"],[2,6,"a"],[2,7,"a"],[2,8,"a"],[2,9,"a"],[3,0,"a"],[3,1,"a"],[3,2,"a"],[3,3,"a"],[3,4,"a"],[3,5,"a"],[3,6,"a"],[3,7,"a"],[3,8,"a"],[3,9,"a"],[4,0,"a"],[4,1,"a"],[4,2,"a"],[4,3,"a"],[4,4,"a"],[4,5,"a"],[4,6,"a"],[4,7,"a"],[4,8,"a"],[4,9,"a"],[5,0,"a"],[5,1,"a"],[5,2,"a"],[5,3,"a"],[5,4,"a"],[5,5,"a"],[5,6,"a"],[5,7,"a"],[5,8,"a"],[5,9,"a"],[6,0,"a"],[6,1,"a"],[6,2,"a"],[6,3,"a"],[6,4,"a"],[6,5,"a"],[6,6,"a"],[6,7,"a"],[6,8,"a"],[6,9,"a"],[7,0,"a"],[7,1,"a"],[7,2,"a"],[7,3,"a"],[7,4,"a"],[7,5,"a"],[7,6,"a"],[7,7,"a"],[7,8,"a"],[7,9,"a"],[8,0,"a"],[8,1,"a"],[8,2,"a"],[8,3,"a"],[8,4,"a"],[8,5,"a"],[8,6,"a"],[8,7,"a"],[8,8,"a"],[8,9,"a"],[9,0,"a"],[9,1,"a"],[9,2,"a"],[9,3,"a"],[9,4,"a"],[9,5,"a"],[9,6,"a"],[9,7,"a"],[9,8,"a"],[9,9,"a"]];


/*
    TODO:
    X size labels within squares  
    X color squares 
    X all selecting of multiple squares and assigning to an email 
      X send an invitation email to that person 
    - create lock board functionality
    - create layout 
*/


Session.set('boardPageselectedSquares', []);
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
          xAxis: { //categories: winnerNumbers, 
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
                   },
                   labels: {
                    enabled: false,
                    padding: 0
                   }
                 },
          yAxis: { //categories: loserNumbers,  
                   tickLength: 0,
                   minorTickLength: 0,
                   title: {
                      text: 'Losers',
                      style: {
                        fontWeight: "bold",
                        fontSize: 30
                      }
                   },
                   labels: {
                    enabled: false,
                    padding: 0
                   }
                 },
          plotOptions: {
              series: {
                  events: {
                      click: function(e) {
                        var x = e.point.x; var y = e.point.y;

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
                          console.log("event: ", board);
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
                var x = this.series.xAxis.categories[this.point.x];
                var y = this.series.yAxis.categories[this.point.y];
                  return "<b><u>Games Hit:</u></b><br>"// + gameData[x][y] + calculateNumPoints(x,y); //"(" + x + "," + y + ")";
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
                      if (this.point.x==0 && this.point.y==0) {
                        var size = this.point.shapeArgs.height;
                        // console.log(this);
                        var charactersPerLine = (size < 30) ? 5 : Math.floor(size/10);
                        Session.set('boardPageCharactersPerLine', charactersPerLine);
                        Session.set('size', {chars:  charactersPerLine, size: size});
                        // console.log('charperline: ', charactersPerLine);
                      }
                      var charactersPerLine = Session.get('boardPageCharactersPerLine');
                      var text = this.point.value;
                      var formatted = text.length > charactersPerLine ? text.substring(0, charactersPerLine) + '...' : text;
                      // console.log("formatter: ", text, size, charactersPerLine, formatted, this.x, this.y);
                      return '<div class="js-ellipse" style="width:150px; overflow:hidden" title="' + text + '">' + formatted  + '</div>';
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
    var email = event.target.email.value;
    var userName = event.target.userName.value;
    var board = getBoard();
    var boardID = board._id;
    var userID;
    console.log("submit #invitePlayerForm  this: ", this, userName, email);

    // if email address is attached to user and user already a member, error
    var existingUser = Meteor.users.findOne({emails: {$in: [email]}});
    if (existingUser && userIsMemberOfBoard(board, existingUser))
      throw new Meteor.Error("User already on board, try re-assigning squares");

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



Template.gameList.helpers({
  games : function() {
    var games = Game.find();
    return games;
  }
});



Template.gameItem.helpers({
  gameDisplay: function() {
    var game = this;
    var ret = this.winner + "(" + this.winnerScore + ")  " + this.loser + "(" + this.loserScore + ")";
    console.log("gameDisplay: ", ret);
    return ret;
  }
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
  function() {
    console.log(this);
})

