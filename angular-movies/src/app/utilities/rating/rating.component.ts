import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { SecurityService } from './../../security/security.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {
  @Input() public maxRating = 5;
  @Input() public selectedRate = 0;
  @Output() public onRating = new EventEmitter<number>();

  public previousRate = 0;
  public maxRatingArr = [];

  constructor(private securityService: SecurityService) { }

  ngOnInit(): void {
    this.maxRatingArr = Array(this.maxRating).fill(0);
  }

  public handleMouseEnter(index: number) {
    this.selectedRate = index + 1;
  }

  public handleMouseLeave(index: number) {
    this.selectedRate = this.previousRate;
  }  

  public rate(index: number) {
    if(!this.securityService.isAuthenticated()) {
      Swal.fire("Error", "You need to log in before voting", "error");
      return;
    }
    this.selectedRate = index + 1;
    this.previousRate = this.selectedRate;
    this.onRating.emit(this.previousRate);
  }    
}
