/*Template.chat.rendered = function(){
    $('body').ready(function(){
		$("#testediv").css('height',0);
	    $("#testediv").css('height',$('#layout').height() - $('.chat-input').height() - $('.chat-input').height() *1.1);
    });
	$(window).resize(function(){
        $("#testediv").css('height',0);
        $("#testediv").css('height',$('#layout').height() - $('.chat-input').height() - $('.chat-input').height() *1.1);
    });
}*/
Template.chatrooms_side.rendered = function(){
/*	$('body').ready(function(){
		$(".sidebar").css('height',0);
	    $(".sidebar").css('height',$('#layout').height() * 0.8);
    });
	$(window).resize(function(){
        $(".sidebar").css('height',0);
        $(".sidebar").css('height',$('#layout').height() * 0.8);
    });
*/
    if($("#seide_bar").css("display") != "none"){
        //$(".ui.sidebar").sidebar("setting","transition","push");
        //$(".ui.sidebar").sidebar("hide");
    }
    if(!Meteor.user()){
        //$(".ui.sidebar").sidebar("hide");
    }
    // $(".sidebar").scrollable();
}
Template.chatrooms_side.events = {
	'click a.chat-room' : function(event, template){
		var room = false;
        var group_handler = {active: false};
		Session.set("group_handler", group_handler);

        /*if ($(event.target).hasClass("chat-room")){
            room = event.target.id;
        }else if ($(event.target).hasClass("chatroom-noti")){
            room = $(event.target).parent().attr("id");
        }
        if(room){
            if (Meteor.user().profile.active_room.room != room)
                Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.active_room":{type:"public",room:room}}}, 
                        function(error,docs){
                            if(error)
                                console.log(error)
                            else{
                                Session.set("group_handler", {active: false});
                                $(".ui.sidebar").sidebar("toggle");
                            }
                        });
        }*/
	},'click a.chat-group' : function(event, template){
        var group = false;
        var group_handler = {active: false};
		Session.set("group_handler", group_handler);
        /*if ($(event.target).hasClass("chat-group")){
            group = event.target.id;
        }else if ($(event.target).hasClass("chatgroup-noti")){
            group = $(event.target).parent().attr("id");
        }

        if(group){
            Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.active_room":{type:"group",room:group}}}, 
                    function(error,docs){
                        if(error)console.log(error)
                        else{
                            $(".ui.sidebar").sidebar("toggle");
                            Session.set("group_handler", {active: false});
                        }
                    });
        }*/
		
	},'click a.friends-contacts' : function(event, template){
		var friend = false;

        if ($(event.target).hasClass("friends-contacts")){
            friend = event.target.id;
        }else if ($(event.target).hasClass("friend-contacts-noti")){
            friend = $(event.target).parent().attr("id");
        }

        if(friend){
            var friendroom = PrivateChat.findOne({users:{$in:[friend,Meteor.userId()]}})._id;
            Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.active_room":{type:"privatechat",room:friendroom}}}, 
                    function(error,docs){
                        if(error)console.log(error)
                        else{
                            $(".ui.sidebar").sidebar("toggle");
                            Session.set("group_handler", {active: false});
                        }
                    });

        }	
    },
	'click a.panel-rooms': function(e,t){
		$("#"+$(e.target).attr('data-toggle-to')).collapse('toggle');
		e.stopPropagation();
		e.preventDefault();

	},
	'click button#add-group': function(e,t){
        var group_handler = {active: true};
		Session.set("group_handler", group_handler);
        Router.go("/chat");
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
        var room =  $(event.target).parent().parent().parent().parent().attr("id");
        console.log(room);
        var user_group = User_Room.findOne({group:room, type: "group",user: Meteor.userId()})._id;
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
        var room_handler = {manage:{active:"active"}};
        room_handler.chat = {active:false};
        room_handler.settings = {active:false};
        room_handler.overview = {active:false};
        Session.set("room_handler", room_handler);
    },
    'click #room-chat': function(event, template){
        var room_handler = {};
        room_handler.manage = {active:false};
        room_handler.chat = {active:"active"};
        room_handler.settings = {active:false};
        room_handler.overview = {active:false};
        Session.set("room_handler", room_handler);
    },
    'click #room-settings': function(event, template){
        var room_handler = {};
        room_handler.manage = {active:false};
        room_handler.chat = {active:false};
        room_handler.settings = {active:"active"};
        room_handler.overview = {active:false};
        Session.set("room_handler", room_handler);
    },
    'click #room-overview': function(event, template){
        var room_handler = {};
        room_handler.manage = {active:false};
        room_handler.chat = {active:false};
        room_handler.settings = {active:false};
        room_handler.overview = {active:"active"};
        Session.set("room_handler", room_handler);
    }
})
UI.registerHelper("room_handler",
    function(){

        return Session.get("room_handler");
    }
)

/*
	Chat functions
*/
Template.chat_input.events = {
	'keydown textarea#message' : function (event){
		if (event.which == 13){//enter
			var message = document.getElementById('message');
			if (message.value != ''){
                var name = Meteor.user().profile.name;
                var lstname = Meteor.user().profile.lastname;
                var userid = Meteor.userId();
                Messages.insert({
                        name: name,
                        lstname: lstname,
                        owner: userid,
                        message: message.value,
                        room:Session.get("roomid"),
                        type: Session.get("roomtype"),
                        time: Date.now(),
                    });
				document.getElementById('message').value = null;
				//message.value = '';
			}
		}
	}
}
Template.chat.events = {
	'click button.correctionWraper': function(e,t){
		//console.log('test');
		var elementClass = $(e.target).attr("class");
		if(elementClass.indexOf("ok") == -1){
			$(e.target).popover('show');
			$(e.target).addClass( "ok")
		}
	}
}
Template.chat.rendered = function(){

}
Template.registerHelper("menu_options", 
    function(){
       var css_check = $("#home_home").css("display");
        $("body").ready(function(){
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
            });
        });
        return Session.get("menu-options");
    }
);
