import parsePhoneNumber from 'libphonenumber-js';

export class StringUtils {
    static getAreaCode() {
        return ['604', '778'];
    }

    static generateString(min = 2, max = 15) {
        return (
            Math.random().toString(36).substring(min, max) + Math.random().toString(36).substring(min, max)
        );
    }

    static generatePhoneNumber() {
        const areaCode = this.getAreaCode()[this._getRandomInt(2)];
        return `1${areaCode}${this._getRandomIntRange(2, 9)}${this._generateSixDigits()}`;
    }

    static _generateSixDigits() {
        return Math.floor(Math.random() * 900000) + 100000;
    }

    static _getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    static _getRandomIntRange(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    static clearPhoneNumberFormat(number) {
        return number?.replace(/[^\d,+a-zA-Z]/g, '');
    }

    /**
     * Formats phone number from XXXXXXXXXX to XXX XXX XXXX
     * https://stash.globalrelay.net/projects/PORTAL/repos/message-shared-components/browse/packages/shared/helpers/user.tsx#80
     * @param {String} contactNumber phone number to format
     * @param {String} countryISOCode country code
     * @returns
     */
    static formatPhoneNumber(contactNumber) {
        const commaIndex = contactNumber?.indexOf(',');
        const extIndex = contactNumber?.indexOf('ext');

        // format phonenumber with extension
        if (commaIndex > -1 || extIndex > -1) {
            let extensionType;
            if (commaIndex === -1) {
                extensionType = 'ext';
            } else if (extIndex === -1) {
                extensionType = ',';
            } else {
                extensionType = extIndex > commaIndex ? ',' : 'ext';
            }

            const numberArray = contactNumber.split(`${extensionType}`);
            const minPhoneNumberSize = 4;
            if (this.clearPhoneNumberFormat(numberArray[0]).length > minPhoneNumberSize) {
                numberArray[0] = this.formatPhoneNumber(numberArray[0]);
            }
            return numberArray.join(`${extensionType}`);
        }

        const cleanedPhoneNumber = this.clearPhoneNumberFormat(contactNumber);
        const parsedNumber = parsePhoneNumber(cleanedPhoneNumber, 'US');
        if (parsedNumber?.isValid()) {
            return parsedNumber.formatInternational();
        }

        return contactNumber;
    }
}
