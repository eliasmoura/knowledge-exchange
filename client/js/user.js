
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
/*Template.login_form.login = function(){
	return Session.get("login");
}*/
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
Template.user.rendered = function(){
    $("#user-dropdown").dropdown();
}
Template.user.events({
	'click div.ui.button': function(e,t){
		//$("div.user").css('display', 'block');
		//$("input#signButton").css('display','none');
        var self = this;
        if(!Meteor.user()){
            Session.set("modal-handler",{active:true,login:true});
        }
	},
    'click a#user': function(event, template){
        //event.stopPropagation();
        //$('.dropdown-toggle').dropdown("toggle");
    },
	'click a#logoutButton': function(){
		console.log("logging out");
		Meteor.users.update({_id:Meteor.userId()},{$set:{"profile.status":"offline"}});
		Meteor.logout();
		Session.set("currentUser",Meteor.user());
		console.log("logged out");
	},
	'click #signin': function(e, t){
			// console.log('addclass');
        Session.set("login", false);
	},
	'click #profile': function(e,t){
        var modal_handler = {
            user_overview:{
                active:true,
                _id:Meteor.userId()
            }
        };
        Session.set("modal-handler",modal_handler);
		/*Session.set("user_modal_actions",{
			profile:true,
			action: Meteor.user().profile.name + " " +Meteor.user().profile.lastname,
			user:Meteor.user().profile,
			_id:Meteor.user()._id,
            profile_bar:true,
            info:true,
            currentUser:true,
            modalActive:true
		});*/
	},
	'click #email': function(e,t){
		// console.log('emails click');
		Session.set("emails", {sent:"active"});
        console.log('email');
        Session.set("modal-handler", {email:true});
		// console.log(Session.get("emails"));
	},
	'click #notification': function(e, t){
		//$('#notificationModal').modal("toggle");
        Session.set("modal-handler", {noti:true});
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
					// console.log('test');
					// $(this).preventDefault();
					// $(this).stopPropagation();
					// console.log('set user status');
					var pop = $("#userstatus");
					var status = $(this).attr("id");
					Meteor.call("set_userStatus",status);
					$(pop).popover('hide');
			});
		}
	}

});
Template.login_form.rendered = function(){
    //$(".dropdown").dropdown();
}
Template.login_form.events({
	'submit form#login-form': function(e, t){
        var email = $('#login_email').val();
        var passwd = $('#login_passwd').val();
        email = trimInput(email);
        //Meteor.call("login",{email:email,passwd:passwd});
        Meteor.loginWithPassword(email,passwd, function(err){
            if (err){
                throw new Meteor.Error(111, "couldn't find your email or password!");
                return 'error';
            }else{
                $(".ui.sidebar").sidebar("setting","transition","push");
                $("#modal-handler").modal("hide");
            }
        });
        //$('#registerModal').modal("toggle");
	},
    'click a#login': function(event, template){
        $('.dropdown-toggle').dropdown("toggle");
    },
	'click input#login-submit': function(e,t){
		$("form#login-form").submit();
	},
    'click a.reset':function(event,template){
        Session.set('user_modal_actions',{reset:true})
    },
    'click a.newUser': function(event, template){
        Session.set("login", false);
    }
});

Template.register_form.rendered = function(){
    /*$('#registerModal').modal("show");
    $("#registermodal").on("shown.bs.modal", function(){
        $('#name_registerform').focus();
        $(this.find("#name_registerform")).attr("autofocus", "autofocus");
    });
	$('#registerModal').on("hidden.bs.modal", function(){
			Session.set('login', true);
            //Session.set("first-login", true);
	});
        //$("input,select,textarea").not("[type=submit]").jqBootstrapValidation();
        //*/
}

Template.register_form.destroyed = function(){
	//$('#registerModal').modal("hide");
	//$('.modal-backdrop').destroy();
	//Session.set('first-login', true);
}

