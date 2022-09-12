import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { UserDTO } from './../../_model/security.models';
import { SecurityService } from './../security.service';

@Component({
  selector: 'app-users-index',
  templateUrl: './users-index.component.html',
  styleUrls: ['./users-index.component.css']
})
export class UsersIndexComponent implements OnInit {
  public totalCount: number;
  public currentPage: number = 1;
  public pageSize: number = 5;
  public users: UserDTO[];
  public columnsToDisplay = ["email", "actions"];

  constructor(private securityService: SecurityService) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    this.securityService.getUsers(this.currentPage, this.pageSize)
      .subscribe( (response: HttpResponse<UserDTO[]>) => {
        this.totalCount = parseInt(response.headers.get("totalCount"));
        this.users = response.body;
      });    
  }

  public updatePagination(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadData();
  }  

  public makeAdmin(userId: string) {
    this.securityService.makeAdmin(userId).subscribe(() => {
      Swal.fire("Success", "User has been added to Admin role" ,"success");
    });
  }

  public removeAdmin(userId: string) {
    this.securityService.removeAdmin(userId).subscribe(() => {
      Swal.fire("Success", "User has been removed from Admin role" ,"success");
    });    
  }
}
