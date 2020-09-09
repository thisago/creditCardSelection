/* eslint-disable no-undef */
const setup = (elements: NodeListOf<HTMLLabelElement> | NodeListOf<HTMLDivElement>) => {
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

    const toggleParcels = (element: HTMLElement) => (hide = false) => {
        const parcelsContainer = <HTMLDivElement>element.parentElement?.parentElement?.getElementsByClassName (`method`)[0];
        if (parcelsContainer) {
            parcelsContainer.classList[hide ? `add` : `remove`] (`hidden`);
        } else {
            console.error (`Not exist parcels container of: ${element}`);
        }
    };

    let last: HTMLLabelElement | null = null;
    // const lastModule: HTMLDivElement | null = null;

    for (var i = 0; i < elements.length; i++) {
        const element = elements[i];
        const checkbox = element.getElementsByTagName (`input`)[0];

        checkbox.addEventListener (`change`, () => {
            if (last !== element) {
                if (last) {
                    last.getElementsByTagName (`input`)[0].checked = false;
                    last.classList.remove (`active`);
                    if (element.classList.contains (`card`)) {
                        toggleParcels (last) (true);
                        last.parentElement?.classList.remove (`hide`);
                        // cleanParcels (element);
                    }
                }
                if (!element.classList.contains (`module`)) {
                    last = <HTMLLabelElement>element;
                } else {
                    last = null;
                }
            }
            // if (element.classList.contains (`module`) &&
            //     lastModule !== element) {
            //     if (lastModule) {
            //         cleanParcels (lastModule);
            //         toggleParcels (lastModule) (true);
            //     }

            //     lastModule = <HTMLDivElement>element;
            // }
            if (checkbox.checked) {
                if (element.classList.contains (`module`)) {
                } else if (element.classList.contains (`card`)) {
                    const container = <HTMLLabelElement>element.parentElement?.parentElement;
                    container.getElementsByTagName (`input`)[0].click ();
                    container.getElementsByTagName (`input`)[0].checked = true;

                    container.classList.add (`active`);
                    element.classList.add (`active`);

                    element.parentElement?.classList.add (`hide`);

                    toggleParcels (element) (false);
                } else if (element.classList.contains (`parcel`)) {
                    element.classList.add (`active`);
                }
            } else {
                element.classList.remove (`active`);
                checkbox.checked = false;
                if (element.classList.contains (`card`)) {
                    element.parentElement?.classList.remove (`hide`);
                    toggleParcels (element) (true);
                }
            }
        });
    }
};

setup (document.querySelectorAll (`div.module`));
setup (document.querySelectorAll (`label.card`));
setup (document.querySelectorAll (`label.parcel`));
