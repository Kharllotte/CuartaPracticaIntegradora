document.addEventListener("DOMContentLoaded", function () {
  const openModalButton = document.querySelector(".open-documents-modal");
  const closeModalButton = document.querySelector(".close-documents-modal");
  const overlay = document.querySelector(".documents-modal-overlay");

  openModalButton.addEventListener("click", function () {
    overlay.style.display = "flex";
  });

  closeModalButton.addEventListener("click", function () {
    overlay.style.display = "none";
  });
});
