import { parseWebApiErrors } from './../../utilities/utils';
import { ActorsService } from './../actors.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ActorCreateDTO, ActorDTO } from 'src/app/_model/actors.model';

@Component({
  selector: 'app-edit-actor',
  templateUrl: './edit-actor.component.html',
  styleUrls: ['./edit-actor.component.css']
})
export class EditActorComponent implements OnInit {
  public actor: ActorDTO;
  public id: number;
  public errors: string[] = [];

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private actorsService: ActorsService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap( params => {
        this.id = params['id'];
        return this.actorsService.getById(this.id);
      })
    ).subscribe({
      next: (actor) => {this.actor = actor;}  
    });    
  }

  onSaveActor(actor: ActorCreateDTO){
    console.log("Actor Updated", actor);
    this.actorsService.edit(this.id, actor).subscribe({
      next: () => this.router.navigate(["/actors"]),
      error: (err) => this.errors = parseWebApiErrors(err)
    });    
  }
}
