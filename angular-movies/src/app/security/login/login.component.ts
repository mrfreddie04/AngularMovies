import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parseWebApiErrors } from './../../utilities/utils';
import { SecurityService } from './../security.service';
import { UserCredentialsDTO } from './../../_model/security.models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public errors: string[] = [];

  constructor(
    private SecurityService: SecurityService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  public login(credentials: UserCredentialsDTO) {    
    this.SecurityService.login(credentials).subscribe({
      next: (response) => {       
        this.errors = [];
        console.log(response);
        this.router.navigate(["/"]);
      },
      error: (err) => this.errors = parseWebApiErrors(err)
    });    
  }
}

//Test1234@
