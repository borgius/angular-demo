import { TestBed, async, inject } from '@angular/core/testing';
import {
  HttpClientModule,
  HttpRequest,
  HttpParams
} from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { TokenStorage } from '../core/token.storage';

describe('Service: AuthService using TestBed and HttpTestingController', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [TokenStorage, AuthService]
    });
  });

  afterEach(
    inject([HttpTestingController], (backend: HttpTestingController) => {
      backend.verify();
    })
  );

  it(
    `should send an expected login request`,
    async(
      inject(
        [AuthService, HttpTestingController],
        (service: AuthService, backend: HttpTestingController) => {
          service.attemptAuth('admin', 'admin').subscribe(data => {
            console.log(data);
            expect(data.jwt).toEqual('jwt_token');
          });

          backend
            .expectOne((req: HttpRequest<any>) => {
              expect(req.url).toContain('api/login');
              expect(req.method).toEqual('POST');
              expect(req.body.username).toEqual('admin');
              expect(req.body.password).toEqual('admin');
              return true;
            })
            .flush({ jwt: 'jwt_token' }, { status: 200, statusText: 'Ok' });
        }
      )
    )
  );
});
