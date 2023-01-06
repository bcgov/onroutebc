import { Test, TestingModule } from '@nestjs/testing';
import { PowerUnitTypesController } from './power-unit-types.controller';
import { PowerUnitTypesService } from './power-unit-types.service';

describe('PowerUnitTypesController', () => {
  let controller: PowerUnitTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PowerUnitTypesController],
      providers: [PowerUnitTypesService],
    }).compile();

    controller = module.get<PowerUnitTypesController>(PowerUnitTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
