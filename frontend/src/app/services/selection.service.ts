import {Inject, Injectable, Optional} from '@angular/core';

import {Book} from "../models/book";

import {FavoritesService} from "./favorites.service";

import {SelectionModel} from "@angular/cdk/collections";
import {MatTableDataSource} from "@angular/material/table";
import {UtilService} from "./util.service";
import {PageService} from "./page.service";
import {BookService} from "./book.service";
import {MatPaginator} from "@angular/material/paginator";
import {CheckoutsService} from "./checkouts.service";


@Injectable()
export class SelectionService {

	constructor(
		public utilService: UtilService,
		private favoritesService: FavoritesService,
		private pageService: PageService,
		private bookService: BookService,
		private checkoutsService: CheckoutsService
	) {
	}


	isAllSelected(selection: SelectionModel<Book>, dataSource: MatTableDataSource<Book>) {
		const numSelected = selection.selected.length;
		const numRows = dataSource.data.length;
		return numSelected === numRows;
	}

	masterToggle(selection: SelectionModel<Book>, dataSource: MatTableDataSource<Book>) {
		this.isAllSelected(selection, dataSource) ?
			selection.clear() :
			dataSource.data.forEach(row => selection.select(row));
	}

	removeSelectedRows(selection: SelectionModel<Book>, dataSource: MatTableDataSource<Book>, paginator: MatPaginator, service, string: String = "Delete") {
		this.utilService.openDialog(string);
		this.favoritesService.updateStorageObs.subscribe((response) => {
			if (response) {
				this.pageService.removeSelected(
					selection.selected, dataSource,
					service, paginator
				);
				selection.clear();
			}
		});
	}

	checkout(selection: SelectionModel<Book>) {
		this.utilService.openDialog("Checkout");
		this.favoritesService.updateStorageObs.subscribe((response) => {
			if (response) {
				selection.selected.forEach(book => {
					if (book.status == "AVAILABLE") {
						this.checkoutsService.checkout(this.utilService.checkOutBook(book, response)).subscribe();
						book.id.toString().trim();
						this.bookService.saveBook(book).subscribe();
					}
				});
			}
		});
	}

	addToFavorites(selection: SelectionModel<Book>) {
		selection.selected.forEach(book => {
			this.favoritesService.sendUpdate(`${book.id}`);
			this.favoritesService.addStorage(book);
		})
	}

}
