/**
*       Server routines
**/

Meteor.startup(function(){
    if (Chatrooms.find().count() == 0){
        console.log('adding chatrooms');
        Chatrooms.insert({"name": "Test", details:"A test room"});
        Chatrooms.insert({"name": "Test2", details:"A test room"});
    }
    //prevent data being duplicated on server restart
    var starting = true;
    var user_chatroom = Meteor.users.find({"profile.active_room.type": "public"});
    user_chatroom.observe({
        added: function(doc){
            if(!starting)
                User_Chatroom.insert({room:doc.profile.active_room.room,
                                      user:doc._id,joined: true, date:Date.now()});
        },
        changed: function(doc){
            var is_joined = User_Chatroom.findOne({
                room:doc.profile.active_room.room,user: doc._id});
            if (is_joined == undefined)
                User_Chatroom.insert({room:doc.profile.active_room.room,
                                      user:doc._id,joined: true, date:Date.now()});
        }
    });
    Requests.find().observe({
        added: function(doc){
            if(doc.type === "participation")
                if(Groups.findOne({_id:doc.group}).type === "open")
                    User_Room.insert({room:doc.group,type:"group",
                                      new_messages:0,user:doc.user,date: Date.now()});
        },
        changed: function(doc){
        }
    });
    UserRequest.find().observe({
        added: function(doc){},
        changed: function(doc){
            if (doc.accept &&
                UsersRelations.findOne({user:doc.request_to, contact:doc.user}) === undefined){
                UsersRelations.insert(
                    {
                        user:doc.request_to,
                        contact:doc.user,
                        relation:doc.relation,
                        time: Date.now()
                    }
                );
                UsersRelations.insert(
                    {
                        user:doc.user,
                        contact:doc.request_to,
                        relation:doc.relation,
                        time: Date.now()
                    },
                    function(error, result)
                    {
                        if (!error) {
                            var chat = PrivateChat.findOne({
                                users:{$in:[doc.user,doc.request_to]}});
                            if (chat == undefined)
                            {
                                chat = PrivateChat.insert({users:[doc.user,doc.request_to]},
                                                          function(error, result){});
                                console.log(chat);
                                User_Room.insert({room:chat,type:"private",
                                                  new_messages:0,user:doc.user,active:false, date: Date.now(), contact:doc.request_to});
                                User_Room.insert({room:chat,type:"private",
                                                  new_messages:0,user:doc.request_to,active:false, date: Date.now(), contact:doc.user});
                                UserRequest.remove({_id:doc._id});
                            }
                        }else console.log(error);
                    }
                );
            }
        }
    });
    Messages.find().observe({
        added: function(doc){
            if(!starting){
                if (doc.type == "group" || doc.type == "pricatechat"){
                    var user_group = User_Room.find({room:doc.room}, {fields:{user:1}}).fetch();
                    var userArray = _.map(user_group,function(row){
                        return row.user;
                    });
                    var users = Meteor.users.find({_id:{$in:userArray}}, {fields:{_id:1}}).fetch();
                    userArray = _.map(users,function(row){
                        return row._id;
                    });
                    User_Room.update({room:doc.room, user:{$in:userArray}}, {$inc: {new_messages:1}},{multi:true});
                }
            }
        }
    });
    User_Room.find().observe({
        removed: function(doc){
            var group = doc.room;
            var room = User_Room.find({room:doc.room});
            if (room.count == 0){
                if(room.type === "group")
                    Groups.remove({_id:group});
                Messages.remove({room:group});
            }
            if(room.type === "private")
                Messages.remove({room:group});
            var roles = Roles.getRolesForUser(doc.user,doc.room);
            Roles.removeUsersFromRoles(doc.user, roles, doc.room);
        },
        added: function(doc){
            if(!starting){
                Roles.addUsersToRoles(doc.user, "group-member", doc.room);
                console.log(doc);
                var request_group = Requests.findOne({group:doc.room,user:doc.user});
                var request_user = Requests.findOne({group:doc.room,user:doc.user});
                if(request_group !== undefined)
                    Requests.remove({_id:request_group._id});
                if(request_user !== undefined)
                    Requests.remove({_id:request_user._id});
            }
        },
        changed: function(newdoc, oldDoc){
            /*var user_groups_mods = User_group.find({group:newdoc.group, mod:true}).count();
            if (!newdoc.mod){
                if(user_groups_mods){
                    User_group.update(newdoc, {$set:oldDoc});
                }
            }*/
        }
    });
    PrivateMessages.find().observe({
        added:function(doc){
            if(!starting){
                PrivateMessages.update({_id:doc._id}, {$set:{new_message: true}});
//                PrivateChat.update({_id:doc.chat}, {$inc:{new_messages:1}});
            }
        }
    });
    Groups.find({}).observe({
        added:function (doc){
            if(!starting){
                console.log("adding user_group");
                User_Room.insert({room:doc._id,type:"group",new_messages:0,
                                  user:doc.owner,active:true, date: Date.now()});
                Roles.setUserRoles(doc.owner,["owner", "group-manager"], doc._id);
            }
        }
    });
    starting = false;


});

