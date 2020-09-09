/* eslint-disable no-undef */
const setup = (elements: NodeListOf<HTMLLabelElement>) => {
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

    const hideParcels = (element: HTMLElement) => {
        const parcelsContainer = <HTMLDivElement>element.parentElement?.parentElement?.getElementsByClassName (`method`)[0];
        if (parcelsContainer) {
            parcelsContainer.classList.remove (`hidden`);
        } else {
            console.error (`Not exist parcels container of: ${element}`);
        }
    };

    let last: HTMLLabelElement | null = null;
    for (var i = 0; i < elements.length; i++) {
        const element = elements[i];
        const checkbox = element.getElementsByTagName (`input`)[0];

        checkbox.addEventListener (`change`, function () {
            if (last !== element) {
                if (last) {
                    last.classList.remove (`active`);
                    if (element.classList.contains (`card`)) {
                        last.parentElement?.classList.remove (`hide`);
                    }
                }
                if (!element.classList.contains (`module`)) {
                    last = element;
                } else {
                    last = null;
                }
            }
            if (checkbox.checked) {
                if (element.classList.contains (`module`)) {
                    // cleanParcels (element);
                    hideParcels (element);
                    for (let i = 0; i < elements.length; i++) {
                        elements[i].getElementsByTagName (`input`)[0].checked = false;
                        elements[i].classList.remove (`active`);
                    }
                } else if (element.classList.contains (`card`)) {
                    const container = <HTMLLabelElement>element.parentElement?.parentElement;
                    container.getElementsByTagName (`input`)[0].click ();
                    container.getElementsByTagName (`input`)[0].checked = true;

                    container.classList.add (`active`);
                    element.classList.add (`active`);

                    element.parentElement?.classList.add (`hide`);

                    hideParcels (container);
                } else if (element.classList.contains (`parcel`)) {
                    element.classList.add (`active`);
                }
            } else {
                element.classList.remove (`active`);
                element.parentElement?.classList.remove (`hide`);

                cleanParcels (element);
            }
        });
    }
};

setup (document.querySelectorAll (`label.module`));
setup (document.querySelectorAll (`label.card`));
setup (document.querySelectorAll (`label.parcel`));
