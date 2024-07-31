(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2612],{228:function(e,t,s){Promise.resolve().then(s.bind(s,1158))},1158:function(e,t,s){"use strict";s.r(t),s.d(t,{default:function(){return h}});var n=s(9268),r=s(6006),l=s(7537),a=s(7389),i=s(4046),o=s(6008),c=s(3702),d=s(4390),u=s(2723),m=s(2064),p=s(2980),f=["alias","apropos","apt-get","apt-cache","aptitude","arch","awk","basename","bash","bc","bg","bzip2","cal","cat","cd","cfdisk","chgrp","chmod","chown","chroot","chkconfig","cksum","clear","cmp","comm","command","compress","cp","cron","crontab","csplit","curl","cut","date","dc","dd","ddrescue","declare","df","diff","diff3","dig","dir","dircolors","dirname","dirs","dmesg","du","echo","egrep","eject","enable","env","ethtool","eval","exec","exit","expect","expand","export","expr","false","fdformat","fdisk","fg","fgrep","file","find","fmt","fold","for","free","fsck","ftp","gawk","getopts","grep","groupadd","groupdel","groupmod","groups","gzip","hash","head","help","history","hostname","htop","iconv","id","ifconfig","ifdown","ifup","import","install","jobs","join","journalctl","kill","killall","less","let","link","ln","locate","logname","logout","look","lpc","lpr","lprint","lprintd","lprintq","lprm","ls","lsblk","lsof","make","man","mkdir","mkfifo","mkisofs","mknod","more","most","mount","mtools","mv","mmv","nano","netstat","nice","nl","nohup","notify-send","nslookup","open","op","passwd","paste","pathchk","ping","pkill","popd","pr","printcap","printenv","printf","ps","pushd","pv","pwd","quota","quotacheck","quotactl","ram","rcp","read","readarray","readonly","reboot","rename","renice","remsync","return","rev","rm","rmdir","rsync","scp","screen","sdiff","sed","select","seq","set","sftp","shift","shopt","shutdown","sleep","slocate","sort","source","split","ssh","stat","strace","su","sudo","sum","suspend","sync","systemctl","systemd-analyze","tail","tar","tee","test","time","times","touch","top","traceroute","trap","true","tsort","tty","type","ulimit","umask","umount","unalias","uname","unexpand","uniq","units","unset","unshar","useradd","userdel","usermod","users","uudecode","uuencode","vdir","vi","vim","vmstat","w","watch","wc","whereis","which","who","whoami","xargs","yes","yum","zip","unzip"],h=()=>{var e,t;let[s,h]=(0,r.useState)([]),x=(0,r.useRef)(null),v=(0,o.useSearchParams)(),g=v.get("server"),[b,N]=(0,r.useState)(null),{isConnected:j,lastConnectionUpdate:C,sendMessageAndWaitForCondition:w,sendMessage:y,socket:k}=(0,r.useContext)(l.WebsocketContext),[E,S]=(0,r.useState)(0),[D,O]=(0,r.useState)(new Date),[T,M]=(0,r.useState)([]),I=(0,r.useRef)(null),[L,A]=(0,r.useState)(""),[R,J]=(0,r.useState)({}),[W,_]=(0,r.useState)(!1),[P,V]=(0,r.useState)(!1),[H,Z]=(0,r.useState)(!1),[q,z]=(0,r.useState)(!0),[F,U]=(0,r.useState)([]);function X(){if("clear"===L.trim().toLowerCase()){M([]),A("");return}V(!0),M(e=>[...e,"\x1b[92m$ "+(null==R?void 0:R.hostname)+" "+L]),h(e=>[...e,L]),y({type:H?"DEVICE-COMMAND-SUDO":"DEVICE-COMMAND",message:JSON.stringify({server:b,command:L})}),A(""),V(!1)}function G(e){V(!0),M(t=>[...t,"\x1b[92m$ "+(null==R?void 0:R.hostname)+" "+e]),y({type:"DEVICE-COMMAND-CONTROL",message:JSON.stringify({server:b,command:e})}),V(!1)}return(0,r.useEffect)(()=>{N(g)},[g]),(0,r.useEffect)(()=>{let e=setInterval(()=>{j&&w({type:"DEVICE-DATA",message:b},e=>"DEVICE-DATA"===e.type).then(e=>{var t;(null==e?void 0:null===(t=e.message)||void 0===t?void 0:t.exists)?(J(e.message),_(!1)):(_(!0),J({}))}).catch(()=>{})},100);return()=>clearInterval(e)},[j,b]),(0,r.useEffect)(()=>{var e;I&&q&&(null===(e=I.current)||void 0===e||e.scrollIntoView({behavior:"instant"}))},[q,T]),(0,r.useEffect)(()=>{let e=e=>{let t=JSON.parse(e.data);if("DEVICE-SHELL"===t.type){let e=JSON.parse(t.message);M(t=>[...t,""+e.response])}};return k.current&&(k.current.addEventListener("message",e),M(e=>[...e,"\x1b[92mXDASH: Registered listener."])),()=>{k.current.removeEventListener("message",e),M(e=>[...e,"\x1b[92mXDASH: Unregistered listener."])}},[k.current]),(0,n.jsxs)("div",{className:"grid fadeIn",children:[(0,n.jsx)(i.F,{ref:x}),(0,n.jsx)(d.V,{header:"Machine Discovery Failed",modal:!1,visible:W,position:"top-right",style:{width:"50vw"},onHide:()=>{W&&_(!1)},closable:!1,draggable:!0,resizable:!1,children:(0,n.jsxs)("p",{className:"m-0",children:["The machine with the server name ",(0,n.jsx)("strong",{children:b})," was not found on the network running XCASTER. Please check your network connection, verify the machine is on and try again later."]})}),(0,n.jsx)("div",{className:"col-12 lg:col-6 sm:col-4 xl:col-3",children:(0,n.jsxs)("div",{className:"card mb-0",children:[(0,n.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Backend Status"}),(0,n.jsx)("div",{className:"text-900 font-medium text-xl "+(j?"text-green-600":"text-red-600 animate-pulse"),children:j?"Connected":"Disconnected"})]}),(0,n.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,n.jsx)("i",{className:"pi pi-chevron-circle-up text-blue-500 text-xl"})})]}),(0,n.jsx)(a.Z,{date:C})]})}),(0,n.jsx)("div",{className:"col-12 lg:col-6 sm:col-4 xl:col-3",children:(0,n.jsxs)("div",{className:"card mb-0",children:[(0,n.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Machine Server"}),(0,n.jsx)("div",{className:"text-900 font-medium text-xl "+(j&&b?(null==R?void 0:R.status)==="CONNECTED"?"text-green-600":(null==R?void 0:R.status)==="CONNECTING"?"animate-pulse-fast text-yellow-500":"animate-pulse text-red-600":"animate-pulse text-red-600"),children:j?null!=b?b:"Unknown":"Disconnected"})]}),(0,n.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,n.jsx)("i",{className:"pi pi-desktop text-blue-500 text-xl"})})]}),(0,n.jsx)(a.Z,{date:C})]})}),(0,n.jsx)("div",{className:"col-12 lg:col-6 xl:col-3",children:(0,n.jsxs)("div",{className:"card mb-0",children:[(0,n.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{className:"block text-500 font-medium mb-3",children:"Hostname"}),(0,n.jsx)("div",{className:"text-900 font-medium text-xl "+(j&&b&&(null==R?void 0:R.hostname)?(null==R?void 0:R.status)==="CONNECTED"?"text-green-600":(null==R?void 0:R.status)==="CONNECTING"?"animate-pulse-fast text-yellow-500":"animate-pulse text-red-600":"animate-pulse text-red-600"),children:j&&null!==(e=null==R?void 0:R.hostname)&&void 0!==e?e:"Unknown"})]}),(0,n.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,n.jsx)("i",{className:"pi pi-address-book text-blue-500 text-xl"})})]}),(0,n.jsx)(a.Z,{date:D})]})}),(0,n.jsx)("div",{className:"col-12 lg:col-6 xl:col-3",children:(0,n.jsxs)("div",{className:"card mb-0",children:[(0,n.jsxs)("div",{className:"flex justify-content-between mb-3",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{className:"block text-500 font-medium mb-3",children:"IP Address"}),(0,n.jsx)("div",{className:"text-900 font-medium text-xl "+(j&&b&&(null==R?void 0:R.address)?(null==R?void 0:R.status)==="CONNECTED"?"text-green-600":(null==R?void 0:R.status)==="CONNECTING"?"animate-pulse-fast text-yellow-500":"animate-pulse text-red-600":"animate-pulse text-red-600"),children:j&&null!==(t=null==R?void 0:R.address)&&void 0!==t?t:"Unknown"})]}),(0,n.jsx)("div",{className:"flex align-items-center justify-content-center bg-blue-100 border-round",style:{width:"2.5rem",height:"2.5rem"},children:(0,n.jsx)("i",{className:"pi pi-map-marker text-blue-500 text-xl"})})]}),(0,n.jsx)(a.Z,{date:D})]})}),(0,n.jsx)("div",{className:"col-12",children:(0,n.jsxs)("div",{className:"card",children:[(0,n.jsx)("div",{className:"card",children:(0,n.jsxs)("div",{className:"overflow-y-auto",style:{maxHeight:"40rem"},children:[T.map((e,t)=>(0,n.jsx)(u.Z,{log:e},t)),(0,n.jsx)("div",{ref:I})]})}),(0,n.jsxs)("div",{className:"p-inputgroup flex-1 w-full",children:[(0,n.jsx)(m.a,{severity:"warning",disabled:!j||(null==R?void 0:R.status)!=="CONNECTED",label:"Restart",onClick:()=>{y({type:"DEVICE-COMMAND-NEW-SESSION",message:b})},model:[{label:H?"Disable Root":"Enable Root",icon:H?"pi pi-user":"pi pi-crown",command:()=>{Z(e=>!e)}},{label:q?"Disable Lock":"Enable Lock",icon:q?"pi pi-lock":"pi pi-unlock",command:()=>{z(e=>!e)}},{label:"Clear Terminal",icon:"pi pi-eraser",command:()=>{M([])}}]}),(0,n.jsx)("span",{className:"p-inputgroup-addon",children:(0,n.jsx)("i",{className:"pi "+(H?"pi-crown":"pi-user")})}),(0,n.jsxs)("span",{className:"p-inputgroup-addon font-bold "+(j&&b&&(null==R?void 0:R.address)?(null==R?void 0:R.status)==="CONNECTED"?"text-green-600":(null==R?void 0:R.status)==="CONNECTING"?"animate-pulse-fast text-yellow-500":"animate-pulse text-red-600":"animate-pulse text-red-600"),children:["$ ",b]}),(0,n.jsx)(p.Q,{completeMethod:e=>{U([...new Set([...f,...s||[]])].filter(t=>null==t?void 0:t.startsWith(e.query)))},suggestions:F,disabled:!j||P||(null==R?void 0:R.status)!=="CONNECTED",value:L,onChange:e=>{A(t=>(S(0),e.target.value))},onKeyDown:e=>{if(L&&("Enter"===e.key||"NumpadEnter"===e.key))e.preventDefault(),X();else if("ArrowUp"===e.key){if(e.preventDefault(),s&&s.length){let e=E-1<0?s.length-1:E-1,t=s[e];S(e),A(t)}}else if("ArrowDown"===e.key){if(e.preventDefault(),s&&s.length){let e=E+1>=s.length?0:E+1,t=s[e];S(e),A(t)}}else e.ctrlKey&&"c"===e.key?(e.preventDefault(),G("CTRL_C")):e.ctrlKey&&"j"===e.key?(e.preventDefault(),G("CTRL_J")):e.ctrlKey&&"x"===e.key&&(e.preventDefault(),G("CTRL_X"))}}),(0,n.jsx)(c.z,{disabled:!j||!L||(null==R?void 0:R.status)!=="CONNECTED",loading:P,label:"Send",onClick:X})]})]})})]})}},7389:function(e,t,s){"use strict";s.d(t,{Z:function(){return a}});var n=s(9268),r=s(6006);let l=e=>{let t=new Date-new Date(e),s=Math.floor(t/1e3),n=Math.floor(s/31536e3);return n>1?"".concat(n," years ago"):(n=Math.floor(s/2592e3))>1?"".concat(n," months ago"):(n=Math.floor(s/86400))>1?"".concat(n," days ago"):(n=Math.floor(s/3600))>1?"".concat(n," hours ago"):(n=Math.floor(s/60))>1?"".concat(n," minutes ago"):s>=1?"".concat(s," seconds ago"):t>1?"".concat(t," milliseconds ago"):"just now"};var a=e=>{let{date:t,className:s}=e,[a,i]=(0,r.useState)("");return(0,r.useEffect)(()=>{i(l(t));let e=setInterval(()=>{i(l(t))},100);return()=>clearInterval(e)},[t]),(0,n.jsx)("span",{className:s,children:a})}},7537:function(e,t,s){"use strict";s.r(t),s.d(t,{WebSocketProvider:function(){return a},WebsocketContext:function(){return l}});var n=s(9268),r=s(6006);let l=(0,r.createContext)({}),a=e=>{let{children:t,url:s}=e,[a,i]=(0,r.useState)(!1),[o,c]=(0,r.useState)(new Date),d=(0,r.useRef)(null);return(0,r.useEffect)(()=>((function e(){console.log("Connecting to websocket"),d.current=new WebSocket(s),d.current.onopen=()=>{i(!0)},d.current.onclose=()=>(i(!1),console.log("Disconnected from websocket."),e()),d.current.onerror=e=>{console.error("WebSocket Error: ",e),d.current.close(),i(!1)}})(),()=>{d.current&&d.current.close()}),[s]),(0,r.useEffect)(()=>{c(new Date)},[a]),(0,n.jsx)(l.Provider,{value:{isConnected:a,lastConnectionUpdate:o,sendMessageAndWaitForCondition:function(e,t){let s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1500;return a?(d.current.send(JSON.stringify(e)),new Promise((e,n)=>{let r=s=>{let n=JSON.parse(s.data);if(t(n)){d.current.removeEventListener("message",r),clearTimeout(l);let t=n.message;n.message=JSON.parse(t),e(n)}},l=setTimeout(()=>{d.current.removeEventListener("message",r),n(Error("Timeout: Condition not met within ".concat(s," ms")))},s);d.current.addEventListener("message",r)})):Promise.reject(Error("WebSocket is not connected"))},sendMessageTillCondition:(e,t)=>{if(!a)throw Error("WebSocket is not connected");d.current.send(JSON.stringify(e));let s=e=>{let n=JSON.parse(e.data);t(n)&&d.current.removeEventListener("message",s)};d.current.addEventListener("message",s)},socket:d,sendMessage:e=>{if(!a)return Error("WebSocket is not connected");d.current.send(JSON.stringify(e))}},children:t})}},2723:function(e,t,s){"use strict";var n=s(9268);s(6006);var r=s(2153),l=s.n(r);let a=new(l())({fg:"#FFF",bg:"#000",newline:!0,escapeXML:!1,stream:!1}),i=e=>{var t,s;return a.toHtml(null!==(s=null==e?void 0:null===(t=e.replace("\x1b[?2004h","\x1b[92m"))||void 0===t?void 0:t.replace("\x1b[?2004l",""))&&void 0!==s?s:"")};t.Z=e=>{let{log:t}=e,s=i(t);return(0,n.jsx)("pre",{dangerouslySetInnerHTML:{__html:s}})}},3171:function(e,t,s){"use strict";s.d(t,{n:function(){return a}});var n=s(6006),r=s(6986);function l(){return(l=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var s=arguments[t];for(var n in s)Object.prototype.hasOwnProperty.call(s,n)&&(e[n]=s[n])}return e}).apply(this,arguments)}var a=n.memo(n.forwardRef(function(e,t){var s=r.A.getPTI(e);return n.createElement("svg",l({ref:t,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"},s),n.createElement("path",{d:"M4.86199 11.5948C4.78717 11.5923 4.71366 11.5745 4.64596 11.5426C4.57826 11.5107 4.51779 11.4652 4.46827 11.4091L0.753985 7.69483C0.683167 7.64891 0.623706 7.58751 0.580092 7.51525C0.536478 7.44299 0.509851 7.36177 0.502221 7.27771C0.49459 7.19366 0.506156 7.10897 0.536046 7.03004C0.565935 6.95111 0.613367 6.88 0.674759 6.82208C0.736151 6.76416 0.8099 6.72095 0.890436 6.69571C0.970973 6.67046 1.05619 6.66385 1.13966 6.67635C1.22313 6.68886 1.30266 6.72017 1.37226 6.76792C1.44186 6.81567 1.4997 6.8786 1.54141 6.95197L4.86199 10.2503L12.6397 2.49483C12.7444 2.42694 12.8689 2.39617 12.9932 2.40745C13.1174 2.41873 13.2343 2.47141 13.3251 2.55705C13.4159 2.64268 13.4753 2.75632 13.4938 2.87973C13.5123 3.00315 13.4888 3.1292 13.4271 3.23768L5.2557 11.4091C5.20618 11.4652 5.14571 11.5107 5.07801 11.5426C5.01031 11.5745 4.9368 11.5923 4.86199 11.5948Z",fill:"currentColor"}))}));a.displayName="CheckIcon"}},function(e){e.O(0,[434,6878,6789,8285,9933,7994,4390,2980,2064,4074,9253,5769,1744],function(){return e(e.s=228)}),_N_E=e.O()}]);