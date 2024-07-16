export default function SliderSwiper() {
  const swiper = new Swiper('.swiper', {
    loop: true, // бесконечная прокрутка
    // rewind: true, // перемотка в начало
    spaceBetween: 32,
    autoplay: {
      delay: 8000,
      disableOnInteraction: true,
    },
    // mousewheel: true,
    keyboard: {
      enabled: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      dynamicBullets: true,
      clickable: true,
    },
    breakpoints: {
      576: {
        slidesPerView: 1, // количество слайдов на экране
      },
      768: {
        slidesPerView: 2, // количество слайдов на экране
      },
      1024: {
        slidesPerView: 3, // количество слайдов на экране
      },
    },
  });

  swiper.el.addEventListener('mouseenter', function () {
    swiper.autoplay.stop(); // Остановить автопрокрутку при наведении мыши
  });

  swiper.el.addEventListener('mouseleave', function () {
    swiper.autoplay.start(); // Запустить автопрокрутку при уходе мыши
  });
}
