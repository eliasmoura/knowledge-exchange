
var trimInput = function(val){
			return val.replace(/^\s*|\s*$/g, "");
}
var isValidPassword = function(val, field) {
	if (val.length == 6) return true;
	else{
		Session.set('displayMessage', 'Error &amp; Too short.')
		return false;
	}
}
Template.user.user = function(){
	var user = Meteor.user();
	return user;
}
Template.user.login = function(){
	return Session.get("login");
}
/*Template.userlist.userlist = function(){
	var users = OnlineUsers.find({}).fetch();
	var userlist = new Array();
	for (var i = 0; i < users.length; i++) {
		userlist[i] = {user:Meteor.users.findOne({_id:users[i]['user']})};
	}
	return userlist;
}*/
Template.user.events({
	'click input#signButton': function(e,t){
		//$("div.user").css('display', 'block');
		//$("input#signButton").css('display','none');
	},
	'click a#logoutButton': function(){
		console.log("logging out");
		Meteor.logout();
		Session.set("currentUser",Meteor.user());
		console.log("logged out");
	},
	'click #login': function(e, t){
			console.log('addclass');
			/*if ($("#login-popover").attr('class').indexOf("in") != -1)
				$("#login-popover").removeClass('in');		
			else
				$("#login-popover").addClass('in');*/
	},
	'click #notification': function(e, t){
		$('#notificationModal').modal("toggle");
		console.log('should show the notification ');
	}
});

Template.login_popover.rendered = function(){
		$(".popover").popover({
			//html:true,
			//content:$('div#div-login-form').html()
		});
		
}
Template.login_form.events = {
	'submit form.login-form': function(e, t){
		e.preventDefault();
		var email = t.find('#login_email').value;
		var passwd = t.find('#login_passwd').value;
		email = trimInput(email);
		Meteor.loginWithPassword(email,passwd, function(err){
			if (err){
				throw new Meteor.Error(111, "couldn't find your email or password!");
				return 'error';
			}
			return "login ok";
		});
		return false;
	},
	'click a.newUser': function(e, t){
		//$('div.login_form').css('display', "none");
		//$('div.register_form').css('display', 'block');
		Session.set('login', false);
		console.log('new');
		$('#registerModal').modal("toggle");
	},
	'click span#login-submit': function(e,t){
		$("form.login_form").submit();
		console.log('submit');
	}
}
Template.register_form.rendered = function(){
	$('#registerModal').modal();
	$('#registerModal').on("hidden.bs.modal", function(){
			Session.set('login', true);
	});
}

Template.register_form.events({
	'click button.register-btn': function(e, t){
		e.preventDefault();
		console.log('register');
		var name = t.find('#name_registerform').value;
		var lastname = t.find('#lastname_registerform').value;
		var email = t.find('#email_registerform').value;
		var passwdch = t.find('#passwdcheck_registerform').value;
		var passwd = t.find('#passwd_registerform').value;

		email = trimInput(email);
		if (!isValidPassword(passwd)) return false;;
		/**Validate things**/
		var user = Accounts.createUser(
		{
			email:email,
			password:passwd,
			profile: {name:name,
			lastname:lastname,}
		});
		/*Meteor.call("sign_up",email,passwd,name,lastname,function(error, res){
			if(!error)	{
				
			}
			console.log(error);
			return "error sign up"
		})*/
		$('#registerModal').modal("toggle");
		return false;
	}
});


Template.user_finder_modal.rendered = function(){
	$('#user-finder-modal').modal();
	$("#user-finder-modal").on('hidden.bs.modal', function(){
		Session.set('find_user', false);
	})
}

Template.user_finder_modal.events({
	'submit form.user-finder#user-finder-form': function(e,t){
		e.preventDefault();
		var user_name = t.find("input.form-control#user-name-f").value;
		console.log(user_name);

		if (user_name.length < 3){
			Session.set('users_found',false);
			return false;
		}
		Meteor.call("find_user",user_name, function(error,users){
			if(users)	
				Session.set("users_found", users);
		});
	}
});
Template.user_finder.events({
	'click span.send-request': function(e,t){
		var userId = e.target.id;
		console.log('prepering the request');
		var message = 'Some thing to say :)';
		if (userId){
			Meteor.call("user_friendship_request", userId, message);
			console.log('request sent');
		}
		else console.log('request not sent');
	}
});

