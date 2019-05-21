import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MetaModule } from './meta/meta.module';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule, MatSnackBarModule, MatOptionModule,
  MatToolbarModule
} from '@angular/material';
import { TransferComponent } from './transfer/transfer.component';
import { ApproveComponent } from './approve/approve.component';
import { TransferFromComponent } from './transfer-from/transfer-from.component';

@NgModule({
  declarations: [
    AppComponent,
    TransferComponent,
    ApproveComponent,
    TransferFromComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MetaModule,
    MatSelectModule, MatSnackBarModule, MatOptionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
