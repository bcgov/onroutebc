import { BaseDto } from '../../../../src/modules/common/dto/base.dto';
import { Base } from '../../../../src/modules/common/entities/base.entity';

const CURRENT_DATE = new Date();
const CURRENT_DATE_ISO_STRING = CURRENT_DATE.toISOString();
const CREATED_USER = 'USER';
const CREATED_DATE_TIME = CURRENT_DATE;
const UPDATED_USER = 'USER';
const UPDATED_DATE_TIME = CURRENT_DATE;

export const baseEntityMock: Base = {
  createdUser: CREATED_USER,
  createdUserDirectory: CREATED_USER,
  createdUserGuid: CREATED_USER,
  createdDateTime: CREATED_DATE_TIME,
  updatedUser: UPDATED_USER,
  upatedUserGuid: UPDATED_USER,
  updatedUserDirectory: UPDATED_USER,
  updatedDateTime: UPDATED_DATE_TIME,
};

export const baseDtoMock: BaseDto = {
  createdUser: CREATED_USER,
  createdUserDirectory: CREATED_USER,
  createdUserGuid: CREATED_USER,
  createdDateTime: CURRENT_DATE_ISO_STRING,
  updatedUser: UPDATED_USER,
  upatedUserGuid: UPDATED_USER,
  updatedUserDirectory: UPDATED_USER,
  updatedDateTime: CURRENT_DATE_ISO_STRING,
};
