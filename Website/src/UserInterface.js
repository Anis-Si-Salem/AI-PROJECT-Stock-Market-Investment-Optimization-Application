function showPage(pageId, event) {
    document.querySelectorAll('.mainStuff > div').forEach(div => {
      div.style.display = 'none';
    });
    document.getElementById(pageId).style.display = 'block';
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');
  }
  window.addEventListener('DOMContentLoaded', () => {
    showPage('preferences', { target: document.querySelector('.nav-btn') });
  });
  window.showPage = showPage;
