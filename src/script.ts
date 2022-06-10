/// <reference path="./script.d.ts" />

var lastModule: HTMLDivElement | null = null;
const setupElements = (
    elements: NodeListOf<HTMLLabelElement> | NodeListOf<HTMLDivElement>
) => {
    const parseConfiguration = (config: string) => (parcelsStr: string) => {
        if (!config) return ``;

        const createParcelA =
            (data: PaymentConfiguration) =>
            (mode: `credit` | `debit`) =>
            (key: number) => {
                const label = document.createElement(`label`);
                const span = document.createElement(`span`);
                const radio = document.createElement(`input`);

                label.classList.add(`parcel`);

                const parcelsB = parcels[mode];

                const parcel = <Parcel | number>parcelsB[key];
                const priceA = (<Parcel>parcel).price ?? parcel;
                const price =
                    data.constants.currency.before +
                    priceA +
                    data.constants.currency.after;

                radio.type = `radio`;
                radio.name = `parcel`;
                radio.required = true;
                radio.value = `${key}_${mode}`;

                // radio.addEventListener (`invalid`, (event: Event) => {
                //     const element = <HTMLInputElement>(event.target ?? event);
                //     const container = <HTMLDivElement | null>element.parentElement?.parentElement?.parentElement?.parentElement?.parentElement;
                //     console.log (container);
                //     if (container) {
                //         setMessage (container) (data.constants.text.error.invalid);
                //     }
                // });

                label.setAttribute(`message`, (<Parcel>parcel).message ?? ``);

                if (key <= 1) {
                    var texts = data.constants.text.singular;
                } else {
                    // eslint-disable-next-line no-redeclare
                    var texts = data.constants.text.plural;
                }

                span.innerHTML =
                    texts.before + key + texts.middle + price + texts.end;
                label.appendChild(span);
                label.appendChild(radio);
                return label;
            };

        const data = <PaymentConfiguration>JSON.parse(config);
        const parcels = <Parcels>JSON.parse(parcelsStr);

        if (
            !data ||
            !parcels ||
            !data.constants ||
            !data.constants.text ||
            !data.constants.currency
        )
            return ``;

        const createParcelB = createParcelA(data);

        const createParcels = (mode: `credit` | `debit`) => {
            const createParcel = createParcelB(mode);
            const element = document.createElement(`div`);
            const span = document.createElement(`span`);

            element.classList.add(mode);

            span.innerHTML = data.constants.text.global[mode];

            element.appendChild(span);

            const parcelsElmt = document.createElement(`div`);
            parcelsElmt.classList.add(`parcels`);

            const keys = Object.keys(parcels[mode]);

            keys.forEach((key) => {
                parcelsElmt.appendChild(createParcel(parseInt(key)));
            });

            element.appendChild(parcelsElmt);

            return element.outerHTML;
        };

        let html = ``;

        if (parcels.debit) {
            html += createParcels(`debit`);
        }
        if (parcels.credit) {
            html += createParcels(`credit`);
        }

        return html;
    };

    const toggleParcels =
        (element: HTMLElement) =>
        (show = true) => {
            const parcelsContainer = <HTMLDivElement>(
                element.parentElement?.parentElement?.getElementsByClassName(
                    `method`
                )[0]
            );
            if (parcelsContainer) {
                parcelsContainer.classList[show ? `remove` : `add`](`hidden`);
            } else {
                console.error(`Not exist parcels container of: ${element}`);
            }
        };

    const getContainer = (element: HTMLElement) =>
        element.classList.contains(`card`)
            ? <HTMLDivElement>element?.parentElement?.parentElement
            : null;

    const setMessage =
        (container: HTMLDivElement) =>
        (message: string | null = null) => {
            const msgBox = <HTMLDivElement>(
                container.getElementsByClassName(`message`)[0]
            );
            if (message) {
                msgBox.innerHTML = message ?? ``;
                msgBox.classList.remove(`hide`);
                container.scrollIntoView();
            } else {
                msgBox.classList.add(`hide`);
            }
        };

    for (var i = 0; i < elements.length; i++) {
        const element = elements[i];
        const checkbox = element.getElementsByTagName(`input`)[0];
        const container = <HTMLDivElement>getContainer(element);

        if (element.classList.contains(`card`)) {
            element.setAttribute(
                `parcels`,
                element.getAttribute(`data-parcels`) ?? `{}`
            );
            setTimeout(() => {
                element.removeAttribute(`data-parcels`);
            }, 0);
        } else if (element.classList.contains(`module`)) {
            element.setAttribute(
                `data`,
                element.getAttribute(`data-configuration`) ?? `{}`
            );
            setTimeout(() => {
                element.removeAttribute(`data-configuration`);
            }, 0);
            element.id = `module_${i + 1}`;
            continue;
        }
        var last: HTMLLabelElement | null = null;

        checkbox.addEventListener(`change`, () => {
            if (
                lastModule !== container &&
                element.classList.contains(`card`)
            ) {
                if (lastModule) {
                    if (container.id !== lastModule.id) {
                        lastModule.getElementsByTagName(`input`)[0].checked =
                            false;
                        lastModule.classList.remove(`active`);

                        const lastModuleCard =
                            lastModule.querySelector(`label.card.active`);
                        if (lastModuleCard) {
                            lastModuleCard.getElementsByTagName(
                                `input`
                            )[0].checked = false;
                            lastModuleCard.classList.remove(`active`);
                            lastModuleCard.parentElement?.classList.remove(
                                `hide`
                            );
                        }

                        toggleParcels(
                            <HTMLLabelElement>(
                                lastModule.getElementsByClassName(`card`)[0]
                            )
                        )(false);
                        if (element.classList.contains(`card`)) {
                            setMessage(lastModule)(
                                element.getAttribute(`message`) ?? ``
                            );
                        } else {
                            setMessage(lastModule)();
                        }
                    }
                }

                lastModule = container;
            }
            if (last !== element) {
                if (last) {
                    if (
                        !element.classList.contains(`card`) ||
                        container.querySelectorAll(`label.card.active`).length >
                            0
                    ) {
                        if (last.classList.contains(`card`)) {
                            last.click();
                        } else if (last.classList.contains(`parcel`)) {
                            last.classList.remove(`active`);
                        }
                    }
                }
                last = <HTMLLabelElement>element;
            }

            if (checkbox.checked) {
                if (element.classList.contains(`card`)) {
                    container.getElementsByTagName(`input`)[0].click();
                    container.getElementsByTagName(`input`)[0].checked = true;

                    container.classList.add(`active`);
                    element.classList.add(`active`);

                    element.parentElement?.classList.add(`hide`);

                    const parcelsContainer =
                        container.getElementsByClassName(`method`)[0];
                    const html = parseConfiguration(
                        container.getAttribute(`data`) ?? `{}`
                    )(element.getAttribute(`parcels`) ?? `{}`);

                    if (parcelsContainer.innerHTML !== html) {
                        parcelsContainer.innerHTML = html;
                    }

                    setupElements(
                        <NodeListOf<HTMLLabelElement>>(
                            parcelsContainer.querySelectorAll(`label.parcel`)
                        )
                    );

                    setMessage(container)();
                    toggleParcels(element)(true);
                } else if (element.classList.contains(`parcel`)) {
                    element.classList.add(`active`);

                    setMessage(
                        <HTMLDivElement>(
                            element.parentElement?.parentElement?.parentElement
                                ?.parentElement
                        )
                    )(element.getAttribute(`message`) ?? ``);
                }
            } else {
                element.classList.remove(`active`);
                checkbox.checked = false;
                if (element.classList.contains(`card`)) {
                    element.parentElement?.classList.remove(`hide`);
                    container.getElementsByTagName(`input`)[0].checked = false;
                    toggleParcels(element)(false);

                    element.parentElement?.parentElement?.classList.remove(
                        `active`
                    );
                }
            }
        });
    }
};

document.addEventListener(`DOMContentLoaded`, () => {
    const modules = <NodeListOf<HTMLDivElement>>(
        document.querySelectorAll(`div.module`)
    );
    setupElements(modules);
    modules.forEach((module) => {
        setupElements(
            <NodeListOf<HTMLLabelElement>>module.querySelectorAll(`label.card`)
        );
    });
});

const div = document.getElementsByClassName(`form`)[0];
if (window.location.href.indexOf(`?`) !== -1) {
    div.innerHTML = window.location.href
        .replace(/.*\?/, ``)
        .split(`&`)
        .join(`<br>`);
}
