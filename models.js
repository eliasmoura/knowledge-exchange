/**
*  Models
**/

UsersRelations = new Meteor.Collection('users_relations');
OnlineUsers = new Meteor.Collection('onlineusers');

Messages = new Meteor.Collection('messages');
Requests = new Mongo.Collection('requests');
UserRequest = new Meteor.Collection('user_request');
PrivateMessages = new Meteor.Collection('privatemessages');
PrivateChat = new Meteor.Collection('privatechat');
Chatrooms = new Meteor.Collection('chatrooms');
User_Chatroom = new Meteor.Collection('user_chatroom');


GroupRequest = new Meteor.Collection('group_request')
Groups = new Meteor.Collection('groups');
GroupChat = new Meteor. Collection('groupchat');
User_Room = new Meteor.Collection("user_room");


Languages = new Meteor.Collection('languages');

Corrections = new Meteor.Collection('corrections');
Correction = new Meteor.Collection('correction');
Usage = new Meteor.Collection('usage');
Explanation = new Meteor.Collection('explanation');
Alternative = new Meteor.Collection('alternative');

Email = new Meteor.Collection('email');

Report = new Meteor.Collection('report');

Messages.allow({
    insert: function(userId, doc){
        if(userId && doc.owner === userId)
            if(Chatrooms.findOne({_id:doc.room}))
                return true;
            else{
                if(Groups.findOne({_id:doc.room})){
                    if(User_Room.findOne({user:doc.owner, room:doc.room}))
                        return true;
                }else if(PrivateChat.findOne({_id:doc.room}))
                    return true;
            }
        return false;
    },
    update: function(userId, doc, fields, modifier){
    },
    remove: function(userId, doc){
    },
    fetch: []
});

Requests.allow({
    insert: function(userId, doc){
        var allowed = false;
        if(userId && userId === doc.user)
            if(Requests.findOne({user:doc.user,group:doc.group}) === undefined &&
                Requests.findOne({user:doc.contact,group:doc.contact}) === undefined)
            if(doc.type === "participation"){
                var group = Groups.findOne({_id:doc.group});
                if(group !== undefined ){
                    if(group.type === "open" || group.type === "participation")
                        allowed = true;
                    else if(Roles.userIsInRole(userId, "group-member", group._id))
                        allowed = true;
                }
            }else if(doc.type === "contact"){
                var user =  Meteor.findOne({_id:doc.user});
                if(user !== undefined)
                    allowed = true;
            }
        return allowed;
    },
    update: function(userId, doc, fields, modifier){
    },
    remove: function(userId, doc){
    },
    fetch: []
});

Chatrooms.allow({
    insert: function(userId, doc){
    },
    update: function(userId, doc, fields, modifier){
    },
    remove: function(userId, doc){
    },
    fetch: []
});

User_Chatroom.allow({
    insert: function(userId, doc){
        return userId && doc.owner === userId;
    },
    update: function(userId, doc, fields, modifier){
    },
    remove: function(userId, doc){
    },
    fetch: []
});

GroupRequest.allow({
    insert: function(userId, doc){
        var allow = false;
        var group = Groups.findOne({_id:doc.group});
        if(group){
            if(doc.type === 1){
                if(group.groupType !== "inviterequest")
                    allow = true;
            }else if(Roles.userIsInRole(userId, "group-member", group._id))
                allow = true;
        }else{

        }
        return allow;
    },
    update: function(userId, doc, fields, modifier){
    },
    remove: function(userId, doc){
    },
    fetch: []
});

Groups.allow({
    insert: function(userId, doc){
        return userId && doc.owner === userId;
    },
    update: function(userId, doc, fields, modifier){
        return Roles.userIsInRole(userId, "group-manager", doc._id);
    },
    remove: function(userId, doc){
        return Roles.userIsInRole(userId, "owner", doc._id);
    },
    fetch: []
});

GroupChat.allow({
    insert: function(userId, doc){
        return userId && doc.owner === userId;
    },
    update: function(userId, doc, fields, modifier){
    },
    remove: function(userId, doc){
    },
    fetch: []
});

