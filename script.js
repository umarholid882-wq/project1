// 1. Маалыматтар базасы (Mock Data)
const movies = [
    {
        id: 1,
        title: "Курманжан Датка",
        genre: "Тарыхый, Драма",
        duration: "135 мин",
        age: "12+",
        status: "now",
        poster: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&w=400&q=80",
        desc: "Алай ханышасы Курманжан Датканын өмүрү жана эл үчүн жасаган эрдиктери тууралуу тарыхый эпопея.",
        trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Dummy trailer link
    },
    {
        id: 2,
        title: "Акыркы көчмөн",
        genre: "Экшн, Укмуштуу окуя",
        duration: "110 мин",
        age: "16+",
        status: "now",
        poster: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=400&q=80",
        desc: "Тоолор арасындагы акыркы көчмөн уруусунун жашоосу жана алардын сырткы коркунучтарга каршы күрөшү.",
        trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: 3,
        title: "Шаардык легенда",
        genre: "Комедия",
        duration: "95 мин",
        age: "14+",
        status: "now",
        poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=80",
        desc: "Заманбап Бишкектеги жаштардын кызыктуу жана күлкүлүү окуялары.",
        trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: 4,
        title: "Космос сырлары 3",
        genre: "Фантастика",
        duration: "140 мин",
        age: "12+",
        status: "upcoming",
        poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80",
        desc: "Галактика аралык саякат жана жаңы планеталарды ачуу.",
        trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: 5,
        title: "Жашыруун агент",
        genre: "Триллер",
        duration: "125 мин",
        age: "18+",
        status: "upcoming",
        poster: "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=400&q=80",
        desc: "Эл аралык тыңчылардын оюну жана дүйнөнү сактап калуу миссиясы.",
        trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    }
];

const sessions = [
    { id: 101, movieId: 1, date: "today", time: "14:00", hall: "Зал 1" },
    { id: 102, movieId: 1, date: "today", time: "19:30", hall: "Зал 1" },
    { id: 103, movieId: 2, date: "today", time: "16:00", hall: "Зал 2" },
    { id: 104, movieId: 3, date: "tomorrow", time: "18:00", hall: "Зал 3" },
    { id: 105, movieId: 2, date: "tomorrow", time: "21:00", hall: "Зал 2" }
];

// DOM Элементтери
const nowShowingGrid = document.getElementById('now-showing-grid');
const upcomingGrid = document.getElementById('upcoming-grid');
const sessionsList = document.getElementById('sessions-list');
const filterDate = document.getElementById('filter-date');
const filterMovie = document.getElementById('filter-movie');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const toast = document.getElementById('toast');

// Брондоо элементтери
const bookingSection = document.getElementById('booking-section');
const seatMap = document.getElementById('seat-map');
const ticketCountEl = document.getElementById('ticket-count');
const totalPriceEl = document.getElementById('total-price');
const bookBtn = document.getElementById('book-btn');

const TICKET_PRICE = 300;
let currentSession = null;
let selectedSeats = [];

// 2. Инициализация
function init() {
    renderMovies();
    populateMovieFilter();
    renderSessions();
    loadReviews();
}

// Тасмаларды чыгаруу
function renderMovies() {
    nowShowingGrid.innerHTML = '';
    upcomingGrid.innerHTML = '';

    movies.forEach(movie => {
        const card = `
            <div class="movie-card">
                <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <p class="movie-meta">${movie.genre} | ${movie.duration} | ${movie.age}</p>
                    <p class="movie-desc">${movie.desc}</p>
                    <div class="movie-actions">
                        <button class="btn btn-secondary btn-sm" onclick="openTrailer('${movie.trailer}')">Трейлер</button>
                        ${movie.status === 'now' 
                            ? `<button class="btn btn-primary btn-sm" onclick="scrollToSessions(${movie.id})">Билет алуу</button>`
                            : `<button class="btn btn-primary btn-sm" onclick="preOrder('${movie.title}')">Алдын ала буйрутма</button>`
                        }
                    </div>
                </div>
            </div>
        `;
        if (movie.status === 'now') nowShowingGrid.innerHTML += card;
        else upcomingGrid.innerHTML += card;
    });
}

// Сеанстарды чыгаруу жана чыпкалоо
function populateMovieFilter() {
    const nowMovies = movies.filter(m => m.status === 'now');
    nowMovies.forEach(m => {
        filterMovie.innerHTML += `<option value="${m.id}">${m.title}</option>`;
    });
}

function renderSessions() {
    const dFilter = filterDate.value;
    const mFilter = filterMovie.value;

    let filtered = sessions.filter(s => {
        const matchDate = dFilter === 'all' || s.date === dFilter;
        const matchMovie = mFilter === 'all' || s.movieId == mFilter;
        return matchDate && matchMovie;
    });

    sessionsList.innerHTML = '';
    if(filtered.length === 0) {
        sessionsList.innerHTML = '<p>Бул убакытка сеанстар табылган жок.</p>';
        return;
    }

    filtered.forEach(session => {
        const movie = movies.find(m => m.id === session.movieId);
        const dayStr = session.date === 'today' ? "Бүгүн" : "Эртең";
        
        sessionsList.innerHTML += `
            <div class="session-card">
                <div>
                    <h4>${movie.title} (${movie.age})</h4>
                    <p>${dayStr}, ${session.time} | ${session.hall}</p>
                </div>
                <button class="btn btn-primary" onclick="openBooking(${session.id}, '${movie.title}', '${dayStr}, ${session.time}')">Орун тандоо</button>
            </div>
        `;
    });
}

