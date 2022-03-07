const x=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function l(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerpolicy&&(o.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?o.credentials="include":n.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(n){if(n.ep)return;n.ep=!0;const o=l(n);fetch(n.href,o)}};x();function D(e,[t,l],[r,n],o=4){const i=e[t][l];if(!i)return null;for(let c=1;c<o;c++){const u=t+r*c,s=l+n*c;if(u<0||u>=e.length||s<0||s>=6||e[u][s]!==i)return null}return i}function h(e,t=4){const l=new Map;l.set("red",0),l.set("yellow",0);for(let r=0;r<e.length;r++)for(let n=0;n<6;n++)for(let o=-1;o<=1;o++)for(let i=-1;i<=1;i++){if(o===0&&i===0)continue;const c=D(e,[r,n],[o,i],t);c&&l.set(c,l.get(c)+1)}return l}function F(e){const t=h(e,4);return t.get("yellow")!==0?"yellow":t.get("red")!==0?"red":null}function w(e){return F(e)}function m(e){for(const t of e)if(t.length<6)return!1;return!0}function d(e){switch(e){case"red":return"yellow";case"yellow":return"red"}}let y=0,p=0,k=null;async function O(e,t,l=!0){if(m(e))throw new Error("ohno");k=new Date,y=0,p=0;let r=[],n=-1/0;for(let o=0;o<e.length;o++)await new Promise(c=>{setTimeout(async()=>{if(e[o].length>=6)return c();const u=S(e,t,o),s=await E(u,d(t),8,-2e3,2e3)*(t==="yellow"?-1:1);s>n?(console.log("new best score",s,o),n=s,r=[o]):s===n&&(console.log("new equal score",s,o),r.push(o)),c()},0)});if(l){let o=new Date().getTime()-k.getTime();$(o)}return r[Math.floor(Math.random()*r.length)]}async function E(e,t,l,r,n){if(l===0)return y+=1,M(e,t);const o=w(e);if(o)return o===t?1e5:-1e5;if(m(e))return 0;for(const[i,c]of W(e,t)){const u=-await E(c,d(t),l-1,-n,-r);if(u>=n)return p+=1,n;r=Math.max(r,u)}return r}function W(e,t){const l=[];for(let r=0;r<7;r++){if(e[r].length>=6)continue;const n=S(e,t,r);l.push([r,M(n,t,!0),n])}return l.sort((r,n)=>n[1]-r[1]),l.map(([r,n,o])=>[r,o])}function S(e,t,l){return e.map((r,n)=>{const o=r.slice();return n===l&&o.push(t),o})}function M(e,t,l=!1){const r=w(e);if(r)return r===t?1e5:-1e5;if(m(e))return 0;const n=h(e,3);let o=n.get(t)*10-n.get(d(t))*10;if(l){const i=h(e,2);o+=i.get(t)*2-i.get(d(t))*2}return o}function $(e){document.getElementById("time-taken").innerText=e.toString()+"ms",document.getElementById("evaluated").innerText=y.toString(),document.getElementById("pruned").innerText=p.toString()}function v(e){return document.querySelector(`#col-${e}`)}const B=document.querySelector(".grid-container"),T=document.querySelector(".grid");function G(e){const t=document.createElement("div");return t.classList.add("token"),t.classList.add(`token-${e}`),t}function L(e){const t=document.createElement("h2");t.classList.add("win-message"),t.innerText=`${e} won!`,B.appendChild(t),b.remove()}function N(e,t){if(f[e].length>=6)return!1;const l=v(e);return l.appendChild(G(t)),f[e].push(t),f[e].length>=6&&l.classList.add("full"),!0}function _(){const e=[];for(let t=0;t<f.length;t++)f[t].length<6&&e.push(t);return e}let f=[[],[],[],[],[],[],[]],a="red";const b=document.querySelector("#to-move");let I=!1,P=!1;function g(){T.classList.remove(a),a=d(a),T.classList.add(a),b.innerText=`${a} to play`}function C(){for(let e=0;e<7;e++){const t=v(e);t.onclick=null}}function A(e,t=!1){setTimeout(async()=>{if(I||P)return;let l=0;if(e==="red"){const r=_();l=r[Math.floor(Math.random()*r.length)]}else console.log("thinking"),l=await O(f,e),console.log("thunk");q(l)},0)}function q(e){if(N(e,a)){const t=w(f);t?(L(t),C(),I=!0):m(f)?(L("nobody"),C(),P=!0):(g(),a=="yellow"&&A(a))}}function K(){for(let e=0;e<7;e++){const t=v(e);t.onclick=()=>{q(e)}}}function R(){g(),g(),K()}R();
