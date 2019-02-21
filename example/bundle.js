!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},n.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=12)}([function(e,t){e.exports=function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}},function(e,t,n){"use strict";var o=n(4);t.__esModule=!0,t.default=void 0;var r=o(n(25)),i=o(n(24)),s=function(e){function t(t){var n;return n=e.call(this)||this,Object.defineProperty((0,i.default)(n),"element",{configurable:!0,enumerable:!0,writable:!0,value:void 0}),n.element=t,n}(0,r.default)(t,e);var n=t.prototype;return n.getElement=function(e,t){return void 0===t&&(t=this.element),t.querySelector(e)},n.getElements=function(e,t){return void 0===t&&(t=this.element),Array.from(t.querySelectorAll(e))},n.dispose=function(){this.element=null,e.prototype.dispose.call(this)},t}(o(n(23)).default);t.default=s},function(e,t,n){"use strict";t.__esModule=!0,t.registerComponent=function(e){e.displayName?(t=s().filter(function(t){return t.displayName!==e.displayName}),"undefined"!=typeof window?window.__muban_core__.store.componentModules=t:r=t,s().push(e)):console.error('missing "block" definition on component',e);var t},t.updateComponent=function(e){var t=e;c(t.displayName).forEach(function(e){e.instance.dispose&&e.instance.dispose(),e.instance=new t(e.element)})},t.getComponents=function(){return s()},t.getComponentInstances=c,t.hasComponentInstance=function(e){return e in i()},t.setComponentInstance=function(e,t){i()[e]||(i()[e]=[]);i()[e].push(t)},t.removeComponentByElement=function(e,t){var n=c(e).findIndex(function(e){return e.element===t});if(-1!==n)return i()[e].splice(n,1)[0];return null};var o={},r=[];function i(){return"undefined"!=typeof window?window.__muban_core__.store.componentInstances:o}function s(){return"undefined"!=typeof window?window.__muban_core__.store.componentModules:r}function c(e){return i()[e]||[]}"undefined"!=typeof window&&(window.__muban_core__=window.__muban_core__||{},window.__muban_core__.store=window.__muban_core__.store||{componentInstances:o,componentModules:r})},function(e,t,n){"use strict";t.__esModule=!0,t.default=function(e){var t=[];(0,o.getComponents)().forEach(function(n){var o=n,i=o.displayName;e.getAttribute("data-component")===i&&t.push({component:n,element:e,depth:r(e)}),Array.from(e.querySelectorAll('[data-component="'+i+'"]')).forEach(function(e){t.push({component:n,element:e,depth:r(e)})})});var n=[];t.concat().sort(function(e,t){return t.depth-e.depth}).forEach(function(e){var t=e.component,r=e.element,i=t,s=i.displayName;try{var c=new i(r);(0,o.setComponentInstance)(s,{instance:c,element:r}),n.push(c)}catch(e){console.error(e)}}),n.forEach(function(e){"function"==typeof e.adopted&&e.adopted()})};var o=n(2);function r(e){for(var t=0,n=e;n.parentElement;)++t,n=n.parentElement;return t}},function(e,t){e.exports=function(e){return e&&e.__esModule?e:{default:e}}},function(e,t,n){"use strict";t.__esModule=!0,t.default=function(e){var t=e&&e.getAttribute("data-component");if(t&&(0,o.hasComponentInstance)(t))return((0,o.getComponentInstances)(t).find(function(t){return t.element===e})||{}).instance;return null};var o=n(2)},function(e,t){var n=Array.isArray;e.exports=n},function(e,t,n){"use strict";t.__esModule=!0,t.default=function e(t){var n=t.getAttribute("data-component");if(n&&(0,o.hasComponentInstance)(n)){var r=(0,o.removeComponentByElement)(n,t);r&&r.instance.dispose()}Array.from(t.querySelectorAll("[data-component]")).forEach(e)};var o=n(2)},function(e,t,n){var o=n(9).Symbol;e.exports=o},function(e,t,n){var o=n(21),r="object"==typeof self&&self&&self.Object===Object&&self,i=o||r||Function("return this")();e.exports=i},function(e,t,n){"use strict";var o=n(4);t.__esModule=!0,t.updateComponent=t.registerComponent=t.updateElement=t.initComponents=t.getComponentForElement=t.cleanElement=t.CoreComponent=void 0;var r=o(n(1));t.CoreComponent=r.default;var i=n(2);t.registerComponent=i.registerComponent,t.updateComponent=i.updateComponent;var s=o(n(7));t.cleanElement=s.default;var c=o(n(5));t.getComponentForElement=c.default;var a=o(n(3));t.initComponents=a.default;var u=o(n(13));t.updateElement=u.default},function(e,t,n){var o=n(0),r=n(22),i=n(19),s="Expected a function",c=Math.max,a=Math.min;e.exports=function(e,t,n){var u,l,p,d,f,m,h=0,v=!1,b=!1,y=!0;if("function"!=typeof e)throw new TypeError(s);function _(t){var n=u,o=l;return u=l=void 0,h=t,d=e.apply(o,n)}function w(e){var n=e-m;return void 0===m||n>=t||n<0||b&&e-h>=p}function g(){var e=r();if(w(e))return C(e);f=setTimeout(g,function(e){var n=t-(e-m);return b?a(n,p-(e-h)):n}(e))}function C(e){return f=void 0,y&&u?_(e):(u=l=void 0,d)}function E(){var e=r(),n=w(e);if(u=arguments,l=this,m=e,n){if(void 0===f)return function(e){return h=e,f=setTimeout(g,t),v?_(e):d}(m);if(b)return f=setTimeout(g,t),_(m)}return void 0===f&&(f=setTimeout(g,t)),d}return t=i(t)||0,o(n)&&(v=!!n.leading,p=(b="maxWait"in n)?c(i(n.maxWait)||0,t):p,y="trailing"in n?!!n.trailing:y),E.cancel=function(){void 0!==f&&clearTimeout(f),h=0,u=m=l=f=void 0},E.flush=function(){return void 0===f?d:C(r())},E}},function(e,t,n){"use strict";n.r(t);var o=n(1),r=n.n(o);class i extends r.a{constructor(e){super(e),this.eventNamespace="",this.eventNamespace="."+ ++i.eventNamespaceCount,this.componentId=this.displayName+this.eventNamespace}get displayName(){return this.element.getAttribute("data-component")}}i.eventNamespaceCount=1e7;class s extends i{constructor(e){super(e),this.element=e}dispose(){super.dispose()}}s.displayName="dummy-foo";var c=n(5),a=n.n(c),u=n(6),l=n.n(u),p=n(0),d=n.n(p),f=n(11),m=n.n(f);class h{constructor(e){this.components={},this.observerEntries={},this.options={container:window,element:"element",methods:{enterView:"enterView",leaveView:"leaveView",beyondView:"beyondView"},vars:{enterViewThreshold:"enterViewThreshold",componentId:"componentId",hasEntered:"hasEntered"},config:{setDebugLabel:!0,debugBorderColor:"red",resizeDebounce:100,tresholdSteps:20}},this.options=Object.assign(this.options,e),this.debugLabelContainer=this.options.container===window?document.body:this.options.container,console.log(this.debugLabelContainer),this.intersectionObserver=new IntersectionObserver(this.handleInterSect.bind(this),{root:this.options.container===window?null:this.options.container,rootMargin:"0px",threshold:this.buildTresholdList()}),this.resizeEventListener=m()(this.handleResize.bind(this),this.options.config.resizeDebounce),window.addEventListener("resize",this.resizeEventListener)}buildTresholdList(){const e=[];for(let t=1;t<=20;t++){const n=t/20;e.push(n)}return[0,1]}handleInterSect(e,t){console.log(t,"intersectOnce"),e.forEach(e=>{const t=this.getComponentForElement(e.target);if(console.log("handleInterSect",e,e.intersectionRatio,t),t){this.observerEntries[t[this.options.vars.componentId]];this.observerEntries[t[this.options.vars.componentId]]=e}})}getComponentForElement(e){return this.components[Object.keys(this.components).find(t=>this.components[t][this.options.element]===e)]}addComponentToScrollTracker(e){this.components[e[this.options.vars.componentId]]=e;const t=e[this.options.vars.componentId];this.intersectionObserver.observe(e[this.options.element]),this.observerEntries[t]}addComponentsToScrollTrackers(e){l()(e)?e.forEach(e=>{this.addComponentToScrollTracker(e)}):d()(e)&&Object.keys(e).forEach(t=>{this.addComponentToScrollTracker(e[t])})}removeComponentsFromScrollTracker(e){l()(e)?e.forEach(e=>{this.removeComponentFromScrollTracker(e)}):d()(e)&&Object.keys(e).forEach(t=>{this.removeComponentFromScrollTracker(e[t])})}removeComponentFromScrollTracker(e){const t=e[this.options.vars.componentId];if(t){const e=this.components[t];if(!e)throw new Error(`[ScrollTrackerComponentManager] Component with id: [${t}] does not exist, unable to remove it`);this.intersectionObserver.unobserve(e[this.options.element]),delete this.observerEntries[t],delete this.components[t]}}updateScrollTrackerPoints(){}handleResize(){this.updateScrollTrackerPoints()}dispose(){window.removeEventListener("resize",this.resizeEventListener),this.resizeEventListener=null,this.components&&(this.removeComponentsFromScrollTracker(this.components),this.components=null),this.intersectionObserver&&this.intersectionObserver.disconnect()}}class v extends r.a{constructor(e){super(e),this.scrollTrackerComponentManager=new h({config:{setDebugLabel:!0,debugBorderColor:"red",resizeDebounce:100}}),this.getElements("[data-scroll-component]").forEach(e=>{this.scrollTrackerComponentManager.addComponentToScrollTracker(a()(e))})}dispose(){this.scrollTrackerComponentManager&&(this.scrollTrackerComponentManager.dispose(),this.scrollTrackerComponentManager=null)}}v.displayName="app-root";var b=n(10),y=n(3),_=n.n(y);const w=[v,s];document.addEventListener("DOMContentLoaded",()=>{(()=>{const e=document.getElementById("app");w.forEach(e=>{Object(b.registerComponent)(e)}),_()(e)})()})},function(e,t,n){"use strict";var o=n(4);t.__esModule=!0,t.default=function(e,t){(0,r.default)(e);var n=document.createElement("div");n.innerHTML=t;var o=n.firstChild;e.parentNode.replaceChild(o,e),(0,i.default)(o)};var r=o(n(7)),i=o(n(3))},function(e,t){e.exports=function(e){return null!=e&&"object"==typeof e}},function(e,t){var n=Object.prototype.toString;e.exports=function(e){return n.call(e)}},function(e,t,n){var o=n(8),r=Object.prototype,i=r.hasOwnProperty,s=r.toString,c=o?o.toStringTag:void 0;e.exports=function(e){var t=i.call(e,c),n=e[c];try{e[c]=void 0;var o=!0}catch(e){}var r=s.call(e);return o&&(t?e[c]=n:delete e[c]),r}},function(e,t,n){var o=n(8),r=n(16),i=n(15),s="[object Null]",c="[object Undefined]",a=o?o.toStringTag:void 0;e.exports=function(e){return null==e?void 0===e?c:s:a&&a in Object(e)?r(e):i(e)}},function(e,t,n){var o=n(17),r=n(14),i="[object Symbol]";e.exports=function(e){return"symbol"==typeof e||r(e)&&o(e)==i}},function(e,t,n){var o=n(0),r=n(18),i=NaN,s=/^\s+|\s+$/g,c=/^[-+]0x[0-9a-f]+$/i,a=/^0b[01]+$/i,u=/^0o[0-7]+$/i,l=parseInt;e.exports=function(e){if("number"==typeof e)return e;if(r(e))return i;if(o(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=o(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(s,"");var n=a.test(e);return n||u.test(e)?l(e.slice(2),n?2:8):c.test(e)?i:+e}},function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){(function(t){var n="object"==typeof t&&t&&t.Object===Object&&t;e.exports=n}).call(this,n(20))},function(e,t,n){var o=n(9);e.exports=function(){return o.Date.now()}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(){this.disposed=!1}return e.prototype.isDisposed=function(){return this.disposed},e.prototype.dispose=function(){this.disposed=!0},e}();t.default=o},function(e,t){e.exports=function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}},function(e,t){e.exports=function(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e.__proto__=t}}]);