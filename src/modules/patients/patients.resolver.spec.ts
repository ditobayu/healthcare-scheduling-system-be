import { Test, TestingModule } from '@nestjs/testing';
import { PatientsResolver } from './patients.resolver';

describe('PatientsResolver', () => {
  let resolver: PatientsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatientsResolver],
    }).compile();

    resolver = module.get<PatientsResolver>(PatientsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
