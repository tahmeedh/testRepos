import { formatNumber, isValidPhoneNumber } from 'libphonenumber-js';

export class PhoneNumberUtils {
    static _randomInt(min: number, max: number) {
        // The maximum is inclusive and the minimum is inclusive
        const randInt = Math.floor(Math.random() * (max - min + 1)) + min;
        return String(randInt);
    }

    static randomPhoneNumber() {
        let phoneNumber = '';
        // Keep generating phone number if phone number is not valid
        while (!this.isPhoneNumberValid(phoneNumber)) {
            const countryCode = '+1';
            const prefix = this._randomInt(2, 9) + this._randomInt(0, 9) + this._randomInt(0, 9);
            const mid = this._randomInt(2, 9) + this._randomInt(0, 9) + this._randomInt(0, 9);
            const end =
                this._randomInt(0, 9) + this._randomInt(0, 9) + this._randomInt(0, 9) + this._randomInt(0, 9);

            phoneNumber = `${countryCode}${prefix}${mid}${end}`;
            phoneNumber = this.formatToE164(phoneNumber);
        }
        return phoneNumber;
    }

    static formatToE164(input: string) {
        return formatNumber(input, 'E.164');
    }

    static isPhoneNumberValid(input: string) {
        return isValidPhoneNumber(input);
    }
}
