import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActorsService } from './../actors.service';
import { parseWebApiErrors } from './../../utilities/utils';
import { ActorCreateDTO } from './../../_model/actors.model';

@Component({
  selector: 'app-create-actor',
  templateUrl: './create-actor.component.html',
  styleUrls: ['./create-actor.component.css']
})
export class CreateActorComponent implements OnInit {
  public errors: string[] = [];

  constructor(private router: Router, private actorsService: ActorsService) { }

  ngOnInit(): void {
  }

  onSaveActor(actor: ActorCreateDTO){
    console.log("Actor Saved", actor);
    this.actorsService.create(actor).subscribe({
      next: () => this.router.navigate(["/actors"]),
      error: (err) => this.errors = parseWebApiErrors(err)
    });    
  }
}
