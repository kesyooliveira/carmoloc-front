import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";

const PUBLIC_PATHS = ['/pi/auth/login', '/pi/auth/refresh'];

let isRefreshing = false;
const refreshedToken$ = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    const isPublic = PUBLIC_PATHS.some(path => req.url.includes(path));
    const token = authService.getAccessToken();

    const authorizedReq = (!isPublic && token) ?
        req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        })
        : req;

    return next(authorizedReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status !== 401 || isPublic) {
                return throwError(() => error);
            }

            return handleTokenRefresh(req, next, authService);
        })
    );
}

function handleTokenRefresh(originalReq: HttpRequest<unknown>, next: HttpHandlerFn, authService: AuthService): Observable<HttpEvent<unknown>> {
    if (!isRefreshing) {
        isRefreshing = true;
        refreshedToken$.next(null);

        return authService.refreshToken().pipe(
            switchMap(response => {
                isRefreshing = false;
                refreshedToken$.next(response.token);

                const retriedReq = originalReq.clone({
                    setHeaders: {Authorization: `Bearer ${response.token}`}
                });
                return next(retriedReq);
            }),
            catchError(refreshError  => {
                isRefreshing = false;
                authService.forceLogout();
                return throwError(() => refreshError);
            })
        );
    }

    return refreshedToken$.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => {
            const retriedReq = originalReq.clone({
                setHeaders: {Authorization: `Bearer ${token}`}
            });
            return next(retriedReq);
        })
    );
}