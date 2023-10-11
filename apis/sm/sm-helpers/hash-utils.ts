/* eslint max-classes-per-file: 0 */

import { pbkdf2Sync, randomBytes } from 'crypto';
import { encode, decode } from 'utf8';

// A module for PBKDF2 hashing used by GAS/SM.
// ref: https://nodejs.org/api/crypto.html

class Pbkdf2 {
    iterations: number;
    derivedKeyLength: number;
    constructor() {
        this.iterations = 5001;
        this.derivedKeyLength = 32;
    }

    /**
     * Hash the password with a given salt and return the Buffer using NodeJS crypto.pbkdf2Sync
     */
    hash(password: string, salt: Buffer) {
        const passwordBytes = encode(password);
        return pbkdf2Sync(passwordBytes, salt, this.iterations, this.derivedKeyLength, 'sha256');
    }

    /**
     * Hash the password and return a utf-8 base64 string.
     */
    b64hash(password: string, salt: Buffer) {
        return decode(this.hash(password, salt).toString('base64'));
    }
}

class Pepper {
    // This maps to a 'Pepper ID' which GAS/SM use to append to the Salt
    get pid() {
        return 1;
    }

    // cached property
    get pepper() {
        const pepperBytes = [
            // eslint-disable-next-line comma-dangle
            -50, -68, -39, 9, -65, -75, 0, -73, 54, 59, -32, 73, -51, -79, -81
        ];
        return new Uint8Array(pepperBytes.map((b) => b % 256)); // Need to convert to object ?
    }
}

class Salt {
    salt: Buffer;
    constructor(numBytes) {
        this.salt = randomBytes(numBytes);
    }

    // convert the salt to a UTF-8 base64 string.
    toB64Str() {
        return decode(this.salt.toString('base64'));
    }

    addPepper(pepper) {
        const pepperBytes = pepper.pepper;
        this.salt = Buffer.concat([this.salt, pepperBytes]);
    }
}

export const hashPbkdf2 = (password: string) => {
    const salt = new Salt(16);
    const b64Salt = salt.toB64Str();
    const pepper = new Pepper();
    salt.addPepper(pepper);
    const pbkdf2 = new Pbkdf2();
    const pwHash = pbkdf2.b64hash(password, salt.salt);

    return JSON.stringify({
        hashMethod: 'PBKDF2V1',
        hashData: {
            hash: pwHash,
            salt: b64Salt,
            pid: pepper.pid
        }
    });
};
