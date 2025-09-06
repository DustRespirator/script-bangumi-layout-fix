// ==UserScript==
// @name         bgm.tv 自用 UI 优化聚合
// @namespace    https://github.com/DustRespirator
// @version      0.3
// @description  参见注释
// @author       Hoi
// @match        https://bgm.tv/*
// @match        https://bangumi.tv/*
// @match        https://chii.in/*
// @grant        none
// ==/UserScript==

(function() {
    "use strict";

    //========================================================
    // Slide bar touch fix
    //========================================================
    (function() {
        const sliderBar = document.getElementById("sliderContainer");
        if (!sliderBar) {
            return;
        }

        // Load jqueryui-touch-punch
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

    //========================================================
    // Auto focus on search bar and toggle keyboard
    //========================================================
    (function() {
        const isMobile = /Mobile|Android/i.test(navigator.userAgent);
        if (!isMobile) {
            return;
        }

        // Build setting panel for toggling keyboard
        const autoToggleKeyboardSetting = {
            title: "自动弹出软键盘",
            name: "toggleKeyboard",
            type: "radio",
            defaultValue: "default",
            getCurrentValue: function() {
                return document.cookie.includes("auto_toggle_keyboard=1") ? "on" : "default";
            },
            onChange: function(value) {
                if (value === "on") {
                    autoToggleKeyboard();
                } else {
                    manualToggleKeyboard();
                }
            },
            options: [
                {
                    value: "default",
                    label: "默认（关闭）"
                },
                {
                    value: "on",
                    label: "开启"
                }
            ]
        };
        
        // Insert toggle setting into original panel config and initialize.
        const _originalInitCP = chiiLib.ukagaka.initCustomizePanel.bind(chiiLib.ukagaka);
        chiiLib.ukagaka.initCustomizePanel = function() {
            const originalGeneratePanelHTML = this.generatePanelHTML;
            this.generatePanelHTML = function(config) {
                config.push(autoToggleKeyboardSetting);
                return originalGeneratePanelHTML.call(this, config);
            }
            _originalInitCP();
            this.generatePanelHTML = originalGeneratePanelHTML;
        }

        // Create cookie "auto_toggle_keyboard", enable auto toggle keyboard
        function autoToggleKeyboard() {
            const expires = new Date(Date.now() + 2592000 * 24 * 60 * 60 * 1000).toUTCString();
            document.cookie = "auto_toggle_keyboard=1; expires=" + expires + "; path=/;";
        }

        // Remove cookie "auto_toggle_keyboard"
        function manualToggleKeyboard() {
            document.cookie = "auto_toggle_keyboard=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }

        const searchInput = document.getElementById("search_text");
        const checkbox = document.getElementById("navMenuNeueToggle");
        document.querySelector("label[for='navMenuNeueToggle']").addEventListener("click", () => {
            if (document.cookie.includes("auto_toggle_keyboard=1") && !checkbox.checked) {
                setTimeout(() => {
                    searchInput.focus();
                }, 50);
            }
        });
    })();

    //========================================================
    // Make customize icon toggle panel display/hidden
    //========================================================
    (function() {
        if (!document.querySelector(".content")) {
            return;
        }

        // Initialize customize panel manually
        chiiLib.ukagaka.initCustomizePanel();
        const _originalShowCP = chiiLib.ukagaka.showCustomizePanel.bind(chiiLib.ukagaka);

        // Override showCustomizePanel()
        chiiLib.ukagaka.showCustomizePanel = function() {
            const customizePanel = document.getElementById("customize-panel");
            const isHidden = (window.getComputedStyle(customizePanel).display === "none");
            //console.log("isHidden: ", isHidden);
            if (customizePanel && !isHidden) {
                customizePanel.style.display = "none";
            } else {
                _originalShowCP();
            }
        }
    })();

})();
