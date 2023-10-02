

const form = document.getElementById('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const request = new XMLHttpRequest();
  request.open("POST", "http://localhost:3003/submit");
  request.send(formData);

});