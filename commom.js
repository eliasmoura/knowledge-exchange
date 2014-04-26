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
	    	return [
	    		Meteor.subscribe("chat-messages", Meteor.user().profile.active_room),
	    		Meteor.subscribe("user-groups"),
	    		Meteor.subscribe("chatrooms-list"),
	    		Meteor.subscribe("user-chatroom-list"),
	    		Meteor.subscribe("privatechat"),
		    	Meteor.subscribe("chat-corrections",Meteor.user().profile.active_room),
		    	Meteor.subscribe("user-groups-list"),
		    	Meteor.subscribe("languages-list"),
		    	Meteor.subscribe("requests"),
		    	Meteor.subscribe("requests-invite"),
		    	Meteor.subscribe("user-list"),
		    	Meteor.subscribe("user-contact"),
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
	    	var modal_action = Session.get("user_modal_actions");
			if(modal_action.action =="email"){
				var user = null;
				Meteor.call("find_user",{user_id:modal_action.user,first_user:true},function(error,users){
					if (users){
						Session.set("user_modal_actions",{
							send_email:true,
							action: "Send email",
							name:users.profile.name,
							_id:users._id,
						});
					}
				});
			}
			if(modal_action.action =="add"){
				Meteor.call("find_user",{user_id:modal_action.user,first_user:true},function(error,users){
					if (users){
						Session.set("user_modal_actions",{
							add:true,
							action: "Add contact",
							name:users.profile.name,
							_id:users._id,
						});
					}
				});
			}
			if(modal_action.action =="invite"){
				Meteor.call("find_user",{user_id:modal_action.user,first_user:true},function(error,users){
					if (users){
						Session.set("user_modal_actions",{
							group:true,
							action: "Invite "+users.profile.name+" to:",
							name:users.profile.name,
							_id:users._id,
						});
					}
				});
			}
			if(modal_action.action =="profile"){
				Meteor.call("find_user",{user_id:modal_action.user,first_user:true},function(error,users){
					if (users){
						Session.set("user_modal_actions",{
							profile:true,
							action: "Report user",
							name:users.profile.name,
							_id:users._id,
						});
					}
				});
			}
			if(modal_action.action =="report"){
				Meteor.call("find_user",{user_id:modal_action.user,first_user:true},function(error,users){
					if (users){
						Session.set("user_modal_actions",{
							report:true,
							action: "Report user",
							name:users.profile.name,
							_id:users._id,
						});
					}
				});
			}
	    	
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
	    			var room = Meteor.user().profile.active_room;
	    			
	    			if ( room.type == "public"){
	    				room = Chatrooms.findOne({_id:room.room});
	    			}
	    			else if ( room.type == "group"){
	    				room = Groups.findOne({_id:room.room});
	    			}	
    				else if ( room.type == "privatechat"){
    					var user  = PrivateChat.findOne({_id:room.room}).contact;
    					user = Meteor.users.findOne({_id:user});
    					room = {name:user.profile.name};
    				}
	    			return room;
	    		}catch (e){
	    			//console.log(e);
	    			//return 'none';
	    		}
	    	},
	    	chat_users: function(){
	    		var room = Meteor.user().profile.active_room;
    			var userlist = new Array();


    			if (room.type == "public"){
    				// console.log(User_Chatroom.find({room:room.room}).fetch());
    				User_Chatroom.find({room:room.room, active:true},
						{sort: {time: -1}}).fetch().forEach(function(row){
							userlist.push({user:Meteor.users.findOne({_id:row['user']})});
					});	
    			}
    			else if (room.type == "group"){

    				User_Group.find({group:room.room, active:true})
    					.fetch()
    					.forEach(function(row){
							userlist.push({user:Meteor.users.findOne({_id:row['user']})});
					});	
    			}	
				else if (room.type == "privatechat"){
					var user  = PrivateChat.findOne({_id:room.room}).contact;
					user = Meteor.users.findOne({_id:user});
					userlist.push({user:Meteor.user()});
					userlist.push({user:user});
				}
				/*console.log(userlist);
				console.log(room);*/
				return userlist;
	    	},
	    	contacts: function(){
	    		var users_relations = UsersRelations.find({}).fetch();
	    		var users_relationsArray = new Array();
	    		users_relations.forEach(function(row){
	    			users_relationsArray.push(row.contact);
	    		});
	    		
	    		var privatechatnotifications = PrivateChat.find({new_messages:{$gt:0}}).fetch();;
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
	    	emails_notifications: function(){
	    		return false;
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
					messages = PrivateMessages.find({chat:{$in: [messages.room]}});
				}
				try{
		    		messages.forEach(function(row){
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
		    		})
		    	}catch(e){}
	    		// console.log(messagesArray);
	    		return messagesArray;
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
	    	group_manage: function(){
	    		var user_groups = User_Group.find({user: Meteor.userId(),mod:true}, {fields:{group:1}}).fetch();
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
	    				var group = Groups.findOne({_id:row.group});
	    				invitationsArray.push({group:group,request:row});
	    			});

	    		if(userFriendshipRequest)
		    		userFriendshipRequest.fetch().forEach(function(row){
		    			userArray.push({user:Meteor.users.findOne({_id: row.user}), message:row.message,request:row._id, type:row.type});
		    		});
		    	if (total != 0){
		    		console.log(invitationsArray);
		    		return {
		    			requests:
		    				{
		    					participation:participationArray,
		    					invitation:invitationsArray,
		    					friendship:userArray,
		    					total:total
		    				}
		    			};}
		    	else {
		    		// console.log('hide');
		    		$(".modal-backdrop.fade.in").remove();
		    		$('#notificationModal').modal("hide");
		    		return false;
		    	}
	    	},
	    	find_user: function(){
	    		return Session.get('find_user');
	    	},
	    	user_found: function(){
	    		return Session.get("users_found");
	    	},
	    	user_modal:function(){
    			return Session.get("user_modal_actions");
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