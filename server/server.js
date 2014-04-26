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

});

Accounts.onCreateUser(function(options,user){
	console.log('onCreateUser');
	try{
		// console.log(user.services.password.srp);
		user.profile = options.profile;
		user.profile.online = true;
		// Accounts.setPassword(user._id, user.password);
		/*Accounts.verifyEmail(user.services.password.srp.verifier,function(error){
			if(error)
				console.log(error);
		});*/
		console.log("User created: " + user.profile.name + " " + user.profile.name);
		console.log('sign up ok');
		return user;
	}catch(e){
		console.log('error on sign up: ' + user.profile.name);
		console.log(e);
	}
});

Hooks.onLoggedIn = function (userId) {
    // this runs right after a user logs in, on the client or server
    var user = OnlineUsers.findOne({user:userId});
    Meteor.users.update({_id:Meteor.userId()},{$set:{online:true}});
    Meteor.users.update({_id:Meteor.userId()},{$set:{alway:false}});
    console.log("User: " + Meteor.user().profile.name + " logged in");
    if (user != undefined ) {
    	OnlineUsers.insert({
			user:userId
		});
    }
}
Hooks.onLoggedOut = function (userId) {
    // this runs right after a user logs out, on the client or server
	Meteor.users.update({_id:Meteor.userId()},{$set:{online:true}});
	Meteor.users.update({_id:Meteor.userId()},{$set:{alway:false}});
	console.log("User: " + Meteor.user().profile.name + " logged out");
    Meteor.call('setRoom_Non_active');
	Meteor.call('setGroup_Non_active');
	Meteor.call('setFriend_Non_active');
}

Hooks.onCloseSession = function (userId) {
	Meteor.users.update({_id:Meteor.userId()},{$set:{online:true}});
	console.log("User: " + Meteor.user().profile.name + " closed the session");
	Meteor.call('setRoom_Non_active');
	Meteor.call('setGroup_Non_active');
	Meteor.call('setFriend_Non_active');
}

Hooks.onGainFocus = function () {
	Meteor.users.update({_id:Meteor.userId()},{$set:{alway:false}});
}

Hooks.onLoseFocus = function () {
	Meteor.users.update({_id:Meteor.userId()},{$set:{alway:false}});
}

Hooks.onDeleteUser = function () {

}

Hooks.onCreateUser = function () {

}