(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4095],{3101:function(e,t,i){Promise.resolve().then(i.bind(i,2984)),Promise.resolve().then(i.bind(i,7537))},7537:function(e,t,i){"use strict";i.r(t),i.d(t,{WebSocketProvider:function(){return l},WebsocketContext:function(){return n}});var s=i(9268),o=i(6006);let n=(0,o.createContext)({}),l=e=>{let{children:t,url:i}=e,[l,a]=(0,o.useState)(!1),[r,c]=(0,o.useState)(new Date),u=(0,o.useRef)(null);return(0,o.useEffect)(()=>((function e(){console.log("Connecting to websocket"),u.current=new WebSocket(i),u.current.onopen=()=>{a(!0)},u.current.onclose=()=>(a(!1),console.log("Disconnected from websocket."),e()),u.current.onerror=e=>{console.error("WebSocket Error: ",e),u.current.close(),a(!1)}})(),()=>{u.current&&u.current.close()}),[i]),(0,o.useEffect)(()=>{c(new Date)},[l]),(0,s.jsx)(n.Provider,{value:{isConnected:l,lastConnectionUpdate:r,sendMessageAndWaitForCondition:function(e,t){let i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1500;return l?(u.current.send(JSON.stringify(e)),new Promise((e,s)=>{let o=i=>{let s=JSON.parse(i.data);if(t(s)){u.current.removeEventListener("message",o),clearTimeout(n);let t=s.message;s.message=JSON.parse(t),e(s)}},n=setTimeout(()=>{u.current.removeEventListener("message",o),s(Error("Timeout: Condition not met within ".concat(i," ms")))},i);u.current.addEventListener("message",o)})):Promise.reject(Error("WebSocket is not connected"))},sendMessageTillCondition:(e,t)=>{if(!l)throw Error("WebSocket is not connected");u.current.send(JSON.stringify(e));let i=e=>{let s=JSON.parse(e.data);t(s)&&u.current.removeEventListener("message",i)};u.current.addEventListener("message",i)},socket:u,sendMessage:e=>{if(!l)return Error("WebSocket is not connected");u.current.send(JSON.stringify(e))}},children:t})}},2984:function(e,t,i){"use strict";i.r(t),i.d(t,{default:function(){return S}});var s=i(9268),o=i(465),n=i(6006),l=i(5942);i(2577),i(9829),i(7241);var a=i(8671),r=()=>{let{layoutConfig:e}=(0,n.useContext)(a.V);return(0,s.jsxs)("div",{className:"layout-footer",children:[(0,s.jsx)("img",{src:"/images/logo/logo.png",alt:"Logo",height:"20",className:"mr-2"}),"by",(0,s.jsx)("span",{className:"font-medium ml-2",children:"Kobe"})]})},c=i(5846),u=i.n(c),m=i(9347),d=i(562);let p=(0,n.createContext)({}),b=e=>{let{children:t}=e,[i,o]=(0,n.useState)("");return(0,s.jsx)(p.Provider,{value:{activeMenu:i,setActiveMenu:o},children:t})};var v=i(6008);let f=e=>{let t=(0,v.usePathname)(),i=(0,v.useSearchParams)(),{activeMenu:o,setActiveMenu:a}=(0,n.useContext)(p),r=e.item,c=e.parentKey?e.parentKey+"-"+e.index:String(e.index),b=r.to&&t===r.to,x=o===c||o.startsWith(c+"-"),g=e=>{r.to&&r.to===e&&a(c)};(0,n.useEffect)(()=>{g(t)},[t,i]);let h=t=>{if(r.disabled){t.preventDefault();return}r.command&&r.command({originalEvent:t,item:r}),r.items?a(x?e.parentKey:c):a(c)},y=r.items&&!1!==r.visible&&(0,s.jsx)(d.Z,{timeout:{enter:1e3,exit:450},classNames:"layout-submenu",in:!!e.root||x,children:(0,s.jsx)("ul",{children:r.items.map((e,t)=>(0,s.jsx)(f,{item:e,index:t,className:e.badgeClass,parentKey:c},e.label))})},r.label);return(0,s.jsxs)("li",{className:(0,l.AK)({"layout-root-menuitem":e.root,"active-menuitem":x}),children:[e.root&&!1!==r.visible&&(0,s.jsx)("div",{className:"layout-menuitem-root-text",children:r.label}),(!r.to||r.items)&&!1!==r.visible?(0,s.jsxs)("a",{href:r.url,onClick:e=>h(e),className:(0,l.AK)(r.class,"p-ripple"),target:r.target,tabIndex:0,children:[(0,s.jsx)("i",{className:(0,l.AK)("layout-menuitem-icon",r.icon)}),(0,s.jsx)("span",{className:"layout-menuitem-text",children:r.label}),r.items&&(0,s.jsx)("i",{className:"pi pi-fw pi-angle-down layout-submenu-toggler"}),(0,s.jsx)(m.H,{})]}):null,r.to&&!r.items&&!1!==r.visible?(0,s.jsxs)(u(),{href:r.to,replace:r.replaceUrl,target:r.target,onClick:e=>h(e),className:(0,l.AK)(r.class,"p-ripple",{"active-route":b}),tabIndex:0,children:[(0,s.jsx)("i",{className:(0,l.AK)("layout-menuitem-icon",r.icon)}),(0,s.jsx)("span",{className:"layout-menuitem-text",children:r.label}),r.items&&(0,s.jsx)("i",{className:"pi pi-fw pi-angle-down layout-submenu-toggler"}),(0,s.jsx)(m.H,{})]}):null,y]})};var x=()=>{let{layoutConfig:e}=(0,n.useContext)(a.V);return(0,s.jsx)(b,{children:(0,s.jsxs)("ul",{className:"layout-menu",children:[[{label:"Home",items:[{label:"Dashboard",icon:"pi pi-home",to:"/"},{label:"Network",icon:"pi pi-sitemap",items:[{label:"Statistics",icon:"pi pi-wifi",to:"/network"},{label:"Scan",icon:"pi pi-globe",to:"/network/scan"}]},{label:"Statistics",icon:"pi pi-chart-scatter",to:"/network"}]},{label:"Network Tables",items:[{label:"XTABLES",icon:"pi pi-fw pi-table",to:"/xtables"},{label:"Statistics",icon:"pi pi-chart-bar",items:[{label:"Live Statistics",icon:"pi pi-chart-line",to:"/xtables/stats"},{label:"Record Statistics",icon:"pi pi-history",to:"/xtables/stats/record"}]},{label:"Graphs",icon:"pi pi-chart-pie",to:"/xtables/graphs"}]},{label:"Get Started",items:[{label:"Documentation",icon:"pi pi-fw pi-question",to:"/documentation"}]}].map((e,t)=>(null==e?void 0:e.seperator)?(0,s.jsx)("li",{className:"menu-separator"}):(0,s.jsx)(f,{item:e,root:!0,index:t},e.label)),(0,s.jsx)(u(),{href:"/",style:{cursor:"pointer"},children:(0,s.jsx)("img",{alt:"XBOT Robotics",className:"w-full my-4",src:"/images/logo/logo.png"})})]})})},g=()=>(0,s.jsx)(x,{}),h=i(3702),y=i(4777);let j=(0,n.forwardRef)((e,t)=>{let{layoutConfig:i,layoutState:o,onMenuToggle:r,showProfileSidebar:c}=(0,n.useContext)(a.V),m=(0,n.useRef)(null),d=(0,n.useRef)(null),p=(0,n.useRef)(null),b=(0,n.useRef)(null);return(0,n.useImperativeHandle)(t,()=>({menubutton:m.current,topbarmenu:d.current,topbarmenubutton:p.current})),(0,s.jsxs)("div",{className:"layout-topbar",children:[(0,s.jsx)(u(),{href:"/",className:"layout-topbar-logo",children:(0,s.jsx)("img",{src:"/images/logo/logo.png",height:"35px",alt:"logo"})}),(0,s.jsx)("button",{ref:m,type:"button",className:"p-link layout-menu-button layout-topbar-button",onClick:r,children:(0,s.jsx)("i",{className:"pi pi-bars"})}),(0,s.jsx)("button",{ref:p,type:"button",className:"p-link layout-topbar-menu-button layout-topbar-button",onClick:c,children:(0,s.jsx)("i",{className:"pi pi-ellipsis-v"})}),(0,s.jsxs)("div",{ref:d,className:(0,l.AK)("layout-topbar-menu",{"layout-topbar-menu-mobile-active":o.profileSidebarVisible}),children:[(0,s.jsx)(y.v,{model:[{label:"Options",items:[{label:"Refresh",icon:"pi pi-refresh"},{label:"Logout",icon:"pi pi-sign-out",url:"/perform_logout"}]}],popup:!0,ref:b,id:"popup_menu_left"}),(0,s.jsxs)(h.z,{className:"p-link layout-topbar-button",onClick:e=>b.current.toggle(e),"aria-controls":"popup_menu_left","aria-haspopup":!0,children:[(0,s.jsx)("i",{className:"pi pi-user"}),(0,s.jsx)("span",{children:"Profile"})]}),(0,s.jsx)(u(),{href:"/settings",children:(0,s.jsxs)("button",{type:"button",className:"p-link layout-topbar-button",children:[(0,s.jsx)("i",{className:"pi pi-cog"}),(0,s.jsx)("span",{children:"Settings"})]})})]})]})});j.displayName="AppTopbar";var N=i(3045),S=e=>{let{children:t}=e,{layoutConfig:i,layoutState:c,setLayoutState:u}=(0,n.useContext)(a.V),m=(0,n.useRef)(null),d=(0,n.useRef)(null),[p,b]=(0,o.OR)({type:"click",listener:e=>{var t,i,s,o,n,l;let a=!((null===(t=d.current)||void 0===t?void 0:t.isSameNode(e.target))||(null===(i=d.current)||void 0===i?void 0:i.contains(e.target))||(null===(o=m.current)||void 0===o?void 0:null===(s=o.menubutton)||void 0===s?void 0:s.isSameNode(e.target))||(null===(l=m.current)||void 0===l?void 0:null===(n=l.menubutton)||void 0===n?void 0:n.contains(e.target)));a&&S()}}),f=(0,v.usePathname)(),x=(0,v.useSearchParams)();(0,n.useEffect)(()=>{S(),k()},[f,x]);let[h,y]=(0,o.OR)({type:"click",listener:e=>{var t,i,s,o,n,l,a,r;let c=!((null===(i=m.current)||void 0===i?void 0:null===(t=i.topbarmenu)||void 0===t?void 0:t.isSameNode(e.target))||(null===(o=m.current)||void 0===o?void 0:null===(s=o.topbarmenu)||void 0===s?void 0:s.contains(e.target))||(null===(l=m.current)||void 0===l?void 0:null===(n=l.topbarmenubutton)||void 0===n?void 0:n.isSameNode(e.target))||(null===(r=m.current)||void 0===r?void 0:null===(a=r.topbarmenubutton)||void 0===a?void 0:a.contains(e.target)));c&&k()}}),S=()=>{u(e=>({...e,overlayMenuActive:!1,staticMenuMobileActive:!1,menuHoverActive:!1})),b(),E()},k=()=>{u(e=>({...e,profileSidebarVisible:!1})),y()},w=()=>{document.body.classList?document.body.classList.add("blocked-scroll"):document.body.className+=" blocked-scroll"},E=()=>{document.body.classList?document.body.classList.remove("blocked-scroll"):document.body.className=document.body.className.replace(RegExp("(^|\\b)"+"blocked-scroll".split(" ").join("|")+"(\\b|$)","gi")," ")};(0,n.useEffect)(()=>{(c.overlayMenuActive||c.staticMenuMobileActive)&&p(),c.staticMenuMobileActive&&w()},[c.overlayMenuActive,c.staticMenuMobileActive]),(0,n.useEffect)(()=>{c.profileSidebarVisible&&h()},[c.profileSidebarVisible]),(0,o.zq)(()=>{b(),y()});let M=(0,l.AK)("layout-wrapper",{"layout-overlay":"overlay"===i.menuMode,"layout-static":"static"===i.menuMode,"layout-static-inactive":c.staticMenuDesktopInactive&&"static"===i.menuMode,"layout-overlay-active":c.overlayMenuActive,"layout-mobile-active":c.staticMenuMobileActive,"p-input-filled":"filled"===i.inputStyle,"p-ripple-disabled":!1});return(0,s.jsx)(n.Fragment,{children:(0,s.jsxs)("div",{className:M,children:[(0,s.jsx)(j,{ref:m}),(0,s.jsx)("div",{ref:d,className:"layout-sidebar",children:(0,s.jsx)(g,{})}),(0,s.jsxs)("div",{className:"layout-main-container",children:[(0,s.jsx)("div",{className:"layout-main",children:t}),(0,s.jsx)(r,{})]}),(0,s.jsx)(N.default,{}),(0,s.jsx)("div",{className:"layout-mask"})]})})}},9829:function(){},7241:function(){},2577:function(){},5846:function(e,t,i){e.exports=i(7477)},6008:function(e,t,i){e.exports=i(794)}},function(e){e.O(0,[1608,434,6878,6789,8285,3640,5066,7477,3542,9253,5769,1744],function(){return e(e.s=3101)}),_N_E=e.O()}]);