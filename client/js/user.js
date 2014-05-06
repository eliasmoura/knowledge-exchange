
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
Template.notification.destroyed = function(){

	
}
Template.user.events({
	'click input#signButton': function(e,t){
		//$("div.user").css('display', 'block');
		//$("input#signButton").css('display','none');
	},
	'click a#logoutButton': function(){
		console.log("logging out");
		Meteor.users.update({_id:Meteor.userId()},{$set:{"profile.status":"offline"}});
		Meteor.logout();
		Session.set("currentUser",Meteor.user());
		console.log("logged out");
	},
	'click #login': function(e, t){
			// console.log('addclass');
			/*if ($("#login-popover").attr('class').indexOf("in") != -1)
				$("#login-popover").removeClass('in');		
			else
				$("#login-popover").addClass('in');*/
	},
	'click #notification': function(e, t){
		$('#notificationModal').modal("toggle");
		console.log('should show the notification ');
	},
	'click #userstatus': function(e,t){
		e.preventDefault();
		e.stopPropagation();
		
		var elementClass = $(e.target).attr("class");
		if(elementClass.indexOf("ok") == -1){
			var status = "<div><a href='#' class='setuserstatus' id='online'><span class='online glyphicon glyphicon-user' ></span> "+mf('online',null,'Online')+"</a></div>"+
						 "<div><a href='#' class='setuserstatus' id='away'><span class='away glyphicon glyphicon-user'></span> "+mf('away',null,'Away')+"</a></div>"+
						 "<div><a href='#' class='setuserstatus' id='busy'><span class='busy glyphicon glyphicon-user'></span> "+mf('busy',null,'Busy')+"</a></div>";
			$(e.target).popover({
				html: true,
				title: "<h4>Set status:</h4>",
				content:status,
				placement: 'bottom'
			});
			$(e.target).popover('show');
			$(e.target).addClass( "ok")
			$(".popover").on("click",".setuserstatus", function(){
					console.log('test');
					// $(this).preventDefault();
					// $(this).stopPropagation();
					console.log('set user status');
					var pop = $("#userstatus");
					var status = $(this).attr("id");
					Meteor.call("set_userStatus",status);
					$(pop).popover('hide');
			});
		}
	},
	'click .setuserstatus': function(e,t){
		

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
		//$('#registerModal').modal("toggle");
	},
	'click span#login-submit': function(e,t){
		$("form.login_form").submit();
		console.log('submit');
	}
}
Template.register_form.rendered = function(){
	$('#registerModal').modal("toggle");
	$('#registerModal').on("hidden.bs.modal", function(){
			Session.set('login', true);
	});
}

Template.register_form.destroyed = function(){
	$('#registerModal').modal("hide");
	//$('.modal-backdrop').destroy();
	Session.set('first-login', true);
}
Template.user.first_login = function(){
	return Session.get("first-login");
}
Template.register_form.events({
	'click button.register-btn': function(e, t){
		
		$("#register_form").submit();
	},
	'submit #register_form':function(e,t){
		e.preventDefault();
		console.log('register');
		var name = t.find('#name_registerform').value;
		var lastname = t.find('#lastname_registerform').value;
		var gender = t.find('.gender:checked').value;
		var interests = t.findAll('[name=interests]:checked');
		var birthday = t.find('#birthday_registerform').value;
		var email = t.find('#email_registerform').value;
		var passwdch = t.find('#passwdcheck_registerform').value;
		var passwd = t.find('#passwd_registerform').value;
		var country = t.find('#country_registerform').value;
		var city = t.find('#city_registerform').value;
		var nativeLang = t.find('#native_registerform option:selected').text;
		var lernginlanguages = t.findAll('.learning-language option:selected');
		var knowlanguages = t.findAll('.knownlanguage option:selected');

		var langs = new Array();

		if (lernginlanguages.length > 1)
			lernginlanguages.forEach(function(){
				var lang = $(this).text();
				if (lang != 0)
				langs.push({lang:lang});
			});
		else
			langs = [{lang:lernginlanguages[0].text}];

		var knownlangs = new Array();

		if (knowlanguages.length > 1)
			knowlanguages.each(function(){
				var lang = $(this).text();
				if (lang != 0)
					knownlangs.push({lang:lang});
			});
		else
			knownlangs = [{lang:lernginlanguages[0].text}];

		var interestsArray = new Array();
		if(interests.length > 1)
			interests.each(function(){
				interestsArray.push({interest:$(this).attr("value")});
			});
		else
			interestsArray = [{interests:interests[0].attr("value")}];

		email = trimInput(email);
		if (!isValidPassword(passwd)) return false;;
		/**Validate things**/
		var user = Accounts.createUser(
		{
			email:email,
			password:passwd,
			profile: 
			{
				name:name,
				lastname:lastname,
				birthday:birthday,
				gender:gender,
				country:country,
				city:city,
				nativelang:nativeLang,
				learninglanguages:langs,
				knownlanguages:knownlangs,
				interests:interestsArray
			}
		});
		/*Meteor.call("sign_up",email,passwd,name,lastname,function(error, res){
			if(!error)	{
				
			}
			console.log(error);
			return "error sign up"
		})*/
		$('#registerModal').modal("hide");
	},
	'click #add-more-languages': function(e,t){
		console.log('add lang');
		var langs = [
            {lang:mf("akan",null,"Akan")},
            {lang:mf("amharic",null,"Amharic")},
            {lang:mf("arabic",null,"Arabic")},
            {lang:mf("assamese",null,"Assamese")},
            {lang:mf("awadhi",null,"Awadhi")},
            {lang:mf("azerbaijani",null,"Azerbaijani")},
            {lang:mf("balochi",null,"Balochi")},
            {lang:mf("belarusian",null,"Belarusian")},
            {lang:mf("bengali",null,"Bengali")},
            {lang:mf("bhojpuri",null,"Bhojpuri")},
            {lang:mf("burmese",null,"Burmese")},
            {lang:mf("cantonese",null,"Cantonese")},
            {lang:mf("cebuano",null,"Cebuano")},
            {lang:mf("chewa",null,"Chewa")},
            {lang:mf("chhattisgarhi",null,"Chhattisgarhi")},
            {lang:mf("chittagonian",null,"Chittagonian")},
            {lang:mf("czech",null,"Czech")},
            {lang:mf("deccan",null,"Deccan")},
            {lang:mf("dhundhari",null,"Dhundhari")},
            {lang:mf("dutch",null,"Dutch")},
            {lang:mf("english",null,"English")},
            {lang:mf("french",null,"French")},
            {lang:mf("fula",null,"Fula")},
            {lang:mf("gan",null,"Gan")},
            {lang:mf("german",null,"German")},
            {lang:mf("greek",null,"Greek")},
            {lang:mf("gujarati",null,"Gujarati")},
            {lang:mf("haitian creole",null,"Haitian Creole")},
            {lang:mf("hakka",null,"Hakka")},
            {lang:mf("haryanvi",null,"Haryanvi")},
            {lang:mf("hausa",null,"Hausa")},
            {lang:mf("hiligaynon",null,"Hiligaynon")},
            {lang:mf("hindi",null,"Hindi")},
            {lang:mf("hmong",null,"Hmong")},
            {lang:mf("hungarian",null,"Hungarian")},
            {lang:mf("igbo",null,"Igbo")},
            {lang:mf("ilokano",null,"Ilokano")},
            {lang:mf("italian",null,"Italian")},
            {lang:mf("japanese",null,"Japanese")},
            {lang:mf("javanese",null,"Javanese")},
            {lang:mf("jin",null,"Jin")},
            {lang:mf("kannada",null,"Kannada")},
            {lang:mf("kazakh",null,"Kazakh")},
            {lang:mf("khmer",null,"Khmer")},
            {lang:mf("kinyarwanda",null,"Kinyarwanda")},
            {lang:mf("kirundi",null,"Kirundi")},
            {lang:mf("konkani",null,"Konkani")},
            {lang:mf("korean",null,"Korean")},
            {lang:mf("kurdish",null,"Kurdish")},
            {lang:mf("madurese",null,"Madurese")},
            {lang:mf("magahi",null,"Magahi")},
            {lang:mf("maithili",null,"Maithili")},
            {lang:mf("malagasy",null,"Malagasy")},
            {lang:mf("malay/indonesian",null,"Malay/Indonesian")},
            {lang:mf("malayalam",null,"Malayalam")},
            {lang:mf("mandarin",null,"Mandarin")},
            {lang:mf("marathi",null,"Marathi")},
            {lang:mf("marwari",null,"Marwari")},
            {lang:mf("min bei",null,"Min Bei")},
            {lang:mf("min dong",null,"Min Dong")},
            {lang:mf("min nan",null,"Min Nan")},
            {lang:mf("mossi",null,"Mossi")},
            {lang:mf("nepali",null,"Nepali")},
            {lang:mf("oriya",null,"Oriya")},
            {lang:mf("oromo",null,"Oromo")},
            {lang:mf("pashto",null,"Pashto")},
            {lang:mf("persian",null,"Persian")},
            {lang:mf("polish",null,"Polish")},
            {lang:mf("portuguese",null,"Portuguese")},
            {lang:mf("punjabi",null,"Punjabi")},
            {lang:mf("quechua",null,"Quechua")},
            {lang:mf("romanian",null,"Romanian")},
            {lang:mf("russian",null,"Russian")},
            {lang:mf("saraiki",null,"Saraiki")},
            {lang:mf("serbo-croatian",null,"Serbo-Croatian")},
            {lang:mf("shona",null,"Shona")},
            {lang:mf("sindhi",null,"Sindhi")},
            {lang:mf("sinhalese",null,"Sinhalese")},
            {lang:mf("somali",null,"Somali")},
            {lang:mf("spanish",null,"Spanish")},
            {lang:mf("sundanese",null,"Sundanese")},
            {lang:mf("swahili",null,"Swahili")},
            {lang:mf("swedish",null,"Swedish")},
            {lang:mf("sylheti",null,"Sylheti")},
            {lang:mf("tagalog",null,"Tagalog")},
            {lang:mf("tamil",null,"Tamil")},
            {lang:mf("telugu",null,"Telugu")},
            {lang:mf("thai",null,"Thai")},
            {lang:mf("turkish",null,"Turkish")},
            {lang:mf("ukrainian",null,"Ukrainian")},
            {lang:mf("urdu",null,"Urdu")},
            {lang:mf("uyghur",null,"Uyghur")},
            {lang:mf("uzbek",null,"Uzbek")},
            {lang:mf("vietnamese",null,"Vietnamese")},
            {lang:mf("wu",null,"Wu")},
            {lang:mf("xhosa",null,"Xhosa")},
            {lang:mf("xiang",null,"Xiang")},
            {lang:mf("yoruba",null,"Yoruba")},
            {lang:mf("zhuang",null,"Zhuang")},
            {lang:mf("zulu",null,"Zulu")},
        ];
        var element = t.find('#learninglanguages');
        var html = '<select name="lang" id="" class="learninglanguage">\
        						<option value="0">'+ mf('select',null,'Select One')+'</option>';
		for (var i = 0; i < langs.length; i++) {
			html = html + '<option value="'+langs[i].lang+'">'+langs[i].lang+'</option>';
		}
		html = html + '</select>';
        $(element).append(html);
	},
	'click #add-more-knownlanguages': function(e,t){
		console.log('add lang');
		var langs = [
            {lang:mf("akan",null,"Akan")},
            {lang:mf("amharic",null,"Amharic")},
            {lang:mf("arabic",null,"Arabic")},
            {lang:mf("assamese",null,"Assamese")},
            {lang:mf("awadhi",null,"Awadhi")},
            {lang:mf("azerbaijani",null,"Azerbaijani")},
            {lang:mf("balochi",null,"Balochi")},
            {lang:mf("belarusian",null,"Belarusian")},
            {lang:mf("bengali",null,"Bengali")},
            {lang:mf("bhojpuri",null,"Bhojpuri")},
            {lang:mf("burmese",null,"Burmese")},
            {lang:mf("cantonese",null,"Cantonese")},
            {lang:mf("cebuano",null,"Cebuano")},
            {lang:mf("chewa",null,"Chewa")},
            {lang:mf("chhattisgarhi",null,"Chhattisgarhi")},
            {lang:mf("chittagonian",null,"Chittagonian")},
            {lang:mf("czech",null,"Czech")},
            {lang:mf("deccan",null,"Deccan")},
            {lang:mf("dhundhari",null,"Dhundhari")},
            {lang:mf("dutch",null,"Dutch")},
            {lang:mf("english",null,"English")},
            {lang:mf("french",null,"French")},
            {lang:mf("fula",null,"Fula")},
            {lang:mf("gan",null,"Gan")},
            {lang:mf("german",null,"German")},
            {lang:mf("greek",null,"Greek")},
            {lang:mf("gujarati",null,"Gujarati")},
            {lang:mf("haitian creole",null,"Haitian Creole")},
            {lang:mf("hakka",null,"Hakka")},
            {lang:mf("haryanvi",null,"Haryanvi")},
            {lang:mf("hausa",null,"Hausa")},
            {lang:mf("hiligaynon",null,"Hiligaynon")},
            {lang:mf("hindi",null,"Hindi")},
            {lang:mf("hmong",null,"Hmong")},
            {lang:mf("hungarian",null,"Hungarian")},
            {lang:mf("igbo",null,"Igbo")},
            {lang:mf("ilokano",null,"Ilokano")},
            {lang:mf("italian",null,"Italian")},
            {lang:mf("japanese",null,"Japanese")},
            {lang:mf("javanese",null,"Javanese")},
            {lang:mf("jin",null,"Jin")},
            {lang:mf("kannada",null,"Kannada")},
            {lang:mf("kazakh",null,"Kazakh")},
            {lang:mf("khmer",null,"Khmer")},
            {lang:mf("kinyarwanda",null,"Kinyarwanda")},
            {lang:mf("kirundi",null,"Kirundi")},
            {lang:mf("konkani",null,"Konkani")},
            {lang:mf("korean",null,"Korean")},
            {lang:mf("kurdish",null,"Kurdish")},
            {lang:mf("madurese",null,"Madurese")},
            {lang:mf("magahi",null,"Magahi")},
            {lang:mf("maithili",null,"Maithili")},
            {lang:mf("malagasy",null,"Malagasy")},
            {lang:mf("malay/indonesian",null,"Malay/Indonesian")},
            {lang:mf("malayalam",null,"Malayalam")},
            {lang:mf("mandarin",null,"Mandarin")},
            {lang:mf("marathi",null,"Marathi")},
            {lang:mf("marwari",null,"Marwari")},
            {lang:mf("min bei",null,"Min Bei")},
            {lang:mf("min dong",null,"Min Dong")},
            {lang:mf("min nan",null,"Min Nan")},
            {lang:mf("mossi",null,"Mossi")},
            {lang:mf("nepali",null,"Nepali")},
            {lang:mf("oriya",null,"Oriya")},
            {lang:mf("oromo",null,"Oromo")},
            {lang:mf("pashto",null,"Pashto")},
            {lang:mf("persian",null,"Persian")},
            {lang:mf("polish",null,"Polish")},
            {lang:mf("portuguese",null,"Portuguese")},
            {lang:mf("punjabi",null,"Punjabi")},
            {lang:mf("quechua",null,"Quechua")},
            {lang:mf("romanian",null,"Romanian")},
            {lang:mf("russian",null,"Russian")},
            {lang:mf("saraiki",null,"Saraiki")},
            {lang:mf("serbo-croatian",null,"Serbo-Croatian")},
            {lang:mf("shona",null,"Shona")},
            {lang:mf("sindhi",null,"Sindhi")},
            {lang:mf("sinhalese",null,"Sinhalese")},
            {lang:mf("somali",null,"Somali")},
            {lang:mf("spanish",null,"Spanish")},
            {lang:mf("sundanese",null,"Sundanese")},
            {lang:mf("swahili",null,"Swahili")},
            {lang:mf("swedish",null,"Swedish")},
            {lang:mf("sylheti",null,"Sylheti")},
            {lang:mf("tagalog",null,"Tagalog")},
            {lang:mf("tamil",null,"Tamil")},
            {lang:mf("telugu",null,"Telugu")},
            {lang:mf("thai",null,"Thai")},
            {lang:mf("turkish",null,"Turkish")},
            {lang:mf("ukrainian",null,"Ukrainian")},
            {lang:mf("urdu",null,"Urdu")},
            {lang:mf("uyghur",null,"Uyghur")},
            {lang:mf("uzbek",null,"Uzbek")},
            {lang:mf("vietnamese",null,"Vietnamese")},
            {lang:mf("wu",null,"Wu")},
            {lang:mf("xhosa",null,"Xhosa")},
            {lang:mf("xiang",null,"Xiang")},
            {lang:mf("yoruba",null,"Yoruba")},
            {lang:mf("zhuang",null,"Zhuang")},
            {lang:mf("zulu",null,"Zulu")},
        ];
        var element = t.find('#knownlanguages');
        var html = '<select name="lang" id="" class="knownlanguage">\
        						<option value="0">'+ mf('select',null,'Select One')+'</option>';
		for (var i = 0; i < langs.length; i++) {
			html = html + '<option value="'+langs[i].lang+'">'+langs[i].lang+'</option>';
		}
		html = html + '</select>';
        $(element).append(html);
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
		if (user_name.length < 3){
			Session.set('users_found',false);
			return false;
		}
		console.log(user_name);
		Meteor.call("find",{user:{name:user_name}}, function(error,users){
			if(!error){
				console.log("result:");
				Session.set("users_found", users);
				console.log(users);
			}
				
		});
	}
});
Template.user_finder.events({
	'click span.send-request': function(e,t){
		var userId = e.target.id;
		console.log('prepering the request');
		var message = 'Some thing to say :)';
		Meteor.call("find",{user:{_id:userId}},function(error,users){
			if (users){
				Session.set("user_modal_actions",{
					add:true,
					action: "Add contact",
					user:users.profile,
					_id:users._id,
				});
			}else
				console.log('error while trying to send a friendship request');
		});
		/*if (userId){
			Meteor.call("user_friendship_request", userId, message);
			console.log('request sent');
		}
		else console.log('request not sent');*/
	}
});

Template.user_modal.events({
	'click #request-friendship-btn': function(e,t){
		var action = Session.get("user_modal_actions");
		if (action.send_email) {
			$("#send-email-form").submit();
		}
		if (action.add) {
			$("#user-invite-request-form").submit();
		}
		if (action.report) {
			$("#report-user-form").submit()
		}
	}
})
Template.send_email.events({
	'submit #send-email-form': function(e,t){
		e.preventDefault();
		var emailto = Session.get("user_modal_actions")._id;
		var message = t.find("#send-email-msg").value;
		if(message.length < 2)
			return false;
		Meteor.call("send_email",{emailto:emailto,message:message},function(error,result){
			if(!error){
				console.log("email sent");
				$("#user-modal").modal("hide");
				Session.set("user_modal_actions", false);
			}else console.log(error);
		});

	}
});
Template.report.events({
	'submit #report-user-form': function(e,t){
		e.preventDefault();
		var reason = t.find("#user-modal-msg").text;
		var userId = Session.get("user_modal_actions")._id;
		var context = Session.get("user_modal_actions").context;
		if(reason.length < 2)
			return false;
		Meteor.call("report_user",{user:userId,reason:reason},function(error,result){
			if(!error){
				console.log("email sent");
				$("#user-modal").modal("hide");
				Session.set("user_modal_actions", false);
			}else console.log(error);
		});

	}
});
Template.user_invite_request.events({
	'submit #user-invite-request-form':function(e,t){
		e.preventDefault();
		var message = t.find("#user-modal-msg").value;
		var type = $(".user-form:checked");
		console.log(type);
		var userId = Session.get("user_modal_actions")._id;
		Meteor.call("user_friendship_request", userId, message,function(error,result){
			if(!error){
				console.log('request sent');
				$("#user-modal").modal("hide");
				Session.set("user_modal_actions", false);
			}
				

		});
	}
})
Template.user_modal.rendered = function(){
	// $('#user-modal').modal();
	
	$("#user-modal").modal();
	$("#user-modal").on('hidden.bs.modal', function(){
		Session.set('user_modal_actions', false);
	})
}


Template.request_friendship.events({
	'submit #request-friendship-form': function(e,t){
		e.preventDefault();
		var message = t.find("#request-friendship-msg").value;
		var type = $(".user-form:checked");
		console.log(type);
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

Template.group.events({
	'click span.plus': function(e,t){
		e.preventDefault();
		var groupId = t.find(".plus").id;
		var message = "User "+Meteor.user().profile.name+" invited you to joing this group.";
		var userId = Session.get("user_modal_actions")._id;
		console.log(userId +" "+message+" "+groupId);
		Meteor.call("group_invite_request",userId,message,groupId);
	}
});

$(function(){
    $.contextMenu({
        selector: '.username',
        build: function($trigger, e){
        	var items_menu = {
  				"profile": {name: " Profile", icon: "profile glyphicon glyphicon-user"}
			};
			var user = UsersRelations.findOne({contact:$trigger.attr("id")});
			if($trigger.attr("id") != Meteor.userId()){	
	        	items_menu.email = {name: " Email", icon: "email  glyphicon glyphicon-envelope"};
	        	if (!user)
	        		items_menu.contact = {name: " Add to Contacts", icon: "contact glyphicon glyphicon-plus"};
	        		
	        	items_menu.private = {name: " Chat",icon: "chat glyphicon glyphicon-comment"};
	        	items_menu.group = {name: " Invite to a Group",icon: "group"};
	        	items_menu.sep1 = "---------";
	        	if (items_menu.contact === undefined)
	        		items_menu.rcontact = {name: " Remove Contact", icon: "remove glyphicon glyphicon-remove"};
	        	items_menu.block = {name: " Block user", icon: "block-user glyphicon glyphicon-remove-sign"};
	        	items_menu.report = {name: " Report Abuse", icon: "report-user glyphicon glyphicon-flag"};
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
		            	Meteor.call("setUser_relation",{user:user,operation:false});
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