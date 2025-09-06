// ==UserScript==
// @name         bgm.tv 自动深色模式相关修复 (deprecated)
// @namespace    https://github.com/DustRespirator
// @version      0.4
// @description  处理用户手动使用“关灯/开灯”选项后无法响应浏览器自动切换深色模式的情况
// @author       Hoi
// @match        https://bgm.tv/*
// @match        https://bangumi.tv/*
// @match        https://chii.in/*
// @grant        none
// ==/UserScript==

(function() {
    "use strict";

    const listItem = document.querySelector(".content > ul > li.last");
    if (!listItem) {
        return;
    }
    listItem.style.display = "inline-flex";
    listItem.style.alignItems = "center";
    // Fix misplaced "|"
    const toggle = listItem.querySelector("#toggleTheme");
    function removeVerticalBar() {
        toggle.textContent = toggle.textContent.replace(/\s*\|\s*$/, "");
    }
    removeVerticalBar();

    // Add checkbox for auto theme fix
    const checkboxLabel = document.createElement("label");
    checkboxLabel.style.cursor = "pointer";
    checkboxLabel.style.display = "inline-flex";
    checkboxLabel.style.alignItems = "center";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "autoToggleThemeCheckbox";
    checkbox.checked = !document.cookie.includes("chii_theme_choose=1");

    // Insert checkbox
    checkboxLabel.appendChild(checkbox);
    checkboxLabel.append(" 自动深色模式");

    // Make a separator with padding 4px on the left and right
    function makeSeparator() {
        const span = document.createElement("span");
        span.textContent = "|";
        span.style.padding = "0 4px";
        return span;
    }

    listItem.append(makeSeparator(), checkboxLabel, makeSeparator());

    // Remove cookie "chii_theme_choose", enable auto theme
    function autoToggleTheme() {
        document.cookie = "chii_theme_choose=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        chiiLib.ukagaka.autoTheme();
    }

    // Restore cookie "chii_theme_choose", refer to function updateTheme(style, remember), https://bgm.tv/min/g=js
    function manualToggleTheme() {
        const expires = new Date(Date.now() + 2592000 * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = "chii_theme_choose=1; expires=" + expires + "; path=/;";
    }

    // Listener for status change of checkbox
    document.querySelector("#autoToggleThemeCheckbox").addEventListener("change", (e) => {
        if (e.target.checked) {
            autoToggleTheme();
        } else {
            manualToggleTheme();
        }
        removeVerticalBar();
    })

    // Listener for clicking the toggle
    document.querySelector("#toggleTheme").addEventListener("click", (e) => {
        const checkbox = document.querySelector("#autoToggleThemeCheckbox");
        if (checkbox) {
            checkbox.checked = false;
        }
        //removeVerticalBar();
    })

    // Observer to cover the id="toggleTheme" text change
    const observer = new MutationObserver(() => {
        const current = toggle.textContent;
        const trimmed = current.replace(/\s*\|\s*$/, "");
        if (current !== trimmed) {
            toggle.textContent = trimmed;
        }
    });

    observer.observe(toggle, {
        characterData: true,
        childList: true,
        subtree: false
    });
})();
