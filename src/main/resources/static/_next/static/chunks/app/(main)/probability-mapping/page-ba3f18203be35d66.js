(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4197],{4088:function(e,t,s){Promise.resolve().then(s.bind(s,5637))},5637:function(e,t,s){"use strict";s.r(t),s.d(t,{default:function(){return m}});var n=s(9268),r=s(6006),a=s(7932),l=s(7537),o=s(7389),c=s(3702);let i=(e,t,s,n,r,a,l,o)=>{let c=Math.floor(a/t),i=Math.floor(l/t),d=(e,t,s)=>{let n=t/s,r=Math.max(0,Math.min(Math.round(e[0]*n),i-1)),a=Math.max(0,Math.min(Math.round(e[1]*n),c-1));return[r,a]},u=d(s,o,t),m=d(n,o,t),h=r.map(e=>d(e,o,t)),x=Array.from(new Set(h.map(JSON.stringify))).map(JSON.parse),f=e.map(e=>d(e,o,t)),g=Array.from(new Set(f.map(JSON.stringify))).map(JSON.parse).filter(e=>{let[t,s]=e;return t>=0&&t<i&&s>=0&&s<c});return{newPath:g,newRobotPos:u,newGoalPos:m,newObstacles:x,newMapSizeXSquares:c,newMapSizeYSquares:i}};var d=e=>{let{resizedInchesPerSquare:t,inchesPerSquare:s,totalMapSizeXInches:a,totalMapSizeYInches:l,robotLocation:o,goalLocation:c,obstacles:d,path:u,status:m}=e,[h,x]=(0,r.useState)(0);(0,r.useEffect)(()=>{x(e=>0!==e?0:1)},[s,t]);let f=Math.floor(a/s),g=Math.floor(l/s);if(t>s){(t>a||t>l)&&(t=Math.min(l,a));let{newPath:e,newRobotPos:n,newGoalPos:r,newObstacles:m,newMapSizeXSquares:h,newMapSizeYSquares:x}=i(u,t,o,c,d,a,l,s);f=h,g=x,u=e,o=n,c=r,d=m}return(0,n.jsx)("div",{className:"grid",style:{display:"grid",gridTemplateColumns:"repeat(".concat(f,", minmax(0, 1fr))"),gridTemplateRows:"repeat(".concat(g,", minmax(0, 1fr))"),width:"100%",height:"80vh",gap:"1px",backgroundColor:"black",overflow:"hidden"},children:Array.from({length:g},(e,t)=>Array.from({length:f},(e,s)=>{let r=o[0]===t&&o[1]===s,a=c[0]===t&&c[1]===s,l=d.some(e=>{let[n,r]=e;return n===t&&r===s}),i=u.some(e=>{let[n,r]=e;return n===t&&r===s}),h=u.findIndex(e=>{let[n,r]=e;return n===t&&r===s});return(0,n.jsx)("div",{className:"cursor-pointer ".concat(r?"bg-blue-500":a?"bg-green-500":l?"bg-red-500 ":i?"bg-yellow-500 ".concat("NAVIGATING"===m&&"animate-trail"):"bg-gray-800"),style:{aspectRatio:"1 / 1",cursor:"pointer",outline:"none",transition:"border 0.2s, box-shadow 0.2s",animationDelay:"".concat(.04*h,"s")},onMouseEnter:e=>{e.currentTarget.style.border="2px solid #3B82F6"},onMouseLeave:e=>{e.currentTarget.style.border=""},onFocus:e=>{e.currentTarget.style.boxShadow="0 0 0 3px rgba(59, 130, 246, 0.5)"},onBlur:e=>{e.currentTarget.style.boxShadow="none"},role:"button",onClick:()=>{console.log("Button clicked")},tabIndex:0},"".concat(t,"-").concat(s))}))},h)},u=s(439),m=()=>{let{isConnected:e,lastConnectionUpdate:t,sendMessageAndWaitForCondition:s}=(0,r.useContext)(l.U),[i,m]=(0,r.useState)({}),[h,x]=(0,r.useState)(new Date),[f,g]=(0,r.useState)(10),[b,v]=(0,r.useState)(f),[N,j]=(0,r.useState)("STANDBY"),[p,S]=(0,r.useState)([2,1]),[w,y]=(0,r.useState)([[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[2,8],[2,9],[2,10],[2,11],[2,12],[2,13],[2,14],[2,15],[2,16],[2,17],[2,18],[2,19],[2,20],[2,21],[2,22],[2,23],[2,24],[2,25],[3,25],[3,26],[3,27],[3,28],[3,29],[3,30],[3,31],[3,32],[3,33],[3,34],[3,35],[3,36],[3,37],[3,38],[3,39],[3,40],[3,41],[3,42],[3,43],[3,44],[3,45],[3,46],[3,47],[3,48],[3,49],[3,50],[3,51],[3,52],[3,53],[3,54],[3,55],[3,56],[3,57],[3,58],[3,59],[3,60],[3,61],[3,62],[3,63],[3,64],[3,65],[3,66],[3,67],[3,68],[3,69],[4,69],[4,70],[5,70],[5,71],[6,71],[6,72],[7,72],[7,73],[8,73],[8,74],[9,74],[9,75],[10,75],[10,76],[11,76],[11,77],[12,77],[12,78],[13,78],[13,79],[14,79],[14,80],[15,80],[15,81],[16,81],[16,82],[17,82],[17,83],[18,83],[18,84],[19,84],[19,85],[20,85],[20,86],[21,86],[21,87],[22,87],[22,88],[23,88],[23,89],[24,89],[24,90],[25,90]]);(0,r.useEffect)(()=>{let t=setInterval(()=>{e&&s({type:"XTABLES-DATA"},e=>"XTABLES-DATA"===e.type).then(e=>{m(t=>(e.message.connected!==(null==t?void 0:t.connected)&&x(new Date),e.message))}).catch(()=>{})},1e3);return()=>clearInterval(t)},[e,s]),(0,r.useEffect)(()=>{let e;if("NAVIGATING"===N&&w.length>0){let t=()=>{let e=w[0];S(e),y(e=>e.slice(1))};e=setInterval(()=>{w.length>0?t():(clearInterval(e),j("STANDBY"))},50)}return 0===w.length&&j("STANDBY"),()=>clearInterval(e)},[N,w.length]);let E=()=>{w.length>0&&j("NAVIGATING")},[I,M]=(0,r.useState)(Array.from({length:5},(e,t)=>({id:t+1,position:{x:600*Math.random()-300,y:400*Math.random()-200},probability:100*Math.random()})));return(0,n.jsxs)("div",{className:"grid fadeIn",children:[(0,n.jsx)(a.Q,{}),(0,n.jsx)("div",{className:"col-12 lg:col-6 xl:col-4",children:(0,n.jsxs)("div",{className:"card mb-0",children:[(0,n.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Backend Status"}),(0,n.jsxs)("div",{className:"text-900 font-medium text-xl",children:[" ",e?"Connected":"Disconnected"]})]}),(0,n.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,n.jsx)("i",{className:"pi pi-chevron-circle-up text-blue-500 text-xl"})})]}),(0,n.jsx)(o.Z,{date:t})]})}),(0,n.jsx)("div",{className:"col-12 lg:col-6 xl:col-4",children:(0,n.jsxs)("div",{className:"card mb-0",children:[(0,n.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{className:"block text-500 font-medium mb-3",children:"XTABLES Status"}),(0,n.jsx)("div",{className:"text-900 font-medium text-xl",children:e&&(null==i?void 0:i.connected)?"Connected":"Disconnected"})]}),(0,n.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,n.jsx)("i",{className:"pi pi-table text-blue-500 text-xl"})})]}),(0,n.jsx)(o.Z,{date:h})]})}),(0,n.jsx)("div",{className:"col-12 lg:col-6 xl:col-4",children:(0,n.jsxs)("div",{className:"card mb-0",children:[(0,n.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Status"}),(0,n.jsx)("div",{className:"text-900 text-xl "+("NAVIGATING"===N?"font-bold text-green-600 animate-pulse":"PATHFINDING"===N?"font-bold text-yellow-600 animate-pulse-fast":" font-bold text-gray-400"),children:N||"Unknown"})]}),(0,n.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,n.jsx)("i",{className:"pi pi-arrows-alt text-blue-500 text-xl"})})]}),(0,n.jsx)(o.Z,{date:h})]})}),(0,n.jsx)("div",{className:"col-12",children:(0,n.jsxs)("div",{className:"card mb-0",children:[(0,n.jsxs)("div",{className:"grid mb-3",children:[(0,n.jsxs)("div",{className:"col-12 lg:col-4",children:[(0,n.jsx)("label",{htmlFor:"minmax-buttons",className:"font-bold block mb-2",children:"Inches Per Square"}),(0,n.jsx)(u.R,{suffix:" Inches",className:"w-full",inputId:"minmax-buttons",min:1,max:323,value:f,onValueChange:e=>{g(e.value),v(e.value)},showButtons:!0})]}),(0,n.jsxs)("div",{className:"col-12 lg:col-4",children:[(0,n.jsx)("label",{htmlFor:"minmax-buttons",className:"font-bold block mb-2",children:"Reset Settings"}),(0,n.jsx)(c.z,{className:"w-full",label:"Reset",onClick:()=>{g(10),v(10),E()}})]}),(0,n.jsxs)("div",{className:"col-12 lg:col-4",children:[(0,n.jsx)("label",{htmlFor:"minmax-buttons",className:"font-bold block mb-2",children:"Inches Per Square Zoom"}),(0,n.jsx)(u.R,{suffix:" Inches",className:"w-full",inputId:"minmax-buttons",min:f,max:323,value:b,onValueChange:e=>v(e.value),showButtons:!0})]}),(0,n.jsx)("div",{className:"col-12 lg:col-6",children:(0,n.jsx)(c.z,{style:{width:"100%"},label:"Move to Closest",severity:"success",size:"large",loading:!1})}),(0,n.jsx)("div",{className:"col-12 lg:col-6",children:(0,n.jsx)(c.z,{style:{width:"100%"},label:"Point to Closest",severity:"success",size:"large",loading:!1})})]}),(0,n.jsx)("div",{className:"w-full bg-gray-200",children:(0,n.jsx)(d,{status:N,resizedInchesPerSquare:b,inchesPerSquare:f,totalMapSizeXInches:651,totalMapSizeYInches:323,robotLocation:p,goalLocation:[25,90],obstacles:[[44,106],[31,31],[46,74],[54,112],[54,122],[29,105],[2,67],[13,69],[62,73],[61,25],[39,126],[29,106],[26,73],[7,108],[53,29],[50,126],[47,11],[31,48],[46,44],[52,129],[61,57],[51,36],[56,112],[50,48],[16,63],[55,23],[47,44],[11,22],[48,27],[9,69],[34,87],[34,93],[21,122],[55,84],[25,108],[21,7],[52,75],[51,26],[19,122],[29,5],[57,56],[45,8],[28,109],[45,29],[53,49],[10,83],[50,111],[13,61],[34,83],[36,54],[56,96],[6,41],[16,44],[19,71],[6,44],[62,66],[51,10],[17,23],[37,1],[2,122],[2,26],[13,46],[54,61],[55,126],[33,63],[45,94],[6,117],[13,124],[25,68],[22,126],[27,10],[37,113],[49,117],[31,128],[53,66],[15,24],[54,27],[46,50],[44,7],[39,103],[38,97],[63,127],[24,106],[24,22],[25,127],[60,23],[0,35],[0,35],[33,77],[51,81],[28,81],[51,66],[31,117],[57,80],[15,35],[3,4],[57,72],[4,64],[55,10],[5,128]],path:w})})]})}),(0,n.jsx)("div",{className:"col-12 lg:col-6",children:(0,n.jsx)("div",{className:"card mb-0"})}),(0,n.jsx)("div",{className:"col-12 lg:col-6",children:(0,n.jsx)("div",{className:"card mb-0"})})]})}},7389:function(e,t,s){"use strict";s.d(t,{Z:function(){return l}});var n=s(9268),r=s(6006);let a=e=>{let t=new Date-new Date(e),s=Math.floor(t/1e3),n=Math.floor(s/31536e3);return n>1?"".concat(n," years ago"):(n=Math.floor(s/2592e3))>1?"".concat(n," months ago"):(n=Math.floor(s/86400))>1?"".concat(n," days ago"):(n=Math.floor(s/3600))>1?"".concat(n," hours ago"):(n=Math.floor(s/60))>1?"".concat(n," minutes ago"):s>=1?"".concat(s," seconds ago"):t>1?"".concat(t," milliseconds ago"):"just now"};var l=e=>{let{date:t,className:s,refresh:l=100}=e,[o,c]=(0,r.useState)("");return(0,r.useEffect)(()=>{c(a(t));let e=setInterval(()=>{c(a(t))},l);return()=>clearInterval(e)},[t,l]),(0,n.jsx)("span",{className:s,children:o})}},7537:function(e,t,s){"use strict";s.d(t,{U:function(){return a},q:function(){return l}});var n=s(9268),r=s(6006);let a=(0,r.createContext)({}),l=e=>{let{children:t,url:s}=e,[l,o]=(0,r.useState)(!1),[c,i]=(0,r.useState)(new Date),d=(0,r.useRef)(null),[u,m]=(0,r.useState)(null);return(0,r.useEffect)(()=>((function e(){console.log("Connecting to websocket"),d.current=new WebSocket(s),d.current.onopen=()=>{o(!0)},d.current.onclose=()=>(o(!1),console.log("Disconnected from websocket."),e()),d.current.onerror=e=>{console.error("WebSocket Error: ",e),d.current.close(),o(!1)}})(),()=>{d.current&&d.current.close()}),[s]),(0,r.useEffect)(()=>{i(new Date)},[l]),(0,r.useEffect)(()=>{let e=e=>{let t=JSON.parse(e.data);if("DEVICE-ERROR-LOG"===t.type){let e=JSON.parse(t.message);m(e)}};return d.current&&d.current.addEventListener("message",e),()=>{d.current.removeEventListener("message",e)}},[d.current]),(0,n.jsx)(a.Provider,{value:{isConnected:l,lastConnectionUpdate:c,sendMessageAndWaitForCondition:function(e,t){let s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1500;return l?(d.current.send(JSON.stringify(e)),new Promise((e,n)=>{let r=s=>{let n=JSON.parse(s.data);if(t(n)){d.current.removeEventListener("message",r),clearTimeout(a);let t=n.message;n.message=JSON.parse(t),e(n)}},a=setTimeout(()=>{d.current.removeEventListener("message",r),n(Error("Timeout: Condition not met within ".concat(s," ms")))},s);d.current.addEventListener("message",r)})):Promise.reject(Error("WebSocket is not connected"))},sendMessageTillCondition:(e,t)=>{if(!l)throw Error("WebSocket is not connected");d.current.send(JSON.stringify(e));let s=e=>{let n=JSON.parse(e.data);t(n)&&d.current.removeEventListener("message",s)};d.current.addEventListener("message",s)},listenTillCondition:e=>l?new Promise(t=>{let s=n=>{let r=JSON.parse(n.data);e(r)&&(d.current.removeEventListener("message",s),t(r))};d.current.addEventListener("message",s)}):Promise.reject(Error("WebSocket is not connected")),socket:d,latestLog:u,sendMessage:e=>{if(!l)return Error("WebSocket is not connected");d.current.send(JSON.stringify(e))}},children:t})}}},function(e){e.O(0,[434,6878,6789,8285,439,9217,6898,9253,5769,1744],function(){return e(e.s=4088)}),_N_E=e.O()}]);