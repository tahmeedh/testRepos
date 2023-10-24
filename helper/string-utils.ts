import parsePhoneNumber from 'libphonenumber-js';
import {
    PASSWORD_MINIMUM_LENGTH,
    PASSWORD_MINIMUM_UPPER_CASE,
    PASSWORD_MINIMUM_LOWER_CASE,
    PASSWORD_MINIMUM_NUMERIC,
    PASSWORD_MINIMUM_SPECIAL
} from 'constants/password';

export class StringUtils {
    static getAreaCode() {
        return ['604', '778'];
    }

    static generateString(min = 2, max = 15) {
        return (
            Math.random().toString(36).substring(min, max) + Math.random().toString(36).substring(min, max)
        );
    }

    static generatePassword(
        len = PASSWORD_MINIMUM_LENGTH,
        minUpper = PASSWORD_MINIMUM_UPPER_CASE,
        minLower = PASSWORD_MINIMUM_LOWER_CASE,
        minNumber = PASSWORD_MINIMUM_NUMERIC,
        minSpecial = PASSWORD_MINIMUM_SPECIAL
    ) {
        const chars = String.fromCharCode(...Array(127).keys()).slice(33); // chars
        const upperCase = String.fromCharCode(...Array(91).keys()).slice(65); // A-Z
        const lowerCase = String.fromCharCode(...Array(123).keys()).slice(97); // a-z
        const numbers = String.fromCharCode(...Array(58).keys()).slice(48); // 0-9
        const specials = chars.replace(/\w/g, '');
        const minRequired = minSpecial + minUpper + minLower + minNumber;
        const generatedPassword = [].concat(
            Array.from(
                { length: minSpecial || 0 },
                () => specials[Math.floor(Math.random() * specials.length)]
            ),
            Array.from(
                { length: minUpper || 0 },
                () => upperCase[Math.floor(Math.random() * upperCase.length)]
            ),
            Array.from(
                { length: minLower || 0 },
                () => lowerCase[Math.floor(Math.random() * lowerCase.length)]
            ),
            Array.from({ length: minNumber || 0 }, () => numbers[Math.floor(Math.random() * numbers.length)]),
            Array.from(
                { length: Math.max(len, minRequired) - (minRequired || 0) },
                () => chars[Math.floor(Math.random() * chars.length)]
            )
        );
        return generatedPassword.sort(() => Math.random()).join(''); // eslint-disable-line
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

    /**
     * Checks whether the phone number has an extension or not.
     * @param {String} phoneNumber Phone number of the contact
     * @returns {Boolean} true if it has an extension, otherwise, false.
     */
    static isPhoneNumberExtension(phoneNumber) {
        if (phoneNumber.includes(',')) {
            return true;
        }
        return false;
    }
}
