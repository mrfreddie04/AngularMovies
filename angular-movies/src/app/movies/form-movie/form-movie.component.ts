import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActorMovieDTO } from './../../_model/actors.model';
import { MovieCreateDTO, MovieDTO } from './../../_model/movies.model';
import { getErrorMessage, isErrors } from './../../utilities/utils';
import { MultipleSelectorItem } from './../../utilities/multiple-selector/multiple-selector.model';

@Component({
  selector: 'app-form-movie',
  templateUrl: './form-movie.component.html',
  styleUrls: ['./form-movie.component.css']
})
export class FormMovieComponent implements OnInit {
  @Input() public movie: MovieDTO;
  @Input() public nonSelectedGenres: MultipleSelectorItem[] = [];
  @Input() public nonSelectedTheaters: MultipleSelectorItem[] = [];  
  @Input() public selectedGenres: MultipleSelectorItem[] = [];
  @Input() public selectedTheaters: MultipleSelectorItem[] = [];   
  @Input() public selectedActors: ActorMovieDTO[] = [];
  @Output() public saveMovie = new EventEmitter<MovieCreateDTO>();
  
  public form: FormGroup;
  public getErrorMessage: (fieldName:string)=>string;
  public isErrors: (fieldName:string)=>boolean;  

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: ['', { validators: [Validators.required]}],
      summary: '',
      inTheaters: false,
      trailer: '',
      releaseDate: '',
      poster: '',
      genreIds: '',
      theaterIds: '',
      actors: ''
    });

    this.getErrorMessage = getErrorMessage(this.form);
    this.isErrors = isErrors(this.form); 
    
    if(this.movie) {
      this.form.patchValue(this.movie);
      // this.selectedGenres.push(...this.nonSelectedGenres.filter( genre => this.movie.genreIds.includes(genre.key)));
      // this.nonSelectedGenres = this.nonSelectedGenres.filter( genre => !this.movie.genreIds.includes(genre.key));
      // this.selectedTheaters.push(...this.nonSelectedTheaters.filter( theater => this.movie.theaterIds.includes(theater.key)));
      // this.nonSelectedTheaters = this.nonSelectedTheaters.filter( theater => !this.movie.theaterIds.includes(theater.key));
    }    
  }

  public onSaveMovie() {
    this.form.get('genreIds').setValue(this.selectedGenres.map( genre => genre.key));
    this.form.get('theaterIds').setValue(this.selectedTheaters.map( theater => theater.key));
    this.form.get('actors').setValue(this.selectedActors.map( 
      actor => ({id: actor.id, character: actor.character})));
    this.saveMovie.emit(this.form.value);
  }

  public onImageSelected(image: File) {
    this.form.get('poster').setValue(image);
  }

  public onUpdateMarkdown(content: string) {
    this.form.get('summary').setValue(content);
  }  
}
