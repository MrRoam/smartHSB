(() => {
  const dialog = document.getElementById('bonus-dialog');
  if (typeof dialog?.showModal !== 'function') return;

  const trigger = document.getElementById('show-bonus-rules');
  const fallback = document.querySelector('.bonus-fallback');
  const body = dialog.querySelector('.bonus-dialog-body');
  body.append(fallback.querySelector('.bonus-rule-copy'));
  fallback.hidden = true;
  trigger.hidden = false;

  trigger.addEventListener('click', () => {
    dialog.showModal();
    body.scrollTop = 0;
  });
  dialog.addEventListener('close', () => trigger.focus({ preventScroll: true }));
})();
