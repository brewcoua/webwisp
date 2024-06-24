import { isEmail } from 'class-validator'
import { ValidationOptions } from '@configs/app.const'

export class Guard {
    static isEmpty(value: unknown): boolean {
        if (typeof value === 'number' || typeof value === 'boolean') {
            return false
        }
        if (typeof value === 'undefined' || value === null) {
            return true
        }
        if (value instanceof Date) {
            return false
        }
        if (value instanceof Object && !Object.keys(value as object).length) {
            return true
        }
        if (Array.isArray(value)) {
            if (value.length === 0) {
                return true
            }
            if (value.every((item) => Guard.isEmpty(item))) {
                return true
            }
        }

        return value === ''
    }

    static lengthIsBetween(
        value: number | string | Array<unknown>,
        min: number,
        max: number
    ): boolean {
        if (Guard.isEmpty(value)) {
            throw new Error(
                'Cannot check length of a value. Provided value is empty'
            )
        }
        const valueLength =
            typeof value === 'number'
                ? Number(value).toString().length
                : value.length
        if (valueLength >= min && valueLength <= max) {
            return true
        }
        return false
    }

    static isEmail(value: unknown): boolean {
        return isEmail(value)
    }

    static isUsername(value: unknown): boolean {
        return (
            typeof value === 'string' &&
            this.lengthIsBetween(
                value,
                ValidationOptions.username.minLength || 0,
                ValidationOptions.username.maxLength || 0
            ) &&
            ValidationOptions.username.match?.test(value) === true
        )
    }

    static isPassword(value: unknown): boolean {
        return (
            typeof value === 'string' &&
            this.lengthIsBetween(
                value,
                ValidationOptions.password.minLength || 0,
                ValidationOptions.password.maxLength || 0
            )
        )
    }

    static isEnum(value: unknown, enumType: object): boolean {
        return Object.values(enumType).includes(value)
    }

    static isHash(value: unknown): boolean {
        return typeof value === 'string' && /^\$2[ayb]\$.{56}$/.test(value)
    }

    static each(
        value: unknown,
        validator: (value: unknown) => boolean
    ): boolean {
        if (Guard.isEmpty(value)) {
            throw new Error(
                'Cannot check each item of a value. Provided value is empty'
            )
        }
        if (Array.isArray(value)) {
            return value.every((item) => validator(item))
        }
        return false
    }
}
