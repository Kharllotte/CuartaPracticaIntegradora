const $form = document.getElementById("form");
const $alert = document.getElementById("alert");
const loader = document.getElementById("loader");

if ($form) {
  $form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;

    if (!email) {
      alert("Debe ingresar el email");
      return;
    }

    $form.remove();
    loader.classList.remove("d-none");
    axios
      .post(`/auth/password-reset`, {
        email,
      })
      .then((response) => {
        loader.classList.add("d-none");
        if (response.data.success == "true") {
          document.getElementById("alert").classList.remove("d-none");
        } else console.error("Error");
      })
      .catch((error) => {
        loader.classList.add("d-none");
        console.error("Error:", error);
      });
  });
}

const $formRecovery = document.getElementById("form-recovery");

if ($formRecovery) {
  $formRecovery.addEventListener("submit", (e) => {
    e.preventDefault();
    const $pws1 = document.getElementById("password").value;
    const $pws2 = document.getElementById("re-password").value;

    if ($pws1 != $pws2) {
      $alert.textContent = "Las contrasenas deben coincidir";
      $alert.classList.add("alert-danger");
      $alert.classList.remove("d-none");
      return;
    }

    $alert.classList.remove("alert-danger");

    $formRecovery.remove();
    loader.classList.remove("d-none");
    axios
      .post(`/auth/recovery-password/${getUrl()}`, {
        password: $pws1,
      })
      .then((response) => {
        loader.classList.add("d-none");

        if (response.data.success == "true") {
          $alert.textContent = "Actualizado. Inicie sesion";
          $alert.classList.remove("d-none");
          $alert.classList.add("alert-primary");
        } else {
          console.error("Error");
          if (response.data.message == "Equals password") {
            $alert.textContent = "No se admite la misma contrasena.";
            $alert.classList.remove("d-none");
            $alert.classList.add("alert-danger");
          }
        }
      })
      .catch((error) => {
        loader.classList.add("d-none");
        console.error("Error:", error);
      });
  });

  function getUrl() {
    const url = location.pathname;
    const split = url.split("/");
    return split[split.length - 1];
  }
}
