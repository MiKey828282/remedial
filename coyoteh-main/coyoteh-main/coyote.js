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
              description: product.detail,
              quantity: 1
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

/*Carrucel*/
let currentIndex = 0;
let slideInterval;

function showSlide(index) {
  const slides = document.querySelector('.slides');
  const totalSlides = document.querySelectorAll('.slides img').length;

  if (index >= totalSlides) {
    currentIndex = 0;
  } else if (index < 0) {
    currentIndex = totalSlides - 1;
  } else {
    currentIndex = index;
  }

  const offset = -currentIndex * 100;
  slides.style.transform = `translateX(${offset}%)`;
}

function nextSlide() {
  showSlide(currentIndex + 1);
}

function startSlideShow() {
  slideInterval = setInterval(nextSlide, 3000); // Cambia de imagen cada 3 segundos
}

document.addEventListener('DOMContentLoaded', () => {
  showSlide(currentIndex);
  startSlideShow();
});

/*Productos*/
let allProducts = [];

fetch('https://66a189667053166bcabf3141.mockapi.io/producs')
  .then(response => response.json())
  .then(products => {
    allProducts = products; 
    displayProductsMV(products, 'products', 4); 
    displayProducts(products, 'todosproducts'); 
  })
  .catch(error => console.error('Error fetching products:', error));

document.querySelectorAll('.categoriaopc').forEach(button => {
    button.addEventListener('click', function() {
        const categoria = this.getAttribute('categoria');
        if (categoria === 'Todos') {
            displayProducts(allProducts, 'todosproducts');
        } else {
            const filteredProducts = allProducts.filter(product => product.categoria === categoria);
            displayProducts(filteredProducts, 'todosproducts');
        }
    });
});

function displayProducts(products, containerId) {
  const productContainer = document.getElementById(containerId);
  productContainer.innerHTML = '';
  products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');
    const img = document.createElement('img');
    img.src = product.imageUrl;
    img.alt = product.name;
    img.addEventListener('click', () => viewProductDetails(product));
    const productInfo = document.createElement('div');
    productInfo.classList.add('product-info');
    const name = document.createElement('h4');
    name.textContent = product.name;
    const price = document.createElement('p');
    price.textContent = `$${product.price}`;
    const categoria = document.createElement('p');
    categoria.textContent = `${product.categoria}`;
    const addToCartBtn = document.createElement('button');
    addToCartBtn.textContent = 'Agregar al carrito';
    addToCartBtn.classList.add('boton-agregar');
    addToCartBtn.addEventListener('click', () => addToCart(product));
    const addToFavoritesBtn = document.createElement('button');
    addToFavoritesBtn.textContent = 'Agregar a favoritos';
    addToFavoritesBtn.classList.add('boton-favoritos');
    addToFavoritesBtn.addEventListener('click', () => addToFavorites(product));
    productInfo.appendChild(name);
    productInfo.appendChild(price);
    productInfo.appendChild(categoria);
    productInfo.appendChild(addToCartBtn);
    productInfo.appendChild(addToFavoritesBtn);
    productDiv.appendChild(img);
    productDiv.appendChild(productInfo); 
    productContainer.appendChild(productDiv);
  });
}

function displayProductsMV(products, containerId, limit = null) {
  const productContainer = document.getElementById(containerId);
  productContainer.innerHTML = '';
  const productsToShow = limit ? products.slice(0, limit) : products;
  productsToShow.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');
    const img = document.createElement('img');
    img.src = product.imageUrl;
    img.alt = product.name;
    img.addEventListener('click', () => viewProductDetails(product));
    const productInfo = document.createElement('div');
    productInfo.classList.add('product-info');
    const name = document.createElement('h4');
    name.textContent = product.name;
    const price = document.createElement('p');
    price.textContent = `$${product.price}`; 
    const categoria = document.createElement('p');
    categoria.textContent = `${product.categoria}`;
    const addToCartBtn = document.createElement('button');
    addToCartBtn.textContent = 'Agregar al carrito';
    addToCartBtn.classList.add('boton-agregar');
    addToCartBtn.addEventListener('click', () => addToCart(product));
    const addToFavoritesBtn = document.createElement('button');
    addToFavoritesBtn.textContent = 'Agregar a favoritos';
    addToFavoritesBtn.classList.add('boton-favoritos');
    addToFavoritesBtn.addEventListener('click', () => addToFavorites(product));
    productInfo.appendChild(name);
    productInfo.appendChild(price);
    productInfo.appendChild(categoria);
    productInfo.appendChild(addToCartBtn);
    productInfo.appendChild(addToFavoritesBtn);
    productDiv.appendChild(img);
    productDiv.appendChild(productInfo);
    productContainer.appendChild(productDiv);
  });
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Verificar si el producto ya está en el carrito
  if (cart.some(item => item.id === product.id)) {
    alert(`${product.name} ya está en el carrito`);
    return; // Salir de la función si el producto ya está en el carrito
  }
  
  // Añadir la cantidad al producto
  product.quantity = 1;
  
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${product.name} ha sido añadido al carrito`);
}

function addToFavorites(product) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const isAlreadyFavorite = favorites.some(fav => fav.id === product.id);
  if (isAlreadyFavorite) { 
    alert(`${product.name} ya está en favoritos`);
  } else {
    favorites.push(product);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert(`${product.name} ha sido añadido a favoritos`);
  }
}

function viewProductDetails(product) {
  localStorage.setItem('selectedProduct', JSON.stringify(product));
  window.location.href = 'producto.html';
}

const viewCartBtn = document.getElementById('view-cart');
viewCartBtn.addEventListener('click', () => {
  window.location.href = 'carrito.html';
});

/*perfil*/
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


