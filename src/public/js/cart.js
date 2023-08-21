const cartButton = document.getElementById("cart-button");
const popup = document.getElementById("popup");
const closeButton = document.getElementById("close-button");
const cartItemsList = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const purcharseBtn = document.getElementById("purchase-button");
const before = document.getElementById("before");
const after = document.getElementById("after");
const bill = document.getElementById("bill");
const loader = document.getElementById("loader");
const productsNoFound = document.getElementById("productsNoFound");
const listProductsNoFound = document.getElementById("listProductsNoFound");
// Función para abrir el popup
function openPopup() {
  const idCart = localStorage.getItem("_idCart");

  popup.style.display = "block";
  axios
    .get(`/api/carts/${idCart}`)
    .then((response) => {
      const products = response.data.payload.products;
      displayProducts(products);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Función para cerrar el popup
function closePopup() {
  popup.style.display = "none";
}

// Asigna el evento clic al botón del carrito para abrir el popup
cartButton.addEventListener("click", openPopup);

// Asigna el evento clic al botón de cerrar para cerrar el popup
closeButton.addEventListener("click", closePopup);

document.addEventListener("click", (e) => {
  if (e.target.matches(".action-cart")) {
    const action = e.target.dataset.action;
    const _idProduct = e.target.dataset.id;

    const idCart = localStorage.getItem("_idCart");

    if (action === "minus" || action === "plus") {
      let amount = Number(e.target.dataset.amount);
      amount = action === "minus" ? amount - 1 : amount + 1;

      axios
        .put(`/api/carts/${idCart}/products/${_idProduct}`, {
          amount,
        })
        .then((response) => {
          const products = response.data.payload.products;
          displayProducts(products);
        })
        .catch((error) => {
          console.error("Error:", error);
          if (error.response.data.payload == "No stock")
            alert("No hay suficiente stock para agregar al carrito");
        });
    } else {
      axios
        .delete(`/api/carts/${idCart}/products/${_idProduct}`)
        .then((response) => {
          const products = response.data.payload.products;
          displayProducts(products);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }

  if (e.target.matches("#acept")) {
    window.location.reload();
  }
});

purcharseBtn.addEventListener("click", (e) => {
  before.classList.add("d-none");
  loader.classList.remove("d-none");

  const idCart = localStorage.getItem("_idCart");

  axios
    .post(`/api/carts/${idCart}/purchase`)
    .then((response) => {
      loader.classList.add("d-none");
      const salesCheck = response.data.payload;
      after.classList.remove("d-none");
      if (salesCheck) {
        document.getElementById("code").textContent = salesCheck.code;
        document.getElementById("amount").textContent = "$" + salesCheck.amount;
        document.getElementById("date").textContent =
          salesCheck.purchaseDateTime;
        bill.classList.remove("d-none");
      }

      const productsNoStock = response.data.productsNoStock;
      if (productsNoStock.length > 0) {
        productsNoFound.classList.remove("d-none");
        listProductsNoFound.innerHTML = "";
        productsNoStock.forEach((item) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${item.title}</td>
            <td>${item.stock}</td>
            <td>No Stock</td>
            `;
          listProductsNoFound.appendChild(tr);
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      if (error.response.data.payload == "No stock")
        alert("No hay suficiente stock para agregar al carrito");
    });
});

function displayProducts(products) {
  localStorage.setItem("cart", JSON.stringify(products));
  const cartCounter = document.getElementById("cart-counter");
  cartCounter.innerText = products.length.toString();
  const total = sumPrices(products);

  if (total > 0) {
    purcharseBtn.classList.remove("d-none");
    purcharseBtn.classList.add("d-block");
  } else {
    purcharseBtn.classList.remove("d-block");
    purcharseBtn.classList.add("d-none");
  }

  cartItemsList.innerHTML = "";
  products.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.productId.title}</td>
      <td>$${item.productId.price}</td>
      <td>${item.amount}</td>
      <td>
        <div class='actions'>
          <i class="fa-solid fa-minus action-cart" data-amount=${item.amount} data-action='minus' data-id='${item.productId._id}'></i>
          <i class="fa-solid fa-plus action-cart" data-amount=${item.amount} data-action='plus' data-id='${item.productId._id}'></i>
          <i class="fa-solid fa-trash action-cart" data-amount=${item.amount} data-action='trash' data-id='${item.productId._id}'></i>
        </div>
      </td>
      `;
    cartItemsList.appendChild(tr);
  });

  cartTotal.textContent = `$${total}`;
}

function sumPrices(products) {
  const total = products.reduce((acc, product) => {
    return acc + product.productId.price * product.amount;
  }, 0);
  return total;
}
