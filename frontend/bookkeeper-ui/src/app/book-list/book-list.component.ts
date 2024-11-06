import { Component, OnInit } from '@angular/core';
import { Book } from '../book.model';
import { BookService } from '../book.service';
import { Router } from '@angular/router';
import {tap} from "rxjs";

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

  constructor(private bookService: BookService, private router: Router) { }

  ngOnInit(): void {
    this.getBooks();
    console.log('Books:', this.books);
  }

  getBooks(): void {
    const hasFilters = Object.values(this.filters).some(value => value);
    if (hasFilters) {
      this.bookService.filterBooks(this.filters)
        .pipe(tap(books => console.log('Books:', books)))
        .subscribe(books => this.books = books);
    } else {
      this.bookService.getBooks()
        .pipe(tap(books => console.log('Books:', books)))
        .subscribe(books => this.books = books);
    }
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

  editBook(bookId: number | undefined): void {
    if (bookId !== undefined) {
      console.log('Editing book:', bookId);
      this.router.navigate(['/books/edit', bookId]);
    }
  }

  deleteBook(bookId: number | undefined): void {
    this.bookService.deleteBook(bookId).subscribe(() => {
      this.getBooks();
    });
  }
}
