import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ParentTableContainerComponent} from './components/table-container/parent-table-container';

const routes: Routes = [
	{path: '', redirectTo: 'books', pathMatch: 'full'},
	{path: 'books', component: ParentTableContainerComponent}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
