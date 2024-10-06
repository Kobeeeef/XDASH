(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1294],{6117:function(e,t,s){Promise.resolve().then(s.bind(s,6367))},6367:function(e,t,s){"use strict";s.r(t),s.d(t,{default:function(){return f}});var n=s(9268),r=s(6006),l=s(7537),a=s(7389),i=s(4046),c=s(6008),o=s(4390),d=s(3702),u=e=>{let{header:t,text:s,priority:r,link:l,__REALTIME_TIMESTAMP:i}=e,o=(0,c.useRouter)(),u=()=>{switch(r){case 5:default:return"info";case 4:return"warn";case 3:case 2:case 1:case 0:return"error"}};return(0,n.jsxs)("div",{className:"p-inline-message p-component p-inline-message-".concat(u()," my-2"),onClick:()=>{l&&o.push(l)},style:{cursor:"pointer",padding:"1rem",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[(0,n.jsx)("icon",{className:(()=>{if(r<=1)return"pi pi-exclamation-triangle";switch(u()){case"info":default:return"pi pi-info-circle";case"warn":return"pi pi-exclamation-circle";case"error":return"pi pi-times"}})(),style:{marginRight:"0.5rem",fontSize:"1.5rem"}}),(0,n.jsxs)("div",{style:{flexGrow:1,margin:"0 1rem"},children:[(0,n.jsxs)("div",{className:"flex items-center",children:[(0,n.jsx)("strong",{className:"text-xl",children:t}),(0,n.jsx)(a.Z,{refresh:50,date:i/1e3,className:"text-xs text-gray-400 ml-2 pt-2"})]}),(0,n.jsx)("div",{className:"p-inline-message-text",children:s})]}),(0,n.jsx)(d.z,{label:"View",text:!0,severity:"error"===u()?"danger":"warn"===u()?"warning":u(),className:"p-button-outlined p-button-sm"})]})},m=s(2819);s(2469);var x=s(2983),f=()=>{var e,t;let s=(0,r.useRef)(null),f=(0,c.useSearchParams)(),v=f.get("server"),[h,g]=(0,r.useState)(null),{latestLog:p,isConnected:N,lastConnectionUpdate:j,sendMessageAndWaitForCondition:E}=(0,r.useContext)(l.U),[b,w]=(0,r.useState)(new Date),[y,S]=(0,r.useState)({}),[C,O]=(0,r.useState)(!1),[k,T]=(0,r.useState)([]),[I,D]=(0,r.useState)(!0);function L(){D(!0),E({type:"DEVICE-LOGS",message:JSON.stringify({server:h||v,start:0,end:200})},e=>"DEVICE-LOGS"===e.type).then(e=>{D(!1),T(e.message)}).catch(e=>{s.current.show({severity:"error",summary:"Failed to load logs",detail:(null==e?void 0:e.message)||"Unknown Error!"}),D(!1)})}return(0,r.useEffect)(()=>{g(v)},[v]),(0,r.useEffect)(()=>{let e=setInterval(()=>{N&&E({type:"DEVICE-DATA",message:h},e=>"DEVICE-DATA"===e.type).then(e=>{var t;(null==e?void 0:null===(t=e.message)||void 0===t?void 0:t.exists)?(S(e.message),O(!1)):(D(!0),O(!0),S({}))}).catch(()=>{})},250);return()=>clearInterval(e)},[N,h]),(0,r.useEffect)(()=>{T(e=>[p,...e])},[p]),(0,r.useEffect)(()=>{N&&(null==y?void 0:y.status)==="CONNECTED"&&L()},[N,null==y?void 0:y.status,h]),(0,n.jsxs)("div",{className:"grid fadeIn",children:[(0,n.jsx)(i.F,{ref:s}),(0,n.jsx)(o.V,{header:"Machine Discovery Failed",modal:!1,visible:C,position:"top-right",style:{width:"50vw"},onHide:()=>{C&&O(!1)},closable:!1,draggable:!0,resizable:!1,children:(0,n.jsxs)("p",{className:"m-0",children:["The machine with the server name ",(0,n.jsx)("strong",{children:h})," was not found on the network running XCASTER. Please check your network connection, verify the machine is on and try again later."]})}),(0,n.jsx)("div",{className:"col-12 lg:col-6 sm:col-4 xl:col-3",children:(0,n.jsxs)("div",{className:"card mb-0",children:[(0,n.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Backend Status"}),(0,n.jsx)("div",{className:"text-900 font-medium text-xl "+(N?"text-green-600":"text-red-600 animate-pulse"),children:N?"Connected":"Disconnected"})]}),(0,n.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,n.jsx)("i",{className:"pi pi-chevron-circle-up text-blue-500 text-xl"})})]}),(0,n.jsx)(a.Z,{date:j})]})}),(0,n.jsx)("div",{className:"col-12 lg:col-6 sm:col-4 xl:col-3",children:(0,n.jsxs)("div",{className:"card mb-0",children:[(0,n.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Machine Server"}),(0,n.jsx)("div",{className:"text-900 font-medium text-xl "+(N&&h?(null==y?void 0:y.status)==="CONNECTED"?"text-green-600":(null==y?void 0:y.status)==="CONNECTING"?"animate-pulse-fast text-yellow-500":"animate-pulse text-red-600":"animate-pulse text-red-600"),children:N?null!=h?h:"Unknown":"Disconnected"})]}),(0,n.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,n.jsx)("i",{className:"pi pi-desktop text-blue-500 text-xl"})})]}),(0,n.jsx)(a.Z,{date:b})]})}),(0,n.jsx)("div",{className:"col-12 lg:col-6 xl:col-3",children:(0,n.jsxs)("div",{className:"card mb-0",children:[(0,n.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Hostname"}),(0,n.jsx)("div",{className:"text-900 font-medium text-xl "+(N&&h&&(null==y?void 0:y.hostname)?(null==y?void 0:y.status)==="CONNECTED"?"text-green-600":(null==y?void 0:y.status)==="CONNECTING"?"animate-pulse-fast text-yellow-500":"animate-pulse text-red-600":"animate-pulse text-red-600"),children:N&&null!==(e=null==y?void 0:y.hostname)&&void 0!==e?e:"Unknown"})]}),(0,n.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,n.jsx)("i",{className:"pi pi-address-book text-blue-500 text-xl"})})]}),(0,n.jsx)(a.Z,{date:b})]})}),(0,n.jsx)("div",{className:"col-12 lg:col-6 xl:col-3",children:(0,n.jsxs)("div",{className:"card mb-0",children:[(0,n.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{className:"block text-500 font-medium mb-3",children:"IP Address"}),(0,n.jsx)("div",{className:"text-900 font-medium text-xl "+(N&&h&&(null==y?void 0:y.address)?(null==y?void 0:y.status)==="CONNECTED"?"text-green-600":(null==y?void 0:y.status)==="CONNECTING"?"animate-pulse-fast text-yellow-500":"animate-pulse text-red-600":"animate-pulse text-red-600"),children:N&&null!==(t=null==y?void 0:y.address)&&void 0!==t?t:"Unknown"})]}),(0,n.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,n.jsx)("i",{className:"pi pi-map-marker text-blue-500 text-xl"})})]}),(0,n.jsx)(a.Z,{date:b})]})}),(0,n.jsx)("div",{className:"col-12",children:(0,n.jsx)("div",{className:"card mb-0",children:(0,n.jsx)(m.VO,{rows:5,paginatorTemplate:"RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink",rowsPerPageOptions:[5,10,25,50],paginatorLeft:()=>(0,n.jsx)(d.z,{icon:"pi pi-refresh",text:!0,loading:I,disabled:!N||(null==y?void 0:y.status)!=="CONNECTED",onClick:L}),loading:I,paginator:!0,value:k,listTemplate:(e,t)=>{if(!e||0===e.length)return null;let s=e.filter(e=>(null==e?void 0:e.PRIORITY)&&(null==e?void 0:e.MESSAGE)).map((e,t)=>(0,n.jsx)("div",{className:"col-12",children:(0,n.jsx)(u,{__REALTIME_TIMESTAMP:null==e?void 0:e.__REALTIME_TIMESTAMP,priority:null==e?void 0:e.PRIORITY,text:x.truncateString(null==e?void 0:e.MESSAGE,100),header:(null==e?void 0:e._COMM)||(null==e?void 0:e._SYSTEMD_UNIT)||(null==e?void 0:e.system)||(null==e?void 0:e._CMDLINE)||(null==e?void 0:e.SYSLOG_IDENTIFIER)||"unknown source"})},t));return(0,n.jsx)("div",{className:"grid grid-nogutter",children:s})}})})})]})}},7389:function(e,t,s){"use strict";s.d(t,{Z:function(){return a}});var n=s(9268),r=s(6006);let l=e=>{let t=new Date-new Date(e),s=Math.floor(t/1e3),n=Math.floor(s/31536e3);return n>1?"".concat(n," years ago"):(n=Math.floor(s/2592e3))>1?"".concat(n," months ago"):(n=Math.floor(s/86400))>1?"".concat(n," days ago"):(n=Math.floor(s/3600))>1?"".concat(n," hours ago"):(n=Math.floor(s/60))>1?"".concat(n," minutes ago"):s>=1?"".concat(s," seconds ago"):t>1?"".concat(t," milliseconds ago"):"just now"};var a=e=>{let{date:t,className:s,refresh:a=100}=e,[i,c]=(0,r.useState)("");return(0,r.useEffect)(()=>{c(l(t));let e=setInterval(()=>{c(l(t))},a);return()=>clearInterval(e)},[t,a]),(0,n.jsx)("span",{className:s,children:i})}},2469:function(e,t,s){"use strict";s.d(t,{Z:function(){return d}});var n=s(9268),r=s(7690),l=s(6006),a=s(9497),i=s.n(a);let c=e=>{let{delay:t=500}=e,[s,r]=(0,l.useState)("");return(0,l.useEffect)(()=>{let e=setInterval(()=>{r(e=>{switch(e){case"":return".";case".":return"..";case"..":return"...";default:return""}})},t);return()=>clearInterval(e)},[t]),(0,n.jsx)("span",{children:s})};c.propTypes={delay:i().number};let o=e=>{let{message:t,speed:s="normal",dotSpeed:l=400,...a}=e;return(0,n.jsxs)("div",{style:{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"},children:[(0,n.jsx)(r.E,{...a,className:"fast"===s?"animate-pulse-fast":"animate-pulse",alt:"XBOT ROBOTICS LOGO",src:"/images/logo/logo.png"}),t&&(0,n.jsxs)("p",{className:"font-bold",children:[null!=t?t:"Loading",(0,n.jsx)(c,{delay:l})]})]})};o.propType={message:i().number};var d=o},7537:function(e,t,s){"use strict";s.d(t,{U:function(){return l},q:function(){return a}});var n=s(9268),r=s(6006);let l=(0,r.createContext)({}),a=e=>{let{children:t,url:s}=e,[a,i]=(0,r.useState)(!1),[c,o]=(0,r.useState)(new Date),d=(0,r.useRef)(null),[u,m]=(0,r.useState)(null);return(0,r.useEffect)(()=>((function e(){console.log("Connecting to websocket"),d.current=new WebSocket(s),d.current.onopen=()=>{i(!0)},d.current.onclose=()=>(i(!1),console.log("Disconnected from websocket."),e()),d.current.onerror=e=>{console.error("WebSocket Error: ",e),d.current.close(),i(!1)}})(),()=>{d.current&&d.current.close()}),[s]),(0,r.useEffect)(()=>{o(new Date)},[a]),(0,r.useEffect)(()=>{let e=e=>{let t=JSON.parse(e.data);if("DEVICE-ERROR-LOG"===t.type){let e=JSON.parse(t.message);m(e)}};return d.current&&d.current.addEventListener("message",e),()=>{d.current.removeEventListener("message",e)}},[d.current]),(0,n.jsx)(l.Provider,{value:{isConnected:a,lastConnectionUpdate:c,sendMessageAndWaitForCondition:function(e,t){let s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1500;return a?(d.current.send(JSON.stringify(e)),new Promise((e,n)=>{let r=s=>{let n=JSON.parse(s.data);if(t(n)){d.current.removeEventListener("message",r),clearTimeout(l);let t=n.message;n.message=JSON.parse(t),e(n)}},l=setTimeout(()=>{d.current.removeEventListener("message",r),n(Error("Timeout: Condition not met within ".concat(s," ms")))},s);d.current.addEventListener("message",r)})):Promise.reject(Error("WebSocket is not connected"))},sendMessageTillCondition:(e,t)=>{if(!a)throw Error("WebSocket is not connected");d.current.send(JSON.stringify(e));let s=e=>{let n=JSON.parse(e.data);t(n)&&d.current.removeEventListener("message",s)};d.current.addEventListener("message",s)},listenTillCondition:e=>a?new Promise(t=>{let s=n=>{let r=JSON.parse(n.data);e(r)&&(d.current.removeEventListener("message",s),t(r))};d.current.addEventListener("message",s)}):Promise.reject(Error("WebSocket is not connected")),socket:d,latestLog:u,sendMessage:e=>{if(!a)return Error("WebSocket is not connected");d.current.send(JSON.stringify(e))}},children:t})}},2983:function(e){"use strict";e.exports.truncateString=function(e,t){return e.length>t?e.slice(0,t)+"...":e}}},function(e){e.O(0,[434,6878,6789,8285,9933,845,439,9217,7003,4046,769,8495,9253,5769,1744],function(){return e(e.s=6117)}),_N_E=e.O()}]);