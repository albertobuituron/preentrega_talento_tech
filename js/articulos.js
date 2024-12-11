// URL para la conexión con la API de cambio de monedas
const API_URL = "https://api.exchangerate-api.com/v4/latest/ARS";

let carrito = [];

// Lista de artículos utilizando objeto articulos, en caso de querer agregar mas artículos incrementar la cantidad en el ID y completar los campos
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

// Función para cargar los productos en la galería
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

// Mostrar detalles del artículo al hacer click en el producto
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


// Agregar artículo al carrito  y mostrar alerta con SweetAlert
function agregarAlCarrito(articulo) {
    const existente = carrito.find(item => item.id === articulo.id);
    
    if (existente) {
        existente.cantidad++;
        // Alerta indicando que se incrementó la cantidad del artículo que ya existía en el pedido
        Swal.fire({
            title: 'Artículo actualizado',
            text: `La cantidad del artículo "${articulo.nombre}" se ha incrementado en el carrito.`,
            icon: 'info',
            confirmButtonText: 'Aceptar',
            timer: 3000 
        });
    } else {
        carrito.push({ ...articulo, cantidad: 1 });
        // Alerta indicando que se añadió un nuevo artículo, que no existía en el pedido
        Swal.fire({
            title: 'Artículo añadido',
            text: `El artículo "${articulo.nombre}" ha sido añadido al carrito.`,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            timer: 3000
        });
    }

    guardarCarrito(); 
}


// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Cargar carrito en carrito.html
function cargarCarrito() {
    carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const carritoItems = document.getElementById("carritoItems");
    carritoItems.innerHTML = "";

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
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



//Esta seccion hay que revisar ya que no está enviando el formulario con el pedido

// Actualizar el contenido del formulario con los datos del carrito
function prepararPedido() {
    const pedidoInput = document.getElementById("pedidoInput");
    let contenidoPedido = carrito.map(item =>
        `Artículo: ${item.nombre}, Cantidad: ${item.cantidad}, Subtotal: $${item.precio * item.cantidad}`
    ).join("\n");
    pedidoInput.value = contenidoPedido;
}

// Habilitar o deshabilitar el botón de enviar pedido
function actualizarEstadoFormulario() {
    const enviarPedido = document.getElementById("enviarPedido");
    if (carrito.length > 0) {
        enviarPedido.disabled = false;
    } else {
        enviarPedido.disabled = true;
    }
}

// Vaciar el carrito al apretar el boton "Vaciar Carrito" en la página del carrito
function vaciarCarrito() {
    carrito = [];
    guardarCarrito(); 
    cargarCarrito(); 
    actualizarEstadoFormulario();
}





// Escuchar el envío del formulario para actualizar el contenido
const pedidoForm = document.getElementById("pedidoForm");
if (pedidoForm) {
    pedidoForm.addEventListener("submit", (e) => {
        prepararPedido();
    });
}

// Escuchar el clic en el botón "Vaciar Carrito"
const botonVaciar = document.getElementById("vaciarCarrito");
if (botonVaciar) {
    botonVaciar.addEventListener("click", () => {
        // Verificar si el carrito está vacío
        if (carrito.length === 0) {
            Swal.fire({
                title: 'Carrito sin artículos',
                text: 'No hay artículos en el carrito para vaciar.',
                icon: 'info',
                confirmButtonColor: '#ff0000', // Botón de confirmación rojo
                background: '#333333',        // Fondo de la alerta
                color: '#ffffff',             // Color del texto
            });
            return; // Salir de la función si el carrito está vacío
        }

        // Confirmar antes de vaciar el carrito
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esto vaciará todo el carrito. Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, vaciar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#ff0000', // Botón de confirmación rojo
            cancelButtonColor: '#444444', // Botón de cancelación gris oscuro
            background: '#333333',        // Fondo de la alerta
            color: '#ffffff',             // Color del texto
        }).then((result) => {
            if (result.isConfirmed) {
                vaciarCarrito(); // Llama a la función para vaciar el carrito
                Swal.fire({
                    title: 'Carrito vacío',
                    text: 'El carrito se ha vaciado correctamente.',
                    icon: 'success',
                    confirmButtonColor: '#ff0000', // Botón de confirmación rojo
                    background: '#333333',        // Fondo de la alerta
                    color: '#ffffff',             // Color del texto
                });
            }
        });
    });
}

// Al cargar la página, actualizar el estado del botón de envío
document.addEventListener("DOMContentLoaded", () => {
    actualizarEstadoFormulario();
}
);


