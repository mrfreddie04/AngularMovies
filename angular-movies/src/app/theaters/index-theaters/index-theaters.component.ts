import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { switchMap } from 'rxjs/operators';
import { TheatersService } from '../theaters.service';
import { parseWebApiErrors } from './../../utilities/utils';
import { TheaterDTO } from './../../_model/theaters.model';

@Component({
  selector: 'app-index-theaters',
  templateUrl: './index-theaters.component.html',
  styleUrls: ['./index-theaters.component.css']
})
export class IndexTheatersComponent implements OnInit {
  public errors: string[] = [];
  public theaters: TheaterDTO[];
  public columnsToDisplay = ["name", "actions"];  

  constructor(private theatersService: TheatersService) { }

  ngOnInit(): void {
    this.theatersService.get().subscribe( theaters => {
      this.theaters = theaters;
    });    
  }

  public delete(id: number) {
    this.theatersService.delete(id).pipe(
      switchMap(() => this.theatersService.get())
    ).subscribe({
      next: (theaters) => this.theaters = theaters,
      error: (err) => this.errors = parseWebApiErrors(err)
    }); 
  }  
}
