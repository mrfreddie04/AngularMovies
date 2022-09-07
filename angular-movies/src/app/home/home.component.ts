import { MoviesService } from './../movies/movies.service';
import { Component, OnInit } from '@angular/core';
import { MovieDTO } from './../_model/movies.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public moviesInTheaters: MovieDTO[];
  public moviesFutureReleases: MovieDTO[];
  
  constructor(private moviesService: MoviesService) { }

  public ngOnInit(): void {
    this.loadData();
  }

  public onDelete(){
    this.loadData();
  }  

  private loadData() {
    this.moviesService.getHomePageMovies().subscribe( homeDTO => {
      this.moviesInTheaters = homeDTO.inTheaters;
      this.moviesFutureReleases = homeDTO.upcomingReleases;
    });
  }
}
