import { Component, OnInit } from '@angular/core';

/* Components */
import { ChatLogComponent } from '../chat-log/chat-log.component';
import { AddMessageComponent } from '../add-message/add-message.component';

/*
	Keeps track of chatroom log and chatroom input message
*/
@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit {
	
	constructor() { }

	ngOnInit() {
	}

}
