Router.configure({
	layoutTemplate: 'layout',
	notFoundTemplate: 'notFound',
	loadingTemplate: 'loading'

});

Router.map( function() {
	this.route('home', {
		path:'/',
		template: 'home',
		yieldTemplates: {
      					'home-side': {to: 'sidebar'}
	    },
	    data:{activeHome: "active",
	    	  pageTitle: "Home"}
	});
	this.route('chatrooms', {path:'/chat',
		template: 'chatrooms',
		yieldTemplates: {
      		'chatrooms_side': {to: 'sidebar'}
	    },
		fastRender: true,
	    waitOn: function(){
	    	var user = Meteor.userId();
	    	var activeroom = Meteor.subscribe("user-chatroom-active");
	    	var room = null;
	    	var corrections = null;
	    	var user_chatroom_list = Meteor.subscribe("user-chatroom-list");
	    	var chatroom_list = Meteor.subscribe("chatrooms-list");
	    	try{
	    		room = User_Chatroom.find({user:user, active:true}).fetch()[0].room;
	    		room = Meteor.subscribe("chat-messages", room);
	    	}catch(e){}
	    	
	    	return [
	    		user_chatroom_list,
		    	activeroom,
		    	chatroom_list,
		    	room,
		    	Meteor.subscribe("chat-corrections"),
		    	Meteor.subscribe("user-groups-list"),
		    	Meteor.subscribe("groups-list"),
		    	Meteor.subscribe("user-group-chat"),
		    	Meteor.subscribe("languages-list"),
		    	Meteor.subscribe("group-chat"),
		    	Meteor.subscribe("requests"),
		    	Meteor.subscribe("user-list"),
		    	Meteor.subscribe("user-contact"),
		    	Meteor.subscribe("privatechat"),
		    	Meteor.subscribe("privatemessages")
	    	];
	    },
	    onBeforeAction:function(){
	    	/*if (!Meteor.user()) {
		        // render the login template but keep the url in the browser the same
		        this.render('notFound');

		        // stop the rest of the before hooks and the action function 
		        this.pause();
		      }*/
		      
	    },
	    onAfterAction:function(){
	    	
	    },
	    data:
	    {
	    	roomactive: function(room){
	    		var room = User_Chatroom.findOne({user:Meteor.userId(), room:room});
	    		return room.active;
	    	},
	    	rooms: function(){
	    		return Chatrooms.find({}, {sort: {name: +1}}).fetch();
	    	},
	    	room: function(){
	    		try{
	    			var room = null;
	    			var user_chatroom = User_Chatroom.findOne({user:Meteor.userId(), active:true});
	    			var user_group = User_Group.findOne({user:Meteor.userId(), active:true});
	    			var privatechat = PrivateChat.findOne({user:Meteor.userId(), active:true});
	    			if (user_chatroom != undefined){
	    				room = Chatrooms.findOne({_id:user_chatroom['room']});
	    			}
	    			else if (user_group != undefined){
	    				room = Groups.findOne({_id:user_group['group']});
	    			}	
    				else if (privatechat != undefined){
    					var user = Meteor.users.findOne({_id:privatechat['contact']});
    					room = {name:user.profile.name};
    				}
	    			return room;
	    		}catch (e){
	    			//console.log(e);
	    			//return 'none';
	    		}
	    	},
	    	chat_users: function(){
	    		var user = Meteor.userId();
	    		var room = null;
    			var user_chatroom = User_Chatroom.findOne({user:Meteor.userId(), active:true});
    			var user_group = User_Group.findOne({user:Meteor.userId(), active:true});
    			var privatechat = PrivateChat.findOne({user:Meteor.userId(), active:true});
    			var userlist = new Array();


    			if (user_chatroom != undefined){
    				//console.log(user_chatroom);
    				User_Chatroom.find({room:user_chatroom['room'], active:true},
						{sort: {time: -1}}).fetch().forEach(function(row){
							userlist.push({user:Meteor.users.findOne({_id:row['user']})});
					});	
    			}
    			else if (user_group != undefined){

    				User_Group.find({group:user_group['group'], active:true})
    					.fetch()
    					.forEach(function(row){
							userlist.push({user:Meteor.users.findOne({_id:row['user']})});
					});	
    			}	
				else if (privatechat != undefined){
					userlist.push({user:Meteor.users.findOne({_id:privatechat.user})});
					userlist.push({user:Meteor.users.findOne({_id:privatechat.contact})});
				}

				return userlist;
	    	},
	    	contacts: function(){
	    		var users_relations = UsersRelations.find({}).fetch();
	    		var users_relationsArray = new Array();
	    		users_relations.forEach(function(row){
	    			users_relationsArray.push(row.contact);
	    		});
	    		
	    		var privatechatnotifications = PrivateChat.find({new_messages:{$gt:0}}).fetch();
	    		console.log(privatechatnotifications);
		    	var privatenotificationsArray = {};
		    	privatechatnotifications.forEach(function(row){
		    		privatenotificationsArray[row.contact] = row.new_messages;
		    	});

		    	var users = new Array();
		    	Meteor.users.find({_id:{$in:users_relationsArray}}).fetch().forEach(function(row){
		    		row.notification = privatenotificationsArray[row._id];
		    		users.push(row);
		    	});

	    		return users;
	    	},
	    	chat_notifications: function(){
	    		console.log('test');
	    		var privatechatnotifications = PrivateChat.find({new_messages:{$gt:0}}).fetch();
	    		console.log(privatechatnotifications);
		    	var privatenotificationsArray = {};
		    	privatechatnotifications.forEach(function(row){
		    		privatenotificationsArray[row.contact] = row.new_messages;
		    	});
		    	console.log(privatenotificationsArray);
		    	return {chat:privatenotificationsArray};
	    	},
	    	messages: function(){
	    		var messages = null;
	    		var user_chatroom = User_Chatroom.findOne({user:Meteor.userId(), active:true});
    			var user_group = User_Group.findOne({user:Meteor.userId(), active:true});
    			var privatechat = PrivateChat.findOne({user:Meteor.userId(), active:true});
    			var userlist = new Array();

    			if (user_chatroom != undefined){
    				messages = Messages.find({room:user_chatroom.room});
    			}
    			else if (user_group != undefined){
    				try{
    				messages = GroupChat.find({groupchat:user_group.group});
    				}catch(e){console.log(e);}
    			}	
				else if (privatechat != undefined){
					messages = PrivateMessages.find({chat:{$in: [privatechat._id]}});
					console.log('privatechat');
				}
	    		
	    		return messages;
	    	},
	    	group_rooms:function(){
	    		var user_groups = User_Group.find({user: Meteor.userId()}, {fields:{group:1,new_messages:1}}).fetch();
	    		var groupsArray = new Array();
	    		user_groups.forEach(function(row){
	    			groupsArray.push(row.group);
	    		});

	    		var groups = new Array();
	    		Groups.find({_id:{$in: groupsArray}}).fetch().forEach(function(row){
	    			row.notification = User_Group.findOne({user:Meteor.userId(), group:row._id}).new_messages;
	    			groups.push(row);
	    		});
	    		//console.log(groups);

	    		return groups;
	    	},
	    	notifications: function(){
	    		var groupsRequests_Participation = GroupRequest.find({type:1});
	    		var participationArray = new Array();
	    		var groupsRequests_Invitation = GroupRequest.find({type:2});
	    		var invitationsArray = new Array();

	    		var userFriendshipRequest = UserRequest.find({});
	    		var userArray = new Array();
	    		
	    		var total = groupsRequests_Invitation.count() + groupsRequests_Participation.count() + userFriendshipRequest.count();

	    		if(groupsRequests_Participation)
		    		groupsRequests_Participation.fetch().forEach(function(row){
		    			participationArray.push({user:{_id:row.user}, group:row });
		    		});

	    		if(groupsRequests_Invitation)
	    			groupsRequests_Invitation.fetch().forEach(function(row){
	    				invitationsArray.push({user:{_id:row.user}, group:row });
	    			});

	    		if(userFriendshipRequest)
		    		userFriendshipRequest.fetch().forEach(function(row){
		    			userArray.push({user:Meteor.users.findOne({_id: row.user}), message:row.message,request:row._id, type:row.type});
		    		});

	    		return {
	    			requests:
	    				{
	    					participation:participationArray,
	    					invitation:groupsRequests_Invitation,
	    					friendship:userArray,
	    					total:total
	    				}
	    			};
	    	},
	    	find_user: function(){
	    		return Session.get('find_user');
	    	},
	    	user_found: function(){
	    		return Session.get("users_found");
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
	this.route('blog', {path:'/blog',
		template: 'blog',
		yieldTemplates: {
      		'blog-side': {to: 'sidebar'}
	    },
	    data:{activeBlog: "active",
	    	pageTitle: "Blog"
	    }
	});
	this.route('user', {path:'/user/:_ID',
		template: 'user-profile',
		yieldTemplates:{
			'user-side': {to: 'sidebar'}
		},
		data:{

		}
	});
	this.route('logo');
});


mfPkg.init('en', {});