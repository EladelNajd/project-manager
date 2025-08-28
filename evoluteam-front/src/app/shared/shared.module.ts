import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { PrivateLayoutComponent } from './layout/private-layout/private-layout.component';
import { SwiperComponent } from './swiper/swiper.component';

import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    PublicLayoutComponent,
    PrivateLayoutComponent,
    SwiperComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ToastModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    PublicLayoutComponent,
    PrivateLayoutComponent
  ]
})
export class SharedModule {}
