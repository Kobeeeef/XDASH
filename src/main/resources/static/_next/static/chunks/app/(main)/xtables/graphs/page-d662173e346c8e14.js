(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9971],{5436:function(e,t,r){Promise.resolve().then(r.bind(r,6832))},6832:function(e,t,r){"use strict";r.r(t);var n=r(9268),i=r(6006),a=r(8671),o=r(7490);t.default=()=>{let[e,t]=(0,i.useState)({}),[r,l]=(0,i.useState)({}),{layoutConfig:u}=(0,i.useContext)(a.V);return(0,i.useEffect)(()=>{let e=getComputedStyle(document.documentElement),r=e.getPropertyValue("--text-color")||"#495057",n=e.getPropertyValue("--text-color-secondary")||"#6c757d",i=e.getPropertyValue("--surface-border")||"#dfe7ef",a={labels:["7:46","February","March","April","May","June","July","da"],datasets:[{label:"First Dataset",data:[65,59,80,81,56,55,40,1e3],fill:!1,backgroundColor:e.getPropertyValue("--primary-500")||"#6366f1",borderColor:e.getPropertyValue("--primary-500")||"#6366f1",tension:.4},{label:"Second Dataset",data:[28,48,40,19,86,27,90,1],fill:!1,backgroundColor:e.getPropertyValue("--primary-200")||"#bcbdf9",borderColor:e.getPropertyValue("--primary-200")||"#bcbdf9",tension:.4}]};t({lineOptions:{plugins:{legend:{labels:{color:r}}},scales:{x:{ticks:{color:n},grid:{color:i},border:{display:!1}},y:{ticks:{color:n},grid:{color:i},border:{display:!1}}}}}),l({lineData:a})},[u]),(0,n.jsx)("div",{className:"grid p-fluid",children:(0,n.jsx)("div",{className:"col-12",children:(0,n.jsx)("div",{className:"card",children:(0,n.jsx)(o.k,{type:"line",data:r.lineData,options:e.lineOptions})})})})}},8671:function(e,t,r){"use strict";r.d(t,{V:function(){return a},a:function(){return o}});var n=r(9268),i=r(6006);let a=(0,i.createContext)({}),o=e=>{let{children:t}=e,[r,o]=(0,i.useState)({inputStyle:"outlined",menuMode:"static",colorScheme:"dark",theme:"lara-dark-indigo",scale:14}),[l,u]=(0,i.useState)({staticMenuDesktopInactive:!1,overlayMenuActive:!1,profileSidebarVisible:!1,configSidebarVisible:!1,staticMenuMobileActive:!1,menuHoverActive:!1}),s=()=>"overlay"===r.menuMode,c=()=>window.innerWidth>991;return(0,n.jsx)(a.Provider,{value:{layoutConfig:r,setLayoutConfig:o,layoutState:l,setLayoutState:u,onMenuToggle:()=>{s()&&u(e=>({...e,overlayMenuActive:!e.overlayMenuActive})),c()?u(e=>({...e,staticMenuDesktopInactive:!e.staticMenuDesktopInactive})):u(e=>({...e,staticMenuMobileActive:!e.staticMenuMobileActive}))},showProfileSidebar:()=>{u(e=>({...e,profileSidebarVisible:!e.profileSidebarVisible}))}},children:t})}},7490:function(e,t,r){"use strict";r.d(t,{k:function(){return c}});var n=r(6006),i=r(3142),a=r(465),o=r(5942),l=r(6878),u=l.V.extend({defaultProps:{__TYPE:"Chart",id:null,type:null,data:null,options:null,plugins:null,width:null,height:null,style:null,className:null,children:void 0},css:{classes:{root:function(e){var t=e.props;return(0,o.AK)("p-chart",t.className)}},inlineStyles:{root:function(e){var t=e.props;return Object.assign({width:t.width,height:t.height},t.style)}},styles:"\n        @layer primereact {\n            .p-chart {\n                position: relative\n            }\n        }\n        "}}),s=function(){try{return Chart}catch(e){return null}}(),c=n.memo(n.forwardRef(function(e,t){var c=n.useContext(i.Ou),d=u.getProps(e,c),p=u.setMetaData({props:d}),f=p.ptm,g=p.cx,h=p.sx,y=p.isUnstyled;(0,l.e)(u.css.styles,y,{name:"chart"});var v=n.useRef(null),b=n.useRef(null),m=n.useRef(null),M=function(){k();var e={type:d.type,data:d.data,options:d.options,plugins:d.plugins};s?b.current=new s(m.current,e):Promise.all([r.e(804),r.e(109)]).then(r.bind(r,4096)).then(function(t){k(),m.current&&t&&(t.default?b.current=new t.default(m.current,e):b.current=new t(m.current,e))})},k=function(){b.current&&(b.current.destroy(),b.current=null)};n.useImperativeHandle(t,function(){return{props:d,getCanvas:function(){return m.current},getChart:function(){return b.current},getBase64Image:function(){return b.current.toBase64Image()},getElement:function(){return v.current},generateLegend:function(){return b.current&&b.current.generateLegend()},refresh:function(){return b.current&&b.current.update()}}}),n.useEffect(function(){M()}),(0,a.zq)(function(){k()});var x=d.options&&d.options.plugins&&d.options.plugins.title&&d.options.plugins.title.text,C=d.ariaLabel||x,P=(0,o.dG)({id:d.id,ref:v,style:h("root"),className:g("root")},u.getOtherProps(d),f("root")),w=(0,o.dG)({ref:m,width:d.width,height:d.height,role:"img","aria-label":C},f("canvas"));return n.createElement("div",P,n.createElement("canvas",w))}),function(e,t){return e.data===t.data&&e.options===t.options&&e.type===t.type});c.displayName="Chart"}},function(e){e.O(0,[434,6878,9253,5769,1744],function(){return e(e.s=5436)}),_N_E=e.O()}]);