import { Component, OnDestroy } from '@angular/core';
import { AutoLogoutService } from '@app/_shared/services/auto-logout.service';

@Component({
  selector: 'in-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'investnaija-learning-cp';

  constructor(private logout: AutoLogoutService) {}

  // @HostListener('window:beforeunload')
  // gointToClose(){
  //   if(confirm('Do you want to logout')) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  // @HostListener('window:beforeunload', ['$event'])
  // handleBeforeUnload(event) {
  //   console.log(event);
  //   return false;
  //   // if (connected) {
  //   //   return "You have unsaved data changes. Are you sure to close the page?"
  //   // }
  // }

  ngOnDestroy() {
  }
}
