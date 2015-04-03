Meteor.publish("requests", function(){
	//var groups = User_Group.find({user:this.userId, mod:true}).fetch();
    var groupsArray = Roles.getGroupsForUser(this.userId, "group-manager")
	//var groupArray = new Array();
	var groupsRequest_participation = false;

	var friendshipRequests = UserRequest.find({request_to: this.userId});
	var	friends = false;
	
	var response = new Array();

	/*if(groups){
		groups.forEach(function(row){
			groupArray.push(row.group);
		});
	}*/

    groupsRequest_participation = GroupRequest.find({group:{$in: groupsArray},type:1});

	if (friendshipRequests)
		response.push(friendshipRequests);
	if(groupsRequest_participation)
		response.push(groupsRequest_participation);
	return response;
});
Meteor.publish("requests-invite", function(){
	return GroupRequest.find({user:this.userId,type:2});
});


Meteor.publish("user-contact", function(){
	return UsersRelations.find({user:this.userId});
});
Meteor.publish("privatechat", function(){
	return PrivateChat.find({users:{$in:[this.userId]}});
});

Meteor.publish("user-list", function(){
	return Meteor.users.find({},{fields:{_id:1, "profile.name":1,"profile.lastname":1,"profile.status":1}});
});

Meteor.publish("privatemessages",function(privatechat){
	messages = PrivateMessages.find({chat:privatechat});
	return messages;
})



Meteor.publish("user-chat-list", function(active_room){
    var users_list =null;
    var result = [];
    var room = active_room.room;
    //users_list = User_Chatroom.find({room:room});
    //users_list = _.map(users_list.fetch(), function(doc){return doc._id;});
    //var user_chatroom = User_Chatroom.find({room:user.profile.active_room.room});
    User_Room.find({room: room}).forEach(function(row){
        result.push(row.user);
    });
    result = Meteor.users.find({_id:{$in: result}}, 
        {fields:{_id:1, "profile.name":1, "profile.lastname":1, "profile.status":1,status:1}},
        {sort:{"status.online":true,"profile.name":1,"profile.lastname":1}});
    return result;
});

Meteor.publish("chatrooms-list", function(){
	//console.log(Chatrooms.find().fetch());
	return Chatrooms.find({});
});

Meteor.publish("messages", function(room){
     return Messages.find({room:room}, {sort: {time: +1}});
});

Meteor.publish("group-messages", function(room){
    return GroupChat.find({groupchat:room}, {sort: {time: +1}});
});

Meteor.publish("private-messages", function(room){
    return PrivateMessages.find({chat:room}, {sort: {time: +1}});
});

Meteor.publish("users-room", function(room){
    var userList = new Array();
    var roomUsers = null;
    if(room.room == "none"){
        return Chatrooms.find({});
        }
    roomUsers = User_Room.find({room:room.room, type:room.type});
    User_Room.find({room:room.room}).fetch().forEach(function(row){
        userList.push(row.user);
    });
    userList = Meteor.users.find({_id:{$in: userList}},
        {fields:{_id:1, "prodile.name":1, "profile.lastname":1, "profile.status":1,status:1}},
        {sort:{"profile.status":["online","away","offline"],"profile.name":1,"profile.lastname":1}}
    );
    return [userList, roomUsers];
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

Meteor.publish("groups-mods", function(){
    /**
     * list of users and what groups they are part of the same that the actual user is moderator of.
     **/
    var user_groupArray = new Array();
    var list_userGroup = new Array();
    User_Room.find({mod:true,user:this.userId}).fetch().forEach(function(row){
        User_Room.find({group:row.group}).fetch().forEach(function(group){
            list_userGroup.push(group.user);
        });
        user_groupArray.push(row.group);
    })
    var users = Meteor.users.find({_id:{$in:list_userGroup}}, {fields:{_id:1, "profile.name":1, "profile.lastname":1, status:1}});
    var users_groups = User_Room.find({group:{$in:user_groupArray}});
	return [users, users_groups];
});

Meteor.publish("user-groups", function(){

	return User_Room.find({user: this.userId});
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
	return Correction.find({room: null});
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
		return Correction.find({room: null});
	}
	return corrections;
});

Meteor.publish("usage", function(usagefor){
	return Usage.find({usagefor:usagefor});
});


Meteor.publish("emails-sent", function(){
	return Email.find({emailfrom:this.userId});
});
Meteor.publish("emails-received", function(){
	return Email.find({emailto:this.userId});
});


//userprofile
Meteor.publish("profile",function(args){
    var user = Meteor.users.findOne({_id:args.userId});
    if (user.profile.privacy == "open"){
        user = Meteor.users.find({_id:args.userId},{fields:{_id:1,"profile":1, status:1, privacy:1}});
    }else if (user.profile.privacy =="contacts"){
        if(UsersRelations.findOne({user:args.userId, contact:args.currentUser}))
            user = Meteor.users.find({_id:args.userId},{fields:{_id:1,"profile":1, status:1, privacy:1}});
        else
            user = Meteor.users.find({_id:args.userId}, {fields:{_id:1, "profile.name":1, "profile.lastname":1, privacy:1}});
    }else{
        //them it's private, but the name and last name will always be shown
        user = Meteor.users.find({_id:args.userId}, {fields:{_id:1, "profile.name":1, "profile.lastname":1, privacy:1}});
    }
    return user;
});
// Users roles
Meteor.publish(null, function (){ 
  return Meteor.roles.find({})
  });
