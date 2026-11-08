/* The Dale mark: each plate is a wipe between a photograph and the mark drawn over it.
   A transparent range input on top does the work, so mouse, touch and arrow keys all behave the same. */
(function () {
  'use strict';
  const { $$ } = window.ST;
  $$('[data-ba]').forEach((fig) => {
    const range = fig.querySelector('.ba-range');
    const set = () => fig.style.setProperty('--pos', range.value + '%');
    range.addEventListener('input', set);
    set();
  });
})();
