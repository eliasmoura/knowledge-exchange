/**
*    Templates
**/

/**Meteor.autorun(function() {
    // Whenever this session variable changes, run this function.
    var message = Session.get('displayMessage');
    if (message) {
      var stringArray = message.split('&amp;');
      Meteor.ui.notify(stringArray[0], stringArray[1])
        .effect('slide')
        .closable();

      Session.set('displayMessage', null);
    }
  });**/
Meteor.startup(function(){
    Hooks.init({updateFocus:3000});
    if(Meteor.user()){
        Session.set('login', true);
        if(Meteor.user().profile.site_lang)
            Session.set('locale', Meteor.user().profile.site_lang);
        else
            Session.set('locale', 'en_US');
    }
    else
        Session.set('locale', 'en_US');
    
    Session.set('group-finder', false);
    Session.set("login",true);
    Session.set("add_ser",false);
    Session.set("user_modal_actions",false);
    Session.set("langs",[
            {lang:mf("akan",null,"Akan")},
            {lang:mf("amharic",null,"Amharic")},
            {lang:mf("arabic",null,"Arabic")},
            {lang:mf("assamese",null,"Assamese")},
            {lang:mf("awadhi",null,"Awadhi")},
            {lang:mf("azerbaijani",null,"Azerbaijani")},
            {lang:mf("balochi",null,"Balochi")},
            {lang:mf("belarusian",null,"Belarusian")},
            {lang:mf("bengali",null,"Bengali")},
            {lang:mf("bhojpuri",null,"Bhojpuri")},
            {lang:mf("burmese",null,"Burmese")},
            {lang:mf("cantonese",null,"Cantonese")},
            {lang:mf("cebuano",null,"Cebuano")},
            {lang:mf("chewa",null,"Chewa")},
            {lang:mf("chhattisgarhi",null,"Chhattisgarhi")},
            {lang:mf("chittagonian",null,"Chittagonian")},
            {lang:mf("czech",null,"Czech")},
            {lang:mf("deccan",null,"Deccan")},
            {lang:mf("dhundhari",null,"Dhundhari")},
            {lang:mf("dutch",null,"Dutch")},
            {lang:mf("english",null,"English")},
            {lang:mf("french",null,"French")},
            {lang:mf("fula",null,"Fula")},
            {lang:mf("gan",null,"Gan")},
            {lang:mf("german",null,"German")},
            {lang:mf("greek",null,"Greek")},
            {lang:mf("gujarati",null,"Gujarati")},
            {lang:mf("haitian creole",null,"Haitian Creole")},
            {lang:mf("hakka",null,"Hakka")},
            {lang:mf("haryanvi",null,"Haryanvi")},
            {lang:mf("hausa",null,"Hausa")},
            {lang:mf("hiligaynon",null,"Hiligaynon")},
            {lang:mf("hindi",null,"Hindi")},
            {lang:mf("hmong",null,"Hmong")},
            {lang:mf("hungarian",null,"Hungarian")},
            {lang:mf("igbo",null,"Igbo")},
            {lang:mf("ilokano",null,"Ilokano")},
            {lang:mf("italian",null,"Italian")},
            {lang:mf("japanese",null,"Japanese")},
            {lang:mf("javanese",null,"Javanese")},
            {lang:mf("jin",null,"Jin")},
            {lang:mf("kannada",null,"Kannada")},
            {lang:mf("kazakh",null,"Kazakh")},
            {lang:mf("khmer",null,"Khmer")},
            {lang:mf("kinyarwanda",null,"Kinyarwanda")},
            {lang:mf("kirundi",null,"Kirundi")},
            {lang:mf("konkani",null,"Konkani")},
            {lang:mf("korean",null,"Korean")},
            {lang:mf("kurdish",null,"Kurdish")},
            {lang:mf("madurese",null,"Madurese")},
            {lang:mf("magahi",null,"Magahi")},
            {lang:mf("maithili",null,"Maithili")},
            {lang:mf("malagasy",null,"Malagasy")},
            {lang:mf("malay/indonesian",null,"Malay/Indonesian")},
            {lang:mf("malayalam",null,"Malayalam")},
            {lang:mf("mandarin",null,"Mandarin")},
            {lang:mf("marathi",null,"Marathi")},
            {lang:mf("marwari",null,"Marwari")},
            {lang:mf("min bei",null,"Min Bei")},
            {lang:mf("min dong",null,"Min Dong")},
            {lang:mf("min nan",null,"Min Nan")},
            {lang:mf("mossi",null,"Mossi")},
            {lang:mf("nepali",null,"Nepali")},
            {lang:mf("oriya",null,"Oriya")},
            {lang:mf("oromo",null,"Oromo")},
            {lang:mf("pashto",null,"Pashto")},
            {lang:mf("persian",null,"Persian")},
            {lang:mf("polish",null,"Polish")},
            {lang:mf("portuguese",null,"Portuguese")},
            {lang:mf("punjabi",null,"Punjabi")},
            {lang:mf("quechua",null,"Quechua")},
            {lang:mf("romanian",null,"Romanian")},
            {lang:mf("russian",null,"Russian")},
            {lang:mf("saraiki",null,"Saraiki")},
            {lang:mf("serbo-croatian",null,"Serbo-Croatian")},
            {lang:mf("shona",null,"Shona")},
            {lang:mf("sindhi",null,"Sindhi")},
            {lang:mf("sinhalese",null,"Sinhalese")},
            {lang:mf("somali",null,"Somali")},
            {lang:mf("spanish",null,"Spanish")},
            {lang:mf("sundanese",null,"Sundanese")},
            {lang:mf("swahili",null,"Swahili")},
            {lang:mf("swedish",null,"Swedish")},
            {lang:mf("sylheti",null,"Sylheti")},
            {lang:mf("tagalog",null,"Tagalog")},
            {lang:mf("tamil",null,"Tamil")},
            {lang:mf("telugu",null,"Telugu")},
            {lang:mf("thai",null,"Thai")},
            {lang:mf("turkish",null,"Turkish")},
            {lang:mf("ukrainian",null,"Ukrainian")},
            {lang:mf("urdu",null,"Urdu")},
            {lang:mf("uyghur",null,"Uyghur")},
            {lang:mf("uzbek",null,"Uzbek")},
            {lang:mf("vietnamese",null,"Vietnamese")},
            {lang:mf("wu",null,"Wu")},
            {lang:mf("xhosa",null,"Xhosa")},
            {lang:mf("xiang",null,"Xiang")},
            {lang:mf("yoruba",null,"Yoruba")},
            {lang:mf("zhuang",null,"Zhuang")},
            {lang:mf("zulu",null,"Zulu")},
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
        $("#navbar-nav").removeClass("in")
    }
})

Hooks.onGainFocus = function () {
    if(Meteor.user() && Meteor.user().profile.default_status == "online")
        Meteor.users.update({_id:Meteor.userId()},{$set:{"profile.status":"online"}});
}

Hooks.onLoseFocus = function () {
    console.log('lose focus');
    if(Meteor.user() && Meteor.user().profile.default_status == "online")
        Meteor.users.update({_id:Meteor.userId()},{$set:{"profile.status":"away"}});
}

UI.registerHelper(
    "lang_list", function(){
        return Session.get("langs");
    }
)
/*
Template.dsdsd.dsds = function(e,t){
	UsersRelations.insert(
		{user:"A2EggWM4y9LQKPba6",userrelation:["ddxhhoTQsH9LuafHn","F"]});
}*/