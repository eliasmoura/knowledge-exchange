/*Chat correction tools*/

Template.messagem_corrected_button.rendered = function(){
	var element = this.firstNode;
	var id = $(element).parent().attr('id');
	e.stopPropagation();
	e.preventDefault();
	console.log(id);
	//console.log("m "+message[0]._id);
	//console.log(Correction.find({}).fetch() );
	try{
		var cmessage = Correction.findOne({message: id},{fields:{correction:1,corrector:1}});
		var corrector = Meteor.users.findOne({_id:cmessage.corrector});
		$(element).removeClass('hide');
		$(element).popover({
			html: true,
			title: "<h4>Correction:</h4>",
			content:"<div>" +cmessage.correction+"</div><div>By: "+ corrector.profile.name+"</div>",
			placement: 'right'
		});
	}catch (e){
		console.log("correction:" + e);
		//$(element).popover('destroy');
		$(element).addClass('hide');
	}
}
/*Template.messagem_corrected_button.correction = function(){
	var element = this.firstNode;
	var id = $(element).parent().attr('id');
	var message = Messages.findOne({_id:id});
	console.log('correction:' + element);
	if(message){
		//console.log(room.room + " " + user);
		console.log('correction');
		return true;
	}														  //-1 newest on the top								 	
														 	
	return false;
}*/

Template.correctiontools.source = function(e,t){
	return Session.get("correctionSource");
}
Template.correctiontools.rendered = function(){
	$('#correctionModal').modal("toggle");
}
Template.correctiontools.events = {
	'click button#crrbutton_close': function(e,t){
		//Session.set("action", false);
		$('#correctionModal').modal("hide");
		$('#correctionModal').on('hidden.bs.modal',function(){
											Session.set("correct", false);
											Session.set("correctionSource", false);
										});
	},
	'click button#crrbutton_save': function(e,t){
		var messageId = Session.get("correctionSource")['messageId'];
		//console.log(Session.get("action"));
		var source = Session.get("correctionSource")['text'];

		var correction = $(".correction").val();
		var explanation = $(".expl").val();
		var corrector = Meteor.userId();
		var usagefor = [];
		var altfor = [];
		$('.usage-input-f').each(function(element){
			usagefor.push($(this).val());
		});
		$('.usage-input-e').each(function(element){
			//Meteor.call("usage",usagefor.shift(),$(this).val());
		});
		
		
		$('.alt-input-f').each(function(element){
			altfor.push($(this).val());
		});
		$('.alt-input-e').each(function(element){
			//Meteor.call("alternative",altfor.shift(), $(this).val());
		});

		Meteor.call("correction",correction,explanation,messageId);
		$('#correctionModal').modal("hide");
		$('#correctionModal').on('hidden.bs.modal',function(){
											Session.set("correct", false);
											Session.set("correctionSource", false);
										});
	}
}




/*Post correction tools*/