// ==UserScript==
// @name         BBCode 文字颜色设置
// @namespace    https://github.com/DustRespirator
// @version      0.1
// @description  加入 BBCode 文字颜色设置的功能
// @author       Hoi
// @match        https://bgm.tv/*
// @match        https://bangumi.tv/*
// @match        https://chii.in/*
// @grant        none
// ==/UserScript==

(function() {
    "use strict";

    const bbcode_color_sets = [
        { name: "Red", openWith: "[color=red]", closeWith: "[/color]", className: "tool_color_red" },
        { name: "DarkRed", openWith: "[color=darkred]", closeWith: "[/color]", className: "tool_color_darkred" },
        { name: "FireBrick", openWith: "[color=firebrick]", closeWith: "[/color]", className: "tool_color_firebrick" },
        { name: "Maroon", openWith: "[color=maroon]", closeWith: "[/color]", className: "tool_color_maroon" },
        { name: "OrangeRed", openWith: "[color=orangered]", closeWith: "[/color]", className: "tool_color_orangered" },
        { name: "Tomato", openWith: "[color=tomato]", closeWith: "[/color]", className: "tool_color_tomato" },
        { name: "Coral", openWith: "[color=coral]", closeWith: "[/color]", className: "tool_color_coral" },
        { name: "Orange", openWith: "[color=orange]", closeWith: "[/color]", className: "tool_color_orange" },
        { name: "Gold", openWith: "[color=gold]", closeWith: "[/color]", className: "tool_color_gold" },
        { name: "GoldenRod", openWith: "[color=goldenrod]", closeWith: "[/color]", className: "tool_color_goldenrod" },
        { name: "Khaki", openWith: "[color=khaki]", closeWith: "[/color]", className: "tool_color_khaki" },
        { name: "Yellow", openWith: "[color=yellow]", closeWith: "[/color]", className: "tool_color_yellow" },
        { name: "LightYellow", openWith: "[color=lightyellow]", closeWith: "[/color]", className: "tool_color_lightyellow" },
        { name: "LemonChiffon", openWith: "[color=lemonchiffon]", closeWith: "[/color]", className: "tool_color_lemonchiffon" },
        { name: "PaleGoldenRod", openWith: "[color=palegoldenrod]", closeWith: "[/color]", className: "tool_color_palegoldenrod" },
        { name: "GreenYellow", openWith: "[color=greenyellow]", closeWith: "[/color]", className: "tool_color_greenyellow" },
        { name: "LawnGreen", openWith: "[color=lawngreen]", closeWith: "[/color]", className: "tool_color_lawngreen" },
        { name: "Chartreuse", openWith: "[color=chartreuse]", closeWith: "[/color]", className: "tool_color_chartreuse" },
        { name: "SpringGreen", openWith: "[color=springgreen]", closeWith: "[/color]", className: "tool_color_springgreen" },
        { name: "SeaGreen", openWith: "[color=seagreen]", closeWith: "[/color]", className: "tool_color_seagreen" },
        { name: "MediumSeaGreen", openWith: "[color=mediumseagreen]", closeWith: "[/color]", className: "tool_color_mediumseagreen" },
        { name: "DarkGreen", openWith: "[color=darkgreen]", closeWith: "[/color]", className: "tool_color_darkgreen" },
        { name: "Olive", openWith: "[color=olive]", closeWith: "[/color]", className: "tool_color_olive" },
        { name: "OliveDrab", openWith: "[color=olivedrab]", closeWith: "[/color]", className: "tool_color_olivedrab" },
        { name: "DarkOliveGreen", openWith: "[color=darkolivegreen]", closeWith: "[/color]", className: "tool_color_darkolivegreen" },
        { name: "YellowGreen", openWith: "[color=yellowgreen]", closeWith: "[/color]", className: "tool_color_yellowgreen" },
        { name: "Cyan", openWith: "[color=cyan]", closeWith: "[/color]", className: "tool_color_cyan" },
        { name: "LightCyan", openWith: "[color=lightcyan]", closeWith: "[/color]", className: "tool_color_lightcyan" },
        { name: "Aquamarine", openWith: "[color=aquamarine]", closeWith: "[/color]", className: "tool_color_aquamarine" },
        { name: "MediumAquaMarine", openWith: "[color=mediumaquamarine]", closeWith: "[/color]", className: "tool_color_mediumaquamarine" },
        { name: "DarkCyan", openWith: "[color=darkcyan]", closeWith: "[/color]", className: "tool_color_darkcyan" },
        { name: "Teal", openWith: "[color=teal]", closeWith: "[/color]", className: "tool_color_teal" },
        { name: "DarkTurquoise", openWith: "[color=darkturquoise]", closeWith: "[/color]", className: "tool_color_darkturquoise" },
        { name: "MediumTurquoise", openWith: "[color=mediumturquoise]", closeWith: "[/color]", className: "tool_color_mediumturquoise" },
        { name: "PaleTurquoise", openWith: "[color=paleturquoise]", closeWith: "[/color]", className: "tool_color_paleturquoise" },
        { name: "LightSeaGreen", openWith: "[color=lightseagreen]", closeWith: "[/color]", className: "tool_color_lightseagreen" },
        { name: "Blue", openWith: "[color=blue]", closeWith: "[/color]", className: "tool_color_blue" },
        { name: "MediumBlue", openWith: "[color=mediumblue]", closeWith: "[/color]", className: "tool_color_mediumblue" },
        { name: "DarkBlue", openWith: "[color=darkblue]", closeWith: "[/color]", className: "tool_color_darkblue" },
        { name: "Navy", openWith: "[color=navy]", closeWith: "[/color]", className: "tool_color_navy" },
        { name: "RoyalBlue", openWith: "[color=royalblue]", closeWith: "[/color]", className: "tool_color_royalblue" },
        { name: "SteelBlue", openWith: "[color=steelblue]", closeWith: "[/color]", className: "tool_color_steelblue" },
        { name: "DodgerBlue", openWith: "[color=dodgerblue]", closeWith: "[/color]", className: "tool_color_dodgerblue" },
        { name: "CornflowerBlue", openWith: "[color=cornflowerblue]", closeWith: "[/color]", className: "tool_color_cornflowerblue" },
        { name: "SkyBlue", openWith: "[color=skyblue]", closeWith: "[/color]", className: "tool_color_skyblue" },
        { name: "LightSkyBlue", openWith: "[color=lightskyblue]", closeWith: "[/color]", className: "tool_color_lightskyblue" },
        { name: "LightBlue", openWith: "[color=lightblue]", closeWith: "[/color]", className: "tool_color_lightblue" },
        { name: "PowderBlue", openWith: "[color=powderblue]", closeWith: "[/color]", className: "tool_color_powderblue" },
        { name: "Purple", openWith: "[color=purple]", closeWith: "[/color]", className: "tool_color_purple" },
        { name: "MediumPurple", openWith: "[color=mediumpurple]", closeWith: "[/color]", className: "tool_color_mediumpurple" },
        { name: "DarkOrchid", openWith: "[color=darkorchid]", closeWith: "[/color]", className: "tool_color_darkorchid" },
        { name: "DarkViolet", openWith: "[color=darkviolet]", closeWith: "[/color]", className: "tool_color_darkviolet" },
        { name: "Indigo", openWith: "[color=indigo]", closeWith: "[/color]", className: "tool_color_indigo" },
        { name: "BlueViolet", openWith: "[color=blueviolet]", closeWith: "[/color]", className: "tool_color_blueviolet" },
        { name: "Violet", openWith: "[color=violet]", closeWith: "[/color]", className: "tool_color_violet" },
        { name: "DarkMagenta", openWith: "[color=darkmagenta]", closeWith: "[/color]", className: "tool_color_darkmagenta" },
        { name: "DeepPink", openWith: "[color=deeppink]", closeWith: "[/color]", className: "tool_color_deeppink" },
        { name: "HotPink", openWith: "[color=hotpink]", closeWith: "[/color]", className: "tool_color_hotpink" },
        { name: "Pink", openWith: "[color=pink]", closeWith: "[/color]", className: "tool_color_pink" },
        { name: "LightPink", openWith: "[color=lightpink]", closeWith: "[/color]", className: "tool_color_lightpink" },
        { name: "White", openWith: "[color=white]", closeWith: "[/color]", className: "tool_color_white" },
        { name: "Snow", openWith: "[color=snow]", closeWith: "[/color]", className: "tool_color_snow" },
        { name: "GhostWhite", openWith: "[color=ghostwhite]", closeWith: "[/color]", className: "tool_color_ghostwhite" },
        { name: "WhiteSmoke", openWith: "[color=whitesmoke]", closeWith: "[/color]", className: "tool_color_whitesmoke" },
        { name: "Beige", openWith: "[color=beige]", closeWith: "[/color]", className: "tool_color_beige" },
        { name: "FloralWhite", openWith: "[color=floralwhite]", closeWith: "[/color]", className: "tool_color_floralwhite" },
        { name: "Ivory", openWith: "[color=ivory]", closeWith: "[/color]", className: "tool_color_ivory" },
        { name: "MintCream", openWith: "[color=mintcream]", closeWith: "[/color]", className: "tool_color_mintcream" },
        { name: "HoneyDew", openWith: "[color=honeydew]", closeWith: "[/color]", className: "tool_color_honeydew" },
        { name: "Lavender", openWith: "[color=lavender]", closeWith: "[/color]", className: "tool_color_lavender" },
        { name: "LavenderBlush", openWith: "[color=lavenderblush]", closeWith: "[/color]", className: "tool_color_lavenderblush" },
        { name: "MistyRose", openWith: "[color=mistyrose]", closeWith: "[/color]", className: "tool_color_mistyrose" },
        { name: "Gray", openWith: "[color=gray]", closeWith: "[/color]", className: "tool_color_gray" },
        { name: "LightGray", openWith: "[color=lightgray]", closeWith: "[/color]", className: "tool_color_lightgray" },
        { name: "DarkGray", openWith: "[color=darkgray]", closeWith: "[/color]", className: "tool_color_darkgray" },
        { name: "SlateGray", openWith: "[color=slategray]", closeWith: "[/color]", className: "tool_color_slategray" },
        { name: "SlateGrey", openWith: "[color=slategrey]", closeWith: "[/color]", className: "tool_color_slategrey" },
        { name: "LightSlateGray", openWith: "[color=lightslategray]", closeWith: "[/color]", className: "tool_color_lightslategray" },
        { name: "DimGray", openWith: "[color=dimgray]", closeWith: "[/color]", className: "tool_color_dimgray" },
        { name: "Gainsboro", openWith: "[color=gainsboro]", closeWith: "[/color]", className: "tool_color_gainsboro" },
        { name: "Silver", openWith: "[color=silver]", closeWith: "[/color]", className: "tool_color_silver" }
    ];

    //========================================================
    // Insert BBCode color panel
    //========================================================
    (function() {
        if (!window.mySettings || !Array.isArray(window.mySettings.markupSet)) {
            return;
        }

        const style = document.createElement("style");
        style.textContent = bbcode_color_sets.map(color =>
            `.markItUp .${color.className} a {
                position: relative;
                color: transparent;
            }
            .markItUp .${color.className} a::before {
                content:"";
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width:20px;
                height:20px;
                margin:0px;
                background-color:${color.name.toLowerCase()};
                border:1px solid #ccc;
            }`).join("\n");
        document.head.appendChild(style);

        mySettings.markupSet.splice(9, 0, {
            name: "文字颜色",
            className: "tool_color tool_ico bgm_smiles_menu bbcode_color markItUpDropMenu",
            dropMenu: bbcode_color_sets
        });
    })();

})();
