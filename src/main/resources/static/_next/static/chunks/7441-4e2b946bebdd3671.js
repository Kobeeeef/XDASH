(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7441],{67:function(){},2061:function(){},9985:function(e,t,n){var o,r;void 0!==(r="function"==typeof(o=function(){"use strict";function t(e,t,n){var o=new XMLHttpRequest;o.open("GET",e),o.responseType="blob",o.onload=function(){c(o.response,t,n)},o.onerror=function(){console.error("could not download file")},o.send()}function o(e){var t=new XMLHttpRequest;t.open("HEAD",e,!1);try{t.send()}catch(e){}return 200<=t.status&&299>=t.status}function r(e){try{e.dispatchEvent(new MouseEvent("click"))}catch(n){var t=document.createEvent("MouseEvents");t.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),e.dispatchEvent(t)}}var a="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof n.g&&n.g.global===n.g?n.g:void 0,i=a.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),c=a.saveAs||("object"!=typeof window||window!==a?function(){}:"download"in HTMLAnchorElement.prototype&&!i?function(e,n,i){var c=a.URL||a.webkitURL,l=document.createElement("a");n=n||e.name||"download",l.download=n,l.rel="noopener","string"==typeof e?(l.href=e,l.origin===location.origin?r(l):o(l.href)?t(e,n,i):r(l,l.target="_blank")):(l.href=c.createObjectURL(e),setTimeout(function(){c.revokeObjectURL(l.href)},4e4),setTimeout(function(){r(l)},0))}:"msSaveOrOpenBlob"in navigator?function(e,n,a){if(n=n||e.name||"download","string"!=typeof e){var i;navigator.msSaveOrOpenBlob((void 0===(i=a)?i={autoBom:!1}:"object"!=typeof i&&(console.warn("Deprecated: Expected third argument to be a object"),i={autoBom:!i}),i.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)?new Blob(["\uFEFF",e],{type:e.type}):e),n)}else if(o(e))t(e,n,a);else{var c=document.createElement("a");c.href=e,c.target="_blank",setTimeout(function(){r(c)})}}:function(e,n,o,r){if((r=r||open("","_blank"))&&(r.document.title=r.document.body.innerText="downloading..."),"string"==typeof e)return t(e,n,o);var c="application/octet-stream"===e.type,l=/constructor/i.test(a.HTMLElement)||a.safari,s=/CriOS\/[\d]+/.test(navigator.userAgent);if((s||c&&l||i)&&"undefined"!=typeof FileReader){var u=new FileReader;u.onloadend=function(){var e=u.result;e=s?e:e.replace(/^data:[^;]*;/,"data:attachment/file;"),r?r.location.href=e:location=e,r=null},u.readAsDataURL(e)}else{var f=a.URL||a.webkitURL,p=f.createObjectURL(e);r?r.location=p:location.href=p,r=null,setTimeout(function(){f.revokeObjectURL(p)},4e4)}});a.saveAs=c.saveAs=c,e.exports=c})?o.apply(t,[]):o)&&(e.exports=r)},7389:function(e,t,n){"use strict";n.d(t,{Z:function(){return i}});var o=n(9268),r=n(6006);let a=e=>{let t=new Date-new Date(e),n=Math.floor(t/1e3),o=Math.floor(n/31536e3);return o>1?"".concat(o," years ago"):(o=Math.floor(n/2592e3))>1?"".concat(o," months ago"):(o=Math.floor(n/86400))>1?"".concat(o," days ago"):(o=Math.floor(n/3600))>1?"".concat(o," hours ago"):(o=Math.floor(n/60))>1?"".concat(o," minutes ago"):n>=1?"".concat(n," seconds ago"):t>1?"".concat(t," milliseconds ago"):"just now"};var i=e=>{let{date:t,className:n}=e,[i,c]=(0,r.useState)("");return(0,r.useEffect)(()=>{c(a(t));let e=setInterval(()=>{c(a(t))},100);return()=>clearInterval(e)},[t]),(0,o.jsx)("span",{className:n,children:i})}},8671:function(e,t,n){"use strict";n.d(t,{V:function(){return a},a:function(){return i}});var o=n(9268),r=n(6006);let a=(0,r.createContext)({}),i=e=>{let{children:t}=e,[n,i]=(0,r.useState)({inputStyle:"outlined",menuMode:"static",colorScheme:"dark",theme:"lara-dark-indigo",scale:14}),[c,l]=(0,r.useState)({staticMenuDesktopInactive:!1,overlayMenuActive:!1,profileSidebarVisible:!1,configSidebarVisible:!1,staticMenuMobileActive:!1,menuHoverActive:!1}),s=()=>"overlay"===n.menuMode,u=()=>window.innerWidth>991;return(0,o.jsx)(a.Provider,{value:{layoutConfig:n,setLayoutConfig:i,layoutState:c,setLayoutState:l,onMenuToggle:()=>{s()&&l(e=>({...e,overlayMenuActive:!e.overlayMenuActive})),u()?l(e=>({...e,staticMenuDesktopInactive:!e.staticMenuDesktopInactive})):l(e=>({...e,staticMenuMobileActive:!e.staticMenuMobileActive}))},showProfileSidebar:()=>{l(e=>({...e,profileSidebarVisible:!e.profileSidebarVisible}))}},children:t})}},7537:function(e,t,n){"use strict";n.r(t),n.d(t,{WebSocketProvider:function(){return i},WebsocketContext:function(){return a}});var o=n(9268),r=n(6006);let a=(0,r.createContext)({}),i=e=>{let{children:t,url:n}=e,[i,c]=(0,r.useState)(!1),[l,s]=(0,r.useState)(new Date),u=(0,r.useRef)(null);return(0,r.useEffect)(()=>((function e(){console.log("Connecting to websocket"),u.current=new WebSocket(n),u.current.onopen=()=>{c(!0)},u.current.onclose=()=>(c(!1),console.log("Disconnected from websocket."),e()),u.current.onerror=e=>{console.error("WebSocket Error: ",e),u.current.close(),c(!1)}})(),()=>{u.current&&u.current.close()}),[n]),(0,r.useEffect)(()=>{s(new Date)},[i]),(0,o.jsx)(a.Provider,{value:{isConnected:i,lastConnectionUpdate:l,sendMessageAndWaitForCondition:function(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1500;return i?(u.current.send(JSON.stringify(e)),new Promise((e,o)=>{let r=n=>{let o=JSON.parse(n.data);if(t(o)){u.current.removeEventListener("message",r),clearTimeout(a);let t=o.message;o.message=JSON.parse(t),e(o)}},a=setTimeout(()=>{u.current.removeEventListener("message",r),o(Error("Timeout: Condition not met within ".concat(n," ms")))},n);u.current.addEventListener("message",r)})):Promise.reject(Error("WebSocket is not connected"))}},children:t})}},6595:function(e,t){"use strict";t.Z=function(e){if(null==e||""===e.trim())return"Key cannot be null or empty.";if(e.includes(" "))return"Key cannot contain spaces.";if(e.startsWith(".")||e.endsWith("."))return"Key cannot start or end with '.'";if(e.includes(".."))return"Key cannot contain multiple consecutive '.'";let t=e.split(".");for(let e of t)if(""===e.trim())return"Key contains empty part(s).";return null}},2059:function(e,t,n){"use strict";n.d(t,{r:function(){return i}});var o=n(9985),r=n(9219);let a=(e,t)=>{Promise.resolve().then(n.t.bind(n,9985,23)).then(n=>{let r=new Blob([e],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"});(0,o.saveAs)(r,t+"_export_"+new Date().getTime()+".xlsx")})},i=(e,t)=>{let n=r.P6.json_to_sheet(t),o=r.default.write({Sheets:{data:n},SheetNames:["data"]},{bookType:"xlsx",type:"array"});a(o,e)}},7490:function(e,t,n){"use strict";n.d(t,{k:function(){return u}});var o=n(6006),r=n(3142),a=n(465),i=n(5942),c=n(6878),l=c.V.extend({defaultProps:{__TYPE:"Chart",id:null,type:null,data:null,options:null,plugins:null,width:null,height:null,style:null,className:null,children:void 0},css:{classes:{root:function(e){var t=e.props;return(0,i.AK)("p-chart",t.className)}},inlineStyles:{root:function(e){var t=e.props;return Object.assign({width:t.width,height:t.height},t.style)}},styles:"\n        @layer primereact {\n            .p-chart {\n                position: relative\n            }\n        }\n        "}}),s=function(){try{return Chart}catch(e){return null}}(),u=o.memo(o.forwardRef(function(e,t){var u=o.useContext(r.Ou),f=l.getProps(e,u),p=l.setMetaData({props:f}),d=p.ptm,b=p.cx,m=p.sx,v=p.isUnstyled;(0,c.e)(l.css.styles,v,{name:"chart"});var g=o.useRef(null),h=o.useRef(null),y=o.useRef(null),w=function(){E();var e={type:f.type,data:f.data,options:f.options,plugins:f.plugins};s?h.current=new s(y.current,e):Promise.all([n.e(804),n.e(109)]).then(n.bind(n,4096)).then(function(t){E(),y.current&&t&&(t.default?h.current=new t.default(y.current,e):h.current=new t(y.current,e))})},E=function(){h.current&&(h.current.destroy(),h.current=null)};o.useImperativeHandle(t,function(){return{props:f,getCanvas:function(){return y.current},getChart:function(){return h.current},getBase64Image:function(){return h.current.toBase64Image()},getElement:function(){return g.current},generateLegend:function(){return h.current&&h.current.generateLegend()},refresh:function(){return h.current&&h.current.update()}}}),o.useEffect(function(){w()}),(0,a.zq)(function(){E()});var O=f.options&&f.options.plugins&&f.options.plugins.title&&f.options.plugins.title.text,S=f.ariaLabel||O,k=(0,i.dG)({id:f.id,ref:g,style:m("root"),className:b("root")},l.getOtherProps(f),d("root")),j=(0,i.dG)({ref:y,width:f.width,height:f.height,role:"img","aria-label":S},d("canvas"));return o.createElement("div",k,o.createElement("canvas",j))}),function(e,t){return e.data===t.data&&e.options===t.options&&e.type===t.type});u.displayName="Chart"},3621:function(e,t,n){"use strict";n.d(t,{C:function(){return b}});var o=n(6006),r=n(3142),a=n(465),i=n(9347),c=n(9424),l=n(5942),s=n(6878);function u(){return(u=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e}).apply(this,arguments)}function f(e){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var p=s.V.extend({defaultProps:{__TYPE:"ToggleButton",id:null,onIcon:null,offIcon:null,onLabel:"Yes",offLabel:"No",iconPos:"left",style:null,className:null,checked:!1,tabIndex:0,tooltip:null,tooltipOptions:null,onChange:null,onFocus:null,onBlur:null,children:void 0},css:{classes:{label:"p-button-label",icon:function(e){var t=e.props,n=e.label;return(0,l.AK)("p-button-icon p-c",{"p-button-icon-left":"left"===t.iconPos&&n,"p-button-icon-right":"right"===t.iconPos&&n})},root:function(e){var t=e.props,n=e.hasIcon,o=e.hasLabel;return(0,l.AK)("p-button p-togglebutton p-component",{"p-button-icon-only":n&&!o,"p-highlight":t.checked,"p-disabled":t.disabled},t.className)}}}});function d(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,o)}return n}var b=o.memo(o.forwardRef(function(e,t){var n=o.useContext(r.Ou),b=p.getProps(e,n),m=o.useRef(null),v=p.setMetaData({props:b}),g=v.ptm,h=v.cx,y=v.isUnstyled;(0,s.e)(p.css.styles,y,{name:"togglebutton"});var w=b.onLabel&&b.onLabel.length>0&&b.offLabel&&b.offLabel.length>0,E=b.onIcon&&b.offIcon,O=w?b.checked?b.onLabel:b.offLabel:"&nbsp;",S=b.checked?b.onIcon:b.offIcon,k=function(e){!b.disabled&&b.onChange&&b.onChange({originalEvent:e,value:!b.checked,stopPropagation:function(){e.stopPropagation()},preventDefault:function(){e.preventDefault()},target:{name:b.name,id:b.id,value:!b.checked}})};o.useImperativeHandle(t,function(){return{props:b,focus:function(){return l.p7.focusFirstElement(m.current)},getElement:function(){return m.current}}}),(0,a.nw)(function(){b.autoFocus&&l.p7.focusFirstElement(m.current)});var j=l.gb.isNotEmpty(b.tooltip),P=b.disabled?-1:b.tabIndex,M=function(){if(E){var e=(0,l.dG)({className:h("icon",{label:O})},g("icon"));return l.Cz.getJSXIcon(S,function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?d(Object(n),!0).forEach(function(t){!function(e,t,n){var o;o=function(e,t){if("object"!==f(e)||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var o=n.call(e,t||"default");if("object"!==f(o))return o;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"===f(o)?o:String(o))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):d(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}({},e),{props:b})}return null}(),x=(0,l.dG)({className:h("label")},g("label")),L=(0,l.dG)({ref:m,id:b.id,className:h("root",{hasIcon:E,hasLabel:w}),style:b.style,onClick:k,onFocus:b.onFocus,onBlur:b.onBlur,onKeyDown:function(e){32===e.keyCode&&(k(e),e.preventDefault())},tabIndex:P,role:"button","aria-pressed":b.checked},p.getOtherProps(b),g("root"));return o.createElement(o.Fragment,null,o.createElement("div",L,M,o.createElement("span",x,O),o.createElement(i.H,null)),j&&o.createElement(c.u,u({target:m,content:b.tooltip},b.tooltipOptions,{pt:g("tooltip")})))}));b.displayName="ToggleButton"}}]);