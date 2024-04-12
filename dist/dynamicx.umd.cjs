(function(M,q){typeof exports=="object"&&typeof module<"u"?module.exports=q():typeof define=="function"&&define.amd?define(q):(M=typeof globalThis<"u"?globalThis:M||self,M.dynamicx=q())})(this,function(){"use strict";class M{constructor(t){this.values=t}interpolate(t,e){const n=this.values,r=t.values,s=[],l=Math.min(n.length,r.length);for(let i=0;i<l;i++)n[i].interpolate!=null?s.push(n[i].interpolate(r[i],e)):s.push(n[i]);return new M(s)}format(){return this.values.map(t=>t.format!=null?t.format():t)}static createFromArray(t){let e=t.map(n=>H(n)||n);return e=e.filter(n=>n!=null),new M(e)}static create(t){return t instanceof Array?M.createFromArray(t):null}}class q{constructor(t){this.obj={},this.obj=t}interpolate(t,e){const n=this.obj,r=t.obj,s={};for(const l in n){const i=n[l];i.interpolate!=null?r&&(s[l]=i.interpolate(r[l],e)):s[l]=i}return new q(s)}format(){return this.obj}static create(t){if(t instanceof Object){const e={};for(const n in t){const r=t[n];e[n]=H(r)}return new q(e)}return null}}class T{constructor(t={r:0,g:0,b:0,a:0},e="rgb"){this.rgb=t,this.format=e}static fromHex(t){const e=t.match(/^#([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i);e!=null&&(t="#"+e[1]+e[1]+e[2]+e[2]+e[3]+e[3]);const n=t.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);return n!=null?new T({r:parseInt(n[1],16),g:parseInt(n[2],16),b:parseInt(n[3],16),a:1},"hex"):null}static fromRgb(t){const e=t.match(/^rgba?\(([0-9.]*), ?([0-9.]*), ?([0-9.]*)(?:, ?([0-9.]*))?\)$/);return e!=null?new T({r:parseFloat(e[1]),g:parseFloat(e[2]),b:parseFloat(e[3]),a:parseFloat(e[4]!=null?e[4]:"1")},e[4]!=null?"rgba":"rgb"):null}static componentToHex(t){const e=t.toString(16);return e.length===1?"0"+e:e}toHex(){return"#"+T.componentToHex(this.rgb.r)+T.componentToHex(this.rgb.g)+T.componentToHex(this.rgb.b)}toRgb(){return`rgb(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b})`}toRgba(){return`rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, ${this.rgb.a})`}}class P{constructor(t){this.color=t}interpolate(t,e){const n=this.color,r=t.color,s={r:0,g:0,b:0,a:0},l=["r","g","b"];for(const a of l){const u=Math.round((r.rgb[a]-n.rgb[a])*e+n.rgb[a]);s[a]=Math.min(255,Math.max(0,u))}const i="a",o=B((r.rgb[i]-n.rgb[i])*e+n.rgb[i],5);return s[i]=Math.min(1,Math.max(0,o)),new P(new T(s,r.format))}format(){return this.color.format==="hex"?this.color.toHex():this.color.format==="rgb"?this.color.toRgb():this.color.format==="rgba"?this.color.toRgba():""}static create(t){if(typeof t!="string")return null;const e=T.fromHex(t)||T.fromRgb(t);return e!=null?new P(e):null}}class j{constructor(t){this.parts=t}interpolate(t,e){const n=this.parts,r=t.parts,s=[],l=Math.min(n.length,r.length);for(let i=0;i<l;i++)n[i].interpolate!=null?s.push(n[i].interpolate(r[i],e)):s.push(n[i]);return new j(s)}format(){return this.parts.map(e=>e.format!=null?e.format():e).join("")}static create(t){t=""+t,nt.has(t)&&(t=nt.get(t));const e=[],n=[{re:/(#[a-f\d]{3,6})/gi,klass:P,parse:function(o){return o}},{re:/(rgba?\([0-9.]*, ?[0-9.]*, ?[0-9.]*(?:, ?[0-9.]*)?\))/gi,klass:P,parse:function(o){return o}},{re:/([-+]?[\d.]+)/gi,klass:W,parse:parseFloat}];let r=null,s=null;for(const o of n)for(s=o.re;r=s.exec(t);)e.push({index:r.index,length:r[1].length,interpolable:o.klass.create(o.parse(r[1]))});e.sort(function(o,a){return o.index>a.index?1:-1});const l=[];let i=0;for(const o of e)o.index<i||(o.index>i&&l.push(t.substring(i,o.index)),l.push(o.interpolable),i=o.index+o.length);return i<t.length&&l.push(t.substring(i)),new j(l)}}const tt=(document==null?void 0:document.createElementNS("http://www.w3.org/2000/svg","svg"))??null;function B(c,t){const e=Math.pow(10,t);return Math.round(c*e)/e}const H=function(c){const t=[M,q,W,j];for(const e of t){const n=e.create(c);if(n!=null)return n}return null},et=c=>{const t={};return(...e)=>{let n="";for(const s of e)n+=s.toString()+",";let r=t[n];return r||(t[n]=r=c(...e)),r}},ht=et(c=>{let t,e,n,r,s;if(document.body.style[c]!==void 0)return"";r=c.split("-"),s="";for(let i=0,o=r.length;i<o;i++)n=r[i],s+=n.substring(0,1).toUpperCase()+n.substring(1);const l=["Webkit","Moz","ms"];for(let i=0,o=l.length;i<o;i++)if(e=l[i],t=e+s,document.body.style[t]!==void 0)return e;return""}),L=et(c=>{const t=ht(c);return t==="Moz"?`${t}${c.substring(0,1).toUpperCase()}${c.substring(1)}`:t!==""?`-${t.toLowerCase()}-${st(c)}`:st(c)}),st=function(c){return c.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()})},nt=new Map([["aliceblue","#f0f8ff"],["antiquewhite","#faebd7"],["aqua","#00ffff"],["aquamarine","#7fffd4"],["azure","#f0ffff"],["beige","#f5f5dc"],["bisque","#ffe4c4"],["black","#000000"],["blanchedalmond","#ffebcd"],["blue","#0000ff"],["blueviolet","#8a2be2"],["brown","#a52a2a"],["burlywood","#deb887"],["cadetblue","#5f9ea0"],["chartreuse","#7fff00"],["chocolate","#d2691e"],["coral","#ff7f50"],["cornflowerblue","#6495ed"],["cornsilk","#fff8dc"],["crimson","#dc143c"],["cyan","#00ffff"],["darkblue","#00008b"],["darkcyan","#008b8b"],["darkgoldenrod","#b8860b"],["darkgray","#a9a9a9"],["darkgreen","#006400"],["darkgrey","#a9a9a9"],["darkkhaki","#bdb76b"],["darkmagenta","#8b008b"],["darkolivegreen","#556b2f"],["darkorange","#ff8c00"],["darkorchid","#9932cc"],["darkred","#8b0000"],["darksalmon","#e9967a"],["darkseagreen","#8fbc8f"],["darkslateblue","#483d8b"],["darkslategray","#2f4f4f"],["darkslategrey","#2f4f4f"],["darkturquoise","#00ced1"],["darkviolet","#9400d3"],["deeppink","#ff1493"],["deepskyblue","#00bfff"],["dimgray","#696969"],["dimgrey","#696969"],["dodgerblue","#1e90ff"],["firebrick","#b22222"],["floralwhite","#fffaf0"],["forestgreen","#228b22"],["fuchsia","#ff00ff"],["gainsboro","#dcdcdc"],["ghostwhite","#f8f8ff"],["gold","#ffd700"],["goldenrod","#daa520"],["gray","#808080"],["green","#008000"],["greenyellow","#adff2f"],["grey","#808080"],["honeydew","#f0fff0"],["hotpink","#ff69b4"],["indianred","#cd5c5c"],["indigo","#4b0082"],["ivory","#fffff0"],["khaki","#f0e68c"],["lavender","#e6e6fa"],["lavenderblush","#fff0f5"],["lawngreen","#7cfc00"],["lemonchiffon","#fffacd"],["lightblue","#add8e6"],["lightcoral","#f08080"],["lightcyan","#e0ffff"],["lightgoldenrodyellow","#fafad2"],["lightgray","#d3d3d3"],["lightgreen","#90ee90"],["lightgrey","#d3d3d3"],["lightpink","#ffb6c1"],["lightsalmon","#ffa07a"],["lightseagreen","#20b2aa"],["lightskyblue","#87cefa"],["lightslategray","#778899"],["lightslategrey","#778899"],["lightsteelblue","#b0c4de"],["lightyellow","#ffffe0"],["lime","#00ff00"],["limegreen","#32cd32"],["linen","#faf0e6"],["magenta","#ff00ff"],["maroon","#800000"],["mediumaquamarine","#66cdaa"],["mediumblue","#0000cd"],["mediumorchid","#ba55d3"],["mediumpurple","#9370db"],["mediumseagreen","#3cb371"],["mediumslateblue","#7b68ee"],["mediumspringgreen","#00fa9a"],["mediumturquoise","#48d1cc"],["mediumvioletred","#c71585"],["midnightblue","#191970"],["mintcream","#f5fffa"],["mistyrose","#ffe4e1"],["moccasin","#ffe4b5"],["navajowhite","#ffdead"],["navy","#000080"],["oldlace","#fdf5e6"],["olive","#808000"],["olivedrab","#6b8e23"],["orange","#ffa500"],["orangered","#ff4500"],["orchid","#da70d6"],["palegoldenrod","#eee8aa"],["palegreen","#98fb98"],["paleturquoise","#afeeee"],["palevioletred","#db7093"],["papayawhip","#ffefd5"],["peachpuff","#ffdab9"],["peru","#cd853f"],["pink","#ffc0cb"],["plum","#dda0dd"],["powderblue","#b0e0e6"],["purple","#800080"],["rebeccapurple","#663399"],["red","#ff0000"],["rosybrown","#bc8f8f"],["royalblue","#4169e1"],["saddlebrown","#8b4513"],["salmon","#fa8072"],["sandybrown","#f4a460"],["seagreen","#2e8b57"],["seashell","#fff5ee"],["sienna","#a0522d"],["silver","#c0c0c0"],["skyblue","#87ceeb"],["slateblue","#6a5acd"],["slategray","#708090"],["slategrey","#708090"],["snow","#fffafa"],["springgreen","#00ff7f"],["steelblue","#4682b4"],["tan","#d2b48c"],["teal","#008080"],["thistle","#d8bfd8"],["tomato","#ff6347"],["turquoise","#40e0d0"],["violet","#ee82ee"],["wheat","#f5deb3"],["white","#ffffff"],["whitesmoke","#f5f5f5"],["yellow","#ffff00"],["yellowgreen","#9acd32"]]);class I{constructor(t){typeof t=="string"?this.value=parseFloat(t):this.value=t,this.interpolate=this.interpolate.bind(this),this.format=this.format.bind(this)}interpolate(t,e){const n=this.value,r=t.value;return new I((r-n)*e+n)}format(){return B(this.value,5)}static create(t){return typeof t=="number"?new I(t.toString()):null}}const W=I;class R{constructor(){this.translate=[],this.scale=[],this.skew=[],this.rotate=[],this.perspective=[],this.quaternion=[],this.toMatrix=this.toMatrix.bind(this)}interpolate(t,e,n=null){t==null&&(t=new R);const r=this,s=new R,l=(o,a,u)=>(a-o)*u+o;if(["translate","scale","skew","perspective"].forEach(o=>{const a=o;s[a]=[];for(let u=0;u<r[a].length;u++)n===null||n.includes(a)||n.includes(`${a}${["x","y","z"][u]}`)?s[a][u]=l(r[a][u],t[a][u],e):s[a][u]=r[a][u]}),n===null||n.includes("rotate")){const o=r.quaternion,a=t.quaternion;let u=o[0]*a[0]+o[1]*a[1]+o[2]*a[2]+o[3]*a[3];if(u<0){for(let f=0;f<=3;f++)o[f]=-o[f];u=-u}if(u+1>.05){let f,h,p=0,m=0;1-u>=.05?(f=Math.acos(u),h=1/Math.sin(f),p=Math.sin(f*(1-e))*h,m=Math.sin(f*e)*h):(p=1-e,m=e),s.quaternion=o.map((b,y)=>b*p+a[y]*m)}else{a[0]=-o[1],a[1]=o[0],a[2]=-o[3],a[3]=o[2];const f=Math.PI*2,h=Math.sin(f*(.5-e)),p=Math.sin(f*e);s.quaternion=o.map((m,b)=>m*h+a[b]*p)}}else s.quaternion=r.quaternion;return s}format(){return this.toMatrix().toString()}toMatrix(){const t=this;let e=A.I(4);for(let u=0;u<=3;u++)e.els[u][3]=t.perspective[u];const n=t.quaternion,r=n[0],s=n[1],l=n[2],i=n[3],o=t.skew,a=[[1,0],[2,0],[2,1]];for(let u=2;u>=0;u--)if(o[u]){const f=A.I(4);f.els[a[u][0]][a[u][1]]=o[u],e=e.multiply(f)}e=e.multiply(new A([[1-2*(s*s+l*l),2*(r*s-l*i),2*(r*l+s*i),0],[2*(r*s+l*i),1-2*(r*r+l*l),2*(s*l-r*i),0],[2*(r*l-s*i),2*(s*l+r*i),1-2*(r*r+s*s),0],[0,0,0,1]]));for(let u=0;u<=2;u++){for(let f=0;f<=2;f++)e.els[u][f]*=t.scale[u];e.els[3][u]=t.translate[u]}return e}}class k{constructor(t){this.els=t}e(t){return t<1||t>this.els.length?null:this.els[t-1]}dot(t){const e=t instanceof k?t.els:t;let n=0;const r=this.els.length;if(r!==e.length)return 0;for(let s=0;s<r;s++)n+=this.els[s]*e[s];return n}cross(t){const e=t instanceof k?t.els:t;if(this.els.length!==3||e.length!==3)return null;const n=this.els;return new k([n[1]*e[2]-n[2]*e[1],n[2]*e[0]-n[0]*e[2],n[0]*e[1]-n[1]*e[0]])}length(){let t=0;for(const e of this.els)t+=e**2;return Math.sqrt(t)}normalize(){const t=this.length(),e=[];for(const n of this.els)e.push(n/t);return new k(e)}combine(t,e,n){const r=[];for(let s=0;s<this.els.length;s++)r[s]=e*this.els[s]+n*t.els[s];return new k(r)}}class w{constructor(t){this.modulus=!1,this.els=t}e(t,e){return t<1||t>this.els.length||e<1||e>this.els[0].length?null:this.els[t-1][e-1]}dup(){return new w(this.els)}multiply(t){let e;t instanceof w?e=t.els:t instanceof k?e=new w([t.els]).els:e=t;const n=this.els.length,r=e[0].length,s=this.els[0].length,l=[];for(let i=0;i<n;i++){l[i]=[];for(let o=0;o<r;o++){let a=0;for(let u=0;u<s;u++)a+=this.els[i][u]*e[u][o];l[i][o]=a}}return new w(l)}transpose(){const t=this.els.length,e=this.els[0].length,n=[];for(let r=0;r<e;r++){n[r]=[];for(let s=0;s<t;s++)n[r][s]=this.els[s][r]}return new w(n)}toRightTriangular(){const t=this.dup(),e=this.els.length,n=this.els[0].length;for(let r=0;r<e;r++){if(t.els[r][r]===0){for(let s=r+1;s<e;s++)if(t.els[s][r]!==0){const l=[];for(let i=0;i<n;i++)l.push(t.els[r][i]+t.els[s][i]);t.els[r]=l;break}}if(t.els[r][r]!==0)for(let s=r+1;s<e;s++){const l=t.els[s][r]/t.els[r][r],i=[];for(let o=0;o<n;o++)i.push(o<=r?0:t.els[s][o]-t.els[r][o]*l);t.els[s]=i}}return t}augment(t){let e;t instanceof w?e=t.els:e=t;const n=this.dup(),r=n.els[0].length,s=n.els.length,l=e[0].length;if(s!==e.length)return null;for(let i=0;i<s;i++)for(let o=0;o<l;o++)n.els[i][r+o]=e[i][o];return n}inverse(){const t=this.els.length,e=this.augment(w.I(t)).toRightTriangular(),n=e.els[0].length,r=[];for(let s=0;s<t;s++){const l=[],i=e.els[s][s];for(let o=0;o<n;o++){const a=e.els[s][o]/i;l.push(a),o>=t&&r[s].push(a)}e.els[s]=l;for(let o=0;o<s;o++){const a=[];for(let u=0;u<n;u++)a.push(e.els[o][u]-e.els[s][u]*e.els[o][s]);e.els[o]=a}}return new w(r)}static I(t){let e,n,r,s;const l=[];for(r=t,t+=1;--t;)for(e=r-t,l[e]=[],s=r,s+=1;--s;)n=r-s,l[e][n]=e===n?1:0;return new w(l)}decompose(){const t=[];for(let d=0;d<=3;d++){t[d]=[];for(let g=0;g<=3;g++)t[d][g]=this.els[d][g]}if(t[3][3]===0)return null;for(let d=0;d<=3;d++)for(let g=0;g<=3;g++)t[d][g]/=t[3][3];const e=this.dup();for(let d=0;d<=2;d++)e.els[d][3]=0;e.els[3][3]=1;let n=[];if(t[0][3]!==0||t[1][3]!==0||t[2][3]!==0){const d=new k(t.slice(0,4)[3]);n=e.inverse().transpose().multiply(d).els;for(let _=0;_<=2;_++)t[_][3]=0;t[3][3]=1}else n=[0,0,0,1];const r=[];for(let d=0;d<=2;d++)r[d]=t[3][d],t[3][d]=0;const s=[];for(let d=0;d<=2;d++)s[d]=new k(t[d].slice(0,3));const l=[],i=[];l[0]=s[0].length(),s[0]=s[0].normalize(),i[0]=s[0].dot(s[1]),s[1]=s[1].combine(s[0],1,-i[0]),l[1]=s[1].length(),s[1]=s[1].normalize(),i[0]/=l[1],i[1]=s[0].dot(s[2]),s[2]=s[2].combine(s[0],1,-i[1]),i[2]=s[1].dot(s[2]),s[2]=s[2].combine(s[1],1,-i[2]),l[2]=s[2].length(),s[2]=s[2].normalize(),i[1]/=l[2],i[2]/=l[2];const o=s[1].cross(s[2]);if(o!==null&&s[0].dot(o)<0)for(let d=0;d<=2;d++){l[d]*=-1;for(let g=0;g<=2;g++)s[d].els[g]*=-1}const a=function(d,g){return s[d].els[g]},u=[];u[1]=Math.asin(-a(0,2)),Math.cos(u[1])!==0?(u[0]=Math.atan2(a(1,2),a(2,2)),u[2]=Math.atan2(a(0,1),a(0,0))):(u[0]=Math.atan2(-a(2,0),a(1,1)),u[1]=0);let f,h,p,m,b;const y=a(0,0)+a(1,1)+a(2,2)+1;y>1e-4?(f=.5/Math.sqrt(y),h=.25/f,p=(a(2,1)-a(1,2))*f,m=(a(0,2)-a(2,0))*f,b=(a(1,0)-a(0,1))*f):a(0,0)>a(1,1)&&a(0,0)>a(2,2)?(f=Math.sqrt(1+a(0,0)-a(1,1)-a(2,2))*2,p=.25*f,m=(a(0,1)+a(1,0))/f,b=(a(0,2)+a(2,0))/f,h=(a(2,1)-a(1,2))/f):a(1,1)>a(2,2)?(f=Math.sqrt(1+a(1,1)-a(0,0)-a(2,2))*2,p=(a(0,1)+a(1,0))/f,m=.25*f,b=(a(1,2)+a(2,1))/f,h=(a(0,2)-a(2,0))/f):(f=Math.sqrt(1+a(2,2)-a(0,0)-a(1,1))*2,p=(a(0,2)+a(2,0))/f,m=(a(1,2)+a(2,1))/f,b=.25*f,h=(a(1,0)-a(0,1))/f);const Y=[p,m,b,h],v=new R;v.translate=r,v.scale=l,v.skew=i,v.quaternion=Y,v.perspective=n,v.rotate=u;for(const d of Object.values(v))if(typeof d!="function")for(const g of d)isNaN(g)&&(d[g]=0);return v}toString(){let t="matrix3d(";const e=this.els.length,n=this.els[0].length;for(let r=0;r<e;r++)for(let s=0;s<n;s++)t+=B(this.els[r][s],10),r===e-1&&s===n-1||(t+=",");return t+=")",t}static matrixForTransform(t){const e=document.createElement("div");e.style.position="absolute",e.style.visibility="hidden",e.style[L("transform")]=t,document.body.appendChild(e);const n=getComputedStyle(e,null),r=(n==null?void 0:n.transform)??n[L("transform")];return document.body.removeChild(e),r}static fromTransform(t){let e=[],n;const r=t==null?void 0:t.match(/matrix3?d?\(([-0-9,e \.]*)\)/);r?(e=r[1].split(","),e=e.map(parseFloat),e.length===6?n=[e[0],e[1],0,0,e[2],e[3],0,0,0,0,1,0,e[4],e[5],0,1]:n=e):n=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];const s=[];for(let l=0;l<=3;l++)s.push(n.slice(l*4,l*4+4));return new w(s)}}const A=w;class K{constructor(t){this.props=t}interpolate(t,e){const n={translate:[],scale:[],rotate:[],skew:0},r=["translate","scale","rotate"];for(const s of r){const l=s;if(n[l]=[],typeof this.props[l]=="object")for(let i=0;i<this.props[l].length;i++)n[l][i]=(t.props[l][i]-this.props[l][i])*e+this.props[l][i]}return n.rotate[1]=t.props.rotate[1],n.rotate[2]=t.props.rotate[2],n.skew=(t.props.skew-this.props.skew)*e+this.props.skew,new K(n)}format(){return`translate(${this.props.translate.join(",")}) rotate(${this.props.rotate.join(",")}) skewX(${this.props.skew}) scale(${this.props.scale.join(",")})`}applyRotateCenter(t){let e=tt.createSVGMatrix();e=e.translate(t[0],t[1]),e=e.rotate(this.props.rotate[0]),e=e.translate(-t[0],-t[1]);const r=new D(e).decompose().props.translate,s=[];for(let l=0;l<=1;l++)this.props.translate[l]-=r[l],s.push(this.props.translate[l]);return s}}class pt{constructor(t=tt.createSVGMatrix()){this.rotateCX=0,this.rotateCY=0,this.m=t}decompose(){const t=new k([this.m.a,this.m.b]),e=new k([this.m.c,this.m.d]),n=t.length(),r=t.dot(e),s=e.combine(t,1,-r).length(),l=Math.atan2(this.m.b,this.m.a)*180/Math.PI,i=r/s*180/Math.PI;return new K({translate:[this.m.e,this.m.f],rotate:[l,this.rotateCX,this.rotateCY],scale:[n,s],skew:i})}applyProperties(t){const e={};for(const n of t)e[n[0]]=n[1];for(const n in e){const r=e[n];n==="translateX"?this.m=this.m.translate(r,0):n==="translateY"?this.m=this.m.translate(0,r):n==="scaleX"?this.m=this.m.scale(r,1):n==="scaleY"?this.m=this.m.scale(1,r):n==="rotateZ"?this.m=this.m.rotate(r):n==="skewX"?this.m=this.m.skewX(r):n==="skewY"&&(this.m=this.m.skewY(r))}this.rotateCX=(e==null?void 0:e.rotateCX)??0,this.rotateCY=(e==null?void 0:e.rotateCY)??0}}const D=pt;class F{constructor(t){this.obj={};for(const e of t)this.obj[e]=1}contains(t){return this.obj?this.obj[t]===1:!1}}const dt=new F("marginTop,marginLeft,marginBottom,marginRight,paddingTop,paddingLeft,paddingBottom,paddingRight,top,left,bottom,right,translateX,translateY,translateZ,perspectiveX,perspectiveY,perspectiveZ,width,height,maxWidth,maxHeight,minWidth,minHeight,borderRadius".split(",")),mt=new F("rotate,rotateX,rotateY,rotateZ,skew,skewX,skewY,skewZ".split(",")),V=new F("translate,translateX,translateY,translateZ,scale,scaleX,scaleY,scaleZ,rotate,rotateX,rotateY,rotateZ,rotateC,rotateCX,rotateCY,skew,skewX,skewY,skewZ,perspective".split(",")),gt=new F("cx,cy,d,dx,dy,fill,fillOpacity,floodColor,floodOpacity,gradientTransform,height,kernelMatrix,letterSpacing,lightingColor,limitingConeAngle,markerHeight,markerWidth,numOctaves,opacity,patternTransform,points,r,rx,ry,specularConstant,specularExponent,stdDeviation,stopColor,stopOpacity,stroke,strokeWidth,strokeDashoffset,strokeOpacity,textLength,transform,viewBox,width,x,x1,x2,y,y1,y2,z".split(",")),bt=new F("azimuth,baseFrequency,bias,diffuseConstant,divisor,elevation,k1,k2,k3,k4,fr,fx,fy,limitingConeAngle,pathLength,pointsAtX,pointsAtY,pointsAtZ,radius,seed,surfaceScale".split(",")),rt=()=>(document==null?void 0:document.visibilityState)==="visible",yt=(()=>{const c=[];return document==null||document.addEventListener("visibilitychange",()=>{const t=[];for(const e of c)t.push(e(rt()));return t}),t=>c.push(t)})(),wt=(c,t)=>{if(c.style!=null)return E(c,t);{const e=[];for(const n in t){const r=t[n].format();c[n]=r,e.push(r)}return e}},E=(c,t)=>{t=it(t);const e=[],n=U(c);for(const r in t){let s=t[r];V.contains(r)?e.push([r,s]):(s.format!=null&&(s=s.format()),typeof s=="number"&&(s=""+s+O(r)),c.hasAttribute(r)?(r==="numOctaves"&&(s=parseInt(s)),c.setAttribute(r,s)):c.style!=null&&(c.style[L(r)]=s),!(c instanceof SVGElement)&&r in c&&(c[r]=s))}if(e.length>0)if(n){const r=new D;r.applyProperties(e),c.setAttribute("transform",r.decompose().format())}else{const r=e.map(s=>ot(s[0],s[1])).join(" ");c.style[L("transform")]=r}},U=c=>c instanceof SVGElement&&!(c instanceof SVGSVGElement),O=c=>dt.contains(c)?"px":mt.contains(c)?"deg":"",ot=function(c,t){let e,n;return e=(""+t).match(/^([0-9.-]*)([^0-9]*)$/),e!=null&&(t=e[1],n=e[2]),(n==null||n==="")&&(n=O(c)),`${c}(${t}${n})`},it=c=>{const t={};for(const e in c){const n=c[e];if(V.contains(e)){const r=e.match(/(translate|rotateC|rotate|skew|scale|perspective)(X|Y|Z|)/);if(r&&r[2].length>0)t[e]=n;else for(const s of["X","Y","Z"])r!=null&&r[1]&&(t[r[1]+s]=n)}else t[e]=n}return t},kt=c=>`${c==="opacity"?1:0}${O(c)}`,xt=(c,t)=>{var r;const e={},n=U(c);if((c==null?void 0:c.style)!=null){const s=window.getComputedStyle(c,null);for(let l of t)if(V.contains(l)){if(e.transform==null){let i;n&&c.transform!=null?i=new D((r=c.transform.baseVal.consolidate())==null?void 0:r.matrix):i=A.fromTransform(s[L("transform")]),e.transform=i.decompose()}}else{let i;c.hasAttribute(l)?i=c.getAttribute(l):l in c?i=c[l]:i=s[l],(i==null||l==="d")&&gt.contains(l)&&(i=c.getAttribute(l)),(i===""||i==null)&&(i=kt(l)),e[l]=H(i)}}else for(const s of t)e[s]=H(c[s]);return at(c,e),e},at=(c,t)=>{for(const e in t){let n=t[e];n instanceof W&&c.style!=null&&e in c.style&&(n=new j([n,O(e)])),t[e]=n}};let Z=!1,G=1,C=window==null?void 0:window.requestAnimationFrame;if(window==null||window.addEventListener("keyup",c=>{if(c.key==="D"&&c.shiftKey)return x.toggleSlow()}),C==null){let c=0;C=t=>{const e=Date.now(),n=Math.max(0,16-(e-c)),r=window.setTimeout(()=>t(e+n),n);return c=e+n,r}}let N=!1,lt=!1;const vt=()=>{if(!N)return N=!0,C(J)};let S=[];const J=c=>{if(lt){C(J);return}let t;const e=[],n=S.length;for(let r=0;r<n;r++)t=S[r],Mt(c,t)||e.push(t);return S=S.filter(r=>!e.includes(r)),S.length===0?N=!1:C(J)},Mt=(c,t)=>{t.tStart===void 0&&(t.tStart=c);const e=(c-t.tStart)/t.options.duration,n=t.curve(e);let r={};if(e>=1)t.curve.returnsToSelf?r=t.properties.start:r=t.properties.end;else{const l=t.properties.start;for(const i in l){const o=l[i],a=t.properties.end;r[i]=Tt(o,a==null?void 0:a[i],n)}}wt(t.el,r);const s=t.options;if(typeof s.change=="function"&&s.change(t.el,Math.min(1,e)),e>=1){const l=t.options;typeof l.complete=="function"&&l.complete(t.el)}return e<1},Tt=(c,t,e)=>c.interpolate!=null?c.interpolate(t,e):null;let X=[];const ct=(c,t,e,n)=>{if(n!=null&&(X=X.filter(o=>o.id!==n)),x.stop(c,{timeout:!1}),!e.animated){x.css(c,t),typeof e.complete=="function"&&e.complete(c);return}const r=xt(c,Object.keys(t)),s=it(t),l={},i=[];for(const o in s){let a=s[o];c.style!=null&&V.contains(o)?i.push([o,a]):bt.contains(o)?l[o]=j.create(a):l[o]=H(a)}if(i.length>0){const o=U(c);let a;if(o)a=new D,a.applyProperties(i);else if(Array.isArray(i)){const u=i.map(f=>ot(f[0],f[1].toString())).join(" ");a=A.fromTransform(A.matrixForTransform(u))}a&&(l.transform=a.decompose()),o&&r.transform.applyRotateCenter([l.transform.props.rotate[1],l.transform.props.rotate[2]])}if(at(c,l),l)return S.push({el:c,properties:{start:r,end:l},options:e,curve:e.type(e)}),vt()};let $=[],Q=0;const ft=c=>{if(rt())return C(()=>{if($.indexOf(c)!==-1)return c.realTimeoutId=window.setTimeout(()=>(c.fn(),ut(c.id)),c.delay)})},St=(c,t)=>{Q+=1;const e={id:Q,tStart:Date.now(),fn:c,delay:t,originalDelay:t};return ft(e),$.push(e),Q},ut=c=>$=$.filter(t=>(t.id===c&&t.realTimeoutId&&window.clearTimeout(t.realTimeoutId),t.id!==c)),qt=(c,t)=>{let e=0;return c!==null?(e=c-t.tStart,t.originalDelay-e):t.originalDelay};let z=null;yt(c=>{if(lt=!c,c){if(N){const t=Date.now()-z;for(const e of S)e.tStart!=null&&(e.tStart+=t)}for(const t of $)t.delay=qt(z,t),ft(t);return z=void 0,z}else{z=Date.now();const t=[];for(const e of $)t.push(window.clearTimeout(e.realTimeoutId));return t}});class jt{constructor(){this.linear=()=>t=>t,this.spring=(t={})=>{const e={frequency:300,friction:200,anticipationSize:0,anticipationStrength:0,...t},n=Math.max(1,e.frequency/20),r=Math.pow(20,e.friction/100),s=e.anticipationSize/1e3,l=o=>{let a,u,f,h,p;return a=.8,h=s/(1-s),p=0,f=(h-a*p)/(h-p),u=(a-f)/h,u*o*e.anticipationStrength/100+f},i=o=>Math.pow(r/10,-o)*(1-o);return o=>{let a,u,f,h,p,m,b,y;return m=o/(1-s)-s/(1-s),o<s?(y=s/(1-s)-s/(1-s),b=0/(1-s)-s/(1-s),p=Math.acos(1/l(y)),f=(Math.acos(1/l(b))-p)/(n*-s),a=l):(a=i,p=0,f=1),u=a(m),h=n*(o-s)*f+p,1-u*Math.cos(h)}},this.bounce=(t={})=>{const e={frequency:300,friction:200,...t},n=Math.max(1,e.frequency/20),r=Math.pow(20,e.friction/100),s=i=>Math.pow(r/10,-i)*(1-i),l=i=>{const u=s(i),f=n*i*1+-1.57;return u*Math.cos(f)};return l.returnsToSelf=!0,l},this.gravity=(t={})=>{const e={bounciness:400,elasticity:200,...t},n=Math.min(e.bounciness/1250,.8),r=e.elasticity/1e3,s=100,l=[],i=e.returnsToSelf;let o=0;o=(()=>{const f=Math.sqrt(2/s);let h={a:-f,b:f,H:1};for(i&&(h.a=0,h.b=h.b*2);h.H>.001;)o=h.b-h.a,h={a:h.b,b:h.b+o*n,H:h.H*n*n};return h.b})();const a=(f,h,p,m)=>{o=h-f;const b=2/o*m-1-f*2/o;let y=b*b*p-p+1;return i&&(y=1-y),y};(()=>{let f,h,p,m;for(h=Math.sqrt(2/(s*o*o)),p={a:-h,b:h,H:1},i&&(p.a=0,p.b=p.b*2),l.push(p),f=o,m=[];p.b<1&&p.H>.001;)f=p.b-p.a,p={a:p.b,b:p.b+f*n,H:p.H*r},m.push(l.push(p));return m})();const u=f=>{let h,p,m;for(p=0,h=l[p];!(f>=h.a&&f<=h.b)&&(p+=1,h=l[p],!!h););return h?m=a(h.a,h.b,h.H,f):m=i?0:1,m};return u.returnsToSelf=i,u},this.forceWithGravity=(t={})=>{const e={bounciness:400,elasticity:200,returnsToSelf:!0,...t};return x.gravity(e)},this.bezier=t=>{const e=(o,a,u,f,h)=>Math.pow(1-o,3)*a+3*Math.pow(1-o,2)*o*u+3*(1-o)*Math.pow(o,2)*f+Math.pow(o,3)*h,n=(o,a,u,f,h)=>({x:e(o,a.x,u.x,f.x,h.x),y:e(o,a.y,u.y,f.y,h.y)}),r=(o,a,u)=>{let f=null;const h=a.length;for(let d=0;d<h;d++){const g=a[d];if(o>=g(0).x&&o<=g(1).x&&(f=g),f!==null)break}if(!f)return u?0:1;const p=1e-4;let m=0,b=1,y=(b+m)/2,Y=f(y).x,v=0;for(;Math.abs(o-Y)>p&&v<100;)o>Y?m=y:b=y,y=(b+m)/2,Y=f(y).x,v+=1;return f(y).y},s=t.points,l=(()=>{const o=[],a=(u,f)=>{const h=p=>n(p,u,u.cp[u.cp.length-1],f.cp[0],f);return o.push(h)};for(const u in s){const f=parseInt(u);if(f>=s.length-1)break;a(s[f],s[f+1])}return o})(),i=o=>o===0?0:o===1?1:r(o,l,i.returnsToSelf);return i.returnsToSelf=s[s.length-1].y===0,i},this.easeInOut=(t={})=>{const n={friction:500,...t}.friction;return x.bezier({points:[{x:0,y:0,cp:[{x:.92-n/1e3,y:0}]},{x:1,y:1,cp:[{x:.08+n/1e3,y:1}]}]})},this.easeIn=(t={})=>{const n={friction:500,...t}.friction;return x.bezier({points:[{x:0,y:0,cp:[{x:.92-n/1e3,y:0}]},{x:1,y:1,cp:[{x:1,y:1}]}]})},this.easeOut=(t={})=>{const n={friction:500,...t}.friction;return x.bezier({points:[{x:0,y:0,cp:[{x:0,y:0}]},{x:1,y:1,cp:[{x:.08+n/1e3,y:1}]}]})}}animate(t,e,n){const r=(s,l,i)=>{const o={type:x.easeInOut,duration:1e3,delay:0,animated:!0,...i};if(o.duration=Math.max(0,o.duration*G),o.delay=Math.max(0,o.delay),o.delay===0)return ct(s,l,o);{const a=x.setTimeout(()=>ct(s,l,o,a),o.delay);return X.push({id:a,el:s})}};t instanceof Array&&t.length?t.map(s=>r(s,e,n)):t instanceof NodeList||t instanceof HTMLCollection?Array.from(t).map(s=>r(s,e,n)):r(t,e,n)}css(t,e){t instanceof Array?t.map(n=>E(n,e)):t instanceof NodeList||t instanceof HTMLCollection?Array.from(t).map(n=>E(n,e)):E(t,e)}stop(t,e={}){const n=(r,s)=>{const l={timeout:!0,...s};return l.timeout&&(X=X.filter(i=>i.el===r&&(l.filter==null||l.filter(i))?(x.clearTimeout(i.id),!1):!0)),S=S.filter(i=>i.el!==r)};t instanceof Array?t.map(r=>n(r,e)):t instanceof NodeList||t instanceof HTMLCollection?Array.from(t).map(r=>n(r,e)):n(t,e)}setTimeout(t,e){return St(t,e*G)}clearTimeout(t){return ut(t)}toggleSlow(){return Z=!Z,Z?G=3:G=1,console.log("dynamicx: slow animations "+(Z?"enabled":"disabled"))}}const x=new jt;return x});
