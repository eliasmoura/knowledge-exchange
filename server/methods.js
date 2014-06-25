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
	setUser_activeRoom: function(type,roomId){
		Meteor.users.update({_id:Meteor.userId()},{$set:{"profile.active_room":{type:type,room:roomId}}},function(error,docs){
				if(!error){
					// console.log("activeRoom: " + docs);
					// console.log(Meteor.user().profile.active_room);
				}
					
				else{
					console.log("activeRoom");
					console.log(error);
				}
					
			});
	},
	setRoom_active: function(roomId){
		if(!Meteor.user())return "You must be logged!";
		var user = this.userId;
		var user_room = User_Chatroom.findOne({room:roomId,user:user});
		Meteor.call('setRoom_Non_active');
		Meteor.call('setGroup_Non_active');
		Meteor.call('setFriend_Non_active');
		if (user_room == undefined){
			if(Chatrooms.findOne({_id:roomId})._id)
				User_Chatroom.insert({room:roomId,user:user,active:true}, function(error, result){
					if(!error){
						var room = User_Chatroom.findOne({_id:result}).room;
						// console.log("room: " + room + "  result " + result);
						Meteor.call("setUser_activeRoom","public",room);
					}
						
					else{ 
						console.log(error);
						console.log(result);
					}
				});
		}
		else if (!user_room['active']){
			User_Chatroom.update({_id:user_room._id}, {$set:{active: true}}, function(error,doc){
				Meteor.call("setUser_activeRoom","public",user_room.room);
			});
			
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
			Meteor.call("setUser_activeRoom","group",user_group.group);
			User_Group.update({_id:user_group['_id']}, {$set:{active: true, new_messages:0}});
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
					if(!error){
						GroupRequest.remove({_id:request._id});
						Meteor.call("setUser_activeRoom","group",User_Group.findOne({_id:result}));
					}
						
			});	
		else
			User_Group.remove({group:group,user:user});
	},
	setFriend_active: function(friend){
		if(!Meteor.user())return "You must be logged!";
		var user = this.userId;
		//console.log(friend);
		var privatechat = PrivateChat.findOne({contact:friend,user:user});
		Meteor.call('setRoom_Non_active');
		Meteor.call('setGroup_Non_active');
		Meteor.call('setFriend_Non_active');
		if (!privatechat){
			console.log('inserting PrivateChat');
			var user_relation = UsersRelations.findOne({contact:friend});
			var chatId = PrivateChat.insert({user:user,contact:user_relation.contact,active:true,new_messages:0}, function(error, result){
				Meteor.call("setUser_activeRoom","privatechat",result);
			});
		}
		else if (!privatechat['active']){
			Meteor.call("setUser_activeRoom","privatechat",privatechat._id);
			PrivateChat.update({_id:privatechat['_id']}, {$set:{active: true, new_messages:0}});
		}	
	},
	setUser_relation: function(args){
		console.log('setting relation');
		var operation = args.operation;
		if (operation) {
			var request = args.request;
			var relation = args.relation;
			console.log('add');
			UsersRelations.insert({user:this.userId,contact:request.user,relation:relation,time: Date.now()});
			UsersRelations.insert({user:request.user,contact:this.userId,relation:request.relation,time: Date.now()},function(error){
				if (!error) {
					PrivateChat.insert({user:request.user,contact:request.contact_to,active:false}, function(error, result){
					});
					PrivateChat.insert({user:request.contact_to,contact:request.user,active:false}, function(error, result){
					});
					UserRequest.remove({_id:request._id});
					console.log('friendship ok');
				}
			});
		}else{
			UsersRelations.remove({user:this.userId,contact:args.user});
			UsersRelations.remove({contact:this.userId,user:args.user});
			PrivateChat.remove({user:this.userId,contact:args.user})
			PrivateChat.remove({contact:this.userId,user:args.user})
		}
	},
	setFriend_Non_active: function(){
		var user = this.userId;
		PrivateChat.find({user:user, active:true}).fetch().forEach(function(row){
			PrivateChat.update({_id:row._id}, {$set:{active: false}});
		});
	},
	create_group: function(args){
		var group;
		if (Groups.findOne({name:args.name})){
			throw new Meteor.Error(1, 'Group already exist');
			return false;
		}
		if (args.name.length < 3){
			throw new Meteor.Error(2, 'Group name too short');
			return false;
		}
		/*if (!args.details || !args.languages){

			throw new Meteor.Error(1, 'All fields are mandatory');
			return false;
		}*/
        console.log("Creating group "+args.name);
		group = Groups.insert({
					name:args.name,
					description:args.description,
					languages:args.languages,
					focus:args.group_focus,
					type:args.group_type
				});
        console.log("Group created");
		Meteor.call('setRoom_Non_active');
		Meteor.call('setGroup_Non_active');
		Meteor.call('setFriend_Non_active');
		User_Group.insert({group:group,user:this.userId,owner:true,mod:true,active:true}, function(error, result){
			if(!error){
				console.log('Group ' + Groups.findOne({_id:group}).name + " created by " + Meteor.user().profile.name);
				Meteor.call("setUser_activeRoom","group",group);
			}else
				console.log(error);
		});
		for (var i = 0; i< args.members.length; i++) {
			group_invite_request({group:group,user:args.member[i],message:args.message});
			/*User_Group.insert({group:group,user:members[i],owner:false,mod:false,active:false}, function(error, result){
				if(!error)
					console.log(error);
			});	*/
		}
		

	},
	send_message: function(message){
		var name = Meteor.user().profile.name;
		var lstname = Meteor.user().profile.lastname;
		var room = Meteor.user().profile.active_room;
		var userid = this.userId;

		if (room.type == "public"){
			Messages.insert({
					name: name,
					lstname: lstname,
					userid: userid,
					message: message,
					room:room.room,
					time: Date.now(),
				});
		}
		else if (room.type == "group" ){
			GroupChat.insert({
					name: name,
					lstname: lstname,
					userid: userid,
					message: message,
					groupchat:room.room,
					time: Date.now(),
				});
				User_Group.find({group:room.room, active:false}).forEach(function(row){
					User_Group.update({_id:row._id},{$inc:{new_messages:1}});
					console.log('setting inc group');
				})
		}	
		else if (room.type == "privatechat"){
			var privatechat = PrivateChat.findOne({_id:room.room});
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
	send_email:function(args){
		check(args, Object);
		var user = Meteor.users.findOne({_id:args.emailto})._id;
		Email.insert({emailto:user,emailfrom:Meteor.userId(),subject:args.subject,message:args.message,isnew:true,date:Date.now()},function(error,id){
			if (!error)
			{
				console.log('email sent: ' + id);
			}
			else
				console.log(error);
		});
	},
	get_emails: function(){
		var emails_sent = Email.find({emailfrom:Meteor.userId()}, {sort:{date:-1}});
		var emails_received = Email.find({emailto:Meteor.userId()}, {sort:{date:-1}});

		if(emails_sent.count() == 0){
			emails_sent = false;
		}
		else{
			emails_sent = emails_sent.fetch();
			var emailArray = new Array();
			emails_sent.forEach(function(row){
				row.user = Meteor.users.findOne({_id:row.emailto});
				emailArray.push(row);
			})
			emails_sent = emailArray;
		}

		if(emails_received.count() == 0){
			emails_received = false;
		}
		else{
			emails_received = emails_received.fetch();
			var emailArray = new Array();
			emails_received.forEach(function(row){
				row.user = Meteor.users.findOne({_id:row.emailfrom});
				emailArray.push(row);
			})
			emails_received = emailArray;
		}
		return {sent:emails_sent,received:emails_received};
	},
	report_user:function(args){
		check(args, Object);
		var userId = Meteor.users.findOne({_id:args.emailto})._id;
		var context = Meteor.user().context;
		if(context === "chatrooms"){
			var room = Meteor.user().profile.active_room;

			if (room.type == "public"){
				context = Messages.find({room:room.room});
			}
			else if (room.type == "group" ){
				context = GroupChat.find({groupchat:room.room});
			}	
			else if (room.type == "privatechat"){
				var privatechat = PrivateChat.findOne({_id:room.room});
				var privatechat_2 = PrivateChat.findOne({user:privatechat.contact, contact:privatechat.user});
				var privatechats = [privatechat._id, privatechat_2._id];
				context = PrivateMessages.find({chat:privatechats});
			}
		}else if (context === "blog"){
			
		}
			

		Report.insert({user:user, reason:args.reason,context:context});
	},
	correction: function(correction,explanation,messageId){
		Correction.insert({
			correction:correction,
			explanation:explanation,
			corrector:this.userId,
			message:messageId,
			chattype:Meteor.user().profile.active_room.type,
			room:Meteor.user().profile.active_room.room,
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
	group_invite_request: function(args){
		var user = Meteor.users.findOne({_id:args.user});
		var group = Groups.findOne({_id: args.group});
		console.log(user);
		console.log(group);
		console.log(message);
		if (user)
			if(!User_Group.findOne({user:user._id, group:group._id}))
				if(!GroupRequest.findOne({user:user._id,group:group._id}))
					GroupRequest.insert({user: user._id, group: group._id, message: args.message, type: 2});
		else
			throw new Meteor.Error(1000, "The person you are trying to send a request doesn't exit");
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
	request_handler: function(args){
		console.log('request handler');
		if (args.type == 1){
			var request = GroupRequest.findOne({_id:args.request});
			if(args.action == 1)
				Meteor.call("setUser_group", request,1);
			else
				GroupRequest.remove({_id:request._id});

		}else if (args.type == 2){
			console.log('group invite');
			var request = GroupRequest.findOne({_id:args.request});
			if(args.action == 1)
				Meteor.call("setUser_group", request,1);
			else
				GroupRequest.remove({_id:request._id});
		}else{
			var request = UserRequest.findOne({_id:args.request,request_to:this.userId});
			if(args.action == 1)
				Meteor.call("setUser_relation",{request:request,relation:1,operation:1});
			else
				UserRequest.remove({_id:request._id});
		}
	},
	find: function(search){
		var result = null;
		check(search, Object);

		if (search.user != undefined){
			if(search.user.name)
				result = Meteor.users.find( { "profile.name": { $regex: search.user.name, $options: 'i' } }, {fields:{_id:1,profile:1}} ).fetch();
			if(search.user._id)
				result = Meteor.users.findOne({_id:search.user._id}, {fields:{_id:1,profile:1}});
		}else if (search.group  != undefined){
			if(search.group.name)
				result = Groups.find( { name: { $regex: search.group.name, $options: 'i' } }).fetch();
			if(search.group._Id)
				result = Groups.findOne({_id:search.group._id});
			
			result.forEach(function(group){
				group.owner = Meteor.users.findOne({_id:User_Group.findOne({group:group._id, owner:true}).user}, {fields:{_id:1,profile:1}});	
				group.actions = {send_request:true};
				if (User_Group.findOne({user:Meteor.userId(),group:group._id}))
					group.actions.send_request = false;
				if (GroupRequest.findOne({user:Meteor.userId(),group:group._id}))
					group.actions.send_request = false;
			})
			// console.log(result);

		}else if (search.any != undefined){
			var groupsResults = Groups.find( { name: { $regex: search.group.name, $options: 'i' } }).fetch();
			var usersResults = Meteor.users.find( { "profile.name": { $regex: user.user_name, $options: 'i' } }, {fields:{_id:1,profile:1}} ).fetch();
			result = {groups:groupsResults, users:usersResults};
		}
		// console.log(result);
		return result;
	},
	user_list: function(room){
		check(room, Object)
		var userList =  new Array();
		var userListReturn = new Array();
		if (room.type == "public"){
			//console.log("searching room");
			User_Chatroom.find({room:room.room, active:true}).forEach(function(row){
				//console.log(row);
				userList.push(row.user);
			});
			userList = Meteor.users.find({_id:{$in: userList}, "profile.status":{$in:["online","away","busy"]}}, 
				{fields:{_id:1,"profile.name":1,"profile.lastname":1,"profile.status":1,"profile.alway":1}},
				{sort:{"profile.status":1,"profile.name":-1}}).fetch();
		}else if (room.type == "group"){
			User_Group.find({group:room.room})
				.fetch()
				.forEach(function(row){
					userList.push(row.user);
			});	
				userList = Meteor.users.find({_id:{$in: userList}}, 
					{fields:{_id:1,"profile.name":1,"profile.lastname":1,"profile.status":1,"profile.alway":1}},
					{sort:{"profile.online":-1,"profile.name":-1}
				}).fetch();
		}	
		else if (room.type == "privatechat"){
			var user  = PrivateChat.findOne({_id:room.room}).contact;
			user = Meteor.users.findOne({_id:user}, {fields:{_id:1,"profile.name":1,"profile.lastname":1,"profile.status":1,"profile.alway":1}});
			userList.push(Meteor.user());
			userList.push(user);
		}
		// console.log(userList);
		var blocked_users = Meteor.user().profile.blocked_users;//Meteor.users.findOne({_id:Meteor.userId(), "profile.blocked_users": {$in:userList}});
		//  if (blocked_users != undefined)
		// console.log(userListReturn);
		if (blocked_users != undefined)
			userList.forEach(function(row){
				if (blocked_users.indexOf(row._id) != -1) {
					row.profile.isblocked = true;
				}else{
					row.isblocked = false;
				}
				userListReturn.push(row);
			});
		else
			userListReturn = userList;
		
		return userListReturn;
	},
	set_userStatus: function(status){
		Meteor.users.update({_id:Meteor.userId()}, 
			{$set:{"profile.status":status,"profile.default_status":status}});
	},
	block_user: function(user){
		check(user, String);
		Meteor.users.update({_id:Meteor.userId()}, {$push:{"profile.blocked_users":user}});
	},
    reset_passwd: function(email){
        Accounts.sendResetPasswordEmail(Meteor.users.findOne({"emails.address":email}));
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
