import { DeleteDto } from 'src/modules/common/dto/response/delete.dto';

const ID_1 = '1';

export const deleteDtoMock: DeleteDto = {
  success: [ID_1],
  failure: [],
};

export const deleteDtoFailureMock: DeleteDto = {
  success: [],
  failure: [ID_1],
};
