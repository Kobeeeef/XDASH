(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5697],{2658:function(e,t,n){Promise.resolve().then(n.bind(n,1204))},1204:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return h}});var r=n(9268),a=n(8176),o=n(716),l=n(6006),s=n(3142),i=n(6878),c=n(5942),u=(0,c.Nd)();function d(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function p(e,t){if(e){if("string"==typeof e)return d(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);if("Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return d(e,t)}}function m(e){return function(e){if(Array.isArray(e))return d(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||p(e)||function(){throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function f(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,a,o,l,s=[],i=!0,c=!1;try{if(o=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;i=!1}else for(;!(i=(r=o.call(n)).done)&&(s.push(r.value),s.length!==t);i=!0);}catch(e){c=!0,a=e}finally{try{if(!i&&null!=n.return&&(l=n.return(),Object(l)!==l))return}finally{if(c)throw a}}return s}}(e,t)||p(e,t)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var b=i.V.extend({defaultProps:{__TYPE:"Terminal",id:null,style:null,className:null,welcomeMessage:null,prompt:null,children:void 0},css:{classes:{root:"p-terminal p-component",content:"p-terminal-content",container:"p-terminal-prompt-container",command:"p-terminal-command",commandText:"p-terminal-input",prompt:"p-terminal-prompt",response:"p-terminal-response"},styles:"\n@layer primereact {\n    .p-terminal {\n        height: 18rem;\n        overflow: auto;\n    }\n    \n    .p-terminal-prompt-container {\n        display: flex;\n        align-items: center;\n    }\n    \n    .p-terminal-input {\n        flex: 1 1 auto;\n        border: 0 none;\n        background-color: transparent;\n        color: inherit;\n        padding: 0;\n        outline: 0 none;\n    }\n    \n    .p-terminal-input::-ms-clear {\n        display: none;\n    }        \n}\n"}}),g=l.memo(l.forwardRef(function(e,t){var n,r,a,o,d=l.useContext(s.Ou),p=b.getProps(e,d),g=f(l.useState(""),2),v=g[0],y=g[1],h=f(l.useState([]),2),x=h[0],j=h[1],w=f(l.useState(0),2),N=w[0],O=w[1],E=f(l.useState(""),2),S=E[0],P=E[1],k=l.useRef(null),C=l.useRef(null),A=l.useRef(!1),M=b.setMetaData({props:p,state:{commandText:v,commands:x}}),_=M.ptm,T=M.cx,D=M.isUnstyled;(0,i.e)(b.css.styles,D,{name:"terminal"});var G=(0,c.dG)({className:T("prompt")},_("prompt")),I=function(e){y(e.target.value)};l.useImperativeHandle(t,function(){return{props:p,focus:function(){return c.p7.focus(C.current)},getElement:function(){return k.current}}}),l.useEffect(function(){var e=function(e){if(x&&x.length>0){var t=m(x);t[t.length-1].response=e,j(t)}},t=function(){j([]),O(0)};return u.on("response",e),u.on("clear",t),function(){u.off("response",e),u.off("clear",t)}},[x]),l.useEffect(function(){A.current&&(u.emit("command",S),A.current=!1),k.current.scrollTop=k.current.scrollHeight});var R=function(){if(p.welcomeMessage){var e=(0,c.dG)(_("welcomeMessage"));return l.createElement("div",e,p.welcomeMessage)}return null}(),z=(n=x.map(function(e,t){var n=e.text,r=e.response,a=n+"_"+t,o=(0,c.dG)({key:a},_("commands")),s=(0,c.dG)({className:T("command")},_("command")),i=(0,c.dG)({className:T("response"),"aria-live":"polite"},_("response"));return l.createElement("div",o,l.createElement("span",G,p.prompt,"\xa0"),l.createElement("span",s,n),l.createElement("div",i,r))}),r=(0,c.dG)({className:T("content")},_("content")),l.createElement("div",r,n)),K=(a=(0,c.dG)({className:T("container")},_("container")),o=(0,c.dG)({ref:C,value:v,type:"text",className:T("commandText"),autoComplete:"off",onChange:function(e){return I(e)},onKeyDown:function(e){switch(e.code){case"ArrowUp":if(x&&x.length){var t=N-1<0?x.length-1:N-1,n=x[t];O(t),y(n.text)}break;case"Enter":if(v){var r=m(x);r.push({text:v}),O(function(e){return e+1}),y(""),j(r),P(v),A.current=!0}}}},_("commandText")),l.createElement("div",a,l.createElement("span",G,p.prompt,"\xa0"),l.createElement("input",o))),B=(0,c.dG)({id:p.id,ref:k,className:(0,c.AK)(p.className,T("root")),style:p.style,onClick:function(){c.p7.focus(C.current)}},b.getOtherProps(p),_("root"));return l.createElement("div",B,R,z,K)}));g.displayName="Terminal";var v=n(7537),y=n(7389),h=()=>{let{isConnected:e,lastConnectionUpdate:t}=(0,l.useContext)(v.U),n=(0,l.useRef)(null),[s,i]=(0,l.useState)([]),[c,d]=(0,l.useState)({}),p=(0,l.useCallback)(t=>{let n=t.indexOf(" "),r=-1!==n?t.substring(0,n):t;if(t.split(" "),!e)return u.emit("response","Please connect to backend socket first!");switch(r){case"help":case"ls":u.emit("response","Available Commands: - clear: Clear the terminal screen. - put {key} {value}: Update a specific key value. - get {key}: Retrieve a value from the server. - sync: Syncs all data from server to refresh. - help: Show available commands and their descriptions.");break;case"clear":u.emit("clear")}},[e]);(0,l.useEffect)(()=>(u.on("command",p),()=>{u.off("command",p)}),[p]),(0,l.useEffect)(()=>{i(function(e){let t=function(e){let n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return Object.entries(e).map(e=>{let[r,a]=e,o={key:n?"".concat(n,".").concat(r):r,name:r};return"object"==typeof a&&null!==a?(a.hasOwnProperty("value")&&(o.value=a.value,o.type=(typeof JSON.parse(a.value)).toString()),a.data&&(o.data=t(a.data,o.key))):(o.value=a,o.type=(typeof JSON.parse(a)).toString()),o})};return t(e)}(c))},[c]);let m=e=>e.data&&Object.keys(e.data).length>0,f=e=>(0,r.jsx)("div",{className:"p-3",children:(0,r.jsxs)(a.w,{showGridlines:!0,value:e.data,editMode:"cell",expandedRows:expandedRows,rowExpansionTemplate:f,selectionMode:"single",dataKey:"key",removableSort:!0,children:[(0,r.jsx)(o.s,{expander:m,style:{width:"5rem"}}),(0,r.jsx)(o.s,{field:"name",header:"",sortable:!0}),(0,r.jsx)(o.s,{field:"value",header:"",frozen:!0,className:"font-bold max-w-1 overflow-hidden whitespace-nowrap",editor:textEditor,onCellEditComplete:onCellEditComplete,sortable:!0}),(0,r.jsx)(o.s,{field:"type",className:"capitalize max-w-1 overflow-hidden whitespace-nowrap",sortable:!0})]})});return(0,r.jsxs)("div",{className:"grid",children:[(0,r.jsx)("div",{className:"col-12 lg:col-6 xl:col-4",children:(0,r.jsxs)("div",{className:"card mb-0",children:[(0,r.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Backend Status"}),(0,r.jsxs)("div",{className:"text-900 font-medium text-xl",children:[" ",e?"Connected":"Disconnected"]})]}),(0,r.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,r.jsx)("i",{className:"pi pi-chevron-circle-up text-blue-500 text-xl"})})]}),(0,r.jsx)(y.Z,{date:t})]})}),(0,r.jsx)("div",{className:"col-12 lg:col-6 xl:col-4",children:(0,r.jsxs)("div",{className:"card mb-0",children:[(0,r.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("span",{className:"block text-500 font-medium mb-3",children:"XTABLES Status"}),(0,r.jsx)("div",{className:"text-900 font-medium text-xl",children:"Connected"})]}),(0,r.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,r.jsx)("i",{className:"pi pi-table text-blue-500 text-xl"})})]}),(0,r.jsx)("span",{className:"text-green-500 font-bold",children:"1 "}),(0,r.jsx)("span",{className:"text-500",children:"minute ago"})]})}),(0,r.jsx)("div",{className:"col-12 lg:col-6 xl:col-4",children:(0,r.jsxs)("div",{className:"card mb-0",children:[(0,r.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Clients"}),(0,r.jsx)("div",{className:"text-900 font-medium text-xl",children:"5"})]}),(0,r.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,r.jsx)("i",{className:"pi pi-android text-cyan-500 text-xl"})})]}),(0,r.jsx)("span",{className:"text-green-500 font-bold",children:"1 "}),(0,r.jsx)("span",{className:"text-500",children:"minute ago"})]})}),(0,r.jsx)("div",{className:"col-12",children:(0,r.jsx)("div",{className:"card mb-0",children:(0,r.jsx)(g,{welcomeMessage:"Welcome to XTABLES control panel!",prompt:"XTABLES $",pt:{root:"bg-gray-900 text-white border-round",prompt:"text-gray-400 mr-2",command:"text-primary-300",response:"text-primary-300"}})})}),(0,r.jsx)("div",{className:"col-12",children:(0,r.jsx)("div",{className:"card mb-0",children:(0,r.jsxs)(a.w,{ref:n,virtualScrollerOptions:{itemSize:50},value:s,selectionMode:"single",showGridlines:!1,globalFilterFields:["name","value"],removableSort:!0,filterDisplay:"row",loading:!e,rowExpansionTemplate:f,dataKey:"key",scrollable:!0,scrollHeight:"50vh",tableStyle:{minWidth:"15rem"},children:[(0,r.jsx)(o.s,{expander:m,style:{width:"5rem"}}),(0,r.jsx)(o.s,{field:"name",header:"Name",sortable:!0,f:!0}),(0,r.jsx)(o.s,{field:"value",header:"Value",className:"font-bold max-w-1 overflow-hidden whitespace-nowrap",sortable:!0}),(0,r.jsx)(o.s,{field:"type",header:"Type",className:"capitalize max-w-1 overflow-hidden whitespace-nowrap",sortable:!0})]})})})]})}},7389:function(e,t,n){"use strict";n.d(t,{Z:function(){return l}});var r=n(9268),a=n(6006);let o=e=>{let t=new Date-new Date(e),n=Math.floor(t/1e3),r=Math.floor(n/31536e3);return r>1?"".concat(r," years ago"):(r=Math.floor(n/2592e3))>1?"".concat(r," months ago"):(r=Math.floor(n/86400))>1?"".concat(r," days ago"):(r=Math.floor(n/3600))>1?"".concat(r," hours ago"):(r=Math.floor(n/60))>1?"".concat(r," minutes ago"):n>=1?"".concat(n," seconds ago"):t>1?"".concat(t," milliseconds ago"):"just now"};var l=e=>{let{date:t,className:n}=e,[l,s]=(0,a.useState)("");return(0,a.useEffect)(()=>{s(o(t));let e=setInterval(()=>{s(o(t))},30);return()=>clearInterval(e)},[t]),(0,r.jsx)("span",{className:n,children:l})}},7537:function(e,t,n){"use strict";n.d(t,{U:function(){return o},q:function(){return l}});var r=n(9268),a=n(6006);let o=(0,a.createContext)({}),l=e=>{let{children:t,url:n}=e,[l,s]=(0,a.useState)(!1),[i,c]=(0,a.useState)(new Date),u=(0,a.useRef)(null);return(0,a.useEffect)(()=>(u.current=new WebSocket(n),u.current.onopen=()=>{s(!0)},u.current.onclose=()=>{s(!1)},u.current.onerror=e=>{console.error("WebSocket Error: ",e),s(!1)},()=>{u.current&&u.current.close()}),[n]),(0,a.useEffect)(()=>{c(new Date)},[l]),(0,r.jsx)(o.Provider,{value:{isConnected:l,lastConnectionUpdate:i,sendMessageAndWaitForCondition:function(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1500;return l?(u.current.send(JSON.stringify(e)),new Promise((e,r)=>{let a=n=>{let r=JSON.parse(n.data);t(r)&&(u.current.removeEventListener("message",a),clearTimeout(o),e(r))},o=setTimeout(()=>{u.current.removeEventListener("message",a),r(Error("Timeout: Condition not met within ".concat(n," ms")))},n);u.current.addEventListener("message",a)})):Promise.reject(Error("WebSocket is not connected"))}},children:t})}},3702:function(e,t,n){"use strict";n.d(t,{z:function(){return h}});var r=n(6006),a=n(3142),o=n(6878),l=n(5942),s=n(2124),i=n(9347),c=n(9424);function u(){return(u=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function d(e){return(d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function p(e,t,n){var r;return r=function(e,t){if("object"!==d(e)||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t||"default");if("object"!==d(r))return r;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"===d(r)?r:String(r))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var m=o.V.extend({defaultProps:{__TYPE:"Badge",__parentMetadata:null,value:null,severity:null,size:null,style:null,className:null,children:void 0},css:{classes:{root:function(e){var t=e.props;return(0,l.AK)("p-badge p-component",p({"p-badge-no-gutter":l.gb.isNotEmpty(t.value)&&1===String(t.value).length,"p-badge-dot":l.gb.isEmpty(t.value),"p-badge-lg":"large"===t.size,"p-badge-xl":"xlarge"===t.size},"p-badge-".concat(t.severity),null!==t.severity))}},styles:"\n@layer primereact {\n    .p-badge {\n        display: inline-block;\n        border-radius: 10px;\n        text-align: center;\n        padding: 0 .5rem;\n    }\n    \n    .p-overlay-badge {\n        position: relative;\n    }\n    \n    .p-overlay-badge .p-badge {\n        position: absolute;\n        top: 0;\n        right: 0;\n        transform: translate(50%,-50%);\n        transform-origin: 100% 0;\n        margin: 0;\n    }\n    \n    .p-badge-dot {\n        width: .5rem;\n        min-width: .5rem;\n        height: .5rem;\n        border-radius: 50%;\n        padding: 0;\n    }\n    \n    .p-badge-no-gutter {\n        padding: 0;\n        border-radius: 50%;\n    }\n}\n"}});function f(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}var b=r.memo(r.forwardRef(function(e,t){var n=r.useContext(a.Ou),s=m.getProps(e,n),i=m.setMetaData(function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?f(Object(n),!0).forEach(function(t){p(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):f(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}({props:s},s.__parentMetadata)),c=i.ptm,u=i.cx,d=i.isUnstyled;(0,o.e)(m.css.styles,d,{name:"badge"});var b=r.useRef(null);r.useImperativeHandle(t,function(){return{props:s,getElement:function(){return b.current}}});var g=(0,l.dG)({ref:b,style:s.style,className:(0,l.AK)(s.className,u("root"))},m.getOtherProps(s),c("root"));return r.createElement("span",g,s.value)}));b.displayName="Badge";var g=o.V.extend({defaultProps:{__TYPE:"Button",__parentMetadata:null,badge:null,badgeClassName:null,className:null,children:void 0,disabled:!1,icon:null,iconPos:"left",label:null,link:!1,loading:!1,loadingIcon:null,outlined:!1,plain:!1,raised:!1,rounded:!1,severity:null,size:null,text:!1,tooltip:null,tooltipOptions:null,visible:!0},css:{classes:{icon:function(e){var t=e.props;return(0,l.AK)("p-button-icon p-c",p({},"p-button-icon-".concat(t.iconPos),t.label))},loadingIcon:function(e){var t=e.props,n=e.className;return(0,l.AK)(n,{"p-button-loading-icon":t.loading})},label:"p-button-label p-c",root:function(e){var t=e.props,n=e.size,r=e.disabled;return(0,l.AK)("p-button p-component",p(p(p(p({"p-button-icon-only":(t.icon||t.loading)&&!t.label&&!t.children,"p-button-vertical":("top"===t.iconPos||"bottom"===t.iconPos)&&t.label,"p-disabled":r,"p-button-loading":t.loading,"p-button-outlined":t.outlined,"p-button-raised":t.raised,"p-button-link":t.link,"p-button-text":t.text,"p-button-rounded":t.rounded,"p-button-loading-label-only":t.loading&&!t.icon&&t.label},"p-button-loading-".concat(t.iconPos),t.loading&&t.label),"p-button-".concat(n),n),"p-button-".concat(t.severity),t.severity),"p-button-plain",t.plain))}}}});function v(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function y(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?v(Object(n),!0).forEach(function(t){p(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):v(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var h=r.memo(r.forwardRef(function(e,t){var n,d,m,f,v,h=r.useContext(a.Ou),x=g.getProps(e,h),j=x.disabled||x.loading,w=y(y({props:x},x.__parentMetadata),{},{context:{disabled:j}}),N=g.setMetaData(w),O=N.ptm,E=N.cx,S=N.isUnstyled;(0,o.e)(g.css.styles,S,{name:"button",styled:!0});var P=r.useRef(t);if(r.useEffect(function(){l.gb.combinedRefs(P,t)},[P,t]),!1===x.visible)return null;var k=!j||x.tooltipOptions&&x.tooltipOptions.showOnDisabled,C=l.gb.isNotEmpty(x.tooltip)&&k,A={large:"lg",small:"sm"}[x.size],M=(n=(0,l.AK)("p-button-icon p-c",p({},"p-button-icon-".concat(x.iconPos),x.label)),d=(0,l.dG)({className:E("icon")},O("icon")),n=(0,l.AK)(n,{"p-button-loading-icon":x.loading}),m=(0,l.dG)({className:E("loadingIcon",{className:n})},O("loadingIcon")),f=x.loading?x.loadingIcon||r.createElement(s.L,u({},m,{spin:!0})):x.icon,l.Cz.getJSXIcon(f,y({},d),{props:x})),_=(v=(0,l.dG)({className:E("label")},O("label")),x.label?r.createElement("span",v,x.label):!x.children&&!x.label&&r.createElement("span",u({},v,{dangerouslySetInnerHTML:{__html:"&nbsp;"}}))),T=function(){if(x.badge){var e=(0,l.dG)({className:(0,l.AK)(x.badgeClassName),value:x.badge,unstyled:x.unstyled,__parentMetadata:{parent:w}},O("badge"));return r.createElement(b,e,x.badge)}return null}(),D=x.label?x.label+(x.badge?" "+x.badge:""):x["aria-label"],G=(0,l.dG)({ref:P,"aria-label":D,className:(0,l.AK)(x.className,E("root",{size:A,disabled:j})),disabled:j},g.getOtherProps(x),O("root"));return r.createElement(r.Fragment,null,r.createElement("button",G,M,_,x.children,T,r.createElement(i.H,null)),C&&r.createElement(c.u,u({target:P,content:x.tooltip},x.tooltipOptions,{pt:O("tooltip")})))}));h.displayName="Button"}},function(e){e.O(0,[8123,434,6878,6789,8285,9683,6486,7633,6986,6324,4959,9253,5769,1744],function(){return e(e.s=2658)}),_N_E=e.O()}]);