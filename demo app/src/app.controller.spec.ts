import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages/messages.controller';
import { MessagesService } from './messages/messages.service';

describe('AppController', () => {
  let appController: MessagesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [MessagesService],
    }).compile();

    appController = app.get<MessagesController>(MessagesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
