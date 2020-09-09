"use strict";
/* eslint-disable no-undef */
var setup = function (elements) {
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
    var hideParcels = function (element) {
        var _a, _b;
        var parcelsContainer = (_b = (_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.getElementsByClassName("method")[0];
        if (parcelsContainer) {
            parcelsContainer.classList.remove("hidden");
        }
        else {
            console.error("Not exist parcels container of: " + element);
        }
    };
    var last = null;
    var _loop_1 = function () {
        var element = elements[i];
        var checkbox = element.getElementsByTagName("input")[0];
        checkbox.addEventListener("change", function () {
            var _a, _b, _c, _d;
            if (last !== element) {
                if (last) {
                    last.classList.remove("active");
                    if (element.classList.contains("card")) {
                        (_a = last.parentElement) === null || _a === void 0 ? void 0 : _a.classList.remove("hide");
                    }
                }
                if (!element.classList.contains("module")) {
                    last = element;
                }
                else {
                    last = null;
                }
            }
            if (checkbox.checked) {
                if (element.classList.contains("module")) {
                    // cleanParcels (element);
                    hideParcels(element);
                    for (var i_2 = 0; i_2 < elements.length; i_2++) {
                        elements[i_2].getElementsByTagName("input")[0].checked = false;
                        elements[i_2].classList.remove("active");
                    }
                }
                else if (element.classList.contains("card")) {
                    var container = (_b = element.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement;
                    container.getElementsByTagName("input")[0].click();
                    container.getElementsByTagName("input")[0].checked = true;
                    container.classList.add("active");
                    element.classList.add("active");
                    (_c = element.parentElement) === null || _c === void 0 ? void 0 : _c.classList.add("hide");
                    hideParcels(container);
                }
                else if (element.classList.contains("parcel")) {
                    element.classList.add("active");
                }
            }
            else {
                element.classList.remove("active");
                (_d = element.parentElement) === null || _d === void 0 ? void 0 : _d.classList.remove("hide");
                cleanParcels(element);
            }
        });
    };
    for (var i = 0; i < elements.length; i++) {
        _loop_1();
    }
};
setup(document.querySelectorAll("label.module"));
setup(document.querySelectorAll("label.card"));
setup(document.querySelectorAll("label.parcel"));
