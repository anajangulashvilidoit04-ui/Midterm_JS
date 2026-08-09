let products = [];

// 1. პროდუქტების წამოღება API-დან
const fetchProducts = async () => {
  try {
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();

    // თითოეულ პროდუქტს ვამატებთ quantity: 0 ველს
    products = data.products.map((product) => ({
      ...product,
      quantity: 0,
    }));

    displayProducts(products);
    displayCartSummary();
  } catch (error) {
    console.log("Error fetching products:", error);
  }
};

fetchProducts();

// 2. ლაივ ძებნა სათაურის მიხედვით
const searchInput = document.querySelector(".search-value");

searchInput.addEventListener("input", (event) => {
  const value = event.target.value.toLowerCase().trim();

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(value)
  );

  displayProducts(filteredProducts);
});

// 3. პროდუქტების ეკრანზე გამოტანა
const displayProducts = (productsToDisplay) => {
  const productsList = document.querySelector(".products-list");
  productsList.innerHTML = "";

  if (productsToDisplay.length === 0) {
    productsList.innerHTML = "<p>პროდუქტი ვერ მოიძებნა</p>";
    return;
  }

  productsToDisplay.forEach((product) => {
    const { title, price, description, brand, stock, images, thumbnail, quantity } = product;

    const productCard = document.createElement("div");
    productCard.classList.add("card");

    // უსაფრთხო სურათის ამოღება (თუ images[0] არ არსებობს, იყენებს thumbnail-ს)
    const productImage = (images && images.length > 0) ? images[0] : (thumbnail || "");

    const isMinusDisabled = quantity === 0 ? "disabled" : "";
    const isPlusDisabled = quantity >= stock ? "disabled" : "";

    productCard.innerHTML = `
      <img src="${productImage}" alt="${title}" class="thumbnail" />

      <div class="product-info">
        <h3>${title}</h3>
        <h4>${Math.round(price).toLocaleString()} GEL</h4>
        <p>${description}</p>
        <p><strong>Brand:</strong> ${brand || "N/A"}</p>
        <p><strong>Stock:</strong> ${stock}</p>

        <div class="controls">
          <button class="decrease" ${isMinusDisabled}>-</button>
          <span class="quantity">Quantity: ${quantity}</span>
          <button class="increase" ${isPlusDisabled}>+</button>
        </div>
      </div>
    `;

    const decreaseBtn = productCard.querySelector(".decrease");
    const increaseBtn = productCard.querySelector(".increase");
    const currentQuantity = productCard.querySelector(".quantity");

    // დაკლების ლოგიკა
    decreaseBtn.addEventListener("click", () => {
      if (product.quantity > 0) {
        product.quantity--;
        currentQuantity.textContent = `Quantity: ${product.quantity}`;
        displayCartSummary();

        increaseBtn.disabled = false;
        if (product.quantity === 0) {
          decreaseBtn.disabled = true;
        }
      }
    });

    // მომატების ლოგიკა
    increaseBtn.addEventListener("click", () => {
      if (product.quantity < product.stock) {
        product.quantity++;
        currentQuantity.textContent = `Quantity: ${product.quantity}`;
        displayCartSummary();

        decreaseBtn.disabled = false;
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
