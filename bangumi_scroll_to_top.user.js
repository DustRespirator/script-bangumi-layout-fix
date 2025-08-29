// ==UserScript==
// @name         快速返回页面顶部
// @namespace    https://github.com/DustRespirator
// @version      0.1
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
    const BOTTOM_PULL_THRESHOLD = window.innerHeight * 0.4; //
    const COOLDOWN = 1000;
    const SCREEN_WIDTH = window.innerWidth;
    const root = document.scrollingElement || document.documentElement;

    const indicator = document.createElement("div");
    indicator.id = "pull-indicator";
    document.body.appendChild(indicator);

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

    function updateIndicatorColor(color) {
        switch (color) {
            case "taikoh":
                indicator.style.setProperty("--indicator-color", "248,195,205");
                break;
            case "momo":
                indicator.style.setProperty("--indicator-color", "245,150,170");
                break;
            case "kohbai":
                indicator.style.setProperty("--indicator-color", "225,107,140");
                break;
            default:
                break;
        }
    }

    function updateIndicator() {
        if (needsUpdate) {
            indicator.style.opacity = Math.min(pulledHeight / BOTTOM_PULL_THRESHOLD, 1);
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
        //lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
        pulledHeight = 0;
        updateIndicatorColor("taikoh");
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
        updateIndicator();
        if (pulledHeight >= BOTTOM_PULL_THRESHOLD) {
            updateIndicatorColor("momo");
        } else {
            updateIndicatorColor("taikoh");
        }
    }, { passive: true });

    document.addEventListener("touchend", (e) => {
        if (pulledHeight >= BOTTOM_PULL_THRESHOLD && (Date.now() - lastTriggerTime) > COOLDOWN) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            updateIndicatorColor("kohbai");
            setTimeout(() => {
                indicator.style.opacity = 0;
            }, 100);
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "auto" });
            }, 300);
            lastTriggerTime = Date.now();
            document.body.classList.add('no-scroll');
            setTimeout(() => {
                document.body.classList.remove('no-scroll');
            }, 25);
        } else {
            indicator.style.opacity = 0;
        }
        tracking = false;
        startedAtBottom = false;
        pulledHeight = 0;
    }, { passive: false });
})();
