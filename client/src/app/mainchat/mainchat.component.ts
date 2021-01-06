import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatMessage, ChatService } from '../chat.service';

@Component({
  selector: 'app-mainchat',
  templateUrl: './mainchat.component.html',
  styleUrls: ['./mainchat.component.css'],
})
export class MainchatComponent implements OnInit, OnDestroy {
  text = 'Join';
  form: FormGroup;

  messages: ChatMessage[] = [];
  event$: Subscription;

  constructor(
    private http: HttpClient,
    private chatSvc: ChatService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: this.fb.control(''),
      message: this.fb.control(''),
    });
  }

  ngOnDestroy(): void {
    // check if we are connected before unsubscribing
    if (null != this.event$) {
      this.event$.unsubscribe();
      this.event$ = null;
    }
  }

  toggleConnection() {
    if (this.text == 'Join') {
      this.text = 'Leave';
      const name = this.form.get('username').value;
      this.chatSvc.join(name);
      // subscribe to onmessage
      this.event$ = this.chatSvc.event.subscribe((chat) => {
        this.messages.unshift(chat);
      });
      console.log('my name: ', name);
    } else {
      this.text = 'Join';
      this.chatSvc.leave();
      this.event$.unsubscribe();
      this.event$ = null;
    }
  }

  sendMessage() {
    const message = this.form.get('message').value;
    this.form.get('message').reset();
    console.log('message: ', message);
    this.chatSvc.sendMessage(message)
  }
}
