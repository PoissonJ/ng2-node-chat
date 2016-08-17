import { Component, OnInit, OnDestroy,
  Input, trigger, state, style, transition, animate } from '@angular/core';
import { Control }           from '@angular/common';
import { ChatService }       from './services/chat.service';

declare var $: JQueryStatic;

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: './chat.html',
  styleUrls: ['./chat.css'],
  providers: [ChatService],
  animations: [
    trigger('slide', [
      state('inactive', style({
        transform: 'translateY(90%)',
        'min-height': '400px'
      })),
      state('active', style({
        transform: 'translateY(0%)'
      })),
      transition('inactive => active', [
        animate('100ms linear', style({ transform: 'translateY(90%)' }))
      ]),
      transition('active => inactive', [
        animate('100ms linear', style({ transform: 'translateY(0%)' }))
      ])
    ])
  ]
})
export class ChatComponent implements OnInit, OnDestroy {
  messages = [];
  connection;
  message: string;
  username: string;
  state: string = 'inactive'

  constructor(private chatService: ChatService) { }

  toggleOpen() {
    if (this.state === 'active') {
      this.state = 'inactive';
    } else {
      this.state = 'active';
    }
    console.log(this.state);
  }
  setUsername(user) {
    this.username = user;
  }

  sendMessage() {
    console.log(this.message);
    this.chatService.sendMessage(this.message, this.username);
    this.message = '';
  }

  ngOnInit() {
    this.connection = this.chatService.getMessages().subscribe(message => {
      document.getElementById('msg_container_base').scrollTop = 0;
      this.messages.push(message);
      console.log(message);
    })
  }


  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
