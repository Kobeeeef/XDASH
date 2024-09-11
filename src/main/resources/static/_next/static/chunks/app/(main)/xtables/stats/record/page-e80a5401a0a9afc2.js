(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5481],{67:function(){},2061:function(){},7961:function(e,t,n){Promise.resolve().then(n.bind(n,1035))},1035:function(e,t,n){"use strict";n.r(t);var l=n(9268),s=n(6006),r=n(8671),a=n(7490),i=n(3702),o=n(439),c=n(3621),d=n(7537),u=n(7389),v=n(845),m=n(4046),h=n(4390),x=n(315),p=n(5942),f=n(6595),g=n(8176),b=n(8298),y=n(2059),j=n(9593);t.default=()=>{var e,t,n,S,N,k,w,C,A;let E=(0,s.useRef)(),[T,D]=(0,s.useState)({}),[M,O]=(0,s.useState)(!1),{isConnected:L,lastConnectionUpdate:P,sendMessageAndWaitForCondition:V}=(0,s.useContext)(d.WebsocketContext),[W,I]=(0,s.useState)(!1),[R,_]=(0,s.useState)(new Date),[J,B]=(0,s.useState)({}),[K,Z]=(0,s.useState)({name:"Line Chart",type:"line"}),{layoutConfig:z}=(0,s.useContext)(r.V),F=(0,s.useRef)(null),[X,H]=(0,s.useState)(1e3),[U,q]=(0,s.useState)(!1),[G,Q]=(0,s.useState)([]),Y=getComputedStyle(document.documentElement),[$,ee]=(0,s.useState)(null),[et,en]=(0,s.useState)(""),[el,es]=(0,s.useState)();(0,s.useEffect)(()=>{let e=setInterval(()=>{L&&V({type:"XTABLES-DATA"},e=>"XTABLES-DATA"===e.type).then(e=>{if(I(t=>{var n,l,s,r;return(null==e?void 0:null===(n=e.message)||void 0===n?void 0:n.connected)!==t&&(_(new Date),e.message.connected?(0,j.On)():(0,j.rd)()),(null==e?void 0:null===(l=e.message)||void 0===l?void 0:l.connected)||q(!1),null!==(r=null==e?void 0:null===(s=e.message)||void 0===s?void 0:s.connected)&&void 0!==r&&r}),U){let t=new Date().toISOString(),n=function(e){let t=function(e){let n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return Object.entries(e).map(e=>{let[l,s]=e,r={key:n?"".concat(n,".").concat(l):l,name:l};return"object"==typeof s&&null!==s?(s.hasOwnProperty("value")&&(r.value=s.value,r.type=(typeof JSON.parse(s.value)).toString()),s.data&&(r.data=t(s.data,r.key))):(r.value=s,r.type=(typeof JSON.parse(s)).toString()),r})};return t(e)}(JSON.parse(e.message.json))||[],l=(e,t)=>{for(let n of e){if(n.key===t)return n;if(n.data){let e=l(n.data,t);if(e)return e}}return null};es(e=>{let s={time:t};return G.forEach(e=>{let t=l(n,e);t&&(s[t.key]=null==t?void 0:t.value)}),[s,...e||[]]}),B(e=>{var s,r;let a=!1,i=((null===(s=e.lineData)||void 0===s?void 0:s.datasets)||[]).map(e=>({...e})),o=[...(null===(r=e.lineData)||void 0===r?void 0:r.labels)||[]];return(G.forEach(e=>{let t=i.find(t=>t.label===e),s=l(n,e),r=null==s?void 0:s.value;s&&(t||(t={label:e,data:[],fill:!1,tension:.4},i.push(t)),t.data=[...t.data||[],r],a=!0)}),a)?(o.push(t),{lineData:{labels:o,datasets:i}}):e})}}).catch(()=>{})},X),t=setInterval(()=>{L&&V({type:"XTABLES-STATUS"},e=>"XTABLES-STATUS"===e.type).then(e=>{I(t=>{var n,l,s;return(null==e?void 0:null===(n=e.message)||void 0===n?void 0:n.connected)!==t&&_(new Date),null!==(s=null==e?void 0:null===(l=e.message)||void 0===l?void 0:l.connected)&&void 0!==s&&s})}).catch(()=>{})},500);return()=>{clearInterval(e),clearInterval(t)}},[L,V,X,U]),(0,s.useEffect)(()=>{let e=Y.getPropertyValue("--text-color")||"#495057",t=Y.getPropertyValue("--text-color-secondary")||"#6c757d",n=Y.getPropertyValue("--surface-border")||"#dfe7ef";D({lineOptions:{plugins:{legend:{labels:{color:e}}},scales:{x:{ticks:{color:t},grid:{color:n},border:{display:!1}},y:{ticks:{color:t},grid:{color:n},border:{display:!1}}}}})},[z]);let er=(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(i.z,{label:"Cancel",icon:"pi pi-times",text:!0,onClick:()=>{O(!1),en(null)}}),(0,l.jsx)(i.z,{disabled:null!==(0,f.Z)(et),label:"Save",icon:"pi pi-check",onClick:()=>{O(!1),Q(e=>(e.push(et),e)),en(null)}})]});return(0,l.jsxs)("div",{className:"grid p-fluid fadeIn",children:[(0,l.jsx)(m.F,{ref:F}),(0,l.jsx)(h.V,{style:{width:"450px"},visible:M,header:"Key Details",modal:!0,className:"p-fluid",footer:er,onHide:()=>{O(!1),en(null)},children:(0,l.jsxs)("div",{className:"field",children:[(0,l.jsx)("label",{htmlFor:"key",children:"Key Name"}),(0,l.jsx)(x.o,{id:"key",value:et,onChange:e=>{en(e.target.value)},required:!0,autoFocus:!0,className:(0,p.AK)({"p-invalid":null!==(0,f.Z)(et)})}),null===(0,f.Z)(et)?null:(0,l.jsx)("small",{className:"p-invalid",children:(0,f.Z)(et)})]})}),(0,l.jsx)("div",{className:"col-12 lg:col-6 xl:col-4",children:(0,l.jsxs)("div",{className:"card mb-0",children:[(0,l.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,l.jsxs)("div",{children:[(0,l.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Backend Status"}),(0,l.jsxs)("div",{className:"text-900 font-medium text-xl "+(L?"text-green-600":"text-red-600 animate-pulse"),children:[" ",L?"Connected":"Disconnected"]})]}),(0,l.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,l.jsx)("i",{className:"pi pi-chevron-circle-up text-blue-500 text-xl"})})]}),(0,l.jsx)(u.Z,{date:P})]})}),(0,l.jsx)("div",{className:"col-12 lg:col-6 xl:col-4",children:(0,l.jsxs)("div",{className:"card mb-0",children:[(0,l.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,l.jsxs)("div",{children:[(0,l.jsx)("span",{className:"block text-500 font-medium mb-3",children:"XTABLES Status"}),(0,l.jsx)("div",{className:"text-900 font-medium text-xl "+(L&&W?"text-green-600":"text-red-600 animate-pulse"),children:L&&W?"Connected":"Disconnected"})]}),(0,l.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,l.jsx)("i",{className:"pi pi-table text-blue-500 text-xl"})})]}),(0,l.jsx)(u.Z,{date:R})]})}),(0,l.jsx)("div",{className:"col-12 lg:col-6 xl:col-4",children:(0,l.jsxs)("div",{className:"card mb-0",children:[(0,l.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,l.jsxs)("div",{children:[(0,l.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Intervals Recorded"}),(0,l.jsx)("div",{className:"text-900 font-medium text-xl",children:null!==(n=null==el?void 0:el.length)&&void 0!==n?n:0})]}),(0,l.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,l.jsx)("i",{className:"pi pi-database text-blue-500 text-xl"})})]}),(0,l.jsx)(u.Z,{date:R})]})}),(0,l.jsx)("div",{className:"col-12",children:(0,l.jsx)("div",{className:"card",children:(0,l.jsxs)("div",{className:"grid",children:[(0,l.jsx)("div",{className:"col-12 lg:col-3",children:(0,l.jsx)(i.z,{disabled:U||!L||!W,label:"Add",icon:"pi pi-plus",onClick:()=>{O(!0)}})}),(0,l.jsx)("div",{className:"col-12 md:col-3",children:(0,l.jsxs)("div",{className:"p-inputgroup",children:[(0,l.jsx)(i.z,{onClick:()=>{Q(e=>{let t=e.indexOf($);return -1===t?(F.current.show({severity:"error",summary:"Failure",detail:"The key was not found."}),e):(e.splice(t,1).length>0?(ee(null),F.current.show({severity:"success",summary:"Success",detail:"The key was removed."})):F.current.show({severity:"error",summary:"Failure",detail:"The key could not be removed."}),e)}),ee(null)},disabled:U||!L||!W||!(null==G?void 0:G.length),severity:"danger",label:"Remove"}),(0,l.jsx)(v.L,{disabled:U||!L||!W||!(null==G?void 0:G.length),value:$,onChange:e=>{ee(e.value)},options:G,placeholder:"Delete Key"})]})}),(0,l.jsx)("div",{className:"col-12 lg:col-3 ",children:(0,l.jsx)(o.R,{disabled:U||!L||!W,value:X,onValueChange:e=>H(null!==(S=e.value)&&void 0!==S?S:100),suffix:" millisecond".concat(X>1?"s":""," per record")})}),(0,l.jsx)("div",{className:"col-12 lg:col-3 ",children:(0,l.jsx)(v.L,{disabled:U||!L||!W,value:K,onChange:e=>{Z(e.value)},options:[{name:"Line Chart",type:"line"},{name:"Bar Chart",type:"bar"},{name:"Radar Chart",type:"radar"},{name:"Polar Area",type:"polarArea"},{name:"Pie Chart",type:"pie"},{name:"Doughnut Chart",type:"doughnut"}],optionLabel:"name",placeholder:"Select Chart"})}),(0,l.jsx)("div",{className:"col-6",children:(0,l.jsx)(i.z,{disabled:!L||!W||U||!(null==J?void 0:null===(t=J.lineData)||void 0===t?void 0:null===(e=t.labels)||void 0===e?void 0:e.length)&&!(null===(N=null==el?void 0:el.length)||void 0===N||N)&&!(null===(k=null==G?void 0:G.length)||void 0===k||k),label:"Reset",severity:"danger",onClick:()=>{B({}),es([]),Q([]),F.current.show({severity:"success",summary:"Success",detail:"All settings and charts reset."})}})}),(0,l.jsx)("div",{className:"col-6",children:(0,l.jsx)(c.C,{disabled:!L||!W||!(null==G?void 0:G.length),onLabel:"Stop Recording",offLabel:"Start Recording",checked:U,onChange:e=>q(e.value)})})]})})}),(0,l.jsx)("div",{className:"col-12",children:(0,l.jsx)("div",{className:"card",children:(0,l.jsx)(a.k,{type:null!==(w=null==K?void 0:K.type)&&void 0!==w?w:"line",data:J.lineData,options:T.lineOptions})})}),(0,l.jsx)("div",{className:"col-12",children:(0,l.jsx)("div",{className:"card",children:(0,l.jsxs)("div",{className:"grid",children:[(0,l.jsx)("div",{className:"col-6",children:(0,l.jsx)(i.z,{disabled:(null!==(C=null==el?void 0:el.length)&&void 0!==C?C:0)===0,label:"Export CSV",icon:"pi pi-file",onClick:()=>{E.current.exportCSV({selectionOnly:!1})}})}),(0,l.jsx)("div",{className:"col-6",children:(0,l.jsx)(i.z,{disabled:(null!==(A=null==el?void 0:el.length)&&void 0!==A?A:0)===0,severity:"success",label:"Export Excel",icon:"pi pi-file-excel",onClick:()=>{(0,y.r)("XTABLES-GRAPHS",el)}})}),(0,l.jsx)("div",{className:"col-12",children:(0,l.jsxs)(g.w,{scrollable:!0,virtualScrollerOptions:{itemSize:15},scrollHeight:"500px",ref:E,emptyMessage:"There is no data recorded.",value:el,children:[(0,l.jsx)(b.s,{field:"time",header:"Time"}),G.map((e,t)=>(0,l.jsx)(b.s,{field:e,header:e},t))]})})]})})})]})}},7389:function(e,t,n){"use strict";n.d(t,{Z:function(){return a}});var l=n(9268),s=n(6006);let r=e=>{let t=new Date-new Date(e),n=Math.floor(t/1e3),l=Math.floor(n/31536e3);return l>1?"".concat(l," years ago"):(l=Math.floor(n/2592e3))>1?"".concat(l," months ago"):(l=Math.floor(n/86400))>1?"".concat(l," days ago"):(l=Math.floor(n/3600))>1?"".concat(l," hours ago"):(l=Math.floor(n/60))>1?"".concat(l," minutes ago"):n>=1?"".concat(n," seconds ago"):t>1?"".concat(t," milliseconds ago"):"just now"};var a=e=>{let{date:t,className:n}=e,[a,i]=(0,s.useState)("");return(0,s.useEffect)(()=>{i(r(t));let e=setInterval(()=>{i(r(t))},100);return()=>clearInterval(e)},[t]),(0,l.jsx)("span",{className:n,children:a})}},8671:function(e,t,n){"use strict";n.d(t,{V:function(){return r},a:function(){return a}});var l=n(9268),s=n(6006);let r=(0,s.createContext)({}),a=e=>{let{children:t}=e,[n,a]=(0,s.useState)({inputStyle:"outlined",menuMode:"static",colorScheme:"dark",theme:"lara-dark-indigo",scale:14}),[i,o]=(0,s.useState)({staticMenuDesktopInactive:!1,overlayMenuActive:!1,profileSidebarVisible:!1,configSidebarVisible:!1,staticMenuMobileActive:!1,menuHoverActive:!1}),c=()=>"overlay"===n.menuMode,d=()=>window.innerWidth>991;return(0,l.jsx)(r.Provider,{value:{layoutConfig:n,setLayoutConfig:a,layoutState:i,setLayoutState:o,onMenuToggle:()=>{c()&&o(e=>({...e,overlayMenuActive:!e.overlayMenuActive})),d()?o(e=>({...e,staticMenuDesktopInactive:!e.staticMenuDesktopInactive})):o(e=>({...e,staticMenuMobileActive:!e.staticMenuMobileActive}))},showProfileSidebar:()=>{o(e=>({...e,profileSidebarVisible:!e.profileSidebarVisible}))}},children:t})}},7537:function(e,t,n){"use strict";n.r(t),n.d(t,{WebSocketProvider:function(){return a},WebsocketContext:function(){return r}});var l=n(9268),s=n(6006);let r=(0,s.createContext)({}),a=e=>{let{children:t,url:n}=e,[a,i]=(0,s.useState)(!1),[o,c]=(0,s.useState)(new Date),d=(0,s.useRef)(null);return(0,s.useEffect)(()=>((function e(){console.log("Connecting to websocket"),d.current=new WebSocket(n),d.current.onopen=()=>{i(!0)},d.current.onclose=()=>(i(!1),console.log("Disconnected from websocket."),e()),d.current.onerror=e=>{console.error("WebSocket Error: ",e),d.current.close(),i(!1)}})(),()=>{d.current&&d.current.close()}),[n]),(0,s.useEffect)(()=>{c(new Date)},[a]),(0,l.jsx)(r.Provider,{value:{isConnected:a,lastConnectionUpdate:o,sendMessageAndWaitForCondition:function(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1500;return a?(d.current.send(JSON.stringify(e)),new Promise((e,l)=>{let s=n=>{let l=JSON.parse(n.data);if(t(l)){d.current.removeEventListener("message",s),clearTimeout(r);let t=l.message;l.message=JSON.parse(t),e(l)}},r=setTimeout(()=>{d.current.removeEventListener("message",s),l(Error("Timeout: Condition not met within ".concat(n," ms")))},n);d.current.addEventListener("message",s)})):Promise.reject(Error("WebSocket is not connected"))},sendMessageTillCondition:(e,t)=>{if(!a)throw Error("WebSocket is not connected");d.current.send(JSON.stringify(e));let n=e=>{let l=JSON.parse(e.data);t(l)&&d.current.removeEventListener("message",n)};d.current.addEventListener("message",n)},listenTillCondition:e=>a?new Promise(t=>{let n=l=>{let s=JSON.parse(l.data);e(s)&&(d.current.removeEventListener("message",n),t(s))};d.current.addEventListener("message",n)}):Promise.reject(Error("WebSocket is not connected")),socket:d,sendMessage:e=>{if(!a)return Error("WebSocket is not connected");d.current.send(JSON.stringify(e))}},children:t})}},6595:function(e,t){"use strict";t.Z=function(e){if(null==e||""===e.trim())return"Key cannot be null or empty.";if(e.includes(" "))return"Key cannot contain spaces.";if(e.startsWith(".")||e.endsWith("."))return"Key cannot start or end with '.'";if(e.includes(".."))return"Key cannot contain multiple consecutive '.'";let t=e.split(".");for(let e of t)if(""===e.trim())return"Key contains empty part(s).";return null}},2059:function(e,t,n){"use strict";n.d(t,{r:function(){return a}});var l=n(9985),s=n(9219);let r=(e,t)=>{Promise.resolve().then(n.t.bind(n,9985,23)).then(n=>{let s=new Blob([e],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"});(0,l.saveAs)(s,t+"_export_"+new Date().getTime()+".xlsx")})},a=(e,t)=>{let n=s.P6.json_to_sheet(t),l=s.default.write({Sheets:{data:n},SheetNames:["data"]},{bookType:"xlsx",type:"array"});r(l,e)}},9593:function(e,t,n){"use strict";n.d(t,{On:function(){return r},rd:function(){return s},s_:function(){return l}});let l=()=>{let e=new Audio("/audio/ding.mp3");e.play().catch(e=>{console.error("Audio play was prevented:",e)})},s=()=>{let e=new Audio("/audio/error.mp3");e.play().catch(e=>{console.error("Audio play was prevented:",e)})},r=()=>{let e=new Audio("/audio/success.mp3");e.play().catch(e=>{console.error("Audio play was prevented:",e)})}}},function(e){e.O(0,[8123,5087,434,6878,6789,8285,9933,845,2087,7136,9217,4046,1280,9253,5769,1744],function(){return e(e.s=7961)}),_N_E=e.O()}]);