// eslint-disable-next-line no-unused-vars
interface Parcels {
    credit: { [key: string]: number; };
    debit: { [key: string]: number; };
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
interface Text {
    singular: buttonText;
    plural: buttonText;
    global: globalTitles;
}
interface Currency {
    before: string;
    after: string;
}
interface Constants {
    currency: Currency;
    text: Text;
}
// eslint-disable-next-line no-unused-vars
interface PaymentConfiguration {
    constants: Constants;
}
