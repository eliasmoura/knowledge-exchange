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
    $(".dropdown").dropdown();
    console.log($(".dropdown").attr("id"));
    // $(".sidebar").scrollable();
}
Template.chatrooms_side.events = {
	'click a.chat-room' : function(event, template){
		var room = false;
        if ($(event.target).hasClass("chat-room")){
            room = event.target.id;
        }else if ($(event.target).hasClass("chatroom-noti")){
            room = $(event.target).parent().attr("id");
        }

        if(room){
            if (Meteor.user().profile.active_room.room != room)
                Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.active_room":{type:"public",room:room}}}, function(error,docs){if(error)console.log(error)});
        }
	},'click a.chat-group' : function(event, template){
        var group = false;
        if ($(event.target).hasClass("chat-group")){
            group = event.target.id;
        }else if ($(event.target).hasClass("chatgroup-noti")){
            group = $(event.target).parent().attr("id");
        }

        if(group){
            Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.active_room":{type:"group",room:group}}}, function(error,docs){if(error)console.log(error)});
        }
		
	},'click a.friends-contacts' : function(event, template){
		var friend = false;

        if ($(event.target).hasClass("friends-contacts")){
            friend = event.target.id;
        }else if ($(event.target).hasClass("friend-contacts-noti")){
            friend = $(event.target).parent().attr("id");
        }

        if(friend){
            var friendroom = PrivateChat.findOne({users:{$in:[friend,Meteor.userId()]}})._id;
            Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.active_room":{type:"privatechat",room:friendroom}}}, function(error,docs){if(error)console.log(error)});

        }	
    },
	'click a.panel-rooms': function(e,t){
		$("#"+$(e.target).attr('data-toggle-to')).collapse('toggle');
		e.stopPropagation();
		e.preventDefault();

	},
	'click span#add-find-chat': function(e,t){
        var group_handler = Session.get("group_handler");
        group_handler.active = true;
		Session.set("group_handler", group_handler);
	},
	'click a.management':function(e,t){
        var group_handler = Session.get("group_handler");
        group_handler.active = true;
        group_handler.management.active = true;
        group_handler.find.active = false;
        group_handler.create.active = false;
        group_handler.management.group_id= e.target.id;
		Session.set('group_handler', group_handler);
	},
    'click a.quitGroup': function(event, template){
        var room =  $(event.target).parent().parent().parent().parent().attr("id");
        console.log(room);
        var user_group = User_Group.findOne({group:room, user: Meteor.userId()})._id;
        User_Group.remove({_id:user_group});
        console.log("quit");
    },
	'click span#add-find-user': function(e,t){
		Session.set("find_user", true);
		console.log('click find user');
	}
}


/*
	Chat functions
*/
Template.chat_input.events = {
	'keydown textarea#message' : function (event){
		if (event.which == 13){//enter
			//console.log(OnlineUsers.find({}));
			var message = document.getElementById('message');
			//var room = User_Chatroom.findOne({active:true, user:Meteor.userId()}).room;
			//Meteor.call("send_message",message);
			if (message.value != ''){
				//Meteor.call("send_message", message.value);
                var name = Meteor.user().profile.name;
                var lstname = Meteor.user().profile.lastname;
                var room = Meteor.user().profile.active_room;
                var userid = Meteor.userId();

                if (room.type == "public"){
                    Messages.insert({
                            name: name,
                            lstname: lstname,
                            userid: userid,
                            message: message.value,
                            room:room.room,
                            time: Date.now(),
                        });
                }
                else if (room.type == "group" ){
                    GroupChat.insert({
                            name: name,
                            lstname: lstname,
                            userid: userid,
                            message: message.value,
                            groupchat:room.room,
                            time: Date.now(),
                        });
                }	
                else if (room.type == "privatechat"){
                    PrivateMessages.insert({
                            name: name,
                            lstname: lstname,
                            userid: userid,
                            message: message.value,
                            chat:room.room,
                            time: Date.now(),
                        });
                    
                }
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
	document.title = "Chat - My site";
    $("#user_contextmenu").contextmenu({
        before: function(e, element, target){
        console.log("before");
        },
        onItem: function(context, e){
            console.log("clicked");
        }
    });
}
