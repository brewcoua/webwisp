import { Types } from 'mongoose';

export class MongoUtils {
  static toObjectId(id: string | Types.ObjectId) {
    return id instanceof Types.ObjectId ? id : new Types.ObjectId(id);
  }

  static fromObjectId(id: Types.ObjectId | string) {
    return id instanceof Types.ObjectId ? id.toString() : id;
  }

  static toCreatedAt(id: Types.ObjectId) {
    return id.getTimestamp();
  }
}
