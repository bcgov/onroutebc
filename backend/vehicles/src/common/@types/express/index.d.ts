import { UserModel } from 'src/modules/common/model/user.model';

declare global {
  namespace Express {
    interface Request {
      userModel: UserModel;
    }
  }
}
