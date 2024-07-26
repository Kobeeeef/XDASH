(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5481],{847:function(e,l,t){Promise.resolve().then(t.bind(t,1035))},1035:function(e,l,t){"use strict";t.r(l);var s=t(9268),a=t(6006),n=t(8671),i=t(7490),d=t(3702),c=t(439),r=t(3621),o=t(7537),u=t(7389),v=t(845),m=t(4046),x=t(4390),h=t(315),p=t(5942),j=t(6595),b=t(8176),f=t(8298),g=t(2059);l.default=()=>{var e,l,t,y,N,S,C,k,w;let A=(0,a.useRef)(),[E,T]=(0,a.useState)({}),[D,L]=(0,a.useState)(!1),{isConnected:O,lastConnectionUpdate:R,sendMessageAndWaitForCondition:z}=(0,a.useContext)(o.WebsocketContext),[B,P]=(0,a.useState)(!1),[V,I]=(0,a.useState)(new Date),[Z,F]=(0,a.useState)({}),[X,_]=(0,a.useState)({name:"Line Chart",type:"line"}),{layoutConfig:K}=(0,a.useContext)(n.V),H=(0,a.useRef)(null),[J,U]=(0,a.useState)(1e3),[q,G]=(0,a.useState)(!1),[M,W]=(0,a.useState)([]),Q=getComputedStyle(document.documentElement),[Y,$]=(0,a.useState)(null),[ee,el]=(0,a.useState)(""),[et,es]=(0,a.useState)();(0,a.useEffect)(()=>{let e=setInterval(()=>{O&&z({type:"XTABLES-DATA"},e=>"XTABLES-DATA"===e.type).then(e=>{if(P(l=>{var t,s,a,n;return(null==e?void 0:null===(t=e.message)||void 0===t?void 0:t.connected)!==l&&I(new Date),(null==e?void 0:null===(s=e.message)||void 0===s?void 0:s.connected)||G(!1),null!==(n=null==e?void 0:null===(a=e.message)||void 0===a?void 0:a.connected)&&void 0!==n&&n}),q){let l=new Date().toISOString(),t=function(e){let l=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return Object.entries(e).map(e=>{let[s,a]=e,n={key:t?"".concat(t,".").concat(s):s,name:s};return"object"==typeof a&&null!==a?(a.hasOwnProperty("value")&&(n.value=a.value,n.type=(typeof JSON.parse(a.value)).toString()),a.data&&(n.data=l(a.data,n.key))):(n.value=a,n.type=(typeof JSON.parse(a)).toString()),n})};return l(e)}(JSON.parse(e.message.json))||[],s=(e,l)=>{for(let t of e){if(t.key===l)return t;if(t.data){let e=s(t.data,l);if(e)return e}}return null};es(e=>{let a={time:l};return M.forEach(e=>{let l=s(t,e);l&&(a[l.key]=null==l?void 0:l.value)}),[a,...e||[]]}),F(e=>{var a,n;let i=!1,d=((null===(a=e.lineData)||void 0===a?void 0:a.datasets)||[]).map(e=>({...e})),c=[...(null===(n=e.lineData)||void 0===n?void 0:n.labels)||[]];return(M.forEach(e=>{let l=d.find(l=>l.label===e),a=s(t,e),n=null==a?void 0:a.value;a&&(l||(l={label:e,data:[],fill:!1,tension:.4},d.push(l)),l.data=[...l.data||[],n],i=!0)}),i)?(c.push(l),{lineData:{labels:c,datasets:d}}):e})}}).catch(()=>{})},J),l=setInterval(()=>{O&&z({type:"XTABLES-STATUS"},e=>"XTABLES-STATUS"===e.type).then(e=>{P(l=>{var t,s,a;return(null==e?void 0:null===(t=e.message)||void 0===t?void 0:t.connected)!==l&&I(new Date),null!==(a=null==e?void 0:null===(s=e.message)||void 0===s?void 0:s.connected)&&void 0!==a&&a})}).catch(()=>{})},500);return()=>{clearInterval(e),clearInterval(l)}},[O,z,J,q]),(0,a.useEffect)(()=>{let e=Q.getPropertyValue("--text-color")||"#495057",l=Q.getPropertyValue("--text-color-secondary")||"#6c757d",t=Q.getPropertyValue("--surface-border")||"#dfe7ef";T({lineOptions:{plugins:{legend:{labels:{color:e}}},scales:{x:{ticks:{color:l},grid:{color:t},border:{display:!1}},y:{ticks:{color:l},grid:{color:t},border:{display:!1}}}}})},[K]);let ea=(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(d.z,{label:"Cancel",icon:"pi pi-times",text:!0,onClick:()=>{L(!1),el(null)}}),(0,s.jsx)(d.z,{disabled:null!==(0,j.Z)(ee),label:"Save",icon:"pi pi-check",onClick:()=>{L(!1),W(e=>(e.push(ee),e)),el(null)}})]});return(0,s.jsxs)("div",{className:"grid p-fluid fadeIn",children:[(0,s.jsx)(m.F,{ref:H}),(0,s.jsx)(x.V,{style:{width:"450px"},visible:D,header:"Key Details",modal:!0,className:"p-fluid",footer:ea,onHide:()=>{L(!1),el(null)},children:(0,s.jsxs)("div",{className:"field",children:[(0,s.jsx)("label",{htmlFor:"key",children:"Key Name"}),(0,s.jsx)(h.o,{id:"key",value:ee,onChange:e=>{el(e.target.value)},required:!0,autoFocus:!0,className:(0,p.AK)({"p-invalid":null!==(0,j.Z)(ee)})}),null===(0,j.Z)(ee)?null:(0,s.jsx)("small",{className:"p-invalid",children:(0,j.Z)(ee)})]})}),(0,s.jsx)("div",{className:"col-12 lg:col-6 xl:col-4",children:(0,s.jsxs)("div",{className:"card mb-0",children:[(0,s.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Backend Status"}),(0,s.jsxs)("div",{className:"text-900 font-medium text-xl "+(O?"text-green-600":"text-red-600 animate-pulse"),children:[" ",O?"Connected":"Disconnected"]})]}),(0,s.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,s.jsx)("i",{className:"pi pi-chevron-circle-up text-blue-500 text-xl"})})]}),(0,s.jsx)(u.Z,{date:R})]})}),(0,s.jsx)("div",{className:"col-12 lg:col-6 xl:col-4",children:(0,s.jsxs)("div",{className:"card mb-0",children:[(0,s.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("span",{className:"block text-500 font-medium mb-3",children:"XTABLES Status"}),(0,s.jsx)("div",{className:"text-900 font-medium text-xl "+(O&&B?"text-green-600":"text-red-600 animate-pulse"),children:O&&B?"Connected":"Disconnected"})]}),(0,s.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,s.jsx)("i",{className:"pi pi-table text-blue-500 text-xl"})})]}),(0,s.jsx)(u.Z,{date:V})]})}),(0,s.jsx)("div",{className:"col-12 lg:col-6 xl:col-4",children:(0,s.jsxs)("div",{className:"card mb-0",children:[(0,s.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Intervals Recorded"}),(0,s.jsx)("div",{className:"text-900 font-medium text-xl",children:null!==(t=null==et?void 0:et.length)&&void 0!==t?t:0})]}),(0,s.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,s.jsx)("i",{className:"pi pi-database text-blue-500 text-xl"})})]}),(0,s.jsx)(u.Z,{date:V})]})}),(0,s.jsx)("div",{className:"col-12",children:(0,s.jsx)("div",{className:"card",children:(0,s.jsxs)("div",{className:"grid",children:[(0,s.jsx)("div",{className:"col-12 lg:col-3",children:(0,s.jsx)(d.z,{disabled:q||!O||!B,label:"Add",icon:"pi pi-plus",onClick:()=>{L(!0)}})}),(0,s.jsx)("div",{className:"col-12 md:col-3",children:(0,s.jsxs)("div",{className:"p-inputgroup",children:[(0,s.jsx)(d.z,{onClick:()=>{W(e=>{let l=e.indexOf(Y);return -1===l?(H.current.show({severity:"error",summary:"Failure",detail:"The key was not found."}),e):(e.splice(l,1).length>0?($(null),H.current.show({severity:"success",summary:"Success",detail:"The key was removed."})):H.current.show({severity:"error",summary:"Failure",detail:"The key could not be removed."}),e)}),$(null)},disabled:q||!O||!B||!(null==M?void 0:M.length),severity:"danger",label:"Remove"}),(0,s.jsx)(v.L,{disabled:q||!O||!B||!(null==M?void 0:M.length),value:Y,onChange:e=>{$(e.value)},options:M,placeholder:"Delete Key"})]})}),(0,s.jsx)("div",{className:"col-12 lg:col-3 ",children:(0,s.jsx)(c.R,{disabled:q||!O||!B,value:J,onValueChange:e=>U(null!==(y=e.value)&&void 0!==y?y:100),suffix:" millisecond".concat(J>1?"s":""," per record")})}),(0,s.jsx)("div",{className:"col-12 lg:col-3 ",children:(0,s.jsx)(v.L,{disabled:q||!O||!B,value:X,onChange:e=>{_(e.value)},options:[{name:"Line Chart",type:"line"},{name:"Bar Chart",type:"bar"},{name:"Radar Chart",type:"radar"},{name:"Polar Area",type:"polarArea"},{name:"Pie Chart",type:"pie"},{name:"Doughnut Chart",type:"doughnut"}],optionLabel:"name",placeholder:"Select Chart"})}),(0,s.jsx)("div",{className:"col-6",children:(0,s.jsx)(d.z,{disabled:!O||!B||q||!(null==Z?void 0:null===(l=Z.lineData)||void 0===l?void 0:null===(e=l.labels)||void 0===e?void 0:e.length)&&!(null===(N=null==et?void 0:et.length)||void 0===N||N)&&!(null===(S=null==M?void 0:M.length)||void 0===S||S),label:"Reset",severity:"danger",onClick:()=>{F({}),es([]),W([]),H.current.show({severity:"success",summary:"Success",detail:"All settings and charts reset."})}})}),(0,s.jsx)("div",{className:"col-6",children:(0,s.jsx)(r.C,{disabled:!O||!B||!(null==M?void 0:M.length),onLabel:"Stop Recording",offLabel:"Start Recording",checked:q,onChange:e=>G(e.value)})})]})})}),(0,s.jsx)("div",{className:"col-12",children:(0,s.jsx)("div",{className:"card",children:(0,s.jsx)(i.k,{type:null!==(C=null==X?void 0:X.type)&&void 0!==C?C:"line",data:Z.lineData,options:E.lineOptions})})}),(0,s.jsx)("div",{className:"col-12",children:(0,s.jsx)("div",{className:"card",children:(0,s.jsxs)("div",{className:"grid",children:[(0,s.jsx)("div",{className:"col-6",children:(0,s.jsx)(d.z,{disabled:(null!==(k=null==et?void 0:et.length)&&void 0!==k?k:0)===0,label:"Export CSV",icon:"pi pi-file",onClick:()=>{A.current.exportCSV({selectionOnly:!1})}})}),(0,s.jsx)("div",{className:"col-6",children:(0,s.jsx)(d.z,{disabled:(null!==(w=null==et?void 0:et.length)&&void 0!==w?w:0)===0,severity:"success",label:"Export Excel",icon:"pi pi-file-excel",onClick:()=>{(0,g.r)("XTABLES-GRAPHS",et)}})}),(0,s.jsx)("div",{className:"col-12",children:(0,s.jsxs)(b.w,{scrollable:!0,virtualScrollerOptions:{itemSize:15},scrollHeight:"500px",ref:A,emptyMessage:"There is no data recorded.",value:et,children:[(0,s.jsx)(f.s,{field:"time",header:"Time"}),M.map((e,l)=>(0,s.jsx)(f.s,{field:e,header:e},l))]})})]})})})]})}}},function(e){e.O(0,[8123,5087,434,6878,6789,8285,3081,9683,2087,4046,6986,7136,4959,4390,7441,9253,5769,1744],function(){return e(e.s=847)}),_N_E=e.O()}]);