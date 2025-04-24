// CalPal Nutrition Calculator Popup JS

document.addEventListener('DOMContentLoaded', function () {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const forms = {
    protein: document.getElementById('protein-form'),
    macros: document.getElementById('macros-form'),
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      // Switch active tab button
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Show/hide content
      tabContents.forEach(tc => {
        tc.style.display = (tc.id === btn.dataset.tab) ? 'block' : 'none';
      });
      // Reset form on tab switch
      Object.values(forms).forEach(form => form && form.reset && form.reset());
    });
  });
});

console.log('Popup loaded');
