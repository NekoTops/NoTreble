(window.webpackJsonp=window.webpackJsonp||[]).push([[68],{1803:function(e,t,n){var r=n(32),o=n(1804);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[e.i,o,""]]);var i={insert:function(e){if(!window.isApryseWebViewerWebComponent)return void document.head.appendChild(e);let t;t=document.getElementsByTagName("apryse-webviewer"),t.length||(t=function e(t,n=document){const r=[];return n.querySelectorAll(t).forEach(e=>r.push(e)),n.querySelectorAll("*").forEach(n=>{n.shadowRoot&&r.push(...e(t,n.shadowRoot))}),r}("apryse-webviewer"));const n=[];for(let r=0;r<t.length;r++){const o=t[r];if(0===r)o.shadowRoot.appendChild(e),e.onload=function(){n.length>0&&n.forEach(t=>{t.innerHTML=e.innerHTML})};else{const t=e.cloneNode(!0);o.shadowRoot.appendChild(t),n.push(t)}}},singleton:!1};r(o,i);e.exports=o.locals||{}},1804:function(e,t,n){(t=e.exports=n(33)(!1)).push([e.i,":host{display:inline-block;container-type:inline-size;width:100%;height:100%;overflow:hidden}@media(min-width:901px){.App:not(.is-web-component) .hide-in-desktop{display:none}}@container (min-width: 901px){.hide-in-desktop{display:none}}@media(min-width:641px)and (max-width:900px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .hide-in-tablet{display:none}}@container (min-width: 641px) and (max-width: 900px){.App.is-web-component:not(.is-in-desktop-only-mode) .hide-in-tablet{display:none}}@media(max-width:640px)and (min-width:431px){.App:not(.is-web-component) .hide-in-mobile{display:none}}@container (max-width: 640px) and (min-width: 431px){.App.is-web-component .hide-in-mobile{display:none}}@media(max-width:430px){.App:not(.is-web-component) .hide-in-small-mobile{display:none}}@container (max-width: 430px){.App.is-web-component .hide-in-small-mobile{display:none}}.always-hide{display:none}.FlyoutMenu[data-element=menuOverlay] .ActionButton{justify-content:flex-start}.FlyoutMenu[data-element=menuOverlay] .ActionButton .Icon{margin:4px}.FlyoutMenu[data-element=menuOverlay] .ActionButton span{margin:0 4px}.FlyoutMenu[data-element=menuOverlay] .ActionButton.row.disabled:hover{background:none;cursor:default}",""]),t.locals={LEFT_HEADER_WIDTH:"41px",RIGHT_HEADER_WIDTH:"41px"}},1998:function(e,t,n){"use strict";n.r(t);n(8),n(57),n(38),n(35),n(83),n(90),n(26),n(27),n(11),n(13),n(25),n(22),n(29),n(28),n(45),n(23),n(24),n(48),n(46),n(19),n(14),n(10),n(9),n(12),n(16),n(15),n(20),n(18),n(63),n(64),n(65),n(66),n(36),n(39),n(40),n(62);var r=n(2),o=n(84),i=n(174),a=n(69),c=n(1),l=n(177),u=n(274),s=n(206),f=n(159),p=n(0),d=n.n(p),h=n(428),m=n(6),y=n(3),v=n(372),b=n(5),g=n(107),w=n(73);n(1803);function E(e){return(E="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function O(){/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */O=function(){return e};var e={},t=Object.prototype,n=t.hasOwnProperty,r=Object.defineProperty||function(e,t,n){e[t]=n.value},o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",a=o.asyncIterator||"@@asyncIterator",c=o.toStringTag||"@@toStringTag";function l(e,t,n){return Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{l({},"")}catch(e){l=function(e,t,n){return e[t]=n}}function u(e,t,n,o){var i=t&&t.prototype instanceof p?t:p,a=Object.create(i.prototype),c=new _(o||[]);return r(a,"_invoke",{value:x(e,n,c)}),a}function s(e,t,n){try{return{type:"normal",arg:e.call(t,n)}}catch(e){return{type:"throw",arg:e}}}e.wrap=u;var f={};function p(){}function d(){}function h(){}var m={};l(m,i,(function(){return this}));var y=Object.getPrototypeOf,v=y&&y(y(N([])));v&&v!==t&&n.call(v,i)&&(m=v);var b=h.prototype=p.prototype=Object.create(m);function g(e){["next","throw","return"].forEach((function(t){l(e,t,(function(e){return this._invoke(t,e)}))}))}function w(e,t){var o;r(this,"_invoke",{value:function(r,i){function a(){return new t((function(o,a){!function r(o,i,a,c){var l=s(e[o],e,i);if("throw"!==l.type){var u=l.arg,f=u.value;return f&&"object"==E(f)&&n.call(f,"__await")?t.resolve(f.__await).then((function(e){r("next",e,a,c)}),(function(e){r("throw",e,a,c)})):t.resolve(f).then((function(e){u.value=e,a(u)}),(function(e){return r("throw",e,a,c)}))}c(l.arg)}(r,i,o,a)}))}return o=o?o.then(a,a):a()}})}function x(e,t,n){var r="suspendedStart";return function(o,i){if("executing"===r)throw new Error("Generator is already running");if("completed"===r){if("throw"===o)throw i;return A()}for(n.method=o,n.arg=i;;){var a=n.delegate;if(a){var c=L(a,n);if(c){if(c===f)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if("suspendedStart"===r)throw r="completed",n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r="executing";var l=s(e,t,n);if("normal"===l.type){if(r=n.done?"completed":"suspendedYield",l.arg===f)continue;return{value:l.arg,done:n.done}}"throw"===l.type&&(r="completed",n.method="throw",n.arg=l.arg)}}}function L(e,t){var n=t.method,r=e.iterator[n];if(void 0===r)return t.delegate=null,"throw"===n&&e.iterator.return&&(t.method="return",t.arg=void 0,L(e,t),"throw"===t.method)||"return"!==n&&(t.method="throw",t.arg=new TypeError("The iterator does not provide a '"+n+"' method")),f;var o=s(r,e.iterator,t.arg);if("throw"===o.type)return t.method="throw",t.arg=o.arg,t.delegate=null,f;var i=o.arg;return i?i.done?(t[e.resultName]=i.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=void 0),t.delegate=null,f):i:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,f)}function j(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function T(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function _(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(j,this),this.reset(!0)}function N(e){if(e){var t=e[i];if(t)return t.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var r=-1,o=function t(){for(;++r<e.length;)if(n.call(e,r))return t.value=e[r],t.done=!1,t;return t.value=void 0,t.done=!0,t};return o.next=o}}return{next:A}}function A(){return{value:void 0,done:!0}}return d.prototype=h,r(b,"constructor",{value:h,configurable:!0}),r(h,"constructor",{value:d,configurable:!0}),d.displayName=l(h,c,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===d||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,h):(e.__proto__=h,l(e,c,"GeneratorFunction")),e.prototype=Object.create(b),e},e.awrap=function(e){return{__await:e}},g(w.prototype),l(w.prototype,a,(function(){return this})),e.AsyncIterator=w,e.async=function(t,n,r,o,i){void 0===i&&(i=Promise);var a=new w(u(t,n,r,o),i);return e.isGeneratorFunction(n)?a:a.next().then((function(e){return e.done?e.value:a.next()}))},g(b),l(b,c,"Generator"),l(b,i,(function(){return this})),l(b,"toString",(function(){return"[object Generator]"})),e.keys=function(e){var t=Object(e),n=[];for(var r in t)n.push(r);return n.reverse(),function e(){for(;n.length;){var r=n.pop();if(r in t)return e.value=r,e.done=!1,e}return e.done=!0,e}},e.values=N,_.prototype={constructor:_,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(T),!e)for(var t in this)"t"===t.charAt(0)&&n.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=void 0)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var t=this;function r(n,r){return a.type="throw",a.arg=e,t.next=n,r&&(t.method="next",t.arg=void 0),!!r}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],a=i.completion;if("root"===i.tryLoc)return r("end");if(i.tryLoc<=this.prev){var c=n.call(i,"catchLoc"),l=n.call(i,"finallyLoc");if(c&&l){if(this.prev<i.catchLoc)return r(i.catchLoc,!0);if(this.prev<i.finallyLoc)return r(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return r(i.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return r(i.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===e||"continue"===e)&&i.tryLoc<=t&&t<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=e,a.arg=t,i?(this.method="next",this.next=i.finallyLoc,f):this.complete(a)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),f},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.finallyLoc===e)return this.complete(n.completion,n.afterLoc),T(n),f}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.tryLoc===e){var r=n.completion;if("throw"===r.type){var o=r.arg;T(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,n){return this.delegate={iterator:N(e),resultName:t,nextLoc:n},"next"===this.method&&(this.arg=void 0),f}},e}function x(e,t,n,r,o,i,a){try{var c=e[i](a),l=c.value}catch(e){return void n(e)}c.done?t(l):Promise.resolve(l).then(r,o)}function L(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,o,i,a,c=[],l=!0,u=!1;try{if(i=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;l=!1}else for(;!(l=(r=i.call(n)).done)&&(c.push(r.value),c.length!==t);l=!0);}catch(e){u=!0,o=e}finally{try{if(!l&&null!=n.return&&(a=n.return(),Object(a)!==a))return}finally{if(u)throw o}}return c}}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return j(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return j(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function j(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function T(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function _(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?T(Object(n),!0).forEach((function(t){N(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):T(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function N(e,t,n){return(t=function(e){var t=function(e,t){if("object"!==E(e)||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t||"default");if("object"!==E(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"===E(t)?t:String(t)}(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var A=function(e){var t=e.dataElement,n=e.children,r=Object(m.e)((function(e){return y.a.getMenuOverlayItems(e,t)}),m.c),a=d.a.Children.toArray(n);return r.map((function(e,t){var n=e.dataElement,r=e.type,c=e.hidden,l="".concat(r,"-").concat(n||t),u=null==c?void 0:c.map((function(e){return"hide-in-".concat(e)})).join(" "),s=a.find((function(e){return e.props.dataElement===n}));if(!s){var f=_(_({},e),{},{mediaQueryClassName:u});switch(r){case"actionButton":s=d.a.createElement(o.a,f);break;case"customElement":s=d.a.createElement(i.a,f)}}return s?d.a.cloneElement(s,{key:l}):null}))};var S=function(){var e=Object(m.d)(),t=L(Object(h.a)(),1)[0],n=L(Object(p.useState)(),2),i=n[0],E=n[1],j=Object(m.e)(y.a.isEmbedPrintSupported),T=Object(m.e)(y.a.useClientSidePrint),_=Object(m.e)(y.a.getColorMap),N=Object(m.e)(y.a.getSortStrategy),S=Object(m.e)((function(e){return y.a.isFullScreen(e)})),P=Object(m.e)((function(e){return y.a.getTimezone(e)})),k=!Object(m.e)((function(e){return y.a.isElementDisabled(e,b.a.CREATE_PORTFOLIO_BUTTON)}))&&c.a.isFullPDFEnabled(),F=Object(p.useCallback)((function(){return e(r.a.closeElements([b.a.MENU_OVERLAY]))}),[e]);Object(p.useEffect)((function(){var e=function(){var e,t=null===(e=c.a.getDocument())||void 0===e?void 0:e.getType();E(t)};return e(),c.a.addEventListener("documentLoaded",e),function(){c.a.removeEventListener("documentLoaded",e)}}),[]);var C=function(){var t,n=(t=O().mark((function t(){return O().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:F(),Object(g.a)(e,null,{filename:"Untitled.docx",enableOfficeEditing:!0});case 2:case"end":return t.stop()}}),t)})),function(){var e=this,n=arguments;return new Promise((function(r,o){var i=t.apply(e,n);function a(e){x(i,r,o,a,c,"next",e)}function c(e){x(i,r,o,a,c,"throw",e)}a(void 0)}))});return function(){return n.apply(this,arguments)}}();return d.a.createElement(v.a,{menu:b.a.MENU_OVERLAY,trigger:b.a.MENU_OVERLAY_BUTTON,ariaLabel:t("component.menuOverlay")},d.a.createElement(A,null,Object(w.g)()&&d.a.createElement(o.a,{dataElement:b.a.NEW_DOCUMENT_BUTTON,className:"row",img:"icon-plus-sign",label:t("action.newDocument"),ariaLabel:t("action.newDocument"),role:"option",onClick:C}),d.a.createElement(o.a,{dataElement:b.a.FILE_PICKER_BUTTON,className:"row",img:"icon-header-file-picker-line",label:t("action.openFile"),ariaLabel:t("action.openFile"),role:"option",onClick:u.a}),i!==a.a.XOD&&!Object(w.g)()&&d.a.createElement(o.a,{dataElement:b.a.DOWNLOAD_BUTTON,className:"row",img:"icon-download",label:t("action.download"),ariaLabel:t("action.download"),role:"option",onClick:function(){Object(l.a)(e)}}),Object(w.g)()&&d.a.createElement(o.a,{dataElement:b.a.FULLSCREEN_BUTTON,className:"row",img:S?"icon-header-full-screen-exit":"icon-header-full-screen",label:t(S?"action.exitFullscreen":"action.enterFullscreen"),ariaLabel:t(S?"action.exitFullscreen":"action.enterFullscreen"),role:"option",onClick:s.a}),i!==a.a.XOD&&d.a.createElement(o.a,{dataElement:b.a.SAVE_AS_BUTTON,className:"row",img:"icon-save",label:t("saveModal.saveAs"),ariaLabel:t("saveModal.saveAs"),role:"option",onClick:function(){F(),e(r.a.openElement(b.a.SAVE_MODAL))}}),d.a.createElement(o.a,{dataElement:b.a.PRINT_BUTTON,className:"row",img:"icon-header-print-line",label:t("action.print"),ariaLabel:t("action.print"),role:"option",onClick:function(){F(),Object(f.a)(e,T,j,N,_,{isGrayscale:c.a.getDocumentViewer().isGrayscaleModeEnabled(),timezone:P})}})),d.a.createElement("div",{className:"divider"}),k&&d.a.createElement(d.a.Fragment,null,d.a.createElement(o.a,{dataElement:b.a.CREATE_PORTFOLIO_BUTTON,className:"row",img:"icon-pdf-portfolio",label:t("portfolio.createPDFPortfolio"),ariaLabel:t("portfolio.createPDFPortfolio"),role:"option",onClick:function(){F(),e(r.a.openElement(b.a.CREATE_PORTFOLIO_MODAL))}}),d.a.createElement("div",{className:"divider"})),d.a.createElement(o.a,{dataElement:b.a.SETTINGS_BUTTON,className:"row",img:"icon-header-settings-line",label:t("option.settings.settings"),ariaLabel:t("option.settings.settings"),role:"option",onClick:function(){F(),e(r.a.openElement(b.a.SETTINGS_MODAL))}}))};t.default=S}}]);
//# sourceMappingURL=chunk.68.js.map