Template.notification.events({
	'click .acept':function(e,t){
		var element = e.target;
		var request = element.id;
		var request_type = t.find('input.request-type'+request).value;
		console.log('handler');
		console.log(request + " " + request_type);
		Meteor.call("request_handler", {request:request, type:request_type,action:1});
	},
	'click .deny':function(e,t){
		var element = e.target;
		var request = element.id;
		var request_type = t.find('input.request-type'+request).value;
		console.log('handler');
		console.log(request + " " + request_type);
		Meteor.call("request_handler", {request:request, type:request_type,action:0});
	}
});

Template.notification.rendered = function(){
	// $('#notificationModal').modal("toggle");
}