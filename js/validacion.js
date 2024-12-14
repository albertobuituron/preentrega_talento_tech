// Evita el envío del formulario directamente
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault(); 

    // Validar campos del formulario de contacto
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const comentario = document.getElementById('comentario').value.trim();

    if (!nombre || !email || !comentario) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, completa todos los campos.',
            confirmButtonColor: '#ff0000',
            cancelButtonColor: '#444444',
            background: '#333333',
            color: '#ffffff',
            });
        return;
    }

    // Validar el formato de correo electronico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        Swal.fire({
            icon: 'error',
            title: 'Error en campo Correo Electronico',
            text: 'Por favor, ingresa un correo electrónico válido.',
            confirmButtonColor: '#ff0000', 
            cancelButtonColor: '#444444',
            background: '#333333',
            color: '#ffffff',


        });
        return;
    }

    // Mensaje de verificación si están todos los campos correctos 
    Swal.fire({
        icon: 'success',
        title: '¡Mensaje Enviado!',
        text: 'Tu consulta fue enviada correctamente.',
        confirmButtonColor: '#ff0000', 
        cancelButtonColor: '#444444',
        background: '#333333',
        color: '#ffffff',



    }).then(() => {
        document.getElementById('contactForm').submit(); // Envía el formulario
    });
});


