/**
*  Models
**/

UsersRelations = new Meteor.Collection('users_relations');
OnlineUsers = new Meteor.Collection('onlineusers');

Messages = new Meteor.Collection('messages');

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
        return userId && doc.owner === userId;
    },
    update: function(userId, doc, fields, modifier){
    },
    remove: function(userId, doc){
    },
    fetch: []
});

Chatrooms.allow({
    insert: function(userId, doc){
        return userId && doc.owner === userId;
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
        return userId && doc.owner === userId;
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
        return userId && doc.user === userId;
    },
    update: function(userId, doc, fields, modifier){
    },
    remove: function(userId, doc){
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

