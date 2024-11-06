import { Injectable } from '@angular/core';
import {Book} from "./book.model";
import {Observable, of} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:3001/api/books';

  constructor(private http: HttpClient) { }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  filterBooks(filters: any = {}): Observable<Book[]> {
    let params = new HttpParams();
    if (filters.title) params = params.append('title', filters.title);
    if (filters.author) params = params.append('author', filters.author);
    if (filters.genre) params = params.append('genre', filters.genre);
    if (filters.publicationDate) params = params.append('publicationDate', filters.publicationDate);

    return this.http.get<Book[]>(`${this.apiUrl}/filter`, { params });
  }

  exportBooks(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, { responseType: 'blob' });
  }
}
