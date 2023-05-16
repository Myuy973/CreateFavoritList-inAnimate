import {Monthly_anime_class, Day_of_week_anime_class} from "./class.js";


const start_button = document.getElementById("start-button");
const anime_list_container = document.getElementById("anime-list-container");
const create_list = document.getElementById("create-list");
const result_container = document.getElementById("result_container");
const clipboard_copy = document.getElementById("clipboard-copy");
const url_pattern = /^http[s]*:\/\//;
var anime_data = [];
var position_data = new Map();
var site_type = "";



start_button.onclick = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "start"}, () => {if(chrome.runtime.lastError) {}});
    });
};

// クリップボード　コピー
clipboard_copy.onclick = function() {

    var result_text = result_container.innerText;
    if(!result_text) return;
    
    var tab_text = result_text.split("\n").map(element => {
        if(url_pattern.exec(element) || element === "URL") return element + "\n";
        return element + "\t"
    }).join("");
    
    if (navigator.clipboard) { // navigator.clipboardが使えるか判定する
        return navigator.clipboard.writeText(tab_text).then(function () { // クリップボードへ書きむ
        //   messageActive() //メッセージを表示する
            console.log("copy ok 1");
        })
    } else {
        tagText.select() // inputタグを選択する
        document.execCommand('copy') // クリップボードにコピーする
        // messageActive() //メッセージを表示する
        console.log("copy ok 2");
      }
};


// アニメ一覧　作成
create_list.onclick = function() {

    clipboard_copy.classList.remove("clipboard-copy-hide");

    const checkbox_list = anime_list_container.getElementsByClassName("anime-checkbox");
    const checked_list = [...checkbox_list].map(element => {
        if(element.checked) {
            return anime_data[parseInt(element.getAttribute("name"))];
        }
    }).filter(e => e);
    
    // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //     chrome.tabs.sendMessage(tabs[0].id, {message: "create", data: checked_list}, () => {});
    // });

    var before_result = document.getElementById("result");
    if(before_result) before_result.remove();

    // result container
    var result = document.createElement("div");
    result.setAttribute("id", "result");


    // result 中身追加
    if(site_type == "曜日別") {
        checked_list.unshift(new Day_of_week_anime_class(99, "タイトル", "放送日", "曜日", "URL"));
    } else if(site_type == "月別") {
        checked_list.unshift(new Monthly_anime_class(99, "タイトル", "放送日", "URL"));
    }
    checked_list.forEach((element, index) => {

        var row_anime_result = document.createElement("div");
        row_anime_result.classList.add("row-anime-result");

        // name
        var name_span = document.createElement("span");
        name_span.innerText = element.anime_name;
        name_span.classList.add("row-anime-name");
        row_anime_result.insertBefore(name_span, null);


        // onair
        if(site_type == "曜日別") {
            var day_of_week_span = document.createElement("span");
            day_of_week_span.innerText = element.day_of_week;
            day_of_week_span.classList.add("row-anime-day-of-week");
            row_anime_result.insertBefore(day_of_week_span, null);
        }
        var onair_span = document.createElement("span");
        onair_span.innerText = element.onair;
        onair_span.classList.add("row-anime-onair");
        row_anime_result.insertBefore(onair_span, null);

        
        // link
        var site_link_span = document.createElement("span");
        site_link_span.innerText = element.site_link;
        site_link_span.classList.add("row-anime-site-link");
        row_anime_result.insertBefore(site_link_span, null);


        result.insertBefore(row_anime_result, null);
    });


    result_container.insertBefore(result, null);

};

function add_anime_element() {
    var before_list = document.getElementById("content-list");
    if(before_list) before_list.remove();

    // container
    var content_list = document.createElement("div");
    content_list.setAttribute("id", "content-list");
    anime_list_container.insertBefore(content_list, null);

    // 中身追加
    anime_data.forEach((element, index) => {

        if(typeof element === "string") {
            const week_row = document.createElement("div");
            week_row.innerText = element;
            week_row.classList.add("week-row");
            content_list.insertBefore(week_row, null);
            return;
        }
        
        // laabel
        var row_anime = document.createElement("label");
        row_anime.setAttribute("id", "anime_" + element.id);
        row_anime.classList.add("row-anime");

        // checkbox 
        var checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("name", index);
        checkbox.classList.add("anime-checkbox");

        //title
        var title_span = document.createElement("span");
        title_span.innerText = element.anime_name;
        row_anime.insertBefore(checkbox, null);
        row_anime.insertBefore(title_span, null);

        // row 追加
        content_list.insertBefore(row_anime, null);

        const position = row_anime.getBoundingClientRect().top;
        position_data.set(element.id, position);
        
    });
    // console.log(position_data);

}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if(message["message"]) {

        if(message["type"] == "show_now") {

            console.log(message["message"]);
            
            const before_element = document.getElementsByClassName("show-now-style");
            [...before_element].forEach(e => {
                e.classList.remove("show-now-style");
            });

            const element_position = position_data.get(message["message"]);
            const container = document.getElementById("content-list");
            const container_position = container.getBoundingClientRect().top;
            document.getElementById("content-list").scrollTop = element_position - container_position - 100;
            
            console.log(element_position + "  " + container_position);

            const current_element = document.getElementById("anime_" + message["message"]);
            current_element.classList.add("show-now-style");

        } else {
            anime_data = message["message"];
            site_type = message["type"];
            add_anime_element();
        }
        
    }


});