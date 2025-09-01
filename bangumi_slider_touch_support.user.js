// ==UserScript==
// @name         bgm.tv 讨论页滑块触摸支持
// @namespace    https://github.com/DustRespirator
// @version      0.2
// @description  通过导入 jqueryui-touch-punch 解决讨论页内滑块不支持触摸操作的问题
// @author       Hoi
// @match        https://bgm.tv/*
// @match        https://bangumi.tv/*
// @match        https://chii.in/*
// @grant        none
// ==/UserScript==

(function() {
    const sliderBar = document.getElementById("sliderContainer");
    if (!sliderBar) {
        return;
    }
    const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js";
        document.head.appendChild(script);

    let count = 0;
    script.onload = () => {
        console.log("jqueryui-touch-punch loaded");

        const checkInterval = setInterval(() => {
            const $slider = $("#slider");

            if ($slider.length && $slider.hasClass("ui-slider")) {
                clearInterval(checkInterval);
                console.log("slider detected");

                const sliderOptions = $slider.slider("option");
                $slider.slider("destroy");
                console.log("slider destroyed");

                $slider.slider(sliderOptions);
                console.log("slider re-initialized");
            }

            count++;
            if (count >= 10) {
                clearInterval(checkInterval);
                console.log("Reached maximum number of attempts");
            }
        }, 300);
    };
})();
