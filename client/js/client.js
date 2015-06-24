Meteor.startup(function(){
    //Hooks.init({updateFocus:3000});
    if(Meteor.user()){
        Session.set('login', true);
        if(Meteor.user().profile.site_lang)
            Session.set('locale', Meteor.user().profile.site_lang);
        else
            //Session.set('locale', 'en_US');
            mfPkg.setLocale("en_US");
        document.title = "Mixed Languages";
        var group_handler = {} ;
        group_handler.create = {data:false};
        group_handler.find = {};
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
            {key:"akan",lang:mf("akan",null,"Akan")},
            {key:"amharic",lang:mf("amharic",null,"Amharic")},
            {key:"arabic",lang:mf("arabic",null,"Arabic")},
            {key:"assamese",lang:mf("assamese",null,"Assamese")},
            {key:"awadhi",lang:mf("awadhi",null,"Awadhi")},
            {key:"azerbaijani",lang:mf("azerbaijani",null,"Azerbaijani")},
            {key:"balochi",lang:mf("balochi",null,"Balochi")},
            {key:"belarusian",lang:mf("belarusian",null,"Belarusian")},
            {key:"bengali",lang:mf("bengali",null,"Bengali")},
            {key:"bhojpuri",lang:mf("bhojpuri",null,"Bhojpuri")},
            {key:"burmese",lang:mf("burmese",null,"Burmese")},
            {key:"cantonese",lang:mf("cantonese",null,"Cantonese")},
            {key:"cebuano",lang:mf("cebuano",null,"Cebuano")},
            {key:"chewa",lang:mf("chewa",null,"Chewa")},
            {key:"chhattisgarhi",lang:mf("chhattisgarhi",null,"Chhattisgarhi")},
            {key:"chittagonian",lang:mf("chittagonian",null,"Chittagonian")},
            {key:"czech",lang:mf("czech",null,"Czech")},
            {key:"deccan",lang:mf("deccan",null,"Deccan")},
            {key:"dhundhari",lang:mf("dhundhari",null,"Dhundhari")},
            {key:"dutch",lang:mf("dutch",null,"Dutch")},
            {key:"english",lang:mf("english",null,"English")},
            {key:"french",lang:mf("french",null,"French")},
            {key:"fula",lang:mf("fula",null,"Fula")},
            {key:"gan",lang:mf("gan",null,"Gan")},
            {key:"german",lang:mf("german",null,"German")},
            {key:"greek",lang:mf("greek",null,"Greek")},
            {key:"gujarati",lang:mf("gujarati",null,"Gujarati")},
            {key:"haitian creole",lang:mf("haitian creole",null,"Haitian Creole")},
            {key:"hakka",lang:mf("hakka",null,"Hakka")},
            {key:"haryanvi",lang:mf("haryanvi",null,"Haryanvi")},
            {key:"hausa",lang:mf("hausa",null,"Hausa")},
            {key:"hiligaynon",lang:mf("hiligaynon",null,"Hiligaynon")},
            {key:"hindi",lang:mf("hindi",null,"Hindi")},
            {key:"hmong",lang:mf("hmong",null,"Hmong")},
            {key:"hungarian",lang:mf("hungarian",null,"Hungarian")},
            {key:"igbo",lang:mf("igbo",null,"Igbo")},
            {key:"ilokano",lang:mf("ilokano",null,"Ilokano")},
            {key:"italian",lang:mf("italian",null,"Italian")},
            {key:"japanese",lang:mf("japanese",null,"Japanese")},
            {key:"javanese",lang:mf("javanese",null,"Javanese")},
            {key:"jin",lang:mf("jin",null,"Jin")},
            {key:"kannada",lang:mf("kannada",null,"Kannada")},
            {key:"kazakh",lang:mf("kazakh",null,"Kazakh")},
            {key:"khmer",lang:mf("khmer",null,"Khmer")},
            {key:"kinyarwanda",lang:mf("kinyarwanda",null,"Kinyarwanda")},
            {key:"kirundi",lang:mf("kirundi",null,"Kirundi")},
            {key:"konkani",lang:mf("konkani",null,"Konkani")},
            {key:"korean",lang:mf("korean",null,"Korean")},
            {key:"kurdish",lang:mf("kurdish",null,"Kurdish")},
            {key:"madurese",lang:mf("madurese",null,"Madurese")},
            {key:"magahi",lang:mf("magahi",null,"Magahi")},
            {key:"maithili",lang:mf("maithili",null,"Maithili")},
            {key:"malagasy",lang:mf("malagasy",null,"Malagasy")},
            {key:"malay/indonesian",lang:mf("malay/indonesian",null,"Malay/Indonesian")},
            {key:"malayalam",lang:mf("malayalam",null,"Malayalam")},
            {key:"mandarin",lang:mf("mandarin",null,"Mandarin")},
            {key:"marathi",lang:mf("marathi",null,"Marathi")},
            {key:"marwari",lang:mf("marwari",null,"Marwari")},
            {key:"min bei",lang:mf("min bei",null,"Min Bei")},
            {key:"min dong",lang:mf("min dong",null,"Min Dong")},
            {key:"min nan",lang:mf("min nan",null,"Min Nan")},
            {key:"mossi",lang:mf("mossi",null,"Mossi")},
            {key:"nepali",lang:mf("nepali",null,"Nepali")},
            {key:"oriya",lang:mf("oriya",null,"Oriya")},
            {key:"oromo",lang:mf("oromo",null,"Oromo")},
            {key:"pashto",lang:mf("pashto",null,"Pashto")},
            {key:"persian",lang:mf("persian",null,"Persian")},
            {key:"polish",lang:mf("polish",null,"Polish")},
            {key:"portuguese",lang:mf("portuguese",null,"Portuguese")},
            {key:"punjabi",lang:mf("punjabi",null,"Punjabi")},
            {key:"quechua",lang:mf("quechua",null,"Quechua")},
            {key:"romanian",lang:mf("romanian",null,"Romanian")},
            {key:"russian",lang:mf("russian",null,"Russian")},
            {key:"saraiki",lang:mf("saraiki",null,"Saraiki")},
            {key:"serbo-croatian",lang:mf("serbo-croatian",null,"Serbo-Croatian")},
            {key:"shona",lang:mf("shona",null,"Shona")},
            {key:"sindhi",lang:mf("sindhi",null,"Sindhi")},
            {key:"sinhalese",lang:mf("sinhalese",null,"Sinhalese")},
            {key:"somali",lang:mf("somali",null,"Somali")},
            {key:"spanish",lang:mf("spanish",null,"Spanish")},
            {key:"sundanese",lang:mf("sundanese",null,"Sundanese")},
            {key:"swahili",lang:mf("swahili",null,"Swahili")},
            {key:"swedish",lang:mf("swedish",null,"Swedish")},
            {key:"sylheti",lang:mf("sylheti",null,"Sylheti")},
            {key:"tagalog",lang:mf("tagalog",null,"Tagalog")},
            {key:"tamil",lang:mf("tamil",null,"Tamil")},
            {key:"telugu",lang:mf("telugu",null,"Telugu")},
            {key:"thai",lang:mf("thai",null,"Thai")},
            {key:"turkish",lang:mf("turkish",null,"Turkish")},
            {key:"ukrainian",lang:mf("ukrainian",null,"Ukrainian")},
            {key:"urdu",lang:mf("urdu",null,"Urdu")},
            {key:"uyghur",lang:mf("uyghur",null,"Uyghur")},
            {key:"uzbek",lang:mf("uzbek",null,"Uzbek")},
            {key:"vietnamese",lang:mf("vietnamese",null,"Vietnamese")},
            {key:"wu",lang:mf("wu",null,"Wu")},
            {key:"xhosa",lang:mf("xhosa",null,"Xhosa")},
            {key:"xiang",lang:mf("xiang",null,"Xiang")},
            {key:"yoruba",lang:mf("yoruba",null,"Yoruba")},
            {key:"zhuang",lang:mf("zhuang",null,"Zhuang")},
            {key:"zulu",lang:mf("zulu",null,"Zulu")},
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
    },
    'click #side_bar': function(event, template){
        $(".ui.sidebar").sidebar("toggle");
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
UI.registerHelper("isCordova", function(){return Meteor.isCordova;});
Template.layout.rendered = function(){
}
Template.popup.helpers({
    'popup': function(event, template){
        return Session.get("popup_info");
    }
})
Template.popup.rendered =  function(){
    /*$(".pop_this").popup({
        hovered: true,
        popup: "content_popup"
    });*/
    $(".popup_this").popup({inline:true});
}
Template.navbar.rendered = function(){
    $("body").on("resize",
    function(){
    /*if($("#side_bar").css("display") == "none"){
        $("#home_mixedlang").show();
        $("#home").hide();
    }else{
        $("#home_mixedlang").hide();
        $("#home").show();
    }*/});
}
