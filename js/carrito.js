let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

const productoContenedor = document.getElementById('producto-contenedor');
const carritoContenedor = document.getElementById('carrito-contenedor');
const contadorCarrito = document.getElementById('contador-carrito');
const precioTotal = document.getElementById('precioTotal');
const finalizarCompraBtn = document.getElementById('finalizar-compra');


productoContenedor.addEventListener('click', (event) => {
  if (event.target.classList.contains('agregar')) {
    validarProductoCarrito(event.target.id);
  }
});

const validarProductoCarrito = (productoId) => {
  const estaRepetido = carrito.some((producto) => producto.id === productoId);

  if (estaRepetido) {
    const producto = carrito.find((producto) => producto.id === productoId);
    producto.cantidad++;
    const cantidad = document.getElementById(`cantidad${producto.id}`);
    cantidad.innerText = `Cantidad: ${producto.cantidad}`;
  } else {
    const producto = producto.find((producto) => producto.id === productoId);
    if (producto) {
      carrito.push({...producto, cantidad: 1});
      pintarProductoCarrito(producto);
    }
  }
  actualizarTotalCarrito();
  localStorage.setItem('carrito', JSON.stringify(carrito));
  contadorCarrito.innerText = `Carrito: ${carrito.length}`;
};

const pintarProductoCarrito = (producto) => {
  const div = document.createElement('div');
  div.classList.add('productoEnCarrito');
  div.innerHTML = `
    <p>${producto.nombre}</p>
    <p>$ ${producto.precio}</p>
    <p id=cantidad${producto.id}>Cantidad: ${producto.cantidad}</p>
    <button class="btn waves-effect waves-light boton-eliminar" value="${producto.id}">X</button>
  `;
  carritoContenedor.appendChild(div);
};

const eliminarProductoCarrito = (productoId) => {
  const productoIndex = carrito.findIndex((producto) => producto.id == productoId);

  if (productoIndex !== -1) {
    if (carrito[productoIndex].cantidad === 1) {
      carrito.splice(productoIndex, 1);
    } else {
      carrito[productoIndex].cantidad--;
    }
  }
  pintarCarrito();
  actualizarTotalCarrito();
};

const pintarCarrito = () => {
  carritoContenedor.innerHTML = '';
  carrito.forEach(producto => {
    pintarProductoCarrito(producto);
  });
};

const actualizarTotalCarrito = () => {
  const cantidadTotal = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
  const compraTotal = carrito.reduce((acc, producto) => acc + (producto.cantidad * producto.precio), 0);

  pintarTotalesCarrito(cantidadTotal, compraTotal);
  guardarCarritoStorage();
};

const pintarTotalesCarrito = (cantidadTotal, compraTotal) => {
  contadorCarrito.innerText = cantidadTotal;
  precioTotal.innerText = compraTotal;
};

const guardarCarritoStorage = () => {
  localStorage.setItem('carrito', JSON.stringify(carrito));
};

const finalizarCompra = () => {
  const compraTotal = carrito.reduce((acc, producto) => acc + (producto.cantidad * producto.precio), 0);
  Swal.fire({
    title: "Quieres terminar tu compra?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Terminar",
    denyButtonText: `Borrar`
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      Swal.fire("Tu compra ha sido exitosa!", "", "success");
    } else if (result.isDenied) {
      Swal.fire("Se han borrado los cambios.", "", "info");
    }
  });
  carrito = [];
  guardarCarritoStorage();
  pintarCarrito();
  actualizarTotalCarrito();
};

finalizarCompraBtn.addEventListener('click', finalizarCompra);

carritoContenedor.addEventListener('click', (event) => {
  if (event.target.classList.contains('boton-eliminar')) {
    eliminarProductoCarrito(event.target.value);
  }
});