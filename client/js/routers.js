Router.route('home', {
    path:'/',
    template: 'home',
    yieldTemplates: {
                    //'home-side': {to: 'sidebar'}
    },
    onBeforeAction:function(){
        if (!Meteor.user()) {
            // render the login template but keep the url in the browser the same
            this.render('welcome');

            // stop the rest of the before hooks and the action function 
            //this.pause();
          }else{
          // Meteor.users.update({_id:Meteor.userId()}, {$set:{context:"home"}});
          this.next();
          }
    },
    data:{activeHome: "active",
          pageTitle: "Home"}
});
Router.route('login', {
    path:'/login',
    template: 'login_form',
    yieldTemplates: {
                    //'home-side': {to: 'sidebar'}
    },
    onBeforeAction:function(){
        if (!Meteor.user()) {
            // render the login template but keep the url in the browser the same
            //this.render('welcome');

            // stop the rest of the before hooks and the action function 
            //this.pause();
            this.next();
          }else{
          // Meteor.users.update({_id:Meteor.userId()}, {$set:{context:"home"}});
            this.redirect("userprofile", {_id:Meteor.userId()});
          }
    },
    data:{activeHome: "active",
          pageTitle: "Home"}
});
Router.route('signup', {
    path:'/signup',
    template: 'register_form',
    yieldTemplates: {
                    //'home-side': {to: 'sidebar'}
    },
    onBeforeAction:function(){
        if (!Meteor.user()) {
            // render the login template but keep the url in the browser the same
            //this.render('welcome');

              this.next();
            // stop the rest of the before hooks and the action function 
            //this.pause();
          }else{
          // Meteor.users.update({_id:Meteor.userId()}, {$set:{context:"home"}});
            this.redirect("/userprofile");
          }
    },
    data:{activeHome: "active",
          pageTitle: "Home"}
});
Router.route('userprofile', {
    path:'/userprofile/:_id',
    template: 'user_profile',

    yieldTemplates: {
                    //'home-side': {to: 'sidebar'}
    },
    fastRender: true,
    waitOn: function(){
        return Meteor.subscribe("profile",{userId:this.params._id,currentUser:Meteor.userId()});
    },
    onBeforeAction:function(){
        if (!Meteor.user()) {
            // render the login template but keep the url in the browser the same
            this.render('welcome');

            // stop the rest of the before hooks and the action function 
          }else{
            /*var user = Meteor.users.findOne({_id:this.params._id});
            var username = user.profile.name + " " +user.profile.lastname;
            var currentUser = false;
            if (this.params._id == Meteor.userId()){
                currentUser = true;
            }*/
            Session.set("profile",this.params._id);
            this.next();
          // Meteor.users.update({_id:Meteor.userId()}, {$set:{context:"home"}});
          }
    },
    data:{activeHome: "active",
          pageTitle: "Home"}
});
Router.route('chatrooms', {path:'/chat',
    template: 'chatrooms',
    yieldTemplates: {
        'chatrooms_side': {to: 'sidebar'}
    },
    fastRender: true,
    waitOn: function(){
        
        if(Meteor.user())
        return [
            Meteor.subscribe("chatrooms-list"),
            Meteor.subscribe("user-chat-list"),
            Meteor.subscribe("privatechat"),
            Meteor.subscribe("chat-messages", Meteor.user().profile.active_room),
            Meteor.subscribe("chat-corrections",Meteor.user().profile.active_room),
            Meteor.subscribe("user-groups"),
            Meteor.subscribe("user-groups-list", User_Group.find({user:Meteor.userId()}).fetch()),
            Meteor.subscribe("languages-list"),
            Meteor.subscribe("requests"),
            Meteor.subscribe("requests-invite"),
            Meteor.subscribe("user-list"),
            Meteor.subscribe("groups-mods"),
            Meteor.subscribe("groups-list"),
            Meteor.subscribe("user-contact"),
            Meteor.subscribe("emails-received"),
            Meteor.subscribe("emails-sent"),
            Meteor.subscribe("rooms-users-list", Meteor.user().profile.active_room)
        ];
    },
    onBeforeAction:function(){
        if (!Meteor.user()) {
            // render the login template but keep the url in the browser the same
            this.render('home');

            // stop the rest of the before hooks and the action function 
          }else{
            /*var isso = Meteor.users.update({_id:Meteor.userId()}, {$set:{context:"chatrooms"}}, function(error,doc){
                console.log(error);
            });
            console.log(isso);*/
            this.next();
          }
          
          
    },
    onAfterAction:function(){
        
        
        
    },
    data:
    {
        rooms: function(){
            // console.log(Chatrooms.find({}, {sort: {name: +1}}).fetch());
            var rooms = Chatrooms.find({}, {sort: {name: +1}}).fetch();
            // console.log(rooms);
            var roomsArray = new Array();
            if(Meteor.user())
            rooms.forEach(function(row){
                if (row._id == Meteor.user().profile.active_room.room)
                    row.active = "true";
                roomsArray.push(row);
            })
            return roomsArray;
        },
        room: function(){
            try{
                var room = Meteor.user().profile.active_room;
                
                if ( room.type == "public"){
                    room = Chatrooms.findOne({_id:room.room});
                }
                else if ( room.type == "group"){
                    room = Groups.findOne({_id:room.room});
                }	
                else if ( room.type == "privatechat"){
                    var user  = PrivateChat.findOne({_id:room.room}).users;
                    if(user[0] != Meteor.userId()){
                        user = Meteor.users.findOne({_id:user[0]});
                    }else{
                        user = Meteor.users.findOne({_id:user[1]});
                    }
                    room = {name:user.profile.name, _id:PrivateChat.findOne({_id:room.room})._id};
                }
                return room;
            }catch (e){
                console.log(e);
                return false;
            }
        },
        chat_users: function(){
            var room = Meteor.user().profile.active_room;
            var userList = new Array();
            if(room.type =="public"){
                User_Chatroom.find({room:room.room}).forEach(function(row){
                    userList.push(row.user);
                });
            }else if (room.type == "group"){
                User_Group.find({group:room.room}).forEach(function(row){
                    userList.push(row.user);
                });
            }else if(room.type == "privatechat"){
                userList = PrivateChat.findOne({_id:room.room}).users;
            }
            userList = Meteor.users.find({_id:{$in:userList} }, {fields:{_id:1, status:1, "profile.name":1, "profile.lastname":1}});
            userList = _.map(userList.fetch(), function(doc){return {_id:doc._id,name:doc.profile.name,lastname:doc.profile.lastname,fullname:doc.profile.name + " " + doc.profile.lastname};});
            console.log(room);
            console.log(userList);
            return userList;
        },
        contacts: function(){
            var users_relations = UsersRelations.find({}).fetch();
            var users_relationsArray = new Array();
            users_relations.forEach(function(row){
                var privatechat = PrivateChat.findOne({users:{$in:[row.contact]}});
                var user = Meteor.users.findOne({_id:row.contact});
                try{
                    user.notification = privatechat.new_messages;
                    if (privatechat._id == Meteor.user().active_room.room)
                        user.active = true;
                }catch(e){}
                users_relationsArray.push(user);
            });
            /*
            var privatechatnotifications = PrivateChat.find({new_messages:{$gt:0}}).fetch();;
            var privatenotificationsArray = {};
            console.log(privatechatnotifications);
            privatechatnotifications.forEach(function(row){

                privatenotificationsArray[row.contact] = row.new_messages;
            });
            // console.log(privatenotificationsArray);
            var users = new Array();
            Meteor.users.find({_id:{$in:users_relationsArray}}).fetch().forEach(function(row){
                row.notification = privatenotificationsArray[row._id];
                users.push(row);
            });*/

            return users_relationsArray;
        },
        emails_notifications: function(){
            return false;
        },
        
        messages: function(){
            var messages = Meteor.user().profile.active_room;
            var messagesArray = new Array();

            if (messages.type == "public"){
                messages = Messages.find({room:messages.room});
            }
            else if (messages.type == "group"){
                try{
                messages = GroupChat.find({groupchat:messages.room});
                }catch(e){console.log(e);}
            }	
            else if (messages.type == "privatechat"){
                messages = PrivateMessages.find({chat:messages.room});
            }
            else messages = false;
            var blocked_users = Meteor.user().profile.blocked_users;
            if (messages)
            if (messages.count()){
                messages.forEach(function(row){
                    if( blocked_users == undefined)
                        blocked_users = [];
                    // console.log(blocked_users);
                    if (blocked_users.indexOf(row.userid) == -1) {
                        var corrections = Correction.find({message:row._id});
                        row.corrections = [];
                        corrections.forEach(function(crow){
                            crow.corrector = Meteor.users.findOne({_id:crow.corrector},{fields:{"profile.name":1}}).profile.name;
                            //console.log(crow.correction);
                            //crow.text = crow.correction;
                            row.corrections.push(crow);
                        })
                        messagesArray.push(row);
                        //console.log(row);
                    }
                })
            }//catch(e){console.log(e);}
            // console.log(messagesArray);
            return messagesArray;
        },
        group_rooms:function(){
            var user_groups = User_Group.find({user: Meteor.userId()}).fetch();
            // console.log(user_groups);
            var groupsArray = new Array();
            // var groups = new Array();
            user_groups.forEach(function(row){
                // console.log(row);
                var group = Groups.findOne({_id:row.group});
                // console.log(group);
                if(group != undefined){
                    group.notification = row.new_messages;
                    if (row.group == Meteor.user().profile.active_room.room)
                        group.active = true;
                    // console.log(group);
                    group.owner = row.owner;
                    group.mod = row.mod;
                    if(Roles.userIsInRole(Meteor.userId(), "group-manager", row.group)|| Roles.userIsInRole(Meteor.userId(), "owner", row.group)){
                        group.isMod = true;
                        group.request = {total:GroupRequest.find({group:row.group, type:1}).count()};
                    }else group.isMod = false;
                    groupsArray.push(group);
                }
            });

            
            /*Groups.find({_id:{$in: groupsArray}}).fetch().forEach(function(row){
                row.notification = User_Group.findOne({user:Meteor.userId(), group:row._id}).new_messages;
                groups.push(row);
            });*/
            //console.log(groups);
            //console.log(groupsArray);
            return groupsArray;
        },
        add_user:function(){
            return Session.get("add_user");
        },
        
        activeChat: "active",
        pageTitle: "Chat app"
        //myUsersList: function(){//var users = UsersRelations.find({user:Session.get('currentUser')._id});
                                  //for (var i = 0; i < users.length; i++) {
                                  //	users[i] = {user:Meteor.users.findOne({_id:users[i][0]})};
                                  //}
                                  //return true;}
    }
});
/*Router.route('blog', {path:'/blog',
    template: 'blog',
    yieldTemplates: {
        'blog-side': {to: 'sidebar'}
    },
    onBeforeAction:function(){
        if (!Meteor.user()) {
            // render the login template but keep the url in the browser the same
            this.render('notFound');

            // stop the rest of the before hooks and the action function 
            this.pause();
          }else{
          // Meteor.users.update({_id:Meteor.userId()}, {$set:{context:"blog"}});
          }
    },
    data:{activeBlog: "active",
        pageTitle: "Blog"
    }
});
Router.route('user', {path:'/user/:_ID',
    template: 'user-profile',
    yieldTemplates:{
        'user-side': {to: 'sidebar'}
    },
    onBeforeAction:function(){
        if (!Meteor.user()) {
            // render the login template but keep the url in the browser the same
            this.render('notFound');

            // stop the rest of the before hooks and the action function 
            this.pause();
          }else{
          // Meteor.users.update({_id:Meteor.userId()}, {$set:{context:"user"}});
          }
    },
    data:{

    }
});*/
Router.route('logo',function(){this.redirect("home");});
