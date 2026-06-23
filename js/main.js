// Interações do site: menu mobile, animações, contadores, carrossel, FAQ e formulário.
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const backToTop = document.querySelector(".back-to-top");
  const revealElements = document.querySelectorAll(".reveal");
  const counters = document.querySelectorAll("[data-counter]");

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 650);
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealElements.forEach((element) => revealObserver.observe(element));

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.7 });

  counters.forEach((counter) => counterObserver.observe(counter));

  function animateCounter(element) {
    const target = Number(element.dataset.counter);
    const duration = 1200;
    const start = performance.now();
    const prefix = target === 800 || target === 7 ? "+" : "";
    const suffix = target === 98 ? "%" : "";

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * easedProgress);
      element.textContent = `${prefix}${value}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  initCarousel();
  initAccordion();
  initFormValidation();
});

function initCarousel() {
  const testimonials = Array.from(document.querySelectorAll(".testimonial"));
  const prevButton = document.querySelector(".carousel-btn.prev");
  const nextButton = document.querySelector(".carousel-btn.next");
  const dotsContainer = document.querySelector(".carousel-dots");
  let currentIndex = 0;
  let autoPlay;

  testimonials.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Mostrar depoimento ${index + 1}`);
    dot.addEventListener("click", () => showTestimonial(index));
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.querySelectorAll("button"));

  function showTestimonial(index) {
    testimonials[currentIndex].classList.remove("active");
    dots[currentIndex].classList.remove("active");
    currentIndex = (index + testimonials.length) % testimonials.length;
    testimonials[currentIndex].classList.add("active");
    dots[currentIndex].classList.add("active");
    resetAutoPlay();
  }

  function resetAutoPlay() {
    clearInterval(autoPlay);
    autoPlay = setInterval(() => showTestimonial(currentIndex + 1), 6500);
  }

  prevButton.addEventListener("click", () => showTestimonial(currentIndex - 1));
  nextButton.addEventListener("click", () => showTestimonial(currentIndex + 1));

  dots[0].classList.add("active");
  resetAutoPlay();
}

function initAccordion() {
  const items = document.querySelectorAll(".accordion-item");

  items.forEach((item) => {
    const button = item.querySelector("button");
    const content = item.querySelector(".accordion-content");

    button.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      items.forEach((currentItem) => {
        currentItem.classList.remove("active");
        currentItem.querySelector(".accordion-content").style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add("active");
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    });
  });
}

function initFormValidation() {
  const form = document.querySelector("#contactForm");
  const successMessage = form.querySelector(".form-success");
  const validators = {
    name: (value) => value.trim().length >= 3 || "Informe seu nome completo.",
    phone: (value) => value.replace(/\D/g, "").length >= 10 || "Informe um telefone válido.",
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Informe um e-mail válido.",
    goal: (value) => value.trim() !== "" || "Selecione seu objetivo principal.",
    message: (value) => value.trim().length >= 12 || "Escreva uma mensagem com pelo menos 12 caracteres."
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    successMessage.textContent = "";

    const isValid = Array.from(form.elements).every((field) => {
      if (!validators[field.name]) {
        return true;
      }

      return validateField(field);
    });

    if (isValid) {
      successMessage.textContent = "Solicitação enviada com sucesso. Em breve entraremos em contato.";
      form.reset();
    }
  });
  Object.keys(validators).forEach((fieldName) => {
    const field = form.elements[fieldName];
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.closest(".form-row").classList.contains("invalid")) {
        validateField(field);
      }
    });
  });

  function validateField(field) {
    const result = validators[field.name](field.value);
    const row = field.closest(".form-row");
    const error = row.querySelector(".error-message");

    if (result === true) {
      row.classList.remove("invalid");
      error.textContent = "";
      return true;
    }

    row.classList.add("invalid");
    error.textContent = result;
    return false;
  }
}
