Template.chat.rendered = function(){
    $('body').ready(function(){
		$("#testediv").css('height',0);
	    $("#testediv").css('height',$('#layout').height() - $('.chat-input').height() - $('.chat-input').height() *1.1);
    });
	$(window).resize(function(){
        $("#testediv").css('height',0);
        $("#testediv").css('height',$('#layout').height() - $('.chat-input').height() - $('.chat-input').height() *1.1);
    });
}
Template.chatrooms_side.rendered = function(){
	$('body').ready(function(){
		$(".sidebar").css('height',0);
	    $(".sidebar").css('height',$('#layout').height() * 0.8);
    });
	$(window).resize(function(){
        $(".sidebar").css('height',0);
        $(".sidebar").css('height',$('#layout').height() * 0.8);
    });
    // $(".sidebar").scrollable();
}
Template.chatrooms_side.events = {
	'click a.chat-room' : function(event, template){
		var room = event.target.id;
		//$(event.target).popover();
		//var user_room = User_Chatroom.findOne({room:room,user:user});
		Meteor.call('setRoom_active',room);
		//console.log(user_room);
			
	},'click a.chat-group' : function(event, template){
		var group = event.target.id;
		Meteor.call('setGroup_active',group);

	},'click a.friends-contacts' : function(event, template){
		var friend = event.target.id;
		Meteor.call('setFriend_active',friend);
	},
	'click a.panel-rooms': function(e,t){
		$("#"+$(e.target).attr('data-toggle-to')).collapse('toggle');
		e.stopPropagation();
		e.preventDefault();
		console.log('collapse');

	},
	'click span#add-find-chat': function(e,t){
        var group_handler = Session.get("group_handler");
        if(!group_handler)
        {
            group_handler = {} ;
            group_handler.create = {data:false};
            group_handler.find = {}
            group_handler.find.active = true;
            group_handler.find.data = false;
            group_handler.management = {data:false};
        }
        group_handler.active = true;
		Session.set("group_handler", group_handler);
		//Session.set("find-create-group", true)
	},
	'click span.conf':function(e,t){
		Session.set('group_handler', {management:e.target.id});
	},
	'click span#add-find-user': function(e,t){
		Session.set("find_user", true);
		console.log('click find user');
	}
}
/*Template.chatrooms_side_xs.events = {
	'click a.roombutton' : function(event){
		var room = event.target.id;
		// $(event.target).popover();
		var user = Meteor.userId();
		Session.set("currentRoom", room);
		var user_room = User_Chatroom.findOne({room:room, user:user});
		if (!user_room & user != null){
			User_Chatroom.insert({room:room,
			user:user,active:true});
			Session.set("currentRoom", room);
		}
		else if (!user_room['active']){
			User_Chatroom.update({_id:user_room['_id']}, {$set:{active: true}});
			Session.set("currentRoom", room);
		}
	},
	'click .chatrooms': function(e,t){
		$("#panel-rooms").collapse('toggle');
		e.stopPropagation();

	}
}*/
Template.chatrooms_side.find_chat_group = function(){return Session.get('group-finder');}
Template.chatrooms_side.requests = function(){
	var userId = Meteor.userId();
	var myGroupRequests = Groups.find({owner:userId}, {fields:{request: 1, _id: 1, name:1}}).fetch();
	var groupRequests = Groups.find({mod:{$in:[userId]}},{fields:{request: 1, _id: 1, name:1}}).fetch();
	var total = myGroupRequests.length + groupRequests.length;
	var requests = {myGroup: myGroupRequests, group: groupRequests, total:total};
	return requests;
}

var menu = [{
        name: 'Profile',
        //img: 'images/create.png',
        title: 'create button',
        fun: function (user) {
            console.log(user);
            Session.set("user_modal_actions", {action:"profile", user:user});
        }
                            
    }, {
        name: 'Email',
        //img: 'images/update.png',
        title: 'update button',
        onOpen: function(data, event){
            console.log(data);
        },
        fun: function () {
               // console.log($(this).parent().parent().parent());
        }
                            
    }, {
        name: 'Add to Contacts',
        //img: 'images/delete.png',
        title: 'create button',
        fun: function () {
                    alert('i am add button');
        }
                            
    }, {
        name: "Chat",
        //img: "",
        title: "Invite to private chat",
        fun: function (){}
    }, {
        name: "Invite to a Group",
        //img: "",
        title: "Invite user to a Group",
        fun: function(){}
    }, {
        name: "Remove",
        //img: "",
        title: "Remove contact",
        fun: function(){}
    }, {
        name: "block",
        //img: "",
        title: "Block user",
        fun: function(){}

    }, {
        name: "Report",
        //img: "",
        title: "Report user",
        fun: function(){}
    }
    
];

