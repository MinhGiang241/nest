import { CreateMessageDto } from './dtos/create-message.dto';
import { MessagesService } from './messages.service';
export declare class MessagesController {
    private messageService;
    constructor(messageService: MessagesService);
    getMessageList(): Promise<{
        message: string;
        items: Promise<any>;
    }>;
    createMessage(body: CreateMessageDto): Promise<void>;
    getMessage(id: string, d: string): Promise<any>;
}
