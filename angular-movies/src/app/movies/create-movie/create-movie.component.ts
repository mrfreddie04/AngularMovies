import { parseWebApiErrors } from './../../utilities/utils';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TheaterDTO } from './../../_model/theaters.model';
import { GenreDTO } from './../../_model/genres.model';
import { MovieCreateDTO, MoviePostGetDTO } from './../../_model/movies.model';
import { MoviesService } from './../movies.service';
import { MultipleSelectorItem } from 'src/app/utilities/multiple-selector/multiple-selector.model';

@Component({
  selector: 'app-create-movie',
  templateUrl: './create-movie.component.html',
  styleUrls: ['./create-movie.component.css']
})
export class CreateMovieComponent implements OnInit {
  public nonSelectedGenres: MultipleSelectorItem[];
  public nonSelectedTheaters: MultipleSelectorItem[];
  public errors: string[] = [];

  constructor(private router: Router, private moviesService: MoviesService) { }

  ngOnInit(): void {
    this.moviesService.getPostGet().subscribe( (data: MoviePostGetDTO) => {
      this.nonSelectedGenres = data.genres.map( ({id, name}) => (<MultipleSelectorItem>{key:id, value:name}));
      this.nonSelectedTheaters = data.theaters.map( ({id, name}) => (<MultipleSelectorItem>{key:id, value:name}));
    });
  }

  public onSaveMovie(movie: MovieCreateDTO){
    console.log("Movie Saved", movie);
    this.moviesService.create(movie).subscribe({
      next: (id) => this.router.navigate(["/movies/"+id]),
      error: (err) => this.errors = parseWebApiErrors(err)
    });      
  }  
}
