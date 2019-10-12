(window.webpackJsonpdocs=window.webpackJsonpdocs||[]).push([[0],{13:function(e,t,a){},14:function(e,t,a){"use strict";a.r(t);a(7);var n=a(0),r=a.n(n),l=a(5),c=a(2),u=a.n(c),i=a(3),s=a(1),o=(a(13),".###Z.csv".length),m=function(){var e=Object(n.useState)([]),t=Object(s.a)(e,2),a=t[0],l=t[1],c=Object(n.useState)(null),m=Object(s.a)(c,2),f=m[0],d=m[1],E=Object(n.useState)(""),p=Object(s.a)(E,2),h=p[0],g=p[1];Object(n.useEffect)((function(){Object(i.a)(u.a.mark((function e(){var t,a,n;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("data/index.log");case 2:return t=e.sent,e.next=5,t.text();case 5:a=e.sent,n=a.split("\n").slice(0,-1).map((function(e){return{state:"ready",fileName:e}})),l(n),n.length>0&&d(n.length-1);case 9:case"end":return e.stop()}}),e)})))()}),[]),Object(n.useEffect)((function(){function e(e){return t.apply(this,arguments)}function t(){return(t=Object(i.a)(u.a.mark((function e(t){var n,r,c,i,o;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("ready"===(n=a[t]).state){e.next=3;break}return e.abrupt("return");case 3:return l(a.map((function(e,a){return a===t?{state:"loading",fileName:e.fileName}:e}))),e.prev=4,e.next=7,fetch("data/"+n.fileName);case 7:return c=e.sent,e.next=10,c.text();case 10:i=e.sent,o=i.split("\n").slice(1,-1).map((function(e){var t=e.split(";"),a=Object(s.a)(t,3),n=a[0],r=a[1],l=a[2];return{id:n,name:r,stars:Number(l)}})),r={state:"success",fileName:n.fileName,items:o},e.next=18;break;case 15:e.prev=15,e.t0=e.catch(4),r={state:"error",fileName:n.fileName,error:e.t0};case 18:l(a.map((function(e,a){return a===t?r:e})));case 19:case"end":return e.stop()}}),e,null,[[4,15]])})))).apply(this,arguments)}null!==f&&(e(f),f>0&&e(f-1),f<a.length-1&&e(f+1))}),[f,a]);var b=Object(n.useState)(),v=Object(s.a)(b,2),N=(v[0],v[1]),j=function(e){var t=e.currentTarget.dataset,a=t.id,n=t.name;if(void 0===a||void 0===n)throw new Error("ID and name must be passed!");localStorage.getItem(a)?localStorage.removeItem(a):localStorage.setItem(a,n),N(Date.now)};function w(e,t,a){if("ready"===e.state||"loading"===e.state)return"Loading\u2026";if("error"===e.state)return"Error!";var n=e.items.findIndex((function(e){return e.id===t.id})),l=e.items[n];if(!l)return"No match";var c=t.stars-l.stars,u=Math.abs(c),i=Math.sign(c)>0;return r.a.createElement(r.a.Fragment,null,r.a.createElement("code",null,i||a?"+":"-"),u," (",l.stars,")")}return r.a.createElement("div",null,r.a.createElement("button",{onClick:function(e){null!==f&&d(f>0?f-1:a.length-1)}},"\u2190"),r.a.createElement("select",{onChange:function(e){d(Number(e.currentTarget.value))},value:f||void 0},a.map((function(e,t){return r.a.createElement("option",{key:e.fileName,value:t},e.fileName.slice(0,-o))}))),r.a.createElement("button",{onClick:function(e){null!==f&&d(f<a.length-1?f+1:0)}},"\u2192"),r.a.createElement("input",{placeholder:"\ud83d\udd0d",value:h,onChange:function(e){g(e.currentTarget.value)}}),function(){if(null===f)return"No record is selected";var e=a[f];if("ready"===e.state)return"Selected "+e.fileName;if("loading"===e.state)return"Loading "+e.fileName+"\u2026";if("error"===e.state)return e.error.message;var t=f>0?a[f-1]:null,n=f<a.length-1?a[f+1]:null;return r.a.createElement("table",null,r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null),r.a.createElement("th",null,"#"),r.a.createElement("th",null,"ID"),r.a.createElement("th",null,"Name"),r.a.createElement("th",null,"Stars"),r.a.createElement("th",null,"Gap"),t&&r.a.createElement("th",null,t.fileName.slice(0,-o)),n&&r.a.createElement("th",null,n.fileName.slice(0,-o)))),r.a.createElement("tbody",null,e.items.map((function(a,l){return a.name.toUpperCase().includes(h.toUpperCase())&&r.a.createElement("tr",{key:a.id,className:localStorage.getItem(a.id)?"\u2605":"\u2606"},r.a.createElement("td",null,r.a.createElement("button",{"data-id":a.id,"data-name":a.name,onClick:j},localStorage.getItem(a.id)?"\u2605":"\u2606")),r.a.createElement("td",{id:String(l+1)},r.a.createElement("a",{href:"#"+String(l+1)},l+1)),r.a.createElement("td",null,a.id),r.a.createElement("td",{id:a.name},r.a.createElement("a",{href:"#"+a.name},a.name)),r.a.createElement("td",null,a.stars),r.a.createElement("td",null,function(e,t){if(0===t)return null;var a,n=e[t];do{a=e[--t]}while(t>0&&(void 0===a||a.stars===n.stars));return a.stars-n.stars}(e.items,l)),t&&r.a.createElement("td",null,w(t,a,!0)),n&&r.a.createElement("td",null,w(n,a,!1)))}))))}())};Object(l.render)(r.a.createElement(m,null),document.getElementById("root"))},6:function(e,t,a){e.exports=a(14)},7:function(e,t,a){}},[[6,1,2]]]);
//# sourceMappingURL=main.49a7c079.chunk.js.map