// ==UserScript==
// @name         bgm.tv BBCODE工具栏微调
// @namespace    https://github.com/DustRespirator
// @version      0.1
// @description  根据个人喜好微调了工具栏图标位置和间距
// @author       Hoi
// @match        https://bgm.tv/*
// @match        https://bangumi.tv/*
// @match        https://chii.in/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    "use strict";

    GM_addStyle(`
        .markItUpHeader ul a {
            background-position: center;
            margin-bottom: 3px;
            margin-right: 3px;
        }

        .markItUpHeader ul .markItUpDropMenu {
            background: transparent url(/js/editor/skins/simple/images/menu.png) no-repeat 100% 85% !important;
            margin-right: 4px;
            padding-right: 8px;
        }

        .markItUpHeader ul .markItUpSeparator {
        	margin: 0 4px;
        	height: 22px;
        }

        .markItUpHeader ul ul {
            top: 24px !important;
        }
    `);
})();