Template.register_form.events({
	'click button#register-btn': function(e, t){
		console.log("submit");
		$("#register_form").submit();
	},
    'focus input': function(event,template){
        event.preventDefault();
    },
	'submit #register_form':function(e,t){
		e.preventDefault();
		var name = t.find('#name_registerform').value;
		var lastname = t.find('#lastname_registerform').value;
		var gender = t.find('.gender:checked');
		var interests = t.findAll('[name="interests"]:checked');
		var birthday = t.find('#birthday_registerform').value;
		var email = t.find('#email_registerform').value;
		var passwdch = t.find('#passwdcheck_registerform').value;
		var passwd = t.find('#passwd_registerform').value;
		var country = t.find('#country_registerform').value;
		var city = t.find('#city_registerform').value;
		var nativeLang = t.find('#native_registerform option:selected').value;
		var learninglanguages = t.findAll('.learning-language');
		var knownlanguage = t.findAll('.knownlanguage');
        var error = new Array();

        if (!name)
            error.Name = mf('name-404', null, 'Name not defined');

        if (!lastname)
            error.Lastname = mf('lastname-404', null, 'Lastname not defined');

        if (!birthday)
            error.Bithday = mf('birthday-404', null, 'Birthday not defined');

        if (!passwd)
            error.Password = mf('passwd-404', null, 'Password not defined');

        if(gender)
            gender = gender.value;
        else 
            error.gender = mf("not-defined", null, "Gender not defined");

		var langs = new Array();

        if (learninglanguages.length > 0){
            for (var j = 0; j < learninglanguages.length; j++)
            for (var i = 0; i < learninglanguages[j].length; i++){
                if (learninglanguages[j][i].selected && learninglanguages[j][i].value != 0)
                    langs.push(learninglanguages[j][i].value);
            }
        } 
        if(langs.length == 0)
            error.learninglanguages = mf("learning-404", null, "Learning languages not defined");

		var knownlangs = new Array();

		if (knownlanguage.length > 0){
            for (var j = 0; j < knownlanguage.length; j++)
                for (var i = 0; i < knownlanguage[j].length; i++){
                    if (knownlanguage[j][i].selected && knownlanguage[j][i].value != 0){
                        knownlangs.push(knownlanguage[j][i].value);
                    }
                }
        }
        if (knownlangs.length == 0)
            error.knownlanguages = mf("known-404", null, "Known languages not defined");

		var interestsArray = new Array();
		if(interests.length > 0){
            for (var i = 0; i < interests.length; i++){
                interestsArray.push(interests[i].value);
            }
        }else
            error.interests = mf("interest-404", null, "Interests not defined");

        if (email){
            email = trimInput(email);
        }else
            error.email = mf("email-404", null, "Email not defined");

		/**Validate things**/
		var user =
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
		};
        if(!error.length)
        Accounts.createUser(user, function(error){
            if(!error){
                $('#registerModal').modal("hide");
                //$('.modal-backdrop').destroy();
                console.log("done!!");
                Session.set('first-login', true);

            }else{
                console.log(error);
            }
        });
        else{
            var errorMsg = mf("signin-error",null,"The following fields contain errors, please check them and try again.");
            console.log(error.length);
            var errorOutput = "";
            for (var i in error){
                errorOutput += i+": "+error[i]+"<br />";
            }
            var alert = '<div class="alert alert-warning alert-dismissible" role="alert">\
                  <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>\
                  <strong>Warning!</strong> <br />'+errorMsg+'<br />'+errorOutput+'\
                </div>';
            console.log(errorOutput);
            var form = t.find("#register_form");
            $(form).append(alert);
        }

     //   $('#registerModal').modal("hide");
	},
	'click #add-more-languages': function(e,t){
		var langs = Session.get("langs");
        var element = t.find('#learninglanguages');
        var html = '<select name="lang" id="" class="learninglanguage">\
        						<option value="0">'+ mf('select-one',null,'Select One')+'</option>';
		for (var i = 0; i < langs.length; i++) {
			html = html + '<option value="'+langs[i]+'">'+langs[i]+'</option>';
		}
		html = html + '</select>';
        $(element).append(html);
	},
	'click #add-more-knownlanguages': function(e,t){
		var langs = Session.get("langs");
        var element = t.find('#knownlanguages');
        var html = '<select name="lang" id="" class="knownlanguage">\
        						<option value="0">'+ mf('select-one',null,'Select One')+'</option>';
		for (var i = 0; i < langs.length; i++) {
			html = html + '<option value="'+langs[i]+'">'+langs[i]+'</option>';
		}
		html = html + '</select>';
        $(element).append(html);
	}
});