User_Room.allow({
    insert: function(userId, doc){
        var allowed = false;
        if(doc.type === "public"){
            if(Chatrooms.findOne({_id:doc.room}) !== undefined)
                if(userId && doc.user === userId)
                allowed = true;
        }else if(doc.type === "group"){
            var group = Groups.findOne({_id:doc.room});
            if(group !== undefined){
                if(group.type === "open")
                    allowed = true;
                else if(Roles.userIsInRole(userId, "group-manager", group._id))
                    allowed = true;
            }
        }
        return allowed;
    },
    update: function(userId, doc, fields, modifier){
        var allowed = false;
        var group = Groups.findOne({_id:doc.room});
        var pgroup = Chatrooms.findOne({_id:doc.room});
        var privatechat = PrivateChat.findOne({_id:doc.room});
        group = group !== undefined ? group : pgroup;
        group = group !== undefined ? group : privatechat;
        if(group !== undefined && userId ){
            if(Roles.userIsInRole(userId, "group-manager", group._id))
                if(!_.contains(fields,["user","_id", "new_messages","date","room", "settings"]))
                    allowed = true;
            if(fields.length == 1 && userId === doc.user)
                if(_.contains(fields,"new_messages"))
                    allowed = true;
            if(doc.user)
                if(!_.contains(fields, ["user","_id", "date", "room"]))
                    allowed = true;
        }
        return allowed;
    },
    remove: function(userId, doc){
        var allowed = false;
        if(doc.type === "public"){
            if(Chatrooms.findOne({_id:doc.room}) !== undefined)
                if(userId && doc.user === userId)
                allowed = true;
        }else if(doc.type === "group"){
            var group = Groups.findOne({_id:doc.room});
            if(group !== undefined){
                if(Roles.userIsInRole(userId, "group-manager", group._id) || (userId && doc.user === userId))
                    allowed = true;
            }
        }
        return allowed;
    },
    fetch: []
});

PrivateChat.allow({
    insert: function(userId, doc){
        return userId && doc.owner === userId;
    },
    update: function(userId, doc, fields, modifier){
    },
    remove: function(userId, doc){
    },
    fetch: []
});

PrivateMessages.allow({
    insert: function(userId, doc){
        return userId && doc.owner === userId;
    },
    update: function(userId, doc, fields, modifier){
    },
    remove: function(userId, doc){
    },
    fetch: []
});

UsersRelations.allow({
    insert: function(userId, doc){
        return userId && doc.owner === userId;
    },
    update: function(userId, doc, fields, modifier){
        if (doc.owner === userId){
            if(_.contains(fields,["user","_id", "contact","date"]))
                    return false;
        }
        return false;
    },
    remove: function(userId, doc){
    },
    fetch: []
});

Usage.allow({
    insert: function(userId, doc){
        return userId && doc.owner === userId;
    },
    update: function(userId, doc, fields, modifier){
        var isAllowed = false;
        if (doc.owner === userId){
            isAllowed = true;
            for(var i = 0; i < fields.length; i++){
                if (fields[i] == "_id"){
                    isAllowed = false;
                    break;
                }
            }
        }

        return isAllowed;
    },
    remove: function(userId, doc){
    },
    fetch: []
});


Correction.allow({
    insert: function(userId, doc){
        return userId && doc.owner === userId;
    },
    update: function(userId, doc, fields, modifier){
        var isAllowed = false;
        if (doc.owner === userId){
            isAllowed = true;
            for(var i = 0; i < fields.length; i++){
                if (fields[i] == "_id"){
                    isAllowed = false;
                    break;
                }
            }
        }

        return isAllowed;
    },
    remove: function(userId, doc){
    },
    fetch: []
});

Explanation.allow({
    insert: function(userId, doc){
        return userId && doc.owner === userId;
    },
    update: function(userId, doc, fields, modifier){
        var isAllowed = false;
        if (doc.owner === userId){
            isAllowed = true;
            for(var i = 0; i < fields.length; i++){
                if (fields[i] == "_id"){
                    isAllowed = false;
                    break;
                }
            }
        }

        return isAllowed;
    },
    remove: function(userId, doc){
    },
    fetch: []
});

Alternative.allow({
    insert: function(userId, doc){
        return userId && doc.owner === userId;
    },
    update: function(userId, doc, fields, modifier){
        var isAllowed = false;
        if (doc.owner === userId){
            isAllowed = true;
            for(var i = 0; i < fields.length; i++){
                if (fields[i] == "_id"){
                    isAllowed = false;
                    break;
                }
            }
        }

        return isAllowed;
    },
    remove: function(userId, doc){
    },
    fetch: []
});

Email.allow({
    insert: function(userId, doc){
        return userId && doc.owner === userId;
    },
    update: function(userId, doc, fields, modifier){
    },
    remove: function(userId, doc){
    },
    fetch: []
});

Report.allow({
    insert: function(userId, doc){
        return userId && doc.owner === userId;
    },
    update: function(userId, doc, fields, modifier){
    },
    remove: function(userId, doc){
    },
    fetch: []
});

UserRequest.allow({
    insert: function(userId, doc){
        var contact = Meteor.users.find({_id:doc.request_to},{fields:{_id:1}});
        if(!contact) return false;
        if(!UsersRelations.findOne({user:userId, contact:contact._id}))
            if(!UserRequest.findOne({user:userId, request_to:contact._id}))
                return true;
        return false;
    },
    update: function(userId, doc, fields, modifier){
        if(userId && fields.length === 1)
            if(_.contains(fields, "accept"))
                return true;
        return false;
    },
    remove: function(userId, doc){
        if(userId && doc.request_to === userId) return true;
        return false;
    }
});
