function deleteProduct(id) {
  const confirm = window.confirm("Esta seguro de eliminar el producto?");
  if (confirm) {
    axios
      .post(`/products/inactive/${id}`)
      .then((res) => {
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

function editProduct(id) {
  axios
    .get(`/api/products/${id}`)
    .then((res) => {
      document.getElementById("productEdit").value = JSON.stringify(
        res.data.payload
      );
      document.getElementById("openModalBtn").click();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
