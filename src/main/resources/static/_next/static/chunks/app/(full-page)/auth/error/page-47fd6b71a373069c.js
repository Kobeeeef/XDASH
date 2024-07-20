(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2427],{9704:function(e,t,n){Promise.resolve().then(n.bind(n,2919))},2919:function(e,t,n){"use strict";n.r(t);var r=n(9268),o=n(6008);n(6006);var l=n(3702);t.default=()=>{let e=(0,o.useRouter)();return(0,r.jsx)("div",{className:"surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden",children:(0,r.jsxs)("div",{className:"flex flex-column align-items-center justify-content-center",children:[(0,r.jsx)("img",{src:"/images/logo/logo.png",alt:"XBOT logo",className:"xl:mb-5 lg:mb-4 sm:mb-3 xl:mb-5 lg:mb-4 sm:mb-3 mb-2 xl:w-30rem lg:w-25rem sm:w-20rem w-9 flex-shrink-0"}),(0,r.jsx)("div",{style:{borderRadius:"56px",padding:"0.3rem",background:"linear-gradient(180deg, rgba(233, 30, 99, 0.4) 10%, rgba(33, 150, 243, 0) 30%)"},children:(0,r.jsxs)("div",{className:"w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center",style:{borderRadius:"53px"},children:[(0,r.jsx)("div",{className:"flex justify-content-center align-items-center bg-pink-500 border-circle",style:{height:"3.2rem",width:"3.2rem"},children:(0,r.jsx)("i",{className:"pi pi-fw pi-exclamation-circle text-2xl text-white"})}),(0,r.jsx)("h1",{className:"text-900 font-bold text-5xl mb-2",children:"Error Occured"}),(0,r.jsx)("div",{className:"text-600 mb-5",children:"Something went wrong."}),(0,r.jsx)("img",{src:"/images/error/asset-error.svg",alt:"Error",className:"mb-5",width:"80%"}),(0,r.jsx)(l.z,{icon:"pi pi-arrow-left",label:"Go to Dashboard",text:!0,onClick:()=>e.push("/")})]})})]})})}},6008:function(e,t,n){e.exports=n(794)},3702:function(e,t,n){"use strict";n.d(t,{z:function(){return h}});var r=n(6006),o=n(3142),l=n(6878),a=n(465),i=n(5942),s=n(2124),c=n(9347),u=n(9424);function p(){return(p=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function d(e){return(d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function b(e,t,n){var r;return r=function(e,t){if("object"!==d(e)||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t||"default");if("object"!==d(r))return r;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"===d(r)?r:String(r))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var g=l.V.extend({defaultProps:{__TYPE:"Badge",__parentMetadata:null,value:null,severity:null,size:null,style:null,className:null,children:void 0},css:{classes:{root:function(e){var t=e.props;return(0,i.AK)("p-badge p-component",b({"p-badge-no-gutter":i.gb.isNotEmpty(t.value)&&1===String(t.value).length,"p-badge-dot":i.gb.isEmpty(t.value),"p-badge-lg":"large"===t.size,"p-badge-xl":"xlarge"===t.size},"p-badge-".concat(t.severity),null!==t.severity))}},styles:"\n@layer primereact {\n    .p-badge {\n        display: inline-block;\n        border-radius: 10px;\n        text-align: center;\n        padding: 0 .5rem;\n    }\n    \n    .p-overlay-badge {\n        position: relative;\n    }\n    \n    .p-overlay-badge .p-badge {\n        position: absolute;\n        top: 0;\n        right: 0;\n        transform: translate(50%,-50%);\n        transform-origin: 100% 0;\n        margin: 0;\n    }\n    \n    .p-badge-dot {\n        width: .5rem;\n        min-width: .5rem;\n        height: .5rem;\n        border-radius: 50%;\n        padding: 0;\n    }\n    \n    .p-badge-no-gutter {\n        padding: 0;\n        border-radius: 50%;\n    }\n}\n"}});function m(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}var f=r.memo(r.forwardRef(function(e,t){var n=(0,a.c)(),s=r.useContext(o.Ou),c=g.getProps(e,s),u=g.setMetaData(function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?m(Object(n),!0).forEach(function(t){b(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):m(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}({props:c},c.__parentMetadata)),p=u.ptm,d=u.cx,f=u.isUnstyled;(0,l.e)(g.css.styles,f,{name:"badge"});var y=r.useRef(null);r.useImperativeHandle(t,function(){return{props:c,getElement:function(){return y.current}}});var v=n({ref:y,style:c.style,className:(0,i.AK)(c.className,d("root"))},g.getOtherProps(c),p("root"));return r.createElement("span",v,c.value)}));f.displayName="Badge";var y=l.V.extend({defaultProps:{__TYPE:"Button",__parentMetadata:null,badge:null,badgeClassName:null,className:null,children:void 0,disabled:!1,icon:null,iconPos:"left",label:null,link:!1,loading:!1,loadingIcon:null,outlined:!1,plain:!1,raised:!1,rounded:!1,severity:null,size:null,text:!1,tooltip:null,tooltipOptions:null,visible:!0},css:{classes:{icon:function(e){var t=e.props;return(0,i.AK)("p-button-icon p-c",b({},"p-button-icon-".concat(t.iconPos),t.label))},loadingIcon:function(e){var t=e.props,n=e.className;return(0,i.AK)(n,{"p-button-loading-icon":t.loading})},label:"p-button-label p-c",root:function(e){var t=e.props,n=e.size,r=e.disabled;return(0,i.AK)("p-button p-component",b(b(b(b({"p-button-icon-only":(t.icon||t.loading)&&!t.label&&!t.children,"p-button-vertical":("top"===t.iconPos||"bottom"===t.iconPos)&&t.label,"p-disabled":r,"p-button-loading":t.loading,"p-button-outlined":t.outlined,"p-button-raised":t.raised,"p-button-link":t.link,"p-button-text":t.text,"p-button-rounded":t.rounded,"p-button-loading-label-only":t.loading&&!t.icon&&t.label},"p-button-loading-".concat(t.iconPos),t.loading&&t.label),"p-button-".concat(n),n),"p-button-".concat(t.severity),t.severity),"p-button-plain",t.plain))}}}});function v(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function O(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?v(Object(n),!0).forEach(function(t){b(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):v(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var h=r.memo(r.forwardRef(function(e,t){var n,d,g,m,v,h=(0,a.c)(),x=r.useContext(o.Ou),j=y.getProps(e,x),w=j.disabled||j.loading,P=O(O({props:j},j.__parentMetadata),{},{context:{disabled:w}}),N=y.setMetaData(P),E=N.ptm,_=N.cx,S=N.isUnstyled;(0,l.e)(y.css.styles,S,{name:"button",styled:!0});var k=r.useRef(t);if(r.useEffect(function(){i.gb.combinedRefs(k,t)},[k,t]),!1===j.visible)return null;var D=!w||j.tooltipOptions&&j.tooltipOptions.showOnDisabled,z=i.gb.isNotEmpty(j.tooltip)&&D,A={large:"lg",small:"sm"}[j.size],K=(n=(0,i.AK)("p-button-icon p-c",b({},"p-button-icon-".concat(j.iconPos),j.label)),d=h({className:_("icon")},E("icon")),g=h({className:_("loadingIcon",{className:n=(0,i.AK)(n,{"p-button-loading-icon":j.loading})})},E("loadingIcon")),m=j.loading?j.loadingIcon||r.createElement(s.L,p({},g,{spin:!0})):j.icon,i.Cz.getJSXIcon(m,O({},d),{props:j})),C=(v=h({className:_("label")},E("label")),j.label?r.createElement("span",v,j.label):!j.children&&!j.label&&r.createElement("span",p({},v,{dangerouslySetInnerHTML:{__html:"&nbsp;"}}))),I=function(){if(j.badge){var e=h({className:(0,i.AK)(j.badgeClassName),value:j.badge,unstyled:j.unstyled,__parentMetadata:{parent:P}},E("badge"));return r.createElement(f,e,j.badge)}return null}(),M=h({ref:k,"aria-label":j.label?j.label+(j.badge?" "+j.badge:""):j["aria-label"],"data-pc-autofocus":j.autoFocus,className:(0,i.AK)(j.className,_("root",{size:A,disabled:w})),disabled:w},y.getOtherProps(j),E("root"));return r.createElement(r.Fragment,null,r.createElement("button",M,K,C,j.children,I,r.createElement(c.H,null)),z&&r.createElement(u.u,p({target:k,content:j.tooltip,pt:E("tooltip")},j.tooltipOptions)))}));h.displayName="Button"}},function(e){e.O(0,[434,6878,6789,9253,5769,1744],function(){return e(e.s=9704)}),_N_E=e.O()}]);