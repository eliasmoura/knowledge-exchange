Template.chatrooms_side.helpers({
    find_chat_groupp: function(){
        return Session.get('group-finder');
    },
    requests:function(){
        var userId = Meteor.userId();
        var myGroupRequests = Groups.find({owner:userId}, {fields:{request: 1, _id: 1, name:1}}).fetch();
        var groupRequests = Groups.find({mod:{$in:[userId]}},{fields:{request: 1, _id: 1, name:1}}).fetch();
        var total = myGroupRequests.length + groupRequests.length;
        var requests = {myGroup: myGroupRequests, group: groupRequests, total:total};
        return requests;
    }
})
