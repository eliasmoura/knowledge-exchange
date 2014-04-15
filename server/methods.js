Meteor.methods({
	sign_in: function(email, passwd){
		console.log("login");
		//email = trimInput(email);
		/**validate here**/

		//validating login
		
	},
	sign_up: function(email,passwd,name,lastname){
		console.log('sign in...');
		var user = Accounts.createUser(
		{
			email:email,
			password:passwd,
			profile: {name:name,
			lastname:lastname,}
		});
		Accounts.setPassword(user._id, passwd);
		console.log('sign in, ok?');
	},
	setRoom_active: function(room){
		if(!Meteor.user())return "You must be logged!";
		var user = this.userId;
		var user_room = User_Chatroom.findOne({room:room,user:user});
		Meteor.call('setRoom_Non_active');
		Meteor.call('setGroup_Non_active');
		Meteor.call('setFriend_Non_active');
		if (!user_room){
			var roomId = Chatrooms.findOne({_id:room})._id;
			User_Chatroom.insert({room:roomId,user:user,active:true}, function(error, result){
			});
		}
		else if (!user_room['active']){
			User_Chatroom.update({_id:user_room['_id']}, {$set:{active: true}});
		}	
	},
	setRoom_Non_active: function(){
		if(!Meteor.user())return "You must be logged!";
		var user = this.userId;
		User_Chatroom.find({user:user, active:true}).fetch().forEach(function(row){
			User_Chatroom.update({_id:row._id}, {$set:{active: false}});
		});
	},
	setGroup_active: function(group){
		if(!Meteor.user())return "You must be logged!";
		var user = this.userId;
		var user_group = User_Group.findOne({group:group,user:user});
		Meteor.call('setRoom_Non_active');
		Meteor.call('setGroup_Non_active');
		Meteor.call('setFriend_Non_active');
		if (!user_group){
			//var group = Groups.findOne({_id:group})._id;
			
		}
		else if (!user_group['active']){
			User_Group.update({_id:user_group['_id']}, {$set:{active: true}});
			//console.log(User_Group.findOne({group:group,user:user}));
		}	
	},
	setGroup_Non_active: function(){
		var user = this.userId;
		User_Group.find({user:user, active:true}).fetch().forEach(function(row){
			User_Group.update({_id:row._id}, {$set:{active: false}});
		});
	},
	setUser_group: function(group,user,operation){
		if(operation)
			User_Group.insert({group:group,user:user,owner:false,mod:false,active:false}, 
				function(error, result){
					console.log(error);
			});	
		else
			User_Group.remove({group:group,user:user});
	},
	setFriend_active: function(friend){
		if(!Meteor.user())return "You must be logged!";
		var user = this.userId;
		var privatechat = PrivateChat.findOne({contact:friend,user:user});
		Meteor.call('setRoom_Non_active');
		Meteor.call('setGroup_Non_active');
		Meteor.call('setFriend_Non_active');
		if (!privatechat){
			console.log('inserting PrivateChat');
			var user_relation = UsersRelations.findOne({contact:friend});
			var chatId = PrivateChat.insert({user:user,contact:user_relation.contact,active:true}, function(error, result){
			});
		}
		else if (!privatechat['active']){
			PrivateChat.update({_id:privatechat['_id']}, {$set:{active: true}});
		}	
	},
	setUser_relation: function(request,relation,operation){
		console.log('setting relation');
		if (operation) {
			console.log('add');
			UsersRelations.insert({user:this.userId,contact:request.user,relation:relation,time: Date.now()});
			UsersRelations.insert({user:request.user,contact:this.userId,relation:request.relation,time: Date.now()},function(error){
				if (!error) {
					UserRequest.remove({_id:request._id,request_to:this.userId});
					console.log('friendship ok');
				}
			});
		}else{
			UsersRelations.remove({user:this.userId,contact:user});
			UsersRelations.remove({contact:this.userId,user:user});
		}
	},
	setFriend_Non_active: function(){
		var user = this.userId;
		PrivateChat.find({user:user, active:true}).fetch().forEach(function(row){
			PrivateChat.update({_id:row._id}, {$set:{active: false}});
		});
	},
	create_group: function(name,details,languages, members){
		if (Groups.findOne({name:name})){
			throw Meteor.Error(1, 'Group already exist');
			return false;
		}
		if (name.length < 3){
			throw Meteor.Error(2, 'Group name too short');
			return false;
		}
		if (!details || !languages){

			throw Meteor.Error(1, 'All fields are obrigatório');
			return false;
		}
		group = Groups.insert({
					name:name,
					details:details,
					languages:languages,
				});
		Meteor.call('setRoom_Non_active');
		Meteor.call('setGroup_Non_active');
		Meteor.call('setFriend_Non_active');
		User_Group.insert({group:group,user:this.userId,owner:true,mod:true,active:true}, function(error, result){
				console.log(error);
		});
		for (var i = 0; i< members.length; i++) {
			User_Group.insert({group:group,user:members[i],owner:false,mod:false,active:false}, function(error, result){
				console.log(error);
			});	
		}
		

	},
	send_message: function(message){
		var name = Meteor.user().profile.name;
		var lstname = Meteor.user().profile.lastname;
		var userid = this.userId;

		var user_chatroom = User_Chatroom.findOne({user:this.userId, active:true});
		var user_group = User_Group.findOne({user:this.userId, active:true});
		var privatechat = PrivateChat.findOne({user:this.userId, active:true});

		if (user_chatroom != undefined){
			Messages.insert({
					name: name,
					lstname: lstname,
					userid: userid,
					message: message,
					room:user_chatroom.room,
					time: Date.now(),
				});
		}
		else if (user_group != undefined){
			GroupChat.insert({
					name: name,
					lstname: lstname,
					userid: userid,
					message: message,
					groupchat:user_group.group,
					time: Date.now(),
				});
		}	
		else if (privatechat != undefined){
			var privatechat_2 = PrivateChat.findOne({user:privatechat.contact, contact:privatechat.user});
			var privatechats = [privatechat._id, privatechat_2._id];
			PrivateMessages.insert({
					name: name,
					lstname: lstname,
					userid: userid,
					message: message,
					chat:privatechats,
					time: Date.now(),
				});
		}
	},
	correction: function(correction,explanation,messageId){
		var type = null;

		var user_chatroom = User_Chatroom.findOne({user:Meteor.userId(), active:true});
		var user_group = User_Group.findOne({user:Meteor.userId(), active:true});
		var privatechat = PrivateChat.findOne({user:Meteor.userId(), active:true});

		if (user_chatroom != undefined){
			type = 'publicchat';
		}
		else if (user_group != undefined){
			type = 'groupchat';
		}	
		else if (privatechat != undefined){
			type = 'privatechat'
		}

		Correction.insert({
			correction:correction,
			explanation:explanation,
			corrector:this.userId,
			message:messageId,
			chattype:type,
			time: Date.now()
		});
	},
	alternative: function(alternativefor, alternative){
		Alternative.insert({alternativefor:alternativefor , alternative:alternative});
	},
	usage: function(usagefor, usage){
		Usage.insert({usagefor:usagefor,usage:usage});
	},
	participation_request: function(group, message){
		console.log('request');
		if (Groups.findOne({_id: group}))
			GroupRequest.insert({user: Meteor.userId(), group: group, message: message, type: 1});
		else
			throw Meteor.Error(1000, "The group you are trying to send a request doesn't exit");
		//Groups.update({_id:groupId}, {$push:{request:userId}});
	},
	group_invite_request: function(user, message, group){
		if (Meteor.users.findOne({_id: user}))
			GroupRequest.insert({user: user, group: group, message: message, type: 2});
		else
			throw Meteor.Error(1000, "The person you are trying to send a request doesn't exit");
	},
	find_user: function(user_name){
		var users = Meteor.users.find( { "profile.name": { $regex: user_name, $options: 'i' } }, {fields:{_id:1,profile:1}} ).fetch();
		console.log(users);
		return users;
	},
	user_friendship_request: function(user, message){
		console.log('checking');
		if (Meteor.users.findOne({_id: user}))
			
			UserRequest.insert({user: Meteor.userId(), request_to: user, message: message}, function(error){console.log(error);});
			console.log('ok?');
		throw Meteor.Error(1000, "The person you are trying to send a request doesn't exit");
	},
	request_handler: function(request,type){
		console.log('handlerling');
		if (type == 1){
			console.log('participation');
			var request = GroupRequest.findOne({_id:request});
			Meteor.call("setUser_group", request.group,request.user,1);
			GroupRequest.remove({_id:request._id});

		}else if (type == 2){
			var request = GroupRequest.findOne({_id:request});
			Meteor.call("setUser_group", request.group,request.user,1);
			GroupRequest.remove({_id:request._id});
		}else{
			console.log('friendship');
			console.log(request +' : ' +type);
			var request = UserRequest.findOne({_id:request,request_to:this.userId});
			console.log(request);
			Meteor.call("setUser_relation",request,1,1);
		}

	},
	clean_db: function(){
		Correction.remove({});
		Corrections.remove({});
		Messages.remove({});
		Usage.remove({});
		Alternative.remove({});
		User_Chatroom.remove({});
		Groups.remove({});
		//Chatrooms.remove({});
	}
});

Accounts.onCreateUser(function(error){
	console.log(error);
	console.log('errooo');
});
Accounts.onLoginFailure(function(error){
	console.log(error);
});