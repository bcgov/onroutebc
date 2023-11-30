import { Test, TestingModule } from '@nestjs/testing';
import { TpsPermitService } from './tps-permit.service';

describe('TpsPermitService', () => {
  let service: TpsPermitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TpsPermitService],
    }).compile();

    service = module.get<TpsPermitService>(TpsPermitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
