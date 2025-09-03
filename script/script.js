document.addEventListener("DOMContentLoaded", () => {

    // ========== Mobile Menu Toggle ==========
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.querySelector(".hidden.md\\:flex");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("hidden");
            navMenu.classList.toggle("mobile-menu");
        });

        // Menutup menu saat link diklik (di mobile)
        document.querySelectorAll("nav a").forEach(link => {
            link.addEventListener("click", () => {
                if (navMenu.classList.contains("mobile-menu")) {
                    navMenu.classList.remove("mobile-menu");
                    navMenu.classList.add("hidden");
                }
            });
        });
    }

    // ========== Image Upload ==========
    // Bagian ini hanya akan berfungsi jika Anda memiliki elemen HTML dengan ID "upload-area", "image-upload", dan "gallery-grid"
    const uploadArea = document.getElementById("upload-area");
    const imageUpload = document.getElementById("image-upload");
    const galleryGrid = document.getElementById("gallery-grid");

    if (uploadArea && imageUpload && galleryGrid) {
        uploadArea.addEventListener("click", () => imageUpload.click());

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
                                 alt="Foto produk yang diunggah pelanggan"
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
            const href = anchor.getAttribute("href");
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
                
                // Tutup menu mobile setelah klik
                if (navMenu && navMenu.classList.contains("mobile-menu")) {
                    navMenu.classList.remove("mobile-menu");
                    navMenu.classList.add("hidden");
                }
            }
        });
    });

    // ========== Pesan Produk & Formulir ==========
    // Bagian ini hanya akan berfungsi jika Anda memiliki elemen HTML dengan ID "orderForm" dan "orderProduct"
    const orderForm = document.getElementById("orderForm");
    const orderInput = document.getElementById("orderProduct");

    if (orderForm && orderInput) {
        // Isi nama produk otomatis saat klik tombol pesan
        document.querySelectorAll("a.btn-primary").forEach((button) => {
            button.addEventListener("click", (e) => {
                // Menghentikan perilaku default tautan agar tidak langsung loncat
                e.preventDefault(); 

                const productCard = button.closest('.product-card');
                if (productCard) {
                    const productName = productCard.querySelector('h4').innerText.trim();
                    orderInput.value = productName;
                    // Gulir ke bagian Order
                    document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
                }
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
