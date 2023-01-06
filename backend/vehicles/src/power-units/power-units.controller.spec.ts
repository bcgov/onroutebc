import { Test, TestingModule } from '@nestjs/testing';
import { PowerUnitsController } from './power-units.controller';
import { PowerUnitsService } from './power-units.service';

describe('PowerUnitsController', () => {
  let controller: PowerUnitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PowerUnitsController],
      providers: [PowerUnitsService],
    }).compile();

    controller = module.get<PowerUnitsController>(PowerUnitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
