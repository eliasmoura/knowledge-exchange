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




$(function(){
    $.contextMenu({
        selector: '.username', 
        callback: function(key, options) {
            if (key == "msg") {
            	console.log('do this: '+ $(this).attr("id"));
            }
        },
        items: {
            "msg": {name: "Send Message", icon: "edit"},
            "friend": {name: "Add as Friend", icon: "cut"},
            "contact": {name: "Add to Contact", icon: "copy"},
            "block": {name: "Block", icon: "paste"},
            "report": {name: "Report Abuse", icon: "delete"},
            "private": {name: "Private Chat",icon: "tranlate"},
            "chat": {name: "Invite to Group",icon: "tranlate"},
            "sep1": "---------",
            "quit": {name: "Quit", icon: "quit"}
        },
        trigger: "left"
    });
    
    $('.username').on('click', function(e){
        console.log('clicked', this);
    })
})

