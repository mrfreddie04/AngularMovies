import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TheaterCreateDTO } from './../../_model/theaters.model';
import { getErrorMessage, isErrors } from './../../utilities/utils';
import { Coordinates } from './../../utilities/map/coordinates';

@Component({
  selector: 'app-theater-form',
  templateUrl: './theater-form.component.html',
  styleUrls: ['./theater-form.component.css']
})
export class TheaterFormComponent implements OnInit {
  @Input() theater: TheaterCreateDTO;
  @Output() saveTheater = new EventEmitter<TheaterCreateDTO>();
  public form: FormGroup;
  public getErrorMessage: (fieldName:string)=>string;
  public isErrors: (fieldName:string)=>boolean;
  public initialCoordinates: Coordinates[] = [];
  
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', { validators: [Validators.required]}],
      longitude: ['', { validators: [Validators.required]}],
      latitude: ['', { validators: [Validators.required]}],
    });    
    this.getErrorMessage = getErrorMessage(this.form);
    this.isErrors = isErrors(this.form);

    if(this.theater) {
      this.form.patchValue(this.theater);
      const {latitude,longitude} = this.theater;
      this.initialCoordinates.push({latitude,longitude});
    }    
  }

  // public isErrors(fieldName: string): boolean {
  //   const field = this.form.get(fieldName);
  //   return (!!field.errors && field.touched && field.dirty);
  // } 

  public onSelectLocation(coordinates: Coordinates) {
    //this.form.get('longitude').setValue(coordinates.latitude);
    this.form.patchValue(coordinates);
  }

  public onSaveTheater() {
    this.saveTheater.emit(this.form.value);
  }  

}
