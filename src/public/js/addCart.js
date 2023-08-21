const d = document;

d.addEventListener("click", async (e) => {
  if (e.target.matches(".add")) {
    const _idProduct = e.target.dataset.id;
    const _idCart = localStorage.getItem("_idCart");
    const cart = localStorage.getItem("cart");

    if (cart) {
      const productExists = JSON.parse(cart).find(
        (product) => product.productId._id === _idProduct
      );

      if (productExists) {
        alert("El producto ya esta agregado");
        return;
      }
    }

    axios
      .post(`/api/carts/${_idCart}/products/${_idProduct}`)
      .then((response) => {
        const amount = response.data.payload.products.length;
        updateCartCounter(amount);
        localStorage.setItem(
          "cart",
          JSON.stringify(response.data.payload.products)
        );
      })
      .catch((error) => {
        console.error("Error:", error);
        if (error.response.data.payload == "No stock")
          alert("No hay suficiente stock para agregar al carrito");
      });
  }
});

function updateCartCounter(amount) {
  const cartCounter = document.getElementById("cart-counter");
  cartCounter.innerText = amount.toString();
}
