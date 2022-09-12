import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SecurityService } from './../security.service';

@Component({
  selector: 'app-authorize-view',
  templateUrl: './authorize-view.component.html',
  styleUrls: ['./authorize-view.component.css']
})
export class AuthorizeViewComponent implements OnInit {
  @Input() public role: string = "";
  public isAuthorized$: Observable<boolean>;

  constructor(private securityService: SecurityService) { }

  ngOnInit(): void {
    this.isAuthorized$ = this.securityService.currentAccount$.pipe(
      map(user => {
        return (user && (!this.role || user.role === this.role));
      })
    )
  }

  // public isAuthorized() {
  //   if(this.role) {
  //     return this.securityService.getRole() === this.role;  
  //   }
  //   const user = this.securityService.currentAccountSource$.value;
  //   return !!user;
  // }
}
