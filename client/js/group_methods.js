UI.registerHelper("group_handler",
    function (){
        return Session.get("group_handler")
    }
);
UI.registerHelper("group_managenment",
    function(room){
        var groupsArray = Roles.userIsInRole(Meteor.userId(), "group-manager",room);
        var room = false;
        if(groupsArray){
            var row = Groups.findOne({_id: Session.get("roomid")});
            if(Session.get("group-managenment-action"))
            if(Session.get("group-managenment-action").edit)
                row.edit = {active:true};
            else
                row.manageusers = {active:true};
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

            var participationRequests = Requests.find({group:row._id, type:"participation"}).fetch();
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
UI.registerHelper("isGenreChecked",
    function(group, genre){
        if(_.indexOf(Groups.findOne({_id:group}).focus,genre) !== -1)
            return "checked";
        else
            return "";
    }
);

UI.registerHelper("isTypeSelected",
    function(group, type){
        if(Groups.findOne({_id:group}).type === type)
            return "selected";
        else
            return "";
    }
);
UI.registerHelper("isSelected",
    function(left, right){
        return left === right? "selected" : "";
    }
);
UI.registerHelper("roomLanguages",
    function(group){
        return _.map(Groups.findOne({_id:group}).languages, function(row){
            return {selectedLang:row};});
    }
);
UI.registerHelper("group_managenment_action",
    function(){
        return Session.get("group-managenment-action");
    }
);
UI.registerHelper("group_notification",
    function(setting){
        var group_settings = User_Room.findOne({_id:Session.get("roomid")},{fields:{settings:1}});
        if(group_settings !== undefined)
            return group_settings[setting];
        return false;
    }
                 );
UI.registerHelper("group_settings", function(args){
    var user_room = User_Room.findOne({room:Session.get("roomid"),
                                       user:Meteor.userId()});

    if(args ==undefined)
        args = {setting:"",value:""};
    else
        args = args.hash;
    var setting = args.setting;
    var value = args.value;
    if(setting === "notification" && user_room !== undefined){
        var settings = {};
        if(user_room.settings === undefined){
            var settings ={
                notification:{
                    muted:false,
                    threshold:0,
                    any:true,
                    direct:false
                }
            };
            User_Room.update({_id:user_room._id},{$set:{settings:settings}});
            user_room = User_Room.findOne({room:Session.get("roomid"),
                                      user:Meteor.userId()});
        }
        settings = user_room.settings;
        if(value === "muted")
            return settings.notification.muted;
        if(value  === "threshold")
          if(parseInt(settings.notification.threshold, 10) > 0)
            return settings.notification.threshold;
        if(value === "any")
            return settings.notification.any;
        if(value === "direct")
            return settings.notification.direct;
    }
    return false;
});
UI.registerHelper("room_info",
    function(room){
        var group = Groups.findOne({_id:room});
        if(group !== undefined){
            group.owner = Meteor.users.findOne({_id:group.owner}, {fields:{_id:1, "profile.name":1, "profile.lastname":1}});
            group.actions = {send_request:true};
            if(User_Room.findOne({user:Meteor.userId(),room:group._id})){
                group.actions.send_request = false;
            }else if (GroupRequest.findOne({user:Meteor.userId(), room:group._id})){
                group.actions.send_request = false;
            }else if (group.request == "invite"){
                group.actions.send_request = false;
            }
            if(group.type === "indication"){
                group.actions.send_request = false;
            }
        }
        return group;
    }
);
UI.registerHelper("numberLangs", function(){
  return Session.get("numberLangs");
});
