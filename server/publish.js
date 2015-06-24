Meteor.publish("requests", function(){
        //var groups = User_Group.find({user:this.userId, mod:true}).fetch();
    var groupsArray = Roles.getGroupsForUser(this.userId, "group-manager")
        //var groupArray = new Array();
        var groupsRequest_participation = false;

        var friendshipRequests = UserRequest.find({request_to: this.userId});
        var     friends = false;

        var response = new Array();

        /*if(groups){
                groups.forEach(function(row){
                        groupArray.push(row.group);
                });
        }*/

    groupsRequest_participation = Requests.find({group:{$in: groupsArray},type:"participation"});

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
Meteor.publish("user-list", function(){
    var rooms = _.map(
        User_Room.find({user:this.userId}).fetch(),
        function(element){
            return element.room;
        }
    );
    var users = _.map(User_Room.find({room:{$in:rooms}}).fetch(), function(element){return element.user;});
        return Meteor.users.find({_id:{$in:users}},{fields:{_id:1, "profile.name":1,"profile.lastname":1,"profile.status":1}});
});
Meteor.publish("chatrooms-list", function(){
        return Chatrooms.find({});
});

Meteor.publish("messages", function(room){
    var messages = false;
    var group = Groups.findOne({_id:room});
    if(group !== undefined){
        if(Roles.userIsInRole(this.userId, "group-member", room) || Roles.userIsInRole(this.userId, "group-manager", room) || Roles.userIsInRole(this.userId, "owner", room))
            messages = Messages.find({room:room}, {sort: {time: +1}});
        else messages = Messages.find({_id: null});
    }else
    messages = Messages.find({room:room}, {sort: {time: +1}});
     return messages;
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
        {fields:{_id:1, "profile.name":1, "profile.lastname":1, "profile.status":1,status:1}},
        {sort:{"profile.status":["online","away","offline"],"profile.name":1,"profile.lastname":1}}
    );
    return [userList, roomUsers];
});

Meteor.publish("groups-list", function(){
    var groups = User_Room.find({user:this.userId, type:"group"},{fields:{room:1}}).fetch();
    groups = _.map(groups,function(element){return element.room;});
        return Groups.find({_id:{$in:groups}});
});
Meteor.publish("currentRoom", function(room, type){
    if(type === "public")
        return Chatrooms.find({_id:room});
    if(type === "group"){
        return Groups.find({_id:room});
    }
    if(type === "user"){
        return Meteor.users.find({_id:room});
    }
    return Chatrooms.find({});
})

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
    if(this.userId && this.userId === user._id)
      user = Meteor.users.find({_id:this.userId});
      else
    if (user.profile.privacy == "open"){
        user = Meteor.users.find({_id:args.userId},{fields:{_id:1,profile:1, status:1, privacy:1}});
    }else if (user.profile.privacy =="contacts"){
        if(UsersRelations.findOne({user:args.userId, contact:args.currentUser}))
            user = Meteor.users.find({_id:args.userId},{fields:{_id:1,profile:1, status:1, privacy:1}});
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
