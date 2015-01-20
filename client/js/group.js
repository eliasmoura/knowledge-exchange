Template.group_handler.helpers({
    'group_handler': function(){ 
        return Session.get("group_handler");
    }
});

Template.group_handler.rendered = function(){
	$('#group-handler-modal').modal();
	$("#group-handler-modal").on('hidden.bs.modal', function(){
        var group_handler = Session.get("group_handler");
        /*if (group_handler.create.active){
            group_handler.create.active = false;
            group_handler.create.data = null;
        }
        if (group_handler.find.active){
            group_handler.find.active = false;
            group_handler.find.data = null;
        }
        if (group_handler.management.active){
            group_handler.management.active = false;
            group_handler.management.data = null;
        }*/
        group_handler.active = false;
		Session.set('group_handler', group_handler);
	});
}
Template.group_handler.events({
	'click a.menu': function(e,t){
		var element = e.target.id;
        var group_handler = Session.get("group_handler");
        group_handler.create.active = false;
        group_handler.find.active = false;
        group_handler.management.active = false;
		if (element == "find"){
            group_handler.find.active = true;
            Session.set("group_handler", group_handler);
			$("#handler-btn").val(mf("find",null,"Find"));
			
		}else if(element == "create"){
            group_handler.create.active = true;
			Session.set("group_handler", group_handler);
			$("#handler-btn").val(mf("create",null,"Create"));
		}
		else if(element == "management"){
            group_handler.management.active = true;
			Session.set("group_handler", group_handler);
			$("#handler-btn").val(mf("create",null,"Aply"));
		}
        
	},
	'click input#handler-btn':function(event,template){
        if(event.target.value == "Find")
            $('form#find_group').submit();
        if(event.target.value == "Create")
            $('form#create_group').submit();	
        if(event.target.value == "Management")
            $('form#management').submit();
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

Template.find_group.events({
	'submit form#find_group': function(event,template){
		event.preventDefault();
        var groupname = template.find('#group-name-f').value;
        if (groupname.length > 4){
            Meteor.call("find", {group:{name:groupname}}, function(error,result){
                if(!error){
                    //console.log(result);
                    Session.set('groups-found',result);		
                }
            });
        }
    },
    'click button.send-request': function(event, template){
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

Template.create_group.rendered = function(){
}
Template.create_group.events({
    'submit form#create_group': function(event, template){
        event.preventDefault();
        var groupname = template.find("#group-name-c").value;
        
        var description = template.find("#description").value;
        var members = new Array();
        try{
            t.find(".friends-contacts:checked").each(function(){
            members.push(this.id);
            });	
        }catch(e){}
        
        var langs = template.findAll(".lang");
        var languages = new Array();

        langs.forEach(function(){
            languages.push($(this).option);
        });

        var groupType = template.find("#type option:selected").value;
        var groupFocus = template.findAll(".group-type:checked");
        var groupFocusArray = new Array();

        groupFocus.forEach(function(){
            groupFocusArray.push(this.value);
        });

        if(template.find("[name='invite-message']:checked"))
        if(template.find("[name='invite-message']:checked").value != "default")
            var message = template.find("#invite-message").value;
        else
            var message = "default";
        
        /*Meteor.call("create_group", {name:groupname,description:description,
            languages:languages, invite:members,group_type:groupType,
            group_focus:groupFocusArray,message:message});*/
        var errors = new Array();
        var group = {name:groupname,description:description,
            languages:languages, group_type:groupType,
            group_focus:groupFocusArray};
        
        if (group.name.length < 3){
            errors.push({name:"too short"})
        }
        if (Groups.findOne({name:group.name})){
            errors.push({name:"already in use"});
        }
        if (!group.description){
            errors,push({description:true});
        } 
        if(!group.languages.length){
            errors.push({languages:true});
        }
        if(!group.group_type){
            errors.push({type:true});
        }
        if(!group.group_focus){
            errors.push({focus:true});
        }
        if(!errors.length){
            group = Groups.insert({
                    name:group.name,
                    description:group.description,
                    languages:group.languages,
                    focus:group.group_focus,
                    type:group.group_type
                }, function(error, result){
                    if(!error){
                        User_Group.insert({group:result,user:Meteor.userId(),owner:true,mod:true,active:true}, function(error, result){
                            if(!error){
                                console.log(result);
                                console.log(User_Group.findOne({_id:result}));
                                Meteor.call("setUser_activeRoom","group",group);
                            }else
                                console.log(error);
                        });
                        for (var i = 0; i< members.length; i++) {
                            //group_invite_request({group:result,user:member[i],message:message});
                            GroupRequest.insert({user:member[i],message:message,type:2,group:result});
                        }
                    }
                }
            );
            console.log("Group created");
            /*Meteor.call('setRoom_Non_active');
            Meteor.call('setGroup_Non_active');
            Meteor.call('setFriend_Non_active');*/
            $('#group-handler-modal').modal('hide');
        }else{
        console.log(errors);
        }
    },
	'click #morelang': function(e, t){
		var element = t.find('.lang');
		var langs = Session.get("langs");
        var html = '<select name="lang" id="" class="lang form-control">\
					<option value="0">'+ mf('select',null,'Select One')+'</option>';
		for (var i = 0; i < langs.length; i++) {
			html = html+'<option value="'+langs[i]+'">'+langs[i]+'</option>';
		}
		html = html + '</select>';
        $(element).parent().append(html);
							
	},
    'click #handler-btn': function(event, tamplate){
        $(template.find("form")).submit();
    }
})
Template.create_group.langs = function(){
	return Languages.find({},{$sort: {name: +1}});
}
Template.create_group.rendered = function(){

}
Template.find_group.created =function(){
	//Session.set('groups-found', false);
}
Template.group_managenment.events({
    'click a.manage-group': function(event, template){
        var toggle = $(event.target).attr("data-toggle");
        $("#manage-"+toggle).collapse("toggle");
        event.stopPropagation();
        event.preventDefault();
    },
    'click a.group-managenment-menu': function(event, template){
        event.stopPropagation();
        event.preventDefault();
        var action = event.target.id;
        if(action == "edit"){
            Session.set("group-managenment-action", {edit:true});
        }else if (action == "manage"){
            Session.set("group-managenment-action", {manage:true});
        }
    },
    'click .mod_actions': function(event, template){
        event.preventDefault();
        event.stopPropagation();

    }
})
