// ==UserScript==
// @name         bgm.tv 自用 UI 优化聚合
// @namespace    https://github.com/DustRespirator
// @version      0.4
// @description  参见注释
// @author       Hoi
// @match        https://bgm.tv/*
// @match        https://bangumi.tv/*
// @match        https://chii.in/*
// @grant        none
// ==/UserScript==

(function() {
    "use strict";

    // Add Panel Tab
    chiiLib.ukagaka.addPanelTab({
        tab: "app_4444",
        label: "各种 UI 调整",
        type: "options",
        config: [
            {
                title: "滑动条支持触摸操作（刷新后生效）",
                name: "enableTouchSlider",
                type: "radio",
                defaultValue: "off",
                getCurrentValue: function() {
                    return document.cookie.includes("enable_touch_slider=1") ? "on" : "off";
                },
                onChange: function(value) {
                    if (value === "on") {
                        customizeConfigOn("enable_touch_slider");
                    } else {
                        customizeConfigOff("enable_touch_slider");
                    }
                },
                options: [
                    {
                        value: "off",
                        label: "关闭"
                    },
                    {
                        value: "on",
                        label: "开启"
                    }
                ]
            },
            {
                title: "菜单搜索栏自动弹出软键盘（仅对移动浏览器有效）",
                name: "enablePopupKeyboard",
                type: "radio",
                defaultValue: "off",
                getCurrentValue: function() {
                    return document.cookie.includes("enable_popup_keyboard=1") ? "on" : "off";
                },
                onChange: function(value) {
                    if (value === "on") {
                        customizeConfigOn("enable_popup_keyboard");
                    } else {
                        customizeConfigOff("enable_popup_keyboard");
                    }
                },
                options: [
                    {
                        value: "off",
                        label: "关闭"
                    },
                    {
                        value: "on",
                        label: "开启"
                    }
                ]
            },
            {
                title: "再次点击个性化图标可关闭该面板",
                name: "enableToggleCP",
                type: "radio",
                defaultValue: "off",
                getCurrentValue: function() {
                    return document.cookie.includes("enable_toggle_cp=1") ? "on" : "off";
                },
                onChange: function(value) {
                    if (value === "on") {
                        customizeConfigOn("enable_toggle_cp");
                    } else {
                        customizeConfigOff("enable_toggle_cp");
                    }
                },
                options: [
                    {
                        value: "off",
                        label: "关闭"
                    },
                    {
                        value: "on",
                        label: "开启"
                    }
                ]
            }
        ]
    });

    function customizeConfigOn(name) {
        const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = name + "=1; expires=" + expires + "; path=/;";
        document.documentElement.setAttribute(name, "1");
    };

    function customizeConfigOff(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.documentElement.removeAttribute(name);
    };

    //========================================================
    // Slide bar touch fix
    //========================================================
    (function() {
        const isEnabled = document.cookie.includes("enable_touch_slider=1");
        const hasSliderBar = document.getElementById("sliderContainer");
        if (!isEnabled || !hasSliderBar) {
            return;
        }

        // Load jqueryui-touch-punch
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js";
        document.head.appendChild(script);

        let count = 0;
        script.onload = () => {
            //console.log("jqueryui-touch-punch loaded");

            const checkInterval = setInterval(() => {
                const $slider = $("#slider");

                if ($slider.length && $slider.hasClass("ui-slider")) {
                    clearInterval(checkInterval);
                    //console.log("slider detected");
                    const sliderOptions = $slider.slider("option");
                    $slider.slider("destroy");
                    //console.log("slider destroyed");
                    $slider.slider(sliderOptions);
                    //console.log("slider re-initialized");
                }

                count++;
                if (count >= 10) {
                    clearInterval(checkInterval);
                    //console.log("Reached maximum number of attempts");
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

        // Focus on search box in the menu
        const searchInput = document.getElementById("search_text");
        const checkbox1 = document.getElementById("navMenuNeueToggle");
        document.querySelector("label[for='navMenuNeueToggle']").addEventListener("click", () => {
            if (document.documentElement.getAttribute("enable_popup_keyboard") === "1" && !checkbox1.checked) {
                setTimeout(() => {
                    searchInput.focus();
                }, 300);
            }
        });

        // Focus on search box from compact button, fix incorrect focus action
        const checkbox2 = document.getElementById("search-bar-toggle");
        document.querySelector("label[for='search-bar-toggle']").onclick = function() {
            document.getElementById('navMenuNeueToggle').checked = false;
            if (searchInput && !checkbox2.checked) {
                setTimeout(() => {
                    searchInput.focus();
                }, 300);
            }
        }
    })();

    //========================================================
    // Make customize icon toggle panel display/hidden
    //========================================================
    (function() {
        const hasCustomizeToggle = document.querySelector(".toggle-customize");
        if (!hasCustomizeToggle) {
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
            if (customizePanel && !isHidden && document.documentElement.getAttribute("enable_toggle_cp") === "1") {
                customizePanel.style.display = "none";
            } else {
                _originalShowCP();
            }
        }
    })();

})();
