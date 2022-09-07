import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { parseWebApiErrors } from './../../utilities/utils';
import { GenreDTO } from './../../_model/genres.model';
import { GenresService } from '../genres.service';

@Component({
  selector: 'app-index-genres',
  templateUrl: './index-genres.component.html',
  styleUrls: ['./index-genres.component.css']
})
export class IndexGenresComponent implements OnInit {
  public errors: string[] = [];
  public genres: GenreDTO[];
  public columnsToDisplay = ["name", "actions"];

  constructor(private genresService: GenresService) { }

  ngOnInit(): void {
    this.genresService.get().subscribe( genres => {
      this.genres = genres;
    });
  }

  public delete(id: number) {
    this.genresService.delete(id).pipe(
      switchMap(() => this.genresService.get())
    ).subscribe({
      next: (genres) => this.genres = genres,
      error: (err) => this.errors = parseWebApiErrors(err)
    }); 
  }
}
