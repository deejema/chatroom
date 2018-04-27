import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { ChatLine } from '../chatline';


@Component({
  selector: 'app-chat-log',
  templateUrl: './chat-log.component.html',
  styleUrls: ['./chat-log.component.css']
})
export class ChatLogComponent implements OnInit {
	chatLog: ChatLine[];
	//chatLog: string[]; // string ver
	constructor(private chatService: ChatService) { }

	ngOnInit() {
		this.getLog();
	}
	
	/*getLog(): void { // string ver
		this.chatLog = this.chatService.getLog();
			//.subscribe(chatLog => this.chatLog = chatLog); //subscribe passes array to callback and sets the heroes property
	}*/	
	getLog(): void {
		this.chatService.getLog().subscribe(chatLog => this.chatLog = chatLog); //subscribe passes array to callback and sets the heroes property
	}

}