filterDate.addEventListener('change', renderSessions);
filterMovie.addEventListener('change', renderSessions);

function scrollToSessions(movieId) {
    filterMovie.value = movieId;
    renderSessions();
    document.getElementById('sessions-section').scrollIntoView({ behavior: 'smooth' });
}

// 3. Билет брондоо логикасы
function openBooking(sessionId, title, time) {
    currentSession = sessionId;
    selectedSeats = [];
    document.getElementById('booking-movie-title').textContent = title;
    document.getElementById('booking-time').textContent = time;
    
    bookingSection.classList.remove('hidden');
    bookingSection.scrollIntoView({ behavior: 'smooth' });
    
    generateSeats();
    updateBookingSummary();
}

function generateSeats() {
    seatMap.innerHTML = '';
    // 5 катар, 8 орундуктан (Жасалма маалымат)
    for (let i = 0; i < 5; i++) {
        const row = document.createElement('div');
        row.className = 'seat-row';
        for (let j = 0; j < 8; j++) {
            const seat = document.createElement('div');
            seat.className = 'seat';
            // Кээ бир орундарды кокустан ээлетип коюу (демо үчүн)
            if (Math.random() < 0.3) {
                seat.classList.add('occupied');
            } else {
                seat.addEventListener('click', () => toggleSeat(seat, i, j));
            }
            row.appendChild(seat);
        }
        seatMap.appendChild(row);
    }
}

function toggleSeat(seatElement, row, col) {
    seatElement.classList.toggle('selected');
    const seatId = `${row}-${col}`;
    
    if (seatElement.classList.contains('selected')) {
        selectedSeats.push(seatId);
    } else {
        selectedSeats = selectedSeats.filter(id => id !== seatId);
    }
    updateBookingSummary();
}

function updateBookingSummary() {
    const count = selectedSeats.length;
    ticketCountEl.textContent = count;
    totalPriceEl.textContent = count * TICKET_PRICE;
    bookBtn.disabled = count === 0;
}

bookBtn.addEventListener('click', () => {
    // Брондоону localStorage'га сактап койсо болот
    showToast(`Ийгиликтүү! ${selectedSeats.length} билет брондолду. Жалпы: ${selectedSeats.length * TICKET_PRICE} сом.`);
    bookingSection.classList.add('hidden');
    selectedSeats = [];
});

document.getElementById('cancel-booking-btn').addEventListener('click', () => {
    bookingSection.classList.add('hidden');
    selectedSeats = [];
});

// 4. Трейлер, Модаль жана Алдын ала буйрутма
function openTrailer(url) {
    modalBody.innerHTML = `<iframe src="${url}" allowfullscreen></iframe>`;
    modal.classList.add('active');
}

function preOrder(movieTitle) {
    showToast(`«${movieTitle}» тасмасына алдын ала буйрутма кабыл алынды!`);
}

document.querySelector('.close-modal').addEventListener('click', () => {
    modal.classList.remove('active');
    modalBody.innerHTML = ''; // Ичиндеги видеону токтотуу үчүн
});

// 5. Пикирлер (Reviews with localStorage)
const reviewForm = document.getElementById('review-form');
const reviewsList = document.getElementById('reviews-list');

function loadReviews() {
    const reviews = JSON.parse(localStorage.getItem('cinemaReviews')) || [
        { name: "Айбек", rating: 5, text: "Керемет кинотеатр! Залдары абдан ыңгайлуу." }
    ];
    reviewsList.innerHTML = '';
    reviews.forEach(r => {
        reviewsList.innerHTML += `
            <div class="review-item">
                <div class="review-header">
                    <strong>${r.name}</strong>
                    <span class="review-stars">${'⭐'.repeat(r.rating)}</span>
                </div>
                <p>${r.text}</p>
            </div>
        `;
    });
}

reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reviewer-name').value;
    const rating = document.getElementById('review-rating').value;
    const text = document.getElementById('review-text').value;

    const newReview = { name, rating: parseInt(rating), text };
    const reviews = JSON.parse(localStorage.getItem('cinemaReviews')) || [];
    reviews.unshift(newReview); // Башына кошуу
    localStorage.setItem('cinemaReviews', JSON.stringify(reviews));

    reviewForm.reset();
    loadReviews();
    showToast('Пикириңиз ийгиликтүү кошулду!');
});

// 6. Издөө
document.getElementById('search-btn').addEventListener('click', performSearch);
document.getElementById('search-input').addEventListener('keyup', (e) => {
    if(e.key === 'Enter') performSearch();
});

function performSearch() {
    const query = document.getElementById('search-input').value.toLowerCase();
    if(!query) return;
    
    const found = movies.find(m => m.title.toLowerCase().includes(query));
    if(found) {
        if(found.status === 'now') {
            document.getElementById('now-showing').scrollIntoView({behavior: 'smooth'});
        } else {
            document.getElementById('upcoming').scrollIntoView({behavior: 'smooth'});
        }
        showToast(`Табылды: ${found.title}`);
    } else {
        showToast('Тасма табылган жок.');
    }
}

// 7. Жардамчы функциялар
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

const backToTopBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) backToTopBtn.style.display = 'block';
    else backToTopBtn.style.display = 'none';
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Сайтты жүргүзүү
init();
