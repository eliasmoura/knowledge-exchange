

Meteor.publish("requests", function(){
	var groups = User_Group.find({user:this.userId, mod:true}).fetch();
	var groupArray = new Array();
	var groupsRequest_participation = false;

	var friendshipRequests = UserRequest.find({request_to: this.userId});
	var	friends = false;
	
	var response = new Array();

	if(groups){
		groups.forEach(function(row){
			groupArray.push(row.group);
		});
		groupsRequest_participation = GroupRequest.find({group:{$in: groupArray},type:1});
	}
	//console.log(groupsRequests.fetch());
	

	if (friendshipRequests)
		response.push(friendshipRequests);
	if(groupsRequest_participation)
		response.push(groupsRequest_participation);
	//console.log(response);
	return response;
});
Meteor.publish("requests-invite", function(){
	return GroupRequest.find({user:this.userId,type:2});
});


Meteor.publish("user-contact", function(){
	return UsersRelations.find({user:this.userId});
});
Meteor.publish("privatechat", function(){
	return PrivateChat.find({user:this.userId});
});

Meteor.publish("user-list", function(){
	return Meteor.users.find({},{fields:{_id:1, "profile.name":1,"profile.lastname":1}});
});

Meteor.publish("privatemessages",function(privatechat){
	messages = PrivateMessages.find({chat:privatechat});
	return messages;
})



Meteor.publish("user-chatroom-list", function(){
	var chatrooms = User_Chatroom.find({user:this.userId});
	/*var userChatroomsList = new Array();
	if (chatrooms) 
		chatrooms.fetch().forEach(function(row){
			userChatroomsList.push(row.room);
		});
	chatrooms = User_Chatroom.find({room:{$in:userChatroomsList}});*/
	return chatrooms;
});

Meteor.publish("chatrooms-list", function(){
	//console.log(Chatrooms.find().fetch());
	return Chatrooms.find({});
});

Meteor.publish("user-chatroom-active", function(){
	return User_Chatroom.find({user:this.userId, active:true});
});

Meteor.publish("chat-messages", function(active_room){
	if(active_room.type == null){
		console.log('no room active');
		return Messages.find({room:active_room.room}, {sort: {time: +1}})
	}
	if(active_room.type == "public")
		return Messages.find({room:active_room.room}, {sort: {time: +1}});
	if(active_room.type == "group")
		return GroupChat.find({groupchat:active_room.room}, {sort: {time: +1}});
	if(active_room.type == "privatechat")
		return PrivateMessages.find({chat:active_room.room}, {sort: {time: +1}});
});





Meteor.publish("user-groups-list", function(groups){
	// var groups = User_Group.find({user:this.userId});
	var userGroupsList = new Array();
	if (groups)
		groups.forEach(function(row){
			userGroupsList.push(row.group);
		});
	groups = Groups.find({_id: {$in: userGroupsList}});
	// console.log(Groups.find({_id: {$in: userGroupsList}}).fetch());
	return groups;
});
Meteor.publish("groups-list", function(user){
	return Groups.find({});
});

Meteor.publish("find-group", function(text){
	return Groups.find( { name: { $regex: text, $options: 'i' } } );
});

Meteor.publish("group-request", function(groupId, userId){
	return Groups.find({_id:groupId});
});

Meteor.publish("groups-owner", function(){
	return User_Group.find({owner:true, user:this.userId});
});

Meteor.publish("user-groups", function(){

	return User_Group.find({user: this.userId});
})

Meteor.publish("group-chat", function(group){
	return GroupChat.find({groupchat:group});
})



Meteor.publish("languages-list", function(){
	return Languages.find({},{$sort: {name: +1}});
});

Meteor.publish("correction", function(messageId){
	return Correction.find({message: messageId},{fields:{correction:1,corretor:1}});
});

Meteor.publish("chat-corrections", function(active_room){
	var messagesArray = [];
	var messages = null;
	if (active_room.type != null)
	{
		/*if (active_room.type == "public"){
			messages = Messages.find({room:active_room.room});
			console.log('c_chat');
		}
		else if (active_room.type == "group"){
			try{
			messages = GroupChat.find({groupchat:active_room.room});
			}catch(e){console.log(e);}
			console.log('c_group');
		}	
		else if (active_room.type == "privatechat"){
			messages = PrivateMessages.find({chat:active_room.room});
			console.log('c_privatechat');
		}
		if (messages)
		messages.forEach(function(row){
			messagesArray.push(row._id);
		});*/

		var corrections = Correction.find({room: active_room.room});
	}else{
		console.log("no room active")
		return Correction.find({room: active_room.room});
	}
	return corrections;
});

Meteor.publish("usage", function(usagefor){
	return Usage.find({usagefor:usagefor});
});