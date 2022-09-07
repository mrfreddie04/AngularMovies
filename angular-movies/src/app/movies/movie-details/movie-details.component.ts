import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { switchMap } from 'rxjs/operators';
import { CoordinatesWithMessage } from './../../utilities/map/coordinates';
import { MovieDTO } from './../../_model/movies.model';
import { MoviesService } from './../movies.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  public id: number;
  public movie: MovieDTO;

  public releaseDate: Date;
  public trailerUrl: SafeResourceUrl;
  public coordinates: CoordinatesWithMessage[] = [];
  
  constructor(
    private moviesService: MoviesService, 
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap( params => {
        this.id = params['id'];
        return this.moviesService.getById(this.id);
      })
    ).subscribe({
      next: (movie) => {
        this.movie = movie;
        
        //parse date
        this.releaseDate = new Date(movie.releaseDate);

        //parse url of the traile and generate ural for embedded video
        this.trailerUrl = this.generateYoutubeUrlFormEmbeddedVideo(movie.trailer); 
        
        //arrays of coordinates to display labeled markers for all selected theaters
        this.coordinates = this.movie.theaters.map(({latitude,longitude,name}) => 
          ({latitude,longitude,message:name}));

        console.log(movie);
      }  
    });    
  }

  private generateYoutubeUrlFormEmbeddedVideo(url: string): SafeResourceUrl {
    if(!url) return "";
    //extact video id
    let [,videoId] = url.split("v=");
    [videoId] = videoId.split("&");

    //sanitize 
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
  }
}