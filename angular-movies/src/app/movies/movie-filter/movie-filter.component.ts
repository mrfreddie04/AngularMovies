import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { switchMap } from 'rxjs/operators';
import { GenresService } from './../../genres/genres.service';
import { MoviesService } from './../movies.service';
import { GenreDTO } from './../../_model/genres.model';
import { MovieFilter } from './../../_model/movieFilter';
import { MovieDTO } from './../../_model/movies.model';

@Component({
  selector: 'app-movie-filter',
  templateUrl: './movie-filter.component.html',
  styleUrls: ['./movie-filter.component.css']
})
export class MovieFilterComponent implements OnInit {
  public form: FormGroup;
  public genres: GenreDTO[];
  public movies: MovieDTO[];
  public totalCount: number = 0;

  public pageNumber: number = 1;
  public pageSize: number = 5;

  private movieFilter: MovieFilter = {
    title: '',
    genreId: 0,
    upcomingReleases: false,
    inTheaters: false
  };

  constructor(
    private formBuilder: FormBuilder, 
    private moviesService: MoviesService,
    private genresService: GenresService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    console.log("Filtered");

    this.form = this.formBuilder.group(this.movieFilter);
    this.readParametersFromUrl(); //will update the form

    this.genresService.get().pipe(
      switchMap(genres => {
        console.log("Genres",genres);
        this.genres = genres;
        return this.moviesService.getFiltered(this.createFilter(this.form.value));
      }),
      switchMap((response: HttpResponse<MovieDTO[]>) => {        
        this.totalCount = parseInt(response.headers.get("totalCount"));
        this.movies = response.body;
        console.log("Initial Fetch",this.totalCount);
        return this.form.valueChanges;
      }),
      switchMap((terms: MovieFilter) => {
        console.log("Terms",terms);
        return this.moviesService.getFiltered(this.createFilter(this.form.value));
      })
    )
    .subscribe( (response: HttpResponse<MovieDTO[]>) => {
      this.writeParametersIntoUrl();
      this.totalCount = parseInt(response.headers.get("totalCount"));
      this.movies = response.body;
      console.log("Fetch",this.movies);
    });
  }

  onClear() {
    //do not run this.form.reset() as it vould assign nulls to fields, which would cause problems
    this.form.patchValue(this.movieFilter);
  }

  private createFilter(values: MovieFilter) {
    return {...values, pageNumber: this.pageNumber, pageSize: this.pageSize};
  }

  private writeParametersIntoUrl() {
    const queryStrings = [];
    const formValues = this.form.value;

    if (formValues.title) queryStrings.push(`title=${formValues.title}`);
    if (formValues.genreId != '0') queryStrings.push(`genreId=${formValues.genreId}`);
    if (formValues.upcomingReleases) queryStrings.push(`upcomingReleases=${formValues.upcomingReleases}`);
    if (formValues.inTheaters) queryStrings.push(`inTheaters=${formValues.inTheaters}`);
    
    queryStrings.push(`pageNumber=${this.pageNumber}`);
    queryStrings.push(`pageSize=${this.pageSize}`);

    this.location.replaceState('movies/filter', queryStrings.join('&'));    
  }

  private readParametersFromUrl(){
    this.route.queryParams.subscribe(params => {
      var obj: any = {};

      if (params['title']) obj.title = params['title'];
      if (params['genreId']) obj.genreId = Number(params['genreId']);
      if (params['upcomingReleases']) obj.upcomingReleases = Boolean(params['upcomingReleases']);
      if (params['inTheaters']) obj.inTheaters = Boolean(params['inTheaters']);
      if (params['pageNumber']) this.pageNumber = Number(params['pageNumber']);
      if (params['pageSize']) this.pageSize = Number(params['pageSize']);

      this.form.patchValue(obj);
    });
  }  

  public updatePagination(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    //force form.valueChanges event
    this.form.updateValueAndValidity({ onlySelf: false, emitEvent: true });
  }

  onDelete(){
    this.form.updateValueAndValidity({ onlySelf: false, emitEvent: true });
  }
  
  public filterMovies() {}
}
