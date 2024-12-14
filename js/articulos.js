// URL para la conexión con la API de cambio de monedas. Esta información se actualiza diariamente trayendo la tasa de conversion al momento de visitar el sitio
const API_URL = "https://api.exchangerate-api.com/v4/latest/ARS";

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Lista de artículos utilizando objeto articulos, en caso de querer agregar mas artículos hay que incrementar la cantidad en el ID y completar los campos
const articulos = [
    { id: 1, nombre: "Rociador Limpia Llantas", precio: 3600, imagen: "../assets/img/limpia_llantas_600x906.jpg", informacion: "Rociador para limpiar las llantas del vehículo" },
    { id: 2, nombre: "Rociador Cera Brillo", precio: 3500, imagen: "../assets/img/cera_brillo_600x906.jpg", informacion: "Rociador para darle brillo al auto" },
    { id: 3, nombre: "Rociador Desengrasante", precio: 3700, imagen: "../assets/img/desengrasante_de_motores_600x906.jpg", informacion: "Rociador para desengrasar el motor del auto" },
    { id: 4, nombre: "Rociador Saca Bichos", precio: 3650, imagen: "../assets/img/sacabichos_600x906.jpg", informacion: "Rociador sacabichos del capot y parabrisas" },
    { id: 5, nombre: "Spray Anti Empañante", precio: 4200, imagen: "../assets/img/anti_fog_600x906.jpg", informacion: "Rociador para limpiar las llantas del vehículo" },
    { id: 6, nombre: "Shampoo Carrocería", precio: 4800, imagen: "../assets/img/shampoo_600x906.jpg", informacion: "Shampoo con silicona para carrocerias" },
    { id: 7, nombre: "Silicona Exterior Liquida", precio: 5000, imagen: "../assets/img/silicona_exterior_600x906.jpg", informacion: "Silicona para uso exterior en cubiertas o plásticos" },
    { id: 8, nombre: "Silicona Interior Liquida", precio: 5900, imagen: "../assets/img/silicona_interior_600x906.jpg", informacion: "Silicona para uso interior en tablero y plásticos de puertas" },
    { id: 9, nombre: "Aerosol Silicona", precio: 8200, imagen: "../assets/img/silicona_aero_600x906.jpg", informacion: "Silicona en aerosol para interior y exteior" },
    { id: 10, nombre: "Liquido Limpia Parabrisas", precio: 4200, imagen: "../assets/img/limpia_parabrisas_600x906.jpg", informacion: "Líquido limpiaparabrisas concentrado" },
    { id: 11, nombre: "Pasta Limpia Manos", precio: 2800, imagen: "../assets/img/limpia_manos_600x906.jpg", informacion: "Pasta limpiamanos" },
    { id: 12, nombre: "Desengrasante Profesional", precio: 10000, imagen: "../assets/img/desengrasante_profesional_600x906.jpg", informacion: "Desengrasante concentrado de uso profesional para lavaderos" },
];

// Función para cargar los productos en la galería de imágenes de la página productos.html
async function cargarGaleria() {
    const gallery = document.getElementById("gallery");
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const tasaCambio = data.rates.USD;

        articulos.forEach(articulo => {
            const precioUSD = (articulo.precio * tasaCambio).toFixed(2);

            const card = document.createElement("div");
            card.className = "col-md-4";
            card.innerHTML = `
                <div class="card">
                    <img src="${articulo.imagen}" class="card-img-top" alt="${articulo.nombre}" data-id="${articulo.id}">
                    <div class="card-body">
                        <h5 class="card-title">${articulo.nombre}</h5>
                        <p class="card-price">Precio: $${articulo.precio} ARS / $${precioUSD} USD</p>
                    </div>
                </div>
            `;
            gallery.appendChild(card);
        });

        gallery.addEventListener("click", mostrarDetalle);

    } catch (error) {
        console.error("Error al cargar la API de conversión:", error);
    }
}

// Función para mostrar información detallada del artículo al hacer click en el producto. La clase detalle permanece oculta y se muestra solo al hacer click en el articulo.
function mostrarDetalle(event) {
    const img = event.target.closest(".card-img-top");
    if (!img) return;

    const id = parseInt(img.dataset.id);
    const articulo = articulos.find(a => a.id === id);

    document.getElementById("detalleImagen").src = articulo.imagen;
    document.getElementById("detalleNombre").textContent = articulo.nombre;
    document.getElementById("detalleInformacion").textContent = articulo.informacion;
    document.getElementById("detallePrecio").textContent = `Precio: $ ${articulo.precio} ARS`;

    document.getElementById("agregarCarrito").onclick = () => agregarAlCarrito(articulo);

    const modal = new bootstrap.Modal(document.getElementById("detalleModal"));
    modal.show();
}


