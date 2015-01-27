Router.configure({
	layoutTemplate: 'layout',
	//notFoundTemplate: 'notFound',
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
                return {"title": user.profile.name + " " + user.profile.lastname, url:"/profile/:_id"+user._id};
            });
            var data = {
                "results": {
                    "category1": {
                          "name": "Users",
                          "results": users
                    },
                    "category2": {
                          "name": "Groups",
                          "results": groups
                    }
                },
                "action": {
                    "url": 'search/results/q='+search.q,
                    "text": "View all 202 results"
                          
                }
            };
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
