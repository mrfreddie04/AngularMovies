import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { capitalized } from 'src/app/validators/capitalized';
import { GenreCreateDTO } from 'src/app/_model/genres.model';

@Component({
  selector: 'app-form-genre',
  templateUrl: './form-genre.component.html',
  styleUrls: ['./form-genre.component.css']
})
export class FormGenreComponent implements OnInit {
  @Input() genre: GenreCreateDTO;
  @Output() saveGenre = new EventEmitter<GenreCreateDTO>();
  public form: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', { validators: [Validators.required, Validators.minLength(3), capitalized] }]      
    })

    if(this.genre) {
      this.form.patchValue(this.genre)
    }
  }

  public getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if(field.hasError('required')) return `The "${fieldName}" field is required`;
    if(field.hasError('capitalized')) return field.getError('capitalized').message;
    return "";
  }  

  public onSaveGenre() {
    this.saveGenre.emit(this.form.value);
  }
}
