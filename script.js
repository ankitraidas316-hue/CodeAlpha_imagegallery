const gallery = document.getElementById('gallery');
const filterBtns = document.querySelectorAll('.filters .btn');
const styleBtns = document.querySelectorAll('.styles .btn');

const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImage');
const lbCaption = document.getElementById('lbCaption');
const lbCount = document.getElementById('lbCount');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const closeBtn = document.getElementById('closeBtn');

let currentIndex = 0;
let currentList = [];

// Get visible images
function visibleCards() {
  return Array.from(gallery.querySelectorAll('.card'))
    .filter(card => !card.classList.contains('hidden'));
}

// Set active button
function setActive(btns, btn) {
  btns.forEach(b => b.classList.toggle('active', b === btn));
}

// Filter by category
filterBtns.forEach(btn => btn.addEventListener('click', () => {
  setActive(filterBtns, btn);
  const filter = btn.dataset.filter;
  document.querySelectorAll('.card').forEach(card => {
    const match = filter === 'all' || card.dataset.category === filter;
    card.classList.toggle('hidden', !match);
  });
  currentList = visibleCards();
}));

// Change image style (filter)
styleBtns.forEach(btn => btn.addEventListener('click', () => {
  setActive(styleBtns, btn);
  const val = btn.dataset.style;
  document.documentElement.style.setProperty('--img-filter', val === 'none' ? 'none' : val);
}));

// Open lightbox
function openLightbox(index) {
  currentList = visibleCards();
  currentIndex = index;
  updateLightbox();
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// Close lightbox
function closeLightbox() {
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

// Update lightbox content
function updateLightbox() {
  const card = currentList[currentIndex];
  const img = card.querySelector('img');
  const caption = card.querySelector('figcaption')?.textContent || img.alt;
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lbCaption.textContent = caption;
  lbCount.textContent = `${currentIndex + 1} / ${currentList.length}`;
}

// Next/Previous buttons
function next() { currentIndex = (currentIndex + 1) % currentList.length; updateLightbox(); }
function prev() { currentIndex = (currentIndex - 1 + currentList.length) % currentList.length; updateLightbox(); }

// Event listeners
gallery.addEventListener('click', e => {
  const card = e.target.closest('.card');
  if (!card) return;
  const list = visibleCards();
  const index = list.indexOf(card);
  openLightbox(index);
});
lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
closeBtn.addEventListener('click', closeLightbox);
nextBtn.addEventListener('click', next);
prevBtn.addEventListener('click', prev);

document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft') prev();
});

// Initialize list
currentList = visibleCards();
