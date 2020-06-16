import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { environment } from '../environments/environment';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AppComponent } from './app.component';
import { KarteComponent } from './karte/karte.component';
import { DeckComponent } from './deck/deck.component';
import { GameComponent } from './game/game.component';
import { StartseiteComponent } from './startseite/startseite.component';
import { DialogSessionUnavailableComponent } from './dialogs/dialog-session-unavailable/dialog-session-unavailable.component';
import { DialogHostGoneComponent } from './dialogs/dialog-host-gone/dialog-host-gone.component';
import { KartenMitteComponent } from './karten-mitte/karten-mitte.component';

@NgModule({
  declarations: [
    AppComponent,
    KarteComponent,
    DeckComponent,
    GameComponent,
    StartseiteComponent,
    DialogSessionUnavailableComponent,
    DialogHostGoneComponent,
    KartenMitteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
