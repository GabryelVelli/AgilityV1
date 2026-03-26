async function loadTopbar() {
  const container = document.getElementById('topbar-container');
  if (!container) {
    return;
  }

  try {
    const response = await fetch('/components/topbar.html', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Falha ao carregar topbar: ${response.status}`);
    }

    const topbarMarkup = await response.text();
    container.outerHTML = topbarMarkup;
    document.dispatchEvent(new CustomEvent('topbar:loaded'));
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', loadTopbar);