/*
	User finder
*/
Template.user_finder.rendered = function(){
	console.log('add user');
	$('#user-finder-modal').modal();
	$("#user-finder-modal").on('hidden.bs.modal', function(){
		Session.set('user-finder', false);
	})
}


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
	'click #user_modal-btn': function(e,t){
		var action = Session.get("user_modal_actions");
        $(t.find("form")).submit();
	},
    'click .profile-navbar': function(event,template){
        event.preventDefault();
        var target = event.target;
        template.findAll(".profile-navbar").forEach(function(node){
            $(node).parent().removeClass("active");
        })
        $(target).parent().addClass("active");
        var user_modal = Session.get("user_modal_actions");
        user_modal.info = false;
        user_modal.security = false;
        user_modal.friends = false;
        if (target.id == "info"){
            user_modal.info = true;
        }else if (target.id == "security"){
            user_modal.security = true;
        }else if (target.id == "friends"){
            user_modal.friends = true;
        }
        user_modal.user_navbar = target.id;
        Session.set("user_modal_actions", user_modal);
        //console.log(user_modal);
        
    },
    'click #request-friendship-btn': function(event, template){
        event.preventDefault();
        if (Session.get("user_modal_actions").edit_profile){
            $("#edit-profile").submit();
        }
    }
})
Template.user_profile.events({
    'click #edit-profile': function(event, template){
        event.preventDefault();
        var user_modal = Session.get("user_modal_actions");
        user_modal.edit_profile = true;
        Session.set("user_modal_actions",user_modal);
    }
})
Template.user_profile_edit.events({
    'submit #edit-profile': function(event, template){
        event.preventDefault();
        var user = Meteor.user();
        user.profile.city = template.find("#city").value;
        user.profile.country = template.find("#country").value;
        user.profile.birthday = template.find("#birthday").value;
        user.profile.description = template.find("#description").value;
        user.profile.nativelang = template.find(".native option:selected").value;
        var knownlanguages = template.findAll(".knownlanguage");
        var learninglanguages = template.findAll(".learninglanguage");
        var interests = template.findAll(".interests");
        var knownlangsArray = new Array();
        var learninglangsArray = new Array();

        if (learninglanguages.length > 0)
            for (var j = 0; j < learninglanguages.length; j++)
            for (var i = 0; i < learninglanguages[j].length; i++){
                if (learninglanguages[j][i].selected)
                {
                    if(learninglanguages[j][i].value !=0)
                        learninglangsArray.push(learninglanguages[j][i].value);
                }
            }

		if (knownlanguages.length > 0)
            for (var j = 0; j < knownlanguages.length; j++)
                for (var i = 0; i < knownlanguages[j].length; i++){
                    if (knownlanguages[j][i].selected){
                        if(knownlanguages[j][i].value != 0)
                            knownlangsArray.push(knownlanguages[j][i].value);
                    }
                }
		var interestsArray = new Array();
		if(interests.length > 0)
            for (var i = 0; i < interests.length; i++){
                interestsArray.push(interests[i].value);
            }
        user.profile.knownlanguages = knownlangsArray;
        user.profile.learninglanguages = learninglangsArray;

        Meteor.users.update({_id:Meteor.userId()},{$set:{profile:user.profile}},function(errors,doc){
            if(errors){
                console.log("Sorry, it seems your request failed to be process. Log info:");
                console.log(errors);
            }
        });
        var userModal = Session.get("user_modal_actions");
        userModal.user = Meteor.user().profile;
        userModal.edit_profile = false;
        Session.set("user_modal_actions", userModal);
    },
    'click #close': function(event, template){
        Session.set("user_modal_actions", false);
    },
	'click .plus': function(event,template){
		var langs = Session.get("langs");
        if(event.target.parentNode.parentNode.id == "knownlanguages"){
            var element = template.find("#knownlanguages");
            var selectClass = "knownlanguage";
        } else {
            var element = template.find('#learninglanguages');
            var selectClass = "learninglanguage";
        }
        var html = '<select name="lang" id="" class="'+selectClass+'">\
        						<option value="0">'+ mf('select',null,'Select One')+'</option>';
		for (var i = 0; i < langs.length; i++) {
			html = html + '<option value="'+langs[i]+'">'+langs[i]+'</option>';
		}
		html = html + '</select>';
        $(element).append(html);
	},
    'click .remove': function (event, template){
        var select = $(event.target).prev()[0];
        var langSelected = null;
        for (var i = 0; i < select.length; i++){
            if (select[i].selected){
                langSelected = select[i].value;
            }
        }
        if($(select).hasClass("knownlanguage"))
            Meteor.users.update({_id:Meteor.userId()},{$pull:{"profile.knownlanguages":langSelected}});
        else
            Meteor.users.update({_id:Meteor.userId()},{$pull:{"profile.learninglanguages":langSelected}});
    }
});
Template.user_profile_edit.helpers({
    'learninglanguages': function(lang){
        console.log(lang);
        var returnArray = new Array();
        var langs = Session.get("langs");
        var learning_langs = Meteor.user().profile.learninglanguages;
        var learning_length = learning_langs.length -1;
        for (var l = learning_length; l >= 0; l--){
            var langArray = new Array();
            for (var i = 0; i < langs.length;i++){
                if (learning_langs[l]== langs[i])
                {
                    langArray.push({learning:"selected",lang:langs[i]});
                }
                else langArray.push({learning:false,lang:langs[i]});
            }
            console.log(langArray);
            returnArray.push(langArray);
        }
        console.log(returnArray);
        return returnArray;
    }
});


