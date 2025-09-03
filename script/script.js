// ========== Mobile Menu Toggle ==========
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.querySelector("nav ul"); // lebih spesifik pakai ul dalam nav

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("hidden");
    navMenu.classList.toggle("flex");
    navMenu.classList.toggle("flex-col");
    navMenu.classList.toggle("absolute");
    navMenu.classList.toggle("top-full");
    navMenu.classList.toggle("left-0");
    navMenu.classList.toggle("w-full");
    navMenu.classList.toggle("bg-gradient-to-r");
    navMenu.classList.toggle("from-pink-500");
    navMenu.classList.toggle("to-cyan-500");
    navMenu.classList.toggle("p-4");
    navMenu.classList.toggle("space-y-4");
  });
}

// ========== Image Upload ==========
const uploadArea = document.getElementById("upload-area");
const imageUpload = document.getElementById("image-upload");
const galleryGrid = document.getElementById("gallery-grid");

if (uploadArea && imageUpload && galleryGrid) {
  // Trigger input file saat area di-klik
  uploadArea.addEventListener("click", () => imageUpload.click());

  // Drag & Drop
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = "#ff6b6b";
    uploadArea.style.background = "rgba(255, 107, 107, 0.1)";
  });

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.style.borderColor = "#4ecdc4";
    uploadArea.style.background = "transparent";
  });

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    resetUploadArea();
    handleFiles(e.dataTransfer.files);
  });

  imageUpload.addEventListener("change", (e) => handleFiles(e.target.files));

  function resetUploadArea() {
    uploadArea.style.borderColor = "#4ecdc4";
    uploadArea.style.background = "transparent";
  }

  function handleFiles(files) {
    [...files].forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const wrapper = document.createElement("div");
          wrapper.className = "rounded-2xl overflow-hidden shadow-lg";
          wrapper.innerHTML = `
            <img src="${e.target.result}" 
                 alt="Foto produk yang diupload pelanggan" 
                 class="w-full h-64 object-cover" />
          `;
          galleryGrid.prepend(wrapper);
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

// ========== Smooth Scrolling ==========
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ========== Pesan Produk ke Form ==========
document.addEventListener("DOMContentLoaded", () => {
  const orderForm = document.getElementById("orderForm");
  const orderInput = document.getElementById("orderProduct");

  if (orderForm && orderInput) {
    // Isi nama produk otomatis saat klik tombol pesan
    document.querySelectorAll(".pesan-btn").forEach((button) => {
      button.addEventListener("click", () => {
        orderInput.value = button.dataset.product || "";
      });
    });

    // Submit form
    orderForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = {
        name: orderForm.elements["name"].value.trim(),
        phone: orderForm.elements["phone"].value.trim(),
        product: orderForm.elements["orderProduct"].value.trim(),
        note: orderForm.elements["note"].value.trim(),
        orderType: orderForm.elements["orderType"].value,
        payment: orderForm.elements["payment"].value,
      };

      console.log("📤 Data akan dikirim:", data);

      try {
        const res = await fetch(
          "https://script.google.com/macros/s/AKfycbxoBbAaMYV0cSsw6_opINZhWbVcJGdHTlxRX7x3X7g/dev",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );

        console.log("📥 Response status:", res.status);
        const response = await res.json();
        console.log("✅ Response JSON:", response);

        if (response.result === "success") {
          alert("✅ Pesanan berhasil dikirim!");
          orderForm.reset();
        } else {
          alert("⚠️ Terjadi masalah di server.");
        }
      } catch (error) {
        console.error("❌ Error:", error);
        alert("❌ Gagal mengirim pesanan, coba lagi.");
      }
    });
  }
});
