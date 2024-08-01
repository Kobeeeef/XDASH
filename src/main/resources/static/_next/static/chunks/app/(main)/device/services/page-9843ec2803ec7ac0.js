(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9467],{3838:function(e,t,s){Promise.resolve().then(s.bind(s,7208))},7208:function(e,t,s){"use strict";s.r(t);var n=s(9268),r=s(6006),a=s(7537),i=s(7389),l=s(3429),o=s(8176),c=s(8298),d=s(4046),u=s(6008),m=s(4390),v=s(3702),x=s(2469);t.default=()=>{var e,t,s,h;let f=(0,r.useRef)(null),g=(0,u.useSearchParams)(),p=g.get("server"),[N,j]=(0,r.useState)(null),[b,y]=(0,r.useState)(!1),[w,E]=(0,r.useState)(!1),{isConnected:S,lastConnectionUpdate:C,sendMessageAndWaitForCondition:k}=(0,r.useContext)(a.WebsocketContext),[T,D]=(0,r.useState)(new Date),[I,O]=(0,r.useState)({}),[P,R]=(0,r.useState)(!1),[M,A]=(0,r.useState)([]);function L(){if(S){let e=new Date;y(!0),A([]),k({type:"DEVICE-SERVICES-DATA",message:N},e=>"DEVICE-SERVICES-DATA"===e.type).then(t=>{let s=new Date,n=JSON.parse(t.message.services);A(n),setTimeout(()=>{y(!1)},Math.max(2e3-(s-e),0))}).catch(e=>{f.current.show({severity:"error",summary:"Failed to reload",detail:e}),y(!1)})}}return(0,r.useEffect)(()=>{j(p)},[p]),(0,r.useEffect)(()=>{let e=setInterval(()=>{S&&k({type:"DEVICE-DATA",message:N},e=>"DEVICE-DATA"===e.type).then(e=>{var t;(null==e?void 0:null===(t=e.message)||void 0===t?void 0:t.exists)?(O(e.message),R(!1)):(R(!0),O({}))}).catch(()=>{})},250);return()=>clearInterval(e)},[S,N]),(0,n.jsxs)("div",{className:"grid fadeIn",children:[(0,n.jsx)(d.F,{ref:f}),(0,n.jsx)(m.V,{header:"Machine Discovery Failed",modal:!1,visible:P,position:"top-right",style:{width:"50vw"},onHide:()=>{P&&R(!1)},closable:!1,draggable:!0,resizable:!1,children:(0,n.jsxs)("p",{className:"m-0",children:["The machine with the server name ",(0,n.jsx)("strong",{children:N})," was not found on the network running XCASTER. Please check your network connection, verify the machine is on and try again later."]})}),(0,n.jsx)("div",{className:"col-12 lg:col-6 sm:col-4 xl:col-3",children:(0,n.jsxs)("div",{className:"card mb-0",children:[(0,n.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Backend Status"}),(0,n.jsx)("div",{className:"text-900 font-medium text-xl "+(S?"text-green-600":"text-red-600 animate-pulse"),children:S?"Connected":"Disconnected"})]}),(0,n.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,n.jsx)("i",{className:"pi pi-chevron-circle-up text-blue-500 text-xl"})})]}),(0,n.jsx)(i.Z,{date:C})]})}),(0,n.jsx)("div",{className:"col-12 lg:col-6 sm:col-4 xl:col-3",children:(0,n.jsxs)("div",{className:"card mb-0",children:[(0,n.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Machine Server"}),(0,n.jsx)("div",{className:"text-900 font-medium text-xl "+(S&&N?(null==I?void 0:I.status)==="CONNECTED"?"text-green-600":(null==I?void 0:I.status)==="CONNECTING"?"animate-pulse-fast text-yellow-500":"animate-pulse text-red-600":"animate-pulse text-red-600"),children:S?null!=N?N:"Unknown":"Disconnected"})]}),(0,n.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,n.jsx)("i",{className:"pi pi-desktop text-blue-500 text-xl"})})]}),(0,n.jsx)(i.Z,{date:T})]})}),(0,n.jsx)("div",{className:"col-12 lg:col-6 xl:col-3",children:(0,n.jsxs)("div",{className:"card mb-0",children:[(0,n.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Hostname"}),(0,n.jsx)("div",{className:"text-900 font-medium text-xl "+(S&&N&&(null==I?void 0:I.hostname)?(null==I?void 0:I.status)==="CONNECTED"?"text-green-600":(null==I?void 0:I.status)==="CONNECTING"?"animate-pulse-fast text-yellow-500":"animate-pulse text-red-600":"animate-pulse text-red-600"),children:S&&null!==(e=null==I?void 0:I.hostname)&&void 0!==e?e:"Unknown"})]}),(0,n.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,n.jsx)("i",{className:"pi pi-address-book text-blue-500 text-xl"})})]}),(0,n.jsx)(i.Z,{date:T})]})}),(0,n.jsx)("div",{className:"col-12 lg:col-6 xl:col-3",children:(0,n.jsxs)("div",{className:"card mb-0",children:[(0,n.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{className:"block text-500 font-medium mb-3",children:"IP Address"}),(0,n.jsx)("div",{className:"text-900 font-medium text-xl "+(S&&N&&(null==I?void 0:I.address)?(null==I?void 0:I.status)==="CONNECTED"?"text-green-600":(null==I?void 0:I.status)==="CONNECTING"?"animate-pulse-fast text-yellow-500":"animate-pulse text-red-600":"animate-pulse text-red-600"),children:S&&null!==(t=null==I?void 0:I.address)&&void 0!==t?t:"Unknown"})]}),(0,n.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,n.jsx)("i",{className:"pi pi-map-marker text-blue-500 text-xl"})})]}),(0,n.jsx)(i.Z,{date:T})]})}),(0,n.jsx)("div",{className:"col-12",children:(0,n.jsx)("div",{className:"card mb-0",children:(0,n.jsxs)(o.w,{showGridlines:!1,emptyMessage:(0,x.Z)({message:b&&(null!=M?M:[]).length>0?"Loading resources":b?"Requesting resources":S?(null==I?void 0:I.exists)?(null==I?void 0:I.status)!=="CONNECTED"?"Connecting to machine":"No resources found":"Machine not running XCASTER":"Connecting to backend",speed:(null==I?void 0:I.status)==="CONNECTING"?"fast":"normal"}),value:!b&&0!==(null!=M?M:[]).length&&S&&(null==I?void 0:I.status)==="CONNECTED"&&(null==I?void 0:I.exists)?M:[],paginator:!0,rows:5,rowsPerPageOptions:[5,10,25,50,75],tableStyle:{minWidth:"50rem"},paginatorTemplate:"RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink",currentPageReportTemplate:"{first} to {last} of {totalRecords}",paginatorLeft:()=>(0,n.jsx)(v.z,{disabled:!S||(null==I?void 0:I.status)!=="CONNECTED",loading:b||w,type:"button",icon:"pi pi-refresh",text:!0,onClick:L}),children:[(0,n.jsx)(c.s,{filter:!0,field:"id",frozen:!0,header:"Name",style:{width:"16%"}},"id"),(0,n.jsx)(c.s,{filter:!0,field:"execMainPID",header:"PID",style:{width:"16%"}},"execMainPID"),(0,n.jsx)(c.s,{filter:!0,body:e=>(0,n.jsx)(l.V,{className:(null==e?void 0:e.activeState)==="active"?"glow-green-weak":(null==e?void 0:e.activeState)==="inactive"?"animate-pulse":(null==e?void 0:e.activeState)==="activating"||(null==e?void 0:e.activeState)==="reloading"||(null==e?void 0:e.activeState)==="maintenance"?"animate-pulse-fast":"",severity:(null==e?void 0:e.activeState)==="active"?"success":(null==e?void 0:e.activeState)==="inactive"?"danger":(null==e?void 0:e.status)==="activating"||(null==e?void 0:e.activeState)==="reloading"||(null==e?void 0:e.activeState)==="maintenance"?"warning":"danger",value:null!==(s=null==e?void 0:e.activeState)&&void 0!==s?s:"Unknown",rounded:!0}),header:"Status",style:{width:"16%"}},"status"),(0,n.jsx)(c.s,{body:e=>(0,n.jsx)("span",{children:(null==e?void 0:e.memoryCurrent)===0?"Unknown":null!==(h=null==e?void 0:e.memoryCurrent)&&void 0!==h?h:"Unknown"}),header:"Memory",style:{width:"16%"}},"memory"),(0,n.jsx)(c.s,{field:"cpuUsageNSec",header:"CPU",style:{width:"16%"}},"cpu"),(0,n.jsx)(c.s,{field:"execMainStartTimestamp",header:"Timestamp",style:{width:"16%"}},"timestamp"),(0,n.jsx)(c.s,{header:"Restart",body:e=>(0,n.jsx)(v.z,{className:"text-red-500",loading:b||w,disabled:!S||"active"!==e.activeState||(null==I?void 0:I.status)!=="CONNECTED",icon:"pi pi-sync",text:!0,onClick:()=>(function(e){if(!N){f.current.show({severity:"error",summary:"Server Not Found!",detail:"The server was not found."});return}if(!e){f.current.show({severity:"error",summary:"Service Not Found!",detail:"The service was not found."});return}E(!0),k({type:"DEVICE-SERVICE-RESTART",message:JSON.stringify({server:N,serviceID:e})},e=>"DEVICE-SERVICE-RESTART"===e.type,1e4).then(e=>{E(!1),f.current.show({severity:"success",summary:"Service Daemon Restarted!",detail:"The service has been restarted."}),L()}).catch(e=>{let t=e.message||"An unexpected error occurred.";f.current.show({severity:"error",summary:"Failed to restart",detail:t}),E(!1),L()})})(e.id)})},"restart")]})})})]})}},7389:function(e,t,s){"use strict";s.d(t,{Z:function(){return i}});var n=s(9268),r=s(6006);let a=e=>{let t=new Date-new Date(e),s=Math.floor(t/1e3),n=Math.floor(s/31536e3);return n>1?"".concat(n," years ago"):(n=Math.floor(s/2592e3))>1?"".concat(n," months ago"):(n=Math.floor(s/86400))>1?"".concat(n," days ago"):(n=Math.floor(s/3600))>1?"".concat(n," hours ago"):(n=Math.floor(s/60))>1?"".concat(n," minutes ago"):s>=1?"".concat(s," seconds ago"):t>1?"".concat(t," milliseconds ago"):"just now"};var i=e=>{let{date:t,className:s}=e,[i,l]=(0,r.useState)("");return(0,r.useEffect)(()=>{l(a(t));let e=setInterval(()=>{l(a(t))},100);return()=>clearInterval(e)},[t]),(0,n.jsx)("span",{className:s,children:i})}},2469:function(e,t,s){"use strict";s.d(t,{Z:function(){return d}});var n=s(9268),r=s(7690),a=s(6006),i=s(9497),l=s.n(i);let o=e=>{let{delay:t=500}=e,[s,r]=(0,a.useState)("");return(0,a.useEffect)(()=>{let e=setInterval(()=>{r(e=>{switch(e){case"":return".";case".":return"..";case"..":return"...";default:return""}})},t);return()=>clearInterval(e)},[t]),(0,n.jsx)("span",{children:s})};o.propTypes={delay:l().number};let c=e=>{let{message:t,speed:s="normal",dotSpeed:a=400}=e;return(0,n.jsxs)("div",{style:{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"},children:[(0,n.jsx)(r.E,{className:"fast"===s?"animate-pulse-fast":"animate-pulse",alt:"XBOT ROBOTICS LOGO",src:"/images/logo/logo.png"}),t&&(0,n.jsxs)("p",{className:"font-bold",children:[null!=t?t:"Loading",(0,n.jsx)(o,{delay:a})]})]})};c.propType={message:l().number};var d=c},7537:function(e,t,s){"use strict";s.r(t),s.d(t,{WebSocketProvider:function(){return i},WebsocketContext:function(){return a}});var n=s(9268),r=s(6006);let a=(0,r.createContext)({}),i=e=>{let{children:t,url:s}=e,[i,l]=(0,r.useState)(!1),[o,c]=(0,r.useState)(new Date),d=(0,r.useRef)(null);return(0,r.useEffect)(()=>((function e(){console.log("Connecting to websocket"),d.current=new WebSocket(s),d.current.onopen=()=>{l(!0)},d.current.onclose=()=>(l(!1),console.log("Disconnected from websocket."),e()),d.current.onerror=e=>{console.error("WebSocket Error: ",e),d.current.close(),l(!1)}})(),()=>{d.current&&d.current.close()}),[s]),(0,r.useEffect)(()=>{c(new Date)},[i]),(0,n.jsx)(a.Provider,{value:{isConnected:i,lastConnectionUpdate:o,sendMessageAndWaitForCondition:function(e,t){let s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1500;return i?(d.current.send(JSON.stringify(e)),new Promise((e,n)=>{let r=s=>{let n=JSON.parse(s.data);if(t(n)){d.current.removeEventListener("message",r),clearTimeout(a);let t=n.message;n.message=JSON.parse(t),e(n)}},a=setTimeout(()=>{d.current.removeEventListener("message",r),n(Error("Timeout: Condition not met within ".concat(s," ms")))},s);d.current.addEventListener("message",r)})):Promise.reject(Error("WebSocket is not connected"))},sendMessageTillCondition:(e,t)=>{if(!i)throw Error("WebSocket is not connected");d.current.send(JSON.stringify(e));let s=e=>{let n=JSON.parse(e.data);t(n)&&d.current.removeEventListener("message",s)};d.current.addEventListener("message",s)},socket:d,sendMessage:e=>{if(!i)return Error("WebSocket is not connected");d.current.send(JSON.stringify(e))}},children:t})}}},function(e){e.O(0,[8123,434,6878,6789,8285,9933,845,2087,7994,7136,4390,769,7831,9253,5769,1744],function(){return e(e.s=3838)}),_N_E=e.O()}]);