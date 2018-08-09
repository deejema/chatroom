import { Component, OnInit } from '@angular/core';

import { ChatService } from '../chat.service';
import { ChatLine } from '../chatline';


// Used for downloading
import {saveAs} from 'file-saver';


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
	liveQuery: any;
	private subscription;
	private Parse = require('parse');

	
	constructor(private chatService: ChatService) { }

	ngOnInit() {
		this.getLog();
		this.getUsername();
		this.socketConnect();
	}
	socketConnect() : void {
		console.log("socketconnect()");
		this.chatService.initLiveQuery();		
		this.liveQuery = this.chatService.getLiveQueryMessage().subscribe((chatLine:ChatLine) => {
			this.chatLog.push(chatLine);
		});
	}

	
	/*	Gets the entire chat from the server.  Should only be called once per refresh	*/
	getLog(): void {
		this.chatService.getChatFromServer().subscribe((chatLog) => {
			// chatLog variable is an object that holds ChatLine[] in the 0th element
			// Output: Object { results: (#) [...] } where # is number of chatlines
			
			//console.log("initial chatLog object"); console.log(chatLog);
			this.chatLog = new Array<ChatLine>();
			
			let array = Object.keys(chatLog).map(i=>chatLog[i]); // converts object to array
			//console.log("array"); console.log(array); console.log(array[0]);
			
			array[0].forEach((ele, index) => {
				this.chatLog.push(ele); // push each element from chatLog[0]
				return index;
			});
			
			this.chatLog.push({username:"********Admin", content:"Updated from Database*********"});
			//console.log("final chatlog"); console.log(this.chatLog);
		});
		//subscribe passes array to callback and sets the heroes property
	}
	
	/* Logs username to client; does not affect servers, only local client*/
	getUsername(): void {
		this.username = this.chatService.getUsername();
	}
	
	/*  Sends a message to the server  */
	add(message: string): void {
		if(!this.username || !message) {return;}
		/*	Name and Message should be sent to the chatService to be processed	*/
		this.chatService.addMessage(this.username, message)
			.subscribe((chatLine: ChatLine) => {console.log("added username and content");/*this.chatLog.push({username:this.username, content:message});*/ });
			// subscribe used for call, new line from user automatically gets added to array when subscription detects "create"
	}
	download(/*filename: string*/): void {
		var filename = 'Hi.pdf';

        this.chatService.download(filename)
        .subscribe(
            data => saveAs(data, filename),
            error => console.error(error)
);
	}
}
