/**
*    Templates
**/

/**Meteor.autorun(function() {
    // Whenever this session variable changes, run this function.
    var message = Session.get('displayMessage');
    if (message) {
      var stringArray = message.split('&amp;');
      Meteor.ui.notify(stringArray[0], stringArray[1])
        .effect('slide')
        .closable();

      Session.set('displayMessage', null);
    }
  });**/
Hooks.init();
Meteor.startup(function(){
    Session.set('login', true);
    Session.set('group-finder', false);
    Session.set("add_ser",false);
    Session.set("user_modal_actions",false);
});

$('html').click(function(){
	//console.log('test');
	//$("[data-toggle=popover]").popover('hide');
})

Template.post.events = {
	'click input.topt': function(e,t){
        var element = e.target;
        //mfPkg.setLocale='pt_BR';
        //mfPkg.setLocale('pt_BR');
        Session.set('locale', 'pt_BR');
        
    },
    'click input.toen': function(e,t){
        var element = e.target;
        //mfPkg.setLocale='pt_BR';
        //mfPkg.setLocale('pt_BR');
        Session.set('locale', 'en');
        
    },
    'click input.clean': function(e,t){
        Meteor.call("clean_db");
    }
}



/*
Template.dsdsd.dsds = function(e,t){
	UsersRelations.insert(
		{user:"A2EggWM4y9LQKPba6",userrelation:["ddxhhoTQsH9LuafHn","F"]});
}*/