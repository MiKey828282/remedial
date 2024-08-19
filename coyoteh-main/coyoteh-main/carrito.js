document.addEventListener('click', function(event) {
  const dropdownToggle = document.getElementById('dropdown-toggle');
  const dropdownContent = document.querySelector('.dropdown-content');
  const isClickInside = dropdownContent.contains(event.target) || dropdownToggle.contains(event.target);

  if (!isClickInside) {
      dropdownToggle.checked = false;
  }
});
/*back-button*/
document.getElementById('back-button').addEventListener('click', () => {
  window.history.back();
});

/*carrito*/
async function getProductById(id) {
  try {
    const response = await fetch(`https://66a189667053166bcabf3141.mockapi.io/producs/${id}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const product = await response.json();
    // Asegurarse de que el precio se convierta a número
    product.price = parseFloat(product.price) || 0;
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function addToCart(itemId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItem = cart.find(item => item.id === itemId);
  console.log('Existing item:', existingItem);
  console.log('Cart:', cart);
  if (existingItem) {
    existingItem.quantity = parseInt(existingItem.quantity);
    if (isNaN(existingItem.quantity)) {
      existingItem.quantity = 2; 
    } else {
      existingItem.quantity += 1;
    }
  } else {
    const product = await getProductById(itemId);
    if (product) {
      product.price = parseFloat(product.price);
      if (isNaN(product.price)) {
        product.price = 0; // Default to 0 if price is not a valid number
      }
      product.quantity = 1; 
      cart.push(product);
    }
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart(); 
}

function removeFromCart(itemId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const itemIndex = cart.findIndex(item => item.id === itemId);

  if (itemIndex > -1) {
    const item = cart[itemIndex];
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.splice(itemIndex, 1);
    }
  }
  


  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart(); 
}

async function displayCart() {
  const cartItemsContainer = document.getElementById('cart-items');
  const totalAmountElement = document.getElementById('total-amount');
  const totalItemsElement = document.getElementById('total-items');

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>El carrito está vacío.</p>';
    totalAmountElement.textContent = '$0.00';
    totalItemsElement.textContent = 'Productos (0): $0.00';
    return;
  }

  let totalAmount = 0;
  let totalItems = 0;

  for (const item of cart) {
    const cartItemDiv = document.createElement('div');
    cartItemDiv.classList.add('cart-item');

    const img = document.createElement('img');
    img.src = item.imageUrl;
    img.alt = item.name;

    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('cart-item-details');

    const name = document.createElement('h4');
    name.textContent = item.name;

    const itemPrice = parseFloat(item.price);
    const price = document.createElement('p');
    price.textContent = `$${(itemPrice * (item.quantity || 1)).toFixed(2)}`;

    const quantity = document.createElement('p');
    quantity.textContent = `Cantidad: ${item.quantity || 1}`;

    detailsDiv.appendChild(name);
    detailsDiv.appendChild(price);
    detailsDiv.appendChild(quantity);

    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('cart-item-actions');

    const decrementButton = document.createElement('button');
    decrementButton.textContent = '-';
    decrementButton.classList.add('btn', 'opccarr');
    decrementButton.onclick = () => removeFromCart(item.id);

    

    const incrementButton = document.createElement('button');
    incrementButton.textContent = '+';
    incrementButton.classList.add('btn', 'opccarr');
    incrementButton.onclick = () => addToCart(item.id);

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<span class="material-symbols-outlined">delete</span>';
        deleteButton.classList.add('btn', 'eliminar');
        deleteButton.onclick = () => deleteFromCart(item.id);

    actionsDiv.appendChild(decrementButton);
    actionsDiv.appendChild(incrementButton);
    actionsDiv.appendChild(deleteButton);

    cartItemDiv.appendChild(img);
    cartItemDiv.appendChild(detailsDiv);
    cartItemDiv.appendChild(actionsDiv);

    cartItemsContainer.appendChild(cartItemDiv);

    totalAmount += itemPrice * (item.quantity || 1);
    totalItems += item.quantity || 1;
  }

  totalAmountElement.textContent = `$${totalAmount.toFixed(2)}`;
  totalItemsElement.textContent = `Productos (${totalItems}): $${totalAmount.toFixed(2)}`;
}
document.addEventListener('DOMContentLoaded', displayCart);
function deleteFromCart(itemId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.id !== itemId); // Filtrar el producto a eliminar
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart(); // Actualizar el carrito en la página
}

document.getElementById('empty-cart').addEventListener('click', function() {
  if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
    emptyCart();
  }
});

function emptyCart() {
  localStorage.removeItem('cart');
  displayCart();
}


// cancelar
document.getElementById('cancel-purchase').addEventListener('click', function() {
  var purchaseOptions = document.getElementById('purchase-options');
  purchaseOptions.style.display = 'none';
});

/*busquedaa */
document.addEventListener('DOMContentLoaded', displayCart);
document.getElementById('search-button').addEventListener('click', function(event) {
  const searchContainer = document.getElementById('search-container');
  const searchInput = document.getElementById('search-input');
  const searchResultsContainer = document.getElementById('search-results-container');
  
  // Mostrar el contenedor de búsqueda y enfocar en el campo de entrada
  searchContainer.classList.remove('hidden');
  searchInput.focus();

  // Limpiar el campo de entrada y los resultados anteriores
  searchInput.value = '';
  searchResultsContainer.innerHTML = '';

  // Evitar que el clic en el botón cierre la barra de búsqueda
  event.stopPropagation();
});

document.getElementById('search-input').addEventListener('input', function() {
  const query = this.value.toLowerCase();
  
  // Solo buscar si hay al menos una letra en el campo de entrada
  if (query.length > 0) {
      fetchProductsAndDisplay(query);
  } else {
      // Si no hay texto en el campo, limpiar los resultados
      document.getElementById('search-results-container').innerHTML = '';
  }
});

function fetchProductsAndDisplay(query) {
  const apiUrl = 'https://66a189667053166bcabf3141.mockapi.io/producs';
  
  fetch(apiUrl)
      .then(response => response.json())
      .then(products => {
          // Filtrar productos que contengan la query en su nombre
          const filteredProducts = products.filter(product => 
              product.name.toLowerCase().includes(query)
          );
          displaySearchResults(filteredProducts);
      })
      .catch(error => console.error('Error fetching products:', error));
}

function displaySearchResults(products) {
  const searchResultsContainer = document.getElementById('search-results-container');
  searchResultsContainer.innerHTML = ''; // Limpiar resultados anteriores

  if (products.length === 0) {
      searchResultsContainer.innerHTML = '<p>No se encontraron productos.</p>';
      return;
  }

  products.forEach(product => {
      const productElement = document.createElement('div');
      productElement.classList.add('product-item');
      productElement.innerHTML = `
          <div class="product-content">
              <img src="${product.imageUrl}" alt="${product.name}">
              <h4>${product.name}</h4>
              <p class="price">$${product.price}</p>
          </div>
      `;
      
      productElement.addEventListener('click', () => {
          // Guardar el producto seleccionado en localStorage
          localStorage.setItem('selectedProduct', JSON.stringify({
              id: product.id,
              name: product.name,
              imageUrl: product.imageUrl,
              price: product.price,
              description: product.detail
          }));
          // Redirigir a producto.html
          window.location.href = 'producto.html';
      });

      searchResultsContainer.appendChild(productElement);
  });
}

// Ocultar la barra de búsqueda al hacer clic en cualquier parte de la pantalla
document.addEventListener('click', function(event) {
  const searchContainer = document.getElementById('search-container');
  const searchButton = document.getElementById('search-button');

  if (!searchContainer.contains(event.target) && event.target !== searchButton) {
      searchContainer.classList.add('hidden');
  }
});
document.getElementById('search-button').addEventListener('click', function() {
  const query = document.getElementById('search-input').value;
  searchAPI(query);
});

function searchAPI(query) {
  fetch('https://66a189667053166bcabf3141.mockapi.io/producs')
      .then(response => response.json())
      .then(data => {
          const filteredData = data.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
          displayResults(filteredData);
      })
      .catch(error => console.error('Error:', error));
}

function displayResults(results) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';

  if (results.length === 0) {
      resultsContainer.innerHTML = '<p>No results found</p>';
      return;
  }

  results.forEach(item => {
      const div = document.createElement('div');
      div.classList.add('result-item');
      div.innerHTML = `
          <h3>${item.name}</h3>
          <p>ID: ${item.id}</p>
      `;
      resultsContainer.appendChild(div);
  });
}



// Mostrar el cuadro con animación de slide si hay productos en el carrito
document.getElementById('continue-purchase').addEventListener('click', function() {
  var cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  if (cart.length === 0) {
      alert('El carrito está vacío. Agrega productos antes de continuar.');
      return; // Detener si el carrito está vacío
  }

  var purchaseOptions = document.getElementById('purchase-options');
  purchaseOptions.style.display = 'block';
  purchaseOptions.style.opacity = 0;
  purchaseOptions.style.transition = 'opacity 0.5s ease';
  setTimeout(function() {
      purchaseOptions.style.opacity = 1;
  }, 10);
});

// Ocultar el cuadro de opciones
document.getElementById('cancel-purchase').addEventListener('click', function() {
  var purchaseOptions = document.getElementById('purchase-options');
  purchaseOptions.style.transition = 'opacity 0.5s ease';
  purchaseOptions.style.opacity = 0;
  setTimeout(function() {
      purchaseOptions.style.display = 'none';
  }, 500);
});

// Formatear número de tarjeta
document.getElementById('card-number').addEventListener('input', function(e) {
  let input = e.target.value.replace(/\D/g, ''); // Solo números
  input = input.substring(0, 16); // Limitar a 16 dígitos
  e.target.value = input.replace(/(\d{4})(?=\d)/g, '$1-'); // Agregar guiones cada 4 dígitos
});

// Formatear fecha de expiración
document.getElementById('card-expiry').addEventListener('input', function(e) {
  let input = e.target.value.replace(/\D/g, ''); // Solo números
  input = input.substring(0, 4); // Limitar a 4 dígitos
  e.target.value = input.replace(/(\d{2})(?=\d)/g, '$1/'); // Agregar slash después de los primeros 2 dígitos
});

// Limitar CVV a 3 números
document.getElementById('card-cvv').addEventListener('input', function(e) {
  e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3); // Solo 3 números
});

console.log('Price:', item.price, 'Quantity:', item.quantity);




