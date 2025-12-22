// ==UserScript==
// @name         bgm.tv 自用 UI 优化聚合
// @namespace    https://github.com/DustRespirator
// @version      0.5.1
// @description  参见注释
// @author       Hoi
// @match        https://bgm.tv/*
// @match        https://bangumi.tv/*
// @match        https://chii.in/*
// @grant        none
// ==/UserScript==

(function() {
    "use strict";

    // Cookie name of features
    const features = ["enable_touch_slider", "enable_tooltip_filler", "enable_popup_keyboard", "enable_toggle_cp"];
    // Initialize html attributes
    const html = document.documentElement;
    features.forEach((name) => {
        const value = getValueFromCookie(name);
        if (value === "on") {
            html.setAttribute(name, "on");
        }
    });

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
                    return getValueFromCookie("enable_touch_slider");
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
                title: "改善贴贴用户列表难以用鼠标点击的问题（刷新后生效）",
                name: "enableTooltipFiller",
                type: "radio",
                defaultValue: "off",
                getCurrentValue: function() {
                    return getValueFromCookie("enable_tooltip_filler");
                },
                onChange: function(value) {
                    if (value === "on") {
                        customizeConfigOn("enable_tooltip_filler");
                    } else {
                        customizeConfigOff("enable_tooltip_filler");
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
                    return getValueFromCookie("enable_popup_keyboard");
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
                    return getValueFromCookie("enable_toggle_cp");
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

    // Get current value from cookie
    function getValueFromCookie(name) {
        const pair = name + "=on";
        return document.cookie.includes(pair) ? "on" : "off";
    }

    function customizeConfigOn(name) {
        const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = name + "=on; expires=" + expires + "; path=/;";
        document.documentElement.setAttribute(name, "on");
    }

    function customizeConfigOff(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.documentElement.removeAttribute(name);
    }

    //========================================================
    // Slide bar touch fix
    //========================================================
    (function() {
        const isEnabled = document.cookie.includes("enable_touch_slider=on");
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
    // Fix the tooltip on likes grid is hard to touch
    //========================================================
    (function() {
        const isEnabled = document.cookie.includes("enable_tooltip_filler=on");
        if (!isEnabled) {
            return;
        }

        (function insertFiller(heightPx = 4) {
            const style = document.createElement("style");
            style.textContent = `
                .tooltip.fade.in.top::after {
                    content: "";
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    height: ${heightPx}px;
                    z-index: 1020;
                    pointer-events: auto;
                    display: block;
                }
            `;
            document.head.appendChild(style);
        })();
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
            if (document.documentElement.getAttribute("enable_popup_keyboard") === "on" && !checkbox1.checked) {
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

        const _originalShowCP = chiiLib.ukagaka.showCustomizePanel.bind(chiiLib.ukagaka);
        let isHidden = true;

        // Override showCustomizePanel()
        chiiLib.ukagaka.showCustomizePanel = function() {
            const customizePanel = document.getElementById("customize-panel") || null;
            if (customizePanel) {
                isHidden = (window.getComputedStyle(customizePanel).display === "none")
            }
            //console.log("isHidden: ", isHidden);
            if (customizePanel && !isHidden && document.documentElement.getAttribute("enable_toggle_cp") === "on") {
                customizePanel.style.display = "none";
            } else {
                _originalShowCP();
            }
        }
    })();

})();
