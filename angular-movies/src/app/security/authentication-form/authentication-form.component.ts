import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getErrorMessage, isErrors } from './../../utilities/utils';
import { UserCredentialsDTO } from './../../_model/security.models';

@Component({
  selector: 'app-authentication-form',
  templateUrl: './authentication-form.component.html',
  styleUrls: ['./authentication-form.component.css']
})
export class AuthenticationFormComponent implements OnInit {
  @Input() action: string = "Register";
  @Output() submit = new EventEmitter<UserCredentialsDTO>();
  public form: FormGroup;
  public getErrorMessage: (fieldName:string)=>string;
  public isErrors: (fieldName:string)=>boolean;    

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', { validators: [Validators.required, Validators.email] }] ,     
      password: ['', { validators: [Validators.required, Validators.minLength(6)] }] ,
    })    

    this.getErrorMessage = getErrorMessage(this.form);
    this.isErrors = isErrors(this.form);     
  }

  public onSubmit() {
    this.submit.emit(this.form.value);
  }
}
