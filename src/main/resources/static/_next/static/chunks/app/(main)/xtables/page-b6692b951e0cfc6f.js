(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5697],{502:function(e,t,n){Promise.resolve().then(n.bind(n,6441))},6441:function(e,t,n){"use strict";n.r(t);var s=n(9268),r=n(8176),a=n(8298),o=n(6006),l=n(7932),c=n(9032),i=n(3575),d=n(7537),m=n(7389),u=n(6595);t.default=()=>{let{isConnected:e,lastConnectionUpdate:t,sendMessageAndWaitForCondition:n}=(0,o.useContext)(d.WebsocketContext),[p,h]=(0,o.useState)({}),[f,x]=(0,o.useState)(new Date),[v,g]=(0,o.useState)(new Date),b=(0,o.useRef)(null),[w,y]=(0,o.useState)([]),[j,S]=(0,o.useState)({}),[E,N]=(0,o.useState)(null),T=(0,o.useCallback)(t=>{let s=t.indexOf(" "),r=-1!==s?t.substring(0,s):t,a=t.split(" ");if(!e)return i.z.emit("response","Please connect to backend socket first!");if(!(null==p?void 0:p.connected))return i.z.emit("response","Please connect to XTABLES server first!");switch(r){case"help":case"ls":i.z.emit("response","Available Commands: - clear: Clear the terminal screen. - put {key} {value}: Update a specific key value. - get {key}: Retrieve a value from the server. - reboot: Reboots the XTABLES server. - delete {key}: Deletes a key and all data below. - help: Show available commands and their descriptions.");break;case"clear":i.z.emit("clear");break;case"put":a.length>=3?null!==(0,u.Z)(a[1])?i.z.emit("response",(0,u.Z)(a[1])):(i.z.emit("response","Sending put request..."),function(e){try{return JSON.parse(e),!0}catch(e){return!1}}(a.slice(2).join(" "))?n({type:"XTABLES-DATA-PUT",message:JSON.stringify({value:a.slice(2).join(" "),key:a[1]})},e=>"XTABLES-DATA-PUT"===e.type).then(e=>{let t=e.message.code;i.z.emit("response","Server responded with: "+t)}).catch(e=>{i.z.emit("response","Failed to put data: "+e)}):i.z.emit("response","Invalid data structure!")):i.z.emit("response","Invalid command usage!");break;case"get":a.length>=2?null!==(0,u.Z)(a[1])?i.z.emit("response",(0,u.Z)(a[1])):(i.z.emit("response","Sending get request..."),n({type:"XTABLES-DATA-GET",message:a[1]},e=>"XTABLES-DATA-GET"===e.type).then(e=>{let t=e.message.code;i.z.emit("response","Server responded with: "+t)}).catch(e=>{i.z.emit("response","Failed to get data: "+e)})):i.z.emit("response","Invalid command usage!");break;case"delete":a.length>=2?null!==(0,u.Z)(a[1])?i.z.emit("response",(0,u.Z)(a[1])):(i.z.emit("response","Sending delete request..."),n({type:"XTABLES-DATA-DELETE",message:a[1]},e=>"XTABLES-DATA-DELETE"===e.type).then(e=>{let t=e.message.code;i.z.emit("response","Server responded with: "+t)}).catch(e=>{i.z.emit("response","Failed to delete data: "+e)})):i.z.emit("response","Invalid command usage!");break;case"reboot":(0,l.V)({message:"Are you sure you want to reboot?",header:"Reboot Confirmation",icon:"pi pi-exclamation-triangle",defaultFocus:"accept",accept(){i.z.emit("response","Rebooting server. Please wait."),n({type:"XTABLES-REBOOT"},e=>"XTABLES-REBOOT"===e.type).then(e=>{let t=e.message.code;i.z.emit("response","Server responded with: "+t)}).catch(e=>{i.z.emit("response","Failed to reboot server: "+e)})},reject(){i.z.emit("response","Cancelled reboot.")}});break;default:i.z.emit("response","Unknown command: "+r)}},[e,p]);(0,o.useEffect)(()=>{let t=setInterval(()=>{e&&n({type:"XTABLES-DATA"},e=>"XTABLES-DATA"===e.type).then(e=>{h(t=>(e.message.connected!==(null==t?void 0:t.connected)&&x(new Date),e.message.json!==(null==t?void 0:t.json)&&g(new Date),e.message)),S(JSON.parse(e.message.json)||{})}).catch(()=>{})},500);return()=>clearInterval(t)},[e,n]),(0,o.useEffect)(()=>(i.z.on("command",T),()=>{i.z.off("command",T)}),[T]),(0,o.useEffect)(()=>{y(function(e){let t=function(e){let n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return Object.entries(e).map(e=>{let[s,r]=e,a={key:n?"".concat(n,".").concat(s):s,name:s};return"object"==typeof r&&null!==r?(r.hasOwnProperty("value")&&(a.value=r.value,a.type=(typeof JSON.parse(r.value)).toString()),r.data&&(a.data=t(r.data,a.key))):(a.value=r,a.type=(typeof JSON.parse(r)).toString()),a})};return t(e)}(j))},[j]);let k=e=>e.data&&Object.keys(e.data).length>0,A=e=>(0,s.jsx)("div",{className:"p-3",children:(0,s.jsxs)(r.w,{showGridlines:!1,value:e.data,rowExpansionTemplate:A,onRowToggle:e=>N(e.data),selectionMode:"single",expandedRows:E,dataKey:"key",removableSort:!0,children:[(0,s.jsx)(a.s,{expander:k,style:{width:"5rem"}}),(0,s.jsx)(a.s,{field:"name",header:""}),(0,s.jsx)(a.s,{field:"value",header:"",frozen:!0,className:"font-bold max-w-1 overflow-hidden whitespace-nowrap"}),(0,s.jsx)(a.s,{field:"type",className:"capitalize max-w-1 overflow-hidden whitespace-nowrap"})]})});return(0,s.jsxs)("div",{className:"grid fadeIn",children:[(0,s.jsx)(l.Q,{}),(0,s.jsx)("div",{className:"col-12 lg:col-6 xl:col-4",children:(0,s.jsxs)("div",{className:"card mb-0",children:[(0,s.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Backend Status"}),(0,s.jsxs)("div",{className:"text-900 font-medium text-xl",children:[" ",e?"Connected":"Disconnected"]})]}),(0,s.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,s.jsx)("i",{className:"pi pi-chevron-circle-up text-blue-500 text-xl"})})]}),(0,s.jsx)(m.Z,{date:t})]})}),(0,s.jsx)("div",{className:"col-12 lg:col-6 xl:col-4",children:(0,s.jsxs)("div",{className:"card mb-0",children:[(0,s.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("span",{className:"block text-500 font-medium mb-3",children:"XTABLES Status"}),(0,s.jsx)("div",{className:"text-900 font-medium text-xl",children:e&&(null==p?void 0:p.connected)?"Connected":"Disconnected"})]}),(0,s.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,s.jsx)("i",{className:"pi pi-table text-blue-500 text-xl"})})]}),(0,s.jsx)(m.Z,{date:f})]})}),(0,s.jsx)("div",{className:"col-12 lg:col-6 xl:col-4",children:(0,s.jsxs)("div",{className:"card mb-0",children:[(0,s.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Data Size"}),(0,s.jsx)("div",{className:"text-900 font-medium text-xl",children:e&&(null==p?void 0:p.connected)?function(e){if("string"!=typeof e)throw TypeError("Input must be a string");let t=new Blob([e]).size;return t<1024?"".concat(t," bytes"):t<1048576?"".concat((t/1024).toFixed(2)," KB"):t<1073741824?"".concat((t/1048576).toFixed(2)," MB"):"".concat((t/1073741824).toFixed(2)," GB")}(null==p?void 0:p.json)||"Unknown":"Disconnected"})]}),(0,s.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,s.jsx)("i",{className:"pi pi-android text-cyan-500 text-xl"})})]}),(0,s.jsx)(m.Z,{date:v})]})}),(0,s.jsx)("div",{className:"col-12",children:(0,s.jsx)("div",{className:"card mb-0",children:(0,s.jsx)(c.o,{welcomeMessage:"Welcome to XTABLES control panel!",prompt:"XTABLES $",pt:{root:"bg-gray-900 text-white border-round",prompt:"text-gray-400 mr-2",command:"text-primary-300",response:"text-primary-300"}})})}),(0,s.jsx)("div",{className:"col-12",children:(0,s.jsx)("div",{className:"card mb-0",children:(0,s.jsxs)(r.w,{ref:b,value:w,selectionMode:"single",showGridlines:!1,globalFilterFields:["name","value"],removableSort:!0,filterDisplay:"row",expandedRows:E,onRowToggle:e=>N(e.data),loading:!e||!(null==p?void 0:p.connected),rowExpansionTemplate:A,dataKey:"key",scrollable:!0,scrollHeight:"50vh",tableStyle:{minWidth:"15rem"},children:[(0,s.jsx)(a.s,{expander:k,style:{width:"5rem"}}),(0,s.jsx)(a.s,{field:"name",header:"Name",sortable:!0,f:!0}),(0,s.jsx)(a.s,{field:"value",header:"Value",className:"font-bold max-w-1 overflow-hidden whitespace-nowrap",sortable:!0}),(0,s.jsx)(a.s,{field:"type",header:"Type",className:"capitalize max-w-1 overflow-hidden whitespace-nowrap",sortable:!0})]})})})]})}},7389:function(e,t,n){"use strict";n.d(t,{Z:function(){return o}});var s=n(9268),r=n(6006);let a=e=>{let t=new Date-new Date(e),n=Math.floor(t/1e3),s=Math.floor(n/31536e3);return s>1?"".concat(s," years ago"):(s=Math.floor(n/2592e3))>1?"".concat(s," months ago"):(s=Math.floor(n/86400))>1?"".concat(s," days ago"):(s=Math.floor(n/3600))>1?"".concat(s," hours ago"):(s=Math.floor(n/60))>1?"".concat(s," minutes ago"):n>=1?"".concat(n," seconds ago"):t>1?"".concat(t," milliseconds ago"):"just now"};var o=e=>{let{date:t,className:n}=e,[o,l]=(0,r.useState)("");return(0,r.useEffect)(()=>{l(a(t));let e=setInterval(()=>{l(a(t))},100);return()=>clearInterval(e)},[t]),(0,s.jsx)("span",{className:n,children:o})}},7537:function(e,t,n){"use strict";n.r(t),n.d(t,{WebSocketProvider:function(){return o},WebsocketContext:function(){return a}});var s=n(9268),r=n(6006);let a=(0,r.createContext)({}),o=e=>{let{children:t,url:n}=e,[o,l]=(0,r.useState)(!1),[c,i]=(0,r.useState)(new Date),d=(0,r.useRef)(null);return(0,r.useEffect)(()=>((function e(){console.log("Connecting to websocket"),d.current=new WebSocket(n),d.current.onopen=()=>{l(!0)},d.current.onclose=()=>(l(!1),console.log("Disconnected from websocket."),e()),d.current.onerror=e=>{console.error("WebSocket Error: ",e),d.current.close(),l(!1)}})(),()=>{d.current&&d.current.close()}),[n]),(0,r.useEffect)(()=>{i(new Date)},[o]),(0,s.jsx)(a.Provider,{value:{isConnected:o,lastConnectionUpdate:c,sendMessageAndWaitForCondition:function(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1500;return o?(d.current.send(JSON.stringify(e)),new Promise((e,s)=>{let r=n=>{let s=JSON.parse(n.data);if(t(s)){d.current.removeEventListener("message",r),clearTimeout(a);let t=s.message;s.message=JSON.parse(t),e(s)}},a=setTimeout(()=>{d.current.removeEventListener("message",r),s(Error("Timeout: Condition not met within ".concat(n," ms")))},n);d.current.addEventListener("message",r)})):Promise.reject(Error("WebSocket is not connected"))},sendMessageTillCondition:(e,t)=>{if(!o)throw Error("WebSocket is not connected");d.current.send(JSON.stringify(e));let n=e=>{let s=JSON.parse(e.data);t(s)&&d.current.removeEventListener("message",n)};d.current.addEventListener("message",n)},socket:d,sendMessage:e=>{if(!o)return Error("WebSocket is not connected");d.current.send(JSON.stringify(e))}},children:t})}},6595:function(e,t){"use strict";t.Z=function(e){if(null==e||""===e.trim())return"Key cannot be null or empty.";if(e.includes(" "))return"Key cannot contain spaces.";if(e.startsWith(".")||e.endsWith("."))return"Key cannot start or end with '.'";if(e.includes(".."))return"Key cannot contain multiple consecutive '.'";let t=e.split(".");for(let e of t)if(""===e.trim())return"Key contains empty part(s).";return null}}},function(e){e.O(0,[8123,434,6878,6789,8285,9683,2087,6986,7136,4959,4390,9626,9253,5769,1744],function(){return e(e.s=502)}),_N_E=e.O()}]);