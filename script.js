const reservationDialog = document.getElementById('reservation-dialog');
document.querySelectorAll('[data-reservation]').forEach(button => {
  button.addEventListener('click', () => reservationDialog.showModal());
});
reservationDialog.querySelectorAll('.dialog-close, .dialog-done').forEach(button => {
  button.addEventListener('click', () => reservationDialog.close());
});
reservationDialog.addEventListener('click', event => {
  if (event.target === reservationDialog) {
    const box = reservationDialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) reservationDialog.close();
  }
});
