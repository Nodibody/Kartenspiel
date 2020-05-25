import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KarteComponent } from './karte/karte.component';
import { DeckComponent } from './deck/deck.component';
import { StartseiteComponent } from './startseite/startseite.component';

@NgModule({
  declarations: [AppComponent, KarteComponent, DeckComponent, StartseiteComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
