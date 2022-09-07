import { parseWebApiErrors } from './../../utilities/utils';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ActorMovieDTO } from './../../_model/actors.model';
import { MultipleSelectorItem } from './../../utilities/multiple-selector/multiple-selector.model';
import { MoviesService } from './../movies.service';
import { MovieCreateDTO, MovieDTO } from './../../_model/movies.model';

@Component({
  selector: 'app-edit-movie',
  templateUrl: './edit-movie.component.html',
  styleUrls: ['./edit-movie.component.css']
})
export class EditMovieComponent implements OnInit {
  public movie: MovieDTO;
  public nonSelectedGenres: MultipleSelectorItem[];
  public nonSelectedTheaters: MultipleSelectorItem[];  
  public selectedGenres: MultipleSelectorItem[];
  public selectedTheaters: MultipleSelectorItem[];   
  public selectedActors: ActorMovieDTO[];  
  public errors: string[] = [];

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private moviesService: MoviesService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(
        switchMap( ({id}) => this.moviesService.getPutGet(id))
      )
      .subscribe( data => {
        this.movie = data.movie;
        this.selectedGenres = data.selectedGenres.map( ({id, name}) => (<MultipleSelectorItem>{key:id, value:name}));
        this.nonSelectedGenres = data.nonSelectedGenres.map( ({id, name}) => (<MultipleSelectorItem>{key:id, value:name}));
        this.selectedTheaters = data.selectedTheaters.map( ({id, name}) => (<MultipleSelectorItem>{key:id, value:name}));
        this.nonSelectedTheaters = data.nonSelectedTheaters.map( ({id, name}) => (<MultipleSelectorItem>{key:id, value:name}));
        this.selectedActors = data.actors;
      })
  }

  public onSaveMovie(movie: MovieCreateDTO){
    this.moviesService.edit(this.movie.id, movie).subscribe({
      next: () => this.router.navigate(["/movies/"+this.movie.id]),
      error: (err) => this.errors = parseWebApiErrors(err)
    });    
  }    
}
