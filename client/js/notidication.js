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
            User_Group.insert({group:request.group,user:request.user,owner:false,mod:false,active:false}, 
                function(error, result){
                    console.log(error);
                    if(!error){
                        //Meteor.call("setUser_activeRoom","group",User_Group.findOne({_id:result}));
                    }
                        
            });	
        else
            User_Group.remove({group:group,user:user});
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
		var request = element.id;
		var request_type = t.find('input.request-type'+request).value;
		requestHandler({request:request, type:request_type,action:1});
        //client.js.client.js.user.requestHandler();
        
    },
	'click .deny':function(e,t){
		var element = e.target;
		var request = element.id;
		var request_type = t.find('input.request-type'+request).value;
            UserRequest.update({_id:request},{$set:{accept:0}},function(error,docs){
                if (error) console.log(error);
                else console.log("request accepted");
            });

		//resquestHandler({request:request, type:request_type,action:0});
	}
});

Template.notification.rendered = function(){
	// $('#notificationModal').modal("toggle");
}
