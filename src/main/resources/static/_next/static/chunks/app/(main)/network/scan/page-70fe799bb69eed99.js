(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2081],{4397:function(e,t,s){Promise.resolve().then(s.bind(s,4059))},4059:function(e,t,s){"use strict";s.r(t);var n=s(9268),r=s(8176),a=s(8298),l=s(6006),c=s(7932),o=s(7537),i=s(7389),d=s(2469),u=s(3702),m=s(3621);t.default=()=>{var e;let{isConnected:t,lastConnectionUpdate:s,sendMessageAndWaitForCondition:x,socket:N}=(0,l.useContext)(o.WebsocketContext),[h,f]=(0,l.useState)(new Date),[v,g]=(0,l.useState)([]),[j,S]=(0,l.useState)("SHUTDOWN"),[b,p]=(0,l.useState)(!1),[E,y]=(0,l.useState)(!1),[T,w]=(0,l.useState)("Start the scanner to begin subnet scanning."),[O,C]=(0,l.useState)(0);return(0,l.useEffect)(()=>{let e=e=>{let t=JSON.parse(e.data);if("NETWORK-SUBNET-SCAN"===t.type){let e=JSON.parse(t.message),s=e.status;S(s),p(e.running),w(e.message),"CHECKING"===s?C(e=>e+1):"SHUTDOWN"===s?(p(!1),y(!1)):"FINISHED"===s||"STOPPING"===s?y(!0):"FOUND"===s&&g(t=>[...t,{hostname:null==e?void 0:e.hostname,address:null==e?void 0:e.address}])}};return N.current&&N.current.addEventListener("message",e),()=>{N.current.removeEventListener("message",e)}},[N.current,b]),(0,n.jsxs)("div",{className:"grid fadeIn",children:[(0,n.jsx)(c.Q,{}),(0,n.jsx)("div",{className:"col-12 lg:col-6 xl:col-3",children:(0,n.jsxs)("div",{className:"card mb-0",children:[(0,n.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Backend Status"}),(0,n.jsxs)("div",{className:"text-900 font-medium text-xl",children:[" ",t?"Connected":"Disconnected"]})]}),(0,n.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,n.jsx)("i",{className:"pi pi-chevron-circle-up text-blue-500 text-xl"})})]}),(0,n.jsx)(i.Z,{date:s})]})}),(0,n.jsx)("div",{className:"col-12 lg:col-6 xl:col-3",children:(0,n.jsxs)("div",{className:"card mb-0",children:[(0,n.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Total Found"}),(0,n.jsx)("div",{className:"text-900 font-medium text-xl",children:t?null!==(e=null==v?void 0:v.length)&&void 0!==e?e:0:"Disconnected"})]}),(0,n.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,n.jsx)("i",{className:"pi pi-android text-cyan-500 text-xl"})})]}),(0,n.jsx)(i.Z,{date:h})]})}),(0,n.jsx)("div",{className:"col-12 lg:col-6 xl:col-3",children:(0,n.jsxs)("div",{className:"card mb-0",children:[(0,n.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Total Scanned"}),(0,n.jsx)("div",{className:"text-900 font-medium text-xl ",children:t?null!=O?O:0:"Disconnected"})]}),(0,n.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,n.jsx)("i",{className:"pi pi-android text-cyan-500 text-xl"})})]}),(0,n.jsx)(i.Z,{date:h})]})}),(0,n.jsx)("div",{className:"col-12 lg:col-6 xl:col-3",children:(0,n.jsxs)("div",{className:"card mb-0",children:[(0,n.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Current Status"}),(0,n.jsx)("div",{className:"text-900 font-medium text-xl "+("SHUTDOWN"!==j&&"UNAVAILABLE"!==j&&"FAILED"!==j&&t?"CHECKING"===j||"STARTING"===j?"text-yellow-600 animate-pulse-fast":"FOUND"===j||"FINISHED"===j||"QUEUED"===j?"text-green-600":"STOPPING"===j?"text-red-600 animate-pulse-fast":"":"text-red-600"),children:t?null!=j?j:"Unknown":"Disconnected"})]}),(0,n.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,n.jsx)("i",{className:"pi pi-android text-cyan-500 text-xl"})})]}),(0,n.jsx)(i.Z,{date:h})]})}),(0,n.jsx)("div",{className:"col-12",children:(0,n.jsxs)("div",{className:"card flex items-center",children:[(0,n.jsx)(m.C,{className:"mr-2 ",onLabel:"Stop Scanner",offLabel:"Start Scanner",checked:b,disabled:E||!t,onClick:e=>{b?(y(!0),x({type:"NETWORK-STOP-SUBNET-SCAN"},e=>{var t;return"NETWORK-SUBNET-SCAN"===e.type&&(null===(t=JSON.parse(e.message))||void 0===t?void 0:t.status)==="STOPPING"}).catch(e=>{console.log(e),y(!1)})):(y(!0),p(!0),C(0),g([]),x({type:"NETWORK-START-SUBNET-SCAN"},e=>{var t;return"NETWORK-SUBNET-SCAN"===e.type&&(null===(t=JSON.parse(e.message))||void 0===t?void 0:t.status)==="STARTING"}).then(()=>{y(!1)}).catch(()=>{y(!1)}))}}),(0,n.jsx)("span",{className:"card-small flex-1",children:(0,n.jsx)("span",{className:"text-sm "+("SHUTDOWN"!==j&&"UNAVAILABLE"!==j&&"FAILED"!==j&&t?"CHECKING"===j||"STARTING"===j?"text-yellow-600 animate-pulse-fast":"FOUND"===j||"FINISHED"===j||"QUEUED"===j?"text-green-600":"STOPPING"===j?"text-red-600 animate-pulse-fast":"":"text-red-600"),children:T})})]})}),(0,n.jsx)("div",{className:"col-12",children:(0,n.jsx)("div",{className:"card",children:(0,n.jsxs)(r.w,{size:"normal",paginator:t&&(null==v?void 0:v.length)>0,showHeaders:t&&(null==v?void 0:v.length)>0,rowsPerPageOptions:[5,10,25,50],removableSort:!0,value:t?v:[],emptyMessage:(0,d.Z)({message:t?"No devices found on the network":"Connecting to backend"}),rows:5,children:[(0,n.jsx)(a.s,{frozen:!0,field:"hostname",filter:!0,header:"Hostname",style:{width:"50%"}}),(0,n.jsx)(a.s,{body:e=>(0,n.jsx)(u.z,{tooltip:"Open in new tab",tooltipOptions:{showDelay:100,position:"top",mouseTrack:!0},label:null==e?void 0:e.address,link:!0,onClick:()=>window.open("http://"+(null==e?void 0:e.address),"_blank")}),header:"Address",style:{width:"50%"}})]})})})]})}},7389:function(e,t,s){"use strict";s.d(t,{Z:function(){return l}});var n=s(9268),r=s(6006);let a=e=>{let t=new Date-new Date(e),s=Math.floor(t/1e3),n=Math.floor(s/31536e3);return n>1?"".concat(n," years ago"):(n=Math.floor(s/2592e3))>1?"".concat(n," months ago"):(n=Math.floor(s/86400))>1?"".concat(n," days ago"):(n=Math.floor(s/3600))>1?"".concat(n," hours ago"):(n=Math.floor(s/60))>1?"".concat(n," minutes ago"):s>=1?"".concat(s," seconds ago"):t>1?"".concat(t," milliseconds ago"):"just now"};var l=e=>{let{date:t,className:s}=e,[l,c]=(0,r.useState)("");return(0,r.useEffect)(()=>{c(a(t));let e=setInterval(()=>{c(a(t))},100);return()=>clearInterval(e)},[t]),(0,n.jsx)("span",{className:s,children:l})}},2469:function(e,t,s){"use strict";s.d(t,{Z:function(){return d}});var n=s(9268),r=s(7690),a=s(6006),l=s(9497),c=s.n(l);let o=e=>{let{delay:t=500}=e,[s,r]=(0,a.useState)("");return(0,a.useEffect)(()=>{let e=setInterval(()=>{r(e=>{switch(e){case"":return".";case".":return"..";case"..":return"...";default:return""}})},t);return()=>clearInterval(e)},[t]),(0,n.jsx)("span",{children:s})};o.propTypes={delay:c().number};let i=e=>{let{message:t,speed:s="normal",dotSpeed:a=400,...l}=e;return(0,n.jsxs)("div",{style:{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"},children:[(0,n.jsx)(r.E,{...l,className:"fast"===s?"animate-pulse-fast":"animate-pulse",alt:"XBOT ROBOTICS LOGO",src:"/images/logo/logo.png"}),t&&(0,n.jsxs)("p",{className:"font-bold",children:[null!=t?t:"Loading",(0,n.jsx)(o,{delay:a})]})]})};i.propType={message:c().number};var d=i},7537:function(e,t,s){"use strict";s.r(t),s.d(t,{WebSocketProvider:function(){return l},WebsocketContext:function(){return a}});var n=s(9268),r=s(6006);let a=(0,r.createContext)({}),l=e=>{let{children:t,url:s}=e,[l,c]=(0,r.useState)(!1),[o,i]=(0,r.useState)(new Date),d=(0,r.useRef)(null);return(0,r.useEffect)(()=>((function e(){console.log("Connecting to websocket"),d.current=new WebSocket(s),d.current.onopen=()=>{c(!0)},d.current.onclose=()=>(c(!1),console.log("Disconnected from websocket."),e()),d.current.onerror=e=>{console.error("WebSocket Error: ",e),d.current.close(),c(!1)}})(),()=>{d.current&&d.current.close()}),[s]),(0,r.useEffect)(()=>{i(new Date)},[l]),(0,n.jsx)(a.Provider,{value:{isConnected:l,lastConnectionUpdate:o,sendMessageAndWaitForCondition:function(e,t){let s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1500;return l?(d.current.send(JSON.stringify(e)),new Promise((e,n)=>{let r=s=>{let n=JSON.parse(s.data);if(t(n)){d.current.removeEventListener("message",r),clearTimeout(a);let t=n.message;n.message=JSON.parse(t),e(n)}},a=setTimeout(()=>{d.current.removeEventListener("message",r),n(Error("Timeout: Condition not met within ".concat(s," ms")))},s);d.current.addEventListener("message",r)})):Promise.reject(Error("WebSocket is not connected"))},sendMessageTillCondition:(e,t)=>{if(!l)throw Error("WebSocket is not connected");d.current.send(JSON.stringify(e));let s=e=>{let n=JSON.parse(e.data);t(n)&&d.current.removeEventListener("message",s)};d.current.addEventListener("message",s)},socket:d,sendMessage:e=>{if(!l)return Error("WebSocket is not connected");d.current.send(JSON.stringify(e))}},children:t})}}},function(e){e.O(0,[8123,434,6878,6789,8285,9933,845,2087,7136,9217,769,8920,9253,5769,1744],function(){return e(e.s=4397)}),_N_E=e.O()}]);