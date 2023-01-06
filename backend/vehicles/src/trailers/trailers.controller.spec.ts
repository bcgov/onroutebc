import { Test, TestingModule } from '@nestjs/testing';
import { TrailersController } from './trailers.controller';
import { TrailersService } from './trailers.service';

describe('TrailersController', () => {
  let controller: TrailersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrailersController],
      providers: [TrailersService],
    }).compile();

    controller = module.get<TrailersController>(TrailersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
