Template.emails.email = function(){ return Session.get("emails");}
Template.user.email = function(){ return Session.get("emails");}

Template.sent_emails.emails = function(){ 
	var action = Session.get("emails");
	if(action.sent || action.received){
		Meteor.call("get_emails",function(error,emails){
			Session.set("emailsd",emails);
		});
	}
	return Session.get("emailsd");
}

Template.emails.rendered = function(){
	console.log('emails');
	Session.set("emails", {sent:true});
	$('#emails-modal').modal('toggle');
	$("#emails-modal").on('hidden.bs.modal', function(){
		Session.set('emails', false);
		Session.set('emails_sent', false);
	})
}
Template.emails.events({
	'click a.email': function(e,t){
		var element = e.target;
		$('.email').removeClass("active");
		//console.log(element.id );
		$(element).addClass('active');

		if (element.id == "sent"){
			Session.set("emails", {sent:true});
			$("#send-btn").addClass("hide disabled");
		}else if (element.id == "received"){
			Session.set("emails", {received:true});
			$("#send-btn").addClass("hide disabled");
		}else if (element.id == "send"){
			Session.set("emails", {send:true});
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
	'click input#find-create-btn':function(e,t){
		$('form#find-create-form').submit();
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

Template.create_group.langs = function(){
	return Languages.find({},{$sort: {name: +1}});
}
Template.find_group.created =function(){
	//Session.set('groups-found', false);
}
Template.find_group.group = function(){
	var groups = Session.get('groups-found');
	//console.log(groups);
	return groups;
}
Template.find_group.events({
	'click span.send-request': function(event, template){
		var groupId = event.target.id;
		console.log('prepering the request');
		var message = 'Some thing to say :)';
		Meteor.call("participation_request", groupId, message,function(error,result){
			if(!error)
				console.log('request sent');
			else
				console.log('request not sent');
		});
		
		
	}
});

Template.send_emails.events({
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