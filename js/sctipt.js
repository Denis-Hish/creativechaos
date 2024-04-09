'use strict';

// Header sticky
const header = document.querySelector('.header');
const headerHeight = header.getBoundingClientRect().height;

function stickyHeader() {
   const scrollY = window.scrollY;

   if (scrollY > headerHeight) {
      header.classList.add('sticky');
   } else {
      header.classList.remove('sticky');
   }
}
window.addEventListener('scroll', stickyHeader);

// Navigation menu
const indicator = document.querySelector('.nav .indicator');
const items = document.querySelectorAll('.nav .nav-item');

function handleIndicator(el) {
   items.forEach((item) => {
      item.classList.remove('active');
   });

   indicator.style.width = `${el.offsetWidth}px`;
   indicator.style.left = `${el.offsetLeft}px`;
   indicator.style.backgroundColor =
      getComputedStyle(el).getPropertyValue('--clr');

   el.classList.add('active');
}

// Перерисовка indicator при смене размера окна браузера
window.addEventListener('resize', function () {
   const activeItem = document.querySelector('.nav-item.active');
   if (activeItem) {
      console.log('resize...');
      handleIndicator(activeItem);
   }
});

// Active link
function setActiveClassOnScroll() {
   const scrollPosition = window.scrollY + headerHeight; // + высота шапки

   items.forEach((item) => {
      let targetId;

      if (item.hash) {
         // Если это хеш, например, #contact
         targetId = item.hash.substring(1);
      } else {
         // Если это внешняя ссылка, например, sandbox.html
         targetId = item.getAttribute('href').substring(1);
      }

      const targetElement = document.getElementById(targetId);

      if (
         targetElement &&
         scrollPosition >= targetElement.offsetTop &&
         scrollPosition < targetElement.offsetTop + targetElement.offsetHeight
      ) {
         items.forEach((item) => item.classList.remove('active'));
         item.classList.add('active');
         handleIndicator(item);
      } else if (!targetElement && item.getAttribute('href') === '#') {
         // Добавляем класс active для "Главная", если мы в начале страницы
         items.forEach((item) => item.classList.remove('active'));
         item.classList.add('active');
         handleIndicator(item);
      } else {
         item.classList.remove('active');
      }
   });
}

// Обработчик события для прокрутки страницы при клике в меню
window.addEventListener('scroll', setActiveClassOnScroll);

// Обработчик события для клика по пункту меню
items.forEach((item) => {
   item.addEventListener('click', (e) => {
      const targetId = item.getAttribute('href').substring(1); // Убираем # из ID
      const targetElement = document.getElementById(targetId);

      // Проверка наличия якоря
      if (targetElement) {
         e.preventDefault(); // Предотвращаем стандартное поведение только при наличии якоря

         // Прокручиваем к соответствующему разделу
         window.scrollTo({
            top: targetElement.offsetTop,
            behavior: 'smooth', // Добавляем плавную прокрутку
         });
      }
   });
});

// Mobile menu
document.addEventListener('DOMContentLoaded', function () {
   const mobileMenu = document.querySelector('.nav');
   const menuIcons = document.querySelector('.menu-icons');

   // Обработчик события для открытия/закрытия мобильного меню
   menuIcons.addEventListener('click', function () {
      mobileMenu.classList.toggle('opened');

      // Переключаем иконки
      menuIcons.classList.toggle('menu-opened');
   });

   // Закрытие меню при клике вне него
   document.addEventListener('click', function (e) {
      if (!mobileMenu.contains(e.target) && !menuIcons.contains(e.target)) {
         mobileMenu.classList.remove('opened');
         // Возвращаем иконки в исходное состояние
         menuIcons.classList.remove('menu-opened');
      }
   });

   // Закрытие меню при клике по пункту меню
   mobileMenu.addEventListener('click', function () {
      mobileMenu.classList.remove('opened');
      // Возвращаем иконки в исходное состояние
      menuIcons.classList.remove('menu-opened');
   });
});

// Typing text
let words = [];
let typeEffectTimeout;

