import {Book} from "./book";

export interface CheckedBook {
	id: string,
	borrowerFirstName?: null,
	borrowerLastName?: null,
	borrowedBook: Book,
	checkedOutDate?: null,
	dueDate?: null,
	returnedDate?: null,
}
