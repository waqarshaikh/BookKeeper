import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../book.model';
import { BookService } from '../book.service';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-add-book-form',
  templateUrl: './add-book-form.component.html',
  styleUrls: ['./add-book-form.component.css']
})
export class AddBookFormComponent implements OnInit {
  book: Book = {
    title: '',
    author: '',
    genre: '',
    publicationDate: new Date(),
    isbn: ''
  };
  formattedPublicationDate: string = '';
  isEditMode = false;
  bookId!: number;

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.bookId = +(this.route.snapshot.paramMap.get('id') ?? 0);
    if (this.bookId) {
      this.isEditMode = true;
      this.bookService.getBook(this.bookId).subscribe((book: Book) => {
        this.book = book;
        if (book.publicationDate) {
          const date = new Date(book.publicationDate);
          if (!isNaN(date.getTime())) {
            this.formattedPublicationDate = date.toISOString().split('T')[0];
          } else {
            console.error('Invalid date:', book.publicationDate);
          }
        }
        console.log('Book:', book);
      });
    }
  }

  onSubmit(bookForm: any): void {
    if (bookForm.valid) {
      this.book.publicationDate = new Date(this.formattedPublicationDate);
      if (this.isEditMode) {
        this.bookService.updateBook(this.bookId, this.book).pipe(
          tap(response => {
            console.log('Book updated:', response);
          }),
          catchError(error => {
            console.error('Error updating book:', error);
            return of(null);
          })
        ).subscribe();
      } else {
        this.bookService.addBook(this.book).pipe(
          tap(response => {
            console.log('Book submitted:', response);
            this.book = { title: '', author: '', genre: '', publicationDate: new Date(), isbn: '' };
            this.formattedPublicationDate = '';
          }),
          catchError(error => {
            console.error('Error submitting book:', error);
            return of(null);
          })
        ).subscribe();
      }
      this.router.navigate(['/books']);
    }
  }
}
