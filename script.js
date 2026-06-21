const filterBtns = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".card");

const confirmModal = document.getElementById("confirmModal");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

let reviewIndexToDelete = null;
let reservationIndexToDelete = null;
let deleteType = null;


filterBtns.forEach(function(btn) {
  btn.addEventListener("click", function() {
    const category = btn.dataset.category;

    filterBtns.forEach(function(button) {
      button.classList.remove("active");
    });

    btn.classList.add("active");

    cards.forEach(function(card) {
      if (category === "all" || card.dataset.category === category) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});


const hiddenElements = document.querySelectorAll(".hidden");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

hiddenElements.forEach((el) => observer.observe(el));


const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", function () {
  navLinks.classList.toggle("active");
});

navLinks.querySelectorAll("a").forEach(function(link) {
  link.addEventListener("click", function() {
    navLinks.classList.remove("active");
  });
});


const reservationForm = document.getElementById("reservationForm");
const formMessage = document.getElementById("formMessage");
const reservationsList = document.getElementById("reservationsList");

let reservations = JSON.parse(localStorage.getItem("reservations")) || [];

function renderReservations() {
  reservationsList.innerHTML = "";

  if (reservations.length === 0) {
    reservationsList.innerHTML = "<p>Aún no hay reservas registradas.</p>";
    return;
  }

  reservations.slice(0, 3).forEach((reservation) => {
    const item = document.createElement("div");
    item.classList.add("reservation-item");

    item.innerHTML = `
      <strong>${reservation.name}</strong><br>
      Fecha: ${reservation.date}<br>
      Hora: ${reservation.time}<br>
      Personas: ${reservation.people}
    `;

    reservationsList.appendChild(item);
  });
}

reservationForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("clientName").value.trim();
  const date = document.getElementById("reservationDate").value;
  const time = document.getElementById("reservationTime").value;
  const people = document.getElementById("peopleCount").value;

  formMessage.className = "";
  formMessage.textContent = "";

  const today = new Date().toISOString().split("T")[0];

  if (name.length < 3) {
    formMessage.textContent = "El nombre debe tener al menos 3 letras.";
    formMessage.classList.add("error");
    return;
  }

  if (date < today) {
    formMessage.textContent = "No puedes reservar una fecha pasada.";
    formMessage.classList.add("error");
    return;
  }

  if (people < 1 || people > 20) {
    formMessage.textContent = "La reserva debe ser entre 1 y 20 personas.";
    formMessage.classList.add("error");
    return;
  }

  const phoneNumber = "51934633170";

  const message = `Hola, quiero reservar una mesa.

Nombre: ${name}
Fecha: ${date}
Hora: ${time}
Personas: ${people}`;

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const newReservation = {
    name,
    date,
    time,
    people
  };

  reservations.unshift(newReservation);
  localStorage.setItem("reservations", JSON.stringify(reservations));

  renderReservations();

  formMessage.textContent = "Redirigiendo a WhatsApp...";
  formMessage.classList.add("success");

  window.open(whatsappURL, "_blank");
});


const galleryImages = document.querySelectorAll(".gallery-grid img");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");

galleryImages.forEach((image) => {
  image.addEventListener("click", () => {
    lightbox.classList.add("active");
    lightboxImage.src = image.src;
  });
});

lightbox.addEventListener("click", () => {
  lightbox.classList.remove("active");
});


const header = document.getElementById("header");

window.addEventListener("scroll", function() {
  if (window.scrollY > 80) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});


const counters = document.querySelectorAll(".counter");

counters.forEach((counter) => {
  counter.innerText = "0";

  const updateCounter = () => {
    const target = Number(counter.getAttribute("data-target"));
    const current = Number(counter.innerText);
    const increment = target / 100;

    if (current < target) {
      counter.innerText = Math.ceil(current + increment);
      setTimeout(updateCounter, 20);
    } else {
      counter.innerText = target;
    }
  };

  updateCounter();
});

/* RESEÑAS */
const reviewForm = document.getElementById("reviewForm");
const testimonialsGrid = document.getElementById("testimonialsGrid");

let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

let currentReviewIndex = 0;
const reviewsPerPage = 3;

function renderReviews() {
  testimonialsGrid.innerHTML = "";

  const ratingSummary = document.getElementById("ratingSummary");

  if (reviews.length === 0) {
    ratingSummary.innerHTML = `
      <h3>0.0 ★★★★★</h3>
      <p>Basado en 0 reseñas</p>
    `;
    return;
  }

  const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
  const average = (totalStars / reviews.length).toFixed(1);

  ratingSummary.innerHTML = `
    <h3>${average} ★★★★★</h3>
    <p>Basado en ${reviews.length} reseñas</p>
  `;

  const visibleReviews = reviews.slice(
    currentReviewIndex,
    currentReviewIndex + reviewsPerPage
  );

  visibleReviews.forEach((review) => {
    const card = document.createElement("div");
    card.classList.add("testimonial-card");

    const initial = review.name.charAt(0).toUpperCase();

    card.innerHTML = `
      <div class="review-user">
        <div class="review-avatar">${initial}</div>
        <div>
          <h3>${review.name}</h3>
          <small>${review.email}</small>
        </div>
      </div>

      <div class="stars">${"★".repeat(review.stars)}</div>
      <p>"${review.comment}"</p>
    `;

    testimonialsGrid.appendChild(card);
  });
}

reviewForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("reviewName").value.trim();
  const email = document.getElementById("reviewEmail").value.trim();
  const stars = Number(document.getElementById("reviewStars").value);
  const comment = document.getElementById("reviewComment").value.trim();

  const newReview = {
    name,
    email,
    stars,
    comment
  };

  reviews.unshift(newReview);

  localStorage.setItem("reviews", JSON.stringify(reviews));

  currentReviewIndex = 0;
  renderReviews();

  const toast = document.getElementById("toast");

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);

  reviewForm.reset();
});


setInterval(() => {
  if (reviews.length > reviewsPerPage) {
    currentReviewIndex += reviewsPerPage;

    if (currentReviewIndex >= reviews.length) {
      currentReviewIndex = 0;
    }

    renderReviews();
  }
}, 11000);


const adminPanel = document.getElementById("adminPanel");

if (window.location.hash === "#admin") {
  adminPanel.classList.add("active");
  adminPanel.scrollIntoView({ behavior: "smooth" });
}

const loginAdmin = document.getElementById("loginAdmin");
const adminPassword = document.getElementById("adminPassword");
const adminArea = document.getElementById("adminArea");
const adminReservations = document.getElementById("adminReservations");
const adminReviews = document.getElementById("adminReviews");

loginAdmin.addEventListener("click", function () {
  if (adminPassword.value !== "admin123") {
    alert("Contraseña incorrecta");
    return;
  }

  adminArea.style.display = "block";

  adminReservations.innerHTML = "";
  adminReviews.innerHTML = "";

  document.getElementById("totalReservations").textContent = reservations.length;
document.getElementById("totalReviews").textContent = reviews.length;

if (reviews.length === 0) {
  document.getElementById("averageRating").textContent = "0.0 ★";
} else {
  const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
  const average = (totalStars / reviews.length).toFixed(1);
  document.getElementById("averageRating").textContent = `${average} ★`;
}

  reservations.forEach(function (reservation, index) {
    const item = document.createElement("div");
    item.classList.add("admin-item");

    item.innerHTML = `
      <strong>${reservation.name}</strong><br>
      Fecha: ${reservation.date}<br>
      Hora: ${reservation.time}<br>
      Personas: ${reservation.people}<br><br>

      <button class="delete-reservation-btn" data-index="${index}">
        Eliminar reserva
      </button>
    `;

    adminReservations.appendChild(item);
  });

  reviews.forEach(function (review, index) {
    const item = document.createElement("div");
    item.classList.add("admin-item");

    item.innerHTML = `
      <strong>${review.name}</strong><br>
      ${"★".repeat(review.stars)}<br>
      ${review.comment}<br><br>

      <button class="delete-review-btn" data-index="${index}">
        Eliminar reseña
      </button>
    `;

    adminReviews.appendChild(item);
  });

  document.querySelectorAll(".delete-review-btn").forEach((button) => {
    button.addEventListener("click", function () {
      reviewIndexToDelete = Number(this.dataset.index);
      deleteType = "review";

      confirmModal.classList.add("active");
    });
  });

  document.querySelectorAll(".delete-reservation-btn").forEach((button) => {
    button.addEventListener("click", function () {
      reservationIndexToDelete = Number(this.dataset.index);
      deleteType = "reservation";

      confirmModal.classList.add("active");
    });
  });
});


confirmDeleteBtn.addEventListener("click", function () {
  if (deleteType === "review") {
    reviews.splice(reviewIndexToDelete, 1);
    localStorage.setItem("reviews", JSON.stringify(reviews));

    if (currentReviewIndex >= reviews.length) {
      currentReviewIndex = 0;
    }

    renderReviews();
  }

  if (deleteType === "reservation") {
    reservations.splice(reservationIndexToDelete, 1);
    localStorage.setItem("reservations", JSON.stringify(reservations));
    renderReservations();
  }

  confirmModal.classList.remove("active");

  reviewIndexToDelete = null;
  reservationIndexToDelete = null;
  deleteType = null;

  loginAdmin.click();
});

cancelDeleteBtn.addEventListener("click", function () {
  confirmModal.classList.remove("active");

  reviewIndexToDelete = null;
  reservationIndexToDelete = null;
  deleteType = null;
});


renderReservations();
renderReviews();

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {

  if (window.scrollY > 500) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }

});

backToTop.addEventListener("click", () => {

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

});