Accounts.onCreateUser(function(options,user){
        console.log('Creationg user');
        try{
                // console.log(user.services.password.srp);

                options.profile.online = true;
        options.profile.away = false;
            options.profile.active_room = {type:"none",room:"none"};
            options.profile.default_status = "online";
            options.profile.status = "online";
        options.profile.blocked_users = [];
                user.profile = options.profile;
                // Accounts.setPassword(user._id, user.password);
                /*Accounts.verifyEmail(user.services.password.srp.verifier,function(error){
                        if(error)
                                console.log(error);
                });*/
        user.srp = options.srp;
                console.log("User created:");
                console.log(user.profile);
                console.log('sign up ok');
                return user;
        }catch(e){
                console.log('error on sign up: ' + user.profile.name);
                console.log(e);
        }
});

UserStatus.events.on("connectionLogin", function(user){
    if (user.userId){
        Meteor.users.update({_id:user.userId}, {$set:{"profile.status":"online"}});
    }
});
UserStatus.events.on("connectionLogout", function(user){
    if (user.userId){
        Meteor.users.update({_id:user.userId}, {$set:{"profile.status":"ofline"}});
    }
});
UserStatus.events.on("connectionIdle", function(user){
    if (user.userId){
        console.log(user)
        Meteor.users.update({_id:user.userId}, {$set:{"profile.status":"away"}});
    }
});
/*Hooks.onLoggedIn = function (userId) {
    // this runs right after a user logs in, on the client or server
    if(Meteor.user().profile.default_status == "online")
        Meteor.users.update({_id:Meteor.userId()},{$set:{"profile.status":"online"}});
    console.log("User: " + Meteor.user().profile.name + " logged in. Status: " + Meteor.user().profile.status);
}
Hooks.onLoggedOut = function (userId) {
    // this runs right after a user logs out, on the client or server
        // Meteor.users.update({_id:Meteor.userId()},{$set:{"profile.online":false}});
        // Meteor.users.update({_id:Meteor.userId()},{$set:{"profile.away":false}});
        if(Meteor.user())
    {
        Meteor.users.update({_id:Meteor.userId()},{$set:{"profile.status":"offline"}});
        console.log("User: " + Meteor.user().profile.name + " logged out. Status: " + Meteor.user().profile.status);
    }
    /*Meteor.call('setRoom_Non_active');
        Meteor.call('setGroup_Non_active');
        Meteor.call('setFriend_Non_active');*//*
}

Hooks.onCloseSession = function (userId) {
        if(Meteor.user()){
                Meteor.users.update({_id:Meteor.userId()},{$set:{"profile.status":"offline"}});
                console.log("User: " + Meteor.user().profile.name + " closed the session. Status: " + Meteor.user().profile.status);    
        }
        /*Meteor.call('setRoom_Non_active');
        Meteor.call('setGroup_Non_active');
        Meteor.call('setFriend_Non_active');*//*
}

Hooks.onDeleteUser = function () {

}

Hooks.onCreateUser = function () {

}
*/
