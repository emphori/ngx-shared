import { NgModule } from '@angular/core';

import { ApiAuthService } from './services/api-auth.service';
import { ApiClientService } from './services/api-client.service';

@NgModule({
  providers: [
    ApiAuthService,
    ApiClientService,
  ],
})
export class RestClientModule { }
