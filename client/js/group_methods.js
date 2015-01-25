UI.registerHelper("group_handler",
    function (){
        return Session.get("group_handler")
    }
);
UI.registerHelper("group_managenment",
    function(){
        var groupsArray = Roles.getGroupsForUser(Meteor.userId(), "group-manager")
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

            var participationRequests = GroupRequest.find({group:row._id, type:1}).fetch();
            var requests = _.map(participationRequests, function(user){
                user.user = Meteor.users.findOne({_id:user.user}, {fields:{_id:1,"profile.name":1,"profile.lastname":1,status:1}});
                return user;
            });
            row.requests = {active:false, participation_requests:requests};
            groups.push(row);
        });
        return groups;
    }
);
UI.registerHelper("group_managenment_action",
    function(){
        return Session.get("group-managenment-action");
    }
);
Template.group_overview.helpers({
    'group_info': function(){
        var group = Session.get('group-overview');
        if(group){
            group = Groups.findOne({_id:group});
            group.owner = Meteor.users.findOne({_id:group.createdBy}, {fields:{_id:1, name:1, lastname:1}});
            group.actions = {send_request:true};
            if(User_Group.findOne({user:Meteor.userId(),group:group._id})){
                group.actions.send_request = false
            }else if (GroupRequest.findOne({user:Meteor.userId(), goup:group._id})){
                group.actions.send_request = false;
            }else if (group.request == "invite"){
                group.actions.send_request = false;
            }
        }
        return group;
    }
});
