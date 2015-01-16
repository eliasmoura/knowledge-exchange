
UI.registerHelper("register_form", 
function(){
    return Session.get("register_form");
    }
);
//return the user languages
UI.registerHelper('langs_selected',
    function(lang){
        var returnArray = new Array();
        var langs = Session.get("langs");
        var fluent_langs = Meteor.user().profile.knownlanguages;
        var learning_langs = Meteor.user().profile.learninglanguages;
        var fluent_length = fluent_langs.length;
        var learning_length = learning_langs.length;
        returnArray.native = new Array();
        for (var i = 0; i < langs.length; i++){
            if (Meteor.user().profile.nativelang == langs[i]){
                returnArray.native.push({lang:langs[i], native:"selected"});
            }
            else returnArray.native.push({lang:langs[i], native:null});
        }

        returnArray.fluent = new Array();
        for (var f = 0;f < fluent_length; f++)
        {
             var fluent = new Array();
             var removable = false;
             if(fluent_length > 1){
                removable = true;
             }
             for (var i = 0; i < langs.length;i++){
                if (fluent_langs[f]==langs[i])
                {
                    fluent.push({lang:langs[i],fluent:"selected"});
                }
                else fluent.push({lang:langs[i],fluent:null});
            }
            returnArray.fluent.push({fluent:fluent,removable:removable});
        }
            
        returnArray.learning = new Array();
        for (var l = 0; l < learning_length; l++)
        {
            var learning =  new Array();
            var removable = false;
             if(learning_length > 1){
                removable = true;
             }
            for (var i = 0; i < langs.length;i++){
                if (learning_langs[l]== langs[i])
                {
                    learning.push({lang:langs[i],learning:"selected"});
                }
                else learning.push({lang:langs[i],learning:null});
            }
            returnArray.learning.push({learning:learning,removable:removable});
        }
        return returnArray;
    }
);
//user action center
UI.registerHelper("user_modal",
    function(){
        var modal_action = Session.get("user_modal_actions");
        if(Session.get("emails").send != undefined){
            var user = null;
            Meteor.call("find",{user:{_id:Session.get("emails").user}},function(error,users){
                if (users){
                    Session.set("emails",{
                        send:"active",
                        user:users
                    });
                    // console.log(Session.get("emails"));
                }
            });
        }
        if(modal_action.action =="add"){
            Meteor.call("find",{user:{_id:modal_action.user}},function(error,users){
                if (users){
                    Session.set("user_modal_actions",{
                        add:true,
                        action: "Add contact",
                        user:users.profile,
                        _id:users._id
                    });
                }else
                    console.log('error while trying to send a friendship request');
            });
        }
        if(modal_action.action =="invite"){
            Meteor.call("find",{user:{_id:modal_action.user}},function(error,users){
                if (users){

                    Session.set("user_modal_actions",{
                        group:true,
                        action: "Invite "+users.profile.name+" to:",
                        name:users.profile.name,
                        _id:users._id,
                    });
                }
            });
        }
        if(modal_action.action =="profile"){
            if(!modal_action._id)
            Meteor.call("find",{user:{_id:modal_action.user}},function(error,users){
                if (users){
                    var currentUser = false;
                    if (Meteor.userId() === users._id)
                       currentUser = true; 
                    //console.log(currentUser);
                    // console.log(users);
                    Session.set("user_modal_actions",{
                        profile:true,
                        action: users.profile.name + " " +users.profile.lastname,
                        user:users.profile,
                        _id:users._id,
                        profile_bar:true,
                        info:true,
                        currentUser:currentUser,
                        modalActive:true
                    });
                }
            });
        }
        if(modal_action.action =="report"){
            Meteor.call("find",{user:{_id:modal_action.user}},function(error,users){
                if (users){
                    Session.set("user_modal_actions",{
                        report:true,
                        action: "Report user",
                        name:users.profile.name,
                        _id:users._id,
                    });
                }
            });
        }
        if (modal_action == false){
            $("#user-modal").modal("hide");

        }
        return Session.get("user_modal_actions");
	}
);
Handlebars.registerHelper("selected", function(lang,learnglang){
    console.log(lang);
    console.log(learnglang);
});
UI.registerHelper("knownlanguages",function(){
    //console.log("select");
    //console.log(lang);
    //console.log(learninglangs);
        var userLangs = Meteor.user().profile.knownlanguages;
    for (var i = 0; i < userLangs.length; i++){
        if (lang == userLangs[i]){
            console.log("isSelected");
            return "selected";
        }
    }
    
});