Template.user_friends.events({
  
})
Template.reset.events({
    'submit #reset-passwd': function(event,template){
        event.preventDefault();
        event.stopPropagation();
        var email = template.find("input.form-control").value;
        console.log('reset acount');
        console.log(email);
        /*Meteor.call('reset_passwd',email,function(error,result){
            if(!error){
                $('#user-modal').modal('hide');
            }
        });*/
        Accounts.forgotPassword({email:email},function(error){
            if (! error){
                $('#user-modal').modal('hide');
            }else 
                console.log(error);
        });
    }
})
Template.report.events({
	'submit #report-user-form': function(e,t){
		e.preventDefault();
		var reason = t.find("#user-modal-msg").value;
		var userId = Session.get("user_modal_actions")._id;
		var context = Session.get("user_modal_actions").context;
		if(reason.length < 2){
            if (context === "chatrooms"){
                var room = Meteor.user().profile.active_room;
                if (room.type === "public"){
                    
                }

            }

    	}
        console.log(context);
        Report.insert({user_reported:userId, report_by:Meteor.userId(), reason:reason,context:context});
        Session.set("user_modal_actions", false);
    }
});
Template.user_invite_request.events({
	'submit #user-invite-request-form':function(e,t){
		e.preventDefault();
		var message = t.find("#user-modal-msg").value;
        var user = t.find("[name=user-name]").id;
		var type = $(".user-form:checked");
		var userId = Session.get("user_modal_actions")._id;
        UserRequest.insert({user: Meteor.userId(), request_to:user, message:message}, function(error){
                if(error){
                    console.log(error);
                }
                else {
                    $(".modal").modal("hide");
                    Session.set("user_modal_actions", false);
                }            }
        );
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
        var user = t.find("[name=user-name]").id;
		var type = $(".user-form:checked");
		console.log(type);
        UserRequest.insert({user: Meteor.userId(), request_to:user, message:message}, function(error){
                if(error){
                    console.log(error);
                }
            }
        );
		$("#user-modal").modal('hide');
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
		Meteor.call("group_invite_request",{user:userId,message:message,group:groupId});
	}
});
var requestHandler = function (args){
    /*if (args.type == 1){
        var request = GroupRequest.findOne({_id:args.request});
        if(args.action == 1)
            Meteor.call("setUser_group", request,1);

        else
            GroupRequest.remove({_id:request._id});

    }else*/ 
    console.log("herreee");
    if (args.type == 2 || args.type == 1){
        console.log('group invite');
        var request = GroupRequest.findOne({_id:args.request});
        if(args.action == 1)
            User_Group.insert({group:request.group,user:request.user,owner:false,mod:false,active:false}, 
                function(error, result){
                    console.log(error);
                    if(!error){
                        //Meteor.call("setUser_activeRoom","group",User_Group.findOne({_id:result}));
                    }
                        
            });	
        else
            User_Group.remove({group:group,user:user});
        GroupRequest.remove({_id:request._id});
    }else{
        var request = UserRequest.findOne({_id:args.request,request_to:this.userId});
        if(args.action == 1){
            var request = args.request;
            var relation = args.relation;
            console.log('add');
            UsersRelations.insert({user:this.userId,contact:request.user,relation:relation,time: Date.now()});
            UsersRelations.insert({user:request.user,contact:this.userId,relation:request.relation,time: Date.now()},function(error){
                if (!error) {
                    PrivateChat.insert({user:request.user,contact:request.contact_to,active:false}, function(error, result){
                    });
                    PrivateChat.insert({user:request.contact_to,contact:request.user,active:false}, function(error, result){
                    });
                    UserRequest.remove({_id:request._id});
                    console.log('friendship ok');
                }
            });
        }else{
            UsersRelations.remove({user:this.userId,contact:args.user});
            UsersRelations.remove({contact:this.userId,user:args.user});
            PrivateChat.remove({user:this.userId,contact:args.user})
            PrivateChat.remove({contact:this.userId,user:args.user})
        }
        UserRequest.remove({_id:request._id});
    }
}

