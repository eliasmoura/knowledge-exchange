/*

if (!(typeof MochaWeb === 'undefined')) {
  MochaWeb.testOnly(function() {
    // Create the functions to be tested

    // Execute the test
    describe("User login", function() {
      describe("User not logged", function() {
        before(function(done) {
          Meteor.autorun(function() {
            var id = Meteor.userId();
            if (id === null) {
              done();
            }
          });
        });
        it("should show a login in button on top right", function() {
          Meteor.flush();
          chai.assert.equal($("div.ui.button").html(), "Sign in/up");
        });
      });
      describe("Loggin user", function() {
        var login = function(user) { 
            $("input#login_email").val(user.email);
            $("input#login_passwd").val(user.passwd);
            console.log($("input#login_passwd".val()));
            $("form#login-form").submit();
        } 
        before(function(done) {

          Meteor.autorun(function() {
            var id = Meteor.userId();
            if (id === null) {
              done();
            }
          });
        });

        it("should show a login form", function(){
              chai.assert($("form#login-form"));
          });
        it("should show the user name on the top right", function() {
            var user = {'name': "qwe", 'email': "qwe@qwe.com", 'passwd': "qwe123"};
            login(user);
            console.log(user);
          chai.assert.equal($("div.ui.button > a#user").text(), "qwe");
        });
      });

    });
  });
}
*/