// Change language
document.addEventListener('DOMContentLoaded', function () {
   const languageSelector = document.querySelector('.language-selector');
   const typingTextKey = 'typing-text';

   // Функция для изменения языка
   function changeLanguage(lang, selectedLanguage, languageSelector) {
      const elements = document.querySelectorAll('[data-lang]');
      elements.forEach((element) => {
         const key = element.getAttribute('data-lang');
         if (data[key] && data[key][lang]) {
            if (key === typingTextKey) {
               words = data[key][lang].split(', '); // Преобразуем строку в массив
            }

            // Перевод placeholder в input и textarea
            if (
               element.tagName.toLowerCase() === 'input' ||
               element.tagName.toLowerCase() === 'textarea'
            ) {
               element.placeholder = data[key][lang];
               // Остальной перевод
            } else {
               element.textContent = data[key][lang];
            }
         }
      });

      clearTimeout(typeEffectTimeout);
      typeEffect();

      // Перерисовка индикатора меню при смене языка
      items.forEach((item) => {
         if (item.classList.contains('active')) {
            handleIndicator(item);
         }
      });

      // Сохранение выбранного языка в localStorage
      localStorage.setItem('selectedLanguage', lang);

      // Обновление атрибута lang в HTML
      document.documentElement.lang = lang;

      // Обновление изображения языка (флага)
      const currentFlag = document.querySelector(`li[data-lang="${lang}"] img`);
      const selectedFlag = currentFlag.cloneNode(true);
      selectedLanguage.innerHTML = '';
      selectedLanguage.appendChild(selectedFlag);
      selectedLanguage.insertAdjacentHTML(
         'beforeend',
         '<div class="arrow"></div>'
      );

      // Закрытие выпадающего списка
      languageSelector.classList.remove('opened');
   }

   // Функция для определения языка браузера
   function getBrowserLanguage() {
      const userLanguage = navigator.language || navigator.userLanguage;
      // Проверка на украинский, русский и польский язык
      if (userLanguage.startsWith('uk') || userLanguage.startsWith('ru')) {
         return 'uk';
      } else if (userLanguage.startsWith('pl')) {
         return 'pl';
      }
      // Если браузер использует другой язык, устанавливаем английский
      return 'en';
   }

   // Функция для установки текущего выбранного языка при загрузке страницы
   function setInitialLanguage(
      selectedLanguage,
      languageSelector,
      selectLanguage
   ) {
      const savedLanguage = localStorage.getItem('selectedLanguage');
      if (savedLanguage) {
         changeLanguage(savedLanguage, selectedLanguage, languageSelector);

         // Установка значения в выпадающем списке (если используется)
         if (selectLanguage) {
            selectLanguage.value = savedLanguage;
         }
      } else {
         // Если в localStorage нет сохраненного языка, определите язык браузера
         const browserLanguage = getBrowserLanguage();
         changeLanguage(browserLanguage, selectedLanguage, languageSelector);
      }
   }

   // Загрузка JSON-файла
   fetch('language/lang.json')
      .then((response) => response.json())
      .then((data) => {
         // Сохраняем данные для использования в функции changeLanguage
         window.data = data;

         // Установите текущий язык при загрузке данных
         setInitialLanguage(
            languageSelector.querySelector('.selected-language'),
            languageSelector,
            languageSelector.querySelector('.change-language'),
            typingTextKey
         );

         // Устанавливаем массив слов в соответствии с текущим языком
         const currentLanguage =
            localStorage.getItem('selectedLanguage') || getBrowserLanguage();
         words = data[typingTextKey][currentLanguage].split(', ');
      })

      .catch((error) => {
         console.error('Error in loading language data:', error);
      });

   // Обработчик события для выбора языка
   languageSelector
      .querySelector('.language-options')
      .addEventListener('click', function (e) {
         if (e.target.tagName === 'LI' || e.target.tagName === 'IMG') {
            const selectedLang = e.target
               .closest('li')
               .getAttribute('data-lang');
            changeLanguage(
               selectedLang,
               languageSelector.querySelector('.selected-language'),
               languageSelector
            );
         }
      });

   // Обработчик события для кастомного выпадающего списка
   languageSelector
      .querySelector('.selected-language')
      .addEventListener('click', function () {
         languageSelector.classList.toggle('opened');
      });

   // Обработчик события для закрытия выпадающего списка при клике вне элемента
   document.addEventListener('click', function (e) {
      if (
         !languageSelector.contains(e.target) &&
         e.target !== languageSelector.querySelector('.selected-language')
      ) {
         languageSelector.classList.remove('opened');
      }
   });
});

// Typing text effect
const dynamicText = document.querySelector('.type-effect span');

// Массив слов берётся с language/lang.json "typing-text"
// const words = ['психолог', 'красуня', 'і просто хороша людина'];

let wordIndex = 0; // порядковый номер слова ↑
let symbolIndex = 0; // количество отображаемых символов
let isDeleting = false;

const typeEffect = () => {
   const currentWord = words[wordIndex];
   const currentSymbol = currentWord.substring(0, symbolIndex);
   dynamicText.textContent = currentSymbol;
   dynamicText.classList.add('stop-blinking');

   if (!isDeleting && symbolIndex < currentWord.length) {
      // печатаем текст
      symbolIndex++;
      typeEffectTimeout = setTimeout(typeEffect, 100);
   } else if (isDeleting && symbolIndex > 0) {
      // удаляем текст
      symbolIndex--;
      typeEffectTimeout = setTimeout(typeEffect, 30);
   } else {
      // задержка перед печатанием или удалением и смена слова
      isDeleting = !isDeleting;
      dynamicText.classList.remove('stop-blinking');
      wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex;
      typeEffectTimeout = setTimeout(typeEffect, 2000);
   }
};

