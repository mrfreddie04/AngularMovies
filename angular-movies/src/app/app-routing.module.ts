import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { IndexGenresComponent } from './genres/index-genres/index-genres.component';
import { CreateGenreComponent } from './genres/create-genre/create-genre.component';
import { IndexActorsComponent } from './actors/index-actors/index-actors.component';
import { CreateActorComponent } from './actors/create-actor/create-actor.component';
import { IndexTheatersComponent } from './theaters/index-theaters/index-theaters.component';
import { CreateTheaterComponent } from './theaters/create-theater/create-theater.component';
import { CreateMovieComponent } from './movies/create-movie/create-movie.component';
import { EditActorComponent } from './actors/edit-actor/edit-actor.component';
import { EditGenreComponent } from './genres/edit-genre/edit-genre.component';
import { EditTheaterComponent } from './theaters/edit-theater/edit-theater.component';
import { EditMovieComponent } from './movies/edit-movie/edit-movie.component';
import { MovieFilterComponent } from './movies/movie-filter/movie-filter.component';
import { MovieDetailsComponent } from './movies/movie-details/movie-details.component';
import { LoginComponent } from './security/login/login.component';
import { RegisterComponent } from './security/register/register.component';
import { UsersIndexComponent } from './security/users-index/users-index.component';
import { IsAdminGuard } from './security/is-admin.guard';

const routes: Routes = [
  { path: "", component: HomeComponent},
  { path: "users", component: UsersIndexComponent, canActivate: [IsAdminGuard] },
  { path: "genres", component: IndexGenresComponent, canActivate: [IsAdminGuard] },
  { path: "genres/create", component: CreateGenreComponent, canActivate: [IsAdminGuard]  },
  { path: "genres/edit/:id", component: EditGenreComponent, canActivate: [IsAdminGuard]  },
  { path: "actors", component: IndexActorsComponent, canActivate: [IsAdminGuard]  },
  { path: "actors/create", component: CreateActorComponent, canActivate: [IsAdminGuard]  },
  { path: "actors/edit/:id", component: EditActorComponent, canActivate: [IsAdminGuard]  },
  { path: "theaters", component: IndexTheatersComponent, canActivate: [IsAdminGuard]  },
  { path: "theaters/create", component: CreateTheaterComponent, canActivate: [IsAdminGuard]  },
  { path: "theaters/edit/:id", component: EditTheaterComponent, canActivate: [IsAdminGuard]  },
  { path: "movies/create", component: CreateMovieComponent, canActivate: [IsAdminGuard]  },
  { path: "movies/edit/:id", component: EditMovieComponent, canActivate: [IsAdminGuard]  },
  { path: "movies/filter", component: MovieFilterComponent },
  { path: "movies/:id", component: MovieDetailsComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "**", redirectTo: "/" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
