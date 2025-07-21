// Inject stylesheet
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'styles.css';
document.head.appendChild(link);

// Helper to create elements
function create(tag, html = '', className) {
  const el = document.createElement(tag);
  el.innerHTML = html;
  if (className) el.className = className;
  return el;
}

// Header
const header = create('header', '<h1>Kingsley Inspires</h1><p>Thoughts. Stories. Influence.</p>');
document.body.appendChild(header);

// Nav
const nav = create('nav');
const pages = ['Home', 'About', 'Blog', 'News', 'Contact', 'Auth'];
let currentBtn;
pages.forEach(name => {
  const btn = create('button', name);
  btn.onclick = () => renderPage(name, btn);
  nav.appendChild(btn);
  if (!currentBtn) currentBtn = btn;
});
document.body.appendChild(nav);

// Main container
const main = create('main');
const postsSection = create('section', '', 'posts');
main.appendChild(postsSection);
document.body.appendChild(main);

// Footer
const footer = create('footer', '© 2025 Kingsley Inspires — Follow me on Twitter • Instagram');
document.body.appendChild(footer);

// Render function
function renderPage(page, btn) {
  currentBtn?.classList.remove('active');
  btn.classList.add('active');
  currentBtn = btn;

  postsSection.innerHTML = '';

  if (page === 'Home') {
    postsSection.append(create('div', '<h2>Welcome!</h2><p>Live your best online life—one post at a time.</p>'));
  }

  if (page === 'About') {
    postsSection.append(create('div', '<h2>About Me</h2><p>I’m Kingsley—digital storyteller and creator mentor.</p>'));
  }

  if (page === 'Blog') {
    [
      ['How I Built My Audience', 'Being real was the key...'],
      ['Tools I Use Daily', 'Productivity and planning tips...'],
      ['Overcoming Burnout', 'My personal journey...']
    ].forEach(([t, txt]) => {
      const p = create('div', `<h3>${t}</h3><p>${txt}</p>`, 'post');
      postsSection.appendChild(p);
    });
  }

  if (page === 'News') {
    const newsContainer = create('section', '<h3>🌍 World News</h3>', 'news');
    const list = create('ul');
    newsContainer.appendChild(list);
    postsSection.appendChild(newsContainer);

    fetchRSS('https://feeds.bbci.co.uk/news/world/rss.xml', list);
  }

  if (page === 'Contact') {
    const form = create('form', `
      <h2>Contact Me</h2>
      <label>Name:</label><br><input type="text" required><br>
      <label>Message:</label><br><textarea required></textarea><br>
      <button type="submit">Send</button>
    `);
    form.onsubmit = e => { e.preventDefault(); alert('Thanks! I’ll be in touch.'); };
    postsSection.appendChild(form);
  }
}

// RSS fetcher with thumbnails and link below the image
// RSS fetcher with thumbnails and link BELOW image, fetching 10 items
async function fetchRSS(url, listEl) {
  try {
    const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
    const text = await res.text();
    const xml = new window.DOMParser().parseFromString(text, 'text/xml');
    const items = xml.querySelectorAll('item');

    items.forEach((item, i) => {
      if (i >= 10) return; // ✅ Show more news: 10 items

      let thumb = '';
      const media = item.querySelector('media\\:thumbnail, thumbnail');
      if (media?.getAttribute('url')) thumb = media.getAttribute('url');
      else {
        const enc = item.querySelector('enclosure');
        if (enc?.getAttribute('type')?.startsWith('image/')) thumb = enc.getAttribute('url');
      }

      const title = item.querySelector('title')?.textContent;
      const link = item.querySelector('link')?.textContent;
      const date = item.querySelector('pubDate')?.textContent;

      const li = create('li');

      // Add thumbnail image
      if (thumb) {
        const img = create('img');
        img.src = thumb;
        img.alt = title;
        img.className = 'news-thumb';
        li.appendChild(img);
      }

      // ✅ Put link under the image
      const a = create('a', title);
      a.href = link;
      a.target = '_blank';
      a.className = 'news-link';
      li.appendChild(a);

      // Add publication date
      const time = create('time', new Date(date).toLocaleString());
      li.appendChild(time);

      listEl.appendChild(li);
    });
  } catch {
    listEl.innerHTML = '<li>Error loading News feed.</li>';
  }
}

// Initialize Home
renderPage('Home', document.querySelector('nav button'));