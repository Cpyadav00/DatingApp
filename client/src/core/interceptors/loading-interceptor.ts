import { HttpEvent, HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../services/busy-service';
import { delay, finalize, of, tap } from 'rxjs';

const cache=new Map<string,HttpEvent<unknown>>();

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService=inject(BusyService);
// we are generating the full url as key that we are using to get the data from database so that we can store it on cache
  const generateCacheKey=(url:string,params:HttpParams):string=>{
    const paramString=params.keys().map(key=>`${key}=${params.get(key)}`).join('&');
    return paramString ? `${url}?${paramString}`:url;
  }

  const cacheKey= generateCacheKey(req.url,req.params);


if (req.method === 'GET') {
  const cachedResponse=cache.get(cacheKey);
  if(cachedResponse){
    return of(cachedResponse);
  }
}

  busyService.busy();
  return next(req).pipe(
    delay(500),
    tap(reponse =>{
    cache.set(cacheKey,reponse);
    }),
    finalize(()=>{
      busyService.idle()
    })
  );
};
