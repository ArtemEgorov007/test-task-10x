// ─── Data ─────────────────────────────────────────────────────────────────────

const courses = [
  {
    id: 1,
    title: 'The Ultimate Google Ads Training Course',
    category: 'Marketing',
    price: 100,
    author: 'Jerome Bell',
    img: 'assets/mentors/jerome-bell.png',
  },
  {
    id: 2,
    title: 'Product Management Fundamentals',
    category: 'Management',
    price: 480,
    author: 'Marvin McKinney',
    img: 'assets/mentors/marvin-mckinney.png',
  },
  {
    id: 3,
    title: 'HR Management and Analytics',
    category: 'HR & Recruiting',
    price: 200,
    author: 'Leslie Alexander',
    img: 'assets/mentors/leslie-alexander.png',
  },
  {
    id: 4,
    title: 'Brand Management & PR Communications',
    category: 'Marketing',
    price: 530,
    author: 'Kristin Watson',
    img: 'assets/mentors/kristin-watson.png',
  },
  {
    id: 5,
    title: 'Graphic Design Basic',
    category: 'Design',
    price: 500,
    author: 'Guy Hawkins',
    img: 'assets/mentors/guy-hawkins.png',
  },
  {
    id: 6,
    title: 'Business Development Management',
    category: 'Management',
    price: 400,
    author: 'Dianne Russell',
    img: 'assets/mentors/dianne-russell.png',
  },
  {
    id: 7,
    title: 'Highload Software Architecture',
    category: 'Development',
    price: 600,
    author: 'Brooklyn Simmons',
    img: 'assets/mentors/brooklyn-simmons.png',
  },
  {
    id: 8,
    title: 'Human Resources – Selection and Recruitment',
    category: 'HR & Recruiting',
    price: 150,
    author: 'Kathryn Murphy',
    img: 'assets/mentors/kathryn-murphy.png',
  },
  {
    id: 9,
    title: 'User Experience. Human-centered Design',
    category: 'Design',
    price: 240,
    author: 'Cody Fisher',
    img: 'assets/mentors/jerome-bell.png',
  },
  {
    id: 10,
    title: 'Advanced Social Media Advertising',
    category: 'Marketing',
    price: 220,
    author: 'Esther Howard',
    img: 'assets/mentors/kristin-watson.png',
  },
  {
    id: 11,
    title: 'JavaScript & TypeScript for Professionals',
    category: 'Development',
    price: 380,
    author: 'Ralph Edwards',
    img: 'assets/mentors/marvin-mckinney.png',
  },
  {
    id: 12,
    title: 'UI/UX Design: From Wireframes to Prototype',
    category: 'Design',
    price: 310,
    author: 'Cameron Williamson',
    img: 'assets/mentors/dianne-russell.png',
  },
  {
    id: 13,
    title: 'Agile & Scrum: Complete Guide',
    category: 'Management',
    price: 270,
    author: 'Devon Lane',
    img: 'assets/mentors/leslie-alexander.png',
  },
  {
    id: 14,
    title: 'Talent Acquisition & Onboarding',
    category: 'HR & Recruiting',
    price: 190,
    author: 'Annette Black',
    img: 'assets/mentors/kathryn-murphy.png',
  },
  {
    id: 15,
    title: 'Node.js Microservices & Cloud Deployment',
    category: 'Development',
    price: 490,
    author: 'Jerome Bell',
    img: 'assets/mentors/jerome-bell.png',
  },
];

// ─── Category → CSS modifier mapping ─────────────────────────────────────────

const BADGE_MOD = {
  'Marketing':     'marketing',
  'Management':    'management',
  'HR & Recruiting': 'hr',
  'Design':        'design',
  'Development':   'development',
};

// ─── State ────────────────────────────────────────────────────────────────────

const PER_PAGE = 9;
let activeCategory = 'all';
let searchQuery    = '';
let currentPage    = 1;

// ─── DOM refs ─────────────────────────────────────────────────────────────────

const grid       = document.getElementById('courses-grid');
const loadMoreBtn = document.getElementById('load-more-btn');
const searchInput = document.getElementById('search-input');
const filterBtns  = document.querySelectorAll('.courses__filter');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFiltered() {
  const query = searchQuery.trim().toLowerCase();
  return courses.filter(c => {
    const matchCat    = activeCategory === 'all' || c.category === activeCategory;
    const matchSearch = !query || c.title.toLowerCase().includes(query);
    return matchCat && matchSearch;
  });
}

function createCardHTML(course) {
  const mod = BADGE_MOD[course.category] || 'marketing';
  return `
    <article class="card">
      <div class="card__image">
        <img
          class="card__photo"
          src="${course.img}"
          alt="${course.author}"
          loading="lazy"
          width="200"
          height="230"
        >
      </div>
      <div class="card__body">
        <span class="card__badge card__badge--${mod}">${course.category}</span>
        <h3 class="card__title">${course.title}</h3>
        <div class="card__meta">
          <span class="card__price">$${course.price}</span>
          <span class="card__author">| by ${course.author}</span>
        </div>
      </div>
    </article>
  `;
}

// ─── Render ───────────────────────────────────────────────────────────────────

function updateFilterCounts() {
  const query = searchQuery.trim().toLowerCase();
  const base = !query ? courses : courses.filter(c => c.title.toLowerCase().includes(query));
  filterBtns.forEach(btn => {
    const cat = btn.dataset.category;
    const count = cat === 'all' ? base.length : base.filter(c => c.category === cat).length;
    const sup = btn.querySelector('sup');
    if (sup) sup.textContent = count;
  });
}

function render() {
  const filtered = getFiltered();
  const visible  = filtered.slice(0, currentPage * PER_PAGE);

  updateFilterCounts();

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="courses__empty">No courses found</p>';
    loadMoreBtn.disabled = true;
    return;
  }

  grid.innerHTML = visible.map(createCardHTML).join('');
  loadMoreBtn.disabled = visible.length >= filtered.length;
}

// ─── Events ───────────────────────────────────────────────────────────────────

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.category === activeCategory) return;
    activeCategory = btn.dataset.category;
    currentPage    = 1;

    filterBtns.forEach(b => {
      b.classList.remove('courses__filter--active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('courses__filter--active');
    btn.setAttribute('aria-pressed', 'true');

    render();
  });
});

searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value;
  currentPage = 1;
  render();
});

loadMoreBtn.addEventListener('click', () => {
  currentPage++;
  render();
});

// ─── Init ─────────────────────────────────────────────────────────────────────

render();
