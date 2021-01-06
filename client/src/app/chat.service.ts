import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ChatMessage {
  from: string
  message: string
  timestamp: string
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private sock: WebSocket = null;

  event = new Subject<ChatMessage>()

  constructor() {}

  sendMessage(msg) {
    this.sock.send(msg)
  }
  
  join(name: string) {
    const params = new HttpParams().set('name', name);
    const url = `ws://localhost:3000/chat?${params.toString()}`;
    console.log(url);
    this.sock = new WebSocket(
      `ws://localhost:3000/chat?${params.toString()}`
    );
    console.log('this.sock', this.sock);
    // handle incoming message
    this.sock.onmessage = (payload: MessageEvent) => {
      // sent msg resides in .data
      // parse the string to ChatMessage
      const chat = JSON.parse(payload.data) as ChatMessage
      this.event.next(chat)
    }
    // handle accidental sock error
    this.sock.onclose = ((err) => {
      if (this.sock != null) {
        this.sock.close();
        this.sock = null;
      }
      console.log('err', err);
    }).bind(this);
  }

  leave() {
    if (this.sock != null) {
      this.sock.close();
      this.sock = null;
    }
  }
}
