import { login } from "./auth-service.js";

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {

    await login(email, password);

    window.location.href = "admin.html";

  } catch (error) {

    loginMessage.textContent =
      "Correo o contraseña incorrectos";

  }

});