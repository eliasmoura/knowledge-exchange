Meteor.methods({
	sign_in: function(email, passwd){
		console.log("login");
		//email = trimInput(email);
		/**validate here**/

		//validating login
		
	},
	sign_up: function(email,passwd,name,lastname){
		console.log('sign up...');
		
		console.log('user : ' + user);
		
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
	setUser_group: function(request,operation){
		if(operation)
			User_Group.insert({group:request.group,user:request.user,owner:false,mod:false,active:false}, 
				function(error, result){
					console.log(error);
					if(!error)
						GroupRequest.remove({_id:request._id});
			});	
		else
			User_Group.remove({group:group,user:user});
	},
	setFriend_active: function(friend){
		if(!Meteor.user())return "You must be logged!";
		var user = this.userId;
		console.log(friend);
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
			PrivateChat.update({_id:privatechat['_id']}, {$set:{active: true, new_messages:0}});
		}	
	},
	setUser_relation: function(request, relation, operation){
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
				User_Group.find({group:user_group.group, active:false}).forEach(function(row){
					User_Group.update({_id:row._id},{$inc:{new_messages:1}});
					console.log('setting inc group');
				})
		}	
		else if (privatechat != undefined){
			var privatechat_2 = PrivateChat.findOne({user:privatechat.contact, contact:privatechat.user});
			var privatechats = [privatechat._id, privatechat_2._id];
			var messageiD = PrivateMessages.insert({
					name: name,
					lstname: lstname,
					userid: userid,
					message: message,
					chat:privatechats,
					time: Date.now(),
				});
			if (!privatechat.active || !privatechat_2.active){
				PrivateChat.find({_id:{$in: privatechats}, active:false}).forEach(function(row){
					PrivateChat.update({_id:row._id},{$inc:{new_messages:1}},{multi:true});
					console.log('setting inc');
				})
								
			}
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
		console.log('part request');
		var group = Groups.findOne({_id: group});
		console.log(group);
		if (group)
			if(!User_Group.findOne({user:this.userId, group:group._id}))
				if(!GroupRequest.findOne({user:this.userId,group:group._id}))
					group = GroupRequest.insert({user: Meteor.userId(), group: group._id, message: message, type: 1});
		else
			throw Meteor.Error(1000, "The group you are trying to send a request doesn't exit");
		console.log(group);
		//Groups.update({_id:groupId}, {$push:{request:userId}});
	},
	group_invite_request: function(user, message, group){
		var user = Meteor.users.findOne({_id: user});
		var group = Groups.findOne({_id: group});
		if (user)
			if(!User_Group.findOne({user:user._id, group:group._id}))
				if(!GroupRequest.findOne({user:user._id,group:group._id}))
			GroupRequest.insert({user: user._id, group: group._id, message: message, type: 2});
		else
			throw Meteor.Error(1000, "The person you are trying to send a request doesn't exit");
	},
	find_group_owner: function(group){
		return Meteor.users.findOne({_id:User_Group.findOne({group:group._id, owner:true}).user}, {fields:{_id:1,profile:1}});
	},
	find_user: function(user){
		var users = null;
		if(user.user_name)
			users = Meteor.users.find( { "profile.name": { $regex: user.user_name, $options: 'i' } }, {fields:{_id:1,profile:1}} ).fetch();
		if(user.user_id)
			users = Meteor.users.find({_id:user.user_id}, {fields:{_id:1,profile:1}});
		//console.log(users);
		//console.log(users);
		if (user.first_user)
			users = users.fetch()[0];
		return users;
	},
	user_friendship_request: function(user, message){
		console.log('friendship request');
		if (Meteor.users.findOne({_id: user}))
			if (!UserRequest.findOne({user:Meteor.userId(), request_to:user}))
				UserRequest.insert({user: Meteor.userId(), request_to: user, message: message}, function(error){console.log(error);});
		else
			throw Meteor.Error(1000, "The person you are trying to send a request doesn't exit");
	},
	request_handler: function(request,type){
		console.log('request handler');
		if (type == 1){
			console.log('participation');
			var request = GroupRequest.findOne({_id:request});
			Meteor.call("setUser_group", request,1);

		}else if (type == 2){
			var request = GroupRequest.findOne({_id:request});
			Meteor.call("setUser_group", request,1);
			
		}else{
			console.log('friendship');
			var request = UserRequest.findOne({_id:request,request_to:this.userId});
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


/*Accounts.onLoginFailure(function(error){
	console.log(error);
});*/