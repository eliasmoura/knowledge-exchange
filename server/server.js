/**
*	Server routines
**/

Meteor.startup(function(){
	/*Correction.remove({});
	Corrections.remove({});
	Messages.remove({});
	Usage.remove({});
	Alternative.remove({});
	User_Chatroom.remove({});
	Groups.remove({});
	Chatrooms.remove({});*/
	//Accounts.config({forbidClientAccountCreation:true});
	//console.log(Chatrooms.find().count());
	if (Chatrooms.find().count() == 0){
		Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.status":Meteor.user().profile.default_status}});
		console.log('adding chatrooms');
		Chatrooms.insert({"name": "Test", details:"A test room"});
		Chatrooms.insert({"name": "Test2", details:"A test room"});
	}


});

Accounts.onCreateUser(function(options,user){
	console.log('onCreateUser');
	try{
		// console.log(user.services.password.srp);
		
		options.profile.online = true;
    	options.profile.away = false;
	    options.profile.active_room = {type:null,room:null};
	    options.profile.default_status = "online";
		user.profile = options.profile;
		// Accounts.setPassword(user._id, user.password);
		/*Accounts.verifyEmail(user.services.password.srp.verifier,function(error){
			if(error)
				console.log(error);
		});*/
		console.log("User created: " + user.profile.name + " " + user.profile.lastname);
		console.log('sign up ok');
		return user;
	}catch(e){
		console.log('error on sign up: ' + user.profile.name);
		console.log(e);
	}
});

Hooks.onLoggedIn = function (userId) {
    // this runs right after a user logs in, on the client or server
    if(Meteor.user().profile.default_status == "online")
    	Meteor.users.update({_id:Meteor.userId()},{$set:{"profile.status":"online"}});
    console.log("User: " + Meteor.user().profile.name + " logged in. Status: " + Meteor.user().profile.status);
}
Hooks.onLoggedOut = function (userId) {
    // this runs right after a user logs out, on the client or server
	// Meteor.users.update({_id:Meteor.userId()},{$set:{"profile.online":false}});
	// Meteor.users.update({_id:Meteor.userId()},{$set:{"profile.away":false}});
	Meteor.users.update({_id:Meteor.userId()},{$set:{"profile.status":"offline"}});
	console.log("User: " + Meteor.user().profile.name + " logged out. Status: " + Meteor.user().profile.status);
    /*Meteor.call('setRoom_Non_active');
	Meteor.call('setGroup_Non_active');
	Meteor.call('setFriend_Non_active');*/
}

Hooks.onCloseSession = function (userId) {
	Meteor.users.update({_id:Meteor.userId()},{$set:{"profile.status":"offline"}});
	console.log("User: " + Meteor.user().profile.name + " closed the session. Status: " + Meteor.user().profile.status);
	/*Meteor.call('setRoom_Non_active');
	Meteor.call('setGroup_Non_active');
	Meteor.call('setFriend_Non_active');*/
}

Hooks.onDeleteUser = function () {

}

Hooks.onCreateUser = function () {

}