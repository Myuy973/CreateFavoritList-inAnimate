(()=>{"use strict";class e{constructor(e,t,n,s){this.id=e,this.anime_name=t,this.onair=n,this.site_link=s}}class t{constructor(e,t,n,s,i){this.id=e,this.anime_name=t,this.onair=n,this.day_of_week=s,this.site_link=i}}const n=document.getElementById("start-button"),s=document.getElementById("anime-list-container"),i=document.getElementById("create-list"),o=document.getElementById("result_container"),r=document.getElementById("clipboard-copy"),a=/^http[s]*:\/\//;var c=[],l=new Map,m="";n.onclick=function(){chrome.tabs.query({active:!0,currentWindow:!0},(function(e){chrome.tabs.sendMessage(e[0].id,{type:"start"},(()=>{chrome.runtime.lastError}))}))},r.onclick=function(){var e=o.innerText;if(e){var t=e.split("\n").map((e=>a.exec(e)||"URL"===e?e+"\n":e+"\t")).join("");if(navigator.clipboard)return navigator.clipboard.writeText(t).then((function(){console.log("copy ok 1")}));tagText.select(),document.execCommand("copy"),console.log("copy ok 2")}},i.onclick=function(){r.classList.remove("clipboard-copy-hide");const n=[...s.getElementsByClassName("anime-checkbox")].map((e=>{if(e.checked)return c[parseInt(e.getAttribute("name"))]})).filter((e=>e));var i=document.getElementById("result");i&&i.remove();var a=document.createElement("div");a.setAttribute("id","result"),"曜日別"==m?n.unshift(new t(99,"タイトル","放送日","曜日","URL")):"月別"==m&&n.unshift(new e(99,"タイトル","放送日","URL")),n.forEach(((e,t)=>{var n=document.createElement("div");n.classList.add("row-anime-result");var s=document.createElement("span");if(s.innerText=e.anime_name,s.classList.add("row-anime-name"),n.insertBefore(s,null),"曜日別"==m){var i=document.createElement("span");i.innerText=e.day_of_week,i.classList.add("row-anime-day-of-week"),n.insertBefore(i,null)}var o=document.createElement("span");o.innerText=e.onair,o.classList.add("row-anime-onair"),n.insertBefore(o,null);var r=document.createElement("span");r.innerText=e.site_link,r.classList.add("row-anime-site-link"),n.insertBefore(r,null),a.insertBefore(n,null)})),o.insertBefore(a,null)},chrome.runtime.onMessage.addListener(((e,t,n)=>{if(e.message)if("show_now"==e.type){console.log(e.message),[...document.getElementsByClassName("show-now-style")].forEach((e=>{e.classList.remove("show-now-style")}));const t=l.get(e.message),n=document.getElementById("content-list").getBoundingClientRect().top;document.getElementById("content-list").scrollTop=t-n-100,console.log(t+"  "+n),document.getElementById("anime_"+e.message).classList.add("show-now-style")}else c=e.message,m=e.type,function(){var e=document.getElementById("content-list");e&&e.remove();var t=document.createElement("div");t.setAttribute("id","content-list"),s.insertBefore(t,null),c.forEach(((e,n)=>{if("string"==typeof e){const n=document.createElement("div");return n.innerText=e,n.classList.add("week-row"),void t.insertBefore(n,null)}var s=document.createElement("label");s.setAttribute("id","anime_"+e.id),s.classList.add("row-anime");var i=document.createElement("input");i.setAttribute("type","checkbox"),i.setAttribute("name",n),i.classList.add("anime-checkbox");var o=document.createElement("span");o.innerText=e.anime_name,s.insertBefore(i,null),s.insertBefore(o,null),t.insertBefore(s,null);const r=s.getBoundingClientRect().top;l.set(e.id,r)}))}()}))})();