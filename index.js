let products = [];

// 1. მონაცემების წამოღება API-დან
const fetchProducts = async () => {
  try {
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();

    // მთავარი გასწორება: API-ს პროდუქტებს არ აქვთ quantity.
    // აუცილებელია თითოეულს თავიდანვე მივანიჭოთ quantity: 0, რომ + და - ღილაკებმა იმუშაოს!
    products = data.products.map((product) => {
      return {
        ...product,
        quantity: 0,
      };
    });

    displayProducts(products);
    displayCartSummary();
  } catch (error) {
    console.log("Error fetching products:", error);
  }
};

fetchProducts();

// 2. ლაივ ძებნა სათაურით
const searchInput = document.querySelector(".search-value");

searchInput.addEventListener("input", (event) => {
  const value = event.target.value.toLowerCase();

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(value),
  );

  displayProducts(filteredProducts);
});

// 3. პროდუქტების ეკრანზე გამოტანა
const displayProducts = (productsToDisplay) => {
  const productsList = document.querySelector(".products-list");
  productsList.innerHTML = "";

  productsToDisplay.forEach((product) => {
    const { title, price, description, brand, stock, images, quantity } = product;

    const productCard = document.createElement("div");
    productCard.classList.add("card");

    const productImage = images[0];

    productCard.innerHTML = `
      <img src="${productImage}" class="thumbnail" />

      <div class="product-info">
        <h3>${title}</h3>
        <h4>${Math.round(price).toLocaleString()} GEL</h4>
        <p>${description}</p>
        <p>Brand: ${brand || "N/A"}</p>
        <p>Stock: ${stock}</p>

        <button class="decrease">-</button>
        <span class="quantity">Quantity: ${quantity}</span>
        <button class="increase">+</button>
      </div>
    `;

    const decreaseBtn = productCard.querySelector(".decrease");
    const increaseBtn = productCard.querySelector(".increase");
    const currentQuantity = productCard.querySelector(".quantity");

    // დაკლება
    decreaseBtn.addEventListener("click", () => {
      if (product.quantity > 0) {
        product.quantity--;
        currentQuantity.textContent = `Quantity: ${product.quantity}`;
        displayCartSummary(); // იძახებს Total-ის ახლიდან დათვლას
      }
    });

    // მომატება
    increaseBtn.addEventListener("click", () => {
      product.quantity++;
      currentQuantity.textContent = `Quantity: ${product.quantity}`;
      displayCartSummary(); // იძახებს Total-ის ახლიდან დათვლას
    });

    productsList.appendChild(productCard);
  });
};

// 4. Cart Summary-ში ჯამური ფასის (Total Price) დათვლა
const displayCartSummary = () => {
  const totalPrice = document.querySelector(".total-price");

  const priceSum = products.reduce((acc, currentProduct) => {
    return acc + currentProduct.price * currentProduct.quantity;
  }, 0);

  totalPrice.textContent = `Total Price: ${Math.round(priceSum).toLocaleString()} GEL`;
};

        // ლოგიკა ღილაკებისთვის: როცა ვუმატებთ, მინუს ღილაკი აუცილებლად აქტიურდება
        decreaseBtn.disabled = false;

        // თუ მარაგის მაქსიმუმს მიაღწია, პლუს ღილაკს ვთიშავთ
        if (product.quantity === product.stock) {
          increaseBtn.disabled = true;
        }
      }
    });

    productsList.appendChild(productCard);
  });
};

// 4. კალათის ჯამური ფასის დათვლა
const displayCartSummary = () => {
  const totalPrice = document.querySelector(".total-price");

  const priceSum = products.reduce((acc, currentProduct) => {
    return acc + (currentProduct.price * currentProduct.quantity);
  }, 0);

  totalPrice.textContent = `Total Price: ${Math.round(priceSum).toLocaleString()} GEL`;
};
