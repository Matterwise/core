import { Injectable } from '@nestjs/common';
import { MessagesService } from 'src/messages/messages.service';

@Injectable()
export class AiService {
  private client: any;

  constructor(private readonly messageService: MessagesService) {
    void this.initializeClient();
  }

  importDynamic = new Function('modulePath', 'return import(modulePath)');

  async initializeClient() {
    try {
      const { Client } = await this.importDynamic('@gradio/client');
      this.client = await Client.connect('ahmed13377/Sum101');
    } catch (error) {
      console.error('Error initializing AI client:', error);
    }
  }

  async getPrediction(dialogue: string): Promise<string> {
    try {
      const result = await this.client.predict('/predict', {
        Dialogue: dialogue,
      });
      return result.data;
    } catch (error) {
      console.error('Error getting prediction:', error);
      throw new Error('Failed to get prediction');
    }
  }

  async summarizeThread(
    parentMessageId: string,
    channelId: string,
  ): Promise<string> {
    const paginationOptions = { limit: 100 };
    const { messages } =
      await this.messageService.getMessagesWithCursorPagination({
        channelId,
        filterOptions: { parentMessageId },
        sortOptions: null,
        paginationOptions,
      });

    const formattedMessages = messages
      .map((message) => `${message.sender.username}: ${message.content}`)
      .join('\n');

    return this.getPrediction(formattedMessages);
  }
}
