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
	ioConnection: any;
	constructor(private chatService: ChatService) { }

	ngOnInit() {
		this.getLog();
		this.getUsername();
		//this.initSocketConnection();
	}
	initSocketConnection() : void {
		this.chatService.initSocket();
		
		// Used by socket to see if other users have emitted a broadcast and will update the chatlog
		this.ioConnection = this.chatService.getMessage().subscribe((chatLine:ChatLine) => {
			this.chatLog.push(chatLine);
		});
	}
	
	/*	Gets the entire chat from the server.  Should only be called once	*/
	getLog(): void {
		this.chatService.getChatFromServer().subscribe(chatLog => {
			this.chatLog = chatLog;
			console.log(chatLog);
		});
		//subscribe passes array to callback and sets the heroes property
	}
	
	getUsername(): void {
		this.username = this.chatService.getUsername();
	}
	/*  Sends a message to the server  */
	add(message: string): void {
		if(!this.username || !message) {return;}
		/*	Name and Message should be sent to the chatService to be processed	*/
		this.chatService.addMessage(this.username, message)
			/*	Message should locally be added to current chatLog*/
			.subscribe((chatLine: ChatLine) => {this.chatLog.push({username:this.username, content:message}); console.log(chatLine.username + " " + chatLine.content);});
			//.subscribe((chatLine: ChatLine) => {this.getLog()});
			// change so it instantly appends to end of local chat
	}
}