// Modern Button
const buttons = document.querySelectorAll('.modern-button');
buttons.forEach((button) => {
   button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      button.style.setProperty('--x', x + 'px');
      button.style.setProperty('--y', y + 'px');
   });
});

// Rainbow color
window.onload = function () {
   const colors = ['#f00', '#f0f', '#0ff', '#0f0', '#f60'];
   let elements = document.getElementsByClassName('rainbow');
   let colorIndex = 0;

   for (let i = 0; i < elements.length; i++) {
      let text = elements[i].innerText;
      elements[i].innerHTML = '';

      for (let j = 0; j < text.length; j++) {
         let span = document.createElement('span');
         if (text[j] !== ' ') {
            span.style.color = colors[colorIndex % colors.length];
            colorIndex++;
         }
         span.innerText = text[j];
         elements[i].appendChild(span);
      }
   }
};

// Waves
const mountPoint = document.getElementById('waves');
waves({
   fills: [
      'rgba(255, 0, 0, 0.5)',
      'rgba(255, 127, 0, 0.5)',
      'rgba(255, 255, 0, 0.5)',
      'rgba(0, 255, 0, 0.5)',
      'rgba(0, 255, 255, 0.5)',
      'rgba(255, 0, 255, 0.3)',
      'rgba(0, 255, 255, 0.5)',
      'rgba(255, 255, 255, 0.7)',
   ],
   flowRate: 2,
   swayRate: 3,
   wavelength: 16,
   offset: 0.12,
   randomHeight: 0.5,
   offset: 0.2,
   swayVelocity: 0.5,
   complexity: 6,
   curviness: 0.8,
   randomOffset: 0.06,
   randomSwayRate: 0.4,
   randomWavelength: 0.05,
}).mount(mountPoint);

// Scroll to top
window.addEventListener('scroll', () => {
   const scrollY = window.scrollY;

   if (scrollY > headerHeight) {
      document.querySelector('.scroll-to-top').style.display = 'block';
   } else {
      document.querySelector('.scroll-to-top').style.display = 'none';
   }
});

