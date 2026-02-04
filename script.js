/* ================= GLOBAL CART ================= */
const cart = [];
const cartOverlay = document.querySelector(".cart-overlay");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const totalEl = document.getElementById("total");

/* ================= CONFIRM MODAL ================= */
const confirmOverlay = document.getElementById("confirmOverlay");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");
const orderNote = document.getElementById("orderNote");

/* ================= PRODUCTS LOGIC ================= */
document.querySelectorAll(".product-card").forEach(card => {

  const isJuice = card.dataset.type === "juice";

  let selectedVariant = isJuice ? "كباية" : null;
  let selectedSizeBtn = null;

  const priceBox = card.querySelector(".price");

  /* ===== VARIANT (JUICE ONLY) ===== */
  if (isJuice) {
    card.querySelectorAll(".variant-btn").forEach(btn => {
      btn.onclick = () => {

        card.querySelectorAll(".variant-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        selectedVariant = btn.dataset.variant;

        // القنينة: صغير + كبير فقط
        card.querySelectorAll(".sizes button").forEach(sizeBtn => {
          const size = sizeBtn.dataset.size;

          if (selectedVariant === "قنينة" && size === "وسط") {
            sizeBtn.style.display = "none";
            sizeBtn.classList.remove("active");
          } else {
            sizeBtn.style.display = "inline-block";
          }
        });

        selectedSizeBtn = null;
        priceBox.innerText = "—";
      };
    });
  }

  /* ===== SIZE SELECT ===== */
  card.querySelectorAll(".sizes button").forEach(btn => {
    btn.onclick = () => {
      card.querySelectorAll(".sizes button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      selectedSizeBtn = btn;
      priceBox.innerText =
        Number(btn.dataset.price).toLocaleString() + " L.L";
    };
  });

/* ===== ADD TO CART ===== */
card.querySelector(".add-btn").onclick = () => {

  let finalName = card.dataset.name;
  let finalPrice = "";
  let finalSize = null; // 👈 بدل ""

  // إذا في زر حجم مختار
  if (selectedSizeBtn) {
    finalSize = selectedSizeBtn.dataset.size;
    finalPrice = selectedSizeBtn.dataset.price;
  } else {
    // منتج بسعر واحد
    finalPrice = card.dataset.price;
  }

  // بس العصير نضيف كباية / قنينة
  if (isJuice) {
    finalName += " - " + selectedVariant;
  }

  confirmOverlay.dataset.productName = finalName;

  // 👇 بس خزّن الحجم إذا موجود
  if (finalSize) {
    confirmOverlay.dataset.productSize = finalSize;
  } else {
    delete confirmOverlay.dataset.productSize;
  }

  confirmOverlay.dataset.productPrice = finalPrice;

  orderNote.value = "";
  confirmOverlay.classList.add("active");
};
});


/* ================= CONFIRM ADD ================= */
confirmBtn.onclick = () => {
  const name = confirmOverlay.dataset.productName;
  const size = confirmOverlay.dataset.productSize || null; // 👈 المهم
  const price = Number(confirmOverlay.dataset.productPrice);
  const note = orderNote.value.trim();

  cart.push({
    name,
    size,
    price,
    notes: note || null
  });

  renderCart();
  confirmOverlay.classList.remove("active");
};

cancelBtn.onclick = () => {
  confirmOverlay.classList.remove("active");
};


/* ================= RENDER CART ================= */
function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    total += item.price;

    // 👇 عرض الاسم بطريقة صحيحة
    let displayName = item.name;
    if (item.size) {
      displayName += ` (${item.size})`;
    }

    cartItems.innerHTML += `
      <div class="cart-item">
        <div>
          ${displayName}
          ${item.notes ? `<small> - ${item.notes}</small>` : ""}
        </div>
        <div>
          ${item.price.toLocaleString()} L.L
          <span class="remove" onclick="removeItem(${i})">حذف</span>
        </div>
      </div>
    `;
  });

  cartCount.innerText = cart.length;
  totalEl.innerText = total.toLocaleString();
}

function removeItem(i) {
  cart.splice(i, 1);
  renderCart();
}


/* ================= CART TOGGLE ================= */
document.querySelector(".cart-toggle").onclick = () =>
  cartOverlay.classList.add("active");

document.querySelector(".close-cart").onclick = () =>
  cartOverlay.classList.remove("active");

document.querySelector(".clear-cart").onclick = () => {
  cart.length = 0;
  renderCart();
};

/* ================= WHATSAPP ================= */
document.querySelector(".whatsapp").onclick = () => {
  if (!cart.length) return alert("السلة فارغة!");

  let msg = `طلب Bouza Corner:\n\n`;

  cart.forEach((item, i) => {
    msg += `${i + 1}. ${item.name} (${item.size})`;
    if (item.notes) msg += ` - ملاحظات: ${item.notes}`;
    msg += ` - ${item.price.toLocaleString()} L.L\n`;
  });

  const total = cart.reduce((s, i) => s + i.price, 0);
  msg += `\nالمجموع: ${total.toLocaleString()} L.L`;

  window.open(
    `https://wa.me/96103755931?text=${encodeURIComponent(msg)}`,
    "_blank"
  );

  cart.length = 0;
  renderCart();
};

/* ================= NAV ACTIVE ON SCROLL ================= */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

function setActiveLink(id) {
  navLinks.forEach(l => l.classList.remove("active"));
  const link = document.querySelector(`.nav-link[href="#${id}"]`);
  if (link) link.classList.add("active");
}

window.addEventListener("scroll", () => {
  let currentId = sections[0].id;

  sections.forEach(section => {
    const h2 = section.querySelector("h2");
    if (!h2) return;

    const top = h2.getBoundingClientRect().top + window.scrollY;
    if (window.scrollY + window.innerHeight / 2 >= top) {
      currentId = section.id;
    }
  });

  setActiveLink(currentId);
});

/* ================= SMOOTH SCROLL ================= */
function smoothScrollTo(targetY, duration = 800) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  let startTime = null;

  function animate(time) {
    if (!startTime) startTime = time;
    const progress = Math.min((time - startTime) / duration, 1);
    const ease = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    window.scrollTo(0, startY + distance * ease);
    if (progress < 1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

navLinks.forEach(link => {
  link.onclick = e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    const offset = document.querySelector(".navbar").offsetHeight + 10;
    smoothScrollTo(target.offsetTop - offset);
  };
});

/* ================= WELCOME SCREEN ================= */
document.addEventListener("DOMContentLoaded", () => {
  const welcome = document.getElementById("welcomeScreen");

  if (!sessionStorage.getItem("welcomeShown")) {
    welcome.classList.add("show");

    setTimeout(() => {
      welcome.style.opacity = "0";
      setTimeout(() => welcome.remove(), 1000);
    }, 2000);

    sessionStorage.setItem("welcomeShown", "true");
  } else {
    welcome.remove();
  }
});
