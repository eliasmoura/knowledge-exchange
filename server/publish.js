Meteor.publish("requests", function(){
	var groups = User_Group.find({user:this.userId, mod:true}).fetch();
	var groupArray = new Array();
	var groupsRequest_participation = false;

	var friendshipRequests = UserRequest.find({request_to: this.userId});
    friendshipRequests.observe({
        changed: function(doc){
            console.log(doc);
            if (doc.accept == 1){
                UsersRelations.insert({user:doc.request_to,contact:doc.user,relation:doc.relation,time: Date.now()});
                UsersRelations.insert({user:doc.user,contact:doc.request_to,relation:doc.relation,time: Date.now()},function(error){
                    if (!error) {
                        PrivateChat.insert({users:[doc.user,doc.request_to]}, function(error, result){
                        });
                        UserRequest.remove({_id:doc._id});
                        console.log('friendship ok');
                    }else console.log(error);
                });
            }else{
                UserRequest.remove({_id:doc._id});
            }
        }
    });
	var	friends = false;
	
	var response = new Array();

	if(groups){
		groups.forEach(function(row){
			groupArray.push(row.group);
		});
		groupsRequest_participation = GroupRequest.find({group:{$in: groupArray},type:1});
	}

	if (friendshipRequests)
		response.push(friendshipRequests);
	if(groupsRequest_participation)
		response.push(groupsRequest_participation);
        console.log("resturning requests");
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



Meteor.publish("user-chatroom-list", function(){
    var user = Meteor.users.findOne({_id:this.userId});
	var chatroom = User_Chatroom.find({room:user.profile.active_room.room});

	var userChatroomList = new Array();
	if (chatroom) 
		chatroom.fetch().forEach(function(row){
			userChatroomList.push(row.room);
		});

	var user_chatroom = User_Chatroom.find({room:user.profile.active_room.room});
	var users =  Meteor.users.find({"profile.active_room.room":user.profile.active_room.room}, 
        {fields:{_id:1, "profile.name":1, "profile.lastname":1, "profile.status":1,status:1}},
        {sort:{"profile.status":["online","away","offline"],"profile.name":1,"profile.lastname":1}});
    return [user_chatroom,users];
});

Meteor.publish("chatrooms-list", function(){
	//console.log(Chatrooms.find().fetch());
	return Chatrooms.find({});
});

Meteor.publish("chat-messages", function(active_room){
	// console.log(active_room);
	var isso = active_room.type;
    var messages = null;
	if(active_room.type == "none"){
		console.log('no room active');
		return Messages.find({room:null}, {sort: {time: +1}})
	}
    if(active_room.type == "public"){
		messages =  Messages.find({room:active_room.room}, {sort: {time: +1}});
    }
    if(active_room.type == "group"){
		messages = GroupChat.find({groupchat:active_room.room}, {sort: {time: +1}});
        messages.observe({
            added:function(doc){
                User_Group.update({room:active_room.room, active:false}, {$inc: {new_messages:1}},{multi:true});
            }
        });
    }
    if(active_room.type == "privatechat"){
		messages = PrivateMessages.find({chat:active_room.room}, {sort: {time: +1}});
        messages.observe({
            added:function(doc){
                PrivateChat.update({_id:doc.chat}, {$inc:{new_messages:1}});
            }
        });
    }
    return messages;
});



Meteor.publish("rooms-users-list", function(room){
    var room = Meteor.users.findOne({_id:this.userId}).profile.active_room;
    Meteor.users.find({_id:this.userId})
    var userList = new Array();
    var roomUsers = null;
    if(room.type == "public"){
        roomUsers = User_Chatroom.find({room:room.room});
        User_Chatroom.find({room:room.type}).fetch().forEach(function(row){
            userList.push(row.user);
        });
    }else
    if(room.type == "group"){
        roomUsers = User_Group.find({group:room.room});
        User_Group.find({group:room.room}).fetch().forEach(function(row){
            userList.push(row.user);
        });
    }else
    if(room.type == "privatechat"){
        roomUsers = PrivateChat.find({_id:room.room});
        userList.push(roomUsers.fetch().contact);
        userList.push(this.userId);
    }
    userList = Meteor.users.find({_id:{$in: userList}},
        {fields:{_id:1, "prodile.name":1, "profile.lastname":1, "profile.status":1,status:1}},
        {sort:{"profile.status":["online","away","offline"],"profile.name":1,"profile.lastname":1}});
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
