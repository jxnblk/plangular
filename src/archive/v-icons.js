/*

  Vue Icons directive
 
  Icons from Geomicons Open http://jxnblk.github.io/geomicons-open
 
  Usage:

    <svg v-icon="'play'"></svg>

*/

'use strict';


var sprite = {
  play: 'M0 0 L32 16 L0 32 z',
  pause: 'M0 0 H12 V32 H0 z M20 0 H32 V32 H20 z',
  previous: 'M0 0 H4 V14 L32 0 V32 L4 18 V32 H0 z',
  next: 'M0 0 L28 14 V0 H32 V32 H28 V18 L0 32 z',
  close: 'M4 8 L8 4 L16 12 L24 4 L28 8 L20 16 L28 24 L24 28 L16 20 L8 28 L4 24 L12 16 z',
  chevronRight: 'M12 1 L26 16 L12 31 L8 27 L18 16 L8 5 z',
  chevronLeft: 'M20 1 L24 5 L14 16 L24 27 L20 31 L6 16 z',
  heart: 'M0 10 C0 6, 3 2, 8 2 C12 2, 15 5, 16 6 C17 5, 20 2, 24 2 C30 2, 32 6, 32 10 C32 18, 18 29, 16 30 C14 29, 0 18, 0 10'
};

Vue.directive('plangular-icon', function(value) {
  var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', sprite[value]);
  this.el.appendChild(path);
    //var vb = this.el.getAttribute('viewBox') || '0 0 32 32';
  this.el.setAttribute('viewBox', '0 0 32 32');
  this.el.setAttribute('style', 'max-height:100%');
  this.el.setAttribute('fill', 'currentColor');
  this.el.classList.add('plangular-icon', 'plangular-icon-' + value);
});

