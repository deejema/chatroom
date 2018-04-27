import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoutingModule } from './/routing.module';

/* Components */
import { ChatLogComponent } from './chat-log/chat-log.component';
import { AddMessageComponent } from './add-message/add-message.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';

import { AppComponent } from './app.component';

/* Services */
import { ChatService } from './chat.service';
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './message.service';
import { LoginComponent } from './login/login.component';

/* Http */
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    ChatLogComponent,
    AddMessageComponent,
    ChatWindowComponent,
    MessagesComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
	FormsModule,
	HttpClientModule
  ],
  providers: [ChatService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