document.querySelector('.scroll-to-top').addEventListener('click', () => {
   window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Run animation arrow down
function runAnimation() {
   const arrow = document.querySelector('.arrow-down');
   arrow.classList.remove('arrow-down');
   void arrow.offsetWidth;
   arrow.classList.add('arrow-down');
}
setInterval(runAnimation, 8000);

// Slider Swiper
var swiper = new Swiper('.swiper', {
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

// Animate On Scroll
AOS.init();

// When page load
window.addEventListener('load', function () {
   // Preloader
   const preloader = document.querySelector('.preloader');
   preloader.style.opacity = '0';
   setTimeout(() => {
      preloader.style.display = 'none';
   }, 400);
});

// Reading line
document.addEventListener('DOMContentLoaded', function () {
   const readingLine = document.querySelector('.reading-line');
   const line = document.querySelector('.line');
   const windowHeight = window.innerHeight;

   window.addEventListener('scroll', function () {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - windowHeight; // высота всего HTML
      const scrollPercent = (scrollTop / scrollHeight) * 80; // 100

      const lineHeight = (scrollPercent / 100) * windowHeight;
      line.style.height = lineHeight + 'px';

      // прокрутка вниз на 100px
      if (scrollTop > 100) {
         readingLine.style.opacity = '1';
      } else {
         readingLine.style.opacity = '0';
      }

      // console.log('scrollTop -', scrollTop, 'px');
      // console.log('scrollPercent -', Math.round(scrollPercent), '%');
   });
});

// Tooltip bootstrap
const tooltipTriggerList = document.querySelectorAll(
   '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
   (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);

// Adding subtitle to all titles
document.addEventListener('DOMContentLoaded', function () {
   const titles = document.querySelectorAll('.title');

   titles.forEach((title) => {
      const span = title.querySelector('span');
      const secondaryTitle = document.createElement('div');

      secondaryTitle.classList.add('secondary-title');
      secondaryTitle.appendChild(span.cloneNode(true));

      title.appendChild(secondaryTitle);
   });
});

// IMask Маска номера телефона
var phoneMask = IMask(document.getElementById('phone'), {
   mask: [
      {
         mask: '+00 (000) 00 00 000',
         startsWith: '38',
         lazy: false,
         country: 'Ukraine',
      },
      {
         mask: '+00 000 000 000',
         startsWith: '48',
         lazy: false,
         country: 'Poland',
      },
      {
         mask: '+0 (000) 000 000 000',
         startsWith: '',
         country: 'unknown',
      },
   ],
   dispatch: (appended, dynamicMasked) => {
      const number = (dynamicMasked.value + appended).replace(/\D/g, '');

      return dynamicMasked.compiledMasks.find(
         (m) => number.indexOf(m.startsWith) === 0
      );
   },
});

// Modal window send form validation
(function () {
   'use strict';
   /*
    * Form Validation
    */

   // Fetch all the forms we want to apply custom validation styles to
   const forms = document.querySelectorAll('.needs-validation');
   const result = document.getElementById('result');
   // Loop over them and prevent submission
   Array.prototype.slice.call(forms).forEach(function (form) {
      form.addEventListener(
         'submit',
         function (event) {
            if (!form.checkValidity()) {
               event.preventDefault();
               event.stopPropagation();
               form.querySelectorAll(':invalid')[0].focus();
            } else {
               /*
                * Form Submission using fetch()
                */

               const formData = new FormData(form);
               event.preventDefault();
               event.stopPropagation();
               const object = {};
               formData.forEach((value, key) => {
                  object[key] = value;
               });
               const json = JSON.stringify(object);
               result.innerHTML = 'Please wait...';

               fetch('https://api.web3forms.com/submit', {
                  method: 'POST',
                  headers: {
                     'Content-Type': 'application/json',
                     Accept: 'application/json',
                  },
                  body: json,
               })
                  .then(async (response) => {
                     let json = await response.json();
                     if (response.status == 200) {
                        result.innerHTML = json.message;

                        // Закрыть окно формы отправки
                        setTimeout(function () {
                           const modalSend =
                              document.getElementById('modal-send');
                           const modal = bootstrap.Modal.getInstance(modalSend);
                           modal.hide();
                        }, 1000);

                        // Открыть окно успешной отправки
                        setTimeout(function () {
                           const modalSuccess =
                              document.getElementById('modal-success');
                           const modal = new bootstrap.Modal(modalSuccess);
                           modal.show();
                        }, 1000);
                     } else {
                        console.log(response);
                        result.innerHTML = json.message;

                        // Закрыть окно формы отправки
                        setTimeout(function () {
                           const modalSend =
                              document.getElementById('modal-send');
                           const modal = bootstrap.Modal.getInstance(modalSend);
                           modal.hide();
                        }, 1000);

                        // Открыть окно ошибки
                        setTimeout(function () {
                           const modalError =
                              document.getElementById('modal-error');
                           const modal = new bootstrap.Modal(modalError);
                           modal.show();
                        }, 1000);
                     }
                  })
                  .catch((error) => {
                     console.log(error);
                     result.innerHTML = 'Something went wrong!';
                  })
                  .then(function () {
                     form.reset();
                     form.classList.remove('was-validated');
                     setTimeout(() => {
                        result.style.display = 'none';
                     }, 5000);
                  });
            }
            form.classList.add('was-validated');
         },
         false
      );
   });
})();

// сохраняет состояние чекбокса при закрытии модального окна и восстанавливает его при повторном открытии
document.addEventListener('DOMContentLoaded', function () {
   var checkbox = document.getElementById('flexCheck');
   var modal = document.getElementById('modal-send');
   var checkboxState = false;

   modal.addEventListener('hide.bs.modal', function () {
      checkboxState = checkbox.checked;
   });

   modal.addEventListener('show.bs.modal', function () {
      checkbox.checked = checkboxState;
   });
});

// Show modal
new bootstrap.Modal(document.getElementById('modal-send')).show();
// new bootstrap.Modal(document.getElementById('modal-success')).show();
// new bootstrap.Modal(document.getElementById('modal-error')).show();
// new bootstrap.Modal(document.getElementById('processing-data')).show();
// new bootstrap.Modal(document.getElementById('processing-data2')).show();

// Coocies message
const toastTrigger = document.getElementById('liveToastBtn');
const toastLive = document.getElementById('liveToast');

if (toastTrigger) {
   document.addEventListener('DOMContentLoaded', (event) => {
      const toastLive = document.getElementById('liveToast');
      var toastBootstrap = new bootstrap.Toast(toastLive, {
         autohide: false, // автоматичесикое скрытие (true / false)
         // delay: 2000, // скрытие через мс
      });
      toastBootstrap.show(); // автоматическое отображение при загрузке страницы
      toastBootstrap.hide(); //? скрыто
   });
}

// Применяемые методы для Tooltip bootstrap (применяется к '.spider')
// const tooltipElement = document.querySelector('.spider');
// const tooltip = bootstrap.Tooltip.getInstance(tooltipElement);
// tooltip.show(); // всегда показан
