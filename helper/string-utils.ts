import { randomBytes } from 'crypto';

export class StringUtils {
    generateString(min = 2, max = 15) {
        return (
            Math.random().toString(36).substring(min, max) + Math.random().toString(36).substring(min, max)
        );
    }

    static generateStringbyBytes(bytes = 8) {
        const resultBytes = randomBytes(bytes);
        const resultString = resultBytes.toString('hex');
        return resultString;
    }

    static randomInt(min: number, max: number) {
        // The maximum is inclusive and the minimum is inclusive
        const randInt = Math.floor(Math.random() * (max - min + 1)) + min;
        return String(randInt);
    }

    static randomPhone() {
        const prefix = this.randomInt(2, 9) + this.randomInt(0, 9) + this.randomInt(0, 9);
        const mid = this.randomInt(2, 9) + this.randomInt(0, 9) + this.randomInt(0, 9);
        const end = this.randomInt(0, 9) + this.randomInt(0, 9) + this.randomInt(0, 9) + this.randomInt(0, 9);

        return prefix + mid + end;
    }
}
