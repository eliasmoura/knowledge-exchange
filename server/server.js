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
		console.log('sign up ok');
		console.log(user);
		user.profile = options.profile;
		//Accounts.setPassword(user._id, user.password);
		Accounts.verifyEmail(user.srp.verifier,function(error){
			if(error)
				console.log(error);
		});
		return user;
	}catch(e){
		console.log('error on sign up:');
		console.log(e);
		console.log(user);
	}
});

Hooks.onLoggedIn = function (userId) {
    // this runs right after a user logs in, on the client or server
    var user = OnlineUsers.find({user:userId}).fetch();
    if (user.length == 0) {
    	OnlineUsers.insert({
			user:userId
		});
    }
}

Hooks.onLoggedOut = function (userId) {
    // this runs right after a user logs out, on the client or server
    var rooms = User_Chatroom.find({user:userId});
    /*User_Chatroom.update({user:userId},
				{$set:{active: false}},{multi:true});*/
    OnlineUsers.remove({user:userId});
}

Hooks.onCloseSession = function (userId) {
	try{
		var user = Meteor.user().profile.name;
	}
	catch (e){
		var user = null;
	}
	if(user){
		/*User_Chatroom.update({user:userId},
				{$set:{active: false}},{multi:true});*/
		//console.log('test');
	}
}

Hooks.onGainFocus = function () {
 
}

Hooks.onLoseFocus = function () {

}

Hooks.onDeleteUser = function () {

}

Hooks.onCreateUser = function () {

}

