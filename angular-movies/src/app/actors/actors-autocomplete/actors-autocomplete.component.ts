import { FormControl } from '@angular/forms';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatTable } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { filter, switchMap } from 'rxjs/operators';
import { ActorsService } from './../actors.service';
import { ActorMovieDTO } from './../../_model/actors.model';

@Component({
  selector: 'app-actors-autocomplete',
  templateUrl: './actors-autocomplete.component.html',
  styleUrls: ['./actors-autocomplete.component.css']
})
export class ActorsAutocompleteComponent implements OnInit {
  @Input() public selectedActors: ActorMovieDTO[] = [];
  @ViewChild(MatTable) table: MatTable<any>;

  public control: FormControl;
  public columnsToDisplay = ["picture", "name", "character", "actions"];
  public actorsFound: ActorMovieDTO[] = [];

  constructor(private actorsService: ActorsService) { }

  ngOnInit(): void {
    this.control = new FormControl('');
    this.control.valueChanges.pipe(
      filter( term => { return (typeof term === "string") && term.length>0; }),
      switchMap( (term:string) => this.actorsService.search(term))
    ).subscribe( actorsFound => {    
      this.actorsFound = actorsFound;
    });
  }

  public optionSelected(event: MatAutocompleteSelectedEvent) {
    this.control.patchValue(''); //clear input control, same as setValue('')
    this.actorsFound = [];
    if(!this.selectedActors.find( actor => actor.id === event.option.value.id)) {
      this.selectedActors.push(event.option.value);
      if(this.table) {
        this.table.renderRows();
      }      
    }  
  }

  public remove(actor: ActorMovieDTO) {
    const idx = this.selectedActors.findIndex( el => el.id === actor.id);    
    if( idx >= 0 ) {
      this.selectedActors.splice( idx, 1);
      this.table.renderRows();
    }
  }

  public dropped(event: CdkDragDrop<any[]>) {
    const { currentIndex: ci, previousIndex: pi} = event;
    moveItemInArray(this.selectedActors, pi, ci);
    this.table.renderRows();      
    // const element = {...this.selectedActors[pi]};
    // this.selectedActors.splice(pi, 1);
    // this.selectedActors.splice(ci, 0, element);
  }
}

