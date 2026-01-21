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

/* ================= WHATSAPP ================= */
document.querySelector(".whatsapp").onclick = () => {
  if (!cart.length) return alert("السلة فارغة!");

  let msg = `🍨 طلب Bouza Corner:\n\n`;

  cart.forEach((item, index) => {
    msg += `${index + 1}. ${item.name} (${item.size})`;
    if(item.notes) msg += ` - ملاحظات: ${item.notes}`;
    msg += ` - ${item.price.toLocaleString()} L.L\n`;
  });

  const whatsappNumber = "96103755931"; // حط رقمك
  const encodedMsg = encodeURIComponent(msg);
  window.open(`https://wa.me/${whatsappNumber}?text=${encodedMsg}`, "_blank");
};

/* ================= NAV ACTIVE ON SCROLL ================= */
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => link.classList.remove("active"));
        document.querySelector(`.nav-link[href="#${id}"]`)?.classList.add("active");
      }
    });
  });
});

/* ================= SMOOTH SCROLL NAV ================= */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    if (!targetSection) return;

    const navHeight = document.querySelector('.navbar').offsetHeight;
    const sectionTop =
      targetSection.getBoundingClientRect().top +
      window.pageYOffset -
      navHeight - 10;

    window.scrollTo({
      top: sectionTop,
      behavior: 'smooth'
    });
  });
});
