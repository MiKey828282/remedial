document.addEventListener('DOMContentLoaded', () => {
  loadFavorites();

  document.getElementById('clear-favorites').addEventListener('click', () => {
      localStorage.removeItem('favorites');
      loadFavorites(); // Recargar la lista después de vaciar
  });
});


function loadFavorites() {
  const favoritesContainer = document.getElementById('favorites');
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  favoritesContainer.innerHTML = ''; // Limpiar contenedor antes de agregar productos

  favorites.forEach((product, index) => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');
      productDiv.innerHTML = `
          <img src="${product.imageUrl}" alt="${product.name}" />
          <div class="product-info">
              <h4>${product.name}</h4>
              <p>$${product.price}</p>
              <p>${product.categoria}</p>
              <button class="btn btn-danger btn-sm remove-favorite" data-index="${index}">Eliminar</button>
              <button class="btn btn-success btn-sm add-to-cart" data-id="${product.id}">Agregar al Carrito</button>
          </div>
      `;
      favoritesContainer.appendChild(productDiv);
  });

  // Agregar evento para eliminar productos individuales
  document.querySelectorAll('.remove-favorite').forEach(button => {
      button.addEventListener('click', function () {
          const index = this.getAttribute('data-index');
          removeFavorite(index);
      });
  });

  // Agregar evento para añadir productos al carrito
  document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', function () {
          const productId = this.getAttribute('data-id');
          displayCart(); // Actualizar carrito después de añadir el producto
      });
  });
}

function removeFavorite(index) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites.splice(index, 1);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  loadFavorites(); // Recargar la lista después de eliminar
}

async function addToCart(itemId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItem = cart.find(item => item.id === itemId);

  if (existingItem) {
      existingItem.quantity += 1;
  } else {
      const product = await getProductById(itemId);
      if (product) {
          product.quantity = 1;
          cart.push(product);
      }
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Producto agregado al carrito');
  
}

async function getProductById(id) {
  try {
      const response = await fetch(`https://66a189667053166bcabf3141.mockapi.io/producs/${id}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const product = await response.json();
      return product;
  } catch (error) {
      console.error('Error fetching product:', error);
      return null;
  }
}

/*back-button*/
document.getElementById('back-button').addEventListener('click', () => {
  window.history.back();
});

/*busqueda */
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
              <p>${product.detail}</p>
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
