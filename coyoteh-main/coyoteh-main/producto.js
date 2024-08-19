/*usuario*/
document.addEventListener('click', function(event) {
  const dropdownToggle = document.getElementById('dropdown-toggle');
  const dropdownContent = document.querySelector('.dropdown-content');
  const isClickInside = dropdownContent.contains(event.target) || dropdownToggle.contains(event.target);

  if (!isClickInside) {
      dropdownToggle.checked = false;
  }
});

/*producto*/
document.getElementById('back-button').addEventListener('click', () => {
    window.history.back();
  });
  
  const selectedProduct = JSON.parse(localStorage.getItem('selectedProduct'));
  
  if (selectedProduct) {
    document.getElementById('detail-image').src = selectedProduct.imageUrl;
    document.getElementById('detail-name').textContent = selectedProduct.name;
    document.getElementById('detail-price').textContent = `$${selectedProduct.price}`;
    document.getElementById('detail-description').textContent = selectedProduct.description;
  }
  
  document.getElementById('add-to-cart').addEventListener('click', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(selectedProduct);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${selectedProduct.name} ha sido añadido al carrito`);
  });

  const image = document.getElementById('detail-image');
const container = document.querySelector('.image-container');

container.addEventListener('mousemove', (e) => {
  const rect = image.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const zoomed = document.createElement('div');
  zoomed.classList.add('zoomed');
  zoomed.style.backgroundImage = `url(${image.src})`;
  zoomed.style.backgroundSize = `${image.width * 2}px ${image.height * 2}px`;
  zoomed.style.backgroundPosition = `-${x * 2}px -${y * 2}px`;
  
  if (!container.contains(zoomed)) {
    container.appendChild(zoomed);
  }

  zoomed.style.display = 'block';

  container.addEventListener('mousemove', (e) => {
    const rect = image.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    zoomed.style.backgroundPosition = `-${x * 2}px -${y * 2}px`;
  });

  container.addEventListener('mouseleave', () => {
    zoomed.style.display = 'none';
  });
});
let quantity = 1; // Cantidad inicial

document.getElementById('increase-quantity').addEventListener('click', () => {
    quantity++;
    document.getElementById('product-quantity').textContent = quantity;
});

document.getElementById('decrease-quantity').addEventListener('click', () => {
    if (quantity > 1) {
        quantity--;
        document.getElementById('product-quantity').textContent = quantity;
    }
});

document.getElementById('add-to-cart').addEventListener('click', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const productToAdd = {
        ...selectedProduct,
        quantity: quantity // Agregamos la cantidad seleccionada
    };

    // Verificamos si el producto ya está en el carrito
    const existingProductIndex = cart.findIndex(item => item.name === selectedProduct.name);

    if (existingProductIndex !== -1) {
        // Si ya existe, actualizamos la cantidad
        cart[existingProductIndex].quantity += quantity;
    } else {
        // Si no existe, lo agregamos al carrito
        cart.push(productToAdd);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${quantity} ${selectedProduct.name}(s) ha(n) sido añadido(s) al carrito`);

    // Reiniciamos la cantidad a 1 después de agregar al carrito
    quantity = 1;
    document.getElementById('product-quantity').textContent = quantity;
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

const viewCartBtn = document.getElementById('view-cart');
viewCartBtn.addEventListener('click', () => {
  window.location.href = 'carrito.html';
});
