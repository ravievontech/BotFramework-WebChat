export interface Strings {
    title: string;
    send: string;
    unknownFile: string;
    unknownCard: string;
    receiptTax: string;
    receiptTotal: string;
    messageRetry: string;
    messageFailed: string;
    messageSending: string;
    timeSent: string;
    consolePlaceholder: string;
}
export declare const defaultStrings: Strings;
export declare const strings: (locale: string) => Strings;
