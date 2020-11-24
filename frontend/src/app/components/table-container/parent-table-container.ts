import {Component, OnInit} from '@angular/core';

// This component is just a container component. Holds all the three major components.
@Component({
	selector: 'app-parent-table-container',
	templateUrl: './parent-table-container.html',
	styleUrls: ['./parent-table-container.scss']
})


export class ParentTableContainerComponent implements OnInit {

	constructor() {
	}

	ngOnInit(): void {
	}
}