// Función para agregar artículo al carrito  y mostrar alerta con SweetAlert
function agregarAlCarrito(articulo) {
    const existente = carrito.find(item => item.id === articulo.id);
    
    if (existente) {
        existente.cantidad++;
        // Alerta indicando que se incrementó la cantidad del artículo que ya existía en el pedido del carrito
        Swal.fire({
            title: 'Artículo actualizado',
            text: `La cantidad del artículo "${articulo.nombre}" se ha incrementado en el carrito.`,
            icon: 'info',
            confirmButtonText: 'Aceptar',
            timer: 3000,
            confirmButtonColor: '#444444', 
            background: '#333333',
            color: '#ffffff',     
        });
    } else {
        carrito.push({ ...articulo, cantidad: 1 });
        // Alerta indicando que se añadió un nuevo artículo, que no existía en el pedido
        Swal.fire({
            title: 'Artículo añadido',
            text: `El artículo "${articulo.nombre}" ha sido añadido al carrito.`,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            timer: 3000,
            confirmButtonColor: '#444444',
            background: '#333333',
            color: '#ffffff',

        });
    }

    guardarCarrito(); 
}


// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Cargar carrito almacenado en localstorage en carrito.html
function cargarCarrito() {
    carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const carritoItems = document.getElementById("carritoItems");
    const carritoTotal = document.getElementById("carritoTotal");
    carritoItems.innerHTML = "";

    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        carritoItems.innerHTML += `
            <tr>
                <td>${item.nombre}</td>
                <td>$${item.precio}</td>
                <td><input type="number" value="${item.cantidad}" data-id="${item.id}" class="cantidad-input"></td>
                <td>$${subtotal}</td>
                <td>
                    <button class="btn btn-danger btn-sm" data-id="${item.id}">Eliminar</button>
                </td>
            </tr>
        `;
    });

    carritoTotal.textContent = `$${total}`; // Actualiza el total en la tabla


    document.querySelectorAll(".cantidad-input").forEach(input =>
        input.addEventListener("change", actualizarCantidad)
    );

    document.querySelectorAll(".btn-danger").forEach(btn =>
        btn.addEventListener("click", eliminarArticulo)
    );
}

// Funcion para Actualizar cantidad de un artículo
function actualizarCantidad(event) {
    const id = parseInt(event.target.dataset.id);
    const nuevaCantidad = parseInt(event.target.value);
    const item = carrito.find(item => item.id === id);
    if (item) {
        item.cantidad = nuevaCantidad;
    }
    guardarCarrito();
    cargarCarrito();
}

// Función para Eliminar un artículo del carrito
function eliminarArticulo(event) {
    const id = parseInt(event.target.dataset.id);
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    cargarCarrito();
}

// Funcion para Inicializar la galeria y el carrito
if (document.getElementById("gallery")) {
    document.addEventListener("DOMContentLoaded", cargarGaleria);
}

if (document.getElementById("carrito")) {
    document.addEventListener("DOMContentLoaded", cargarCarrito);
}



//Esta seccion tengo que revisar ya que no está enviando el formulario con el pedido de forma correcta. Sale el confirmación que se envió el formulario, pero el mail no llega
//como esto era algo adicional que estaba probando, queda en segundo plano, pero en esta instancia y a modo referencial lo dejo así, ya que no influiría en la entrega final.


// Prepara el contenido del pedido en formato adecuado adaptandolo al formato de Formspree y lo guarda en la variable contenidoPedido que iría en el campo oculto "comentario"
function prepararPedido() {
    const pedidoInput = document.getElementById("pedidoInput");
    let contenidoPedido = carrito.map(item =>
        `Artículo: ${item.nombre}, Cantidad: ${item.cantidad}, Subtotal: $${(item.precio * item.cantidad).toFixed(2)}`
    ).join("\n");
    
    let total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2);
    contenidoPedido += `\nTotal: $${total}`;
    
    pedidoInput.value = contenidoPedido;
 
}

// Habilitar o deshabilitar el botón de enviar pedido, ya que en caso que no haya articulos cargados en el carrito, no tiene que estar habilitado (esto está funcionando correctamente)
function actualizarEstadoFormulario() {
    const enviarPedido = document.getElementById("enviarPedido");
    enviarPedido.disabled = carrito.length === 0;
}

// Vaciar el carrito al apretar el botón "Vaciar Carrito" 
function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    cargarCarrito();
    actualizarEstadoFormulario();
}
// Validar el formato del correo electrónico utilizando expresión regular (funciona correcto)
function validarCorreo(correo) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(correo);
}


