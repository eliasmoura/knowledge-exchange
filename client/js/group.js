Template.group_chat_finder.find = function(){ return Session.get("find-group");}

Template.group_chat_finder.rendered = function(){
	console.log('add group');
	Session.set("find-group", true);
	$('#group-chat-finder-modal').modal();
	$("#group-chat-finder-modal").on('hidden.bs.modal', function(){
		Session.set('group-finder', false);
		Session.set('groups-found', false);
	})
}
Template.group_chat_finder.events({
	'click a.find-create': function(e,t){
		var element = e.target;
		$('.find-create').removeClass("active");
		console.log(element.id );
		$(element).addClass('active');
		if (element.id == "find"){
			Session.set("find-group", true);
			$("#find-create-btn").val(mf("find",null,"Find"));
			
		}else{
			Session.set("find-group", false);
			$("#find-create-btn").val(mf("create",null,"Create"));
		}
	},
	'submit form#find-create-form': function(e,t){
		e.preventDefault();
		if(Session.get('find-group')){
			var groupname = t.find('#group-name-f').value;
			if (groupname.length > 4){
				Meteor.call("find", {group:{name:groupname}}, function(error,result){
					if(!error){
						//console.log(result);
						Session.set('groups-found',result);		
					}
				});
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
			
			// console.log(groups);
			
		}else{
			var groupname = t.find("#group-name-c").value;
			
			if(groupname != ""){
				var description = t.find("#description").value;
				var members = new Array();
				try{
					t.find(".friends-contacts:checked").each(function(){
					members.push(this.id);
					});	
				}catch(e){}
				
				var langs = t.findAll(".lang");
				console.log(langs);
				var languages = new Array();
				langs.each(function(){
					languages.push($(this).option);
				});
				var groupType = t.find("#type option:selected").value;
				var groupFocus = t.findAll("[name='groupgenre]:checked");
				var groupFocusArray = new Array();
				groupFocus.forEach(function(){
					groupFocusArray.push(this.value);
				});

				if(t.find("[name='invite-message']:checked").value != "default")
					var message = t.find("#invite-message").value;
				else
					var message = "default";
				
				Meteor.call("create_group", {name:groupname,description:description,
					languages:languages, invite:members,group_type:groupType,
					group_focus:groupFocusArray,message:message});
				$('#group-chat-finder-modal').modal('hide');
			}
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
Template.create_group.rendered = function(){
		/*$('#find-create-form').bootstrapValidator({
	        message: 'This value is not valid',
	        feedbackIcons: {
	            valid: 'glyphicon glyphicon-ok',
	            invalid: 'glyphicon glyphicon-remove',
	            validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	            name: {
	                message: 'The name is not valid',
	                validators: {
	                    notEmpty: {
	                        message: 'The name is required and cannot be empty'
	                    },
	                    regexp: {
	                        regexp: /^[a-zA-Z0-9_]+$/,
	                        message: 'The group name can only consist of alphabetical, number and underscore'
	                    }
	                }
	            },
	            description: {
	                message: 'The description is not valid',
	                validators: {
	                    notEmpty: {
	                        message: 'The description is required and cannot be empty'
	                    }
	                }
	            },
	            email: {
	                validators: {
	                    notEmpty: {
	                        message: 'The email is required and cannot be empty'
	                    },
	                    emailAddress: {
	                        message: 'The input is not a valid email address'
	                    }
	                }
	            }
	        }
	    });*/
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