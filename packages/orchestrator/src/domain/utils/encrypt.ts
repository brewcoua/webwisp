import argon2 from 'argon2'

export class Encrypt {
    static hash(plaintext: string): Promise<string> {
        return argon2.hash(plaintext)
    }

    static hashWithSalt(plaintext: string, salt: string): Promise<string> {
        return argon2.hash(plaintext, { salt })
    }

    static compare(plaintext: string, hash: string): Promise<boolean> {
        return argon2.verify(hash, plaintext)
    }
}
