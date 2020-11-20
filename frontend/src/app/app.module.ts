import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material/material.module';
import {BooksTableComponent} from './components/books-table/books-table.component';
import {BookDetailComponent} from './components/book-detail/book-detail.component';
import {CheckoutsTableComponent} from './components/checkout-table/checkouts-table.component';
import {ParentTableContainer} from './components/table-container/parent-table-container';
import {HttpClientModule} from '@angular/common/http';
import {FavoriteBookDisplay} from "./components/favorite-books/favorite-book.display";
import {CreateBookComponent} from "./components/create-book/create-book.component";
import {FormsModule} from "@angular/forms";
import {DialogOverviewExampleDialog} from "./components/button-dialog/dialog-overview-example-dialog";

@NgModule({
	declarations: [
		AppComponent,
		BooksTableComponent,
		BookDetailComponent,
		CheckoutsTableComponent,
		ParentTableContainer,
		FavoriteBookDisplay,
		CreateBookComponent,
		DialogOverviewExampleDialog
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MaterialModule,
		FormsModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
