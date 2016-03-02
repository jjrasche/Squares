if (Meteor.isClient) {
  // load highCharts
  // counter starts at 0
  Session.setDefault('counter', 0);

  // var arr = [];
  // for (var i = 0; i < 10; i++) {
  //   for (var j = 0; j < 10; j++) {
  //     arr.push([i,j,"a"]);
  //   }
  // }
  // console.log(JSON.stringify(arr));

  var boardData = [[0,0,"a"],[0,1,"a"],[0,2,"a"],[0,3,"a"],[0,4,"a"],[0,5,"a"],[0,6,"a"],[0,7,"a"],[0,8,"a"],[0,9,"a"],[1,0,"a"],[1,1,"a"],[1,2,"a"],[1,3,"a"],[1,4,"a"],[1,5,"a"],[1,6,"a"],[1,7,"a"],[1,8,"a"],[1,9,"a"],[2,0,"a"],[2,1,"a"],[2,2,"a"],[2,3,"a"],[2,4,"a"],[2,5,"a"],[2,6,"a"],[2,7,"a"],[2,8,"a"],[2,9,"a"],[3,0,"a"],[3,1,"a"],[3,2,"a"],[3,3,"a"],[3,4,"a"],[3,5,"a"],[3,6,"a"],[3,7,"a"],[3,8,"a"],[3,9,"a"],[4,0,"a"],[4,1,"a"],[4,2,"a"],[4,3,"a"],[4,4,"a"],[4,5,"a"],[4,6,"a"],[4,7,"a"],[4,8,"a"],[4,9,"a"],[5,0,"a"],[5,1,"a"],[5,2,"a"],[5,3,"a"],[5,4,"a"],[5,5,"a"],[5,6,"a"],[5,7,"a"],[5,8,"a"],[5,9,"a"],[6,0,"a"],[6,1,"a"],[6,2,"a"],[6,3,"a"],[6,4,"a"],[6,5,"a"],[6,6,"a"],[6,7,"a"],[6,8,"a"],[6,9,"a"],[7,0,"a"],[7,1,"a"],[7,2,"a"],[7,3,"a"],[7,4,"a"],[7,5,"a"],[7,6,"a"],[7,7,"a"],[7,8,"a"],[7,9,"a"],[8,0,"a"],[8,1,"a"],[8,2,"a"],[8,3,"a"],[8,4,"a"],[8,5,"a"],[8,6,"a"],[8,7,"a"],[8,8,"a"],[8,9,"a"],[9,0,"a"],[9,1,"a"],[9,2,"a"],[9,3,"a"],[9,4,"a"],[9,5,"a"],[9,6,"a"],[9,7,"a"],[9,8,"a"],[9,9,"a"]];

  // Template.grid.onRendered(function(){
  //   $('#table_container').highcharts({

  //       chart: { type: 'heatmap', 
  //           // Edit chart spacing
  //           spacingBottom: 15,
  //           spacingTop: 10,
  //           spacingLeft: 10,
  //           spacingRight: 10,

  //           // Explicitly tell the width and height of a chart
  //           width: 480,
  //           height: 480
  //     },
  //       title: { text: '' },
  //       xAxis: { categories: [1,2,3,4,5,6,7,8,9,0], opposite: true, title: null },
  //       yAxis: { categories: [1,2,3,4,5,6,7,8,9,0],  title: null },
  //       plotOptions: {
  //           series: {
  //               events: {
  //                   click: function(e) {
  //                     var x = e.point.x;
  //                     var y = e.point.y;
  // //                      alert(x + ":" + y);
  //                     // modifyBoard(e.point.x, e.point.y);
  //                   }
  //               }
  //           }
  //       },
  //       tooltip: {
  //           formatter: function () {
  //             var x = this.series.xAxis.categories[this.point.x];
  //             var y = this.series.yAxis.categories[this.point.y];
  //               return "<b><u>Games Hit:</u></b><br>"// + gameData[x][y] + calculateNumPoints(x,y); //"(" + x + "," + y + ")";
  //           }
  //       },
  //       series: [{
  //           name: '',
  //           title: '',
  //           borderWidth: 0,
  //           backgroundColor: '#303030',
  //           data: boardData,
  //           dataLabels: {
  //               enabled: true,
  //               color: '#000000'
  //           }
  // //          tooltip: {
  // //              headerFormat: '<b>Games hit</b> <br/>',
  // //              pointFormat: 'uconn 52 delaware 43 rnd 1 <br/> miami 52 Michigan 43 rnd 2 <br/>'
  // //          }
  //       }],
  //       legend: {
  //     enabled: false
  //       },            

  //   });
  // })

  Template.grid.helpers({
    createChart: function () {
        // Use Meteor.defer() to craete chart after DOM is ready:
        Meteor.defer(function() {
          // Create standard Highcharts chart with options:
          Highcharts.chart('chart', {
            chart: { type: 'heatmap', 
                // Edit chart spacing
                // spacingBottom: 15,
                // spacingTop: 10,
                // spacingLeft: 10,
                // spacingRight: 10,

                // // Explicitly tell the width and height of a chart
                // width: 480,
                // height: 480
            },
            title: { text: '' },
            xAxis: { categories: [1,2,3,4,5,6,7,8,9,0], opposite: true, title: null },
            yAxis: { categories: [1,2,3,4,5,6,7,8,9,0],  title: null },
            plotOptions: {
                series: {
                    events: {
                        click: function(e) {
                          var x = e.point.x;
                          var y = e.point.y;
      //                      alert(x + ":" + y);
                          // modifyBoard(e.point.x, e.point.y);
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
            series: [{
                name: '',
                title: '',
                borderWidth: 0,
                backgroundColor: '#303030',
                data: boardData,
                dataLabels: {
                    enabled: true,
                    color: '#000000'
                }
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

  Template.grid.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
