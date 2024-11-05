import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.css']
})
export class FilterFormComponent {

  filters = {
    title: '',
    author: '',
    genre: '',
    publicationDate: ''
  };

  @Output() filterChange = new EventEmitter<any>();

  onFilter(): void {
    this.filterChange.emit(this.filters);
  }

}
