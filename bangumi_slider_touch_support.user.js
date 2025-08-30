// ==UserScript==
// @name         bgm.tv 讨论页滑块触摸支持
// @namespace    https://github.com/DustRespirator
// @version      0.1
// @description  通过导入 jqueryui-touch-punch 解决讨论页内滑块不支持触摸操作的问题
// @author       Hoi
// @match        https://bgm.tv/*
// @match        https://bangumi.tv/*
// @match        https://chii.in/*
// @grant        none
// ==/UserScript==

(function() {
    "use strict";

    const script = document.createElement("script");
    script.src = ""; // jqueryui-touch-punch
    document.head.appendChild(script);

    script.onload = () => {
        console.log("jqueryui-touch-punch loaded");

        const checkInterval = setInterval(() => {
            const $slider = $('#slider');

            if ($slider.length && $slider.hasClass('ui-slider')) {
                clearInterval(checkInterval);
                console.log("slider detected");

                const sliderOptions = $slider.slider('option');

                $slider.slider('destroy');

                $slider.slider(sliderOptions);
                console.log("slider re-initialized");
            }
        }, 300);
    };
})();
