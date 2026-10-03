import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageResponseDTO } from '../models/page-response.model';

export abstract class ApiService<TResponse, TRequest = TResponse> {

    protected constructor(
        protected readonly http: HttpClient,
        protected readonly path: string
    ) { }

    public get baseUrl(): string {
        return `${environment.apiUrl}${this.path}`
    }

    findAll(): Observable<TResponse[]> {
        return this.http.get<TResponse[]>(this.baseUrl);
    }

    findAllPaged(page: number = 0, size: number = 10, sort?: string): Observable<PageResponseDTO<TResponse>> {
        let params = new HttpParams()
            .set('page', page)
            .set('size', size);

        if (sort) {
            params = params.set('sort', sort);
        }

        return this.http.get<PageResponseDTO<TResponse>>(`${this.baseUrl}/paged`, { params });
    }

    findById(id: string): Observable<TResponse> {
        return this.http.get<TResponse>(`${this.baseUrl}/${id}`);
    }

    create(payload: TRequest): Observable<TResponse> {
        return this.http.post<TResponse>(this.baseUrl, payload);
    }

    update(id: string, payload: TRequest): Observable<TResponse> {
        return this.http.put<TResponse>(`${this.baseUrl}/${id}`, payload);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}