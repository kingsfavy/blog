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

// navigator

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

const footer = create('footer', `
  © 2025 Kingsley Inspires — Follow me on 
  <a href="https://twitter.com/yourhandle" target="_blank">Twitter</a> 
  <a href="https://instagram.com/yourhandle" target="_blank">Instagram</a>
`);
document.body.appendChild(footer);

// Render function or Home page

function renderPage(page, btn) {
  currentBtn?.classList.remove('active');
  btn.classList.add('active');
  currentBtn = btn;

  postsSection.innerHTML = '';

if (page === 'Home') {
  const hour = new Date().getHours();
  let greetingText;

  if (hour < 12) {
    greetingText = 'Good Morning ';
  } else if (hour < 18) {
    greetingText = 'Good Afternoon ';
  } else {
    greetingText = 'Good Evening ';
  }

  const greeting = create('div', `
    <h2>${greetingText}</h2>
    <p>Welcome to Kingsley Inspires!</p>
    <p>Live your best online life—one post at a time.</p>
  `);

const supportBtn = create('button', 'Subscribe', 'support-btn');
supportBtn.onclick = () => accountModal.style.display = 'block';

const accountModal = create('div', `
  <div class="modal-content">
    <span class="close">&times;</span>
<div>
    <h3>Subscribe to  Kingsley Inspires</h3>
    <p><strong>Geepay USD:</strong> 40630282079725816</p>
<br>
    <p><strong>Geepay Naira:</strong> 1843546077</p>
    <p><strong>Account Name:</strong> Effiong Kingsley Offiong</p>
</div>
  </div>
`, 'modal');

postsSection.append(greeting, supportBtn, accountModal);

// Close modal when 'x' is clicked
accountModal.querySelector('.close').onclick = () => {
  accountModal.style.display = 'none';
};

// Close modal on outside click
window.onclick = e => {
  if (e.target === accountModal) accountModal.style.display = 'none';
};


  postsSection.append(greeting, accountModal, supportBtn);
}




//  About

if (page === 'About') {
  const about = create('div', `
    <h2>Kingsley Effiong</h2>
<br>
    <img src="me.png" alt="Kingsley" class="about-img" />
    <p>I’m Kingsley—digital storyteller, content strategist, and creator mentor. I help people unlock the power of storytelling through blogs, visuals, and ideas that resonate.</p>
    <p>From a small corner of Nigeria, I’ve built an online community passionate about knowledge, influence, and growth.</p>
  `);
  postsSection.append(about);
}

// Blog 

  if (page === 'Blog') {
  const blogs = [
    {
      title: 'How I Built My Audience',
      content: 'Authenticity was my foundation. I shared stories that resonated and stayed consistent. That built trust, and trust grew my following. I focused on giving value and never lost sight of the community.',
    },
    {
      title: 'Tools I Use Daily',
      content: 'I rely on tools like Notion for planning, Canva for visual design, and Grammarly for writing clarity. These help me stay productive, creative, and consistent. Simplicity beats complexity.',
    },
    {
      title: 'Overcoming Burnout',
      content: 'There was a time I felt stuck. I stepped back to reflect, rested, and reconnected with my purpose. It taught me that self-care isn’t selfish—it’s survival in a fast-paced world.',
    },
    {
      title: 'Why Every Creator Needs a System',
      content: 'Consistency isn’t luck—it’s structure. I built a system for ideas, content production, and scheduling. That freed up energy to focus on creativity while still showing up every day.',
    }
  ];

  blogs.forEach(blog => {
    const post = create('div', '', 'post');

    const title = create('h3', blog.title);
    const summary = create('p', blog.content.slice(0, 100) + '...');
    const readMore = create('button', 'Read more');

    let expanded = false;
    readMore.onclick = () => {
      if (!expanded) {
        summary.innerText = blog.content;
        readMore.innerText = 'Show less';
      } else {
        summary.innerText = blog.content.slice(0, 100) + '...';
        readMore.innerText = 'Read more';
      }
      expanded = !expanded;
    };

    post.append(title, summary, readMore);
    postsSection.append(post);
  });
}

//News


  if (page === 'News') {
    const newsContainer = create('section', '<h3>🌍 World News</h3>', 'news');
    const list = create('ul');
    newsContainer.appendChild(list);
    postsSection.appendChild(newsContainer);
    fetchRSS('https://feeds.bbci.co.uk/news/world/rss.xml', list);
  }

// Contacts

  if (page === 'Contact') {
    const form = create('form', `
      <h2>Reach out</h2>
      <label>Name:</label><br><input type="text" required><br>
      <label>Message:</label><br><textarea required></textarea><br>
      <button type="submit">Send</button>
    `);
    form.onsubmit = e => { e.preventDefault(); alert('Thanks! I’ll be in touch.'); };
    postsSection.appendChild(form);
  }

//AUTH

  if (page === 'Auth') {
    const authForms = create('div', `
      <h2>Sign Up</h2>
      <input type="text" placeholder="Username" required><br>
      <input type="email" placeholder="Email" required><br>
      <input type="password" placeholder="Password" required><br>
      <button>Register</button>
      <hr>
      <h2>Sign In</h2>
      <input type="email" placeholder="Email" required><br>
      <input type="password" placeholder="Password" required><br>
      <button>Login</button>
    `, 'auth');
    postsSection.appendChild(authForms);
  }
}

// Fetch world news with thumbnails and links
async function fetchRSS(url, listEl) {
  try {
    const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
    const text = await res.text();
    const xml = new window.DOMParser().parseFromString(text, 'text/xml');
    const items = xml.querySelectorAll('item');

    items.forEach((item, i) => {
      if (i >= 10) return;

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
      if (thumb) {
        const img = create('img');
        img.src = thumb;
        img.alt = title;
        img.className = 'news-thumb';
        li.appendChild(img);
      }

      const a = create('a', title);
      a.href = link;
      a.target = '_blank';
      a.className = 'news-link';
      li.appendChild(a);

      const time = create('time', new Date(date).toLocaleString());
      li.appendChild(time);

      listEl.appendChild(li);
    });
  } catch {
    listEl.innerHTML = '<li>Error loading News feed.</li>';
  }
}

// Start on Home
renderPage('Home', document.querySelector('nav button'));