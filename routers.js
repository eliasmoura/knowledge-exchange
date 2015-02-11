Router.configure({
	layoutTemplate: 'layout',
	notFoundTemplate: 'notFound',
	loadingTemplate: 'loading'

});

Router.route("/search",function(){
             var search =  this.params.query;
            var users = Meteor.users.find({"profile.name":{$regex: search.q, $options: 'i' }}).fetch();
            var groups = Groups.find({name:{ $regex: search.q, $options: 'i' }}).fetch();
            //Session.set("search",{users:users,groups:groups});
            groups = _.map(groups, function(group){
                return {"title":group.name, "url":"/chat/group/:_id"+group._id}
            });
            users = _.map(users, function(user){
                return {"title": user.profile.name + " " + user.profile.lastname, url:"/userprofile/"+user._id};
            });
            var search_result = {};
            var action = null;
            if(users.length > 0){
                search_result.category1 = {
                          "name": "Users",
                          "results": users
                    }
            }
            if(groups.length){
                search_result.category2 = {
                          "name": "Groups",
                          "results": groups
                    }
                }
            if((groups.length + users.length) > 10){
                action = {
                    "url": 'search/results/q='+search.q,
                    "text": "View all 202 results"
                          
                }
            }
            var data = {"results": search_result,action:action};
            console.log(data);
            console.log(search);
            this.response.writeHeader(200, {'Content-Type': 'application/json'});
            this.response.end(JSON.stringify(data));

        },
        {
            where: "server",
            name: "search",
            path: '/search',
        }
);
