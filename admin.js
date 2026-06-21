import { logout, checkAuth } from "./auth-service.js";

import {
  listenReviews,
  listenReservations,
  deleteReview,
  deleteReservation
} from "./firebase-service.js";

const logoutBtn = document.getElementById("logoutBtn");
const adminReservations = document.getElementById("adminReservations");
const adminReviews = document.getElementById("adminReviews");

const totalReservations = document.getElementById("totalReservations");
const totalReviews = document.getElementById("totalReviews");
const averageRating = document.getElementById("averageRating");

const confirmModal = document.getElementById("confirmModal");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

let reviews = [];
let reservations = [];

let deleteType = null;
let itemIdToDelete = null;

checkAuth((user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});

logoutBtn.addEventListener("click", async () => {
  await logout();
  window.location.href = "login.html";
});

function updateStats() {
  totalReservations.textContent = reservations.length;
  totalReviews.textContent = reviews.length;

  if (reviews.length === 0) {
    averageRating.textContent = "0.0 ★";
    return;
  }

  const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
  averageRating.textContent = `${(totalStars / reviews.length).toFixed(1)} ★`;
}

function renderAdminReservations() {
  adminReservations.innerHTML = "";

  if (reservations.length === 0) {
    adminReservations.innerHTML = "<p>Aún no hay reservas registradas.</p>";
    return;
  }

  reservations.forEach((reservation) => {
    const item = document.createElement("div");
    item.classList.add("admin-item");

    item.innerHTML = `
      <strong>${reservation.name}</strong><br>
      Fecha: ${reservation.date}<br>
      Hora: ${reservation.time}<br>
      Personas: ${reservation.people}<br><br>

      <button class="delete-reservation-btn" data-id="${reservation.id}">
        Eliminar reserva
      </button>
    `;

    adminReservations.appendChild(item);
  });

  document.querySelectorAll(".delete-reservation-btn").forEach((button) => {
    button.addEventListener("click", function () {
      deleteType = "reservation";
      itemIdToDelete = this.dataset.id;
      confirmModal.classList.add("active");
    });
  });
}

function renderAdminReviews() {
  adminReviews.innerHTML = "";

  if (reviews.length === 0) {
    adminReviews.innerHTML = "<p>Aún no hay reseñas registradas.</p>";
    return;
  }

  reviews.forEach((review) => {
    const item = document.createElement("div");
    item.classList.add("admin-item");

    item.innerHTML = `
      <strong>${review.name}</strong><br>
      ${"★".repeat(review.stars)}<br>
      ${review.comment}<br><br>

      <button class="delete-review-btn" data-id="${review.id}">
        Eliminar reseña
      </button>
    `;

    adminReviews.appendChild(item);
  });

  document.querySelectorAll(".delete-review-btn").forEach((button) => {
    button.addEventListener("click", function () {
      deleteType = "review";
      itemIdToDelete = this.dataset.id;
      confirmModal.classList.add("active");
    });
  });
}

listenReservations((data) => {
  reservations = data;
  renderAdminReservations();
  updateStats();
});

listenReviews((data) => {
  reviews = data;
  renderAdminReviews();
  updateStats();
});

confirmDeleteBtn.addEventListener("click", async () => {
  if (deleteType === "review") {
    await deleteReview(itemIdToDelete);
  }

  if (deleteType === "reservation") {
    await deleteReservation(itemIdToDelete);
  }

  confirmModal.classList.remove("active");
  deleteType = null;
  itemIdToDelete = null;
});

cancelDeleteBtn.addEventListener("click", () => {
  confirmModal.classList.remove("active");
  deleteType = null;
  itemIdToDelete = null;
});