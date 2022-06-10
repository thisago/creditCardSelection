"use strict";
/// <reference path="./script.d.ts" />
var lastModule = null;
var setupElements = function (elements) {
    var _a, _b;
    var parseConfiguration = function (config) { return function (parcelsStr) {
        if (!config)
            return "";
        var createParcelA = function (data) {
            return function (mode) {
                return function (key) {
                    var _a, _b;
                    var label = document.createElement("label");
                    var span = document.createElement("span");
                    var radio = document.createElement("input");
                    label.classList.add("parcel");
                    var parcelsB = parcels[mode];
                    var parcel = parcelsB[key];
                    var priceA = (_a = parcel.price) !== null && _a !== void 0 ? _a : parcel;
                    var price = data.constants.currency.before +
                        priceA +
                        data.constants.currency.after;
                    radio.type = "radio";
                    radio.name = "parcel";
                    radio.required = true;
                    radio.value = "".concat(key, "_").concat(mode);
                    // radio.addEventListener (`invalid`, (event: Event) => {
                    //     const element = <HTMLInputElement>(event.target ?? event);
                    //     const container = <HTMLDivElement | null>element.parentElement?.parentElement?.parentElement?.parentElement?.parentElement;
                    //     console.log (container);
                    //     if (container) {
                    //         setMessage (container) (data.constants.text.error.invalid);
                    //     }
                    // });
                    label.setAttribute("message", (_b = parcel.message) !== null && _b !== void 0 ? _b : "");
                    if (key <= 1) {
                        var texts = data.constants.text.singular;
                    }
                    else {
                        // eslint-disable-next-line no-redeclare
                        var texts = data.constants.text.plural;
                    }
                    span.innerHTML =
                        texts.before + key + texts.middle + price + texts.end;
                    label.appendChild(span);
                    label.appendChild(radio);
                    return label;
                };
            };
        };
        var data = JSON.parse(config);
        var parcels = JSON.parse(parcelsStr);
        if (!data ||
            !parcels ||
            !data.constants ||
            !data.constants.text ||
            !data.constants.currency)
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
                parcelsElmt.appendChild(createParcel(parseInt(key)));
            });
            element.appendChild(parcelsElmt);
            return element.outerHTML;
        };
        var html = "";
        if (parcels.debit) {
            html += createParcels("debit");
        }
        if (parcels.credit) {
            html += createParcels("credit");
        }
        return html;
    }; };
    var toggleParcels = function (element) {
        return function (show) {
            var _a, _b;
            if (show === void 0) { show = true; }
            var parcelsContainer = ((_b = (_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.getElementsByClassName("method")[0]);
            if (parcelsContainer) {
                parcelsContainer.classList[show ? "remove" : "add"]("hidden");
            }
            else {
                console.error("Not exist parcels container of: ".concat(element));
            }
        };
    };
    var getContainer = function (element) {
        var _a;
        return element.classList.contains("card")
            ? (_a = element === null || element === void 0 ? void 0 : element.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement
            : null;
    };
    var setMessage = function (container) {
        return function (message) {
            if (message === void 0) { message = null; }
            var msgBox = (container.getElementsByClassName("message")[0]);
            if (message) {
                msgBox.innerHTML = message !== null && message !== void 0 ? message : "";
                msgBox.classList.remove("hide");
                container.scrollIntoView();
            }
            else {
                msgBox.classList.add("hide");
            }
        };
    };
    var _loop_1 = function () {
        var element = elements[i];
        var checkbox = element.getElementsByTagName("input")[0];
        var container = getContainer(element);
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
            element.id = "module_".concat(i + 1);
            return "continue";
        }
        last = null;
        checkbox.addEventListener("change", function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            if (lastModule !== container &&
                element.classList.contains("card")) {
                if (lastModule) {
                    if (container.id !== lastModule.id) {
                        lastModule.getElementsByTagName("input")[0].checked =
                            false;
                        lastModule.classList.remove("active");
                        var lastModuleCard = lastModule.querySelector("label.card.active");
                        if (lastModuleCard) {
                            lastModuleCard.getElementsByTagName("input")[0].checked = false;
                            lastModuleCard.classList.remove("active");
                            (_a = lastModuleCard.parentElement) === null || _a === void 0 ? void 0 : _a.classList.remove("hide");
                        }
                        toggleParcels((lastModule.getElementsByClassName("card")[0]))(false);
                        if (element.classList.contains("card")) {
                            setMessage(lastModule)((_b = element.getAttribute("message")) !== null && _b !== void 0 ? _b : "");
                        }
                        else {
                            setMessage(lastModule)();
                        }
                    }
                }
                lastModule = container;
            }
            if (last !== element) {
                if (last) {
                    if (!element.classList.contains("card") ||
                        container.querySelectorAll("label.card.active").length >
                            0) {
                        if (last.classList.contains("card")) {
                            last.click();
                        }
                        else if (last.classList.contains("parcel")) {
                            last.classList.remove("active");
                        }
                    }
                }
                last = element;
            }
            if (checkbox.checked) {
                if (element.classList.contains("card")) {
                    container.getElementsByTagName("input")[0].click();
                    container.getElementsByTagName("input")[0].checked = true;
                    container.classList.add("active");
                    element.classList.add("active");
                    (_c = element.parentElement) === null || _c === void 0 ? void 0 : _c.classList.add("hide");
                    var parcelsContainer = container.getElementsByClassName("method")[0];
                    var html = parseConfiguration((_d = container.getAttribute("data")) !== null && _d !== void 0 ? _d : "{}")((_e = element.getAttribute("parcels")) !== null && _e !== void 0 ? _e : "{}");
                    if (parcelsContainer.innerHTML !== html) {
                        parcelsContainer.innerHTML = html;
                    }
                    setupElements((parcelsContainer.querySelectorAll("label.parcel")));
                    setMessage(container)();
                    toggleParcels(element)(true);
                }
                else if (element.classList.contains("parcel")) {
                    element.classList.add("active");
                    setMessage(((_h = (_g = (_f = element.parentElement) === null || _f === void 0 ? void 0 : _f.parentElement) === null || _g === void 0 ? void 0 : _g.parentElement) === null || _h === void 0 ? void 0 : _h.parentElement))((_j = element.getAttribute("message")) !== null && _j !== void 0 ? _j : "");
                }
            }
            else {
                element.classList.remove("active");
                checkbox.checked = false;
                if (element.classList.contains("card")) {
                    (_k = element.parentElement) === null || _k === void 0 ? void 0 : _k.classList.remove("hide");
                    container.getElementsByTagName("input")[0].checked = false;
                    toggleParcels(element)(false);
                    (_m = (_l = element.parentElement) === null || _l === void 0 ? void 0 : _l.parentElement) === null || _m === void 0 ? void 0 : _m.classList.remove("active");
                }
            }
        });
    };
    var last;
    for (var i = 0; i < elements.length; i++) {
        _loop_1();
    }
};
document.addEventListener("DOMContentLoaded", function () {
    var modules = (document.querySelectorAll("div.module"));
    setupElements(modules);
    modules.forEach(function (module) {
        setupElements(module.querySelectorAll("label.card"));
    });
});
var div = document.getElementsByClassName("form")[0];
if (window.location.href.indexOf("?") !== -1) {
    div.innerHTML = window.location.href
        .replace(/.*\?/, "")
        .split("&")
        .join("<br>");
}
