import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { TheaterCreateDTO, TheaterDTO } from './../../_model/theaters.model';
import { parseWebApiErrors } from './../../utilities/utils';
import { TheatersService } from '../theaters.service';

@Component({
  selector: 'app-edit-theater',
  templateUrl: './edit-theater.component.html',
  styleUrls: ['./edit-theater.component.css']
})
export class EditTheaterComponent implements OnInit {
  public theater: TheaterDTO;
  public errors: string[] = [];
  public id: number;
  
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private theatersService: TheatersService
  ) {}

  ngOnInit(): void {
    //we actually need to retrieve genre here!
    this.route.params.pipe(
      //delay(500),
      switchMap( params => {
        this.id = params['id'];
        return this.theatersService.getById(this.id);
      })
    ).subscribe({
      next: (theater) => {
        this.theater = theater;
      }  
    });
  }

  onSaveTheater(theater: TheaterCreateDTO){
    console.log("Theater Saved", theater);
    this.theatersService.edit(this.id, theater).subscribe({
      next: () => this.router.navigate(["/theaters"]),
      error: (err) => this.errors = parseWebApiErrors(err)
    });     
  }  
}
