import { Test, TestingModule } from '@nestjs/testing';
import { TrailerTypesService } from './trailer-types.service';

describe('TrailerTypesService', () => {
  let service: TrailerTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrailerTypesService],
    }).compile();

    service = module.get<TrailerTypesService>(TrailerTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
