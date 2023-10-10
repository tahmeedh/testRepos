import { randomBytes } from 'crypto';

export class UidUtils {
    static generateStringbyBytes(bytes: number) {
        const resultBytes = randomBytes(bytes);
        const resultString = resultBytes.toString('hex');
        return resultString;
    }
}
