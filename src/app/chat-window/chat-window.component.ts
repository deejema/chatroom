import { Component, OnInit } from '@angular/core';

import { ChatService } from '../chat.service';
import { ChatLine } from '../chatline';
/* CHATLOG AND ADDMESSAGE COMPONENT NOT NEEDED */
/*
	Keeps track of chatroom log and chatroom input message
*/
@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit {
	chatLog: ChatLine[];
	username: string;
	
	constructor(private chatService: ChatService) { }

	ngOnInit() {
		this.getLog();
		this.getUsername();
	}
	getLog(): void {
		this.chatService.getLog().subscribe(chatLog => this.chatLog = chatLog); 
		//subscribe passes array to callback and sets the heroes property
	}
	
	getUsername(): void {
		this.username = this.chatService.getUsername()
	}
	
	add(message: string): void {
		if(!this.username || !message) {return;}
		/*
			Name and Message should be sent to the chatService to be processed
		*/
		this.chatService.addMessage(this.username, message)
			.subscribe((chatLine: ChatLine) => {this.chatLog.push(chatLine); console.log(chatLine.username + " " + chatLine.content);});
	}
}
