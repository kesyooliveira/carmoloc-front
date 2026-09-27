import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export abstract class ApiService<TResponse, TRequest = TResponse> {

    protected constructor(
        protected readonly http: HttpClient,
        protected readonly path: string
    ) { }

    private get baseUrl(): string {
        return `${environment.apiUrl}${this.path}`
    }

    findAll(): Observable<TResponse[]> {
        return this.http.get<TResponse[]>(this.baseUrl);
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