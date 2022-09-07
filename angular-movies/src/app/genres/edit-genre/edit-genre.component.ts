import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, switchMap, tap } from 'rxjs/operators';
import { GenresService } from './../genres.service';
import { parseWebApiErrors } from './../../utilities/utils';
import { GenreCreateDTO, GenreDTO } from './../../_model/genres.model';

@Component({
  selector: 'app-edit-genre',
  templateUrl: './edit-genre.component.html',
  styleUrls: ['./edit-genre.component.css']
})
export class EditGenreComponent implements OnInit {
  public genre: GenreDTO;
  public errors: string[] = [];
  public id: number;
  
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private genresService: GenresService
  ) { }

  ngOnInit(): void {
    //we actually need to retrieve genre here!
    this.route.params.pipe(
      //delay(500),
      switchMap( params => {
        this.id = params['id'];
        return this.genresService.getById(this.id);
      })
    ).subscribe({
      next: (genre) => {
        this.genre = genre;
      }  
    });
  }

  public onSaveGenre(genre: GenreCreateDTO) {
    this.genresService.edit(this.id,genre).subscribe({
      next: () => this.router.navigate(["/genres"]),
      error: (err) => this.errors = parseWebApiErrors(err)
    }); 
  }  
}






