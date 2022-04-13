import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCog, faDiceD20, faDragon, faExclamationCircle, faInfoCircle, faTimes, faUser, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { NgbButtonsModule, NgbModalModule, NgbToastModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { InputAllowedCharactersDirective } from './inputAllowedCharacters.directive';

@NgModule({
  declarations: [
    AppComponent,
    InputAllowedCharactersDirective
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgbButtonsModule,
    NgbModalModule,
    NgbToastModule,
    NgbTooltipModule,
    FontAwesomeModule,
    ServiceWorkerModule.register(
      'ngsw-worker.js',
      {
        enabled: environment.production,
        // Register the ServiceWorker as soon as the app is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000'
      }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(faIconLibrary: FaIconLibrary) {
    faIconLibrary.addIcons(faCog, faDiceD20, faDragon, faExclamationCircle, faInfoCircle, faTimes, faUser, faUserShield);
  }
}
