(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7793],{7874:function(e,n,t){Promise.resolve().then(t.bind(t,8035))},8035:function(e,n,t){"use strict";t.r(n);var r=t(9268),l=t(2980),a=t(8528),u=t(7663),c=t(845),s=t(7358),o=t(439),i=t(315),d=t(4631),p=t(1437),f=t(6006),h=t(1311);n.default=()=>{var e,n,t,m;let[v,g]=(0,f.useState)([]),[x,b]=(0,f.useState)([]),[j,C]=(0,f.useState)(""),[N,k]=(0,f.useState)(null),[y,R]=(0,f.useState)(""),[S,E]=(0,f.useState)(""),[F,O]=(0,f.useState)(null),[I,w]=(0,f.useState)([]),[L,P]=(0,f.useState)(""),[T,A]=(0,f.useState)(null),[_,M]=(0,f.useState)(""),[D,K]=(0,f.useState)(null),[z,q]=(0,f.useState)(null),[B,Y]=(0,f.useState)(""),H=[{name:"New York",code:"NY"},{name:"Rome",code:"RM"},{name:"London",code:"LDN"},{name:"Istanbul",code:"IST"},{name:"Paris",code:"PRS"}];return(0,f.useEffect)(()=>{h.T.getCountries().then(e=>{g(e)})},[]),(0,r.jsxs)("div",{className:"card",children:[(0,r.jsx)("h5",{children:"Float Label"}),(0,r.jsxs)("p",{children:["All input text components support floating labels by adding (",(0,r.jsx)("mark",{children:".p-float-label"}),") to wrapper class."]}),(0,r.jsxs)("div",{className:"grid p-fluid mt-3",children:[(0,r.jsx)("div",{className:"field col-12 md:col-4",children:(0,r.jsxs)("span",{className:"p-float-label",children:[(0,r.jsx)(i.o,{type:"text",id:"inputtext",value:j,onChange:e=>C(e.target.value)}),(0,r.jsx)("label",{htmlFor:"inputtext",children:"InputText"})]})}),(0,r.jsx)("div",{className:"field col-12 md:col-4",children:(0,r.jsxs)("span",{className:"p-float-label",children:[(0,r.jsx)(l.Q,{id:"autocomplete",value:N,onChange:e=>k(e.value),suggestions:x,completeMethod:e=>{let n=[],t=e.query;for(let e=0;e<v.length;e++){let r=v[e];0===r.name.toLowerCase().indexOf(t.toLowerCase())&&n.push(r)}b(n)},field:"name"}),(0,r.jsx)("label",{htmlFor:"autocomplete",children:"AutoComplete"})]})}),(0,r.jsx)("div",{className:"field col-12 md:col-4",children:(0,r.jsxs)("span",{className:"p-float-label p-input-icon-left",children:[(0,r.jsx)("i",{className:"pi pi-search"}),(0,r.jsx)(i.o,{id:"lefticon",value:y,onChange:e=>R(e.target.value)}),(0,r.jsx)("label",{htmlFor:"lefticon",children:"Left Icon"})]})}),(0,r.jsx)("div",{className:"field col-12 md:col-4",children:(0,r.jsxs)("span",{className:"p-float-label p-input-icon-right",children:[(0,r.jsx)("i",{className:"pi pi-spin pi-spinner"}),(0,r.jsx)(i.o,{id:"righticon",value:S,onChange:e=>E(e.target.value)}),(0,r.jsx)("label",{htmlFor:"righticon",children:"Right Icon"})]})}),(0,r.jsx)("div",{className:"field col-12 md:col-4",children:(0,r.jsxs)("span",{className:"p-float-label",children:[(0,r.jsx)(a.f,{inputId:"calendar",value:F,onChange:n=>O(null!==(e=n.value)&&void 0!==e?e:"")}),(0,r.jsx)("label",{htmlFor:"calendar",children:"Calendar"})]})}),(0,r.jsx)("div",{className:"field col-12 md:col-4",children:(0,r.jsxs)("span",{className:"p-float-label",children:[(0,r.jsx)(u.c,{inputId:"chips",value:I,onChange:e=>w(null!==(n=e.value)&&void 0!==n?n:[])}),(0,r.jsx)("label",{htmlFor:"chips",children:"Chips"})]})}),(0,r.jsx)("div",{className:"field col-12 md:col-4",children:(0,r.jsxs)("span",{className:"p-float-label",children:[(0,r.jsx)(s.v,{id:"inputmask",mask:"99/99/9999",value:L,onChange:e=>P(null!==(t=e.value)&&void 0!==t?t:"")}),(0,r.jsx)("label",{htmlFor:"inputmask",children:"InputMask"})]})}),(0,r.jsx)("div",{className:"field col-12 md:col-4",children:(0,r.jsxs)("span",{className:"p-float-label",children:[(0,r.jsx)(o.R,{id:"inputnumber",value:T,onValueChange:e=>A(null!==(m=e.target.value)&&void 0!==m?m:null)}),(0,r.jsx)("label",{htmlFor:"inputnumber",children:"InputNumber"})]})}),(0,r.jsx)("div",{className:"field col-12 md:col-4",children:(0,r.jsxs)("div",{className:"p-inputgroup",children:[(0,r.jsx)("span",{className:"p-inputgroup-addon",children:(0,r.jsx)("i",{className:"pi pi-user"})}),(0,r.jsxs)("span",{className:"p-float-label",children:[(0,r.jsx)(i.o,{type:"text",id:"inputgroup",value:_,onChange:e=>M(e.target.value)}),(0,r.jsx)("label",{htmlFor:"inputgroup",children:"InputGroup"})]})]})}),(0,r.jsx)("div",{className:"field col-12 md:col-4",children:(0,r.jsxs)("span",{className:"p-float-label",children:[(0,r.jsx)(c.L,{id:"dropdown",options:H,value:D,onChange:e=>K(e.value),optionLabel:"name"}),(0,r.jsx)("label",{htmlFor:"dropdown",children:"Dropdown"})]})}),(0,r.jsx)("div",{className:"field col-12 md:col-4",children:(0,r.jsxs)("span",{className:"p-float-label",children:[(0,r.jsx)(p.N,{id:"multiselect",options:H,value:z,onChange:e=>q(e.value),optionLabel:"name"}),(0,r.jsx)("label",{htmlFor:"multiselect",children:"MultiSelect"})]})}),(0,r.jsx)("div",{className:"field col-12 md:col-4",children:(0,r.jsxs)("span",{className:"p-float-label",children:[(0,r.jsx)(d.g,{id:"textarea",rows:3,value:B,onChange:e=>Y(e.target.value)}),(0,r.jsx)("label",{htmlFor:"textarea",children:"Textarea"})]})})]})]})}},1311:function(e,n,t){"use strict";t.d(n,{T:function(){return r}});let r={getCountries:()=>fetch("/demo/data/countries.json",{headers:{"Cache-Control":"no-cache"}}).then(e=>e.json()).then(e=>e.data)}},7358:function(e,n,t){"use strict";t.d(n,{v:function(){return i}});var r=t(6006),l=t(3142),a=t(465),u=t(315),c=t(5942);function s(){return(s=Object.assign?Object.assign.bind():function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e}).apply(this,arguments)}var o=t(6878).V.extend({defaultProps:{__TYPE:"InputMask",autoClear:!0,autoFocus:!1,className:null,disabled:!1,id:null,mask:null,maxLength:null,name:null,onBlur:null,onChange:null,onComplete:null,onFocus:null,placeholder:null,readOnly:!1,required:!1,size:null,slotChar:"_",style:null,tabIndex:null,tooltip:null,tooltipOptions:null,type:"text",unmask:!1,value:null,children:void 0}}),i=r.memo(r.forwardRef(function(e,n){var t=r.useContext(l.Ou),i=o.getProps(e,t),d=r.useRef(null),p=r.useRef(null),f=r.useRef(0),h=r.useRef([]),m=r.useRef([]),v=r.useRef(0),g=r.useRef(null),x=r.useRef(!1),b=r.useRef(null),j=r.useRef(null),C=r.useRef(null),N=r.useRef(null),k=r.useRef(null),y=r.useRef(!1),R=function(e,n){var t,r,l,a=d.current;if(a&&a.offsetParent&&a===document.activeElement){if("number"!=typeof e)return a.setSelectionRange?(r=a.selectionStart,l=a.selectionEnd):document.selection&&document.selection.createRange&&(l=(r=0-(t=document.selection.createRange()).duplicate().moveStart("character",-1e5))+t.text.length),{begin:r,end:l};r=e,l="number"==typeof n?n:r,a.setSelectionRange?a.setSelectionRange(r,l):a.createTextRange&&((t=a.createTextRange()).collapse(!0),t.moveEnd("character",l),t.moveStart("character",r),t.select())}},S=function(){for(var e=p.current;e<=f.current;e++)if(h.current[e]&&m.current[e]===E(e))return!1;return!0},E=r.useCallback(function(e){return e<i.slotChar.length?i.slotChar.charAt(e):i.slotChar.charAt(0)},[i.slotChar]),F=function(){return i.unmask?K():d.current&&d.current.value},O=function(e){for(;++e<v.current&&!h.current[e];);return e},I=function(e){for(;--e>=0&&!h.current[e];);return e},w=function(e,n){var t,r;if(!(e<0)){for(t=e,r=O(n);t<v.current;t++)if(h.current[t]){if(r<v.current&&h.current[t].test(m.current[r]))m.current[t]=m.current[r],m.current[r]=E(r);else break;r=O(r)}_(),R(Math.max(p.current,e))}},L=function(e){var n,t,r,l;for(n=e,t=E(e);n<v.current;n++)if(h.current[n]){if(r=O(n),l=m.current[n],m.current[n]=t,r<v.current&&h.current[r].test(l))t=l;else break}},P=function(e){var n=d.current.value,t=R();if(g.current.length&&g.current.length>n.length){for(M(!0);t.begin>0&&!h.current[t.begin-1];)t.begin--;if(0===t.begin)for(;t.begin<p.current&&!h.current[t.begin];)t.begin++;R(t.begin,t.begin)}else{for(M(!0);t.begin<v.current&&!h.current[t.begin];)t.begin++;R(t.begin,t.begin)}i.onComplete&&S()&&i.onComplete({originalEvent:e,value:F()}),z(e)},T=function(e){if(x.current=!1,M(),z(e),q(),i.onBlur&&i.onBlur(e),d.current.value!==b.current){var n=document.createEvent("HTMLEvents");n.initEvent("change",!0,!1),d.current.dispatchEvent(n)}},A=function(e,n){var t;for(t=e;t<n&&t<v.current;t++)h.current[t]&&(m.current[t]=E(t))},_=function(){d.current&&(d.current.value=m.current.join(""))},M=function(e){j.current=!0;var n,t,r,l=d.current&&d.current.value,a=-1;for(n=0,r=0;n<v.current;n++)if(h.current[n]){for(m.current[n]=E(n);r++<l.length;)if(t=l.charAt(r-1),h.current[n].test(t)){m.current[n]=t,a=n;break}if(r>l.length){A(n+1,v.current);break}}else m.current[n]===l.charAt(r)&&r++,n<C.current&&(a=n);return e?_():a+1<C.current?i.autoClear||m.current.join("")===N.current?(d.current&&d.current.value&&(d.current.value=""),A(0,v.current)):_():(_(),d.current&&(d.current.value=d.current.value.substring(0,a+1))),C.current?n:p.current},D=function(e){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];!i.readOnly&&(n||R(M(!0)),z(e),i.onComplete&&S()&&i.onComplete({originalEvent:e,value:F()}))},K=r.useCallback(function(){for(var e=[],n=0;n<m.current.length;n++){var t=m.current[n];h.current[n]&&t!==E(n)&&e.push(t)}return e.join("")},[E]),z=function(e){if(i.onChange){var n=i.unmask?K():e&&e.target.value;i.onChange({originalEvent:e,value:N.current!==n?n:"",stopPropagation:function(){e.stopPropagation()},preventDefault:function(){e.preventDefault()},target:{name:i.name,id:i.id,value:N.current!==n?n:""}})}},q=function(){d.current&&d.current.value&&d.current.value.length>0?c.p7.addClass(d.current,"p-filled"):c.p7.removeClass(d.current,"p-filled")},B=function(e){var n;return d.current&&(null==i.value?d.current.value="":(d.current.value=i.value,n=M(e),setTimeout(function(){if(d.current)return _(),M(e)},10)),b.current=d.current.value),q(),n},Y=r.useCallback(function(){return i.unmask?i.value!==K():N.current!==d.current.value&&d.current.value!==i.value},[i.unmask,i.value,K]),H=function(){if(i.mask){h.current=[],C.current=i.mask.length,v.current=i.mask.length,p.current=null;var e={9:"[0-9]",a:"[A-Za-z]","*":"[A-Za-z0-9]"};y.current=c.p7.isChrome()&&c.p7.isAndroid();for(var n=i.mask.split(""),t=0;t<n.length;t++){var r=n[t];"?"===r?(v.current--,C.current=t):e[r]?(h.current.push(new RegExp(e[r])),null===p.current&&(p.current=h.current.length-1),t<C.current&&(f.current=h.current.length-1)):h.current.push(null)}m.current=[];for(var l=0;l<n.length;l++){var a=n[l];"?"!==a&&(e[a]?m.current.push(E(l)):m.current.push(a))}N.current=m.current.join("")}};r.useImperativeHandle(n,function(){return{props:i,focus:function(){return c.p7.focus(d.current)},getElement:function(){return d.current}}}),r.useEffect(function(){c.gb.combinedRefs(d,n)},[d,n]),(0,a.nw)(function(){H(),B()}),(0,a.rf)(function(){H(),R(B(!0)),i.unmask&&z()},[i.mask]),(0,a.rf)(function(){Y()&&B()},[Y]);var V=o.getOtherProps(i),Z=(0,c.AK)("p-inputmask",i.className);return r.createElement(u.o,s({ref:d,autoFocus:i.autoFocus,id:i.id,type:i.type,name:i.name,style:i.style,className:Z},V,{placeholder:i.placeholder,size:i.size,maxLength:i.maxLength,tabIndex:i.tabIndex,disabled:i.disabled,readOnly:i.readOnly,onFocus:function(e){var n;!i.readOnly&&(x.current=!0,clearTimeout(k.current),d.current?b.current=d.current.value:b.current="",n=M()||0,k.current=setTimeout(function(){d.current===document.activeElement&&(_(),n===i.mask.replace("?","").length?R(0,n):R(n),q())},100),i.onFocus&&i.onFocus(e))},onBlur:T,onKeyDown:function(e){if(!i.readOnly){var n,t,r,l=e.which||e.keyCode;g.current=d.current.value,8===l||46===l||c.p7.isIOS()&&127===l?(t=(n=R()).begin,(r=n.end)-t==0&&(t=46!==l?I(t):r=O(t-1),r=46===l?O(r):r),A(t,r),w(t,r-1),z(e),e.preventDefault()):13===l?(T(e),z(e)):27===l&&(d.current.value=b.current,R(0,M()),z(e),e.preventDefault())}},onKeyPress:function(e){if(!i.readOnly){var n,t,r,l,a=e.which||e.keyCode,u=R();e.ctrlKey||e.altKey||e.metaKey||a<32||(a&&13!==a&&(u.end-u.begin!=0&&(A(u.begin,u.end),w(u.begin,u.end-1)),(n=O(u.begin-1))<v.current&&(t=String.fromCharCode(a),h.current[n].test(t)&&(L(n),m.current[n]=t,_(),r=O(n),c.p7.isAndroid()?setTimeout(function(){R(r)},0):R(r),u.begin<=f.current&&(l=S()))),e.preventDefault()),z(e),i.onComplete&&l&&i.onComplete({originalEvent:e,value:F()}))}},onInput:function(e){y.current?P(e):D(e)},onPaste:function(e){return D(e,!0)},required:i.required,tooltip:i.tooltip,tooltipOptions:i.tooltipOptions,pt:i.pt,unstyled:i.unstyled,__parentMetadata:{parent:{props:i}}}))}));i.displayName="InputMask"}},function(e){e.O(0,[434,6878,6789,8285,9683,3081,2087,3649,7731,9253,5769,1744],function(){return e(e.s=7874)}),_N_E=e.O()}]);