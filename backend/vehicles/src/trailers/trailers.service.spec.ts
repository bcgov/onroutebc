import { Test, TestingModule } from '@nestjs/testing';
import { TrailersService } from './trailers.service';

describe('TrailersService', () => {
  let service: TrailersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrailersService],
    }).compile();

    service = module.get<TrailersService>(TrailersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
