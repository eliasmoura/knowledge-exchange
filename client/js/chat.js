$("#chat-messages").click(function(){
  console.log($("#chat-messages").scrollTop());
  console.log($("#chat-messages").offsetHeight);
  });

Template.chatrooms_side.rendered = function(){
    if($("#seide_bar").css("display") != "none"){
        //$(".ui.sidebar").sidebar("setting","transition","push");
        //$(".ui.sidebar").sidebar("hide");
    }
    if(!Meteor.user()){
        //$(".ui.sidebar").sidebar("hide");
    }
};
Template.chatrooms_side.events = {
    'click a.chat-room' : function(event, template){
        var room = false;
        var group_handler = {active: false};
    },'click a.chat-group' : function(event, template){
        var group = false;
        var group_handler = {active: false};
    },'click a.friends-contacts' : function(event, template){
    },
    'click a.panel-rooms': function(e,t){
        $("#"+$(e.target).attr('data-toggle-to')).collapse('toggle');
        e.stopPropagation();
        e.preventDefault();

    },
    'click button#add-group': function(e,t){
        var group_handler = {active: true, create:{active:'active'}};
        Session.set("group_handler", group_handler);
        Router.go("CreateGroup");
    },
    'click a.manage-group':function(e,t){
        var group_handler = Session.get("group_handler");
        var isGroup = event.currentTarget.id;
        group_handler.active = true;
        group_handler.management.active = true;
        group_handler.create.active = false;
        group_handler.management.group_id= isGroup;
        Session.set('modal_handler', group_handler);
    },
    'click a.quitGroup': function(event, template){
        var room =  currentEvent.target.id;
        console.log(room);
        var user_group = User_Room.findOne({room:room, type: "group",user: Meteor.userId()})._id;
        User_Room.remove({_id:user_group});
        console.log("quit");
    },
    'click span#add-find-user': function(e,t){
        Session.set("find_user", true);
        console.log('click find user');
    }
}
Template.chatrooms.rendered = function(){
    $(".ui.tabular.menu").tab();
}
Template.chatrooms.events({
    'click #create-group-send': function(event, template){
        $("#create_group").submit();
    },
    'click #create-group-cancel': function(event, template){
        Session.set("group_handler", {active: false});
    },
    'click #room-manage': function(event, template){
        var room_handler = Session.get("room_handler");
        room_handler.manage.active = "active";
        room_handler.chat.active = false;
        room_handler.create.active = false;
        room_handler.settings.active = false;
        room_handler.overview.active = false;
        Session.set("room_handler", room_handler);
    },
    'click #room-chat': function(event, template){
        var room_handler = Session.get("room_handler");
        room_handler.create.active = false;
        room_handler.manage.active = false;
        room_handler.chat.active = "active";
        room_handler.settings.active = false;
        room_handler.overview.active = false;
        Session.set("room_handler", room_handler);
    },
    'click #room-settings': function(event, template){
        var room_handler = Session.get("room_handler");
        room_handler.create.active = false;
        room_handler.manage.active = false;
        room_handler.chat.active = false;
        room_handler.settings.active = "active";
        room_handler.overview.active = false;
        Session.set("room_handler", room_handler);
    },
    'click #room-overview': function(event, template){
        var room_handler = Session.get("room_handler");
        room_handler.create.active = false;
        room_handler.manage.active = false;
        room_handler.chat.active = false;
        room_handler.settings.active = false;
        room_handler.overview.active = "active";
        Session.set("room_handler", room_handler);
    },
    'click a#quitGroup': function(event, template){
        var room =  event.currentTarget.id;
        room = User_Room.findOne({room:Session.get("roomid"), type: "group",user: Meteor.userId()});
        if(room !== undefined)
            if(room.type === "group"){
                var user_group = room._id;
                User_Room.remove({_id:user_group}, function(error){
                                    Router.go('Chatrooms');
                });

                console.log("quit");
            }
    },
    'scroll #chat-messages': function(event, template){
    console.log(event.currentTarget.offsetHeight);
    }
});
UI.registerHelper(
    "room_handler", function()
    {
        var room_handler = Session.get("room_handler");
        if(room_handler.overview !== undefined){
            if(room_handler.overview.active && room_handler.chat.active &&
               User_Room.findOne({room:Session.get("roomid"),user:Meteor.userId()}) ||
               (room_handler.overview.active && room_handler.settings.active)){
                room_handler.overview.active = false;
            }
        }
        return room_handler;
    }
);

/*
 Chat functions
 */
Template.chat_input.events = {
    'keydown textarea#message' : function (event, template){
        if(event.keyCode == 16)
          Session.set("isShiftDown", true);
        if (event.which == 13 && !Session.get("isShiftDown")){//enter
            var element = event.currentTarget.value;
            if (element != ''){
                var name = Meteor.user().profile.name;
                var lstname = Meteor.user().profile.lastname;
                var userid = Meteor.userId();
                var message = element.replace(/^\s+|\s+$/g, '');
                Messages.insert({
                    name: name,
                    lstname: lstname,
                    owner: userid,
                    message: message,
                    room:Session.get("roomid"),
                    type: Session.get("roomtype"),
                    time: Date.now()
                });
                event.currentTarget.value = '';
                //message.value = '';
            }
        }
    },
    'keyup textarea#message': function(event, template){
      if(event.keyCode == 16)
        Session.set("isShiftDown", false);
    //console.log(event.keyCode == 16);
    }
};
Template.chat.events = {
    'click button.correctionWraper': function(e,t){
        //console.log('test');
        var elementClass = $(e.target).attr("class");
        if(elementClass.indexOf("ok") == -1){
            //$(e.target).popover('show');
            //$(e.target).addClass( "ok")
        }
    },
    'click li.message': function(event, template){
        var element = event.currentTarget;
        Session.set("correct_message", element.id);
    }
};
Template.chat.created = function(){
    var started = false;
    /*    var element = document.getElementById("chat-messages");
     Messages.find({room:Session.get("roomid")}).observe({
     added: function(doc){
     if(started){
     element.scrollTop = element.scrollHeight;
     console.log(element);
     }
     }
     });*/
    Session.set("chat-ready", Messages.find({room:Session.get("roomid")}).count() + 1);
    //    element.scrollTop = element.scrollHeight;
    started = true;
};
Template.chat.rendered = function(){
    //    var element = document.getElementById("chat-messages");
    //    element.scrollTop = element.scrollHeight;
    //    Session.set("chat-ready". true);
    $(".ui.accordion").accordion();
};
Template.registerHelper("menu_options",
                                Tracker.autorun(function(css_check){
                                    var options = null;
                                    if ($("#home_home").css("display") == "none"){
                                        options = "four wide column";
                                        $("#side_bar").css("display", "none");
                                    }else{
                                        options = "left fixe inverted thin sidebar";
                                        $("#side_bar").css("display", "inline-block");
                                    }
                                    Session.set("menu-options", options);
                            return Session.get("menu-options");
                                })
                       );
