/*back-button*/
document.getElementById('back-button').addEventListener('click', () => {
  window.history.back();
});
/*lupa*/
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
/*categorias*/
document.getElementById('categorias').addEventListener('click', function() {
  const categoriasMenu = document.getElementById('categoriasMenu');
  if (categoriasMenu.style.display === 'none') {
      categoriasMenu.style.display = 'block';
  } else {
      categoriasMenu.style.display = 'none';
  }
});

document.addEventListener('click', function(event) {
  const categoriasMenu = document.getElementById('categoriasMenu');
  const categorias = document.getElementById('categorias');
  if (!categorias.contains(event.target) && !categoriasMenu.contains(event.target)) {
      categoriasMenu.style.display = 'none';
  }
});

document.querySelectorAll('.categoriaopc').forEach(button => {
  button.addEventListener('click', function() {
    const categoria = this.getAttribute('categoria');
    updateHeaderText(categoria);
    if (categoria === 'Todos') {
      displayProducts(allProducts, 'todosproducts');
    } else {
      const filteredProducts = allProducts.filter(product => product.categoria === categoria);
      displayProducts(filteredProducts, 'todosproducts');
    }
  });
});

function updateHeaderText(categoria) {
  const header = document.getElementById('productostod');
  header.textContent = categoria.toUpperCase();
}
/*usuario*/
document.addEventListener('click', function(event) {
  const dropdownToggle = document.getElementById('dropdown-toggle');
  const dropdownContent = document.querySelector('.dropdown-content');
  const isClickInside = dropdownContent.contains(event.target) || dropdownToggle.contains(event.target);

  if (!isClickInside) {
      dropdownToggle.checked = false;
  }
});