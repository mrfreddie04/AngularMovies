import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { toBase64 } from '../utils';

@Component({
  selector: 'app-input-img',
  templateUrl: './input-img.component.html',
  styleUrls: ['./input-img.component.css']
})
export class InputImgComponent implements OnInit {
  @Input() imageUrl: string = "";
  @Output() onImageSelected = new EventEmitter<File>();
  public imageBase64: string = "";

  constructor() { }

  ngOnInit(): void {
  }

  public onFileSelect(event: Event) {
    const target = <HTMLInputElement>event.target;
    if(target.files.length > 0) {
      const file: File = target.files[0];
      toBase64(file).then( data => {
        this.imageUrl = "";
        this.imageBase64 = data;
      });
      this.onImageSelected.emit(file);
    }
  }
}
