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
      this.redirect("userprofile_id", {_id:Meteor.userId()});
    }
  },
  data:{//activeHome: "active",
    pageTitle: "Home"}
});
Router.route('/signup', {
  path:'/signup',
  name:'signup',
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
      this.redirect("userprofile");
    }
  },
  data:{//activeHome: "active",
    pageTitle: "Home"}
});
Router.route('/userprofile/:_id',
  function(){
  },
  {
    name: "userprofile_id",
    template: 'user_profile',

    yieldTemplates: {
      //'home-side': {to: 'sidebar'}
    },
    fastRender: true,
    waitOn: function(){
      return Meteor.subscribe("profile",{userId:this.params._id,currentUser:Meteor.userId()});
    },
    onBeforeAction:function(){
      if (Meteor.userId() === null) {
        // render the login template but keep the url in the browser the same
        this.render('welcome');
        // stop the rest of the before hooks and the action function
      }else{
        Session.set("profile",this.params._id);
        var user  = Meteor.users.findOne({_id:this.params._id}).profile;
        document.title = user.name + " " + user.lastname;
        this.next();
      }
    },
    data:{activeUser: "active",
      pageTitle: "Home"}
  });
  Router.route('/userprofile',
    function(){
      document.title = "Chat - My site";
    },
    {
      name: "userprofile",
      template: 'user_profile',

      yieldTemplates: {
        //'home-side': {to: 'sidebar'}
      },
      fastRender: true,
      waitOn: function(){
      },
      onBeforeAction:function(){
        if (Meteor.userId() === null) {
          // render the login template but keep the url in the browser the same
          this.render('welcome');

          // stop the rest of the before hooks and the action function
        }else{
          this.redirect("userprofile_id", {_id:Meteor.userId()});
          this.next()
        }
      },
      data:{activeUser: "active",
        pageTitle: "Home"}
    });
    Router.route('/chat', {
      name: "Chatrooms",
      controller: "ChatroomsCtrl",
      waitOn: function(){
        if(Meteor.user())
          return [
            Meteor.subscribe("chatrooms-list"),
            Meteor.subscribe("languages-list"),
            Meteor.subscribe("requests"),
            Meteor.subscribe("requests-invite"),
            Meteor.subscribe("user-list"),
            Meteor.subscribe("user-groups"),
            Meteor.subscribe("groups-list"),
            Meteor.subscribe("user-contact"),
            Meteor.subscribe("emails-received"),
            Meteor.subscribe("emails-sent"),
          ];
                  return [];
      }
    });
    Router.route('/chatroom/create-group', {
     name:'CreateGroup',
      controller: "ChatroomsCtrl",
      waitOn: function(){
        if(Meteor.user())
          return [
            Meteor.subscribe("chatrooms-list"),
            Meteor.subscribe("languages-list"),
            Meteor.subscribe("requests"),
            Meteor.subscribe("requests-invite"),
            Meteor.subscribe("user-list"),
            Meteor.subscribe("user-groups"),
            Meteor.subscribe("groups-list"),
            Meteor.subscribe("user-contact"),
            Meteor.subscribe("emails-received"),
            Meteor.subscribe("emails-sent"),
          ];
                  return [];
      }
    });

    Router.route('/chatroom/public/:_id', {
      name: "PublicChat",
      controller: "ChatroomCtrl",
      waitOn: function(){
        if(Meteor.user())
          var subs = [
            Meteor.subscribe("chatrooms-list"),
            Meteor.subscribe("messages", this.params._id),
            Meteor.subscribe("chat-corrections",{room:this.params._id, type:"public"}),
            Meteor.subscribe("users-room",{room:this.params._id, type:"public"}),
            Meteor.subscribe("currentRoom",this.params._id, "public"),
            Meteor.subscribe("languages-list"),
            Meteor.subscribe("requests"),
            Meteor.subscribe("requests-invite"),
            Meteor.subscribe("user-list"),
            Meteor.subscribe("user-groups"),
            Meteor.subscribe("groups-list"),
            Meteor.subscribe("user-contact"),
            Meteor.subscribe("emails-received"),
            Meteor.subscribe("emails-sent")
          ];
          return subs;
      },
      action: function(){
        this.state.set("roomid",this.params._id);
        this.state.set("roomtype", "public");
        this.render();
      },
    });
    Router.route('/chatroom/group/:_id', {
      name: "GroupChat",
      controller: "ChatroomCtrl",
      waitOn: function(){
        if(Meteor.user())
          var subs = [
            Meteor.subscribe("chatrooms-list"),
            Meteor.subscribe("messages", this.params._id),
            Meteor.subscribe("chat-corrections",{room:this.params._id, type:"group"}),
            Meteor.subscribe("users-room",{room:this.params._id, type:"group"}),
            Meteor.subscribe("currentRoom",this.params._id, "group"),
            Meteor.subscribe("languages-list"),
            Meteor.subscribe("requests"),
            Meteor.subscribe("requests-invite"),
            Meteor.subscribe("user-list"),
            Meteor.subscribe("user-groups"),
            Meteor.subscribe("groups-list"),
            Meteor.subscribe("user-contact"),
            Meteor.subscribe("emails-received"),
            Meteor.subscribe("emails-sent")
          ];
          return subs;
      },
      action: function(){
        this.state.set("roomid",this.params._id);
        this.state.set("roomtype", "group");
        this.render();
      },

    });
    Router.route('/chatroom/101/:_id', {
      name: "PersonalChat",
      controller: "ChatroomCtrl",
      waitOn: function(){
        if(Meteor.user())
          var subs = [
            Meteor.subscribe("chatrooms-list"),
            Meteor.subscribe("messages", this.params._id),
            Meteor.subscribe("chat-corrections",{room:this.params._id, type:"private"}),
            Meteor.subscribe("users-room",{room:this.params._id, type:"private"}),
            Meteor.subscribe("currentRoom",this.params._id, "user"),
            Meteor.subscribe("languages-list"),
            Meteor.subscribe("requests"),
            Meteor.subscribe("requests-invite"),
            Meteor.subscribe("user-list"),
            Meteor.subscribe("user-groups"),
            Meteor.subscribe("groups-list"),
            Meteor.subscribe("user-contact"),
            Meteor.subscribe("emails-received"),
            Meteor.subscribe("emails-sent")
          ];
          return subs;
      },
      action: function(){
        this.state.set("roomid",this.params._id);
        this.state.set("roomtype", "private");
        this.render();
      },
    });
    Router.route('blog', {path:'/blog',
      template: 'blog',
      yieldTemplates: {
        'blog-side': {to: 'sidebar'}
      },
      onBeforeAction:function(){
        if (!Meteor.user()) {
          // render the login template but keep the url in the browser the same
          this.render('notFound');

          // stop the rest of the before hooks and the action function
        }else{
          // Meteor.users.update({_id:Meteor.userId()}, {$set:{context:"blog"}});
          this.next();
        }
      },
      data:{activeBlog: "active",
        pageTitle: "Blog"
      }
    });
    Router.route('/notes',{
      template: 'notes',
      yieldTemplates: {
        'blog-side': {to: 'sidebar'}
      },
      onBeforeAction:function(){
        if (!Meteor.user()) {
          // render the login template but keep the url in the browser the same
          this.render('notFound');

          // stop the rest of the before hooks and the action function
        }else{
          // Meteor.users.update({_id:Meteor.userId()}, {$set:{context:"blog"}});
          this.next();
        }
      },
      data:{activeNotes: "active",
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
    });
    Router.route('logo',function(){this.redirect("home");});

    ChatroomsCtrl = RouteController.extend({
      template: 'chatrooms',
      yieldTemplates: {
        'chatrooms_side': {to: 'sidebar'}
      },
      fastRender: true,
      action: function(){
        this.render();
      },
      onBeforeAction:function(){
        if (!Meteor.user()) {
          // render the home template but keep the url in the browser the same
          this.render('home');
        }else{
          var room_handler = {};
          room_handler.manage = {active:false};
          room_handler.chat = {active:"active"};
          room_handler.settings = {active:false};
            room_handler.create = {active:false};
            if(this.route.path() === "/chatroom/create-group"){
          var group_handler = Session.get("group_handler");
          group_handler.active = true;
          group_handler.create = {active:true};
          Session.set("group_handler",group_handler);
          }
          Session.set("room_handler", room_handler);
          this.next();
        }
      },
      onAfterAction:function(){
      },
      data:
      {
        rooms: function(){
          var rooms = Chatrooms.find({}, {sort: {name: +1}}).fetch();
          var roomsArray = new Array();
          if(Meteor.user())
            rooms.forEach(function(row){
              roomsArray.push(row);
            });
            return roomsArray;
        },
        chatfeed: function(){
          return true;
        },
        room: function(){
          var room = {room:Session.get("roomid"), type: Session.get("roomtype")};
          if(room.room == "none"){
            return false;
          }
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
        },
        chat_users: function(){
          var room = Meteor.user().profile.active_room;
          var userList = new Array();
          if(room.type =="public"){
            User_Chatroom.find({room:room.room}).forEach(function(row){
              userList.push(row.user);
            });
          }else if (room.type == "group"){
            User_Room.find({group:room.room}).forEach(function(row){
              userList.push(row.user);
            });
          }else if(room.type == "privatechat"){
            userList = PrivateChat.findOne({_id:room.room}).users;
          }
          userList = Meteor.users.find({_id:{$in:userList} }, {fields:{_id:1, status:1, "profile.name":1, "profile.lastname":1}});
          userList = _.map(userList.fetch(), function(doc){return {_id:doc._id,name:doc.profile.name,lastname:doc.profile.lastname,fullname:doc.profile.name + " " + doc.profile.lastname};});
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
          var messages = {room:Session.get("roomid"), type: Session.get("roomtype")};
          messages = Messages.find({room:messages.room}).fetch();
          var blocked_users = Meteor.user().profile.blocked_users;
          var messagesArray = _.map(messages, function(row){
            if( blocked_users == undefined)
              blocked_users = [];
            // console.log(blocked_users);
            if (blocked_users.indexOf(row.owner) == -1) {
              var corrections = Correction.find({message:row._id});
              row.corrections = [];
              corrections.forEach(function(crow){
                crow.corrector = crow.corrector;
                row.corrections.push(crow);
              });
            }
            return row;
          });

          return messagesArray;

        },
        group_rooms:function(){
          var user_groups = User_Room.find({user: Meteor.userId(), type: "group"}, {fields:{room:1, new_messages:1}}).fetch();
          var groupsArray = _.map(user_groups,function(row){
            var group = Groups.findOne({_id:row.room});
            if(group !== undefined){
              group.notification = row.new_messages;
              if (row.room == Session.get("roomid"))
                group.active = true;
              if(Roles.userIsInRole(Meteor.userId(), "group-manager", row.room)|| Roles.userIsInRole(Meteor.userId(), "owner", row.room)){
                group.isMod = true;
                group.request = {total:GroupRequest.find({room:row.room, type:1}).count()};
              }else group.isMod = false;
              return group;
            }
          });
          return _.filter(groupsArray,function(element){return element !== undefined;});        },
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
    })
    ChatroomCtrl = RouteController.extend({
      template: 'chatrooms',
      yieldTemplates: {
        'chatrooms_side': {to: 'sidebar'}
      },
      fastRender: true,
      onBeforeAction:function(){
        if (!Meteor.user()) {
          // render the home template but keep the url in the browser the same
          this.render('home');
        }else{
          var room_handler = {};
          room_handler = {active:false};
          room_handler.create = {active:false};
          room_handler.manage = {active:false};
          room_handler.settings = {active:false};
          room_handler.overview = {active:false};
          room_handler.chat = {active:'active'};
          var group_handler = Session.get("group_handler");
          group_handler.active = false;
          group_handler.create = {active:false};
          Session.set("group_handler",group_handler);
          Session.set("roomid", this.state.get("roomid"));
          Session.set("roomtype", this.state.get("roomtype"));

          //if the user isn't in the public room, join him/her in
          if(!User_Room.findOne({room:this.params._id, user:Meteor.userId()})){
            if(Chatrooms.findOne({_id:this.params._id}) !== undefined){
              User_Room.insert({room:this.params._id, new_messages:0, user:Meteor.userId(), type: "public"});
              room_handler.chat.active = "active";
            }else{
              room_handler.overview.active = "active";
            }
          }else
            room_handler.chat.active = "active";
          Session.set("room_handler", room_handler);
          var user_room = User_Room.findOne({room:this.state.get("roomid"), user:Meteor.userId()});
          if(user_room !== undefined){
            User_Room.update({_id:user_room._id}, {$set:{new_messages:0}});
          }
          this.next();
        }
      },
      onAfterAction:function(){
      },
      data:
      {
        rooms: function(){
          var rooms = Chatrooms.find({}, {sort: {name: +1}}).fetch();
          var roomsArray = new Array();
          if(Meteor.user())
            rooms.forEach(function(row){
              if (row._id == Session.get("roomid"))
                row.active = "true";
              roomsArray.push(row);
            })
            return roomsArray;
        },
        room: function(){
          var room = Session.get("roomid");;
          var type = Session.get("roomtype");
          if(room == "none"){
            return false;
          }
          if ( type == "public"){
            room = Chatrooms.findOne({_id:room});
          }
          else if ( type == "group"){
            room = Groups.findOne({_id:room});
          }
          else if ( type == "privatechat"){
            var user  = PrivateChat.findOne({_id:room}).users;
            if(user[0] != Meteor.userId()){
              user = Meteor.users.findOne({_id:user[0]});
            }else{
              user = Meteor.users.findOne({_id:user[1]});
            }
            room = {name:user.profile.name, _id:PrivateChat.findOne({_id:room})._id};
          }
          return room;
        },
        chat_users: function(){
          var room = Session.get("roomid");;
          var type = Session.get("roomtype");

          var userList = new Array();
          User_Room.find({room:room, type:type}).forEach(function(row){
            userList.push(row.user);
          });
          userList = Meteor.users.find({_id:{$in:userList} }, {fields:{_id:1, status:1, "profile.name":1, "profile.lastname":1}});
          userList = _.map(userList.fetch(), function(doc){return {_id:doc._id,name:doc.profile.name,lastname:doc.profile.lastname,fullname:doc.profile.name + " " + doc.profile.lastname};});
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
          var messages = {room:Session.get("roomid"), type: Session.get("roomtype")};
          messages = Messages.find({room:messages.room}).fetch();
          var blocked_users = null;
          if(Meteor.user() !== null)
            blocked_users = Meteor.user().profile.blocked_users;
          var messagesArray = _.map(messages, function(row){
            if( blocked_users == null)
              blocked_users = [];
            // console.log(blocked_users);
            if (blocked_users.indexOf(row.owner) == -1) {
              var corrections = Correction.find({message:row._id});
              row.corrections = [];
              corrections.forEach(function(crow){
                crow.corrector = crow.corrector;
                row.corrections.push(crow);
              })
            }
            return row;
          })
          return messagesArray;
        },
        group_rooms:function(){
          var user_groups = User_Room.find({user: Meteor.userId(), type: "group"}, {fields:{room:1, new_messages:1}}).fetch();
          var groupsArray = _.map(user_groups,function(row){
            var group = Groups.findOne({_id:row.room});
            if(group !== undefined){
              group.notification = row.new_messages;
              if (row.room == Session.get("roomid"))
                group.active = true;
              if(Roles.userIsInRole(Meteor.userId(), "group-manager", row.room)|| Roles.userIsInRole(Meteor.userId(), "owner", row.room)){
                group.isMod = true;
                group.request = {total:Requests.find({group:row.room}).count()};
              }else group.isMod = false;
              return group;
            }
          });
          return _.filter(groupsArray,function(element){return element !== undefined;});
        },
        add_user:function(){
          return Session.get("add_user");
        },
        activeChat: "active",
        pageTitle: "Chat app"
      }
    })
