(function(window){var svgSprite='<svg><symbol id="icon-gengduocaidanxianxing" viewBox="0 0 1024 1024"><path d="M88.948736 202.326016l846.102528 0c13.755392 0 24.885248-11.177984 24.885248-24.885248 0-13.802496-11.129856-24.885248-24.885248-24.885248L88.948736 152.55552c-13.754368 0-24.884224 11.082752-24.884224 24.885248C64.064512 191.149056 75.194368 202.326016 88.948736 202.326016zM935.051264 426.294272 88.948736 426.294272c-13.754368 0-24.884224 11.082752-24.884224 24.885248 0 13.708288 11.129856 24.885248 24.884224 24.885248l846.102528 0c13.755392 0 24.885248-11.17696 24.885248-24.885248C959.935488 437.377024 948.805632 426.294272 935.051264 426.294272zM935.051264 700.033024 88.948736 700.033024c-13.754368 0-24.884224 11.081728-24.884224 24.885248 0 13.708288 11.129856 24.886272 24.884224 24.886272l846.102528 0c13.755392 0 24.885248-11.177984 24.885248-24.886272C959.935488 711.114752 948.805632 700.033024 935.051264 700.033024z"  ></path></symbol></svg>';var script=function(){var scripts=document.getElementsByTagName("script");return scripts[scripts.length-1]}();var shouldInjectCss=script.getAttribute("data-injectcss");var ready=function(fn){if(document.addEventListener){if(~["complete","loaded","interactive"].indexOf(document.readyState)){setTimeout(fn,0)}else{var loadFn=function(){document.removeEventListener("DOMContentLoaded",loadFn,false);fn()};document.addEventListener("DOMContentLoaded",loadFn,false)}}else if(document.attachEvent){IEContentLoaded(window,fn)}function IEContentLoaded(w,fn){var d=w.document,done=false,init=function(){if(!done){done=true;fn()}};var polling=function(){try{d.documentElement.doScroll("left")}catch(e){setTimeout(polling,50);return}init()};polling();d.onreadystatechange=function(){if(d.readyState=="complete"){d.onreadystatechange=null;init()}}}};var before=function(el,target){target.parentNode.insertBefore(el,target)};var prepend=function(el,target){if(target.firstChild){before(el,target.firstChild)}else{target.appendChild(el)}};function appendSvg(){var div,svg;div=document.createElement("div");div.innerHTML=svgSprite;svgSprite=null;svg=div.getElementsByTagName("svg")[0];if(svg){svg.setAttribute("aria-hidden","true");svg.style.position="absolute";svg.style.width=0;svg.style.height=0;svg.style.overflow="hidden";prepend(svg,document.body)}}if(shouldInjectCss&&!window.__iconfont__svg__cssinject__){window.__iconfont__svg__cssinject__=true;try{document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>")}catch(e){console&&console.log(e)}}ready(appendSvg)})(window)