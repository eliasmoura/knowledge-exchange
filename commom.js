Router.configure({
	layoutTemplate: 'layout',
	notFoundTemplate: 'notFound',
	loadingTemplate: 'loading'

});

Router.map( function() {
	/*this.route('home', {
		path:'/',
		template: 'home',
		yieldTemplates: {
      					'home-side': {to: 'sidebar'}
	    },
	    onBeforeAction:function(){
	    	if (!Meteor.user()) {
		        // render the login template but keep the url in the browser the same
		        this.render('notFound');

		        // stop the rest of the before hooks and the action function 
		        this.pause();
		      }else{
		      // Meteor.users.update({_id:Meteor.userId()}, {$set:{context:"home"}});
		      }
	    },
	    data:{activeHome: "active",
	    	  pageTitle: "Home"}
	});*/
	this.route('chatrooms', {path:'/chat',
		template: 'chatrooms',
		yieldTemplates: {
      		'chatrooms_side': {to: 'sidebar'}
	    },
		fastRender: true,
	    waitOn: function(){
	    	
	    	if(Meteor.user())
	    	return [
	    		Meteor.subscribe("chatrooms-list"),
	    		Meteor.subscribe("user-chatroom-list"),
	    		Meteor.subscribe("privatechat"),
	    		Meteor.subscribe("chat-messages", Meteor.user().profile.active_room),
		    	Meteor.subscribe("chat-corrections",Meteor.user().profile.active_room),
		    	Meteor.subscribe("user-groups"),
		    	Meteor.subscribe("user-groups-list", User_Group.find({user:Meteor.userId()}).fetch()),
		    	Meteor.subscribe("languages-list"),
		    	Meteor.subscribe("requests"),
		    	Meteor.subscribe("requests-invite"),
		    	Meteor.subscribe("user-list"),
		    	Meteor.subscribe("user-contact"),
		    	Meteor.subscribe("emails-received"),
		    	Meteor.subscribe("emails-sent")
	    	];
	    },
	    onBeforeAction:function(){
	    	if (!Meteor.user()) {
		        // render the login template but keep the url in the browser the same
		        // this.render('notFound');

		        // stop the rest of the before hooks and the action function 
		        // this.pause();
		      }else{
		      	/*var isso = Meteor.users.update({_id:Meteor.userId()}, {$set:{context:"chatrooms"}}, function(error,doc){
		      		console.log(error);
		      	});
		      	console.log(isso);*/
		      }
		      
		      
	    },
	    onAfterAction:function(){
	    	var modal_action = Session.get("user_modal_actions");
			if(Session.get("emails").send != undefined){
				var user = null;
				Meteor.call("find",{user:{_id:Session.get("emails").user}},function(error,users){
					if (users){
						Session.set("emails",{
							send:"active",
							user:users
						});
						// console.log(Session.get("emails"));
					}
				});
			}
			if(modal_action.action =="add"){
				Meteor.call("find",{user:{_id:modal_action.user}},function(error,users){
					if (users){
						Session.set("user_modal_actions",{
							add:true,
							action: "Add contact",
							user:users.profile,
							_id:users._id
						});
					}else
						console.log('error while trying to send a friendship request');
				});
			}
			if(modal_action.action =="invite"){
				Meteor.call("find",{user:{_id:modal_action.user}},function(error,users){
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
				Meteor.call("find",{user:{_id:modal_action.user}},function(error,users){
					if (users){
                        var currentUser = false;
                        if (Meteor.userId() === users._id)
                           currentUser = true; 
                        //console.log(currentUser);
						// console.log(users);
						Session.set("user_modal_actions",{
							profile:true,
							action: users.profile.name + " " +users.profile.lastname,
							user:users.profile,
							_id:users._id,
                            profile_bar:true,
                            info:true,
                            currentUser:currentUser
						});
					}
				});
			}
			if(modal_action.action =="report"){
				Meteor.call("find",{user:{_id:modal_action.user}},function(error,users){
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
	    	rooms: function(){
	    		// console.log(Chatrooms.find({}, {sort: {name: +1}}).fetch());
	    		var rooms = Chatrooms.find({}, {sort: {name: +1}}).fetch();
	    		// console.log(rooms);
	    		var roomsArray = new Array();
	    		rooms.forEach(function(row){
	    			var userRom = User_Chatroom.findOne({room:row._id,user:Meteor.userId()});
	    			if (userRom != undefined)
	    				row.active = userRom.active;
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
    					var user  = PrivateChat.findOne({_id:room.room}).contact;
    					user = Meteor.users.findOne({_id:user});
    					room = {name:user.profile.name};
    				}
	    			return room;
	    		}catch (e){
	    			console.log(e);
	    			return false;
	    		}
	    	},
	    	chat_users: function(){
    			Deps.autorun(function(){
    				Meteor.call("user_list", Meteor.user().profile.active_room,function(error,result){
    					if(!error){
    						//userlist.push(result);
    						//console.log(userlist);
    						// if(room.type == "public")
    						// 	result = result.sort({"profile.online":1,"profile.name":1}).fetch();
    						Session.set("chat_users", result);
    						//return result;
    					}
    				});
    			})

				/*console.log(userlist);
				console.log(room);*/
				//console.log(Session.get("chat_users"));
				return Session.get("chat_users");
	    	},
	    	contacts: function(){
	    		var users_relations = UsersRelations.find({}).fetch();
	    		var users_relationsArray = new Array();
	    		users_relations.forEach(function(row){
	    			var privatechat = PrivateChat.findOne({contact:row.contact});
	    			var user = Meteor.users.findOne({_id:row.contact});
	    			try{
		    			user.notification = privatechat.new_messages;
		    			user.active = privatechat.active;
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
					messages = PrivateMessages.find({chat:{$in: [messages.room]}});
				}
                else messages = false;
				// console.log(Meteor.user().profile.blocked_users);
				// console.log(Meteor.user().profile.blocked_users.indexOf(row.userid));
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
		    			group.active = row.active;
		    			// console.log(group);
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
	/*this.route('blog', {path:'/blog',
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
	this.route('user', {path:'/user/:_ID',
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
	this.route('logo');
});


mfPkg.init('en', {});

UI.registerHelper("user",function(){return Meteor.user()});
UI.registerHelper("notifications", 
	function(){
		var groupsRequests_Participation = GroupRequest.find({type:1});
		var participationArray = new Array();
		var groupsRequests_Invitation = GroupRequest.find({type:2});
		var invitationsArray = new Array();

		var userFriendshipRequest = UserRequest.find({});
		var userArray = new Array();
		
		var totalRequest = groupsRequests_Invitation.count() + groupsRequests_Participation.count() + userFriendshipRequest.count();

		var emails =  Email.find({emailto:Meteor.userId(),isnew:true}).count();
		// console.log(emails);

		if(groupsRequests_Participation)
			groupsRequests_Participation.fetch().forEach(function(row){
				Meteor.call("find",{user:{_id:row.user}}, function(error,result){
					if(!error){
						
						Session.set("participationArray", result);
						//console.log(participationArray);
					}
				});
				participationArray.push({user:Session.get("participationArray"), group:row });
				
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
		var total = totalRequest + emails;
		
		if(emails == 0) emails = false;
		if(total == 0) total = false;
		if (totalRequest == 0) totalRequest = false;
		
		return {
			requests:
				{
					participation:participationArray,
					invitation:invitationsArray,
					friendship:userArray,
					total:totalRequest
				},
			newemails:emails,
			total:total
			};
		
	}
);
UI.registerHelper("chat_notifications",
	function(){
		// console.log('test');
		var privatechatnotifications = PrivateChat.find({new_messages:{$gt:0}}).fetch();
		// console.log(privatechatnotifications);
    	/*var privatenotificationsArray = {};
    	privatechatnotifications.forEach(function(row){
    		privatenotificationsArray[row.contact] = row.new_messages;
    	});
    	console.log(privatenotificationsArray);*/
    	var user_groups = User_Group.find({user: Meteor.userId()}).fetch();
		// console.log(user_groups);
		var groupsArray = 0;
		// var groups = new Array();
		user_groups.forEach(function(row){
			if(row.new_messages > 0)
    			groupsArray = groupsArray +1;
		});
    	return privatechatnotifications.length + groupsArray;
	}
);
UI.registerHelper("edit_profile",
    function(){
        return Session.get("edit_profile");
    }
);
Handlebars.registerHelper("selected", function(lang,learnglang){
    console.log(lang);
    console.log(learnglang);
});
UI.registerHelper("knownlanguages",function(){
    //console.log("select");
    //console.log(lang);
    //console.log(learninglangs);
        var userLangs = Meteor.user().profile.knownlanguages;
    for (var i = 0; i < userLangs.length; i++){
        if (lang == userLangs[i]){
            console.log("isSelected");
            return "selected";
        }
    }
    
});
UI.registerHelper('langs_selected',
    function(lang){
        var returnArray = new Array();
        var langs = Session.get("langs");
        var fluent_langs = Meteor.user().profile.knownlanguages;
        var learning_langs = Meteor.user().profile.learninglanguages;
        var fluent_length = fluent_langs.length;
        var learning_length = learning_langs.length;
        returnArray.native = new Array();
        for (var i = 0; i < langs.length; i++){
            if (Meteor.user().profile.nativelang == langs[i]){
                returnArray.native.push({lang:langs[i], native:"selected"});
            }
            else returnArray.native.push({lang:langs[i], native:null});
        }

        returnArray.fluent = new Array();
        for (var f = 0;f < fluent_length; f++)
        {
             var fluent = new Array();
             var removable = false;
             if(fluent_length > 1){
                removable = true;
             }
             for (var i = 0; i < langs.length;i++){
                if (fluent_langs[f]==langs[i])
                {
                    fluent.push({lang:langs[i],fluent:"selected"});
                }
                else fluent.push({lang:langs[i],fluent:null});
            }
            returnArray.fluent.push({fluent:fluent,removable:removable});
        }
            
        returnArray.learning = new Array();
        for (var l = 0; l < learning_length; l++)
        {
            var learning =  new Array();
            var removable = false;
             if(learning_length > 1){
                removable = true;
             }
            for (var i = 0; i < langs.length;i++){
                if (learning_langs[l]== langs[i])
                {
                    learning.push({lang:langs[i],learning:"selected"});
                }
                else learning.push({lang:langs[i],learning:null});
            }
            returnArray.learning.push({learning:learning,removable:removable});
        }
        return returnArray;
    }
);
UI.registerHelper("group_management",
    function(){
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
    }
);
UI.registerHelper("group_handler",
    function (){
    return Session.get("group_handler")
    }
);
UI.registerHelper();
UI.registerHelper();
