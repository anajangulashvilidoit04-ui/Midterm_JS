let products = [];

const fetchProducts = async () => {
  try {
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();

    products = data.products;

    products.forEach((product) => {
      product.quantity = 0;
    });

    displayProducts(products);
    displayCartSummary();
  } catch (error) {
    console.log(error);
  }
};

fetchProducts();

const searchInput = document.querySelector(".search-value");

searchInput.addEventListener("input", (event) => {
  const value = event.target.value.toLowerCase();

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(value)
  );

  displayProducts(filteredProducts);
});

const displayProducts = (data) => {
  const productsList = document.querySelector(".products-list");

  productsList.innerHTML = "";

  data.forEach((product) => {
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

    productCard.innerHTML = `
      <img
        src="${images[0]}"
        class="thumbnail"
        alt="${title}"
      />

      <div class="product-info">

        <h3>${title}</h3>

        <h4>
          ${Math.round(price).toLocaleString()} GEL
        </h4>

        <p>${description}</p>

        <p>Brand: ${brand}</p>

        <p>Stock: ${stock}</p>

        <button class="decrease">-</button>

        <span class="quantity">
          Quantity: ${quantity}
        </span>

        <button class="increase">+</button>

      </div>
    `;

    const decreaseBtn =
      productCard.querySelector(".decrease");

    const increaseBtn =
      productCard.querySelector(".increase");

    const currentQuantity =
      productCard.querySelector(".quantity");

    decreaseBtn.addEventListener("click", () => {
      if (product.quantity > 0) {
        product.quantity--;

        currentQuantity.textContent =
          `Quantity: ${product.quantity}`;

        displayCartSummary();
      }
    });

    increaseBtn.addEventListener("click", () => {
      if (product.quantity < product.stock) {
        product.quantity++;

        currentQuantity.textContent =
          `Quantity: ${product.quantity}`;

        displayCartSummary();
      }
    });

    productsList.appendChild(productCard);
  });
};

const displayCartSummary = () => {
  const totalPrice =
    document.querySelector(".total-price");

  const priceSum = products.reduce(
    (acc, currentProduct) => {
      return (
        acc +
        currentProduct.price *
          currentProduct.quantity
      );
    },
    0
  );

  totalPrice.textContent =
    `Total Price: ${Math.round(priceSum).toLocaleString()} GEL`;
};
