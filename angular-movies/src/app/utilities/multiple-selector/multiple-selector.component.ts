import { Component, Input, OnInit } from '@angular/core';
import { MultipleSelectorItem } from './multiple-selector.model';

@Component({
  selector: 'app-multiple-selector',
  templateUrl: './multiple-selector.component.html',
  styleUrls: ['./multiple-selector.component.css']
})
export class MultipleSelectorComponent implements OnInit {
  @Input() selectedItems: MultipleSelectorItem[] = []; 
  @Input() nonSelectedItems: MultipleSelectorItem[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  selectAll() {
    this.selectedItems.push(...this.nonSelectedItems);
    this.nonSelectedItems = [];
  }

  deSelectAll() {
    this.nonSelectedItems.push(...this.selectedItems);
    this.selectedItems = [];
  }

  select(key: number, idx: number) {
    this.selectedItems.push(this.nonSelectedItems[idx]);
    this.nonSelectedItems.splice(idx,1);
  }

  deSelect(key: number, idx: number) {
    this.nonSelectedItems.push(this.selectedItems[idx]);
    this.selectedItems.splice(idx,1);    
  }

}
