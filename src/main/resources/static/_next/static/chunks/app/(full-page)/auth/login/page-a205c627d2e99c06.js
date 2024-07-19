(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3507],{7520:function(e,t,n){Promise.resolve().then(n.bind(n,2373))},2373:function(e,t,n){"use strict";n.r(t);var r=n(9268),i=n(6008),o=n(6006),a=n(3702),l=n(9468),s=n(8671),u=n(5942),c=n(4046);t.default=()=>{let[e,t]=(0,o.useState)(""),[n,f]=(0,o.useState)(""),{layoutConfig:d}=(0,o.useContext)(s.V),p=(0,i.useRouter)(),[m,y]=(0,o.useState)(!1),v=(0,u.AK)("surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden",{"p-input-filled":"filled"===d.inputStyle}),b=(0,o.useRef)(null),g=async t=>{if(t.preventDefault(),!e)return f("Password is required");f("");let n=new AbortController,r=setTimeout(()=>n.abort(),3e3);try{y(!0);let t=await fetch("/perform_login",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"username=user&password=".concat(e),signal:n.signal});y(!1),clearTimeout(r),200===t.status?(y(!0),b.current.show({severity:"success",summary:"Success",detail:"Redirecting to dashboard...",life:3e3}),setTimeout(()=>{p.push("/")},1e3)):f("Invalid password, please try again.")}catch(e){y(!1),"AbortError"===e.name?f("Request timed out, please try again."):f("An error occurred. Please try again.")}};return(0,r.jsxs)("div",{className:v,children:[(0,r.jsx)(c.F,{ref:b}),(0,r.jsxs)("div",{className:"flex flex-column align-items-center justify-content-center",children:[(0,r.jsx)("img",{src:"/images/logo/logo.png",alt:"XBOT logo",className:"xl:mb-5 lg:mb-4 sm:mb-3 xl:mb-5 lg:mb-4 sm:mb-3 mb-2 xl:w-30rem lg:w-25rem sm:w-20rem w-9 flex-shrink-0"}),(0,r.jsx)("div",{style:{borderRadius:"56px",padding:"0.3rem",background:"linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)"},children:(0,r.jsxs)("div",{className:"w-full surface-card py-8 px-5 sm:px-8",style:{borderRadius:"53px"},children:[(0,r.jsxs)("div",{className:"text-center mb-5",children:[(0,r.jsx)("img",{src:"/images/logo/favicon.ico",alt:"Image",height:"50",className:"mb-3"}),(0,r.jsx)("div",{className:"text-900 text-3xl font-medium mb-3",children:"Welcome!"}),(0,r.jsx)("span",{className:"text-600 font-medium",children:"Sign in to continue"})]}),(0,r.jsxs)("div",{children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{htmlFor:"password1",className:"block text-900 font-medium text-xl mb-2",children:"Password"}),(0,r.jsx)(l.r,{inputId:"password1",value:e,onChange:e=>t(e.target.value),placeholder:"Password",toggleMask:!0,className:"w-full mb-5",inputClassName:"w-full p-3 md:w-30rem"})]}),n&&(0,r.jsx)("div",{className:"mb-3 text-red-600",children:n}),(0,r.jsx)(a.z,{loading:m,label:"Sign In",className:"w-full p-3 text-xl",onClick:g})]})]})})]})]})}},8671:function(e,t,n){"use strict";n.d(t,{V:function(){return o},a:function(){return a}});var r=n(9268),i=n(6006);let o=(0,i.createContext)({}),a=e=>{let{children:t}=e,[n,a]=(0,i.useState)({ripple:!0,inputStyle:"outlined",menuMode:"static",colorScheme:"dark",theme:"lara-dark-indigo",scale:14}),[l,s]=(0,i.useState)({staticMenuDesktopInactive:!1,overlayMenuActive:!1,profileSidebarVisible:!1,configSidebarVisible:!1,staticMenuMobileActive:!1,menuHoverActive:!1}),u=()=>"overlay"===n.menuMode,c=()=>window.innerWidth>991;return(0,r.jsx)(o.Provider,{value:{layoutConfig:n,setLayoutConfig:a,layoutState:l,setLayoutState:s,onMenuToggle:()=>{u()&&s(e=>({...e,overlayMenuActive:!e.overlayMenuActive})),c()?s(e=>({...e,staticMenuDesktopInactive:!e.staticMenuDesktopInactive})):s(e=>({...e,staticMenuMobileActive:!e.staticMenuMobileActive}))},showProfileSidebar:()=>{s(e=>({...e,profileSidebarVisible:!e.profileSidebarVisible}))}},children:t})}},6008:function(e,t,n){e.exports=n(794)},3171:function(e,t,n){"use strict";n.d(t,{n:function(){return a}});var r=n(6006),i=n(6986);function o(){return(o=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}var a=r.memo(r.forwardRef(function(e,t){var n=i.A.getPTI(e);return r.createElement("svg",o({ref:t,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"},n),r.createElement("path",{d:"M4.86199 11.5948C4.78717 11.5923 4.71366 11.5745 4.64596 11.5426C4.57826 11.5107 4.51779 11.4652 4.46827 11.4091L0.753985 7.69483C0.683167 7.64891 0.623706 7.58751 0.580092 7.51525C0.536478 7.44299 0.509851 7.36177 0.502221 7.27771C0.49459 7.19366 0.506156 7.10897 0.536046 7.03004C0.565935 6.95111 0.613367 6.88 0.674759 6.82208C0.736151 6.76416 0.8099 6.72095 0.890436 6.69571C0.970973 6.67046 1.05619 6.66385 1.13966 6.67635C1.22313 6.68886 1.30266 6.72017 1.37226 6.76792C1.44186 6.81567 1.4997 6.8786 1.54141 6.95197L4.86199 10.2503L12.6397 2.49483C12.7444 2.42694 12.8689 2.39617 12.9932 2.40745C13.1174 2.41873 13.2343 2.47141 13.3251 2.55705C13.4159 2.64268 13.4753 2.75632 13.4938 2.87973C13.5123 3.00315 13.4888 3.1292 13.4271 3.23768L5.2557 11.4091C5.20618 11.4652 5.14571 11.5107 5.07801 11.5426C5.01031 11.5745 4.9368 11.5923 4.86199 11.5948Z",fill:"currentColor"}))}));a.displayName="CheckIcon"},5162:function(e,t,n){"use strict";n.d(t,{q:function(){return a}});var r=n(6006),i=n(6986);function o(){return(o=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}var a=r.memo(r.forwardRef(function(e,t){var n=i.A.getPTI(e);return r.createElement("svg",o({ref:t,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"},n),r.createElement("path",{d:"M8.01186 7.00933L12.27 2.75116C12.341 2.68501 12.398 2.60524 12.4375 2.51661C12.4769 2.42798 12.4982 2.3323 12.4999 2.23529C12.5016 2.13827 12.4838 2.0419 12.4474 1.95194C12.4111 1.86197 12.357 1.78024 12.2884 1.71163C12.2198 1.64302 12.138 1.58893 12.0481 1.55259C11.9581 1.51625 11.8617 1.4984 11.7647 1.50011C11.6677 1.50182 11.572 1.52306 11.4834 1.56255C11.3948 1.60204 11.315 1.65898 11.2488 1.72997L6.99067 5.98814L2.7325 1.72997C2.59553 1.60234 2.41437 1.53286 2.22718 1.53616C2.03999 1.53946 1.8614 1.61529 1.72901 1.74767C1.59663 1.88006 1.5208 2.05865 1.5175 2.24584C1.5142 2.43303 1.58368 2.61419 1.71131 2.75116L5.96948 7.00933L1.71131 11.2675C1.576 11.403 1.5 11.5866 1.5 11.7781C1.5 11.9696 1.576 12.1532 1.71131 12.2887C1.84679 12.424 2.03043 12.5 2.2219 12.5C2.41338 12.5 2.59702 12.424 2.7325 12.2887L6.99067 8.03052L11.2488 12.2887C11.3843 12.424 11.568 12.5 11.7594 12.5C11.9509 12.5 12.1346 12.424 12.27 12.2887C12.4053 12.1532 12.4813 11.9696 12.4813 11.7781C12.4813 11.5866 12.4053 11.403 12.27 11.2675L8.01186 7.00933Z",fill:"currentColor"}))}));a.displayName="TimesIcon"},315:function(e,t,n){"use strict";n.d(t,{o:function(){return m}});var r=n(6006),i=n(3142),o=n(6878),a=n(5497),l=n(9424),s=n(5942);function u(){return(u=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function c(e){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var f=o.V.extend({defaultProps:{__TYPE:"InputText",__parentMetadata:null,keyfilter:null,validateOnly:!1,tooltip:null,tooltipOptions:null,onBeforeInput:null,onInput:null,onKeyDown:null,onPaste:null,children:void 0},css:{classes:{root:function(e){var t=e.props,n=e.isFilled;return(0,s.AK)("p-inputtext p-component",{"p-disabled":t.disabled,"p-filled":n},t.className)}}}});function d(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?d(Object(n),!0).forEach(function(t){!function(e,t,n){var r;r=function(e,t){if("object"!==c(e)||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t||"default");if("object"!==c(r))return r;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"===c(r)?r:String(r))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):d(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var m=r.memo(r.forwardRef(function(e,t){var n=r.useContext(i.Ou),c=f.getProps(e,n),d=f.setMetaData(p(p({props:c},c.__parentMetadata),{},{context:{disabled:c.disabled}})),m=d.ptm,y=d.cx,v=d.isUnstyled;(0,o.e)(f.css.styles,v,{name:"inputtext",styled:!0});var b=r.useRef(t);r.useEffect(function(){s.gb.combinedRefs(b,t)},[b,t]);var g=r.useMemo(function(){return s.gb.isNotEmpty(c.value)||s.gb.isNotEmpty(c.defaultValue)},[c.value,c.defaultValue]),h=s.gb.isNotEmpty(c.tooltip),x=(0,s.dG)({className:y("root",{isFilled:g}),onBeforeInput:function(e){c.onBeforeInput&&c.onBeforeInput(e),c.keyfilter&&a.F.onBeforeInput(e,c.keyfilter,c.validateOnly)},onInput:function(e){var t=e.target,n=!0;c.keyfilter&&c.validateOnly&&(n=a.F.validate(e,c.keyfilter)),c.onInput&&c.onInput(e,n),s.gb.isNotEmpty(t.value)?s.p7.addClass(t,"p-filled"):s.p7.removeClass(t,"p-filled")},onKeyDown:function(e){c.onKeyDown&&c.onKeyDown(e),c.keyfilter&&a.F.onKeyPress(e,c.keyfilter,c.validateOnly)},onPaste:function(e){c.onPaste&&c.onPaste(e),c.keyfilter&&a.F.onPaste(e,c.keyfilter,c.validateOnly)}},f.getOtherProps(c),m("root"));return r.createElement(r.Fragment,null,r.createElement("input",u({ref:b},x)),h&&r.createElement(l.u,u({target:b,content:c.tooltip},c.tooltipOptions,{pt:m("tooltip")})))}));m.displayName="InputText"},5497:function(e,t,n){"use strict";n.d(t,{F:function(){return o}});var r=n(5942);function i(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}var o={DEFAULT_MASKS:{pint:/[\d]/,int:/[\d\-]/,pnum:/[\d\.]/,money:/[\d\.\s,]/,num:/[\d\-\.]/,hex:/[0-9a-f]/i,email:/[a-z0-9_\.\-@]/i,alpha:/[a-z_]/i,alphanum:/[a-z0-9_]/i},getRegex:function(e){return o.DEFAULT_MASKS[e]?o.DEFAULT_MASKS[e]:e},onBeforeInput:function(e,t,n){!n&&r.p7.isAndroid()&&this.validateKey(e,e.data,t)},onKeyPress:function(e,t,n){n||r.p7.isAndroid()||e.ctrlKey||e.altKey||this.validateKey(e,e.key,t)},onPaste:function(e,t,n){if(!n){var r,o=this.getRegex(t);((function(e){if(Array.isArray(e))return i(e)})(r=e.clipboardData.getData("text"))||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(r)||function(e,t){if(e){if("string"==typeof e)return i(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);if("Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return i(e,t)}}(r)||function(){throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()).forEach(function(t){if(!o.test(t))return e.preventDefault(),!1})}},validateKey:function(e,t,n){null!=t&&1===t.length&&(this.getRegex(n).test(t)||e.preventDefault())},validate:function(e,t){var n=e.target.value,r=!0,i=this.getRegex(t);return n&&!i.test(n)&&(r=!1),r}}},4417:function(e,t,n){"use strict";n.d(t,{F:function(){return r}});var r=(0,n(5942).Nd)()}},function(e){e.O(0,[434,6878,6789,8285,3081,4046,9468,9253,5769,1744],function(){return e(e.s=7520)}),_N_E=e.O()}]);