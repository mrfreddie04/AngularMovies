import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActorCreateDTO, ActorDTO } from 'src/app/_model/actors.model';

@Component({
  selector: 'app-form-actor',
  templateUrl: './form-actor.component.html',
  styleUrls: ['./form-actor.component.css']
})
export class FormActorComponent implements OnInit {
  @Input() actor: ActorDTO;
  @Output() saveActor = new EventEmitter<ActorCreateDTO>();
  public form: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', { validators: [Validators.required] }],      
      dateOfBirth: '',
      picture: '',
      biography: ''
    })

    if(this.actor) {
      this.form.patchValue(this.actor)
    }
  }

  public getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if(field.hasError('required')) return `The "${fieldName}" field is required`;
    if(field.hasError('capitalized')) return field.getError('capitalized').message;
    return "";
  }  

  public onSaveActor() {
    this.saveActor.emit(this.form.value);
  }

  public onImageSelected(image: File) {
    this.form.get('picture').setValue(image);
    console.log(this.form.get('picture').value);
  }

  public onUpdateMarkdown(content: string) {
    this.form.get('biography').setValue(content);
  }
}
