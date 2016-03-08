describe("app feature", function(){
  beforeEach(function(done){
    Meteor.logout(function() {
      done();
    });
  })
  console.log('testing');
  it("logged in user can createGame", function(done){
    expect(Meteor.userId()).toBeNull()

    Meteor.loginWithPassword("test@test.com", "testing", function(err){
      expect(err).toBeUndefined();
      expect(Meteor.userId()).not.toBeNull()

      // // create game button exists
      // var ret = $('#createBoardButton').eq(0).click();
      // console.log('modal lookin: ', ret, $('#boardNameCreateBoardModal'));
      // expect($('#boardNameCreateBoardModal')).toBeDefined();

      // var inputField = $("input[name='boardName']")[0];
      // console.log('modal clickin: ', inputField);
      // expect(inputField).toBeDefined();
      // inputField.value = 'testerBoard';




      //$('#assignSquaresModalButton').click();

      done();
      
    });
  });
});