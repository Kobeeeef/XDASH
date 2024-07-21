(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3238],{9127:function(e,s,a){Promise.resolve().then(a.bind(a,9740))},9740:function(e,s,a){"use strict";a.r(s);var l=a(9268),t=a(3702),i=a(716),r=a(8176),n=a(4390),c=a(1196),o=a(439),d=a(315),m=a(4631),u=a(8152),h=a(5294),x=a(4046),p=a(8711),g=a(5942),j=a(6006),y=a(5504);s.default=()=>{let e={id:"",name:"",image:"",description:"",category:"",price:0,quantity:0,rating:0,inventoryStatus:"INSTOCK"},[s,a]=(0,j.useState)(null),[v,f]=(0,j.useState)(!1),[b,N]=(0,j.useState)(!1),[C,S]=(0,j.useState)(!1),[k,w]=(0,j.useState)(e),[F,P]=(0,j.useState)(null),[z,E]=(0,j.useState)(!1),[L,R]=(0,j.useState)(""),I=(0,j.useRef)(null),q=(0,j.useRef)(null);(0,j.useEffect)(()=>{y.M.getProducts().then(e=>a(e))},[]);let D=e=>e.toLocaleString("en-US",{style:"currency",currency:"USD"}),A=()=>{w(e),E(!1),f(!0)},M=()=>{E(!1),f(!1)},O=()=>{N(!1)},V=()=>{S(!1)},W=e=>{w({...e}),f(!0)},U=e=>{w(e),N(!0)},_=e=>{let a=-1;for(let l=0;l<(null==s?void 0:s.length);l++)if(s[l].id===e){a=l;break}return a},T=()=>{let e="",s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(let a=0;a<5;a++)e+=s.charAt(Math.floor(Math.random()*s.length));return e},H=()=>{var e;null===(e=q.current)||void 0===e||e.exportCSV()},K=()=>{S(!0)},Y=e=>{let s={...k};s.category=e.value,w(s)},Q=(e,s)=>{let a=e.target&&e.target.value||"",l={...k};l["".concat(s)]=a,w(l)},B=(e,s)=>{let a=e.value||0,l={...k};l["".concat(s)]=a,w(l)},G=(0,l.jsxs)("div",{className:"flex flex-column md:flex-row md:justify-content-between md:align-items-center",children:[(0,l.jsx)("h5",{className:"m-0",children:"Manage Products"}),(0,l.jsxs)("span",{className:"block mt-2 md:mt-0 p-input-icon-left",children:[(0,l.jsx)("i",{className:"pi pi-search"}),(0,l.jsx)(d.o,{type:"search",onInput:e=>R(e.currentTarget.value),placeholder:"Search..."})]})]}),J=(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(t.z,{label:"Cancel",icon:"pi pi-times",text:!0,onClick:M}),(0,l.jsx)(t.z,{label:"Save",icon:"pi pi-check",text:!0,onClick:()=>{if(E(!0),k.name.trim()){var l,t;let i=[...s],r={...k};if(k.id){let e=_(k.id);i[e]=r,null===(l=I.current)||void 0===l||l.show({severity:"success",summary:"Successful",detail:"Product Updated",life:3e3})}else r.id=T(),r.image="product-placeholder.svg",i.push(r),null===(t=I.current)||void 0===t||t.show({severity:"success",summary:"Successful",detail:"Product Created",life:3e3});a(i),f(!1),w(e)}}})]}),X=(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(t.z,{label:"No",icon:"pi pi-times",text:!0,onClick:O}),(0,l.jsx)(t.z,{label:"Yes",icon:"pi pi-check",text:!0,onClick:()=>{var l;a(null==s?void 0:s.filter(e=>e.id!==k.id)),N(!1),w(e),null===(l=I.current)||void 0===l||l.show({severity:"success",summary:"Successful",detail:"Product Deleted",life:3e3})}})]}),Z=(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(t.z,{label:"No",icon:"pi pi-times",text:!0,onClick:V}),(0,l.jsx)(t.z,{label:"Yes",icon:"pi pi-check",text:!0,onClick:()=>{var e;a(null==s?void 0:s.filter(e=>!(null==F?void 0:F.includes(e)))),S(!1),P(null),null===(e=I.current)||void 0===e||e.show({severity:"success",summary:"Successful",detail:"Products Deleted",life:3e3})}})]});return(0,l.jsx)("div",{className:"grid crud-demo",children:(0,l.jsx)("div",{className:"col-12",children:(0,l.jsxs)("div",{className:"card",children:[(0,l.jsx)(x.F,{ref:I}),(0,l.jsx)(p.o,{className:"mb-4",left:()=>(0,l.jsx)(j.Fragment,{children:(0,l.jsxs)("div",{className:"my-2",children:[(0,l.jsx)(t.z,{label:"New",icon:"pi pi-plus",severity:"success",className:" mr-2",onClick:A}),(0,l.jsx)(t.z,{label:"Delete",icon:"pi pi-trash",severity:"danger",onClick:K,disabled:!F||!F.length})]})}),right:()=>(0,l.jsxs)(j.Fragment,{children:[(0,l.jsx)(c.p,{mode:"basic",accept:"image/*",maxFileSize:1e6,chooseLabel:"Import",className:"mr-2 inline-block"}),(0,l.jsx)(t.z,{label:"Export",icon:"pi pi-upload",severity:"help",onClick:H})]})}),(0,l.jsxs)(r.w,{ref:q,value:s,selection:F,onSelectionChange:e=>P(e.value),dataKey:"id",paginator:!0,rows:10,rowsPerPageOptions:[5,10,25],className:"datatable-responsive",paginatorTemplate:"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",currentPageReportTemplate:"Showing {first} to {last} of {totalRecords} products",globalFilter:L,emptyMessage:"No products found.",header:G,responsiveLayout:"scroll",children:[(0,l.jsx)(i.s,{selectionMode:"multiple",headerStyle:{width:"4rem"}}),(0,l.jsx)(i.s,{field:"code",header:"Code",sortable:!0,body:e=>(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("span",{className:"p-column-title",children:"Code"}),e.code]}),headerStyle:{minWidth:"15rem"}}),(0,l.jsx)(i.s,{field:"name",header:"Name",sortable:!0,body:e=>(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("span",{className:"p-column-title",children:"Name"}),e.name]}),headerStyle:{minWidth:"15rem"}}),(0,l.jsx)(i.s,{header:"Image",body:e=>(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("span",{className:"p-column-title",children:"Image"}),(0,l.jsx)("img",{src:"/demo/images/product/".concat(e.image),alt:e.image,className:"shadow-2",width:"100"})]})}),(0,l.jsx)(i.s,{field:"price",header:"Price",body:e=>(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("span",{className:"p-column-title",children:"Price"}),D(e.price)]}),sortable:!0}),(0,l.jsx)(i.s,{field:"category",header:"Category",sortable:!0,body:e=>(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("span",{className:"p-column-title",children:"Category"}),e.category]}),headerStyle:{minWidth:"10rem"}}),(0,l.jsx)(i.s,{field:"rating",header:"Reviews",body:e=>(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("span",{className:"p-column-title",children:"Reviews"}),(0,l.jsx)(h.i,{value:e.rating,readOnly:!0,cancel:!1})]}),sortable:!0}),(0,l.jsx)(i.s,{field:"inventoryStatus",header:"Status",body:e=>{var s;return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("span",{className:"p-column-title",children:"Status"}),(0,l.jsx)("span",{className:"product-badge status-".concat(null===(s=e.inventoryStatus)||void 0===s?void 0:s.toLowerCase()),children:e.inventoryStatus})]})},sortable:!0,headerStyle:{minWidth:"10rem"}}),(0,l.jsx)(i.s,{body:e=>(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(t.z,{icon:"pi pi-pencil",rounded:!0,severity:"success",className:"mr-2",onClick:()=>W(e)}),(0,l.jsx)(t.z,{icon:"pi pi-trash",rounded:!0,severity:"warning",onClick:()=>U(e)})]}),headerStyle:{minWidth:"10rem"}})]}),(0,l.jsxs)(n.V,{visible:v,style:{width:"450px"},header:"Product Details",modal:!0,className:"p-fluid",footer:J,onHide:M,children:[k.image&&(0,l.jsx)("img",{src:"/demo/images/product/".concat(k.image),alt:k.image,width:"150",className:"mt-0 mx-auto mb-5 block shadow-2"}),(0,l.jsxs)("div",{className:"field",children:[(0,l.jsx)("label",{htmlFor:"name",children:"Name"}),(0,l.jsx)(d.o,{id:"name",value:k.name,onChange:e=>Q(e,"name"),required:!0,autoFocus:!0,className:(0,g.AK)({"p-invalid":z&&!k.name})}),z&&!k.name&&(0,l.jsx)("small",{className:"p-invalid",children:"Name is required."})]}),(0,l.jsxs)("div",{className:"field",children:[(0,l.jsx)("label",{htmlFor:"description",children:"Description"}),(0,l.jsx)(m.g,{id:"description",value:k.description,onChange:e=>Q(e,"description"),required:!0,rows:3,cols:20})]}),(0,l.jsxs)("div",{className:"field",children:[(0,l.jsx)("label",{className:"mb-3",children:"Category"}),(0,l.jsxs)("div",{className:"formgrid grid",children:[(0,l.jsxs)("div",{className:"field-radiobutton col-6",children:[(0,l.jsx)(u.E,{inputId:"category1",name:"category",value:"Accessories",onChange:Y,checked:"Accessories"===k.category}),(0,l.jsx)("label",{htmlFor:"category1",children:"Accessories"})]}),(0,l.jsxs)("div",{className:"field-radiobutton col-6",children:[(0,l.jsx)(u.E,{inputId:"category2",name:"category",value:"Clothing",onChange:Y,checked:"Clothing"===k.category}),(0,l.jsx)("label",{htmlFor:"category2",children:"Clothing"})]}),(0,l.jsxs)("div",{className:"field-radiobutton col-6",children:[(0,l.jsx)(u.E,{inputId:"category3",name:"category",value:"Electronics",onChange:Y,checked:"Electronics"===k.category}),(0,l.jsx)("label",{htmlFor:"category3",children:"Electronics"})]}),(0,l.jsxs)("div",{className:"field-radiobutton col-6",children:[(0,l.jsx)(u.E,{inputId:"category4",name:"category",value:"Fitness",onChange:Y,checked:"Fitness"===k.category}),(0,l.jsx)("label",{htmlFor:"category4",children:"Fitness"})]})]})]}),(0,l.jsxs)("div",{className:"formgrid grid",children:[(0,l.jsxs)("div",{className:"field col",children:[(0,l.jsx)("label",{htmlFor:"price",children:"Price"}),(0,l.jsx)(o.R,{id:"price",value:k.price,onValueChange:e=>B(e,"price"),mode:"currency",currency:"USD",locale:"en-US"})]}),(0,l.jsxs)("div",{className:"field col",children:[(0,l.jsx)("label",{htmlFor:"quantity",children:"Quantity"}),(0,l.jsx)(o.R,{id:"quantity",value:k.quantity,onValueChange:e=>B(e,"quantity")})]})]})]}),(0,l.jsx)(n.V,{visible:b,style:{width:"450px"},header:"Confirm",modal:!0,footer:X,onHide:O,children:(0,l.jsxs)("div",{className:"flex align-items-center justify-content-center",children:[(0,l.jsx)("i",{className:"pi pi-exclamation-triangle mr-3",style:{fontSize:"2rem"}}),k&&(0,l.jsxs)("span",{children:["Are you sure you want to delete ",(0,l.jsx)("b",{children:k.name}),"?"]})]})}),(0,l.jsx)(n.V,{visible:C,style:{width:"450px"},header:"Confirm",modal:!0,footer:Z,onHide:V,children:(0,l.jsxs)("div",{className:"flex align-items-center justify-content-center",children:[(0,l.jsx)("i",{className:"pi pi-exclamation-triangle mr-3",style:{fontSize:"2rem"}}),k&&(0,l.jsx)("span",{children:"Are you sure you want to delete the selected products?"})]})})]})})})}},5504:function(e,s,a){"use strict";a.d(s,{M:function(){return l}});let l={getProductsSmall:()=>fetch("/demo/data/products-small.json",{headers:{"Cache-Control":"no-cache"}}).then(e=>e.json()).then(e=>e.data),getProducts:()=>fetch("/demo/data/products.json",{headers:{"Cache-Control":"no-cache"}}).then(e=>e.json()).then(e=>e.data),getProductsWithOrdersSmall:()=>fetch("/demo/data/products-orders-small.json",{headers:{"Cache-Control":"no-cache"}}).then(e=>e.json()).then(e=>e.data)}}},function(e){e.O(0,[8123,434,6878,6789,8285,9683,3081,2087,6986,7136,4959,4046,4390,5294,1196,7603,9253,5769,1744],function(){return e(e.s=9127)}),_N_E=e.O()}]);