// Straight Jasmine testing without Angular's testing support
import {BookService} from './book.service';
import {Observable} from 'rxjs';
import {Book} from '../models/book';
import {Page} from '../models/page';
import {TestBed} from '@angular/core/testing';

describe('ValueService', () => {
	let httpClientSpy: { get: jasmine.Spy };
	let bookService: BookService;
	beforeEach(() => {
		// TODO: spy on other methods too
		TestBed.configureTestingModule({ providers: [BookService] });
		httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
		bookService = new BookService(httpClientSpy as any);
	});

	it('Should return Page obervable', () => {
		const expectedHeroes = new Observable<Page<Book>>();
		httpClientSpy.get.and.returnValue(expectedHeroes);
		expect(bookService.getBooks({pageSize: 50})).toBe(expectedHeroes);
	});

	it('should return expected heroes (HttpClient called once)', () => {
		const expectedHeroes = new Observable<Page<Book>>();
		const modal = {} as Page<Book>;
		httpClientSpy.get.and.returnValue(expectedHeroes);

		bookService.getBooks({pageSize: 50}).subscribe(
			heroes => expect(heroes).toEqual(modal, 'expected heroes'),
			fail
		);
		expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
	});
});
