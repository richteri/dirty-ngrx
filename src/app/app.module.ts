import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LetDirective } from '@ngrx/component';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LetDirective
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
