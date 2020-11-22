import {Injectable} from '@angular/core';
import {DialogOverviewExampleDialog} from "../components/button-dialog/dialog-overview-example-dialog";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CheckedBook} from "../models/checked-book";
import {Book} from "../models/book";
import {v4 as uuidv4} from "uuid";
import {FavoritesService} from "./favorites.service";
import {MatTableDataSource} from "@angular/material/table";
import * as moment from 'moment'

@Injectable({
	providedIn: 'root'
})
export class UtilService {

	checkedBook: CheckedBook;
	dialogRef: MatDialogRef<DialogOverviewExampleDialog>;

	constructor(
		private dialog: MatDialog,
		private favoritesService: FavoritesService
	) {
		this.checkedBook = <CheckedBook>{};
	}

	//Got this idea from looking at Angular documentation, and finding that mat-paginator has event emitters.
	openDialog(event, firstName?: string, lastName?: string) {
		this.dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
			width: '550px',
			data: {calledEvent: event, firstName: firstName, lastName: lastName}
		});
		this.dialogRef.afterClosed().subscribe();
	}

	generateDueDate() {
		let date = moment();
		return date.add(1, 'months').format('YYYY-MM-DD')
	}

	checkOutBook(responseBook: Book, eventInput: string) {
		let newBook: Book = {
			id: responseBook.id,
			name: responseBook.name,
			title: responseBook.title,
			author: responseBook.author,
			genre: responseBook.genre,
			year: responseBook.year,
			added: responseBook.added,
			checkOutCount: responseBook.checkOutCount++,
			status: responseBook.status = "BORROWED",
			dueDate: this.generateDueDate(),
			comment: responseBook.comment
		};
		let dialogInput = this.favoritesService.checkFavorites(eventInput);
		const newCheckedBook: CheckedBook = {
			id: uuidv4(),
			borrowerFirstName: dialogInput[1],
			borrowerLastName: dialogInput[2],
			borrowedBook: newBook,
			dueDate: this.generateDueDate()
		};
		return newCheckedBook;
	}

	filterInput(event: Event, dataSource: MatTableDataSource<any>) {
		const filterValue = (event.target as HTMLInputElement).value;
		dataSource.filter = filterValue.trim().toLowerCase();
		if (dataSource.paginator) {
			dataSource.paginator.firstPage();
		}
	}

	isBookLate(dueDate: string) {
		if (dueDate === null || dueDate === undefined) return;
		return new Date(dueDate) > new Date();
	}
}
