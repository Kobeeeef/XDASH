(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7441],{67:function(){},2061:function(){},9985:function(e,t,n){var r,o;void 0!==(o="function"==typeof(r=function(){"use strict";function t(e,t,n){var r=new XMLHttpRequest;r.open("GET",e),r.responseType="blob",r.onload=function(){c(r.response,t,n)},r.onerror=function(){console.error("could not download file")},r.send()}function r(e){var t=new XMLHttpRequest;t.open("HEAD",e,!1);try{t.send()}catch(e){}return 200<=t.status&&299>=t.status}function o(e){try{e.dispatchEvent(new MouseEvent("click"))}catch(n){var t=document.createEvent("MouseEvents");t.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),e.dispatchEvent(t)}}var a="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof n.g&&n.g.global===n.g?n.g:void 0,i=a.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),c=a.saveAs||("object"!=typeof window||window!==a?function(){}:"download"in HTMLAnchorElement.prototype&&!i?function(e,n,i){var c=a.URL||a.webkitURL,s=document.createElement("a");n=n||e.name||"download",s.download=n,s.rel="noopener","string"==typeof e?(s.href=e,s.origin===location.origin?o(s):r(s.href)?t(e,n,i):o(s,s.target="_blank")):(s.href=c.createObjectURL(e),setTimeout(function(){c.revokeObjectURL(s.href)},4e4),setTimeout(function(){o(s)},0))}:"msSaveOrOpenBlob"in navigator?function(e,n,a){if(n=n||e.name||"download","string"!=typeof e){var i;navigator.msSaveOrOpenBlob((void 0===(i=a)?i={autoBom:!1}:"object"!=typeof i&&(console.warn("Deprecated: Expected third argument to be a object"),i={autoBom:!i}),i.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)?new Blob(["\uFEFF",e],{type:e.type}):e),n)}else if(r(e))t(e,n,a);else{var c=document.createElement("a");c.href=e,c.target="_blank",setTimeout(function(){o(c)})}}:function(e,n,r,o){if((o=o||open("","_blank"))&&(o.document.title=o.document.body.innerText="downloading..."),"string"==typeof e)return t(e,n,r);var c="application/octet-stream"===e.type,s=/constructor/i.test(a.HTMLElement)||a.safari,l=/CriOS\/[\d]+/.test(navigator.userAgent);if((l||c&&s||i)&&"undefined"!=typeof FileReader){var u=new FileReader;u.onloadend=function(){var e=u.result;e=l?e:e.replace(/^data:[^;]*;/,"data:attachment/file;"),o?o.location.href=e:location=e,o=null},u.readAsDataURL(e)}else{var f=a.URL||a.webkitURL,p=f.createObjectURL(e);o?o.location=p:location.href=p,o=null,setTimeout(function(){f.revokeObjectURL(p)},4e4)}});a.saveAs=c.saveAs=c,e.exports=c})?r.apply(t,[]):r)&&(e.exports=o)},7389:function(e,t,n){"use strict";n.d(t,{Z:function(){return i}});var r=n(9268),o=n(6006);let a=e=>{let t=new Date-new Date(e),n=Math.floor(t/1e3),r=Math.floor(n/31536e3);return r>1?"".concat(r," years ago"):(r=Math.floor(n/2592e3))>1?"".concat(r," months ago"):(r=Math.floor(n/86400))>1?"".concat(r," days ago"):(r=Math.floor(n/3600))>1?"".concat(r," hours ago"):(r=Math.floor(n/60))>1?"".concat(r," minutes ago"):n>=1?"".concat(n," seconds ago"):t>1?"".concat(t," milliseconds ago"):"just now"};var i=e=>{let{date:t,className:n,refresh:i=100}=e,[c,s]=(0,o.useState)("");return(0,o.useEffect)(()=>{s(a(t));let e=setInterval(()=>{s(a(t))},i);return()=>clearInterval(e)},[t,i]),(0,r.jsx)("span",{className:n,children:c})}},8671:function(e,t,n){"use strict";n.d(t,{V:function(){return a},a:function(){return i}});var r=n(9268),o=n(6006);let a=(0,o.createContext)({}),i=e=>{let{children:t}=e,[n,i]=(0,o.useState)({inputStyle:"outlined",menuMode:"static",colorScheme:"dark",theme:"lara-dark-indigo",scale:14}),[c,s]=(0,o.useState)({staticMenuDesktopInactive:!1,overlayMenuActive:!1,profileSidebarVisible:!1,configSidebarVisible:!1,staticMenuMobileActive:!1,menuHoverActive:!1}),l=()=>"overlay"===n.menuMode,u=()=>window.innerWidth>991;return(0,r.jsx)(a.Provider,{value:{layoutConfig:n,setLayoutConfig:i,layoutState:c,setLayoutState:s,onMenuToggle:()=>{l()&&s(e=>({...e,overlayMenuActive:!e.overlayMenuActive})),u()?s(e=>({...e,staticMenuDesktopInactive:!e.staticMenuDesktopInactive})):s(e=>({...e,staticMenuMobileActive:!e.staticMenuMobileActive}))},showProfileSidebar:()=>{s(e=>({...e,profileSidebarVisible:!e.profileSidebarVisible}))}},children:t})}},7537:function(e,t,n){"use strict";n.d(t,{U:function(){return a},q:function(){return i}});var r=n(9268),o=n(6006);let a=(0,o.createContext)({}),i=e=>{let{children:t,url:n}=e,[i,c]=(0,o.useState)(!1),[s,l]=(0,o.useState)(new Date),u=(0,o.useRef)(null),[f,p]=(0,o.useState)(null);return(0,o.useEffect)(()=>((function e(){console.log("Connecting to websocket"),u.current=new WebSocket(n),u.current.onopen=()=>{c(!0)},u.current.onclose=()=>(c(!1),console.log("Disconnected from websocket."),e()),u.current.onerror=e=>{console.error("WebSocket Error: ",e),u.current.close(),c(!1)}})(),()=>{u.current&&u.current.close()}),[n]),(0,o.useEffect)(()=>{l(new Date)},[i]),(0,o.useEffect)(()=>{let e=e=>{let t=JSON.parse(e.data);if("DEVICE-ERROR-LOG"===t.type){let e=JSON.parse(t.message);p(e)}};return u.current&&u.current.addEventListener("message",e),()=>{u.current.removeEventListener("message",e)}},[u.current]),(0,r.jsx)(a.Provider,{value:{isConnected:i,lastConnectionUpdate:s,sendMessageAndWaitForCondition:function(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1500;return i?(u.current.send(JSON.stringify(e)),new Promise((e,r)=>{let o=n=>{let r=JSON.parse(n.data);if(t(r)){u.current.removeEventListener("message",o),clearTimeout(a);let t=r.message;r.message=JSON.parse(t),e(r)}},a=setTimeout(()=>{u.current.removeEventListener("message",o),r(Error("Timeout: Condition not met within ".concat(n," ms")))},n);u.current.addEventListener("message",o)})):Promise.reject(Error("WebSocket is not connected"))},sendMessageTillCondition:(e,t)=>{if(!i)throw Error("WebSocket is not connected");u.current.send(JSON.stringify(e));let n=e=>{let r=JSON.parse(e.data);t(r)&&u.current.removeEventListener("message",n)};u.current.addEventListener("message",n)},listenTillCondition:e=>i?new Promise(t=>{let n=r=>{let o=JSON.parse(r.data);e(o)&&(u.current.removeEventListener("message",n),t(o))};u.current.addEventListener("message",n)}):Promise.reject(Error("WebSocket is not connected")),socket:u,latestLog:f,sendMessage:e=>{if(!i)return Error("WebSocket is not connected");u.current.send(JSON.stringify(e))}},children:t})}},6595:function(e,t){"use strict";t.Z=function(e){if(null==e||""===e.trim())return"Key cannot be null or empty.";if(e.includes(" "))return"Key cannot contain spaces.";if(e.startsWith(".")||e.endsWith("."))return"Key cannot start or end with '.'";if(e.includes(".."))return"Key cannot contain multiple consecutive '.'";let t=e.split(".");for(let e of t)if(""===e.trim())return"Key contains empty part(s).";return null}},2059:function(e,t,n){"use strict";n.d(t,{r:function(){return i}});var r=n(9985),o=n(9219);let a=(e,t)=>{Promise.resolve().then(n.t.bind(n,9985,23)).then(n=>{let o=new Blob([e],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"});(0,r.saveAs)(o,t+"_export_"+new Date().getTime()+".xlsx")})},i=(e,t)=>{let n=utils.json_to_sheet(t),r=o.cW({Sheets:{data:n},SheetNames:["data"]},{bookType:"xlsx",type:"array"});a(r,e)}},7490:function(e,t,n){"use strict";n.d(t,{k:function(){return u}});var r=n(6006),o=n(3142),a=n(6878),i=n(465),c=n(5942),s=a.V.extend({defaultProps:{__TYPE:"Chart",id:null,type:null,data:null,options:null,plugins:null,width:null,height:null,style:null,className:null,children:void 0},css:{classes:{root:function(e){var t=e.props;return(0,c.AK)("p-chart",t.className)}},inlineStyles:{root:function(e){var t=e.props;return Object.assign({width:t.width,height:t.height},t.style)}},styles:"\n        @layer primereact {\n            .p-chart {\n                position: relative\n            }\n        }\n        "}}),l=function(){try{return Chart}catch(e){return null}}(),u=r.memo(r.forwardRef(function(e,t){var c=(0,i.c)(),u=r.useContext(o.Ou),f=s.getProps(e,u),p=s.setMetaData({props:f}),d=p.ptm,m=p.cx,b=p.sx,g=p.isUnstyled;(0,a.e)(s.css.styles,g,{name:"chart"});var v=r.useRef(null),h=r.useRef(null),y=r.useRef(null),w=function(){E();var e={type:f.type,data:f.data,options:f.options,plugins:f.plugins};l?h.current=new l(y.current,e):Promise.all([n.e(804),n.e(109)]).then(n.bind(n,4096)).then(function(t){E(),y.current&&t&&(t.default?h.current=new t.default(y.current,e):h.current=new t(y.current,e))})},E=function(){h.current&&(h.current.destroy(),h.current=null)};r.useImperativeHandle(t,function(){return{props:f,getCanvas:function(){return y.current},getChart:function(){return h.current},getBase64Image:function(){return h.current.toBase64Image()},getElement:function(){return v.current},generateLegend:function(){return h.current&&h.current.generateLegend()},refresh:function(){return h.current&&h.current.update()}}}),r.useEffect(function(){w()}),(0,i.zq)(function(){E()});var S=f.options&&f.options.plugins&&f.options.plugins.title&&f.options.plugins.title.text,O=f.ariaLabel||S,j=c({id:f.id,ref:v,style:b("root"),className:m("root")},s.getOtherProps(f),d("root")),k=c({ref:y,width:f.width,height:f.height,role:"img","aria-label":O},d("canvas"));return r.createElement("div",j,r.createElement("canvas",k))}),function(e,t){return e.data===t.data&&e.options===t.options&&e.type===t.type});u.displayName="Chart"},3621:function(e,t,n){"use strict";n.d(t,{C:function(){return b}});var r=n(6006),o=n(3142),a=n(6878),i=n(465),c=n(9347),s=n(9424),l=n(5942);function u(){return(u=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function f(e){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function p(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}var d=a.V.extend({defaultProps:{__TYPE:"ToggleButton",id:null,onIcon:null,offIcon:null,onLabel:"Yes",offLabel:"No",iconPos:"left",style:null,className:null,checked:!1,tabIndex:0,tooltip:null,tooltipOptions:null,onChange:null,onFocus:null,onBlur:null,children:void 0},css:{classes:{label:"p-button-label",icon:function(e){var t=e.props,n=e.label;return(0,l.AK)("p-button-icon p-c",{"p-button-icon-left":"left"===t.iconPos&&n,"p-button-icon-right":"right"===t.iconPos&&n})},root:function(e){var t=e.props,n=e.hasIcon,r=e.hasLabel;return(0,l.AK)("p-button p-togglebutton p-component",{"p-button-icon-only":n&&!r,"p-highlight":t.checked,"p-disabled":t.disabled},t.className)}}}});function m(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}var b=r.memo(r.forwardRef(function(e,t){var n,b=r.useContext(o.Ou),g=d.getProps(e,b),v=r.useRef(null),h=function(e){if(Array.isArray(e))return e}(n=r.useState(!1))||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,o,a,i,c=[],s=!0,l=!1;try{if(a=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;s=!1}else for(;!(s=(r=a.call(n)).done)&&(c.push(r.value),c.length!==t);s=!0);}catch(e){l=!0,o=e}finally{try{if(!s&&null!=n.return&&(i=n.return(),Object(i)!==i))return}finally{if(l)throw o}}return c}}(n,2)||function(e,t){if(e){if("string"==typeof e)return p(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);if("Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return p(e,t)}}(n,2)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}(),y=h[0],w=h[1],E=d.setMetaData({props:g,state:{focused:y}}),S=E.ptm,O=E.cx,j=E.isUnstyled;(0,a.e)(d.css.styles,j,{name:"togglebutton"});var k=g.onLabel&&g.onLabel.length>0&&g.offLabel&&g.offLabel.length>0,L=g.onIcon&&g.offIcon,M=k?g.checked?g.onLabel:g.offLabel:"&nbsp;",P=g.checked?g.onIcon:g.offIcon,x=function(e){!g.disabled&&g.onChange&&g.onChange({originalEvent:e,value:!g.checked,stopPropagation:function(){e.stopPropagation()},preventDefault:function(){e.preventDefault()},target:{name:g.name,id:g.id,value:!g.checked}})};r.useImperativeHandle(t,function(){return{props:g,focus:function(){return l.p7.focusFirstElement(v.current)},getElement:function(){return v.current}}}),(0,i.nw)(function(){g.autoFocus&&l.p7.focusFirstElement(v.current)});var A=l.gb.isNotEmpty(g.tooltip),C=g.disabled?-1:g.tabIndex,N=function(){if(L){var e=(0,l.dG)({className:O("icon",{label:M})},S("icon"));return l.Cz.getJSXIcon(P,function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?m(Object(n),!0).forEach(function(t){!function(e,t,n){var r;r=function(e,t){if("object"!==f(e)||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t||"default");if("object"!==f(r))return r;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"===f(r)?r:String(r))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):m(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}({},e),{props:g})}return null}(),I=(0,l.dG)({className:O("label")},S("label")),T=(0,l.dG)({ref:v,id:g.id,className:O("root",{hasIcon:L,hasLabel:k}),style:g.style,onClick:x,onFocus:function(e){w(!0),g.onFocus&&g.onFocus(e)},onBlur:function(e){w(!1),g.onBlur&&g.onBlur(e)},onKeyDown:function(e){32===e.keyCode&&(x(e),e.preventDefault())},tabIndex:C,role:"button","aria-pressed":g.checked,"data-p-highlight":g.checked,"data-p-disabled":g.disabled},d.getOtherProps(g),S("root"));return r.createElement(r.Fragment,null,r.createElement("div",T,N,r.createElement("span",I,M),r.createElement(c.H,null)),A&&r.createElement(s.u,u({target:v,content:g.tooltip,pt:S("tooltip")},g.tooltipOptions)))}));b.displayName="ToggleButton"}}]);