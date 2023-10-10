export class PhoneNumberUtils {
    static _randomInt(min: number, max: number) {
        // The maximum is inclusive and the minimum is inclusive
        const randInt = Math.floor(Math.random() * (max - min + 1)) + min;
        return String(randInt);
    }

    static randomPhone() {
        const prefix = this._randomInt(2, 9) + this._randomInt(0, 9) + this._randomInt(0, 9);
        const mid = this._randomInt(2, 9) + this._randomInt(0, 9) + this._randomInt(0, 9);
        const end =
            this._randomInt(0, 9) + this._randomInt(0, 9) + this._randomInt(0, 9) + this._randomInt(0, 9);

        return prefix + mid + end;
    }
}
