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


Template.create_group.created = function(){
    var number = [1];
    Session.set("numberLangs", number );
};
Template.create_group.events({
    'submit form#create_group': function(event, template){
        event.preventDefault();
        var groupname = template.find("#group-name-c").value;

        var description = template.find("textarea#description").value;
        var members = new Array();
        try{
            t.find(".friends-contacts:checked").each(function(){
            members.push(this.id);
            });
        }catch(e){}

        var langs = template.findAll(".lang option:selected");

        var languages = _.reject(langs, function(item) {
            return item.value === "0";
        });
        languages = _.map(languages, function(item){
            return item.value;
        });
        var groupType = template.find("select#type option:selected").value;
        var groupFocus = template.findAll("input[type=checkbox].group-type:checked");
        var groupFocusArray = _.map(groupFocus, function(item) {
             return item.defaultValue;
        });

        var message = "";
        if(template.find("[name='invite-message']:checked"))
        if(template.find("[name='invite-message']:checked").value != "default")
            message = template.find("#invite-message").value;
        else
            message = "default";

        /*Meteor.call("create_group", {name:groupname,description:description,
            languages:languages, invite:members,group_type:groupType,
            group_focus:groupFocusArray,message:message});*/
        var errors = new Array();
        var group = {name:groupname,description:description,
            languages:languages, group_type:groupType,
            group_focus:groupFocusArray};
        //console.log(group);
        if (group.name.length < 3){
            errors.push({name:true});
        }
        if (Groups.findOne({name:group.name}) !== undefined){
            errors.push({name:true});
        }
        if (String.trim(group.description).length === 0){
            errors.push({description:true});
        }
        if(group.languages.length === 0){
            errors.push({languages:true});
        }
        if(group.group_type === "none"){
            errors.push({type:true});
        }
        if(group.group_focus.length === 0){
            errors.push({focus:true});
        }
        if(errors.length === 0){
            group = Groups.insert({
                    name:group.name,
                    description:group.description,
                    languages:group.languages,
                    focus:group.group_focus,
                    type:group.group_type,
                    owner:Meteor.userId()
                }, function(error, result){
                    if(!error){
                        Session.set("numberList", [1]);
                        Session.set("group_handler", false);
                        for (var i = 0; i< members.length; i++) {
                            //group_invite_request({group:result,user:member[i],message:message});
                            GroupRequest.insert({user:member[i],message:message,type:2,group:result});
                        }
                        Router.go("GroupChat",{_id:result});
                    }else console.log(error);
                }
            );
            //console.log("Group created");
            $('#group-handler-modal').modal('hide');
        }else{
            _.each(errors, function(error){
                var key = _.keys(error)[0];
                $("span#"+key).removeClass("hidden");
                //console.log(_.keys(error));
            });
            //console.log(errors);
        }
    },
    'click #morelang': function(e, t){
        var element = t.find('.lang');
        e.preventDefault();
        e.stopPropagation();
        var element = t.find("div#grouplangs");
        var number = Session.get("numberLangs");
        if(!number)
            number = new Array(1);
        console.log(number);
        number.push(number.length);
        Session.set("numberLangs",number);

        //Blaze.render("langs_list",element);
        // Session.set("allowed_langs", Session.get("allowed_langs")+1);
        // var langs = Session.get("langs");
        // var html = '<select name="lang" id="" class="lang form-control">\
        //             <option value="0">'+ mf('select',null,'Select One')+'</option>';
        // for (var i = 0; i < langs.length; i++) {
        //     html = html+'<option value="'+langs[i].key+'">'+langs[i].lang+'</option>';
        // }
        // html = html + '</select>';
        //$(element).parent().append(html);
    },
    'click #handler-btn': function(event, tamplate){
        $(template.find("form")).submit();
    }
});
Template.edit_group_info.rendered = {
    
}
Template.edit_group_info.events({
    'submit form#edit_group': function(event, template){
        event.preventDefault();
        var groupname = template.find("#group-name-c").value;

        var description = template.find("#description").value;
        var members = new Array();
        try{
            t.find(".friends-contacts:checked").each(function(){
            members.push(this.id);
            });
        }catch(e){}

        var langs = template.findAll(".lang option:selected");

        var languages = _.map(langs, function(item) {
             return item.value;
        });

        var groupType = template.find("#type option:selected").value;
        var groupFocus = template.findAll("input[type=checkbox].group-type:checked");
        var groupFocusArray = _.map(groupFocus, function(item) {
             return item.defaultValue;
        });
        var errors = new Array();
        var group = {name:groupname,description:description,
            languages:languages, group_type:groupType,
            group_focus:groupFocusArray};
        if (group.name.length < 3){
            errors.push({name:"too short"});
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
            var oldgroup = Groups.findOne({_id:Session.get("roomid")});
            var updates = {};
            if(group.name !== oldgroup.name)
                updates.name = group.name;
            if(group.description !== oldgroup.description)
                updates.description = group.description;
            if(_.difference(group.languages,oldgroup.languages).length || _.difference(oldgroup.languages,group.languages).length)
                updates.languages = group.languages;
            if(_.difference(group.group_focus,oldgroup.focus).length || _.difference(oldgroup.focus,group.group_focus).length)
                updates.focus = group.group_focus;
            if(group.group_type !== oldgroup.type)
                updates.type = group.group_type;
            if(!_.isEmpty(updates))
            Groups.update({_id:Session.get("roomid")},{$set:updates},
                function(error, result){
                    if(!error){
                        console.log("Edited");
                        Router.go("GroupChat",{_id:Session.get("roomid")});
                    }else console.log(error);
                }
            );
        }else{
        console.log(errors);
        }
    },
    'click #morelang': function(e, t){
        var element = t.find('.lang');
        e.preventDefault();
        e.stopPropagation();
        var langs = Session.get("langs");
        var html = '<select name="lang" id="" class="lang form-control">\
                    <option value="0">'+ mf('select',null,'Select One')+'</option>';
        for (var i = 0; i < langs.length; i++) {
            html = html+'<option value="'+langs[i].key+'">'+langs[i].lang+'</option>';
        }
        html = html + '</select>';
        $(element).parent().append(html);
    },
    'click #update': function(event, tamplate){
        $("#edit_group").submit();
    }
})
Template.create_group.langs = function(){
        return Languages.find({},{$sort: {name: +1}});
}
Template.create_group.rendered = function(){
Session.set("allowed_langs", 1);

}
Template.room_overview.events({
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
    'click .send-request': function(event, template){
        var groupId = event.target.id;
        var message = 'Some thing to say :)';
        var group = Groups.findOne({_id: groupId});
        if (group){
            if(!User_Room.findOne({user:Meteor.userId(), room:group._id})){
                if(!GroupRequest.findOne({user:Meteor.userId(),group:group._id})){
                    group = Requests.insert({user: Meteor.userId(), group: group._id, message: message, type: "participation"});
                }
            }
        }else{
            console.log("couldn't find this group.");
        }
    },

});
Template.group_settings.events({
    'change .group-settings':function(event, template){
        event.preventDefault();
        event.stopPropagation();
        var target = event.currentTarget.id;
        var value = 0;
        var room = Session.get("roomid");
        var user_room = User_Room.findOne({room:room,user:Meteor.userId()});
        var settings = user_room.settings;
        console.log(settings);
        if(settings === undefined){
            settings = {notification:{any:true}};
            settings.notification = {muted:0};
            settings.notification = {direct:false};
            settings.notification = {threshold:0};
        }
        if(target === "mutedfor")
            settings.notification.muted = template.find("input#mutedfor").value;
        else if(target === "message-threshold")
            settings.notification.threshold = template.find("input#message-threshold").value;
        else if(target === "any"){
            settings.notification.any = true;
            settings.notification.direct = false;
        }
        else if(target === "direct"){
            settings.notification.direct = true;
            settings.notification.any = false;
        }

        User_Room.update({_id:user_room._id},{$set:{settings:settings}}, function(erro,result){
            if(error)
            console.log(erro);
        });
    }
});
Template.groupmenu.rendered = function(){
    $(".manage-group-dropdown").accordion();
    console.log($(".manage-group-dropdown").attr("id"));
};
Template.managenment_usersgroup.rendered = function(){

    $(".ui.accordion").accordion();
};
Template.group_managenment.rendered = function(){
    Session.set("group-managenment-action", {users:true});
};
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
        var action = event.currentTarget.id;
        if(action == "edit"){
            Session.set("group-managenment-action", {edit:true});
        }else if (action == "manage"){
            Session.set("group-managenment-action", {users:true});
        }
    },
    'click .mod_actions': function(event, template){
        event.preventDefault();
        event.stopPropagation();
        console.log("checking moderator action");

        var target = event.currentTarget;
        var action =  target.id;
        var targetUser = $(target).attr("data-user");
        var targetGroup = $(target).attr("data-target");
        var currentUser = Meteor.userId();

        if (Roles.userIsInRole(currentUser, "owner", targetGroup) || Roles.userIsInRole(currentUser, "group-manager", targetGroup)){
            console.log("is allowed to change the db");
            if(action == "toggle-mod"){
                Roles.removeUsersFromRoles(targertUser, "group-manager", targetGroup);
            }else if (action == "delete-user"){
                var removeUser = User_Room.findOne({user:targetUser,room:targetGroup});
                console.log("checking if there's a user_group collection");
                console.log(removeUser);
                User_Room.remove({_id:removeUser._id});
            }else if (action == "accept-request"){
                User_Room.insert({room:targetGroup,user:targetUser, type:"group",new_messages: 0, date:Date.now()});
                console.log("Accepting the request");
            }else if (action == "deny-request"){
                console.log("deny request");
            }else console.log("this action isn't listed");
        }
    },
    'click .manage-userlist': function(event, template){
        event.preventDefault();
        event.stopPropagation();
        var toggle = $(event.target).attr("data-toggle");
        $("#manage-userlist-"+toggle).collapse("toggle");
    },
    'click .manage-requests': function(event, template){
        event.preventDefault();
        event.stopPropagation();
        var toggle = $(event.target).attr("data-toggle");
        $("#manage-requests-"+toggle).collapse("toggle");
    }
})
