import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material/material.module';
import {BooksTableComponent} from './components/books-table/books-table.component';
import {CheckoutsTableComponent} from './components/checkout-table/checkouts-table.component';
import {ParentTableContainerComponent} from './components/table-container/parent-table-container';
import {HttpClientModule} from '@angular/common/http';
import {FavoriteBookDisplayComponent} from './components/favorite-books/favorite-book.display';
import {FormsModule} from '@angular/forms';
import {DialogOverviewExampleDialogComponent} from './components/button-dialog/dialog-overview-example-dialog';

@NgModule({
	declarations: [
		AppComponent,
		BooksTableComponent,
		CheckoutsTableComponent,
		ParentTableContainerComponent,
		FavoriteBookDisplayComponent,
		DialogOverviewExampleDialogComponent
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
