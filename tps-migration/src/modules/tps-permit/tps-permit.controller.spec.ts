import { Test, TestingModule } from '@nestjs/testing';
import { TpsPermitController } from './tps-permit.controller';

describe('TpsPermitController', () => {
  let controller: TpsPermitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TpsPermitController],
    }).compile();

    controller = module.get<TpsPermitController>(TpsPermitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
