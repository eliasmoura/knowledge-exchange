Meteor.methods({
	participation_request: function(group, message){
		console.log('part request');
		var group = Groups.findOne({_id: group});
		console.log(group);
		if (group)
			if(!User_Group.findOne({user:this.userId, group:group._id}))
				if(!GroupRequest.findOne({user:this.userId,group:group._id}))
					group = GroupRequest.insert({user: Meteor.userId(), group: group._id, message: message, type: 1});
		else
			throw Meteor.Error(1000, "The group you are trying to send a request doesn't exit");
		console.log(group);
		//Groups.update({_id:groupId}, {$push:{request:userId}});
	},

    groupModalHandler: function(args){
        var group_handler = args.group_handler;
        var element = args.element;
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
    }
})
UI.registerHelper("group_handler",
    function (){
    return Session.get("group_handler")
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
