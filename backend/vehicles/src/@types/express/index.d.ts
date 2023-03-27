import { UserDetailsDto } from 'src/modules/common/dto/response/user-details.dto';

declare global {
  namespace Express {
    interface Request {
      userDetails: UserDetailsDto;
    }
  }
}
