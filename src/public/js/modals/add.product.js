const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const modal = document.getElementById("modal");
const productForm = document.getElementById("productForm");

const inputs = [
  { input: "productName", value: "title" },
  { input: "productDescription", value: "description" },
  { input: "productPrice", value: "price" },
  { input: "productCategory", value: "category" },
  { input: "productCode", value: "code" },
  { input: "productStock", value: "stock" },
  { input: "_idProduct", value: "_id" },
];

openModalBtn.addEventListener("click", () => {
  let product = document.getElementById("productEdit").value;
  const titles = document.querySelectorAll(".title-action-product");
  if (product) {
    titles.forEach((title) => (title.textContent = "Editar"));
    product = JSON.parse(product);
    inputs.forEach((input) => {
      document.getElementById(input.input).value = product[input.value];
    });
    productForm.setAttribute("action", "/products/update");
  } else {
    titles.forEach((title) => (title.textContent = "Crear"));
    productForm.setAttribute("action", "/products/add");
  }

  modal.style.display = "block";
});

closeModalBtn.addEventListener("click", () => {
  document.getElementById("productEdit").value = null;
  const formInputs = document.querySelectorAll("form input");
  formInputs.forEach((input) => {
    input.value = "";
  });
  document.getElementById("productDescription").value = "";
  modal.style.display = "none";
});
