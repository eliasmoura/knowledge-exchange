var requestHandler = function (args){
    /*if (args.type == 1){
        var request = GroupRequest.findOne({_id:args.request});
        if(args.action == 1)
            Meteor.call("setUser_group", request,1);

        else
            GroupRequest.remove({_id:request._id});

    }else*/ 
    if (args.type == 2 || args.type == 1){
        console.log('group invite');
        var request = GroupRequest.findOne({_id:args.request});
        if(args.action == 1)
            User_Room.insert({group:request.group,user:request.user,active:false}, 
                function(error, result){
                    console.log(error);
                    if(!error){
                        //Meteor.call("setUser_activeRoom","group",User_Group.findOne({_id:result}));
                    }
            });	
        //else
            //User_Group.remove({group:group,user:user});
        console.log(request);
        GroupRequest.remove({_id:request._id});
    }else{
        var request = UserRequest.findOne({_id:args.request,request_to:Meteor.userId()});
        if(args.action == 1){
            var request = args.request;
            var relation = args.relation;
            UserRequest.update({_id:args.request},{$set:{accept:1}},function(error,docs){
                if (error) console.log(error);
                else console.log("request accepted");
            });
            console.log('add');
            
        }else{
            UsersRelations.remove({user:Meteor.userId(),contact:args.user});
            UsersRelations.remove({contact:Meteor.userId(),user:args.user});
            PrivateChat.remove({user:Meteor.userId(),contact:args.user})
            PrivateChat.remove({contact:Meteor.userId(),user:args.user})
        }
        //UserRequest.remove({_id:request._id});
    }
}
Template.notification.events({
	'click .acept':function(e,t){
		var element = e.target;
		var request = $(element).attr("[data-request-id]");
		var request_type = $(element).attr("[data-request-type]");
		requestHandler({request:request, type:request_type,action:1});
        //client.js.client.js.user.requestHandler();
        
    },
	'click .deny':function(e,t){
		var element = e.target;
		var request = $(element).attr("[data-request-id]");
		var request_type = $(element).attr("[data-request-type]");
		//var request_type = t.find('input.request-type'+request).value;
        /*    UserRequest.update({_id:request},{$set:{accept:0}},function(error,docs){
                if (error) console.log(error);
                else console.log("request accepted");
            });*/
		requestHandler({request:request, type:request_type,action:0});
	}
});

Template.notification.rendered = function(){
	// $('#notificationModal').modal("toggle");
}
UI.registerHelper("notifications", 
	function(){
		var groupsRequests_Participation = GroupRequest.find({type:1});
		var participationArray = new Array();
		var groupsRequests_Invitation = GroupRequest.find({type:2});
		var invitationsArray = new Array();

		var userFriendshipRequest = UserRequest.find({});
		var userArray = new Array();
		
		var totalRequest = groupsRequests_Invitation.count() + groupsRequests_Participation.count() + userFriendshipRequest.count();

		var emails =  Email.find({emailto:Meteor.userId(),isnew:true}).count();
		// console.log(emails);

		if(groupsRequests_Participation)
			groupsRequests_Participation.fetch().forEach(function(row){
				Meteor.call("find",{user:{_id:row.user}}, function(error,result){
					if(!error){
						
						Session.set("participationArray", result);
						//console.log(participationArray);
					}
				});
				participationArray.push({user:Session.get("participationArray"), group:row });
				
			});

		if(groupsRequests_Invitation)
			groupsRequests_Invitation.fetch().forEach(function(row){
				var group = Groups.findOne({_id:row.group});
				invitationsArray.push({group:group,request:row});
			});

		if(userFriendshipRequest)
			userFriendshipRequest.fetch().forEach(function(row){
				userArray.push({user:Meteor.users.findOne({_id: row.user}), message:row.message,request:row._id, type:row.type});
			});
		var total = totalRequest + emails;
		
		if(emails == 0) emails = false;
		if(total == 0) total = false;
		if (totalRequest == 0) totalRequest = false;
		
		return {
			requests:
				{
					participation:participationArray,
					invitation:invitationsArray,
					friendship:userArray,
					total:totalRequest
				},
			newemails:emails,
			total:total
			};
		
	}
);
UI.registerHelper("chat_notifications",
	function(){
		// console.log('test');
		var privatechatnotifications = PrivateChat.find({new_messages:{$gt:0}}).fetch();
		// console.log(privatechatnotifications);
    	/*var privatenotificationsArray = {};
    	privatechatnotifications.forEach(function(row){
    		privatenotificationsArray[row.contact] = row.new_messages;
    	});
    	console.log(privatenotificationsArray);*/
    	var user_groups = User_Room.find({user: Meteor.userId()}).fetch();
		// console.log(user_groups);
		var groupsArray = 0;
		// var groups = new Array();
		user_groups.forEach(function(row){
			if(row.new_messages > 0)
    			groupsArray = groupsArray +1;
		});
    	return privatechatnotifications.length + groupsArray;
	}
);
