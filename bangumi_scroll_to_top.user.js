// ==UserScript==
// @name         快速返回页面顶部
// @namespace    https://github.com/DustRespirator
// @version      0.3
// @description  仅适用于触摸操作，在页面底部向上滑动可回到页首
// @author       Hoi
// @match        https://bgm.tv/*
// @match        https://bangumi.tv/*
// @match        https://chii.in/*
// @grant        none
// ==/UserScript==

(function() {
    "use strict";

    // For touch, pull at bottom of page: return to top
    const BOTTOM_PULL_THRESHOLD = window.innerHeight * 0.4;
    const COOLDOWN = 1000;
    //const SCREEN_WIDTH = window.innerWidth;
    const root = document.scrollingElement || document.documentElement;

    const themeColors = {
        pink: {
            normal:  "248,195,205", // taikoh
            ready:   "245,150,170", // momo
            trigger: "225,107,140"  // kohbai
        },
        blue: {
            normal:  "58,143,183",  // chigusa
            ready:   "0,160,233",   // ao
            trigger: "0,134,204"    // ama
        },
        green: {
            normal:  "134,193,102", // nae
            ready:   "144,180,75",  // hiwamoegi
            trigger: "123,162,63"   // moegi
        },
        purple: {
            normal:  "178,143,206", // usu
            ready:   "152,109,178", // hashita
            trigger: "119,66,141"   // edomurasaki
        },
        orange: {
            normal:  "237,120,74",  // sohi
            ready:   "247,92,47",   // benihi
            trigger: "240,94,28"    // ohni
        },
        red: {
            normal:  "215,84,85",   // entan
            ready:   "203,64,66",   // akabeni
            trigger: "199,62,58"    // ginsyu
        },
        
    }

    const indicator = document.createElement("div");
    indicator.id = "pull-indicator";
    document.body.appendChild(indicator);

    let currentThemeColor = getThemeColor();

    let needsUpdate = false;
    let tracking = false;
    let startedAtBottom = false;
    let pulledHeight = 0;
    //let lastX = 0;
    let lastY = 0;
    let lastTriggerTime = 0;

    function atBottom() {
        return Math.abs(root.scrollHeight - root.clientHeight - root.scrollTop) <= 100;
    }

    function updateIndicatorColor(state) {
        const theme = themeColors[currentThemeColor] || themeColors.pink;
        switch (state) {
            case "normal":
                indicator.style.setProperty("--indicator-color", theme.normal);
                break;
            case "ready":
                indicator.style.setProperty("--indicator-color", theme.ready);
                break;
            case "trigger":
                indicator.style.setProperty("--indicator-color", theme.trigger);
                break;
            default:
                break;
        }
    }

    function updateIndicator() {
        if (needsUpdate) {
            indicator.style.opacity = Math.min(pulledHeight / BOTTOM_PULL_THRESHOLD, 1) + "";
            needsUpdate = false;
        }
        requestAnimationFrame(updateIndicator);
    }

    document.addEventListener("touchstart", (e) => {
        if (e.touches.length !== 1) {
            tracking = false;
            return;
        }

        tracking = true;
        startedAtBottom = atBottom();
        pulledHeight = 0;
        //lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
        updateIndicatorColor("normal");
    }, { passive: true });

    document.addEventListener("touchmove", (e) => {
        if (!tracking || e.touches.length !== 1 || !startedAtBottom) {
            return;
        }

        needsUpdate = true;
        const y = e.touches[0].clientY;
        const dy = y - lastY;
        lastY = y;
        //lastX = e.touches[0].clientX;

        pulledHeight += (-dy);
        if (dy >= 0 && indicator.style.opacity !== "0") {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
        updateIndicator();
        if (pulledHeight >= BOTTOM_PULL_THRESHOLD) {
            updateIndicatorColor("ready");
        } else {
            updateIndicatorColor("normal");
        }
    }, { passive: false });

    document.addEventListener("touchcancel", () => {
        indicator.style.opacity = "0";
        needsUpdate = false;
        tracking = false;
        startedAtBottom = false;
        pulledHeight = 0;
    }, { passive: true });

    document.addEventListener("touchend", (e) => {
        if (pulledHeight >= BOTTOM_PULL_THRESHOLD && (Date.now() - lastTriggerTime) > COOLDOWN) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            updateIndicatorColor("trigger");
            setTimeout(() => {
                indicator.style.opacity = "0";
            }, 100);
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "auto" });
            }, 300);
            lastTriggerTime = Date.now();
            document.body.classList.add("no-scroll");
            setTimeout(() => {
                document.body.classList.remove("no-scroll");
            }, 50);
        } else {
            indicator.style.opacity = "0";
        }
        needsUpdate = false;
        tracking = false;
        startedAtBottom = false;
        pulledHeight = 0;
    }, { passive: false });

    // Get theme color config
    function getThemeColor() {
        return document.documentElement.getAttribute("data-theme-color") || "pink";
    }

    // Observer to get theme color config
    const observer = new MutationObserver(() => {
        const newThemeColor = getThemeColor()
        if (currentThemeColor !== newThemeColor) {
            currentThemeColor = newThemeColor;
        }
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme-color"]
    });
})();
