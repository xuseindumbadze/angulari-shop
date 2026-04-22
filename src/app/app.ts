import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Headercomponent } from "./sheared/header/headercomponent/headercomponent";
import { AiChatComponent } from './features/ai/ai'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Headercomponent, AiChatComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular-project');
}
