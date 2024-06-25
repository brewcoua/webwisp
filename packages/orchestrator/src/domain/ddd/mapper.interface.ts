import Entity from './entity.base'

export interface Mapper<
    DomainEntity extends Entity<any>,
    DbRecord,
    Response = any,
> {
    toPersistence(entity: DomainEntity): DbRecord
    toDomain(record: any): DomainEntity
    toResponse(entity: DomainEntity): Response
}

export interface HalfMapper<DomainEntity extends Entity<any>, Response = any> {
    toResponse(entity: DomainEntity): Response
}
