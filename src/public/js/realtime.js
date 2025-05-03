const socket = io();
const form = document.getElementById('productForm');
const list = document.getElementById('productList');

// Función para renderizar productos
function renderProducts(products) {
    list.innerHTML = '';
    products.forEach(p => {
        const li = document.createElement('li');
        li.textContent = `${p.title} - $${p.price}`;
        list.appendChild(li);
    });
    }

    // Al recibir lista inicial
    socket.on('products', products => renderProducts(products));

    // Al recibir actualización
    socket.on('updateProducts', products => renderProducts(products));

    // Envío de formulario por WebSocket
    form.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(form);
    const product = {
        title: formData.get('title'),
        price: formData.get('price')
    };
    socket.emit('addProduct', product);
    form.reset();
});