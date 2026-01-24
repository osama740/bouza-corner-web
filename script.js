const cart = [];
const cartOverlay = document.querySelector(".cart-overlay");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const totalEl = document.getElementById("total");

// عناصر modal الملاحظات
const confirmOverlay = document.getElementById('confirmOverlay');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');
const orderNote = document.getElementById('orderNote');

/* ================= SIZE SELECT ================= */
document.querySelectorAll(".sizes button").forEach(btn => {
  btn.onclick = () => {
    const group = btn.parentElement;
    group.querySelectorAll("button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const card = btn.closest(".product-card");
    card.querySelector(".price").innerText = btn.dataset.price + " L.L";
  };
});

/* ================= ADD TO CART (Modal) ================= */
document.querySelectorAll(".add-btn").forEach(btn => {
  btn.onclick = () => {
    const card = btn.closest(".product-card");
    const size = card.querySelector(".sizes .active");
    if(!size) return alert("اختر الحجم أولاً");

    // حفظ المنتج في dataset قبل التأكيد
    confirmOverlay.dataset.productName = card.dataset.name;
    confirmOverlay.dataset.productSize = size.dataset.size;
    confirmOverlay.dataset.productPrice = size.dataset.price;

    orderNote.value = ""; // تفريغ الملاحظات
    confirmOverlay.classList.add('active');
  };
});

// زر تأكيد الطلب
confirmBtn.addEventListener('click', () => {
  const note = orderNote.value.trim();
  const name = confirmOverlay.dataset.productName;
  const size = confirmOverlay.dataset.productSize;
  const price = Number(confirmOverlay.dataset.productPrice);

  cart.push({ name, size, price, notes: note ? note : null });
  renderCart();

  confirmOverlay.classList.remove('active');
});

// زر إلغاء
cancelBtn.addEventListener('click', () => {
  confirmOverlay.classList.remove('active');
});

/* ================= RENDER CART ================= */
function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach((item, i) => {
    total += item.price;
    cartItems.innerHTML += `
      <div class="cart-item">
        <div>
          ${item.name} (${item.size})${item.notes ? " - " + item.notes : ""}
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

/* ================= REMOVE ITEM ================= */
function removeItem(i) {
  cart.splice(i, 1);
  renderCart();
}

/* ================= CART TOGGLE ================= */
document.querySelector(".cart-toggle").onclick = () => cartOverlay.classList.add("active");
document.querySelector(".close-cart").onclick = () => cartOverlay.classList.remove("active");

/* ================= CLEAR CART ================= */
document.querySelector(".clear-cart").onclick = () => { cart.length = 0; renderCart(); };
document.querySelector(".whatsapp").onclick = () => {
  if (!cart.length) return alert("السلة فارغة!");

  let msg = " طلب Bouza Corner:"; // start clean, no BOM issues

  let total = 0;

  cart.forEach((item, index) => {
    msg += `\n${index + 1}. ${item.name} (${item.size})`;
    if (item.notes) msg += ` - ملاحظات: ${item.notes}`;
    msg += ` - ${item.price.toLocaleString()} L.L`;
    total += item.price;
  });

  msg += `\n\n الإجمالي: ${total.toLocaleString()} L.L`; // total at the end

  const encodedMsg = encodeURIComponent(msg);
  const whatsappNumber = "96103755931"; // ضع رقمك هنا
  window.open(`https://wa.me/${whatsappNumber}?text=${encodedMsg}`, "_blank");
};

/* ================= NAV ACTIVE ON SCROLL (h2 trigger) ================= */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

// Helper to set active link
function setActiveLink(id) {
  navLinks.forEach(link => link.classList.remove("active"));
  const link = document.querySelector(`.nav-link[href="#${id}"]`);
  if (link) link.classList.add("active");
}

// Scroll event
window.addEventListener("scroll", () => {
  let scrollY = window.scrollY;
  let currentId = sections[0].id; // default first section

  sections.forEach(section => {
    const h2 = section.querySelector("h2");
    if (!h2) return;

    const h2Top = h2.getBoundingClientRect().top + window.scrollY;
    const triggerPoint = window.innerHeight / 2; // trigger when h2 reaches middle of viewport

    if(scrollY + triggerPoint >= h2Top){
      currentId = section.id;
    }
  });

  setActiveLink(currentId);
});
/* ================= SMOOTH SCROLL WITH CONTROLLED SPEED ================= */
function smoothScrollTo(targetY, duration = 600) { // duration in ms
  const startY = window.scrollY;
  const distance = targetY - startY;
  let startTime = null;

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    
    // ease in-out function
    const ease = progress < 0.5
      ? 2 * progress * progress
      : -1 + (4 - 2 * progress) * progress;

    window.scrollTo(0, startY + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

// Apply to nav links
navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);
    if(!targetSection) return;

    const navHeight = document.querySelector('.navbar').offsetHeight;
    const sectionTop = targetSection.offsetTop - navHeight - 10;

    // Use our custom smooth scroll
    smoothScrollTo(sectionTop, 800); // 800ms = slower, smooth feeling

    // Update active immediately
    setActiveLink(targetId.replace("#",""));
  });
});


// Slow down manual scroll
window.addEventListener('wheel', (e) => {
  e.preventDefault(); // prevent default fast scroll
  window.scrollBy({
    top: e.deltaY * 0.3, // adjust 0.3 to your preferred speed (smaller = slower)
    left: 0,
    behavior: 'auto'
  });
}, { passive: false });
