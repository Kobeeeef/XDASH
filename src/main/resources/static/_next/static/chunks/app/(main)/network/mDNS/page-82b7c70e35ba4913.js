(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3923],{626:function(e,t,n){Promise.resolve().then(n.bind(n,2506))},2506:function(e,t,n){"use strict";n.r(t);var r=n(9268),o=n(8176),a=n(8298),s=n(6006),c=n(7932),i=n(7537),l=n(7389),u=n(2469),d=n(3702);t.default=()=>{var e;let{isConnected:t,lastConnectionUpdate:n,sendMessageAndWaitForCondition:f}=(0,s.useContext)(i.U),[p,m]=(0,s.useState)(new Date),[g,v]=(0,s.useState)([]);return(0,s.useEffect)(()=>{let e=setInterval(()=>{t?f({type:"NETWORK-SCAN"},e=>"NETWORK-SCAN"===e.type).then(e=>{v(t=>{let n=JSON.parse(e.message);return(null==t?void 0:t.toString())!==(null==n?void 0:n.toString())&&m(new Date),n})}).catch(()=>{v([])}):v([])},300);return()=>clearInterval(e)},[t,f]),(0,r.jsxs)("div",{className:"grid fadeIn",children:[(0,r.jsx)(c.Q,{}),(0,r.jsx)("div",{className:"col-12 lg:col-6",children:(0,r.jsxs)("div",{className:"card mb-0",children:[(0,r.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Backend Status"}),(0,r.jsxs)("div",{className:"text-900 font-medium text-xl",children:[" ",t?"Connected":"Disconnected"]})]}),(0,r.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,r.jsx)("i",{className:"pi pi-chevron-circle-up text-blue-500 text-xl"})})]}),(0,r.jsx)(l.Z,{date:n})]})}),(0,r.jsx)("div",{className:"col-12 lg:col-6",children:(0,r.jsxs)("div",{className:"card mb-0",children:[(0,r.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Total Services"}),(0,r.jsx)("div",{className:"text-900 font-medium text-xl",children:t?null!==(e=null==g?void 0:g.length)&&void 0!==e?e:0:"Disconnected"})]}),(0,r.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,r.jsx)("i",{className:"pi pi-android text-cyan-500 text-xl"})})]}),(0,r.jsx)(l.Z,{date:p})]})}),(0,r.jsx)("div",{className:"col-12",children:(0,r.jsx)("div",{className:"card",children:(0,r.jsxs)(o.w,{size:"normal",rowsPerPageOptions:[5,10,25,50],removableSort:!0,value:t?g:[],emptyMessage:(0,u.Z)({message:t?"Searching for services":"Connecting to backend"}),rows:5,paginator:!0,children:[(0,r.jsx)(a.s,{frozen:!0,field:"serviceName",filter:!0,header:"Name",style:{width:"16%"}}),(0,r.jsx)(a.s,{field:"address",body:e=>(0,r.jsx)(d.z,{tooltip:"Open in new tab",tooltipOptions:{showDelay:100,position:"top",mouseTrack:!0},label:null==e?void 0:e.address,link:!0,onClick:()=>window.open("http://"+(null==e?void 0:e.address)+":"+(null==e?void 0:e.port),"_blank")}),header:"Address",style:{width:"16%"}}),(0,r.jsx)(a.s,{field:"port",header:"Port",style:{width:"16%"}}),(0,r.jsx)(a.s,{field:"type",header:"Type",style:{width:"16%"}}),(0,r.jsx)(a.s,{field:"application",filter:!0,header:"Application",style:{width:"16%"}}),(0,r.jsx)(a.s,{field:"server",filter:!0,header:"Server",style:{width:"16%"}})]})})})]})}},7389:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});var r=n(9268),o=n(6006);let a=e=>{let t=new Date-new Date(e),n=Math.floor(t/1e3),r=Math.floor(n/31536e3);return r>1?"".concat(r," years ago"):(r=Math.floor(n/2592e3))>1?"".concat(r," months ago"):(r=Math.floor(n/86400))>1?"".concat(r," days ago"):(r=Math.floor(n/3600))>1?"".concat(r," hours ago"):(r=Math.floor(n/60))>1?"".concat(r," minutes ago"):n>=1?"".concat(n," seconds ago"):t>1?"".concat(t," milliseconds ago"):"just now"};var s=e=>{let{date:t,className:n,refresh:s=100}=e,[c,i]=(0,o.useState)("");return(0,o.useEffect)(()=>{i(a(t));let e=setInterval(()=>{i(a(t))},s);return()=>clearInterval(e)},[t,s]),(0,r.jsx)("span",{className:n,children:c})}},2469:function(e,t,n){"use strict";n.d(t,{Z:function(){return u}});var r=n(9268),o=n(7690),a=n(6006),s=n(9497),c=n.n(s);let i=e=>{let{delay:t=500}=e,[n,o]=(0,a.useState)("");return(0,a.useEffect)(()=>{let e=setInterval(()=>{o(e=>{switch(e){case"":return".";case".":return"..";case"..":return"...";default:return""}})},t);return()=>clearInterval(e)},[t]),(0,r.jsx)("span",{children:n})};i.propTypes={delay:c().number};let l=e=>{let{message:t,speed:n="normal",dotSpeed:a=400,...s}=e;return(0,r.jsxs)("div",{style:{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"},children:[(0,r.jsx)(o.E,{...s,className:"fast"===n?"animate-pulse-fast":"animate-pulse",alt:"XBOT ROBOTICS LOGO",src:"/images/logo/logo.png"}),t&&(0,r.jsxs)("p",{className:"font-bold",children:[null!=t?t:"Loading",(0,r.jsx)(i,{delay:a})]})]})};l.propType={message:c().number};var u=l},7537:function(e,t,n){"use strict";n.d(t,{U:function(){return a},q:function(){return s}});var r=n(9268),o=n(6006);let a=(0,o.createContext)({}),s=e=>{let{children:t,url:n}=e,[s,c]=(0,o.useState)(!1),[i,l]=(0,o.useState)(new Date),u=(0,o.useRef)(null),[d,f]=(0,o.useState)(null);return(0,o.useEffect)(()=>((function e(){console.log("Connecting to websocket"),u.current=new WebSocket(n),u.current.onopen=()=>{c(!0)},u.current.onclose=()=>(c(!1),console.log("Disconnected from websocket."),e()),u.current.onerror=e=>{console.error("WebSocket Error: ",e),u.current.close(),c(!1)}})(),()=>{u.current&&u.current.close()}),[n]),(0,o.useEffect)(()=>{l(new Date)},[s]),(0,o.useEffect)(()=>{let e=e=>{let t=JSON.parse(e.data);if("DEVICE-ERROR-LOG"===t.type){let e=JSON.parse(t.message);f(e)}};return u.current&&u.current.addEventListener("message",e),()=>{u.current.removeEventListener("message",e)}},[u.current]),(0,r.jsx)(a.Provider,{value:{isConnected:s,lastConnectionUpdate:i,sendMessageAndWaitForCondition:function(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1500;return s?(u.current.send(JSON.stringify(e)),new Promise((e,r)=>{let o=n=>{let r=JSON.parse(n.data);if(t(r)){u.current.removeEventListener("message",o),clearTimeout(a);let t=r.message;r.message=JSON.parse(t),e(r)}},a=setTimeout(()=>{u.current.removeEventListener("message",o),r(Error("Timeout: Condition not met within ".concat(n," ms")))},n);u.current.addEventListener("message",o)})):Promise.reject(Error("WebSocket is not connected"))},sendMessageTillCondition:(e,t)=>{if(!s)throw Error("WebSocket is not connected");u.current.send(JSON.stringify(e));let n=e=>{let r=JSON.parse(e.data);t(r)&&u.current.removeEventListener("message",n)};u.current.addEventListener("message",n)},listenTillCondition:e=>s?new Promise(t=>{let n=r=>{let o=JSON.parse(r.data);e(o)&&(u.current.removeEventListener("message",n),t(o))};u.current.addEventListener("message",n)}):Promise.reject(Error("WebSocket is not connected")),socket:u,latestLog:d,sendMessage:e=>{if(!s)return Error("WebSocket is not connected");u.current.send(JSON.stringify(e))}},children:t})}},7932:function(e,t,n){"use strict";n.d(t,{Q:function(){return j},V:function(){return h}});var r=n(6006),o=n(3142),a=n(3702),s=n(6878),c=n(4390),i=n(465),l=n(4417),u=n(6020),d=n(5942);function f(){return(f=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function p(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function m(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,o,a,s,c=[],i=!0,l=!1;try{if(a=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;i=!1}else for(;!(i=(r=a.call(n)).done)&&(c.push(r.value),c.length!==t);i=!0);}catch(e){l=!0,o=e}finally{try{if(!i&&null!=n.return&&(s=n.return(),Object(s)!==s))return}finally{if(l)throw o}}return c}}(e,t)||function(e,t){if(e){if("string"==typeof e)return p(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);if("Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return p(e,t)}}(e,t)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function g(e){return(g="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var v=s.V.extend({defaultProps:{__TYPE:"ConfirmDialog",accept:null,acceptClassName:null,acceptIcon:null,acceptLabel:null,appendTo:null,breakpoints:null,children:void 0,className:null,defaultFocus:"accept",footer:null,icon:null,message:null,onHide:null,reject:null,rejectClassName:null,rejectIcon:null,rejectLabel:null,tagKey:void 0,visible:void 0},css:{classes:{root:"p-confirm-dialog",message:"p-confirm-dialog-message",icon:"p-confirm-dialog-icon",acceptButton:"p-confirm-dialog-accept",rejectButton:function(e){var t=e.getPropValue;return(0,d.AK)("p-confirm-dialog-reject",{"p-button-text":!t("rejectClassName")})}}}});function b(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function y(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?b(Object(n),!0).forEach(function(t){!function(e,t,n){var r;r=function(e,t){if("object"!==g(e)||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t||"default");if("object"!==g(r))return r;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"===g(r)?r:String(r))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):b(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var h=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return(e=y(y({},e),{visible:void 0===e.visible||e.visible})).visible&&l.F.emit("confirm-dialog",e),{show:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};l.F.emit("confirm-dialog",y(y(y({},e),t),{visible:!0}))},hide:function(){l.F.emit("confirm-dialog",{visible:!1})}}},j=r.memo(r.forwardRef(function(e,t){var n,p,g,b,h,j,x,O=(0,i.c)(),N=r.useContext(o.Ou),S=v.getProps(e,N),E=m(r.useState(S.visible),2),w=E[0],C=E[1],P=m(r.useState(!1),2),T=P[0],k=P[1],_=r.useRef(null),I=r.useRef(!1),D=r.useRef(null),L=function(){var e=S.group;return _.current&&(e=_.current.group),Object.assign({},S,_.current,{group:e})},A=function(e){return L()[e]},R=function(e){for(var t=arguments.length,n=Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];return d.gb.getPropValue(A(e),n)},J=A("acceptLabel")||(0,o.qJ)("accept"),M=A("rejectLabel")||(0,o.qJ)("reject"),F={props:S,state:{visible:w}},W=v.setMetaData(F),B=W.ptm,K=W.cx,V=W.isUnstyled;(0,s.e)(v.css.styles,V,{name:"confirmdialog"});var z=function(){I.current||(I.current=!0,R("accept"),H("accept"))},U=function(){I.current||(I.current=!0,R("reject"),H("reject"))},q=function(){L().group===S.group&&(C(!0),I.current=!1,D.current=document.activeElement)},H=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"cancel";C(!1),R("onHide",{result:e}),d.p7.focus(D.current),D.current=null},Z=function(e){if(e.tagKey===S.tagKey){var t=w!==e.visible;A("target")===e.target||S.target?t&&(_.current=e,e.visible?q():H()):(H(),_.current=e,k(!0))}};r.useEffect(function(){S.visible?q():H()},[S.visible]),r.useEffect(function(){return S.target||S.message||l.F.on("confirm-dialog",Z),function(){l.F.off("confirm-dialog",Z)}},[S.target]),(0,i.rf)(function(){T&&q()},[T]),(0,i.zq)(function(){l.F.off("confirm-dialog",Z)}),r.useImperativeHandle(t,function(){return{props:S,confirm:Z}});var X=(n=L(),p=d.gb.getJSXElement(A("message"),n),g=O({className:K("icon")},B("icon")),b=d.Cz.getJSXIcon(A("icon"),y({},g),{props:n}),h=function(){var e=A("defaultFocus"),t=(0,d.AK)("p-confirm-dialog-accept",A("acceptClassName")),n=(0,d.AK)("p-confirm-dialog-reject",{"p-button-text":!A("rejectClassName")},A("rejectClassName")),o={label:M,autoFocus:"reject"===e,icon:A("rejectIcon"),className:(0,d.AK)(A("rejectClassName"),K("rejectButton",{getPropValue:A})),onClick:U,pt:B("rejectButton"),unstyled:S.unstyled,__parentMetadata:{parent:F}},s=O({label:J,autoFocus:void 0===e||"accept"===e,icon:A("acceptIcon"),className:(0,d.AK)(A("acceptClassName"),K("acceptButton")),onClick:z,pt:B("acceptButton"),unstyled:S.unstyled,__parentMetadata:{parent:F}},B("acceptButton")),c=r.createElement(r.Fragment,null,r.createElement(a.z,o),r.createElement(a.z,s));if(A("footer")){var i={accept:z,reject:U,acceptClassName:t,rejectClassName:n,acceptLabel:J,rejectLabel:M,element:c,props:L()};return d.gb.getJSXElement(A("footer"),i)}return c}(),j=O({className:K("message")},B("message")),x=O({visible:w,className:(0,d.AK)(A("className"),K("root")),footer:h,onHide:H,breakpoints:A("breakpoints"),pt:n.pt,unstyled:S.unstyled,appendTo:A("appendTo"),__parentMetadata:{parent:F}},v.getOtherProps(n)),r.createElement(c.V,f({},x,{content:null==e?void 0:e.content}),b,r.createElement("span",j,p)));return r.createElement(u.h,{element:X,appendTo:A("appendTo")})}));j.displayName="ConfirmDialog"},7611:function(e,t,n){"use strict";var r=n(6054);function o(){}function a(){}a.resetWarningCache=o,e.exports=function(){function e(e,t,n,o,a,s){if(s!==r){var c=Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw c.name="Invariant Violation",c}}function t(){return e}e.isRequired=e;var n={array:e,bigint:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:a,resetWarningCache:o};return n.PropTypes=n,n}},9497:function(e,t,n){e.exports=n(7611)()},6054:function(e){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"}},function(e){e.O(0,[8123,434,6878,6789,8285,9933,845,439,9217,7003,769,6454,9253,5769,1744],function(){return e(e.s=626)}),_N_E=e.O()}]);