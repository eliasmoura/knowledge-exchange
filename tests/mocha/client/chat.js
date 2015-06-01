

if(!(typeof MochaWeb === 'undefined')){
    MochaWeb.testOnly(function(){
        //Create the functions to be tested
        
        //Execute the test
        describe("User is not logged!", function(){
            before(function(done){
                Meteor.autorun(function(){
                    var id = Meteor.userId();
                    if(id === null){
                        done();
                    }
                });
            });
            it("should show a login in button on top right", function(){
                Meteor.flush();
                chai.assert.equal($("div.ui.button").html(), "Sign in/up");
            });
        });

    });
}
