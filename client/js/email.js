// Template.emails.email = function(){ return Session.get("emails");}
// Template.user.email = function(){ return Session.get("emails");}

UI.registerHelper("email", function(){ return Session.get("emails");});
UI.registerHelper("emails",
function(){ 
	var action = Session.get("emails");
	if(action.sent || action.received){
		/*Meteor.call("get_emails",function(error,emails){
			Session.set("emailsd",emails);
		});
	}*/
        var emails_sent = Email.find({emailfrom:Meteor.userId()}, {sort:{date:-1}});
        var emails_received = Email.find({emailto:Meteor.userId()}, {sort:{date:-1}});

        if(emails_sent.count() == 0){
            emails_sent = false;
        }
        else{
            emails_sent = emails_sent.fetch();
            var emailArray = new Array();
            emails_sent.forEach(function(row){
                row.user = Meteor.users.findOne({_id:row.emailto});
                emailArray.push(row);
            })
            emails_sent = emailArray;
        }

        if(emails_received.count() == 0){
            emails_received = false;
        }
        else{
            emails_received = emails_received.fetch();
            var emailArray = new Array();
            emails_received.forEach(function(row){
                row.user = Meteor.users.findOne({_id:row.emailfrom});
                emailArray.push(row);
            })
            emails_received = emailArray;
        }
        

        Session.set("emailsd",{sent:emails_sent,received:emails_received});
    }
	return Session.get("emailsd");
}
);

Template.emails.rendered = function(){
	// console.log('emails');
	var element = Session.get("emails")
	if (element.sent){
			Session.set("emails", {sent:"active"});
			$("#send-btn").addClass("hide disabled");
		}else if (element.received){
			Session.set("emails", {received:"active"});
			$("#send-btn").addClass("hide disabled");
		}else if (element.send){
			Session.set("emails", {send:"active"});
			$("#send-btn").removeClass("hide disabled");
			$("#send-btn").val(mf("send",null,"Send"));
		}
	$('#emails-modal').modal('toggle');
	$("#emails-modal").on('hidden.bs.modal', function(){
		Session.set('emails', false);
		Session.set('emailsd', false);
	})
}
Template.emails.events({
	'click a.email': function(e,t){
		var element = e.target;
		$('.email').removeClass("active");
		//console.log(element.id );
		$(element).addClass('active');

		if (element.id == "sent"){
			Session.set("emails", {sent:"active"});
			$("#send-btn").addClass("hide disabled");
		}else if (element.id == "received"){
			Session.set("emails", {received:"active"});
			$("#send-btn").addClass("hide disabled");
		}else if (element.id == "send"){
			Session.set("emails", {send:"active"});
			$("#send-btn").removeClass("hide disabled");
			$("#send-btn").val(mf("send",null,"Send"));
		}
	},
	'submit form#email-form': function(e,t){
		e.preventDefault();
		if(Session.get('find-group')){
			var groupname = t.find('#group-name-f').value;
			if (groupname.length < 4){
				return false;
			}
			/*var groups = new Array();
			Groups.find( { name: { $regex: groupname, $options: 'i' } } ).fetch().forEach(function(row){
				row.owner = false;
				row.user = {};
				Meteor.call('find_group_owner',row, function(error,user){
					console.log(row.owner);
					row.owner = {_id:user._id,name:user.profile.name,lastname:user.profile.lastname};
				});
				row.actions = {send_request:true};

				if (User_Group.findOne({user:Meteor.userId(),group:row._id}))
					row.actions.send_request = false;
				groups.push(row);
			});*/
			Meteor.call("find", {group:{name:groupname}}, function(error,result){
				if(!error){
					//console.log(result);
					Session.set('groups-found',result);		
				}
			})
			// console.log(groups);
			
		}else{
			var groupname = t.find("#group-name-c").value;
			if(groupname != ""){
				var details = t.find("#description").value;
				var members = new Array();
				try{
					t.find(".member").each(function(){
					members.push(this.value);
					});	
				}catch(e){}
				
				var langs = t.findAll(".lang");
				console.log(langs);
				var languages = new Array();
				langs.each(function(){
					languages.push($(this).option);
				});
				Meteor.call("create_group", groupname,details,languages, members);
			}
			$('#group-chat-finder-modal').modal('hide');
		}
	},
	'click input#send-btn':function(e,t){
		$('form#send-email-form').submit();
	},
	'click #morelang': function(e, t){
		var element = t.find('#langs');
		var langs = Session.get("langs");
        var html = '<select name="lang" id="" class="lang">\
					<option value="0">'+ mf('select',null,'Select One')+'</option>';
		for (var i = 0; i < langs.length; i++) {
			html = html+'<option value="'+langs[i].lang+'">'+langs[i].lang+'</option>';
		}
		html = html + '</select>';
        $(element).append(html);
							
	},
	'keypress input#group-name-f':function(event, template){
		var group = event.target.value;
		if (group.length > 2){
			$('form#find-create-form').submit();
		}
	},
	'click .groupdatails':function(e,t){
		$("#"+$(e.target).attr('data-toggle-to')).collapse('toggle');
	}
});
Template.send_email.events({
	'submit #send-email-form': function(e,t){
		e.preventDefault();
		var emailto = t.find(".emailto").id;
		var message = t.find("#send-email-msg").value;
		var subject = t.find(".subject").value;
        if (!subject)
            subject = mf("no-subject", null, "No Subject");
		if(message.length > 2)
			Meteor.call("send_email",{emailto:emailto,subject:subject,message:message},function(error,result){
				if(!error){
					console.log("email sent");
					Session.set("emails", {sent:"active"});
				}else console.log(error);
			});
	}
});

Template.sent_emails.events({
	'click .subject': function(e,t){
		e.preventDefault();
		$("div#"+$(e.target).attr('data-target')).collapse('toggle');
	},
    'click .btn-remove': function(event, template){
        event.preventDefault();
        var emailID = event.target.id;
        Email.remove({_id:emailID});
    }
});
Template.received_emails.events({
	'click .subject': function(e,t){
		e.preventDefault();
		$("div#"+$(e.target).attr('data-target')).collapse('toggle');
        Email.update({_id:$(e.target).attr('data-target')}, {$set:{isnew:false}});
	},
    'click .btn-remove': function(event, template){
        event.preventDefault();
        var emailID = event.target.id;
        Email.remove({_id:emailID});
    }
});
