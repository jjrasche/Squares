describe("app feature", function(){
  // console.log('testing', SB);
  it("Add simple variable to namespace", function(done) {
    SB.namespacer('SB', {test: 5})
    expect(SB.test).toEqual(5);
    
    done();
  });

  it("Add complex object to namespace", function(done){
    var members = {obj: {test: 5}, arr: [{test: 1}, {test: 2}, 3]}
    SB.namespacer('SB', {test2: members});
    expect(SB.test2).toEqual(members);

    done();
  });  

  it("Add variable to existing path", function(done){
    SB.namespacer('SB', {test3: {innerTest1: 1}});
    expect(SB.test3.innerTest1).toEqual(1);

    SB.namespacer('SB.test3', {innerTest2: 2});    
    expect(SB.test3.innerTest2).toEqual(2);
    expect(SB.test3.innerTest1).toEqual(1);

    done();
  });

  // directly existing namespace 
  it("Prevent overriding namespace", function(done){
    SB.namespacer('SB', {test4: 5});
    expect(SB.test4).toEqual(5);

    var func = function() {
      SB.namespacer('SB', {test4: 7});
    }
    expect(func).toThrow();
    expect(SB.test4).toEqual(5);
    
    done();
  });

  // override existing member 
  it("Prevent overriding namespace2", function(done){
    SB.namespacer('SB', {test5: 5});
    expect(SB.test5).toEqual(5);

    var func = function() {
      SB.namespacer('SB.test5', {obj: 6});
    }
    expect(func).toThrow();
    expect(SB.test5).toEqual(5);
    
    done();
  });

  it("Prevent adding outside App namespace", function(done){
    var func = function() {
      SB.namespacer('noRoot');
    };
    expect(func).toThrow();
    done();
  });
});