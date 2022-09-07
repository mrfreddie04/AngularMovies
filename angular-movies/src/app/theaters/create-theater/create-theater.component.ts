import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TheaterCreateDTO } from './../../_model/theaters.model';
import { parseWebApiErrors } from './../../utilities/utils';
import { TheatersService } from './../theaters.service';

@Component({
  selector: 'app-create-theater',
  templateUrl: './create-theater.component.html',
  styleUrls: ['./create-theater.component.css']
})
export class CreateTheaterComponent implements OnInit {
  public errors: string[] = [];
  
  constructor(private router: Router, private theatersService: TheatersService) { }

  ngOnInit(): void {
  }

  onSaveTheater(theater: TheaterCreateDTO){
    console.log("Theater Saved", theater);
    this.theatersService.create(theater).subscribe({
      next: () => this.router.navigate(["/theaters"]),
      error: (err) => this.errors = parseWebApiErrors(err)
    });    
  }
}
