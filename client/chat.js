
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
		console.log('collapse');

	},
	'click span#add-find-chat': function(e,t){
		Session.set("group-finder", true);
		Session.set("find-create-group", true)
	},
	'click span.conf':function(e,t){
		Session.set('group-conf', e.target.id);
	},
	'click span#add-find-user': function(e,t){
		Session.set("user_finder", true);
	}
}
Template.chatrooms_side_xs.events = {
	'click a.roombutton' : function(event){
		var room = event.target.id;
		$(event.target).popover();
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
}
Template.chatrooms_side.find_chat_group = function(){return Session.get('group-finder');}
Template.chatrooms_side.requests = function(){
	var userId = Meteor.userId();
	var myGroupRequests = Groups.find({owner:userId}, {fields:{request: 1, _id: 1, name:1}}).fetch();
	var groupRequests = Groups.find({mod:{$in:[userId]}},{fields:{request: 1, _id: 1, name:1}}).fetch();
	var total = myGroupRequests.length + groupRequests.length;
	var requests = {myGroup: myGroupRequests, group: groupRequests, total:total};
	return requests;
}
Template.group_chat_finder.find = function(){ return Session.get("find-group");}

Template.group_chat_finder.rendered = function(){
	console.log('add group');
	Session.set("find-group", true);
	$('#group-chat-finder-modal').modal();
	$("#group-chat-finder-modal").on('hidden.bs.modal', function(){
		Session.set('group-finder', false);
		Session.set('groups-found', false);
	})
}
Template.group_chat_finder.events({
	'click a.find-create': function(e,t){
		var element = e.target;
		$('.find-create').removeClass("active");
		console.log(element.id );
		$(element).addClass('active');
		if (element.id == "find"){
			Session.set("find-group", true);
			$("#find-create-btn").val("Find");
			
		}else{
			Session.set("find-group", false);
			$("#find-create-btn").val("Create");
		}
	},
	'submit form#find-create-form': function(e,t){
		e.preventDefault();
		if(Session.get('find-group')){
			var groupname = t.find('#group-name-f').value;
			if (groupname.length < 4){
				return false;
			}
			var groups = Groups.find( { name: { $regex: groupname, $options: 'i' } } ).fetch();
			groups.forEach(function(row){
				var owner = row.owner;
				row.owner = Meteor.users.findOne({_id:owner});

			});
			Session.set('groups-found',groups);
		}else{
			var groupname = t.find("#group-name-c").value;
			if(groupname != ""){
				var details = t.find("#description").value;
				var members = new Array();
				try{
					t.find(".member").each(function(){
					members.push(this.value);
					});	
				}catch(e){}
				
				var langs = t.findAll(".lang");
				var languages = new Array();
				langs.each(function(){
					languages.push($(this).option);
				});
				Meteor.call("create_group", groupname,details,languages, members);
			}
			$('#group-chat-finder-modal').modal('hide');	
		}
	},
	'click input#find-create-btn':function(e,t){
		$('form#find-create-form').submit();
	},
	'keypress input#group-name-f':function(event, template){
		var group = event.target.value;
		if (group.length > 2){
			$('form#find-create-form').submit();
		}
	}
});

Template.create_group.langs = function(){
	return Languages.find({},{$sort: {name: +1}});
}
Template.find_group.created =function(){
	Session.set('groups-found', false);
}
Template.find_group.group = function(){
	return Session.get('groups-found');
}
Template.find_group.events({
	'click span.send-request': function(event, template){
		var groupId = event.target.id;
		console.log('prepering the request');
		var group = Groups.findOne({_id:groupId});
		var message = 'Some thing to say :)';
		if (group){
			Meteor.call("participation_request", group._id, message);
			console.log('request sent');
		}
		else console.log('request not sent');
	}
});
/*
	User finder
*/
Template.user_finder.rendered = function(){
	console.log('add user');
	$('#user-finder-modal').modal();
	$("#user-finder-modal").on('hidden.bs.modal', function(){
		Session.set('user-finder', false);
	})
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
				Meteor.call("send_message", message.value);

				document.getElementById('message').value = '';
				message.value = '';
			}
		}
	}
}
Template.chat.correction = function(){

}

Template.chat.events = {
	'click button.correctionWraper': function(e,t){
		//console.log('test');
		//$('.correctionWraper').popover('hide');
		//$(e.target).popover('show');
		//var button = e.target;
		
	}
}

$(function(){
    $.contextMenu({
        selector: '.message', 
        callback: function(key, options) {
            if (key == "correction") {
            	var text = $(this).contents().filter(
            		function(){return this.nodeType === 3;}).text();
            	Session.set("correct", true);
            	Session.set("correctionSource", {messageId:$(this).attr("id"),text:text});
            	//$('#correctionModal').modal("show");
            }
        },
        items: {
            "edit": {name: "Edit", icon: "edit"},
            "cut": {name: "Cut", icon: "cut"},
            "copy": {name: "Copy", icon: "copy"},
            "paste": {name: "Paste", icon: "paste"},
            "delete": {name: "Delete", icon: "delete"},
            "correction": {name: "Correction",icon: "correction"},
            "sep1": "---------",
            "quit": {name: "Quit", icon: "quit"}
        }
    });
    
    $('.message').on('click', function(e){
        console.log('clicked', this);
    })
})
Template.chatrooms.correct = function(e,t){
	return Session.get("correct");
}

/*$(document).click(function(e) {
    // Check for click on the popup itself
    $('.popover').click(function() {
        return false; // Do nothing
    });  
    // Clicking on document other than popup then hide the popup
    $('.pop').popover('hide');  
});*/

