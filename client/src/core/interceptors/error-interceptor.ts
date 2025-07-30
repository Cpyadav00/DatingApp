import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';
import { ToastService } from '../services/toast-service';
import { NavigationExtras, Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    catchError(error => {
      if (error) {
        switch (error.status) {
          case 400:
            const err=error.error.errors;
            if(err){
              const modelStateErrors=[];
              for(const key in err)
              {
                if(err[key])
                {
                 modelStateErrors.push(err[key])
                }
              }
              throw modelStateErrors.flat();
            } else{
              toast.error(error.error);
            }
            break;
          case 401:
            toast.error("Unauthorized");
            break;
          case 404:
            router.navigateByUrl('/not-found')
            break;
          case 500:
            const navigationExtras:NavigationExtras={state:{error:error.error}}
            router.navigateByUrl('/server-error',navigationExtras)
            break;
          default:
            toast.error("someting went wrong");
            break;
        }
      }
      throw error;
    })
  )
};
