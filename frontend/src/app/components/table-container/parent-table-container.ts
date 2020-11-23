import {Component, OnInit} from '@angular/core';

//This component is just a container component. Holds all the three major components.
@Component({
	selector: 'parent-table-container',
	templateUrl: './parent-table-container.html',
	styleUrls: ['./parent-table-container.scss']
})


export class ParentTableContainer implements OnInit {

	constructor() {
	}

	ngOnInit(): void {
	}
}
