// eslint-disable-next-line no-unused-vars
interface Parcel {
    price: number;
    message: string;
}
// eslint-disable-next-line no-unused-vars
type Parcels = {
    credit: { [key: number]: Parcel | number };
    debit: { [key: number]: Parcel | number };
}

interface buttonText {
    before: string;
    middle: string;
    end: string;
}
interface globalTitles {
    debit: string;
    credit: string;
}
interface textError {
    invalid: string;
}
interface constText {
    singular: buttonText;
    plural: buttonText;
    global: globalTitles;
    error: textError
}
interface Currency {
    before: string;
    after: string;
}
interface Constants {
    currency: Currency;
    text: constText;
}
// eslint-disable-next-line no-unused-vars
interface PaymentConfiguration {
    constants: Constants;
}
