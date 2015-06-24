UI.registerHelper("modal_handler",
    function(){
        var handler = Session.get("modal-handler");
        if(handler){
            if(handler.user_overview)
                {
                    user = Meteor.users.findOne({_id:handler.user_overview._id});
                    handler.modal_header = user.profile.name + " " + user.profile.lastname;
                    handler.user_overview.data = {
                        name:handler.modal_header,
                        user:Meteor.user().profile,
                        _id:Meteor.user()._id,
                        currentUser:user._id == Meteor.userId()
                }
            }
            if(handler.email){
                //handler.email = Session.get("email");
                console.log(handler);
                handler.modal_header = "Email";
            }
            if(handler.noti){
            }
        }
        return handler;
    }
);
Template.modal_handler.rendered = function(){
    $("#modal-handler").modal();
    $("#modal-handler").modal({onHidden:function(){console.log("hidden");Session.set("modal-handler", false);}});
};
