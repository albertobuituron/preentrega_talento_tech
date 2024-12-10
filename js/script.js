// Evita el envío del formulario directamente
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault(); 

    // Validar campos
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const comentario = document.getElementById('comentario').value.trim();

    if (!nombre || !email || !comentario) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, completa todos los campos.',
        });
        return;
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingresa un correo electrónico válido.',
        });
        return;
    }

    // Si todo está correcto
    Swal.fire({
        icon: 'success',
        title: '¡Enviado!',
        text: 'Tu consulta fue enviada correctamente.',
    }).then(() => {
        document.getElementById('contactForm').submit(); // Envía el formulario
    });
});

