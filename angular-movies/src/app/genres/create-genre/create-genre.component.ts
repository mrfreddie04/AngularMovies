import { GenresService } from './../genres.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GenreCreateDTO } from 'src/app/_model/genres.model';
import { parseWebApiErrors } from 'src/app/utilities/utils';

@Component({
  selector: 'app-create-genre',
  templateUrl: './create-genre.component.html',
  styleUrls: ['./create-genre.component.css']
})
export class CreateGenreComponent implements OnInit {
  public errors: string[] = [];

  constructor(private router: Router, private genresService: GenresService) {}

  ngOnInit(): void {}

  public onSaveGenre(genre: GenreCreateDTO) {
    console.log("Genre Saved", genre);
    this.genresService.create(genre).subscribe({
      next: () => this.router.navigate(["/genres"]),
      error: (err) => this.errors = parseWebApiErrors(err)
    });    
  }
}
