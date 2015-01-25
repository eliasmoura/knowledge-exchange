Template.search.events({
    'keydown input#search':function(event,template){
		if (event.which == 13){//enter
        event.preventDefault()
        event.stopPropagation();
        }
        var search =  event.target.value;
        if (search.length > 0){
            var users = Meteor.users.find({"profile.name":{$regex: search, $options: 'i' }}).fetch();
            var groups = Groups.find({name:{ $regex: search, $options: 'i' }}).fetch();
            Session.set("search",{users:users,groups:groups});
            $("#search").dropdown();
        }
    }
});
Template.search.rendered = function(){
}
UI.registerHelper("search_results", function(){
    return Session.get("search");
});
Template.search_results.events({
    'click .list-group-item':function(event, template){
        event.preventDefault();
        event.stopPropagation();
        var type = event.target.name;
        if (type== "user"){
            Session.set("profile", event.target.id);
            Router.go("userprofile", {_id:event.target.id});
        }else if (type == "group"){
            Session.set("group-overview", event.target.id);
            Session.set("modal-handler", {group_overview:{active:true}});
            $("#modal-handler").modal("show");
        }
    }
})
