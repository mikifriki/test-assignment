import {Injectable} from '@angular/core';
import {BookService} from "./book.service";

@Injectable({
	providedIn: 'root'
})
export class PageService {

	constructor(private bookService: BookService) {
	}

	//Got this idea from looking at Angular documentation, and finding that mat-paginator has event emitters.
	handlePage(dataSource, event: any, currentBooks, service, paginator) {
		if (dataSource.data.length == currentBooks.totalElements) return;
		if (event.previousPageIndex < event.pageIndex || event.pageSize === event.length) {
			service.subscribe(
				countries => {
					dataSource.data.push(...countries.content);
					dataSource.paginator = paginator;
				},
				err => console.log('HTTP Error', err)
			);
		} else {
			return;
		}
	}

	removeSelected(selected, dataSource, service, paginator) {
		selected.forEach(book => {
			if (book.status !== "AVAILABLE" && service == this.bookService) return;
			let elementPos = dataSource.data.map((x) => {
				return x.id;
			}).indexOf(book.id);
			service.deleteBook(book.id).subscribe(data => {
					dataSource.data.splice(elementPos, 1);
					dataSource.paginator = paginator
				},
				error => error);
		});
	}

	getPropertyByPath(obj: Object, pathString: string) {
		return pathString.split('.').reduce((o, i) => o[i], obj);
	}
}
