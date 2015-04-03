UI.registerHelper("group_handler",
    function (){
        return Session.get("group_handler")
    }
);
UI.registerHelper("group_managenment",
    function(){
        var groupsArray = Roles.userIsInRole(Meteor.userId(),Session.get("roomid"), "group-manager");
        console.log(Session.get("roomid"));
        console.log(groupsArray);
        var room = false;
        if(groupsArray){
            var row = Groups.findOne({_id: Session.get("roomid")});
            var user_room = User_Room.findOne({user:Meteor.userId(), room:row._id, type: "group"});
            if(user_room)
                row.notification = user_room.new_messages;
            else
                row.notification = false;
            var users = User_Room.find({room:row._id}).fetch();
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
            room = row;
        }
        return room;
    }
);
UI.registerHelper("group_managenment_action",
    function(){
        return Session.get("group-managenment-action");
    }
);
Template.room_overview.helpers({
    'group_info': function(){
        var group = Session.get('group-overview');
        if(group){
            group = Groups.findOne({_id:group});
            group.owner = Meteor.users.findOne({_id:group.owner}, {fields:{_id:1, name:1, lastname:1}});
            group.actions = {send_request:true};
            if(User_Room.findOne({user:Meteor.userId(),room:group._id})){
                group.actions.send_request = false
            }else if (GroupRequest.findOne({user:Meteor.userId(), room:group._id})){
                group.actions.send_request = false;
            }else if (group.request == "invite"){
                group.actions.send_request = false;
            }
        }
        return group;
    }
});
