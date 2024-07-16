export default function ReadingLine() {
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
}
