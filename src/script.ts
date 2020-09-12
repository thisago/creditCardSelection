/// <reference path="./script.d.ts" />
/* eslint-disable no-undef */

let last: HTMLLabelElement | null = null;
const setupElements = (elements: (NodeListOf<HTMLLabelElement> | NodeListOf<HTMLDivElement>)) => {
    const parseConfiguration = (config: string) => (parcelsStr: string) => {
        if (!config) return ``;

        const createParcelA = (data: PaymentConfiguration) => (mode: `credit` | `debit`) => (key: string) => {
            const label = document.createElement (`label`);
            const span = document.createElement (`span`);
            const radio = document.createElement (`input`);

            label.classList.add (`parcel`);

            const parcelsB = parcels[mode];
            const priceA = parcelsB[key];
            const price = data.constants.currency.before + priceA + data.constants.currency.after;

            radio.type = `checkbox`;
            radio.name = `parcel`;
            radio.value = `${key}_${mode}`;

            if (parseInt (key) <= 1) {
                var texts = data.constants.text.singular;
            } else {
                // eslint-disable-next-line no-redeclare
                var texts = data.constants.text.plural;
            }

            span.innerHTML = texts.before + key + texts.middle + price + texts.end;
            label.appendChild (span);
            label.appendChild (radio);
            return label;
        };

        const data = <PaymentConfiguration>JSON.parse (config);
        const parcels = <Parcels>JSON.parse (parcelsStr);

        if (!data || !parcels || !data.constants || !data.constants.text || !data.constants.currency) return ``;

        const createParcelB = createParcelA (data);

        const createParcels = (mode: `credit` | `debit`) => {
            const createParcel = createParcelB (mode);
            const element = document.createElement (`div`);
            const span = document.createElement (`span`);

            element.classList.add (mode);

            span.innerHTML = data.constants.text.global[mode];

            element.appendChild (span);

            const parcelsElmt = document.createElement (`div`);
            parcelsElmt.classList.add (`parcels`);

            const keys = Object.keys (parcels[mode]);
            keys.forEach (key => {
                parcelsElmt.appendChild (createParcel (key));
            });

            element.appendChild (parcelsElmt);

            return element.outerHTML;
        };

        let html = ``;

        if (parcels.credit) {
            html += createParcels (`credit`);
        }
        if (parcels.debit) {
            html += createParcels (`debit`);
        }

        return html;
    };
    const cleanParcels = (element: HTMLElement) => {
        if (element.classList.contains (`card`)) {
            const parcelsContainer = <HTMLDivElement>element.parentElement?.parentElement?.getElementsByClassName (`method`)[0];
            if (parcelsContainer) {
                const parcels = parcelsContainer.getElementsByClassName (`parcel`);
                for (let i = 0; i < parcels.length; i++) {
                    parcels[i].getElementsByTagName (`input`)[0].checked = false;
                    parcels[i].classList.remove (`active`);
                }
                parcelsContainer.classList.add (`hidden`);
            } else {
                console.error (`Not exist parcels container of: ${element}`);
            }
        }
    };

    const toggleParcels = (element: HTMLElement) => (show = true) => {
        const parcelsContainer = <HTMLDivElement>element.parentElement?.parentElement?.getElementsByClassName (`method`)[0];
        if (parcelsContainer) {
            parcelsContainer.classList[show ? `remove` : `add`] (`hidden`);
        } else {
            console.error (`Not exist parcels container of: ${element}`);
        }
    };

    for (var i = 0; i < elements.length; i++) {
        const element = elements[i];
        const checkbox = element.getElementsByTagName (`input`)[0];
        console.log (element.classList.contains (`module`));

        if (element.classList.contains (`card`)) {
            element.setAttribute (`parcels`, element.getAttribute (`data-parcels`) ?? `{}`);
            setTimeout (() => {
                element.removeAttribute (`data-parcels`);
            }, 0);
        } else if (element.classList.contains (`module`)) {
            element.setAttribute (`data`, element.getAttribute (`data-configuration`) ?? `{}`);
            setTimeout (() => {
                element.removeAttribute (`data-configuration`);
            }, 0);
            element.id = `module_${i + 1}`;
            continue;
        }

        checkbox.addEventListener (`change`, () => {
            if (last !== element) {
                if (last !== null) {
                    last.getElementsByTagName (`input`)[0].checked = false;
                    last.classList.remove (`active`);
                    console.log (last.parentElement?.parentElement?.id, element.parentElement?.parentElement?.id);

                    if (element.classList.contains (`card`)) {
                        if (last.parentElement?.parentElement?.id !== element.parentElement?.parentElement?.id) {
                            last.parentElement?.parentElement?.classList.remove (`active`);
                            cleanParcels (last);
                            toggleParcels (last) (false);
                        }

                        last.parentElement?.classList.remove (`hide`);
                    }
                }

                last = <HTMLLabelElement>element;
            }
            if (checkbox.checked) {
                if (element.classList.contains (`card`)) {
                    const container = <HTMLLabelElement>element.parentElement?.parentElement;
                    container.getElementsByTagName (`input`)[0].click ();
                    container.getElementsByTagName (`input`)[0].checked = true;

                    container.classList.add (`active`);
                    element.classList.add (`active`);

                    element.parentElement?.classList.add (`hide`);

                    const parcelsContainer = <HTMLDivElement>element.parentElement?.parentElement?.getElementsByClassName (`method`)[0];
                    parcelsContainer.innerHTML = parseConfiguration (container.getAttribute (`data`) ?? `{}`) (element.getAttribute (`parcels`) ?? `{}`);
                    setupElements (<NodeListOf<HTMLLabelElement>>parcelsContainer.querySelectorAll (`label.parcel`));

                    toggleParcels (element) (true);
                } else if (element.classList.contains (`parcel`)) {
                    element.classList.add (`active`);
                }
            } else {
                element.classList.remove (`active`);
                checkbox.checked = false;
                if (element.classList.contains (`card`)) {
                    element.parentElement?.classList.remove (`hide`);
                    toggleParcels (element) (false);
                    cleanParcels (element);
                    element.parentElement?.parentElement?.classList.remove (`active`);
                }
            }
        });
    }
};

document.addEventListener (`DOMContentLoaded`, () => {
    const modules = (<NodeListOf<HTMLDivElement>>document.querySelectorAll (`div.module`));
    setupElements (modules);
    modules.forEach (module => {
        // setup (module);
        setupElements (<NodeListOf<HTMLLabelElement>>module.querySelectorAll (`label.card`));
    });
});

const div = document.getElementsByClassName (`form`)[0];
if (window.location.href.indexOf (`?`) !== -1) {
    div.innerHTML = window.location.href.
        replace (/.*\?/, ``).
        split (`&`).
        join (`<br>`);
}
