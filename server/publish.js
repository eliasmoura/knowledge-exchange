

Meteor.publish("requests", function(){
	var groups = User_Group.find({user:this.userId, owner:true}).fetch();
	var groupArray = new Array();
	var groupsRequests = false;

	var friendshipRequests = UserRequest.find({request_to: this.userId});
	var	friends = false;
	
	var response = new Array();

	if(groups){
		groups.forEach(function(row){
			groupArray.push(row.group);
		});
		groupsRequests = GroupRequest.find({group:{$in: groupArray}});	
	}
	
	//console.log(groupsRequests.fetch());
	

	if (friendshipRequests)
		response.push(friendshipRequests);
	if(groupsRequests)
		response.push(groupsRequests);
	//console.log(response);
	return response;
});


Meteor.publish("user-friend", function(){
	return User_Friend.find({user:this.userId});
});
Meteor.publish("privatechat", function(privatechats){
	return PrivateChat.find({chat:{$in: privatechats}})
});

Meteor.publish("user-list", function(){
	return Meteor.users.find({},{fields:{_id:1, "profile.name":1,"profile.lastname":1}});
});



Meteor.publish("user-chatroom-list", function(){
	var chatrooms = User_Chatroom.find({user:this.userId});
	var userChatroomsList = new Array();
	if (chatrooms) 
		chatrooms.fetch().forEach(function(row){
			userChatroomsList.push(row.room);
		});
	chatrooms = User_Chatroom.find({room:{$in:userChatroomsList}});
	return chatrooms;
});

Meteor.publish("chatrooms-list", function(){
	return Chatrooms.find({});
});

Meteor.publish("user-chatroom-active", function(){
	return User_Chatroom.find({user:this.userId, active:true});
});
Meteor.publish("chat-messages", function(roomId){
	return Messages.find({room:roomId}, {sort: {time: +1}});
});

Meteor.publish("chat-message", function(messageId){
	return Messages.find({_id: {$in:messageId}});
});





Meteor.publish("user-groups-list", function(){
	var groups = User_Group.find({user:this.userId});
	var userGroupsList = new Array();
	if (groups)
		groups.fetch().forEach(function(row){
			userGroupsList.push(row.group);
		});
	groups = User_Group.find({group: {$in: userGroupsList}});
	return groups;
});
Meteor.publish("groups-list", function(user){
	return Groups.find({});
});

Meteor.publish("find-group", function(text){
	return Groups.find( { name: { $regex: text, $options: 'i' } } );
});

Meteor.publish("group-request", function(groupId, userId){
	return Groups.find({_id:groupId, user:{$in: userId}});
});

Meteor.publish("groups-owner", function(){
	return User_Group.find({owner:true, user:this.userId});
});

Meteor.publish("user-group-chat", function(){
	return User_Group.find({user: this.userId});
})

Meteor.publish("group-chat", function(){
	var user_group = User_Group.find({user:this.userId}).fetch();
	var groupArray = [];
	user_group.forEach(function(row){
		groupArray.push(row.group);
	})
	return GroupChat.find({groupchat:{$in: groupArray}})
})



Meteor.publish("languages-list", function(){
	return Languages.find({},{$sort: {name: +1}});
});

Meteor.publish("correction", function(messageId){
	return Correction.find({message: messageId},{fields:{correction:1,corretor:1}});
});

Meteor.publish("chat-corrections", function(){
	//console.log(messagesId);
	var messagesArray = [];
	var messages = null;
	var user_chatroom = User_Chatroom.findOne({user:this.userId, active:true});
	var user_group = User_Group.findOne({user:this.userId, active:true});
	var privatechat = PrivateChat.findOne({user:this.userId, active:true});

	if (user_chatroom != undefined){
		messages = Messages.find({room:user_chatroom.room});
		console.log('chat');
	}
	else if (user_group != undefined){
		try{
		messages = GroupChat.find({groupchat:user_group.group});
		}catch(e){console.log(e);}
		console.log('group');
	}	
	else if (privatechat != undefined){
		messages = PrivateMessages.find({privatechat:privatechat.chat});
		console.log('privatechat');
	}
	if (messages)
	messages.forEach(function(row){
		messagesArray.push(row._id);
	});
	//console.log(messagesArray);

	var corrections = Correction.find({message: {$in:messagesArray}});
	//console.log(corrections.fetch());
	return corrections;
});

Meteor.publish("usage", function(usagefor){
	return Usage.find({usagefor:usagefor});
});