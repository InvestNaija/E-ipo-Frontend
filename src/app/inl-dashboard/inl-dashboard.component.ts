import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService } from '@app/_shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, merge, Observable, of, Subscription } from "rxjs";
import { debounceTime, filter, switchMap, take } from 'rxjs/operators';
import { ApplicationContextService } from '../_shared/services/application-context.service';
import { AuthService } from '../_shared/services/auth.service';

@Component({
  selector: 'in-inl-dashboard',
  templateUrl: './inl-dashboard.component.html',
  styleUrls: ['./inl-dashboard.component.scss']
})
export class InlDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sidenav') sidenav: any

  sideNavMode = 'side';
  sideNavOpen = true;
  resizeObservable$: Observable<Event>;
  loadObservable$: Observable<Event>;
  sidenavSubscription$: Subscription;
  allSideNavEventsObservable$: Observable<Event>;
  userInformation: any;
  sidenavClickSubscription$: Subscription;
  general$: Subscription;
  toast$: Subscription;

  // @ViewChild(ToastContainerDirective, { static: true }) toastContainer: ToastContainerDirective;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private auth: AuthService,
    private apiService: ApiService,
    public appContext: ApplicationContextService
  ) {
    this.general$ = this.router.events
        .pipe(
          filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd),
          switchMap((event) => {
            if (event.id === 1 && event.url === event.urlAfterRedirects) {
              return this.apiService.get('/api/v1/customers/profile/fetch');
            }
            return of({status:'Refreshed', data: this.appContext.userInformation});
          })
        )
        .subscribe((response) => {
            this.userInformation = response.data;
            this.appContext.userInformation = response.data
            const user = this.appContext.userInformation;
            if(!user) {
              this.logout();
            }

            // const options = {timeOut: 5000, enableHtml: true, closeButton: true, tapToDismiss: true, preventDuplicates: true, preventOpenDuplicates: true};
            // if((!user.nextOfKinName || !user.nextOfKinPhoneNumber || !user.nextOfKinRelationship) && this.router.url != '/dashboard/user/nok' ) {
            //   this.toast$ = this.toastr.warning(`<p>Your next of kin information is not available   </p><p>Click here to complete.</p>`, 'Notice', options)
            //     .onTap.pipe(take(1)).subscribe(() => this.toasterClickedHandler('/dashboard/user/nok'));
            // }
        });
  }
  toasterClickedHandler(url: string): void {
    this.router.navigateByUrl(url)
  }

  ngOnInit(): void {
    console.log('loading dashboard component');
    this.setupSideBar();

    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/']);
    }

    if(!this.auth.getToken()) {
      this.logout();
    }

  }

  ngAfterViewInit() {
    this.sideNavFunction();
  }

  setupSideBar() {
    this.resizeObservable$ = fromEvent(document, 'resize');
    this.loadObservable$ = fromEvent(document, 'load');
    this.allSideNavEventsObservable$ = merge(this.resizeObservable$, this.loadObservable$);
    this.sidenavSubscription$ = this.allSideNavEventsObservable$.pipe(debounceTime(500)).subscribe(evt => this.sideNavFunction());

    let button = document.querySelectorAll('.menu-section-bottom a');
    let sidenavClick$ = fromEvent(button, 'click');

    this.sidenavClickSubscription$ = sidenavClick$.subscribe(evt => {
      if (window.innerWidth < 991) {
        this.sidenav.close();
      }
    });
  }

  sideNavFunction() {
    let browserVidth = window.innerWidth;
    if (browserVidth < 991) {
      this.sideNavMode = 'over';
      this.sideNavOpen = false;
    } else {
      this.sideNavMode = 'side';
      this.sideNavOpen = true;
    }
  }

  logout() {

    // const payload = { username: 'admin',  password: 'admin' };

    // this.api.post('/auth/logout', payload).subscribe(() => { this.auth.logout(); });
    if (this.general$) {
      this.general$.unsubscribe();
    }
    this.auth.logout();
  }

  ngOnDestroy() {
    this.sidenavSubscription$.unsubscribe()
    this.logout();
  }
}
