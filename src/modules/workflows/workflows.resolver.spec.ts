import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowsResolver } from './workflows.resolver';

describe('WorkflowsResolver', () => {
  let resolver: WorkflowsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkflowsResolver],
    }).compile();

    resolver = module.get<WorkflowsResolver>(WorkflowsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
