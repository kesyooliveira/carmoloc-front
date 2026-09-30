import { Component, input, output } from '@angular/core';

@Component({
	imports: [],
	selector: 'app-pagination',
	standalone: true,
	styleUrl: './pagination.component.scss',
	templateUrl: './pagination.component.html',
})
export class PaginationComponent {
	readonly pageNumber = input.required<number>();
	readonly totalPages = input.required<number>();
	readonly totalElements = input.required<number>();
	
	readonly pageChange = output<number>();

	get hasPrevious(): boolean {
		return this.pageNumber() > 0;
	}

	get hasNext(): boolean {
		return this.pageNumber() < this.totalPages() - 1;
	}

	previous(): void {
		if (this.hasPrevious) {
			this.pageChange.emit(this.pageNumber() - 1);
		}
	}

	next(): void {
		if (this.hasNext) {
			this.pageChange.emit(this.pageNumber() + 1);
		}
	}
}

