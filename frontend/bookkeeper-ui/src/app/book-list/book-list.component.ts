import { Component, OnInit } from '@angular/core';
import { Book } from '../book.model';
import { BookService } from '../book.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  filters = {
    title: '',
    author: '',
    genre: '',
    publicationDate: ''
  };

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks(): void {
    this.bookService.filterBooks(this.filters).subscribe(books => this.books = books);
  }

  onFilter(filters: any): void {
    this.filters = filters;
    this.getBooks();
  }

  exportBooks(): void {
    this.bookService.exportBooks().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'books_inventory.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
