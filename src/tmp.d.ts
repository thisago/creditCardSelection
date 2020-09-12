const setup = (module: HTMLDivElement) => {
    const parseConfiguration = (config: string) => {
        if (!config) return ``;

        const createParcelA = (data: PaymentConfiguration) => (mode: `credit` | `debit`) => (key: string) => {
            const label = document.createElement (`label`);
            const span = document.createElement (`span`);
            const radio = document.createElement (`input`);

            label.classList.add (`parcel`);

            const parcels = data.parcels[mode];
            const priceA = parcels[key];
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

        if (!data || !data.parcels || !data.constants || !data.constants.text || !data.constants.currency) return ``;

        const createParcelB = createParcelA (data);

        const createParcels = (mode: `credit` | `debit`) => {
            const createParcel = createParcelB (mode);
            const element = document.createElement (`div`);
            const span = document.createElement (`span`);

            element.classList.add (mode);
            console.log (data.constants.text);

            span.innerHTML = data.constants.text.global[mode];

            element.appendChild (span);

            const parcels = document.createElement (`div`);
            parcels.classList.add (`parcels`);

            const keys = Object.keys (data.parcels[mode]);
            keys.forEach (key => {
                parcels.appendChild (createParcel (key));
            });

            element.appendChild (parcels);

            return element.outerHTML;
        };

        let html = ``;

        if (data.parcels.credit) {
            html += createParcels (`credit`);
        }
        if (data.parcels.debit) {
            html += createParcels (`debit`);
        }

        return html;
    };

    const method = module.getElementsByClassName (`method`)[0];
    const v = parseConfiguration (module.getAttribute (`data-configuration`) ?? `{}`);
    console.log (v);

    method.innerHTML = v;
    module.removeAttribute (`data-configuration`);

    setupElements (<NodeListOf<HTMLLabelElement>>module.querySelectorAll (`label.parcel`));
};
