(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7974],{2100:function(e,t,s){Promise.resolve().then(s.bind(s,2855))},2855:function(e,t,s){"use strict";s.r(t);var n=s(9268),c=s(3702),l=s(7490),r=s(8298),a=s(8176),i=s(6006),o=s(5504),d=s(8671),m=s(3429),u=s(7537),x=s(7389);let h={labels:["January","February","March","April","May","June","July"],datasets:[{label:"First Dataset",data:[65,59,80,81,56,55,40],fill:!1,backgroundColor:"#2f4860",borderColor:"#2f4860",tension:.4},{label:"Second Dataset",data:[28,48,40,19,86,27,90],fill:!1,backgroundColor:"#00bb7e",borderColor:"#00bb7e",tension:.4}]};t.default=()=>{let[e,t]=(0,i.useState)([]),[s,b]=(0,i.useState)({}),{layoutConfig:f}=(0,i.useContext)(d.V),{isConnected:j,lastConnectionUpdate:g,sendMessageAndWaitForCondition:v}=(0,i.useContext)(u.U),[p,N]=(0,i.useState)({}),[y,w]=(0,i.useState)(new Date);(0,i.useEffect)(()=>{let e=setInterval(()=>{j&&v({type:"XTABLES-STATUS"},e=>"XTABLES-STATUS"===e.type).then(e=>{N(t=>(e.message.connected!==t.connected&&w(new Date),e.message))}).catch(()=>{})},100);return()=>clearInterval(e)},[j,v]);let S=()=>{b({plugins:{legend:{labels:{color:"#495057"}}},scales:{x:{ticks:{color:"#495057"},grid:{color:"#ebedef"}},y:{ticks:{color:"#495057"},grid:{color:"#ebedef"}}}})},k=()=>{b({plugins:{legend:{labels:{color:"#ebedef"}}},scales:{x:{ticks:{color:"#ebedef"},grid:{color:"rgba(160, 167, 181, .3)"}},y:{ticks:{color:"#ebedef"},grid:{color:"rgba(160, 167, 181, .3)"}}}})};return(0,i.useEffect)(()=>{o.M.getProductsSmall().then(e=>t(e))},[]),(0,i.useEffect)(()=>{"light"===f.colorScheme?S():k()},[f.colorScheme]),(0,n.jsxs)("div",{className:"grid",children:[(0,n.jsx)("div",{className:"col-12 lg:col-6 xl:col-3",children:(0,n.jsxs)("div",{className:"card mb-0",children:[(0,n.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Backend Status"}),(0,n.jsx)("div",{className:"text-900 font-medium text-xl",children:j?"Connected":"Disconnected"})]}),(0,n.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,n.jsx)("i",{className:"pi pi-chevron-circle-up text-blue-500 text-xl"})})]}),(0,n.jsx)(x.Z,{date:g})]})}),(0,n.jsx)("div",{className:"col-12 lg:col-6 xl:col-3",children:(0,n.jsxs)("div",{className:"card mb-0",children:[(0,n.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{className:"block text-500 font-medium mb-3",children:"XTABLES Status"}),(0,n.jsx)("div",{className:"text-900 font-medium text-xl",children:j&&(null==p?void 0:p.connected)?"Connected":"Disconnected"})]}),(0,n.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,n.jsx)("i",{className:"pi pi-table text-blue-500 text-xl"})})]}),(0,n.jsx)(x.Z,{date:y})]})}),(0,n.jsx)("div",{className:"col-12 lg:col-6 xl:col-3",children:(0,n.jsxs)("div",{className:"card mb-0",children:[(0,n.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Devices"}),(0,n.jsx)("div",{className:"text-900 font-medium text-xl",children:"5"})]}),(0,n.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,n.jsx)("i",{className:"pi pi-android text-blue-500 text-xl"})})]}),(0,n.jsx)("span",{className:"text-green-500 font-bold",children:"1 "}),(0,n.jsx)("span",{className:"text-500",children:"newly registered"})]})}),(0,n.jsx)("div",{className:"col-12 lg:col-6 xl:col-3",children:(0,n.jsxs)("div",{className:"card mb-0",children:[(0,n.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Notifications"}),(0,n.jsx)("div",{className:"text-900 font-medium text-xl",children:"0"})]}),(0,n.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,n.jsx)("i",{className:"pi pi-comment text-blue-500 text-xl"})})]}),(0,n.jsx)("span",{className:"text-green-500 font-bold",children:"1 "}),(0,n.jsx)("span",{className:"text-500",children:"minute ago"})]})}),(0,n.jsx)("div",{className:"col-12 ",children:(0,n.jsx)("div",{className:"card",children:(0,n.jsxs)(a.w,{loading:!j,value:e,rows:5,paginator:!0,responsiveLayout:"scroll",children:[(0,n.jsx)(r.s,{field:"name",header:"Name",sortable:!0,style:{width:"35%"}}),(0,n.jsx)(r.s,{field:"address",header:"Address",sortable:!0,style:{width:"35%"},body:e=>e.address}),(0,n.jsx)(r.s,{field:"status",header:"Status",sortable:!0,style:{width:"35%"},body:e=>(0,n.jsx)("div",{children:(0,n.jsx)(m.V,{severity:e.connected?"success":"danger",value:e.connected?"Connected":"Disconnected",rounded:!0})})}),(0,n.jsx)(r.s,{header:"View",body:()=>(0,n.jsx)(n.Fragment,{children:(0,n.jsx)(c.z,{icon:"pi pi-search",text:!0})})}),(0,n.jsx)(r.s,{header:"Control",body:()=>(0,n.jsx)(n.Fragment,{children:(0,n.jsx)(c.z,{className:"text-purple-500",icon:"pi pi-desktop",text:!0})})}),(0,n.jsx)(r.s,{header:"Reboot",body:()=>(0,n.jsx)(n.Fragment,{children:(0,n.jsx)(c.z,{className:"text-red-500",icon:"pi pi-sync",text:!0})})})]})})}),(0,n.jsx)("div",{className:"col-12 lg:col-6",children:(0,n.jsxs)("div",{className:"card max-h-35rem overflow-auto",children:[(0,n.jsx)("div",{className:"flex align-items-center justify-content-between mb-4",children:(0,n.jsx)("h5",{children:"Notifications"})}),(0,n.jsx)("span",{className:"block text-600 font-medium mb-3",children:"TODAY"}),(0,n.jsx)("ul",{className:"p-0 mx-0 mt-0 mb-4 list-none",children:(0,n.jsxs)("li",{className:"flex align-items-center py-2",children:[(0,n.jsx)("div",{className:"w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0",children:(0,n.jsx)("i",{className:"pi pi-download text-xl text-orange-500"})}),(0,n.jsxs)("span",{className:"text-700 line-height-3",children:["Your request for withdrawal of ",(0,n.jsx)("span",{className:"text-blue-500 font-medium",children:"2500$"})," has been initiated."]})]})}),(0,n.jsx)("span",{className:"block text-600 font-medium mb-3",children:"YESTERDAY"}),(0,n.jsxs)("ul",{className:"p-0 m-0 list-none",children:[(0,n.jsxs)("li",{className:"flex align-items-center py-2 border-bottom-1 surface-border",children:[(0,n.jsx)("div",{className:"w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0",children:(0,n.jsx)("i",{className:"pi pi-dollar text-xl text-blue-500"})}),(0,n.jsxs)("span",{className:"text-900 line-height-3",children:["Keyser Wick",(0,n.jsxs)("span",{className:"text-700",children:[" ","has purchased a black jacket for ",(0,n.jsx)("span",{className:"text-blue-500",children:"59$"})]})]})]}),(0,n.jsxs)("li",{className:"flex align-items-center py-2 border-bottom-1 surface-border",children:[(0,n.jsx)("div",{className:"w-3rem h-3rem flex align-items-center justify-content-center bg-pink-100 border-circle mr-3 flex-shrink-0",children:(0,n.jsx)("i",{className:"pi pi-question text-xl text-pink-500"})}),(0,n.jsxs)("span",{className:"text-900 line-height-3",children:["Jane Davis",(0,n.jsx)("span",{className:"text-700",children:" has posted a new questions about your product."})]})]})]})]})}),(0,n.jsx)("div",{className:"col-12 lg:col-6",children:(0,n.jsxs)("div",{className:"card",children:[(0,n.jsx)("h5",{children:"Machine Overview"}),(0,n.jsx)(l.k,{type:"line",data:h,options:s})]})})]})}},7389:function(e,t,s){"use strict";s.d(t,{Z:function(){return r}});var n=s(9268),c=s(6006);let l=e=>{let t=new Date-new Date(e),s=Math.floor(t/1e3),n=Math.floor(s/31536e3);return n>1?"".concat(n," years ago"):(n=Math.floor(s/2592e3))>1?"".concat(n," months ago"):(n=Math.floor(s/86400))>1?"".concat(n," days ago"):(n=Math.floor(s/3600))>1?"".concat(n," hours ago"):(n=Math.floor(s/60))>1?"".concat(n," minutes ago"):s>=1?"".concat(s," seconds ago"):t>1?"".concat(t," milliseconds ago"):"just now"};var r=e=>{let{date:t,className:s}=e,[r,a]=(0,c.useState)("");return(0,c.useEffect)(()=>{a(l(t));let e=setInterval(()=>{a(l(t))},100);return()=>clearInterval(e)},[t]),(0,n.jsx)("span",{className:s,children:r})}},5504:function(e,t,s){"use strict";s.d(t,{M:function(){return n}});let n={getProductsSmall:()=>fetch("/demo/data/products-small.json",{headers:{"Cache-Control":"no-cache"}}).then(e=>e.json()).then(e=>e.data),getProducts:()=>fetch("/demo/data/products.json",{headers:{"Cache-Control":"no-cache"}}).then(e=>e.json()).then(e=>e.data),getProductsWithOrdersSmall:()=>fetch("/demo/data/products-orders-small.json",{headers:{"Cache-Control":"no-cache"}}).then(e=>e.json()).then(e=>e.data)}},8671:function(e,t,s){"use strict";s.d(t,{V:function(){return l},a:function(){return r}});var n=s(9268),c=s(6006);let l=(0,c.createContext)({}),r=e=>{let{children:t}=e,[s,r]=(0,c.useState)({ripple:!0,inputStyle:"outlined",menuMode:"static",colorScheme:"dark",theme:"lara-dark-indigo",scale:14}),[a,i]=(0,c.useState)({staticMenuDesktopInactive:!1,overlayMenuActive:!1,profileSidebarVisible:!1,configSidebarVisible:!1,staticMenuMobileActive:!1,menuHoverActive:!1}),o=()=>"overlay"===s.menuMode,d=()=>window.innerWidth>991;return(0,n.jsx)(l.Provider,{value:{layoutConfig:s,setLayoutConfig:r,layoutState:a,setLayoutState:i,onMenuToggle:()=>{o()&&i(e=>({...e,overlayMenuActive:!e.overlayMenuActive})),d()?i(e=>({...e,staticMenuDesktopInactive:!e.staticMenuDesktopInactive})):i(e=>({...e,staticMenuMobileActive:!e.staticMenuMobileActive}))},showProfileSidebar:()=>{i(e=>({...e,profileSidebarVisible:!e.profileSidebarVisible}))}},children:t})}},7537:function(e,t,s){"use strict";s.d(t,{U:function(){return l},q:function(){return r}});var n=s(9268),c=s(6006);let l=(0,c.createContext)({}),r=e=>{let{children:t,url:s}=e,[r,a]=(0,c.useState)(!1),[i,o]=(0,c.useState)(new Date),d=(0,c.useRef)(null);return(0,c.useEffect)(()=>((function e(){console.log("Connecting to websocket"),d.current=new WebSocket(s),d.current.onopen=()=>{a(!0)},d.current.onclose=()=>(a(!1),console.log("Disconnected from websocket."),e()),d.current.onerror=e=>{console.error("WebSocket Error: ",e),d.current.close(),a(!1)}})(),()=>{d.current&&d.current.close()}),[s]),(0,c.useEffect)(()=>{o(new Date)},[r]),(0,n.jsx)(l.Provider,{value:{isConnected:r,lastConnectionUpdate:i,sendMessageAndWaitForCondition:function(e,t){let s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1500;return r?(d.current.send(JSON.stringify(e)),new Promise((e,n)=>{let c=s=>{let n=JSON.parse(s.data);if(t(n)){d.current.removeEventListener("message",c),clearTimeout(l);let t=n.message;n.message=JSON.parse(t),e(n)}},l=setTimeout(()=>{d.current.removeEventListener("message",c),n(Error("Timeout: Condition not met within ".concat(s," ms")))},s);d.current.addEventListener("message",c)})):Promise.reject(Error("WebSocket is not connected"))}},children:t})}}},function(e){e.O(0,[8123,434,6878,6789,8285,9683,6486,7633,6986,6324,4959,5031,9253,5769,1744],function(){return e(e.s=2100)}),_N_E=e.O()}]);