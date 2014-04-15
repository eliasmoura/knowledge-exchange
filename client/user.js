Meteor.startup(function(){
	Session.set('login', true);
	Session.set('group-finder', false);
});

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
	'click a#login': function(e, t){
			console.log('addclass');
			if ($("#login-popover").attr('class').indexOf("in") != -1)
				$("#login-popover").removeClass('in');		
			else
				$("#login-popover").addClass('in');
	},
	'click a#notification': function(e, t){
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
Template.login_popover.events = {
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

		Meteor.call("sign_up",email,passwd,name,lastname,function(error, res){
			if(!error)	{
				$('#registerModal').modal("toggle");
			}
			return "error sign up"
		})
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

		if (user_name.length < 4){
			Session.set('users_found',false);
			return false;
		}
		var users = Meteor.call("find_user",user_name,function(error,users){
			console.log('callback: ' + users);
			Session.set("users_found", users);
		});

		console.log(users);
	}
})