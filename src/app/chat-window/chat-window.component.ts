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
		this.socketConnect();
	}
	socketConnect() : void {
		this.chatService.initLiveQuery();		
		this.ioConnection = this.chatService.getLiveQueryMessage().subscribe((chatLine:ChatLine) => {
			this.chatLog.push(chatLine);
		});
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
		this.chatService.getChatFromServer().subscribe((chatLog) => {
			// chatLog variable is an object that holds ChatLine[] in the 0th element
			// Output: Object { results: (#) [...] } where # is number of chatlines
			console.log("initial chatLog object"); console.log(chatLog);
			this.chatLog = new Array<ChatLine>();
			
			let array = Object.keys(chatLog).map(i=>chatLog[i]); // converts object to array
			console.log("array"); console.log(array); console.log(array[0]);
			
			array[0].forEach((ele, index) => {
				this.chatLog.push(ele); // push each element from chatLog[0]
				return index;
			});
			
			this.chatLog.push({username:"********Admin", content:"Updated from Database*********"});
			console.log("final chatlog"); console.log(this.chatLog);
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
			.subscribe((chatLine: ChatLine) => {this.chatLog.push({username:this.username, content:message}); });
			//.subscribe((chatLine: ChatLine) => {this.getLog()});
			// change so it instantly appends to end of local chat
	}
}
