import { Guard } from '@domain/guard'
import { MongoUtils, convertPropsToObject } from '@domain/utils'

import { Types } from 'mongoose'

export type AggregateID = string
export namespace AggregateID {
    export function create(): AggregateID {
        return MongoUtils.fromObjectId(new Types.ObjectId())
    }
}

export interface BaseEntityProps {
    id: AggregateID
    createdAt: Date
    updatedAt: Date
}

export interface CreateEntityProps<T> {
    id: AggregateID
    createdAt?: Date
    updatedAt?: Date
    props: T
}

export default abstract class Entity<EntityProps> {
    protected readonly _id: AggregateID
    private readonly _createdAt: Date
    private readonly _updatedAt: Date
    protected readonly props: EntityProps

    constructor({
        id,
        createdAt,
        updatedAt,
        props,
    }: CreateEntityProps<EntityProps>) {
        this._id = id
        this.validateProps(props)
        const now = new Date()
        this._createdAt = createdAt || now
        this._updatedAt = updatedAt || now
        this.props = props
        this.validate()
    }

    get id(): AggregateID {
        return this._id
    }

    get createdAt(): Date {
        return this._createdAt
    }

    get updatedAt(): Date {
        return this._updatedAt
    }

    static isEntity(entity: unknown): entity is Entity<unknown> {
        return entity instanceof Entity
    }

    public equals(object?: Entity<EntityProps>): boolean {
        if (object == null || object == undefined) {
            return false
        }

        if (this === object) {
            return true
        }

        if (!Entity.isEntity(object)) {
            return false
        }

        return this.id ? this.id === object.id : false
    }

    public getProps(): Readonly<EntityProps & BaseEntityProps> {
        const copy = {
            id: this._id,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
            ...this.props,
        }
        return Object.freeze(copy)
    }

    public deleteProp(key: keyof EntityProps): void {
        delete this.props[key]
    }

    public toObject(): Readonly<unknown> {
        const plainProps = convertPropsToObject(this.props)

        const result = {
            id: this._id,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
            ...plainProps,
        }
        return Object.freeze(result)
    }

    public abstract validate(): void

    private validateProps(props: EntityProps): void {
        const MAX_PROPS = 50

        if (Guard.isEmpty(props)) {
            throw new Error('Entity props cannot be empty')
        }
        if (typeof props !== 'object') {
            throw new Error('Entity props must be an object')
        }
        if (Object.keys(props as any).length > MAX_PROPS) {
            throw new Error(
                `Entity props cannot have more than ${MAX_PROPS} keys`
            )
        }
    }
}
