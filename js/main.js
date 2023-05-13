// import {Monthly_anime_class, Day_of_week_anime_class} from "../js/class.js";

class Monthly_anime_class {
    constructor(id, anime_name, onair, site_link) {
        this.id = id,
        this.anime_name = anime_name;
        this.onair = onair;
        this.site_link = site_link;
    }
}

class Day_of_week_anime_class {
    constructor(id, anime_name, onair, day_of_week, site_link) {
        this.id = id,
        this.anime_name = anime_name;
        this.onair = onair;
        this.day_of_week = day_of_week;
        this.site_link = site_link;
    }
}

var before_now = 999;
var site_type = "";
var class_list = [];
const day_of_week_name_pattern = /[曜日放送のテレビアニメ]/;


function monthly_list() {
    class_list = [];

    const anime_name_element_list = document.querySelectorAll('h2[id]');
    
    anime_name_element_list.forEach( element => {

        //id
        const anime_id = element.getAttribute("id");
    
        // anime name
        const anime_name = element.innerText;
    
        const table_td_list = element.nextElementSibling.querySelector("table").querySelectorAll("td");
        // onair
        const [onair] = [...table_td_list].map(e => {
            if(e.innerText == "放送スケジュール") {
                return e.nextElementSibling.innerText.replace("\n", " ");
            }
        }).filter(e => e);
    
        const link_list = element.nextElementSibling.getElementsByTagName("a");
    
        // site link
        const [site_link] = [...link_list].map(e => {
            if(e.innerText.endsWith("公式サイト")) {
                return e.origin;
            }
        }).filter(e => e);
    
    
    
        class_list.push(new Monthly_anime_class(anime_id, anime_name, onair, site_link));
        
    });
    
}

function day_of_week_list() {
    class_list = [];
    
    const week_and_name_list = document.querySelectorAll("h3.c-heading-h3, a[href*='#']:not([id]");
    
    var day_of_week = "";
    week_and_name_list.forEach((element, index) => {
        
        if(element.tagName == "H3") {
            if(element.innerText.match(day_of_week_name_pattern)) {
                day_of_week = element.innerText.slice(0, 1);
                class_list.push(day_of_week + " -----------------");
                return;
            } else {return;}
        } else if (element.tagName = "A") {

            // id
            const anime_id = element.hash.slice(1);

            // anime name
            const anime_name = element.innerText;
    
            // onair
            const hash_number = "h2[id='" + anime_id + "']";
            const onair = document.querySelector(hash_number).nextElementSibling.innerText.replace("放送局：", "");
    
            // site link
            const site_link = document.querySelector(hash_number)
            .nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling
            .getElementsByTagName("a")[0].getAttribute("href");

            class_list.push(new Day_of_week_anime_class(anime_id, anime_name, onair, day_of_week, site_link));

        }
        

    });

}

function show_anime_send() {

    const title_list = document.querySelectorAll("h2.c-heading-h2[id]");

    const show_list = [...title_list].map(element => {
        //オブジェクト上部の位置
        var objTop = element.getBoundingClientRect().top;
        
        if(window.innerHeight >= objTop && 0 < objTop) {
            return element.getAttribute("id");
        }
    }).filter(e => e);

    return show_list[0];
    
}

window.addEventListener("scroll", () => {
    if(site_type == "月別" || site_type == "曜日別") {
        const show_number_list = show_anime_send();
        if(before_now != show_number_list) send_action({type: "show_now", message: show_number_list});
        before_now = show_number_list;
    }
})


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message["type"]);
    
    switch(message["type"]) {
        case "start":
            const h1_title = document.getElementsByTagName("h1")[0].innerText;
            site_type = "";
            if(h1_title.match(/[月放送開始]/)) {
                site_type = "月別";
                monthly_list();
            } else if(h1_title.match(/[曜日別]/)) {
                console.log("曜日別");
                site_type = "曜日別";
                day_of_week_list();
            } else { break; }

            send_action({type: site_type, message: class_list});
            break;
        case "create":
            console.log(message["data"]);
            break;
    }
});

// 送信

function send_action(message) {
    chrome.runtime.sendMessage(message, () => {
        if(chrome.runtime.lastError) {}
    });
}