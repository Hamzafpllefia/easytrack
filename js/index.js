var radioEmail = document.getElementById('email');
var radioWhatsapp = document.getElementById('whatsapp');

var contenedorEmail = document.querySelector('.email');
var contenedorWhatsapp = document.querySelector('.whatsapp');

radioEmail.addEventListener('change', function() {
    contenedorEmail.classList.add('selected');
    contenedorWhatsapp.classList.remove('selected');
});

radioWhatsapp.addEventListener('change', function() {
    contenedorWhatsapp.classList.add('selected');
    contenedorEmail.classList.remove('selected');
});
