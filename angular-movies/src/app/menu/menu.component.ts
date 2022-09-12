import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountDTO } from '../_model/security.models';
import { SecurityService } from './../security/security.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  public currentAccount$: Observable<AccountDTO>;
  
  constructor(
    private securityService: SecurityService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentAccount$ = this.securityService.currentAccount$;    
  }

  // public isAuthorized(role: string = "") {
  //   return this.securityService.isAuthorized(role);
  // }

  public logout() {
    this.securityService.logout();
    this.router.navigateByUrl("/login");
  }

}
