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
    groupModalHandler: function(group_handler, element){
        
        return 0;
    }
});
UI.registerHelper("group_handler",
    function (){
    return Session.get("group_handler")
    }
);
UI.registerHelper("group_managenment",
    function(){
        var user_groups = User_Group.find({user: Meteor.userId(),mod:true}, {fields:{group:1}}).fetch();
        var groupsArray = new Array();
        user_groups.forEach(function(row){
            groupsArray.push(row.group);
        });

        var groups = new Array();
        Groups.find({_id:{$in: groupsArray}}).fetch().forEach(function(row){
            row.notification = User_Group.findOne({user:Meteor.userId(), group:row._id}).new_messages;
            var users = User_Group.find({group:row._id}).fetch();
            var usersArray = new Array();
            users.forEach(function(user){
                user.user = Meteor.users.findOne({_id:user.user}, {fields:{_id:1,"profile.name":1,"profile.lastname":1,status:1}});
                usersArray.push(user);
            });
            row.users = {active:false,users:usersArray};
            groups.push(row);
        });
        //console.log(groups);

        return groups;
    }
);
UI.registerHelper("group_managenment_action",
    function(){
        return Session.get("group-managenment-action");
    }
);
Template.find_group.helpers({
    'group': function(){
        var groups = Session.get('groups-found');
        //console.log(groups);
        return groups;
    }
})
