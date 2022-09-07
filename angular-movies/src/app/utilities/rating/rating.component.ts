import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {
  @Input() 
  public maxRating = 5;

  @Input() 
  public selectedRate = 0;

  @Output() 
  public onRating = new EventEmitter<number>();

  public previousRate = 0;
  public maxRatingArr = [];

  constructor() { }

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
    this.selectedRate = index + 1;
    this.previousRate = this.selectedRate;
    this.onRating.emit(this.previousRate);
  }    
}