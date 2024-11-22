import { UserEntity } from 'src/entities/user.entity';

declare module 'express' {
  export interface Request {
    user?: UserEntity;
  }
}
