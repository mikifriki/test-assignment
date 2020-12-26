import {Book} from './book';

// Created this model for use with the checkout-table component.
export interface CheckedBook {
	id: string;
	borrowerFirstName?: string;
	borrowerLastName?: string;
	borrowedBook?: Book;
	checkedOutDate?: string;
	dueDate?: string;
	returnedDate?: string;
}
