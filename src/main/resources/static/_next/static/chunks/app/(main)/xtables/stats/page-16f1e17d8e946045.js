(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[56],{2832:function(e,n,t){Promise.resolve().then(t.bind(t,2384))},2384:function(e,n,t){"use strict";t.r(n);var l=t(9268),i=t(6006),r=t(7537),s=t(7389),a=t(9009);n.default=()=>{var e,n,t,o,c,d,u,m,v,x,f,p,b,h,g;let{isConnected:j,lastConnectionUpdate:y,sendMessageAndWaitForCondition:N}=(0,i.useContext)(r.WebsocketContext),[w,k]=(0,i.useState)({}),[S,O]=(0,i.useState)(new Date),[P,E]=(0,i.useState)(new Date),[T,C]=(0,i.useState)(new Date);return(0,i.useEffect)(()=>{let e=setInterval(()=>{j&&N({type:"XTABLES-STATISTICS"},e=>"XTABLES-STATISTICS"===e.type).then(e=>{k(n=>{var t,l;return e.message.connected!==(null==n?void 0:n.connected)&&O(new Date),e.message.connected&&(e.message.info=JSON.parse(e.message.info),e.message.info.totalClients!==(null==n?void 0:null===(t=n.info)||void 0===t?void 0:t.totalClients)&&E(new Date),e.message.info.totalMessages!==(null==n?void 0:null===(l=n.info)||void 0===l?void 0:l.totalMessages)&&C(new Date)),console.log(e.message),e.message})}).catch(()=>{})},50);return()=>clearInterval(e)},[j,N]),(0,l.jsxs)("div",{className:"grid",children:[(0,l.jsx)("div",{className:"col-12 lg:col-6 xl:col-3",children:(0,l.jsxs)("div",{className:"card mb-0",children:[(0,l.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,l.jsxs)("div",{children:[(0,l.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Backend Status"}),(0,l.jsxs)("div",{className:"text-900 font-medium text-xl "+(j?"text-green-600":"text-red-600 animate-pulse"),children:[" ",j?"Connected":"Disconnected"]})]}),(0,l.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,l.jsx)("i",{className:"pi pi-chevron-circle-up text-blue-500 text-xl"})})]}),(0,l.jsx)(s.Z,{date:y})]})}),(0,l.jsx)("div",{className:"col-12 lg:col-6 xl:col-3",children:(0,l.jsxs)("div",{className:"card mb-0",children:[(0,l.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,l.jsxs)("div",{children:[(0,l.jsx)("span",{className:"block text-500 font-medium mb-3",children:"XTABLES Status"}),(0,l.jsx)("div",{className:"text-900 font-medium text-xl "+(j&&(null==w?void 0:w.connected)?"text-green-600":"text-red-600 animate-pulse"),children:j&&(null==w?void 0:w.connected)?"Connected":"Disconnected"})]}),(0,l.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,l.jsx)("i",{className:"pi pi-table text-blue-500 text-xl"})})]}),(0,l.jsx)(s.Z,{date:S})]})}),(0,l.jsx)("div",{className:"col-12 lg:col-6 xl:col-3",children:(0,l.jsxs)("div",{className:"card mb-0",children:[(0,l.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,l.jsxs)("div",{children:[(0,l.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Health"}),(0,l.jsx)("div",{className:"text-900 font-medium text-xl "+(j&&(null==w?void 0:w.connected)?(null==w?void 0:null===(e=w.info)||void 0===e?void 0:e.health)==="GOOD"?"text-green-600":(null==w?void 0:null===(n=w.info)||void 0===n?void 0:n.health)==="OK"?"text-yellow-500":"text-red-600 animate-pulse":"text-red-600 animate-pulse"),children:j&&(null==w?void 0:w.connected)?(null==w?void 0:null===(t=w.info)||void 0===t?void 0:t.health)||"Unknown":"Disconnected"})]}),(0,l.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,l.jsx)("i",{className:"pi pi-heart-fill text-cyan-500 text-xl"})})]}),(0,l.jsx)(s.Z,{date:S})]})}),(0,l.jsx)("div",{className:"col-12 lg:col-6 xl:col-3",children:(0,l.jsxs)("div",{className:"card mb-0",children:[(0,l.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,l.jsxs)("div",{children:[(0,l.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Clients"}),(0,l.jsx)("div",{className:"text-900 font-medium text-xl "+(j&&(null==w?void 0:w.connected)&&(null==w?void 0:null===(o=w.info)||void 0===o?void 0:o.totalClients)?"text-white":"text-red-600 animate-pulse"),children:j&&(null==w?void 0:w.connected)?null!==(b=null==w?void 0:null===(c=w.info)||void 0===c?void 0:c.totalClients)&&void 0!==b?b:"Unknown":"Disconnected"})]}),(0,l.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,l.jsx)("i",{className:"pi pi-android text-cyan-500 text-xl"})})]}),(0,l.jsx)(s.Z,{date:P})]})}),(0,l.jsx)("div",{className:"col-12 lg:col-6 xl:col-3",children:(0,l.jsxs)("div",{className:"card mb-0",children:[(0,l.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,l.jsxs)("div",{children:[(0,l.jsx)("span",{className:"block text-500 font-medium mb-3",children:"IP Address"}),(0,l.jsx)("div",{className:"text-900 font-medium text-xl "+(j&&(null==w?void 0:w.connected)?null==w?void 0:null===(d=w.info)||void 0===d?void 0:d.ip:"text-red-600 animate-pulse"),children:j&&(null==w?void 0:w.connected)?(null==w?void 0:null===(u=w.info)||void 0===u?void 0:u.ip)||"Unknown":"Disconnected"})]}),(0,l.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,l.jsx)("i",{className:"pi pi-map-marker text-cyan-500 text-xl"})})]}),(0,l.jsx)(s.Z,{date:S})]})}),(0,l.jsx)("div",{className:"col-12 lg:col-6 xl:col-3",children:(0,l.jsxs)("div",{className:"card mb-0",children:[(0,l.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,l.jsxs)("div",{children:[(0,l.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Round Trip Latency"}),(0,l.jsx)("div",{className:"text-900 font-medium text-xl "+(j&&(null==w?void 0:w.connected)?null==w?void 0:w.roundTripLatencyMS:"text-red-600 animate-pulse"),children:j&&(null==w?void 0:w.connected)?(null==w?void 0:w.roundTripLatencyMS)||"Unknown":"Disconnected"})]}),(0,l.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,l.jsx)("i",{className:"pi pi-bolt text-cyan-500 text-xl"})})]}),(0,l.jsx)(s.Z,{date:S})]})}),(0,l.jsx)("div",{className:"col-12 lg:col-6 xl:col-3",children:(0,l.jsxs)("div",{className:"card mb-0",children:[(0,l.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,l.jsxs)("div",{children:[(0,l.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Network Latency"}),(0,l.jsx)("div",{className:"text-900 font-medium text-xl "+(j&&(null==w?void 0:w.connected)?null==w?void 0:w.networkLatencyMS:"text-red-600 animate-pulse"),children:j&&(null==w?void 0:w.connected)?(null==w?void 0:w.networkLatencyMS)||"Unknown":"Disconnected"})]}),(0,l.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,l.jsx)("i",{className:"pi pi-wifi text-cyan-500 text-xl"})})]}),(0,l.jsx)(s.Z,{date:S})]})}),(0,l.jsx)("div",{className:"col-12 lg:col-6 xl:col-3",children:(0,l.jsxs)("div",{className:"card mb-0",children:[(0,l.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,l.jsxs)("div",{children:[(0,l.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Total Messages"}),(0,l.jsx)("div",{className:"text-900 font-medium text-xl "+(j&&(null==w?void 0:w.connected)?null==w?void 0:null===(m=w.info)||void 0===m?void 0:m.totalMessages:"text-red-600 animate-pulse"),children:j&&(null==w?void 0:w.connected)?null!==(h=null==w?void 0:null===(x=w.info)||void 0===x?void 0:null===(v=x.totalMessages)||void 0===v?void 0:v.toLocaleString())&&void 0!==h?h:"Unknown":"Disconnected"})]}),(0,l.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,l.jsx)("i",{className:"pi pi-send text-cyan-500 text-xl"})})]}),(0,l.jsx)(s.Z,{date:T})]})}),(0,l.jsx)("div",{className:"col-12",children:(0,l.jsxs)("div",{className:"card mb-0",children:[(0,l.jsx)("h5",{children:"CPU Usage"}),(0,l.jsx)(a.k,{mode:j&&(null==w?void 0:w.connected)?"determinate":"indeterminate",value:j&&(null==w?void 0:w.connected)?(null!==(g=w.info.processCpuLoadPercentage)&&void 0!==g?g:0).toFixed(3):0}),(0,l.jsx)("h5",{children:"Memory Usage"}),(0,l.jsx)(a.k,{mode:j&&(null==w?void 0:w.connected)?"determinate":"indeterminate",value:j&&(null==w?void 0:w.connected)?(w.info.usedMemoryMB/w.info.maxMemoryMB*100).toFixed(3):0}),(0,l.jsx)("h5",{children:"Total Threads"}),(0,l.jsx)(a.k,{mode:j&&(null==w?void 0:w.connected)?"determinate":"indeterminate",displayValueTemplate:e=>(0,l.jsx)(i.Fragment,{children:e}),value:j&&(null==w?void 0:w.connected)&&(null==w?void 0:null===(f=w.info)||void 0===f?void 0:f.totalThreads)||0}),(0,l.jsx)("h5",{children:"Available Processors"}),(0,l.jsx)(a.k,{mode:j&&(null==w?void 0:w.connected)?"determinate":"indeterminate",displayValueTemplate:e=>(0,l.jsx)(i.Fragment,{children:e}),value:j&&(null==w?void 0:w.connected)&&(null==w?void 0:null===(p=w.info)||void 0===p?void 0:p.availableProcessors)||0}),(0,l.jsx)("h5",{children:"Power Usage"}),(0,l.jsx)(a.k,{mode:j&&(null==w?void 0:w.connected)?"determinate":"indeterminate",displayValueTemplate:()=>{var e,n,t;return(0,l.jsxs)(i.Fragment,{children:[null!==(t=null==w?void 0:null===(n=w.info)||void 0===n?void 0:null===(e=n.powerUsageWatts)||void 0===e?void 0:e.toFixed(3))&&void 0!==t?t:0," Watts"]})},value:100})]})})]})}},7389:function(e,n,t){"use strict";t.d(n,{Z:function(){return s}});var l=t(9268),i=t(6006);let r=e=>{let n=new Date-new Date(e),t=Math.floor(n/1e3),l=Math.floor(t/31536e3);return l>1?"".concat(l," years ago"):(l=Math.floor(t/2592e3))>1?"".concat(l," months ago"):(l=Math.floor(t/86400))>1?"".concat(l," days ago"):(l=Math.floor(t/3600))>1?"".concat(l," hours ago"):(l=Math.floor(t/60))>1?"".concat(l," minutes ago"):t>=1?"".concat(t," seconds ago"):n>1?"".concat(n," milliseconds ago"):"just now"};var s=e=>{let{date:n,className:t}=e,[s,a]=(0,i.useState)("");return(0,i.useEffect)(()=>{a(r(n));let e=setInterval(()=>{a(r(n))},100);return()=>clearInterval(e)},[n]),(0,l.jsx)("span",{className:t,children:s})}},7537:function(e,n,t){"use strict";t.r(n),t.d(n,{WebSocketProvider:function(){return s},WebsocketContext:function(){return r}});var l=t(9268),i=t(6006);let r=(0,i.createContext)({}),s=e=>{let{children:n,url:t}=e,[s,a]=(0,i.useState)(!1),[o,c]=(0,i.useState)(new Date),d=(0,i.useRef)(null);return(0,i.useEffect)(()=>((function e(){console.log("Connecting to websocket"),d.current=new WebSocket(t),d.current.onopen=()=>{a(!0)},d.current.onclose=()=>(a(!1),console.log("Disconnected from websocket."),e()),d.current.onerror=e=>{console.error("WebSocket Error: ",e),d.current.close(),a(!1)}})(),()=>{d.current&&d.current.close()}),[t]),(0,i.useEffect)(()=>{c(new Date)},[s]),(0,l.jsx)(r.Provider,{value:{isConnected:s,lastConnectionUpdate:o,sendMessageAndWaitForCondition:function(e,n){let t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1500;return s?(d.current.send(JSON.stringify(e)),new Promise((e,l)=>{let i=t=>{let l=JSON.parse(t.data);if(n(l)){d.current.removeEventListener("message",i),clearTimeout(r);let n=l.message;l.message=JSON.parse(n),e(l)}},r=setTimeout(()=>{d.current.removeEventListener("message",i),l(Error("Timeout: Condition not met within ".concat(t," ms")))},t);d.current.addEventListener("message",i)})):Promise.reject(Error("WebSocket is not connected"))}},children:n})}},9009:function(e,n,t){"use strict";t.d(n,{k:function(){return u}});var l=t(6006),i=t(3142),r=t(6878),s=t(5942);function a(){return(a=Object.assign?Object.assign.bind():function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var l in t)Object.prototype.hasOwnProperty.call(t,l)&&(e[l]=t[l])}return e}).apply(this,arguments)}function o(e){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var c=r.V.extend({defaultProps:{__TYPE:"ProgressBar",__parentMetadata:null,id:null,value:null,showValue:!0,unit:"%",style:null,className:null,mode:"determinate",displayValueTemplate:null,color:null,children:void 0},css:{classes:{root:function(e){return"indeterminate"===e.props.mode?(0,s.AK)("p-progressbar p-component p-progressbar-indeterminate"):(0,s.AK)("p-progressbar p-component p-progressbar-determinate")},value:"p-progressbar-value p-progressbar-value-animate",label:"p-progressbar-label",container:"p-progressbar-indeterminate-container"},styles:"\n@layer primereact {\n  .p-progressbar {\n      position: relative;\n      overflow: hidden;\n  }\n  \n  .p-progressbar-determinate .p-progressbar-value {\n      height: 100%;\n      width: 0%;\n      position: absolute;\n      display: none;\n      border: 0 none;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      overflow: hidden;\n  }\n  \n  .p-progressbar-determinate .p-progressbar-label {\n      display: inline-flex;\n  }\n  \n  .p-progressbar-determinate .p-progressbar-value-animate {\n      transition: width 1s ease-in-out;\n  }\n  \n  .p-progressbar-indeterminate .p-progressbar-value::before {\n        content: '';\n        position: absolute;\n        background-color: inherit;\n        top: 0;\n        left: 0;\n        bottom: 0;\n        will-change: left, right;\n        -webkit-animation: p-progressbar-indeterminate-anim 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;\n                animation: p-progressbar-indeterminate-anim 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;\n  }\n  \n  .p-progressbar-indeterminate .p-progressbar-value::after {\n      content: '';\n      position: absolute;\n      background-color: inherit;\n      top: 0;\n      left: 0;\n      bottom: 0;\n      will-change: left, right;\n      -webkit-animation: p-progressbar-indeterminate-anim-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;\n              animation: p-progressbar-indeterminate-anim-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;\n      -webkit-animation-delay: 1.15s;\n              animation-delay: 1.15s;\n  }\n}\n\n@-webkit-keyframes p-progressbar-indeterminate-anim {\n  0% {\n    left: -35%;\n    right: 100%; }\n  60% {\n    left: 100%;\n    right: -90%; }\n  100% {\n    left: 100%;\n    right: -90%; }\n}\n@keyframes p-progressbar-indeterminate-anim {\n  0% {\n    left: -35%;\n    right: 100%; }\n  60% {\n    left: 100%;\n    right: -90%; }\n  100% {\n    left: 100%;\n    right: -90%; }\n}\n\n@-webkit-keyframes p-progressbar-indeterminate-anim-short {\n  0% {\n    left: -200%;\n    right: 100%; }\n  60% {\n    left: 107%;\n    right: -8%; }\n  100% {\n    left: 107%;\n    right: -8%; }\n}\n@keyframes p-progressbar-indeterminate-anim-short {\n  0% {\n    left: -200%;\n    right: 100%; }\n  60% {\n    left: 107%;\n    right: -8%; }\n  100% {\n    left: 107%;\n    right: -8%; }\n}\n",inlineStyles:{value:function(e){var n=e.props,t=Math.max(n.value,2),l=n.value?n.color:"transparent";return"indeterminate"===n.mode?{backgroundColor:n.color}:{width:t+"%",display:"flex",backgroundColor:l}}}}});function d(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);n&&(l=l.filter(function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable})),t.push.apply(t,l)}return t}var u=l.memo(l.forwardRef(function(e,n){var t,u,m,v,x,f,p,b=l.useContext(i.Ou),h=c.getProps(e,b),g=c.setMetaData(function(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?d(Object(t),!0).forEach(function(n){!function(e,n,t){var l;l=function(e,n){if("object"!==o(e)||null===e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var l=t.call(e,n||"default");if("object"!==o(l))return l;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===n?String:Number)(e)}(n,"string"),(n="symbol"===o(l)?l:String(l))in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t}(e,n,t[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):d(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))})}return e}({props:h},h.__parentMetadata)),j=g.ptm,y=g.cx,N=g.isUnstyled;(0,r.e)(c.css.styles,N,{name:"progressbar"});var w=l.useRef(null);if(l.useImperativeHandle(n,function(){return{props:h,getElement:function(){return w.current}}}),"determinate"===h.mode)return t=h.showValue&&null!=h.value?h.displayValueTemplate?h.displayValueTemplate(h.value):h.value+h.unit:null,u=(0,s.dG)({className:(0,s.AK)(h.className,y("root")),style:h.style,role:"progressbar","aria-valuemin":"0","aria-valuenow":h.value,"aria-valuemax":"100"},c.getOtherProps(h),j("root")),m=(0,s.dG)({className:y("value"),style:{width:h.value+"%",display:"flex",backgroundColor:h.color}},j("value")),v=(0,s.dG)({className:y("label")},j("label")),l.createElement("div",a({id:h.id,ref:w},u),l.createElement("div",m,null!=t&&l.createElement("div",v,t)));if("indeterminate"===h.mode)return x=(0,s.dG)({className:(0,s.AK)(h.className,y("root")),style:h.style,role:"progressbar","aria-valuemin":"0","aria-valuenow":h.value,"aria-valuemax":"100"},c.getOtherProps(h),j("root")),f=(0,s.dG)({className:y("container")},j("container")),p=(0,s.dG)({className:y("value"),style:{backgroundColor:h.color}},j("value")),l.createElement("div",a({id:h.id,ref:w},x),l.createElement("div",f,l.createElement("div",p)));throw Error(h.mode+" is not a valid mode for the ProgressBar. Valid values are 'determinate' and 'indeterminate'")}));u.displayName="ProgressBar"}},function(e){e.O(0,[434,6878,9253,5769,1744],function(){return e(e.s=2832)}),_N_E=e.O()}]);