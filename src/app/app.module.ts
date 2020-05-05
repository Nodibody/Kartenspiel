import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KarteComponent } from './karte/karte.component';
import { DeckComponent } from './deck/deck.component';

@NgModule({
  declarations: [AppComponent, KarteComponent, DeckComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