// Con esta funcion se solicitan los datos de Nombre y Mail, para poder completar el envío del pedido (está funcionando correctamente junto con la validacion de los campos)
// SweetAlert también tiene funciones para la validación de los campos y son utilizadas en esta seccion
async function solicitarDatosUsuario() {
    const { value: formValues } = await Swal.fire({
        title: 'Ingresa tus datos',
        html: `
            <label for="swal-input-nombre" style="display:block; text-align:left; margin-bottom:5px; color:#ffffff;">Nombre</label>
            <input id="swal-input-nombre" class="swal2-input" placeholder="Tu nombre completo">
            
            <label for="swal-input-correo" style="display:block; text-align:left; margin-bottom:5px; color:#ffffff;">Correo Electrónico</label>
            <input id="swal-input-correo" class="swal2-input" placeholder="Tu correo electrónico" type="email">
        `,
        focusConfirm: false,
        preConfirm: () => {
            const nombre = document.getElementById('swal-input-nombre').value.trim();
            const correo = document.getElementById('swal-input-correo').value.trim();

            if (!nombre) {
                Swal.showValidationMessage('El nombre es obligatorio');
                return null;
            }

            if (!correo) {
                Swal.showValidationMessage('El correo electrónico es obligatorio');
                return null;
            }

            if (!validarCorreo(correo)) {
                Swal.showValidationMessage('El formato del correo electrónico es inválido');
                return null;
            }

            return { nombre, correo };
        },
        background: '#333333',
        color: '#ffffff',
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        showCancelButton: true
    });

    return formValues;
}




// Modifica la forma del contenido del carrito para adaptarla al campo de texto para enviar en el formulario de Formspree (al imprimirlo en consola devuelve correctamente el pedido completo)
function prepararPedido() {
    const pedidoInput = document.getElementById("pedidoInput");
    let contenidoPedido = carrito.map(item =>
        `Artículo: ${item.nombre}, Cantidad: ${item.cantidad}, Subtotal: $${(item.precio * item.cantidad).toFixed(2)}`
    ).join("\n");
    
    let total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2);
    contenidoPedido += `\nTotal: $${total}`;
    
    pedidoInput.value = contenidoPedido; 
    console.log(contenidoPedido) // Asignar el contenido al textarea oculto para enviarlo al formulario
}

// Habilitar o deshabilitar el botón de enviar pedido
function actualizarEstadoFormulario() {
    const enviarPedido = document.getElementById("enviarPedido");
    enviarPedido.disabled = carrito.length === 0;
}

// Vaciar el carrito al apretar el botón "Vaciar Carrito"
function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    cargarCarrito();
    actualizarEstadoFormulario();
}

// Escuchar el envío del formulario para actualizar el contenido y agregar el correo
const pedidoForm = document.getElementById("pedidoForm");
if (pedidoForm) {
    pedidoForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevenir recarga de la página
        
        // Preparar los datos del pedido
        prepararPedido();

        // Solicitar nombre y correo electrónico en una única alerta
        const datosUsuario = await solicitarDatosUsuario();

        if (datosUsuario) {
            const { nombre, correo } = datosUsuario;

            // Agregar nombre y correo al campo oculto para ser enviados
            const pedidoInput = document.getElementById("pedidoInput");
            pedidoInput.value = `Nombre: ${nombre}\nCorreo: ${correo}\n\n${pedidoInput.value}`;

            // Enviar el formulario a Formspree
            pedidoForm.submit();
        } else {
            Swal.fire({
                title: 'Datos incompletos',
                text: 'Se requiere tanto el nombre como el correo electrónico para enviar el pedido.',
                icon: 'error',
                confirmButtonColor: '#ff0000',
                background: '#333333',
                color: '#ffffff'
            });
        }
    });
}

// Escuchar el clic en el botón "Vaciar Carrito", y controla si tiene items o no el carrito para mostrar las alertas correspondientes
const botonVaciar = document.getElementById("vaciarCarrito");
if (botonVaciar) {
    botonVaciar.addEventListener("click", () => {
        if (carrito.length === 0) {
            Swal.fire({
                title: 'Carrito sin artículos',
                text: 'No hay artículos en el carrito para vaciar.',
                icon: 'info',
                confirmButtonColor: '#ff0000',
                background: '#333333',
                color: '#ffffff',
            });
            return;
        }

        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esto vaciará todo el carrito. Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, vaciar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#ff0000',
            cancelButtonColor: '#444444',
            background: '#333333',
            color: '#ffffff',
        }).then((result) => {
            if (result.isConfirmed) {
                vaciarCarrito();
                Swal.fire({
                    title: 'Carrito vacío',
                    text: 'El carrito se ha vaciado correctamente.',
                    icon: 'success',
                    confirmButtonColor: '#ff0000',
                    background: '#333333',
                    color: '#ffffff',
                });
            }
        });
    });
}

// Al cargar la página, actualizar el estado del botón de envío
document.addEventListener("DOMContentLoaded", () => {
    actualizarEstadoFormulario();
});
