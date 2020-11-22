import {Book} from "./book";

export interface CheckedBook {
	id: string,
	borrowerFirstName?: string,
	borrowerLastName?: string,
	borrowedBook?: Book,
	checkedOutDate?: string,
	dueDate?: string,
	returnedDate?: string,
}
