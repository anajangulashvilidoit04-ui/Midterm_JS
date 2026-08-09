let allProducts = [];
let currentSearch = "";

const fetchProducts = async () => {
  try {
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();

    allProducts = data.products.map((product) => ({
      ...product,
      quantity: 0,
    }));

    renderProducts(getFilteredProducts());
    displayCartSummary();
  } catch (error) {
    console.log(error);
  }
};

fetchProducts();

const searchInput = document.querySelector(".search-value");

searchInput.addEventListener("input", (event) => {
  currentSearch = event.target.value.trim().toLowerCase();
  renderProducts(getFilteredProducts());
});

const getFilteredProducts = () => {
  return allProducts.filter((product) =>
    product.title.toLowerCase().includes(currentSearch),
  );
};

const renderProducts = (productsToRender) => {
  const productsList = document.querySelector(".products-list");
  productsList.innerHTML = "";

  if (productsToRender.length === 0) {
    productsList.innerHTML = `<p>No products found</p>`;
    return;
  }

  productsToRender.forEach((product) => {
    const {
      title,
      price,
      description,
      brand,
      stock,
      images,
      quantity,
    } = product;

    const productCard = document.createElement("div");
    productCard.classList.add("card");

    const productImage = images?.[0] || "";

    productCard.innerHTML = `
      <img src="${productImage}" class="thumbnail" alt="${title}" />

      <div class="product-info">
        <h3>${title}</h3>
        <h4>${Math.round(price).toLocaleString()} GEL</h4>
        <p>${description}</p>
        <p><strong>Brand:</strong> ${brand}</p>
        <p><strong>Stock:</strong> ${stock}</p>

        <button class="decrease">-</button>
        <span class="quantity">Quantity: ${quantity}</span>
        <button class="increase">+</button>
      </div>
    `;

    const decreaseBtn = productCard.querySelector(".decrease");
    const increaseBtn = productCard.querySelector(".increase");
    const currentQuantity = productCard.querySelector(".quantity");

    decreaseBtn.addEventListener("click", () => {
      if (product.quantity > 0) {
        product.quantity--;
        currentQuantity.textContent = `Quantity: ${product.quantity}`;
        displayCartSummary();
      }
    });

    increaseBtn.addEventListener("click", () => {
      if (product.quantity < product.stock) {
        product.quantity++;
        currentQuantity.textContent = `Quantity: ${product.quantity}`;
        displayCartSummary();
      }
    });

    productsList.appendChild(productCard);
  });
};

const displayCartSummary = () => {
  const totalPrice = document.querySelector(".total-price");

  const priceSum = allProducts.reduce((acc, currentProduct) => {
    return acc + currentProduct.price * currentProduct.quantity;
  }, 0);

  totalPrice.textContent = `Total Price: ${Math.round(priceSum).toLocaleString()} GEL`;
};
