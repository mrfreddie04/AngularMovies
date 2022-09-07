import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActorDTO } from './../../_model/actors.model';
import { ActorsService } from './../actors.service';

@Component({
  selector: 'app-index-actors',
  templateUrl: './index-actors.component.html',
  styleUrls: ['./index-actors.component.css']
})
export class IndexActorsComponent implements OnInit {
  public totalCount: number;
  public currentPage: number = 1;
  public pageSize: number = 5;
  public actors: ActorDTO[];
  public columnsToDisplay = ["name", "actions"];

  constructor(private actorsService: ActorsService) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    this.actorsService.get(this.currentPage,this.pageSize).subscribe( (response: HttpResponse<ActorDTO[]>) => {
      this.totalCount = parseInt(response.headers.get("totalCount"));
      this.actors = response.body;
    })    
  }

  public updatePagination(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  public delete(id: number) {
    this.actorsService.delete(id).subscribe({
      next: () => this.loadData()
    })
  }
}
