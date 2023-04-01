import{r as i,e as T,c as j,j as c,S as b,a as e,B as v,g as _,i as k,d as J,h as O,F as $,k as w,l as H,m as M,n as P,o as S,u as L,b as N,p as B,q as R,f as V,t as F,H as q}from"./index-7258077c.js";import{D as z,C as G,a as K,b as Q}from"./DbHeader-8252df35.js";import{T as A,I as U,a as W,E as X,C as Y,D as Z}from"./DeleteEntryButton-8c1c613d.js";import{S as ee,T as te}from"./ShowPayload-71f75581.js";import{T as ne}from"./Virtuoso-46c58dc7.js";function ae({dbAddress:l,dbName:o,onRefresh:n,onEntryAdded:u}){const[a,r]=i.useState(""),[s,d]=i.useState(""),[p,D]=i.useState(!0),[g,x]=i.useState(!1),h=T(),f=j();return c(b,{spacing:4,children:[c(b,{spacing:4,direction:{base:"column",md:"row"},alignContent:"center",alignItems:"center",children:[e(A,{placeholder:"_id",variant:"outline",value:s,width:{base:"100%",md:"auto"},onChange:t=>d(t.target.value)}),e(b,{spacing:4,width:"full",children:c(U,{children:[e(A,{placeholder:"Document",variant:"outline",value:a,disabled:g,onChange:t=>r(t.target.value)}),e(W,{w:{base:"unset",md:"auto"},p:1,children:e(X,{json:a,onAccept:t=>{r(t)},children:e(v,{variant:"solid",color:"white",colorScheme:"blackAlpha",h:"1.75rem",children:a?"Edit JSON":"Enter JSON"})})})]})}),e(Y,{isChecked:p,width:{base:"100%",md:"auto"},onChange:t=>{D(t.target.checked),x(t.target.checked)},children:"Strict JSON"})]}),c(b,{spacing:4,direction:{base:"column",md:"row"},children:[e(_,{}),e(v,{variant:"outline",onClick:n,children:"Regresh"}),e(v,{variant:"outline",onClick:async()=>{try{if(!l)return;if(!s||!a){h.closeAll(),h({position:"top-right",description:"Please provide an id and a json document",status:"error",isClosable:!0});return}if(p&&!k(a)){h.closeAll(),h({position:"top-right",description:"Invalid JSON",status:"error",isClosable:!0});return}let t={};if(k(a)){const C=JSON.parse(a);C._id||(C._id=s),t={...C}}else t={...{_id:s,value:a}};const E={_id:s,document:t,strictMode:p,timestamp:Date.now()},I=await J(l,{pin:!1,entry:E});u(s),f({type:"add",log:{id:I,text:`Document added to \`${o}\` db`,type:"created"}})}catch(t){f({type:"add",log:{text:`Failed to add document to \`${o}\` db - ${(t==null?void 0:t.message)||"something went wrong"}`,type:"error"}})}},children:"Put Document"})]})]})}function re({index:l,dbAddress:o,log:n}){const[u,a]=i.useState(!1),r=j(),s=i.useCallback(async()=>{try{await O(o,n.id),r({type:"add",log:{type:"deleted",text:`Entry ${n.id} deleted from ${o}`}}),a(!0)}catch(p){r({type:"add",log:{type:"error",text:`Error deleting entry ${n.id} from ${o}: ${p.message}`}})}},[o,r,n.id]),d={textDecoration:u?"line-through":"none",opacity:u?.5:1};return c($,{children:[c(w,{w:100,textAlign:"center",children:[" ",l+1]}),e(w,{w:50,textAlign:"center",children:c(H,{children:[e(ee,{payload:n.payload}),e(Z,{dbAddress:o,identifier:n.id,onDelete:s})]})}),e(w,{w:200,sx:d,children:n.id}),e(w,{w:230,sx:d,children:n.date.toLocaleString()}),e(w,{w:"calc(100% - 590px)",sx:d,children:n.jsonPreview})]})}function se({dbAddress:l,entries:o}){const n=M("gray.200","gray.800");return e(te,{style:{height:400},data:o,overscan:200,components:ne,fixedHeaderContent:()=>c(P,{bg:n,children:[e(S,{w:100,textAlign:"center",children:"#"}),e(S,{w:60,textAlign:"center",children:"{ }"}),e(S,{w:200,children:"Id"}),e(S,{w:230,children:"Date"}),e(S,{w:"calc(100% - 590px)",children:"Value"})]}),itemContent:(u,a)=>e(re,{index:u,dbAddress:l,log:a},a.id)})}function ue(){const{id:l}=L(),{findDb:o}=N(),[n,u]=i.useState([]),a=B(),r=i.useMemo(()=>o(l||""),[l,o]),s=i.useMemo(()=>r==null?void 0:r.payload.value.address,[r]),d=i.useCallback(async(g,x)=>{try{if(!s)return;x&&R({title:"Loading docstore log..."});const h=await V(s,{docsOptions:{fullOp:!0},query:{reverse:!0,limit:-1}});if(!h)return;const f=h.map(m=>{const y=m.payload.value||{};let t="";return typeof y.document!="object"?t=String(y.document):t=JSON.stringify(m.payload.value.document,null,2),t=t.substring(0,100)+"...",{id:String(y._id),date:new Date(y.timestamp||0),jsonPreview:t,payload:m}});if(!a())return;u(g?f:m=>[...m,...f])}catch(h){console.error(h)}finally{F()}},[s,a]);i.useEffect(()=>{d(!1,!0)},[d]);const p=i.useCallback(async()=>{try{await d(!0,!0)}catch(g){console.error(g)}},[d]),D=i.useCallback(()=>{d(!0,!1)},[d]);return c(b,{spacing:4,children:[e(z,{multiHash:l||"",entriesCount:n.length,showEntriesCount:!0}),c(G,{children:[c(K,{children:[e(q,{fontSize:"sm",mb:2,children:"Add a document to the database"}),e(ae,{onEntryAdded:D,onRefresh:p,dbAddress:s||"",dbName:(r==null?void 0:r.payload.value.name)||""}),e("br",{})]}),e(Q,{children:e(se,{dbAddress:s||"",entries:n||[]})})]})]})}export{ue as default};
