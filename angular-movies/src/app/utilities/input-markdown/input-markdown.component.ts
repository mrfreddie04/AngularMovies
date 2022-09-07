import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-markdown',
  templateUrl: './input-markdown.component.html',
  styleUrls: ['./input-markdown.component.css']
})
export class InputMarkdownComponent implements OnInit {
  @Input() public markdownContent: string = "";
  @Input() public label: string = "Biography";
  @Output() public updateMarkdown = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  public saveMarkdown() {
    this.updateMarkdown.emit(this.markdownContent);
  }
}
