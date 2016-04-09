describe("portal page interaction tests", function() {

  it("find default user", function(done) {
    expect($('.sbPortalBoard').length).toEqual(1)
    done();
  });

});

/*
  velocity reporter does not display when process.env.IS_MIRROR == true

*/