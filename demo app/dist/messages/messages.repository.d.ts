export declare class MessagesRepository {
    findOne(id: string): Promise<any>;
    findAll(): Promise<any>;
    create(message: string): Promise<void>;
}
