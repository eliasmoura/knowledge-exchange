
mfPkg.init('en', {});

UI.registerHelper("user",function(){return Meteor.user()});
UI.registerHelper("edit_profile",
    function(){
        return Session.get("edit_profile");
    }
);



UI.registerHelper();
