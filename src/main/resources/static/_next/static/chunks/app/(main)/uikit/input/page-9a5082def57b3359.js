(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2606],{4040:function(e,l,s){Promise.resolve().then(s.bind(s,7403))},7403:function(e,l,s){"use strict";s.r(l);var a=s(9268),n=s(2980),c=s(3702),o=s(8528),i=s(4618),d=s(7663),t=s(5485),r=s(845),h=s(439),u=s(8568),m=s(315),p=s(4631),x=s(5616),j=s(2707),v=s(1437),g=s(8152),N=s(5294),C=s(1106),b=s(3377),f=s(3621),S=s(6006),k=s(1311);l.default=()=>{var e,l,s,w,O,L,I;let[y,E]=(0,S.useState)(""),[Y,R]=(0,S.useState)([]),[T,F]=(0,S.useState)(null),[A,B]=(0,S.useState)([]),[P,U]=(0,S.useState)(null),[D,_]=(0,S.useState)(null),[M,X]=(0,S.useState)([]),[z,G]=(0,S.useState)(""),[q,J]=(0,S.useState)(null),[K,Q]=(0,S.useState)("1976D2"),[V,W]=(0,S.useState)(20),[$,H]=(0,S.useState)(null),[Z,ee]=(0,S.useState)([]),[el,es]=(0,S.useState)(!1),[ea,en]=(0,S.useState)(null),[ec,eo]=(0,S.useState)(null),[ei,ed]=(0,S.useState)(null),[et,er]=(0,S.useState)(!1),[eh,eu]=(0,S.useState)(null),[em,ep]=(0,S.useState)(null),[ex,ej]=(0,S.useState)(!1);(0,S.useEffect)(()=>{k.T.getCountries().then(e=>R(e))},[]);let ev=e=>{let l=[...Z];e.checked?l.push(e.value):l.splice(l.indexOf(e.value),1),ee(l)};return(0,a.jsxs)("div",{className:"grid p-fluid input-demo",children:[(0,a.jsxs)("div",{className:"col-12 md:col-6",children:[(0,a.jsxs)("div",{className:"card",children:[(0,a.jsx)("h5",{children:"InputText"}),(0,a.jsxs)("div",{className:"grid formgrid",children:[(0,a.jsx)("div",{className:"col-12 mb-2 lg:col-4 lg:mb-0",children:(0,a.jsx)(m.o,{type:"text",placeholder:"Default"})}),(0,a.jsx)("div",{className:"col-12 mb-2 lg:col-4 lg:mb-0",children:(0,a.jsx)(m.o,{type:"text",placeholder:"Disabled",disabled:!0})}),(0,a.jsx)("div",{className:"col-12 mb-2 lg:col-4 lg:mb-0",children:(0,a.jsx)(m.o,{type:"text",placeholder:"Invalid",className:"p-invalid"})})]}),(0,a.jsx)("h5",{children:"Icons"}),(0,a.jsxs)("div",{className:"grid formgrid",children:[(0,a.jsx)("div",{className:"col-12 mb-2 lg:col-4 lg:mb-0",children:(0,a.jsxs)("span",{className:"p-input-icon-left",children:[(0,a.jsx)("i",{className:"pi pi-user"}),(0,a.jsx)(m.o,{type:"text",placeholder:"Username"})]})}),(0,a.jsx)("div",{className:"col-12 mb-2 lg:col-4 lg:mb-0",children:(0,a.jsxs)("span",{className:"p-input-icon-right",children:[(0,a.jsx)(m.o,{type:"text",placeholder:"Search"}),(0,a.jsx)("i",{className:"pi pi-search"})]})}),(0,a.jsx)("div",{className:"col-12 mb-2 lg:col-4 lg:mb-0",children:(0,a.jsxs)("span",{className:"p-input-icon-left p-input-icon-right",children:[(0,a.jsx)("i",{className:"pi pi-user"}),(0,a.jsx)(m.o,{type:"text",placeholder:"Search"}),(0,a.jsx)("i",{className:"pi pi-search"})]})})]}),(0,a.jsx)("h5",{children:"Float Label"}),(0,a.jsxs)("span",{className:"p-float-label",children:[(0,a.jsx)(m.o,{id:"username",type:"text",value:y,onChange:e=>E(e.target.value)}),(0,a.jsx)("label",{htmlFor:"username",children:"Username"})]}),(0,a.jsx)("h5",{children:"Textarea"}),(0,a.jsx)(p.g,{placeholder:"Your Message",rows:5,cols:30}),(0,a.jsx)("h5",{children:"AutoComplete"}),(0,a.jsx)(n.Q,{placeholder:"Search",id:"dd",dropdown:!0,multiple:!0,value:T,onChange:e=>F(e.value),suggestions:A,completeMethod:e=>{setTimeout(()=>{e.query.trim().length?B(Y.filter(l=>l.name.toLowerCase().startsWith(e.query.toLowerCase()))):B([...Y])},250)},field:"name"}),(0,a.jsx)("h5",{children:"Calendar"}),(0,a.jsx)(o.f,{showIcon:!0,showButtonBar:!0,value:P,onChange:l=>U(null!==(e=l.value)&&void 0!==e?e:null)}),(0,a.jsx)("h5",{children:"InputNumber"}),(0,a.jsx)(h.R,{value:D,onValueChange:e=>_(null!==(l=e.value)&&void 0!==l?l:null),showButtons:!0,mode:"decimal"}),(0,a.jsx)("h5",{children:"Chips"}),(0,a.jsx)(d.c,{value:M,onChange:e=>X(null!==(s=e.value)&&void 0!==s?s:[])})]}),(0,a.jsx)("div",{className:"card",children:(0,a.jsxs)("div",{className:"grid",children:[(0,a.jsxs)("div",{className:"col-12",children:[(0,a.jsx)("h5",{children:"Slider"}),(0,a.jsx)(m.o,{value:z,onChange:e=>G(parseInt(e.target.value,10))}),(0,a.jsx)(b.i,{value:z,onChange:e=>G(e.value)})]}),(0,a.jsxs)("div",{className:"col-12 md:col-6",children:[(0,a.jsx)("h5",{children:"Rating"}),(0,a.jsx)(N.i,{value:q,onChange:e=>J(null!==(w=e.value)&&void 0!==w?w:0)})]}),(0,a.jsxs)("div",{className:"col-12 md:col-6",children:[(0,a.jsx)("h5",{children:"ColorPicker"}),(0,a.jsx)(t.z,{value:K,onChange:e=>Q(null!==(O=e.value)&&void 0!==O?O:""),style:{width:"2rem"}})]}),(0,a.jsxs)("div",{className:"col-12",children:[(0,a.jsx)("h5",{children:"Knob"}),(0,a.jsx)(x.l,{value:V,valueTemplate:"{value}%",onChange:e=>W(e.value),step:10,min:-50,max:50})]})]})})]}),(0,a.jsxs)("div",{className:"col-12 md:col-6",children:[(0,a.jsxs)("div",{className:"card",children:[(0,a.jsx)("h5",{children:"RadioButton"}),(0,a.jsxs)("div",{className:"grid",children:[(0,a.jsx)("div",{className:"col-12 md:col-4",children:(0,a.jsxs)("div",{className:"field-radiobutton",children:[(0,a.jsx)(g.E,{inputId:"option1",name:"option",value:"Chicago",checked:"Chicago"===$,onChange:e=>H(e.value)}),(0,a.jsx)("label",{htmlFor:"option1",children:"Chicago"})]})}),(0,a.jsx)("div",{className:"col-12 md:col-4",children:(0,a.jsxs)("div",{className:"field-radiobutton",children:[(0,a.jsx)(g.E,{inputId:"option2",name:"option",value:"Los Angeles",checked:"Los Angeles"===$,onChange:e=>H(e.value)}),(0,a.jsx)("label",{htmlFor:"option2",children:"Los Angeles"})]})}),(0,a.jsx)("div",{className:"col-12 md:col-4",children:(0,a.jsxs)("div",{className:"field-radiobutton",children:[(0,a.jsx)(g.E,{inputId:"option3",name:"option",value:"New York",checked:"New York"===$,onChange:e=>H(e.value)}),(0,a.jsx)("label",{htmlFor:"option3",children:"New York"})]})})]}),(0,a.jsx)("h5",{children:"Checkbox"}),(0,a.jsxs)("div",{className:"grid",children:[(0,a.jsx)("div",{className:"col-12 md:col-4",children:(0,a.jsxs)("div",{className:"field-checkbox",children:[(0,a.jsx)(i.X,{inputId:"checkOption1",name:"option",value:"Chicago",checked:-1!==Z.indexOf("Chicago"),onChange:ev}),(0,a.jsx)("label",{htmlFor:"checkOption1",children:"Chicago"})]})}),(0,a.jsx)("div",{className:"col-12 md:col-4",children:(0,a.jsxs)("div",{className:"field-checkbox",children:[(0,a.jsx)(i.X,{inputId:"checkOption2",name:"option",value:"Los Angeles",checked:-1!==Z.indexOf("Los Angeles"),onChange:ev}),(0,a.jsx)("label",{htmlFor:"checkOption2",children:"Los Angeles"})]})}),(0,a.jsx)("div",{className:"col-12 md:col-4",children:(0,a.jsxs)("div",{className:"field-checkbox",children:[(0,a.jsx)(i.X,{inputId:"checkOption3",name:"option",value:"New York",checked:-1!==Z.indexOf("New York"),onChange:ev}),(0,a.jsx)("label",{htmlFor:"checkOption3",children:"New York"})]})})]}),(0,a.jsx)("h5",{children:"Input Switch"}),(0,a.jsx)(u.Q,{checked:el,onChange:e=>es(null!==(L=e.value)&&void 0!==L&&L)})]}),(0,a.jsxs)("div",{className:"card",children:[(0,a.jsx)("h5",{children:"Listbox"}),(0,a.jsx)(j.w,{value:ea,onChange:e=>en(e.value),options:[{name:"New York",code:"NY"},{name:"Rome",code:"RM"},{name:"London",code:"LDN"},{name:"Istanbul",code:"IST"},{name:"Paris",code:"PRS"}],optionLabel:"name",filter:!0}),(0,a.jsx)("h5",{children:"Dropdown"}),(0,a.jsx)(r.L,{value:ec,onChange:e=>eo(e.value),options:[{name:"New York",code:"NY"},{name:"Rome",code:"RM"},{name:"London",code:"LDN"},{name:"Istanbul",code:"IST"},{name:"Paris",code:"PRS"}],optionLabel:"name",placeholder:"Select"}),(0,a.jsx)("h5",{children:"MultiSelect"}),(0,a.jsx)(v.N,{value:ei,onChange:e=>ed(e.value),options:[{name:"Australia",code:"AU"},{name:"Brazil",code:"BR"},{name:"China",code:"CN"},{name:"Egypt",code:"EG"},{name:"France",code:"FR"},{name:"Germany",code:"DE"},{name:"India",code:"IN"},{name:"Japan",code:"JP"},{name:"Spain",code:"ES"},{name:"United States",code:"US"}],itemTemplate:e=>(0,a.jsxs)("div",{className:"flex align-items-center",children:[(0,a.jsx)("img",{alt:e.name,src:"/demo/images/flag/flag_placeholder.png",onError:e=>e.currentTarget.src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png",className:"flag flag-".concat(e.code.toLowerCase()),style:{width:"21px"}}),(0,a.jsx)("span",{className:"ml-2",children:e.name})]}),optionLabel:"name",placeholder:"Select Countries",filter:!0,className:"multiselect-custom",display:"chip"})]}),(0,a.jsxs)("div",{className:"card",children:[(0,a.jsx)("h5",{children:"ToggleButton"}),(0,a.jsx)(f.C,{checked:et,onChange:e=>er(e.value),onLabel:"Yes",offLabel:"No"}),(0,a.jsx)("h5",{children:"SelectButton"}),(0,a.jsx)(C.U,{value:eh,onChange:e=>eu(e.value),options:[{name:"Option 1",code:"O1"},{name:"Option 2",code:"O2"},{name:"Option 3",code:"O3"}],optionLabel:"name"}),(0,a.jsx)("h5",{children:"SelectButton - Multiple"}),(0,a.jsx)(C.U,{value:em,onChange:e=>ep(e.value),options:[{name:"Option 1",code:"O1"},{name:"Option 2",code:"O2"},{name:"Option 3",code:"O3"}],optionLabel:"name",multiple:!0})]})]}),(0,a.jsx)("div",{className:"col-12",children:(0,a.jsxs)("div",{className:"card",children:[(0,a.jsx)("h5",{children:"Input Groups"}),(0,a.jsxs)("div",{className:"grid p-fluid",children:[(0,a.jsx)("div",{className:"col-12 md:col-6",children:(0,a.jsxs)("div",{className:"p-inputgroup",children:[(0,a.jsx)("span",{className:"p-inputgroup-addon",children:(0,a.jsx)("i",{className:"pi pi-user"})}),(0,a.jsx)(m.o,{placeholder:"Username"})]})}),(0,a.jsx)("div",{className:"col-12 md:col-6",children:(0,a.jsxs)("div",{className:"p-inputgroup",children:[(0,a.jsx)("span",{className:"p-inputgroup-addon",children:(0,a.jsx)("i",{className:"pi pi-shopping-cart"})}),(0,a.jsx)("span",{className:"p-inputgroup-addon",children:(0,a.jsx)("i",{className:"pi pi-globe"})}),(0,a.jsx)(m.o,{placeholder:"Price"}),(0,a.jsx)("span",{className:"p-inputgroup-addon",children:"$"}),(0,a.jsx)("span",{className:"p-inputgroup-addon",children:".00"})]})}),(0,a.jsx)("div",{className:"col-12 md:col-6",children:(0,a.jsxs)("div",{className:"p-inputgroup",children:[(0,a.jsx)(c.z,{label:"Search"}),(0,a.jsx)(m.o,{placeholder:"Keyword"})]})}),(0,a.jsx)("div",{className:"col-12 md:col-6",children:(0,a.jsxs)("div",{className:"p-inputgroup",children:[(0,a.jsx)("span",{className:"p-inputgroup-addon p-inputgroup-addon-checkbox",children:(0,a.jsx)(i.X,{checked:ex,onChange:e=>ej(null!==(I=e.checked)&&void 0!==I&&I)})}),(0,a.jsx)(m.o,{placeholder:"Confirm"})]})})]})]})})]})}},1311:function(e,l,s){"use strict";s.d(l,{T:function(){return a}});let a={getCountries:()=>fetch("/demo/data/countries.json",{headers:{"Cache-Control":"no-cache"}}).then(e=>e.json()).then(e=>e.data)}}},function(e){e.O(0,[434,6878,6789,8285,3081,9683,2087,3649,5294,7731,3684,7994,9253,5769,1744],function(){return e(e.s=4040)}),_N_E=e.O()}]);