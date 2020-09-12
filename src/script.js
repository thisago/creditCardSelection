"use strict";
/// <reference path="./script.d.ts" />
/* eslint-disable no-undef */
var last = null;
var setupElements = function (elements) {
    var _a, _b;
    var parseConfiguration = function (config) { return function (parcelsStr) {
        if (!config)
            return "";
        var createParcelA = function (data) { return function (mode) { return function (key) {
            var label = document.createElement("label");
            var span = document.createElement("span");
            var radio = document.createElement("input");
            label.classList.add("parcel");
            var parcelsB = parcels[mode];
            var priceA = parcelsB[key];
            var price = data.constants.currency.before + priceA + data.constants.currency.after;
            radio.type = "checkbox";
            radio.name = "parcel";
            radio.value = key + "_" + mode;
            if (parseInt(key) <= 1) {
                var texts = data.constants.text.singular;
            }
            else {
                // eslint-disable-next-line no-redeclare
                var texts = data.constants.text.plural;
            }
            span.innerHTML = texts.before + key + texts.middle + price + texts.end;
            label.appendChild(span);
            label.appendChild(radio);
            return label;
        }; }; };
        var data = JSON.parse(config);
        var parcels = JSON.parse(parcelsStr);
        if (!data || !parcels || !data.constants || !data.constants.text || !data.constants.currency)
            return "";
        var createParcelB = createParcelA(data);
        var createParcels = function (mode) {
            var createParcel = createParcelB(mode);
            var element = document.createElement("div");
            var span = document.createElement("span");
            element.classList.add(mode);
            span.innerHTML = data.constants.text.global[mode];
            element.appendChild(span);
            var parcelsElmt = document.createElement("div");
            parcelsElmt.classList.add("parcels");
            var keys = Object.keys(parcels[mode]);
            keys.forEach(function (key) {
                parcelsElmt.appendChild(createParcel(key));
            });
            element.appendChild(parcelsElmt);
            return element.outerHTML;
        };
        var html = "";
        if (parcels.credit) {
            html += createParcels("credit");
        }
        if (parcels.debit) {
            html += createParcels("debit");
        }
        return html;
    }; };
    var cleanParcels = function (element) {
        var _a, _b;
        if (element.classList.contains("card")) {
            var parcelsContainer = (_b = (_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.getElementsByClassName("method")[0];
            if (parcelsContainer) {
                var parcels = parcelsContainer.getElementsByClassName("parcel");
                for (var i_1 = 0; i_1 < parcels.length; i_1++) {
                    parcels[i_1].getElementsByTagName("input")[0].checked = false;
                    parcels[i_1].classList.remove("active");
                }
                parcelsContainer.classList.add("hidden");
            }
            else {
                console.error("Not exist parcels container of: " + element);
            }
        }
    };
    var toggleParcels = function (element) { return function (show) {
        var _a, _b;
        if (show === void 0) { show = true; }
        var parcelsContainer = (_b = (_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.getElementsByClassName("method")[0];
        if (parcelsContainer) {
            parcelsContainer.classList[show ? "remove" : "add"]("hidden");
        }
        else {
            console.error("Not exist parcels container of: " + element);
        }
    }; };
    var _loop_1 = function () {
        var element = elements[i];
        var checkbox = element.getElementsByTagName("input")[0];
        console.log(element.classList.contains("module"));
        if (element.classList.contains("card")) {
            element.setAttribute("parcels", (_a = element.getAttribute("data-parcels")) !== null && _a !== void 0 ? _a : "{}");
            setTimeout(function () {
                element.removeAttribute("data-parcels");
            }, 0);
        }
        else if (element.classList.contains("module")) {
            element.setAttribute("data", (_b = element.getAttribute("data-configuration")) !== null && _b !== void 0 ? _b : "{}");
            setTimeout(function () {
                element.removeAttribute("data-configuration");
            }, 0);
            element.id = "module_" + (i + 1);
            return "continue";
        }
        checkbox.addEventListener("change", function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
            if (last !== element) {
                if (last !== null) {
                    last.getElementsByTagName("input")[0].checked = false;
                    last.classList.remove("active");
                    console.log((_b = (_a = last.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.id, (_d = (_c = element.parentElement) === null || _c === void 0 ? void 0 : _c.parentElement) === null || _d === void 0 ? void 0 : _d.id);
                    if (element.classList.contains("card")) {
                        if (((_f = (_e = last.parentElement) === null || _e === void 0 ? void 0 : _e.parentElement) === null || _f === void 0 ? void 0 : _f.id) !== ((_h = (_g = element.parentElement) === null || _g === void 0 ? void 0 : _g.parentElement) === null || _h === void 0 ? void 0 : _h.id)) {
                            (_k = (_j = last.parentElement) === null || _j === void 0 ? void 0 : _j.parentElement) === null || _k === void 0 ? void 0 : _k.classList.remove("active");
                            cleanParcels(last);
                            toggleParcels(last)(false);
                        }
                        (_l = last.parentElement) === null || _l === void 0 ? void 0 : _l.classList.remove("hide");
                    }
                }
                last = element;
            }
            if (checkbox.checked) {
                if (element.classList.contains("card")) {
                    var container = (_m = element.parentElement) === null || _m === void 0 ? void 0 : _m.parentElement;
                    container.getElementsByTagName("input")[0].click();
                    container.getElementsByTagName("input")[0].checked = true;
                    container.classList.add("active");
                    element.classList.add("active");
                    (_o = element.parentElement) === null || _o === void 0 ? void 0 : _o.classList.add("hide");
                    var parcelsContainer = (_q = (_p = element.parentElement) === null || _p === void 0 ? void 0 : _p.parentElement) === null || _q === void 0 ? void 0 : _q.getElementsByClassName("method")[0];
                    parcelsContainer.innerHTML = parseConfiguration((_r = container.getAttribute("data")) !== null && _r !== void 0 ? _r : "{}")((_s = element.getAttribute("parcels")) !== null && _s !== void 0 ? _s : "{}");
                    setupElements(parcelsContainer.querySelectorAll("label.parcel"));
                    toggleParcels(element)(true);
                }
                else if (element.classList.contains("parcel")) {
                    element.classList.add("active");
                }
            }
            else {
                element.classList.remove("active");
                checkbox.checked = false;
                if (element.classList.contains("card")) {
                    (_t = element.parentElement) === null || _t === void 0 ? void 0 : _t.classList.remove("hide");
                    toggleParcels(element)(false);
                    cleanParcels(element);
                    (_v = (_u = element.parentElement) === null || _u === void 0 ? void 0 : _u.parentElement) === null || _v === void 0 ? void 0 : _v.classList.remove("active");
                }
            }
        });
    };
    for (var i = 0; i < elements.length; i++) {
        _loop_1();
    }
};
document.addEventListener("DOMContentLoaded", function () {
    var modules = document.querySelectorAll("div.module");
    setupElements(modules);
    modules.forEach(function (module) {
        // setup (module);
        setupElements(module.querySelectorAll("label.card"));
    });
});
var div = document.getElementsByClassName("form")[0];
if (window.location.href.indexOf("?") !== -1) {
    div.innerHTML = window.location.href.
        replace(/.*\?/, "").
        split("&").
        join("<br>");
}
