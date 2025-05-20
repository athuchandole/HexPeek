chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    func: extractColors
  }, function (results) {
    const colors = [...new Set(results[0].result)];
    const container = document.getElementById('colorList');
    colors.forEach(color => {
      const div = document.createElement('div');
      div.className = 'color-item';
      div.innerHTML = `
        <div class="color-box" style="background:${color}"></div>
        <div class="color-code">${color}</div>
        <button class="copy-button">Copy</button>
      `;

      const button = div.querySelector('button');
      button.onclick = () => {
        navigator.clipboard.writeText(color).then(() => {
          // Change button text
          const originalText = button.textContent;
          button.textContent = "Copied ✅";
          button.disabled = true;

          // Revert after 1.5 seconds
          setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
          }, 1500);
        });
      };

      container.appendChild(div);
    });
  });
});

function extractColors() {
  const elements = Array.from(document.querySelectorAll('*'));
  const colors = [];
  elements.forEach(el => {
    const styles = getComputedStyle(el);
    ['color', 'backgroundColor', 'borderColor'].forEach(prop => {
      const color = styles[prop];
      if (color && !colors.includes(color)) {
        colors.push(color);
      }
    });
  });
  return colors.map(c => {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.fillStyle = c;
    return ctx.fillStyle;
  });
}

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  themeToggle.textContent = body.classList.contains('dark') ? 'Day' : 'Night';
});

