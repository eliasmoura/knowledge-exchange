UI.registerHelper("modal_handler", 
    function(){
        var handler = Session.get("modal-handler");
        return handler;
    }
);
Template.modal_handler.rendered = function(){
    $("#modal-handler").modal();
};