Template.user_modal.events({
	'click #request-friendship-btn': function(e,t){
		var action = Session.get("user_modal_actions");
		if (action.send_email) {
			
		}
		if (action.add) {
			$("#user-invite-request-form").submit();
		}
		if (action.report) {

		}
	}
})
Template.send_email.events({
	'submit #send-email-form': function(e,t){
		e.preventDefault();
		var message = t.find("#send-email-msg").text;
		var userId = Session.get("user_modal_actions")._id;
		Meteor.call("send_email",userId,message);

	}
});
Template.user_invite_request.events({
	'submit #user-invite-request-form':function(e,t){
		e.preventDefault();
		var message = t.find("#user-modal-msg").text;
		var userId = Session.get("user_modal_actions")._id;
		Meteor.call("user_friendship_request", userId, message);
	}
})
Template.user_modal.rendered = function(){
	// $('#user-modal').modal();
	
	console.log(Session.get("user_modal_actions"));
	$("#user-modal").modal();
	$("#user-modal").on('hidden.bs.modal', function(){
		Session.set('user_modal_actions', false);
	})
}


Template.request_friendship.events({
	'submit #request-friendship-form': function(e,t){
		e.preventDefault();
		console.log(Session.get("add_user"));
		var message = t.find("#request-friendship-msg").value;
		var user = Session.get("add-user");
		Meteor.call("user_friendship_request", user, message);
		$("#request-friendship-modal").modal('hide');
	},
	'click #request-friendship-btn': function(e,t){
		$("#request-friendship-form").submit();
	}
});
Template.request_friendship.rendered = function(){
	$("#request-friendship-modal").modal("toggle");
	$("#request-friendship-modal").on('hidden.bs.modal', function(){
		Session.set('add_user', false);

	})
}

$(function(){
    $.contextMenu({
        selector: '.username',
        build: function($trigger, e){
        	var items_menu = {
  				"profile": {name: "See user profile", icon: "profile"}
			};
			var user = UsersRelations.findOne({contact:$trigger.attr("id")});
			if($trigger.attr("id") != Meteor.userId()){	
	        	items_menu.email = {name: "Send an email", icon: "email"};
	        	if (!user)
	        		items_menu.contact = {name: "Add to Contacts", icon: "contact"};
	        	else
	        		items_menu.rcontact = {name: "Remove from Contacts", icon: "remove"};
	        	items_menu.private = {name: "Private Chat",icon: "chat"};
	        	items_menu.group = {name: "Invite to a Group",icon: "group"};
	        	items_menu.sep1 = "---------";
	        	items_menu.block = {name: "Block user", icon: "block"};
	        	items_menu.report = {name: "Report Abuse", icon: "report"};
	        }

        	return {
        		items: items_menu,
        		reposion:false,
        		callback: function(key, options) {
		            var user = $(this).attr("id");
		            if (key == "email") {
		            	Session.set("user_modal_actions", {action:"email",user: user});
		            }
		            if(key == "contact"){
		            	Session.set("user_modal_actions", {action:"add",user: user});
		            }
		            if(key == "rcontact"){
		            	Meteor.call("remove_contact",user);
		            }
		            if(key == "group"){
		            	Session.set("user_modal_actions", {action:"invite",user:user});
		            }
		            if(key == "profile"){
		            	Session.set("user_modal_actions", {action:"profile",user:user});
		            }
		            if(key == "report"){
		            	Session.set("user_modal_actions", {action:"report",user:user});
		            }
		            if(key == "block"){
		            	Meteor.call("block_user",user);
		            }
		            if(key == "private"){
		            	Session.set("private_chat",user);
		            }
		        }
        	}
        },
        trigger: "left",
    });
    
    $('.username').on('click', function(e){
        console.log('clicked', this);
        

    })
});