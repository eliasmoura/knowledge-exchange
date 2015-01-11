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
    Kadira.connect('w7MjJY7CJSWexx5xM', '1a6f7899-23f6-45a4-9fcb-78a742ac639a');
	if (Chatrooms.find().count() == 0){
		//Meteor.users.update({_id:this.userId}, {$set:{"profile.status":Meteor.users.findOne({_id:this.userId}).profile.default_status}});
		console.log('adding chatrooms');
		Chatrooms.insert({"name": "Test", details:"A test room"});
		Chatrooms.insert({"name": "Test2", details:"A test room"});
	}
    Meteor.users.find({"status.online": true}).observe({
        changed: function(newdoc, olddoc){
            if(newdoc.profile.active_room.room != olddoc.profile.active_room.room){
                if(newdoc.profile.active_room.type == "group"){
                    var user_group =  User_Group.findOne({group:newdoc.profile.active_room.room, user:newdoc._id})._id;
                    User_Group.update({_id:user_group}, {$set:{new_messages:0}});
                }
            }
            
        }
    })

    var user_chatroom = Meteor.users.find({"profile.active_room.type": "public"});
    user_chatroom.observe({
         added: function(doc){
            User_Chatroom.insert({room:doc.profile.active_room.room, user:doc._id,joined: true, date:Date.now()});
        },
        changed: function(doc){
            var is_joined = User_Chatroom.findOne({room:doc.profile.active_room.room, user: doc._id});
            if (is_joined == undefined)
                User_Chatroom.insert({room:doc.profile.active_room.room, user:doc._id,joined: true, date:Date.now()});
        }
    });
    UserRequest.find().observe({
        changed: function(doc){
            console.log(doc);
            if (doc.accept == 1){
                UsersRelations.insert({user:doc.request_to,contact:doc.user,relation:doc.relation,time: Date.now()});
                UsersRelations.insert({user:doc.user,contact:doc.request_to,relation:doc.relation,time: Date.now()},function(error){
                    if (!error) {
                        if (PrivateChat.findOne({users:{$in:[doc.user,doc.request_to]}}) == undefined){
                            PrivateChat.insert({users:[doc.user,doc.request_to]}, function(error, result){});
                            UserRequest.remove({_id:doc._id});
                            console.log('friendship ok');

                        }
                    }else console.log(error);
                });
            }else{
                UserRequest.remove({_id:doc._id});
            }
        }
    });
    GroupChat.find().observe({
        added: function(doc){
            var user_group = User_Group.find({group:doc.groupchat}, {fields:{user:1}}).fetch()
            var userArray = new Array();
            user_group.forEach(function(row){
                userArray.push(row.user);
            });
            var users = Meteor.users.find({_id:{$in:userArray},"profile.active_room.room":{$ne:doc.groupchat}}, {fields:{_id:1}}).fetch();
            userArray = new Array();
            users.forEach(function(row){
                userArray.push(row._id);
            });
            User_Group.update({group:doc.groupchat, user:{$in:userArray}}, {$inc: {new_messages:1}},{multi:true});
        }
    });
    PrivateMessages.find().observe({
        added:function(doc){
            PrivateMessages.update({_id:doc._id}, {$set:{new_message: true}})
            //PrivateChat.update({_id:doc.chat}, {$inc:{new_messages:1}});
        }
    });




});

Accounts.onCreateUser(function(options,user){
	console.log('Creationg user');
	try{
		// console.log(user.services.password.srp);
		
		options.profile.online = true;
    	options.profile.away = false;
	    options.profile.active_room = {type:"none",room:"none"};
	    options.profile.default_status = "online";
	    options.profile.status = "online";
        options.profile.blocked_users = [];
		user.profile = options.profile;
		// Accounts.setPassword(user._id, user.password);
		/*Accounts.verifyEmail(user.services.password.srp.verifier,function(error){
			if(error)
				console.log(error);
		});*/
        user.srp = options.srp;
		console.log("User created:");
		console.log(user.profile);
		console.log('sign up ok');
		return user;
	}catch(e){
		console.log('error on sign up: ' + user.profile.name);
		console.log(e);
	}
});

UserStatus.events.on("connectionLogin", function(user){
    if (user.userId){
        Meteor.users.update({_id:user.userId}, {$set:{"profile.status":"online"}});
    }
});
UserStatus.events.on("connectionLogout", function(user){
    if (user.userId){
        Meteor.users.update({_id:user.userId}, {$set:{"profile.status":"ofline"}});
    }
});
UserStatus.events.on("connectionIdle", function(user){
    if (user.userId){
        console.log(user)
        Meteor.users.update({_id:user.userId}, {$set:{"profile.status":"away"}});
    }
});
/*Hooks.onLoggedIn = function (userId) {
    // this runs right after a user logs in, on the client or server
    if(Meteor.user().profile.default_status == "online")
    	Meteor.users.update({_id:Meteor.userId()},{$set:{"profile.status":"online"}});
    console.log("User: " + Meteor.user().profile.name + " logged in. Status: " + Meteor.user().profile.status);
}
Hooks.onLoggedOut = function (userId) {
    // this runs right after a user logs out, on the client or server
	// Meteor.users.update({_id:Meteor.userId()},{$set:{"profile.online":false}});
	// Meteor.users.update({_id:Meteor.userId()},{$set:{"profile.away":false}});
	if(Meteor.user())
    {
	Meteor.users.update({_id:Meteor.userId()},{$set:{"profile.status":"offline"}});
	console.log("User: " + Meteor.user().profile.name + " logged out. Status: " + Meteor.user().profile.status);
    }
    /*Meteor.call('setRoom_Non_active');
	Meteor.call('setGroup_Non_active');
	Meteor.call('setFriend_Non_active');*//*
}

Hooks.onCloseSession = function (userId) {
	if(Meteor.user()){
		Meteor.users.update({_id:Meteor.userId()},{$set:{"profile.status":"offline"}});
		console.log("User: " + Meteor.user().profile.name + " closed the session. Status: " + Meteor.user().profile.status);	
	}
	/*Meteor.call('setRoom_Non_active');
	Meteor.call('setGroup_Non_active');
	Meteor.call('setFriend_Non_active');*//*
}

Hooks.onDeleteUser = function () {

}

Hooks.onCreateUser = function () {

}
*/
