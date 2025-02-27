import { Test, TestingModule } from '@nestjs/testing';
import { AwsFilesController } from './aws-files.controller';

describe('AwsFilesController', () => {
  let controller: AwsFilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AwsFilesController],
    }).compile();

    controller = module.get<AwsFilesController>(AwsFilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
