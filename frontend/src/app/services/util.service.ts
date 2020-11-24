import {Injectable} from '@angular/core';
import {DialogOverviewExampleDialogComponent} from '../components/button-dialog/dialog-overview-example-dialog';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CheckedBook} from '../models/checked-book';
import {Book} from '../models/book';
import {v4 as uuidv4} from 'uuid';
import {MatTableDataSource} from '@angular/material/table';
import * as moment from 'moment';

@Injectable({
	providedIn: 'root'
})
export class UtilService {
	dialogRef: MatDialogRef<DialogOverviewExampleDialogComponent>;

	constructor(
		private dialog: MatDialog
	) {
	}

	// Got this idea from looking at Angular documentation, and finding that mat-paginator has event emitters.
	// This gets used each time a dialog is opened. This is here because i can skip a'lot of repeated code.
	openDialog(event, firstName?: string, lastName?: string) {
		this.dialogRef = this.dialog.open(DialogOverviewExampleDialogComponent, {
			width: '550px',
			data: {calledEvent: event, firstName, lastName}
		});
		this.dialogRef.afterClosed().subscribe();
	}

	// This is used in this service. It creates an automatic due date that is from a month from now.
	// Using moment.js because it handles almost every edge case.
	generateDueDate() {
		const date = moment();
		return date.add(1, 'months').format('YYYY-MM-DD');
	}

	// This is called in the selection services.
	// This creates a new Book and a new CheckedBook to get posted for the api.
	// IT crates the book with the BORROWED status and a checkoutCount increase.
	// This also gets the input from the dialog and adds them to the borrowedBook first name and last name.
	checkOutBook(responseBook: Book, eventInput: string) {
		const dialogInput = this.arrayFromComma(eventInput);
		const newBook: Book = {
			id: responseBook.id,
			name: responseBook.name,
			title: responseBook.title,
			author: responseBook.author,
			genre: responseBook.genre,
			year: responseBook.year,
			added: responseBook.added,
			checkOutCount: responseBook.checkOutCount++,
			status: responseBook.status = 'BORROWED',
			dueDate: this.generateDueDate(),
			comment: responseBook.comment
		};
		const newCheckedBook: CheckedBook = {
			id: uuidv4(),
			borrowerFirstName: dialogInput[1],
			borrowerLastName: dialogInput[2],
			borrowedBook: newBook,
			dueDate: this.generateDueDate()
		};
		return newCheckedBook;
	}

	// Gets the input elements value from the called component uses it to return the filtered datasource for the table to use.
	// It also resets the datasource paginator so the table pagination does not break.
	filterInput(event: Event, dataSource: MatTableDataSource<any>): void {
		const filterValue = (event.target as HTMLInputElement).value;
		dataSource.filter = filterValue.trim().toLowerCase();
		if (dataSource.paginator) {
			dataSource.paginator.firstPage();
		}
	}

	// This is used in tables to check if the book is due.
	isBookLate(dueDate: string) {
		if (dueDate === null || dueDate === undefined) {
			return;
		}
		return new Date(dueDate) > new Date();
	}

	// This is used to return a array of with ,
	arrayFromComma(response) {
		return response.split(',');
	}
}
