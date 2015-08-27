Template.chatrooms_side.helpers({
    find_chat_groupp: function(){
        return Session.get('group-finder');
    },
    requests:function(){
        var userId = Meteor.userId();
        var myGroupRequests = Groups.find({owner:userId},
                                          {fields:{request: 1, _id: 1, name:1}})
                                                  .fetch();
        var groupRequests = Groups.find({mod:{$in:[userId]}},
                                        {fields:{request: 1, _id: 1, name:1}})
                                                  .fetch();
        var total = myGroupRequests.length + groupRequests.length;
        var requests = {myGroup: myGroupRequests,
                        group: groupRequests,
                        total:total};
        return requests;
    }
});
UI.registerHelper("scroll_chat",
                  function(){
                      var element = document.getElementById("chat-messages");
                      if(!Session.get("chat-ready")){
                          element.scrollTop = element.scrollHeight;
                          $(".ui.accordion").accordion();
                      }
                  });
UI.registerHelper(
    "chat_ready", function()
    {
        if(Session.get("chat-ready")){
            Session.set("chat-ready", Session.get("chat-ready") -1);
        }
        return !Session.get("chat-ready");
    }
);

UI.registerHelper(
    "is_public_room", function(room)
    {
        return User_Room.findOne({room:room}).type  === "private";
    }
);

UI.registerHelper(
  "isNotPrivateChat", function(id)
  {
  //console.log(Meteor.users.findOne({_id:id}));
    return Meteor.users.findOne({_id:id}) === undefined;
  }
);
