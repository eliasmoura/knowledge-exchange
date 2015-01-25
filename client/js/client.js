Meteor.startup(function(){
    //Hooks.init({updateFocus:3000});
    if(Meteor.user()){
        Session.set('login', true);
        if(Meteor.user().profile.site_lang)
            Session.set('locale', Meteor.user().profile.site_lang);
        else
            Session.set('locale', 'en_US');
        document.title = "Mixed Languages";
        var group_handler = {} ;
        group_handler.create = {data:false};
        group_handler.find = {}
        group_handler.find.active = false;
        group_handler.find.data = false;
        group_handler.management = {data:false};
        group_handler.active = false;
		Session.set('group_handler', group_handler);
        Session.set("group-overview", false);
    }
    else
        Session.set('locale', 'en_US');
    
    Session.set('group-finder', false);
    Session.set("login",true);
    Session.set("add_ser",false);
    Session.set("user_modal_actions",false);
    Session.set("emails", false);
    Session.set("langs",[
            mf("akan",null,"Akan"),
            mf("amharic",null,"Amharic"),
            mf("arabic",null,"Arabic"),
            mf("assamese",null,"Assamese"),
            mf("awadhi",null,"Awadhi"),
            mf("azerbaijani",null,"Azerbaijani"),
            mf("balochi",null,"Balochi"),
            mf("belarusian",null,"Belarusian"),
            mf("bengali",null,"Bengali"),
            mf("bhojpuri",null,"Bhojpuri"),
            mf("burmese",null,"Burmese"),
            mf("cantonese",null,"Cantonese"),
            mf("cebuano",null,"Cebuano"),
            mf("chewa",null,"Chewa"),
            mf("chhattisgarhi",null,"Chhattisgarhi"),
            mf("chittagonian",null,"Chittagonian"),
            mf("czech",null,"Czech"),
            mf("deccan",null,"Deccan"),
            mf("dhundhari",null,"Dhundhari"),
            mf("dutch",null,"Dutch"),
            mf("english",null,"English"),
            mf("french",null,"French"),
            mf("fula",null,"Fula"),
            mf("gan",null,"Gan"),
            mf("german",null,"German"),
            mf("greek",null,"Greek"),
            mf("gujarati",null,"Gujarati"),
            mf("haitian creole",null,"Haitian Creole"),
            mf("hakka",null,"Hakka"),
            mf("haryanvi",null,"Haryanvi"),
            mf("hausa",null,"Hausa"),
            mf("hiligaynon",null,"Hiligaynon"),
            mf("hindi",null,"Hindi"),
            mf("hmong",null,"Hmong"),
            mf("hungarian",null,"Hungarian"),
            mf("igbo",null,"Igbo"),
            mf("ilokano",null,"Ilokano"),
            mf("italian",null,"Italian"),
            mf("japanese",null,"Japanese"),
            mf("javanese",null,"Javanese"),
            mf("jin",null,"Jin"),
            mf("kannada",null,"Kannada"),
            mf("kazakh",null,"Kazakh"),
            mf("khmer",null,"Khmer"),
            mf("kinyarwanda",null,"Kinyarwanda"),
            mf("kirundi",null,"Kirundi"),
            mf("konkani",null,"Konkani"),
            mf("korean",null,"Korean"),
            mf("kurdish",null,"Kurdish"),
            mf("madurese",null,"Madurese"),
            mf("magahi",null,"Magahi"),
            mf("maithili",null,"Maithili"),
            mf("malagasy",null,"Malagasy"),
            mf("malay/indonesian",null,"Malay/Indonesian"),
            mf("malayalam",null,"Malayalam"),
            mf("mandarin",null,"Mandarin"),
            mf("marathi",null,"Marathi"),
            mf("marwari",null,"Marwari"),
            mf("min bei",null,"Min Bei"),
            mf("min dong",null,"Min Dong"),
            mf("min nan",null,"Min Nan"),
            mf("mossi",null,"Mossi"),
            mf("nepali",null,"Nepali"),
            mf("oriya",null,"Oriya"),
            mf("oromo",null,"Oromo"),
            mf("pashto",null,"Pashto"),
            mf("persian",null,"Persian"),
            mf("polish",null,"Polish"),
            mf("portuguese",null,"Portuguese"),
            mf("punjabi",null,"Punjabi"),
            mf("quechua",null,"Quechua"),
            mf("romanian",null,"Romanian"),
            mf("russian",null,"Russian"),
            mf("saraiki",null,"Saraiki"),
            mf("serbo-croatian",null,"Serbo-Croatian"),
            mf("shona",null,"Shona"),
            mf("sindhi",null,"Sindhi"),
            mf("sinhalese",null,"Sinhalese"),
            mf("somali",null,"Somali"),
            mf("spanish",null,"Spanish"),
            mf("sundanese",null,"Sundanese"),
            mf("swahili",null,"Swahili"),
            mf("swedish",null,"Swedish"),
            mf("sylheti",null,"Sylheti"),
            mf("tagalog",null,"Tagalog"),
            mf("tamil",null,"Tamil"),
            mf("telugu",null,"Telugu"),
            mf("thai",null,"Thai"),
            mf("turkish",null,"Turkish"),
            mf("ukrainian",null,"Ukrainian"),
            mf("urdu",null,"Urdu"),
            mf("uyghur",null,"Uyghur"),
            mf("uzbek",null,"Uzbek"),
            mf("vietnamese",null,"Vietnamese"),
            mf("wu",null,"Wu"),
            mf("xhosa",null,"Xhosa"),
            mf("xiang",null,"Xiang"),
            mf("yoruba",null,"Yoruba"),
            mf("zhuang",null,"Zhuang"),
            mf("zulu",null,"Zulu"),
        ]);
});

$('html').click(function(){
	//console.log('test');
	//$("[data-toggle=popover]").popover('hide');
})

Template.post.events = {
	'click input.topt': function(e,t){
        var element = e.target;
        //mfPkg.setLocale='pt_BR';
        //mfPkg.setLocale('pt_BR');
        Session.set('locale', 'pt_BR');
        Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.default_status":status}});
        
    },
    'click input.toen': function(e,t){
        var element = e.target;
        //mfPkg.setLocale='pt_BR';
        //mfPkg.setLocale('pt_BR');
        Session.set('locale', 'en_US');
        
    },
    'click input.clean': function(e,t){
        Meteor.call("clean_db");
    }
}
Template.navbar.events({
    'click .navigation': function(e,t){
        //$("#navbar-nav").removeClass("in")
    }
})
/*
Hooks.onGainFocus = function () {
    if(Meteor.user() && Meteor.user().profile.default_status == "online")
        Meteor.users.update({_id:Meteor.userId()},{$set:{"profile.status":"online"}});
}

Hooks.onLoseFocus = function () {
    if(Meteor.user() && Meteor.user().profile.default_status == "online")
        Meteor.users.update({_id:Meteor.userId()},{$set:{"profile.status":"away"}});
}
*/
UI.registerHelper(
    "lang_list", function(){
        return Session.get("langs");
    }
)
