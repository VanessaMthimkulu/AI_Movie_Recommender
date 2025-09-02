
export enum Sender {
  User = 'user',
  Bot = 'bot',
}

export interface Message {
  sender: Sender;
  text: string;
}

export interface Movie {
  title: string;
  year: number;
  description: string;
  posterPrompt: string;
}
