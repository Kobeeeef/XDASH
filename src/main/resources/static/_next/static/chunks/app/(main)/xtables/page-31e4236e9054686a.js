(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5697],{2658:function(e,t,n){Promise.resolve().then(n.bind(n,1204))},1204:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return E}});var r=n(9268),s=n(8298),a=n(8204),o=n(6006),l=n(7932),c=n(3142),i=n(6878),u=n(465),d=n(5942),m=(0,d.Nd)();function p(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function f(e,t){if(e){if("string"==typeof e)return p(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);if("Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return p(e,t)}}function h(e){return function(e){if(Array.isArray(e))return p(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||f(e)||function(){throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function v(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,s,a,o,l=[],c=!0,i=!1;try{if(a=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;c=!1}else for(;!(c=(r=a.call(n)).done)&&(l.push(r.value),l.length!==t);c=!0);}catch(e){i=!0,s=e}finally{try{if(!c&&null!=n.return&&(o=n.return(),Object(o)!==o))return}finally{if(i)throw s}}return l}}(e,t)||f(e,t)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var g=i.V.extend({defaultProps:{__TYPE:"Terminal",id:null,style:null,className:null,welcomeMessage:null,prompt:null,children:void 0},css:{classes:{root:"p-terminal p-component",content:"p-terminal-content",container:"p-terminal-prompt-container",command:"p-terminal-command",commandText:"p-terminal-input",prompt:"p-terminal-prompt",response:"p-terminal-response"},styles:"\n@layer primereact {\n    .p-terminal {\n        height: 18rem;\n        overflow: auto;\n    }\n    \n    .p-terminal-prompt-container {\n        display: flex;\n        align-items: center;\n    }\n    \n    .p-terminal-input {\n        flex: 1 1 auto;\n        border: 0 none;\n        background-color: transparent;\n        color: inherit;\n        padding: 0;\n        outline: 0 none;\n    }\n    \n    .p-terminal-input::-ms-clear {\n        display: none;\n    }        \n}\n"}}),y=o.memo(o.forwardRef(function(e,t){var n,r,s,a,l=(0,u.c)(),p=o.useContext(c.Ou),f=g.getProps(e,p),y=v(o.useState(""),2),x=y[0],b=y[1],S=v(o.useState([]),2),j=S[0],E=S[1],w=v(o.useState(0),2),N=w[0],T=w[1],A=v(o.useState(""),2),k=A[0],O=A[1],D=o.useRef(null),C=o.useRef(null),B=o.useRef(!1),L=g.setMetaData({props:f,state:{commandText:x,commands:j}}),I=L.ptm,M=L.cx,X=L.isUnstyled;(0,i.e)(g.css.styles,X,{name:"terminal"});var P=l({className:M("prompt")},I("prompt")),R=function(e){b(e.target.value)};o.useImperativeHandle(t,function(){return{props:f,focus:function(){return d.p7.focus(C.current)},getElement:function(){return D.current}}}),o.useEffect(function(){var e=function(e){if(j&&j.length>0){var t=h(j);t[t.length-1].response=e,E(t)}},t=function(){E([]),T(0)};return m.on("response",e),m.on("clear",t),function(){m.off("response",e),m.off("clear",t)}},[j]),o.useEffect(function(){B.current&&(m.emit("command",k),B.current=!1),D.current.scrollTop=D.current.scrollHeight});var W=function(){if(f.welcomeMessage){var e=l(I("welcomeMessage"));return o.createElement("div",e,f.welcomeMessage)}return null}(),Z=(n=j.map(function(e,t){var n=e.text,r=e.response,s=l({key:n+"_"+t},I("commands")),a=l({className:M("command")},I("command")),c=l({className:M("response"),"aria-live":"polite"},I("response"));return o.createElement("div",s,o.createElement("span",P,f.prompt,"\xa0"),o.createElement("span",a,n),o.createElement("div",c,r))}),r=l({className:M("content")},I("content")),o.createElement("div",r,n)),J=(s=l({className:M("container")},I("container")),a=l({ref:C,value:x,type:"text",className:M("commandText"),autoComplete:"off",onChange:function(e){return R(e)},onKeyDown:function(e){switch(e.code){case"ArrowUp":if(j&&j.length){var t=N-1<0?j.length-1:N-1,n=j[t];T(t),b(n.text)}break;case"Enter":if(x){var r=h(j);r.push({text:x}),T(function(e){return e+1}),b(""),E(r),O(x),B.current=!0}}}},I("commandText")),o.createElement("div",s,o.createElement("span",P,f.prompt,"\xa0"),o.createElement("input",a))),F=l({id:f.id,ref:D,className:(0,d.AK)(f.className,M("root")),style:f.style,onClick:function(){d.p7.focus(C.current)}},g.getOtherProps(f),I("root"));return o.createElement("div",F,W,Z,J)}));y.displayName="Terminal";var x=n(7537),b=n(7389),S=n(6595),j=n(2469),E=()=>{let{isConnected:e,lastConnectionUpdate:t,sendMessageAndWaitForCondition:n}=(0,o.useContext)(x.WebsocketContext),[c,i]=(0,o.useState)({}),[u,d]=(0,o.useState)(new Date),[p,f]=(0,o.useState)(new Date),h=(0,o.useRef)(null),[v,g]=(0,o.useState)([]),[E,w]=(0,o.useState)({}),[N,T]=(0,o.useState)(null),A=(0,o.useCallback)(t=>{let r=t.indexOf(" "),s=-1!==r?t.substring(0,r):t,a=t.split(" ");if(!e)return m.emit("response","Please connect to backend socket first!");if(!(null==c?void 0:c.connected))return m.emit("response","Please connect to XTABLES server first!");switch(s){case"help":case"ls":m.emit("response","Available Commands: - clear: Clear the terminal screen. - put {key} {value}: Update a specific key value. - get {key}: Retrieve a value from the server. - reboot: Reboots the XTABLES server. - delete {key}: Deletes a key and all data below. - help: Show available commands and their descriptions.");break;case"clear":m.emit("clear");break;case"put":a.length>=3?null!==(0,S.Z)(a[1])?m.emit("response",(0,S.Z)(a[1])):(m.emit("response","Sending put request..."),function(e){try{return JSON.parse(e),!0}catch(e){return!1}}(a.slice(2).join(" "))?n({type:"XTABLES-DATA-PUT",message:JSON.stringify({value:a.slice(2).join(" "),key:a[1]})},e=>"XTABLES-DATA-PUT"===e.type).then(e=>{let t=e.message.code;m.emit("response","Server responded with: "+t)}).catch(e=>{m.emit("response","Failed to put data: "+e)}):m.emit("response","Invalid data structure!")):m.emit("response","Invalid command usage!");break;case"get":a.length>=2?null!==(0,S.Z)(a[1])?m.emit("response",(0,S.Z)(a[1])):(m.emit("response","Sending get request..."),n({type:"XTABLES-DATA-GET",message:a[1]},e=>"XTABLES-DATA-GET"===e.type).then(e=>{let t=e.message.code;m.emit("response","Server responded with: "+t)}).catch(e=>{m.emit("response","Failed to get data: "+e)})):m.emit("response","Invalid command usage!");break;case"delete":a.length>=2?null!==(0,S.Z)(a[1])?m.emit("response",(0,S.Z)(a[1])):(m.emit("response","Sending delete request..."),n({type:"XTABLES-DATA-DELETE",message:a[1]},e=>"XTABLES-DATA-DELETE"===e.type).then(e=>{let t=e.message.code;m.emit("response","Server responded with: "+t)}).catch(e=>{m.emit("response","Failed to delete data: "+e)})):m.emit("response","Invalid command usage!");break;case"reboot":(0,l.V)({message:"Are you sure you want to reboot?",header:"Reboot Confirmation",icon:"pi pi-exclamation-triangle",defaultFocus:"accept",accept(){m.emit("response","Rebooting server. Please wait."),n({type:"XTABLES-REBOOT"},e=>"XTABLES-REBOOT"===e.type).then(e=>{let t=e.message.code;m.emit("response","Server responded with: "+t)}).catch(e=>{m.emit("response","Failed to reboot server: "+e)})},reject(){m.emit("response","Cancelled reboot.")}});break;default:m.emit("response","Unknown command: "+s)}},[e,c]);return(0,o.useEffect)(()=>{let t=setInterval(()=>{e&&n({type:"XTABLES-DATA"},e=>"XTABLES-DATA"===e.type).then(e=>{i(t=>(e.message.connected!==(null==t?void 0:t.connected)&&d(new Date),e.message.json!==(null==t?void 0:t.json)&&f(new Date),e.message)),w(JSON.parse(e.message.json)||{})}).catch(()=>{})},500);return()=>clearInterval(t)},[e,n]),(0,o.useEffect)(()=>(m.on("command",A),()=>{m.off("command",A)}),[A]),(0,o.useEffect)(()=>{g(function(e){let t=function(e){let n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return Object.entries(e).map(e=>{let[r,s]=e,a={key:n?"".concat(n,".").concat(r):r,data:{name:r}};return"object"==typeof s&&null!==s?(s.hasOwnProperty("value")&&(a.data.value=s.value,a.data.type=(typeof JSON.parse(s.value)).toString()),s.data&&(a.children=t(s.data,a.key))):(a.data.value=s,a.data.type=(typeof JSON.parse(s)).toString()),a})};return t(e)}(E))},[E]),(0,r.jsxs)("div",{className:"grid fadeIn",children:[(0,r.jsx)(l.Q,{}),(0,r.jsx)("div",{className:"col-12 lg:col-6 xl:col-4",children:(0,r.jsxs)("div",{className:"card mb-0",children:[(0,r.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Backend Status"}),(0,r.jsxs)("div",{className:"text-900 font-medium text-xl",children:[" ",e?"Connected":"Disconnected"]})]}),(0,r.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,r.jsx)("i",{className:"pi pi-chevron-circle-up text-blue-500 text-xl"})})]}),(0,r.jsx)(b.Z,{date:t})]})}),(0,r.jsx)("div",{className:"col-12 lg:col-6 xl:col-4",children:(0,r.jsxs)("div",{className:"card mb-0",children:[(0,r.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("span",{className:"block text-500 font-medium mb-3",children:"XTABLES Status"}),(0,r.jsx)("div",{className:"text-900 font-medium text-xl",children:e&&(null==c?void 0:c.connected)?"Connected":"Disconnected"})]}),(0,r.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,r.jsx)("i",{className:"pi pi-table text-blue-500 text-xl"})})]}),(0,r.jsx)(b.Z,{date:u})]})}),(0,r.jsx)("div",{className:"col-12 lg:col-6 xl:col-4",children:(0,r.jsxs)("div",{className:"card mb-0",children:[(0,r.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Data Size"}),(0,r.jsx)("div",{className:"text-900 font-medium text-xl",children:e&&(null==c?void 0:c.connected)?function(e){if("string"!=typeof e)throw TypeError("Input must be a string");let t=new Blob([e]).size;return t<1024?"".concat(t," bytes"):t<1048576?"".concat((t/1024).toFixed(2)," KB"):t<1073741824?"".concat((t/1048576).toFixed(2)," MB"):"".concat((t/1073741824).toFixed(2)," GB")}(null==c?void 0:c.json)||"Unknown":"Disconnected"})]}),(0,r.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,r.jsx)("i",{className:"pi pi-android text-cyan-500 text-xl"})})]}),(0,r.jsx)(b.Z,{date:p})]})}),(0,r.jsx)("div",{className:"col-12",children:(0,r.jsx)("div",{className:"card mb-0",children:(0,r.jsx)(y,{welcomeMessage:"Welcome to XTABLES control panel!",prompt:"XTABLES $",pt:{root:"bg-gray-900 text-white border-round",prompt:"text-gray-400 mr-2",command:"text-primary-300",response:"text-primary-300"}})})}),(0,r.jsx)("div",{className:"col-12",children:(0,r.jsx)("div",{className:"card mb-0",children:(0,r.jsxs)(a.i,{ref:h,value:e&&(null==c?void 0:c.connected)?v:[],selectionMode:"single",showGridlines:!1,removableSort:!0,filterDisplay:"row",emptyMessage:(0,j.Z)({message:e?(null==c?void 0:c.connected)?"No data found":"Connecting to XTABLES":"Connecting to backend"}),dataKey:"key",scrollable:!0,scrollHeight:"50vh",tableStyle:{minWidth:"15rem"},children:[(0,r.jsx)(s.s,{expander:!0,style:{width:"5rem"}}),(0,r.jsx)(s.s,{field:"name",header:"Name",sortable:!0,f:!0}),(0,r.jsx)(s.s,{field:"value",header:"Value",className:"font-bold max-w-1 overflow-hidden whitespace-nowrap",sortable:!0}),(0,r.jsx)(s.s,{field:"type",header:"Type",className:"capitalize max-w-1 overflow-hidden whitespace-nowrap",sortable:!0})]})})})]})}},7389:function(e,t,n){"use strict";n.d(t,{Z:function(){return o}});var r=n(9268),s=n(6006);let a=e=>{let t=new Date-new Date(e),n=Math.floor(t/1e3),r=Math.floor(n/31536e3);return r>1?"".concat(r," years ago"):(r=Math.floor(n/2592e3))>1?"".concat(r," months ago"):(r=Math.floor(n/86400))>1?"".concat(r," days ago"):(r=Math.floor(n/3600))>1?"".concat(r," hours ago"):(r=Math.floor(n/60))>1?"".concat(r," minutes ago"):n>=1?"".concat(n," seconds ago"):t>1?"".concat(t," milliseconds ago"):"just now"};var o=e=>{let{date:t,className:n}=e,[o,l]=(0,s.useState)("");return(0,s.useEffect)(()=>{l(a(t));let e=setInterval(()=>{l(a(t))},100);return()=>clearInterval(e)},[t]),(0,r.jsx)("span",{className:n,children:o})}},2469:function(e,t,n){"use strict";n.d(t,{Z:function(){return u}});var r=n(9268),s=n(7690),a=n(6006),o=n(9497),l=n.n(o);let c=e=>{let{delay:t=500}=e,[n,s]=(0,a.useState)("");return(0,a.useEffect)(()=>{let e=setInterval(()=>{s(e=>{switch(e){case"":return".";case".":return"..";case"..":return"...";default:return""}})},t);return()=>clearInterval(e)},[t]),(0,r.jsx)("span",{children:n})};c.propTypes={delay:l().number};let i=e=>{let{message:t,speed:n="normal",dotSpeed:a=400}=e;return(0,r.jsxs)("div",{style:{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"},children:[(0,r.jsx)(s.E,{className:"fast"===n?"animate-pulse-fast":"animate-pulse",alt:"XBOT ROBOTICS LOGO",src:"/images/logo/logo.png"}),t&&(0,r.jsxs)("p",{className:"font-bold",children:[null!=t?t:"Loading",(0,r.jsx)(c,{delay:a})]})]})};i.propType={message:l().number};var u=i},7537:function(e,t,n){"use strict";n.r(t),n.d(t,{WebSocketProvider:function(){return o},WebsocketContext:function(){return a}});var r=n(9268),s=n(6006);let a=(0,s.createContext)({}),o=e=>{let{children:t,url:n}=e,[o,l]=(0,s.useState)(!1),[c,i]=(0,s.useState)(new Date),u=(0,s.useRef)(null);return(0,s.useEffect)(()=>((function e(){console.log("Connecting to websocket"),u.current=new WebSocket(n),u.current.onopen=()=>{l(!0)},u.current.onclose=()=>(l(!1),console.log("Disconnected from websocket."),e()),u.current.onerror=e=>{console.error("WebSocket Error: ",e),u.current.close(),l(!1)}})(),()=>{u.current&&u.current.close()}),[n]),(0,s.useEffect)(()=>{i(new Date)},[o]),(0,r.jsx)(a.Provider,{value:{isConnected:o,lastConnectionUpdate:c,sendMessageAndWaitForCondition:function(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1500;return o?(u.current.send(JSON.stringify(e)),new Promise((e,r)=>{let s=n=>{let r=JSON.parse(n.data);if(t(r)){u.current.removeEventListener("message",s),clearTimeout(a);let t=r.message;r.message=JSON.parse(t),e(r)}},a=setTimeout(()=>{u.current.removeEventListener("message",s),r(Error("Timeout: Condition not met within ".concat(n," ms")))},n);u.current.addEventListener("message",s)})):Promise.reject(Error("WebSocket is not connected"))},sendMessageTillCondition:(e,t)=>{if(!o)throw Error("WebSocket is not connected");u.current.send(JSON.stringify(e));let n=e=>{let r=JSON.parse(e.data);t(r)&&u.current.removeEventListener("message",n)};u.current.addEventListener("message",n)},socket:u,sendMessage:e=>{if(!o)return Error("WebSocket is not connected");u.current.send(JSON.stringify(e))}},children:t})}},6595:function(e,t){"use strict";t.Z=function(e){if(null==e||""===e.trim())return"Key cannot be null or empty.";if(e.includes(" "))return"Key cannot contain spaces.";if(e.startsWith(".")||e.endsWith("."))return"Key cannot start or end with '.'";if(e.includes(".."))return"Key cannot contain multiple consecutive '.'";let t=e.split(".");for(let e of t)if(""===e.trim())return"Key contains empty part(s).";return null}}},function(e){e.O(0,[434,6878,6789,8285,9933,845,2087,7136,4390,769,6261,8204,9253,5769,1744],function(){return e(e.s=2658)}),_N_E=e.O()}]);