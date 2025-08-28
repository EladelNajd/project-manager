import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-swiper',
  templateUrl: './swiper.component.html',
  styleUrls: ['./swiper.component.scss']
})
export class SwiperComponent implements OnInit, OnDestroy {
  images: string[] = [
    'assets/images/image1.jpg',
    'assets/images/image2.jpg',
    'assets/images/image3.webp'
  ];
  currentSlide = 0;
  private timer: any;

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide > 0) ? this.currentSlide - 1 : this.images.length - 1;
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide < this.images.length - 1) ? this.currentSlide + 1 : 0;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.restartTimer();
  }

  private startTimer(): void {
    this.timer = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  private stopTimer(): void {
    clearInterval(this.timer);
  }

  private restartTimer(): void {
    this.stopTimer();
    this.startTimer();
  }
}
