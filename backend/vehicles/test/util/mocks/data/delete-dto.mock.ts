import { DeleteDto } from 'src/modules/common/dto/response/delete.dto';

const SUCCESS1 = ['1'];
const FAILURE1: string[] = [];

const SUCCESS2 = ['2'];

const SUCCESS3: string[] = [];
const FAILURE3 = ['3'];

export const deleteDtoMock: DeleteDto = {
  success: SUCCESS1,
  failure: FAILURE1,
};

export const deleteDtoMock2: DeleteDto = {
  success: SUCCESS2,
  failure: FAILURE1,
};

export const deleteDtoMock3: DeleteDto = {
  success: SUCCESS3,
  failure: FAILURE3,
};
