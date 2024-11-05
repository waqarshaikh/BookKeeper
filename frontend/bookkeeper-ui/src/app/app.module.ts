import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddBookFormComponent } from './add-book-form/add-book-form.component';
import { FilterFormComponent } from './filter-form/filter-form.component';
import { BookListComponent } from './book-list/book-list.component';
import { ExportButtonComponent } from './export-button/export-button.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    AddBookFormComponent,
    FilterFormComponent,
    BookListComponent,
    ExportButtonComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