Template.users_chatroom.events = {
    'click .username': function(event, template){
        var menu = [{
                name: 'Profile',
                //img: 'images/create.png',
                title: 'create button',
                fun: function (user) {
                    console.log(user);
                    Session.set("user_modal_actions", {action:"profile",user: user});
                }
                                    
            }          
        ];
        console.log(Meteor.userId());
        console.log(event.target.id);
        if(Meteor.userId() != event.target.id){
           //if(Meteor.user().profile.blocked_users.indexOf(event.target.id) != -1){
            if(!Meteor.users.find({_id:Meteor.userId(), "profile.blocked_users":{$in: [event.target.id]}}).count()){
               menu = menu.concat([
                   {
                        name: 'Email',
                        //img: 'images/update.png',
                        title: 'Send an Email',
                        fun: function () {
                               // console.log($(this).parent().parent().parent());
                        }
                                            
                    }]);
                if (!UsersRelations.findOne({contact:event.target.id})){
                    menu = menu.concat([{
                        name: 'Add to Contacts',
                        //img: 'images/delete.png',
                        title: 'Add user to your Contacts',
                        fun: function () {
                                    alert('i am add button');
                        }
                                            
                    }]);
                }else{
                    menu = menu.concat([
                    {
                        name: "Remove",
                        //img: "",
                        title: "Remove user from your Contacts",
                        fun: function(){}
                    }, {
                        name: "Chat",
                        //img: "",
                        title: "Invite user to a private chat",
                        fun: function (){}
                    }, {
                        name: "Group",
                        //img: "",
                        title: "Invite user to a Group",
                        fun: function(){}
                    }, {
                        name: "block",
                        //img: "",
                        title: "Block user",
                        fun: function(){}

                    }, {
                        name: "Report",
                        //img: "",
                        title: "Report user",
                        fun: function(){}
                    }
                ]);
                }
                
           }else {
            menu = menu.concat([{name:"Umblock",
                //img: "",
                title:"Umblock user",
                fun:function(){}}]);
           }
        }
        menu = $(event.target).contextMenu('menu',menu,{containment:window});
        console.log(menu);
    }
}

/*Template.users_chatroom.rendered = function() {
    $(".username").contextMenu(menu);
}*/

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
                        User_Group.find({group:room.room, active:false}).forEach(function(row){
                            User_Group.update({_id:row._id},{$inc:{new_messages:1}});
                            console.log('setting inc group');
                        })
                }	
                else if (room.type == "privatechat"){
                    var privatechat = PrivateChat.findOne({_id:room.room});
                    var privatechat_2 = PrivateChat.findOne({user:privatechat.contact, contact:privatechat.user});
                    var privatechats = [privatechat._id, privatechat_2._id];
                    var messageiD = PrivateMessages.insert({
                            name: name,
                            lstname: lstname,
                            userid: userid,
                            message: message.value,
                            chat:privatechats,
                            time: Date.now(),
                        });
                    if (!privatechat.active || !privatechat_2.active){
                        PrivateChat.find({_id:{$in: privatechats}, active:false}).forEach(function(row){
                            PrivateChat.update({_id:row._id},{$inc:{new_messages:1}},{multi:true});
                            console.log('setting inc');
                        })
                                        
                    }
                }

				document.getElementById('message').value = '';
				message.value = '';
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
		/*$(e.target).popover({trigger:"manual"});
		$('.correctionWraper').popover('hide');
		$(".correctionWraper").on('hidden.bs.popover', function(){
			$(e.target).popover("show");
		})*/
		

		//var button = e.target;
		
	}
}
Template.chat.rendered = function(){
	document.title = "Chat - My site";
}
/*$(function(){
    $.contextMenu({
    	trigger: "right",
        selector: '.message', 
        callback: function(key, options) {
        	console.log("correction");
        	console.log($(this));
            if (key == "correction") {
            	var text = $(this).contents().filter(
            		function(){return this.nodeType === 3;}).text();
            	Session.set("correct", true);
            	$('#correctionModal').modal("show");
            	Session.set("correctionSource", {messageId:$(this).attr("id"),text:text});
            	//$('#correctionModal').modal("show");
            }
        },
        items: {
            "edit": {name: " Edit", icon: "edit glyphicon glyphicon-pencil"},
            // "cut": {name: "Cut", icon: "cut"},
            "copy": {name: " Copy", icon: "copy"},
            // "paste": {name: "Paste", icon: "paste"},
            "delete": {name: " Delete", icon: "delete glyphicon glyphicon-trash"},
            "correction": {name: " Correction",icon: "correction glyphicon glyphicon-ok"},
            // "sep1": "---------",
            // "quit": {name: "Quit", icon: "quit"}
        }
    });
    
    $('.message').on('click', function(e){
        console.log('clicked', this);
    })
})
Template.chatrooms.correct = function(e,t){
	return Session.get("correct");
}*/

/*$(document).click(function(e) {
    // Check for click on the popup itself
    $('.popover').click(function() {
        return false; // Do nothing
    });  
    // Clicking on document other than popup then hide the popup
    $('.pop').popover('hide');  
});*/

