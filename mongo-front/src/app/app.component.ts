import { Component } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mongo-front';

  public isRefreshTable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

}
