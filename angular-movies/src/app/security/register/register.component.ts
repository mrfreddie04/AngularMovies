import { parseWebApiErrors } from 'src/app/utilities/utils';
import { Component, OnInit } from '@angular/core';
import { SecurityService } from './../security.service';
import { UserCredentialsDTO } from './../../_model/security.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public errors: string[] = [];

  constructor(
    private SecurityService: SecurityService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  public register(credentials: UserCredentialsDTO) {
    this.errors = [];
    this.SecurityService.register(credentials).subscribe({
      next: (response) => {       
        console.log(response);
        this.router.navigate(["/"]);
      },
      error: (err) => this.errors = parseWebApiErrors(err)
    });    
  }
}
