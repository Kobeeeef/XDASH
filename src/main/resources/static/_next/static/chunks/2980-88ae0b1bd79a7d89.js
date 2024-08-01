"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2980],{2980:function(e,t,n){n.d(t,{Q:function(){return D}});var o=n(6006),r=n(3142),l=n(3702),i=n(6878),a=n(465),u=n(9449),p=n(2124),c=n(7884),s=n(315),d=n(4417),m=n(9424),f=n(5942),g=n(8285),b=n(6020),v=n(9347),y=n(5788);function h(e){return(h="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function w(e,t,n){var o;return o=function(e,t){if("object"!==h(e)||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var o=n.call(e,t||"default");if("object"!==h(o))return o;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"===h(o)?o:String(o))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function E(){return(E=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e}).apply(this,arguments)}function C(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,o=Array(t);n<t;n++)o[n]=e[n];return o}function x(e,t){if(e){if("string"==typeof e)return C(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);if("Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return C(e,t)}}function O(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var o,r,l,i,a=[],u=!0,p=!1;try{if(l=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;u=!1}else for(;!(u=(o=l.call(n)).done)&&(a.push(o.value),a.length!==t);u=!0);}catch(e){p=!0,r=e}finally{try{if(!u&&null!=n.return&&(i=n.return(),Object(i)!==i))return}finally{if(p)throw r}}return a}}(e,t)||x(e,t)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var S=i.V.extend({defaultProps:{__TYPE:"AutoComplete",id:null,appendTo:null,autoFocus:!1,autoHighlight:!1,className:null,completeMethod:null,delay:300,disabled:!1,dropdown:!1,dropdownAriaLabel:null,dropdownAutoFocus:!0,dropdownIcon:null,dropdownMode:"blank",emptyMessage:null,field:null,forceSelection:!1,inputClassName:null,inputId:null,inputRef:null,inputStyle:null,itemTemplate:null,loadingIcon:null,maxLength:null,minLength:1,multiple:!1,name:null,onBlur:null,onChange:null,onClear:null,onClick:null,onContextMenu:null,onDblClick:null,onDropdownClick:null,onFocus:null,onHide:null,onKeyPress:null,onKeyUp:null,onMouseDown:null,onSelect:null,onShow:null,onUnselect:null,optionGroupChildren:null,optionGroupLabel:null,optionGroupTemplate:null,panelClassName:null,panelFooterTemplate:null,panelStyle:null,placeholder:null,readOnly:!1,removeTokenIcon:null,scrollHeight:"200px",selectedItemTemplate:null,selectionLimit:null,showEmptyMessage:!1,size:null,style:null,suggestions:null,tabIndex:null,tooltip:null,tooltipOptions:null,transitionOptions:null,type:"text",value:null,virtualScrollerOptions:null,children:void 0},css:{classes:{root:function(e){var t=e.props,n=e.focusedState;return(0,f.AK)("p-autocomplete p-component p-inputwrapper",{"p-autocomplete-dd":t.dropdown,"p-autocomplete-multiple":t.multiple,"p-inputwrapper-filled":t.value,"p-inputwrapper-focus":n})},container:function(e){var t=e.props;return(0,f.AK)("p-autocomplete-multiple-container p-component p-inputtext",{"p-disabled":t.disabled})},loadingIcon:"p-autocomplete-loader",dropdownButton:"p-autocomplete-dropdown",removeTokenIcon:"p-autocomplete-token-icon",token:"p-autocomplete-token p-highlight",tokenLabel:"p-autocomplete-token-label",inputToken:"p-autocomplete-input-token",input:function(e){var t=e.props;return(0,f.AK)("p-autocomplete-input",{"p-autocomplete-dd-input":t.dropdown})},panel:function(e){var t=e.context;return(0,f.AK)("p-autocomplete-panel p-component",{"p-input-filled":t&&"filled"===t.inputStyle||"filled"===r.ZP.inputStyle,"p-ripple-disabled":t&&!1===t.ripple||!1===r.ZP.ripple})},listWrapper:"p-autocomplete-items-wrapper",list:function(e){var t=e.virtualScrollerOptions,n=e.options;return t?(0,f.AK)("p-autocomplete-items",n.className):"p-autocomplete-items"},emptyMessage:"p-autocomplete-item",item:function(e){var t=e.suggestion;return e.optionGroupLabel,(0,f.AK)("p-autocomplete-item",{"p-disabled":t.disabled})},itemGroup:"p-autocomplete-item-group",footer:"p-autocomplete-footer",transition:"p-connected-overlay"},styles:"\n@layer primereact {\n    .p-autocomplete {\n        display: inline-flex;\n        position: relative;\n    }\n    \n    .p-autocomplete-loader {\n        position: absolute;\n        top: 50%;\n        margin-top: -.5rem;\n    }\n    \n    .p-autocomplete-dd .p-autocomplete-input {\n        flex: 1 1 auto;\n        width: 1%;\n    }\n    \n    .p-autocomplete-dd .p-autocomplete-input,\n    .p-autocomplete-dd .p-autocomplete-multiple-container {\n         border-top-right-radius: 0;\n         border-bottom-right-radius: 0;\n     }\n    \n    .p-autocomplete-dd .p-autocomplete-dropdown {\n         border-top-left-radius: 0;\n         border-bottom-left-radius: 0px;\n    }\n    \n    .p-autocomplete .p-autocomplete-panel {\n        min-width: 100%;\n    }\n    \n    .p-autocomplete-panel {\n        position: absolute;\n        top: 0;\n        left: 0;\n    }\n    \n    .p-autocomplete-items {\n        margin: 0;\n        padding: 0;\n        list-style-type: none;\n    }\n    \n    .p-autocomplete-item {\n        cursor: pointer;\n        white-space: nowrap;\n        position: relative;\n        overflow: hidden;\n    }\n    \n    .p-autocomplete-multiple-container {\n        margin: 0;\n        padding: 0;\n        list-style-type: none;\n        cursor: text;\n        overflow: hidden;\n        display: flex;\n        align-items: center;\n        flex-wrap: wrap;\n    }\n    \n    .p-autocomplete-token {\n        cursor: default;\n        display: inline-flex;\n        align-items: center;\n        flex: 0 0 auto;\n    }\n    \n    .p-autocomplete-token-icon {\n        cursor: pointer;\n    }\n    \n    .p-autocomplete-input-token {\n        flex: 1 1 auto;\n        display: inline-flex;\n    }\n    \n    .p-autocomplete-input-token input {\n        border: 0 none;\n        outline: 0 none;\n        background-color: transparent;\n        margin: 0;\n        padding: 0;\n        box-shadow: none;\n        border-radius: 0;\n        width: 100%;\n    }\n    \n    .p-fluid .p-autocomplete {\n        display: flex;\n    }\n    \n    .p-fluid .p-autocomplete-dd .p-autocomplete-input {\n        width: 1%;\n    }\n    \n    .p-autocomplete-items-wrapper {\n        overflow: auto;\n    } \n}\n"}});function k(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,o)}return n}function I(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?k(Object(n),!0).forEach(function(t){w(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):k(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var P=o.memo(o.forwardRef(function(e,t){var n,l,i,u,p,c=(0,a.c)(),s=e.ptm,d=e.cx,m=o.useContext(r.Ou),h=function(t,n){return s(t,I({hostName:e.hostName},n))},w=function(t,n){return h(n,{context:{selected:e.selectedItem.current===t,disabled:t.disabled}})},C=function(t,n){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},l={height:r.props?r.props.itemSize:void 0};if(e.optionGroupLabel){var i=e.optionGroupTemplate?f.gb.getJSXElement(e.optionGroupTemplate,t,n):e.getOptionGroupLabel(t),a=e.getOptionGroupChildren(t).map(function(t,r){var i=n+"_"+r,a=e.selectedItem===t,u=e.itemTemplate?f.gb.getJSXElement(e.itemTemplate,t,r):e.field?f.gb.resolveFieldData(t,e.field):t,p=c({role:"option",className:d("item",{optionGroupLabel:e.optionGroupLabel,suggestion:t}),style:l,onClick:function(n){return e.onItemClick(n,t)},"aria-selected":a,"data-group":n,"data-index":r,"data-p-disabled":t.disabled},w(t,"item"));return o.createElement("li",E({key:i},p),u,o.createElement(v.H,null))}),u=n+"_"+f.gb.resolveFieldData(t,e.optionGroupLabel),p=c({className:d("itemGroup"),style:l,"data-p-highlight":!1},h("itemGroup"));return o.createElement(o.Fragment,{key:u},o.createElement("li",p,i),a)}var s=e.itemTemplate?f.gb.getJSXElement(e.itemTemplate,t,n):e.field?f.gb.resolveFieldData(t,e.field):t,m=c({index:n,role:"option",className:d("item",{suggestion:t}),style:l,onClick:function(n){return e.onItemClick(n,t)},"aria-selected":e.selectedItem.current===t,"data-p-disabled":t.disabled},w(t,"item"));return o.createElement("li",E({key:n},m),s,o.createElement(v.H,null))},x=(n=I({},e.panelStyle||{}),l=function(){if(e.showEmptyMessage&&f.gb.isEmpty(e.suggestions)){var t=e.emptyMessage||(0,r.qJ)("emptyMessage"),n=c({className:d("emptyMessage")},h("emptyMesage")),l=c({className:d("list")},h("list"));return o.createElement("ul",l,o.createElement("li",n,t))}if(e.virtualScrollerOptions){var i=I(I({},e.virtualScrollerOptions),{style:I(I({},e.virtualScrollerOptions.style),{height:e.scrollHeight}),autoSize:!0,items:e.suggestions,itemTemplate:function(e,t){return e&&C(e,t.index,t)},contentTemplate:function(t){var n=c({id:e.listId,ref:t.contentRef,style:t.style,className:d("list",{virtualScrollerProps:i,options:t}),role:"listbox"},h("list"));return o.createElement("ul",n,t.children)}});return o.createElement(y.J,E({ref:e.virtualScrollerRef},i,{pt:h("virtualScroller"),__parentMetadata:{parent:e.metaData}}))}var a=e.suggestions?e.suggestions.map(C):null,u=c({id:e.listId,className:d("list"),role:"listbox"},h("list")),p=c({className:d("listWrapper"),style:{maxHeight:e.scrollHeight||"auto"}},h("listWrapper"));return o.createElement("div",p,o.createElement("ul",u,a))}(),i=function(){if(e.panelFooterTemplate){var t=f.gb.getJSXElement(e.panelFooterTemplate,e,e.onOverlayHide),n=c({className:d("footer")},h("footer"));return o.createElement("div",n,t)}return null}(),u=c({className:(0,f.AK)(e.panelClassName,d("panel",{context:m})),style:n,onClick:function(t){return e.onClick(t)}},h("panel")),p=c({classNames:d("transition"),in:e.in,timeout:{enter:120,exit:100},options:e.transitionOptions,unmountOnExit:!0,onEnter:e.onEnter,onEntering:e.onEntering,onEntered:e.onEntered,onExit:e.onExit,onExited:e.onExited},h("transition")),o.createElement(g.K,E({nodeRef:t},p),o.createElement("div",E({ref:t},u),l,i)));return o.createElement(b.h,{element:x,appendTo:e.appendTo})}));function N(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,o)}return n}function A(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?N(Object(n),!0).forEach(function(t){w(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):N(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}P.displayName="AutoCompletePanel";var D=o.memo(o.forwardRef(function(e,t){var n,g,b,v,y,h,w,k,I,N,D=(0,a.c)(),T=o.useContext(r.Ou),j=S.getProps(e,T),M=O(o.useState(j.id),2),L=M[0],F=M[1],K=O(o.useState(!1),2),G=K[0],R=K[1],_=O(o.useState(!1),2),H=_[0],q=_[1],U=O(o.useState(!1),2),z=U[0],J=U[1],B={props:j,state:{id:L,searching:G,focused:H,overlayVisible:z}},X=S.setMetaData(B),Z=X.ptm,V=X.cx,W=X.sx,Q=X.isUnstyled;(0,i.e)(S.css.styles,Q,{name:"autocomplete"});var Y=o.useRef(null),$=o.useRef(null),ee=o.useRef(j.inputRef),et=o.useRef(null),en=o.useRef(null),eo=o.useRef(null),er=o.useRef(null),el=O((0,a.gq)({target:Y,overlay:$,listener:function(e,t){var n=t.type;t.valid&&("outside"===n&&eu(e)||eb())},when:z}),2),ei=el[0],ea=el[1],eu=function(e){return j.multiple?e.target===et.current||et.current.contains(e.target):e.target===ee.current},ep=function(e){eo.current&&clearTimeout(eo.current);var t=e.target.value;j.multiple||ed(e,t),f.gb.isEmpty(t)?(eb(),j.onClear&&j.onClear(e)):t.length>=j.minLength?eo.current=setTimeout(function(){ec(e,t,"input")},j.delay):eb()},ec=function(e,t,n){null!=t&&("input"!==n||0!==t.trim().length)&&j.completeMethod&&(R(!0),j.completeMethod({originalEvent:e,query:t}))},es=function(e,t,n){if(j.multiple){if(ee.current.value="",!eN(t)&&eT()){var o;ed(e,j.value?[].concat(function(e){if(Array.isArray(e))return C(e)}(o=j.value)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(o)||x(o)||function(){throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}(),[t]):[t])}}else ef(t),ed(e,t);j.onSelect&&j.onSelect({originalEvent:e,value:t}),n||(f.p7.focus(ee.current),eb())},ed=function(e,t){er&&f.gb.deepEquals(er.current,t)||(j.onChange&&j.onChange({originalEvent:e,value:t,stopPropagation:function(){e.stopPropagation()},preventDefault:function(){e.preventDefault()},target:{name:j.name,id:L,value:t}}),er.current=f.gb.isNotEmpty(t)?t:null)},em=function(e){if(f.gb.isNotEmpty(e)){if("string"==typeof e)return e;if(j.selectedItemTemplate)return f.gb.getJSXElement(j.selectedItemTemplate,e)||e;if(!j.field)return e;var t=f.gb.resolveFieldData(e,j.field);return null!=t?t:e}return""},ef=function(e){ee.current.value=em(e)},eg=function(){J(!0)},eb=function(){J(!1),R(!1)},ev=function(){var e=j.multiple?et.current:ee.current;f.p7.alignOverlay($.current,e,j.appendTo||T&&T.appendTo||r.ZP.appendTo)},ey=function(e){j.dropdownAutoFocus&&f.p7.focus(ee.current,j.dropdownAutoFocus),"blank"===j.dropdownMode?ec(e,"","dropdown"):"current"===j.dropdownMode&&ec(e,ee.current.value,"dropdown"),j.onDropdownClick&&j.onDropdownClick({originalEvent:e,query:ee.current.value})},eh=function(e,t){var n=j.value[t];ed(e,j.value.filter(function(e,n){return t!==n})),j.onUnselect&&j.onUnselect({originalEvent:e,value:n})},ew=function(e){if(z){var t=f.p7.findSingle($.current,'li[data-p-highlight="true"]');switch(e.which){case 40:if(t){var n=eC(t);n&&(Q()||f.p7.addClass(n,"p-highlight"),n.setAttribute("data-p-highlight",!0),Q()||f.p7.removeClass(t,"p-highlight"),t.setAttribute("data-p-highlight",!1),f.p7.scrollInView(eA(),n))}else t=f.p7.findSingle($.current,"li"),"itemgroup"===f.p7.getAttribute(t,"data-pc-section")&&(t=eC(t)),t&&(Q()||f.p7.addClass(t,"p-highlight"),t.setAttribute("data-p-highlight",!0));e.preventDefault();break;case 38:if(t){var o=ex(t);o&&(Q()||f.p7.addClass(o,"p-highlight"),o.setAttribute("data-p-highlight",!0),Q()||f.p7.removeClass(t,"p-highlight"),t.setAttribute("data-p-highlight",!1),f.p7.scrollInView(eA(),o))}e.preventDefault();break;case 13:t&&(eE(e,t),eb(),e.preventDefault());break;case 27:eb(),e.preventDefault();break;case 9:t&&eE(e,t),eb()}}if(j.multiple&&8===e.which&&j.value&&j.value.length&&!ee.current.value){var r=j.value[j.value.length-1];ed(e,j.value.slice(0,-1)),j.onUnselect&&j.onUnselect({originalEvent:e,value:r})}},eE=function(e,t){j.optionGroupLabel?es(e,eD(j.suggestions[t.dataset.group])[t.dataset.index]):es(e,j.suggestions[t.getAttribute("index")])},eC=function e(t){var n=t.nextElementSibling;return n?"itemgroup"===f.p7.getAttribute(n,"data-pc-section")?e(n):n:null},ex=function e(t){var n=t.previousElementSibling;return n?"itemgroup"===f.p7.getAttribute(n,"data-pc-section")?e(n):n:null},eO=function(e){q(!0),j.onFocus&&j.onFocus(e)},eS=function(e){if(j.multiple){ee.current.value="";return}var t=f.gb.trim(e.target.value),n=(j.suggestions||[]).find(function(e){var n=j.field?f.gb.resolveFieldData(e,j.field):e;return n&&t===f.gb.trim(n)});n?es(e,n,!0):(ee.current.value="",ed(e,null),j.onClear&&j.onClear(e))},ek=function(e){q(!1),j.forceSelection&&eS(e),j.onBlur&&j.onBlur(e)},eI=function(e){eO(e),Q()||f.p7.addClass(et.current,"p-focus"),et.current.setAttribute("data-p-focus",!0)},eP=function(e){ek(e),Q()||f.p7.removeClass(et.current,"p-focus"),et.current.setAttribute("data-p-focus",!1)},eN=function(e){return!!j.value&&j.value.some(function(t){return f.gb.equals(t,e)})},eA=function(){return $.current.firstChild},eD=function(e){return f.gb.resolveFieldData(e,j.optionGroupChildren)},eT=function(){return!j.value||!j.selectionLimit||j.value.length<j.selectionLimit};o.useEffect(function(){f.gb.combinedRefs(ee,j.inputRef)},[ee,j.inputRef]),(0,a.nw)(function(){L||F((0,f.Th)()),j.autoFocus&&f.p7.focus(ee.current,j.autoFocus),ev()}),(0,a.rf)(function(){G&&(f.gb.isNotEmpty(j.suggestions)||j.showEmptyMessage?eg():eb(),R(!1))},[j.suggestions]),(0,a.rf)(function(){ee.current&&!j.multiple&&ef(j.value),z&&ev()}),(0,a.zq)(function(){eo.current&&clearTimeout(eo.current),f.P9.clear($.current)}),o.useImperativeHandle(t,function(){return{props:j,search:ec,show:eg,hide:eb,focus:function(){return f.p7.focus(ee.current)},getElement:function(){return Y.current},getOverlay:function(){return $.current},getInput:function(){return ee.current},getVirtualScroller:function(){return en.current}}});var ej=L+"_list",eM=f.gb.isNotEmpty(j.tooltip),eL=S.getOtherProps(j),eF=f.gb.reduceKeys(eL,f.p7.ARIA_PROPS),eK=function(){if(G){var e=D({className:V("loadingIcon")},Z("loadingIcon")),t=j.loadingIcon||o.createElement(p.L,E({},e,{spin:!0}));return f.Cz.getJSXIcon(t,A({},e),{props:j})}return null}(),eG=j.multiple?(y=eT(),h=f.gb.isNotEmpty(j.value)?j.value.map(function(e,t){var n=t+"multi-item",r=D({className:V("removeTokenIcon"),onClick:function(e){return eh(e,t)}},Z("removeTokenIcon")),l=j.removeTokenIcon||o.createElement(c.x,r),i=!j.disabled&&f.Cz.getJSXIcon(l,A({},r),{props:j}),a=D({className:V("token")},Z("token")),u=D({className:V("tokenLabel")},Z("tokenLabel"));return o.createElement("li",E({key:n},a),o.createElement("span",u,em(e)),i)}):null,n=y,g=z?L+"_list":null,b=D({className:V("inputToken")},Z("inputToken")),v=D(A({id:j.inputId,ref:ee,"aria-autocomplete":"list","aria-controls":g,"aria-expanded":z,"aria-haspopup":"listbox",autoComplete:"off",className:j.inputClassName,disabled:j.disabled,maxLength:j.maxLength,name:j.name,onBlur:eP,onChange:n?ep:void 0,onFocus:eI,onKeyDown:n?ew:void 0,onKeyPress:j.onKeyPress,onKeyUp:j.onKeyUp,placeholder:n?j.placeholder:void 0,readOnly:j.readOnly||!n,required:j.required,role:"combobox",style:j.inputStyle,tabIndex:j.tabIndex,type:j.type},eF),Z("input")),w=o.createElement("li",b,o.createElement("input",v)),k=D({ref:et,className:V("container"),onClick:y?function(e){f.p7.focus(ee.current),j.onClick&&j.onClick(e)}:void 0,onContextMenu:j.onContextMenu,onMouseDown:j.onMouseDown,onDoubleClick:j.onDblClick,"data-p-focus":H,"data-p-disabled":j.disabled},Z("container")),o.createElement("ul",k,h,w)):(I=em(j.value),N=z?L+"_list":null,o.createElement(s.o,E({ref:ee,id:j.inputId,type:j.type,name:j.name,defaultValue:I,role:"combobox","aria-autocomplete":"list","aria-controls":N,"aria-haspopup":"listbox","aria-expanded":z,className:(0,f.AK)(j.inputClassName,V("input")),style:j.inputStyle,autoComplete:"off",readOnly:j.readOnly,required:j.required,disabled:j.disabled,placeholder:j.placeholder,size:j.size,maxLength:j.maxLength,tabIndex:j.tabIndex,onBlur:ek,onFocus:eO,onChange:ep,onMouseDown:j.onMouseDown,onKeyUp:j.onKeyUp,onKeyDown:ew,onKeyPress:j.onKeyPress,onContextMenu:j.onContextMenu,onClick:j.onClick,onDoubleClick:j.onDblClick,pt:Z("input")},eF,{__parentMetadata:{parent:B}}))),eR=function(){if(j.dropdown){var e=j.dropdownAriaLabel||j.placeholder||(0,r.qJ)("choose");return o.createElement(l.z,{type:"button",icon:j.dropdownIcon||o.createElement(u.v,null),className:V("dropdownButton"),disabled:j.disabled,onClick:ey,"aria-label":e,pt:Z("dropdownButton"),__parentMetadata:{parent:B}})}return null}(),e_=D({id:L,ref:Y,style:j.style,className:(0,f.AK)(j.className,V("root",{focusedState:H}))},eL,Z("root"));return o.createElement(o.Fragment,null,o.createElement("span",e_,eG,eK,eR,o.createElement(P,E({hostName:"AutoComplete",ref:$,virtualScrollerRef:en},j,{listId:ej,onItemClick:es,selectedItem:er,onClick:function(e){d.F.emit("overlay-click",{originalEvent:e,target:Y.current})},getOptionGroupLabel:function(e){return j.optionGroupLabel?f.gb.resolveFieldData(e,j.optionGroupLabel):e},getOptionGroupChildren:eD,in:z,onEnter:function(){f.P9.set("overlay",$.current,T&&T.autoZIndex||r.ZP.autoZIndex,T&&T.zIndex.overlay||r.ZP.zIndex.overlay),f.p7.addStyles($.current,{position:"absolute",top:"0",left:"0"}),ev()},onEntering:function(){if(j.autoHighlight&&j.suggestions&&j.suggestions.length){var e=eA().firstChild.firstChild;e&&(Q()||f.p7.addClass(e,"p-highlight"),e.setAttribute("data-p-highlight",!0))}},onEntered:function(){ei(),j.onShow&&j.onShow()},onExit:function(){ea()},onExited:function(){f.P9.clear($.current),j.onHide&&j.onHide()},ptm:Z,cx:V,sx:W}))),eM&&o.createElement(m.u,E({target:Y,content:j.tooltip,pt:Z("tooltip")},j.tooltipOptions)))}));D.displayName="AutoComplete"}}]);