/* =========================================
   BLUE WAXBILL LODGE
   WEBSITE INTERACTIONS
========================================= */

// Confirm this number with lodge management before publishing.
const WHATSAPP_NUMBER = "260979687777";

// MOBILE NAVIGATION
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

function closeNavigation() {
    if (!menuToggle || !navLinks) return;
    navLinks.classList.remove("active");
    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    menuToggle.setAttribute("aria-expanded", "false");
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("active");
        menuToggle.textContent = isOpen ? "✕" : "☰";
        menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeNavigation);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) closeNavigation();
    });
}

// BOOKING DATE VALIDATION
const checkin = document.getElementById("checkin");
const checkout = document.getElementById("checkout");

function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

if (checkin && checkout) {
    const today = getTodayDate();
    checkin.min = today;
    checkout.min = today;

    checkin.addEventListener("change", () => {
        checkout.min = checkin.value || today;
        if (checkout.value && checkout.value <= checkin.value) {
            checkout.value = "";
        }
    });
}

// BOOKING FORM: opens a prepared WhatsApp enquiry; it does not confirm a reservation.
const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {
    bookingForm.addEventListener("submit", event => {
        event.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();
        const checkinDate = document.getElementById("checkin").value;
        const checkoutDate = document.getElementById("checkout").value;
        const guests = document.getElementById("guests").value;
        const packageType = document.getElementById("packageType").value;
        const flightDetails = document.getElementById("flightDetails").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!fullName || !phone || !checkinDate || !checkoutDate || !guests) {
            alert("Please complete all required fields.");
            return;
        }

        if (checkoutDate <= checkinDate) {
            alert("Check-out must be after check-in.");
            return;
        }

        const phonePattern = /^[+0-9\s()-]{7,20}$/;
        if (!phonePattern.test(phone)) {
            alert("Please enter a valid phone number.");
            return;
        }

        const startDate = new Date(`${checkinDate}T00:00:00`);
        const endDate = new Date(`${checkoutDate}T00:00:00`);
        const nights = Math.round((endDate - startDate) / 86400000);
        const selectedServices = Array.from(document.querySelectorAll('input[name="services"]:checked'))
            .map(service => service.value);
        const servicesText = selectedServices.length ? selectedServices.join(", ") : "No additional services selected";

        const bookingMessage = `BLUE WAXBILL LODGE\nBOOKING ENQUIRY\n\nGuest Details\nName: ${fullName}\nPhone: ${phone}\nEmail: ${email || "Not provided"}\n\nStay Details\nCheck-in: ${checkinDate}\nCheck-out: ${checkoutDate}\nNumber of nights: ${nights}\nNumber of guests: ${guests}\n\nPreferred Arrangement:\n${packageType}\n\nRequested Services:\n${servicesText}\n\nFlight Details:\n${flightDetails || "Not provided"}\n\nAdditional Requirements:\n${message || "None"}\n\nPlease confirm availability and provide a quotation.\n\nThank you.`;

        const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(bookingMessage)}`;
        window.open(whatsappURL, "_blank", "noopener,noreferrer");
    });
}

// FLOATING WHATSAPP BUTTON
const whatsappButton = document.querySelector(".whatsapp-float");
if (whatsappButton) {
    whatsappButton.href = `https://wa.me/${WHATSAPP_NUMBER}`;
    whatsappButton.target = "_blank";
    whatsappButton.rel = "noopener noreferrer";
}

// INTERACTIVE PHOTO GALLERY
const galleryImages = Array.from(document.querySelectorAll(".gallery-grid img"));

if (galleryImages.length) {
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML = `
        <button type="button" class="lightbox-close" aria-label="Close image viewer">&times;</button>
        <button type="button" class="lightbox-prev" aria-label="Previous image">&#10094;</button>
        <img class="lightbox-image" src="" alt="">
        <button type="button" class="lightbox-next" aria-label="Next image">&#10095;</button>
        <p class="lightbox-caption"></p>`;
    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector(".lightbox-image");
    const lightboxCaption = lightbox.querySelector(".lightbox-caption");
    const closeButton = lightbox.querySelector(".lightbox-close");
    const previousButton = lightbox.querySelector(".lightbox-prev");
    const nextButton = lightbox.querySelector(".lightbox-next");
    let currentImageIndex = 0;

    /** @param {number} index */
    function showGalleryImage(index) {
        currentImageIndex = (index + galleryImages.length) % galleryImages.length;
        const selectedImage = galleryImages[currentImageIndex];
        lightboxImage.src = selectedImage.src;
        lightboxImage.alt = selectedImage.alt;
        lightboxCaption.textContent = `${selectedImage.alt} (${currentImageIndex + 1} of ${galleryImages.length})`;
    }

    function openLightbox(index) {
        showGalleryImage(index);
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
        lightbox.classList.remove("active");
        document.body.style.overflow = "";
    }

    galleryImages.forEach((image, index) => {
        image.addEventListener("click", () => openLightbox(index));
    });
    closeButton.addEventListener("click", closeLightbox);
    previousButton.addEventListener("click", () => showGalleryImage(currentImageIndex - 1));
    nextButton.addEventListener("click", () => showGalleryImage(currentImageIndex + 1));
    lightbox.addEventListener("click", event => {
        if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", event => {
        if (!lightbox.classList.contains("active")) return;
        if (event.key === "Escape") closeLightbox();
        if (event.key === "ArrowRight") showGalleryImage(currentImageIndex + 1);
        if (event.key === "ArrowLeft") showGalleryImage(currentImageIndex - 1);
    });
}

// SCROLL REVEAL ANIMATIONS
const animatedElements = document.querySelectorAll(
    ".highlight-card, .room-card, .experience-card, .package-card, " +
    ".about-content, .dining-content, .transfer-content, .gallery-category, .contact-card"
);

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    animatedElements.forEach(element => {
        element.classList.add("reveal");
        observer.observe(element);
    });
} else {
    animatedElements.forEach(element => element.classList.add("visible"));
}

// AUTOMATIC COPYRIGHT YEAR
const yearElement = document.getElementById("year");
if (yearElement) yearElement.textContent = new Date().getFullYear();

console.log("Blue Waxbill Lodge website loaded successfully.");
