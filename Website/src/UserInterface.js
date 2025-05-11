function showPage(pageId, event) {
  document.querySelectorAll(".mainStuff > div").forEach((div) => {
    div.style.display = "none";
  });
  document.getElementById(pageId).style.display = "block";
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");
}
window.addEventListener("DOMContentLoaded", () => {
  showPage("preferences", { target: document.querySelector(".nav-btn") });
});
window.showPage = showPage;

// pagination + carousel
document.addEventListener("DOMContentLoaded", function () {
  const slides = [
    [
      { stock: "AAPL", action: "Buy", percent: "30%" },
      { stock: "TSLA", action: "Sell", percent: "10%" },
      { stock: "AMZN", action: "Hold", percent: "30%" },
      { stock: "GOOGL", action: "Buy", percent: "10%" },
      { stock: "MSFT", action: "Hold", percent: "10%" },
    ],
    [
      { stock: "AAPL", action: "Hold", percent: "20%" },    // add here 
      { stock: "TSLA", action: "Buy", percent: "25%" },
      { stock: "AMZN", action: "Sell", percent: "10%" },
      { stock: "GOOGL", action: "Hold", percent: "20%" },
      { stock: "MSFT", action: "Buy", percent: "25%" },
    ],
  ];

  const weekLabels = [
    "week 1 April 2025",     // add here 
    "week 2 April 2025",
  ];

  let currentIndex = 0;

  const container = document.querySelector(".Portfolio .carousel");
  const weekLabel = document.querySelector(".Portfolio .week-label");
  const pagination = document.querySelector(".Portfolio .pagination");

  pagination.innerHTML = "";
  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement("span");
    dot.className = "dot";
    if (i === currentIndex) dot.classList.add("active");
    dot.addEventListener("click", () => {
      currentIndex = i;
      renderSlide(currentIndex);
    });
    pagination.appendChild(dot);
  }

  function renderSlide(index) {
    container.classList.remove("fade-in");
    void container.offsetWidth;
    container.innerHTML = "";

    slides[index].forEach(({ stock, action, percent }) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${stock}</h3>
        <div class="action">${action}</div>
        <div class="percent">${percent}</div>
      `;
      container.appendChild(card);
    });

    weekLabel.textContent = weekLabels[index];

    const allDots = pagination.querySelectorAll(".dot");
    allDots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });

    container.classList.add("fade-in");
  }

  document
    .querySelector(".Portfolio .nav.left")
    .addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      renderSlide(currentIndex);
    });

  document
    .querySelector(".Portfolio .nav.right")
    .addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % slides.length;
      renderSlide(currentIndex);
    });

  renderSlide(currentIndex);
});
