(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2427],{9704:function(e,t,n){Promise.resolve().then(n.bind(n,2919))},2919:function(e,t,n){"use strict";n.r(t);var r=n(9268),o=n(6008);n(6006);var l=n(3702);t.default=()=>{let e=(0,o.useRouter)();return(0,r.jsx)("div",{className:"surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden",children:(0,r.jsxs)("div",{className:"flex flex-column align-items-center justify-content-center",children:[(0,r.jsx)("img",{src:"/layout/images/logo.png",alt:"XBOT logo",className:"mb-5 w-30rem flex-shrink-0"}),(0,r.jsx)("div",{style:{borderRadius:"56px",padding:"0.3rem",background:"linear-gradient(180deg, rgba(233, 30, 99, 0.4) 10%, rgba(33, 150, 243, 0) 30%)"},children:(0,r.jsxs)("div",{className:"w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center",style:{borderRadius:"53px"},children:[(0,r.jsx)("div",{className:"flex justify-content-center align-items-center bg-pink-500 border-circle",style:{height:"3.2rem",width:"3.2rem"},children:(0,r.jsx)("i",{className:"pi pi-fw pi-exclamation-circle text-2xl text-white"})}),(0,r.jsx)("h1",{className:"text-900 font-bold text-5xl mb-2",children:"Error Occured"}),(0,r.jsx)("div",{className:"text-600 mb-5",children:"Something went wrong."}),(0,r.jsx)("img",{src:"/demo/images/error/asset-error.svg",alt:"Error",className:"mb-5",width:"80%"}),(0,r.jsx)(l.z,{icon:"pi pi-arrow-left",label:"Go to Dashboard",text:!0,onClick:()=>e.push("/")})]})})]})})}},6008:function(e,t,n){e.exports=n(794)},3702:function(e,t,n){"use strict";n.d(t,{z:function(){return O}});var r=n(6006),o=n(3142),l=n(6878),a=n(5942),i=n(2124),s=n(9347),c=n(9424);function u(){return(u=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function p(e){return(p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function d(e,t,n){var r;return r=function(e,t){if("object"!==p(e)||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t||"default");if("object"!==p(r))return r;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"===p(r)?r:String(r))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var b=l.V.extend({defaultProps:{__TYPE:"Badge",__parentMetadata:null,value:null,severity:null,size:null,style:null,className:null,children:void 0},css:{classes:{root:function(e){var t=e.props;return(0,a.AK)("p-badge p-component",d({"p-badge-no-gutter":a.gb.isNotEmpty(t.value)&&1===String(t.value).length,"p-badge-dot":a.gb.isEmpty(t.value),"p-badge-lg":"large"===t.size,"p-badge-xl":"xlarge"===t.size},"p-badge-".concat(t.severity),null!==t.severity))}},styles:"\n@layer primereact {\n    .p-badge {\n        display: inline-block;\n        border-radius: 10px;\n        text-align: center;\n        padding: 0 .5rem;\n    }\n    \n    .p-overlay-badge {\n        position: relative;\n    }\n    \n    .p-overlay-badge .p-badge {\n        position: absolute;\n        top: 0;\n        right: 0;\n        transform: translate(50%,-50%);\n        transform-origin: 100% 0;\n        margin: 0;\n    }\n    \n    .p-badge-dot {\n        width: .5rem;\n        min-width: .5rem;\n        height: .5rem;\n        border-radius: 50%;\n        padding: 0;\n    }\n    \n    .p-badge-no-gutter {\n        padding: 0;\n        border-radius: 50%;\n    }\n}\n"}});function g(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}var m=r.memo(r.forwardRef(function(e,t){var n=r.useContext(o.Ou),i=b.getProps(e,n),s=b.setMetaData(function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?g(Object(n),!0).forEach(function(t){d(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):g(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}({props:i},i.__parentMetadata)),c=s.ptm,u=s.cx,p=s.isUnstyled;(0,l.e)(b.css.styles,p,{name:"badge"});var m=r.useRef(null);r.useImperativeHandle(t,function(){return{props:i,getElement:function(){return m.current}}});var f=(0,a.dG)({ref:m,style:i.style,className:(0,a.AK)(i.className,u("root"))},b.getOtherProps(i),c("root"));return r.createElement("span",f,i.value)}));m.displayName="Badge";var f=l.V.extend({defaultProps:{__TYPE:"Button",__parentMetadata:null,badge:null,badgeClassName:null,className:null,children:void 0,disabled:!1,icon:null,iconPos:"left",label:null,link:!1,loading:!1,loadingIcon:null,outlined:!1,plain:!1,raised:!1,rounded:!1,severity:null,size:null,text:!1,tooltip:null,tooltipOptions:null,visible:!0},css:{classes:{icon:function(e){var t=e.props;return(0,a.AK)("p-button-icon p-c",d({},"p-button-icon-".concat(t.iconPos),t.label))},loadingIcon:function(e){var t=e.props,n=e.className;return(0,a.AK)(n,{"p-button-loading-icon":t.loading})},label:"p-button-label p-c",root:function(e){var t=e.props,n=e.size,r=e.disabled;return(0,a.AK)("p-button p-component",d(d(d(d({"p-button-icon-only":(t.icon||t.loading)&&!t.label&&!t.children,"p-button-vertical":("top"===t.iconPos||"bottom"===t.iconPos)&&t.label,"p-disabled":r,"p-button-loading":t.loading,"p-button-outlined":t.outlined,"p-button-raised":t.raised,"p-button-link":t.link,"p-button-text":t.text,"p-button-rounded":t.rounded,"p-button-loading-label-only":t.loading&&!t.icon&&t.label},"p-button-loading-".concat(t.iconPos),t.loading&&t.label),"p-button-".concat(n),n),"p-button-".concat(t.severity),t.severity),"p-button-plain",t.plain))}}}});function y(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function v(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?y(Object(n),!0).forEach(function(t){d(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):y(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var O=r.memo(r.forwardRef(function(e,t){var n,p,b,g,y,O=r.useContext(o.Ou),h=f.getProps(e,O),x=h.disabled||h.loading,j=v(v({props:h},h.__parentMetadata),{},{context:{disabled:x}}),P=f.setMetaData(j),w=P.ptm,N=P.cx,E=P.isUnstyled;(0,l.e)(f.css.styles,E,{name:"button",styled:!0});var _=r.useRef(t);if(r.useEffect(function(){a.gb.combinedRefs(_,t)},[_,t]),!1===h.visible)return null;var S=!x||h.tooltipOptions&&h.tooltipOptions.showOnDisabled,k=a.gb.isNotEmpty(h.tooltip)&&S,D={large:"lg",small:"sm"}[h.size],z=(n=(0,a.AK)("p-button-icon p-c",d({},"p-button-icon-".concat(h.iconPos),h.label)),p=(0,a.dG)({className:N("icon")},w("icon")),n=(0,a.AK)(n,{"p-button-loading-icon":h.loading}),b=(0,a.dG)({className:N("loadingIcon",{className:n})},w("loadingIcon")),g=h.loading?h.loadingIcon||r.createElement(i.L,u({},b,{spin:!0})):h.icon,a.Cz.getJSXIcon(g,v({},p),{props:h})),A=(y=(0,a.dG)({className:N("label")},w("label")),h.label?r.createElement("span",y,h.label):!h.children&&!h.label&&r.createElement("span",u({},y,{dangerouslySetInnerHTML:{__html:"&nbsp;"}}))),K=function(){if(h.badge){var e=(0,a.dG)({className:(0,a.AK)(h.badgeClassName),value:h.badge,unstyled:h.unstyled,__parentMetadata:{parent:j}},w("badge"));return r.createElement(m,e,h.badge)}return null}(),C=h.label?h.label+(h.badge?" "+h.badge:""):h["aria-label"],I=(0,a.dG)({ref:_,"aria-label":C,className:(0,a.AK)(h.className,N("root",{size:D,disabled:x})),disabled:x},f.getOtherProps(h),w("root"));return r.createElement(r.Fragment,null,r.createElement("button",I,z,A,h.children,K,r.createElement(s.H,null)),k&&r.createElement(c.u,u({target:_,content:h.tooltip},h.tooltipOptions,{pt:w("tooltip")})))}));O.displayName="Button"}},function(e){e.O(0,[434,6878,6789,9253,5769,1744],function(){return e(e.s=9704)}),_N_E=e.O()}]);