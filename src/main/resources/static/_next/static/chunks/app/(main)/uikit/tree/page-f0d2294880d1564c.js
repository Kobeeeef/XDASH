(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7729],{3681:function(e,s,t){Promise.resolve().then(t.bind(t,9498))},9498:function(e,s,t){"use strict";t.r(s),t.d(s,{default:function(){return d}});var a=t(9268),n=t(6006),l=t(7547),c=t(8204),h=t(8298);let o={getFiles:()=>fetch("/demo/data/files.json",{headers:{"Cache-Control":"no-cache"}}).then(e=>e.json()).then(e=>e.data),getLazyFiles:()=>fetch("/demo/data/files-lazy.json",{headers:{"Cache-Control":"no-cache"}}).then(e=>e.json()).then(e=>e.data),getFilesystem:()=>fetch("/demo/data/filesystem.json",{headers:{"Cache-Control":"no-cache"}}).then(e=>e.json()).then(e=>e.data),getLazyFilesystem:()=>fetch("/demo/data/filesystem-lazy.json",{headers:{"Cache-Control":"no-cache"}}).then(e=>e.json()).then(e=>e.data)};var d=()=>{let[e,s]=(0,n.useState)([]),[t,d]=(0,n.useState)([]),[i,r]=(0,n.useState)(null),[u,f]=(0,n.useState)(null);return(0,n.useEffect)(()=>{o.getFiles().then(e=>s(e)),o.getFilesystem().then(e=>d(e))},[]),(0,a.jsxs)("div",{className:"grid",children:[(0,a.jsx)("div",{className:"col-12",children:(0,a.jsxs)("div",{className:"card",children:[(0,a.jsx)("h5",{children:"Tree"}),(0,a.jsx)(l.m,{value:e,selectionMode:"checkbox",selectionKeys:i,onSelectionChange:e=>r(e.value)})]})}),(0,a.jsx)("div",{className:"col-12",children:(0,a.jsxs)("div",{className:"card",children:[(0,a.jsx)("h5",{children:"TreeTable"}),(0,a.jsxs)(c.i,{value:t,selectionMode:"checkbox",selectionKeys:u,onSelectionChange:e=>f(e.value),children:[(0,a.jsx)(h.s,{field:"name",header:"Name",expander:!0}),(0,a.jsx)(h.s,{field:"size",header:"Size"}),(0,a.jsx)(h.s,{field:"type",header:"Type"})]})]})})]})}}},function(e){e.O(0,[434,6878,6789,8285,9683,2267,7136,713,9253,5769,1744],function(){return e(e.s=3681)}),_N_E=e.O()}]);