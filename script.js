const PAGE_TURN_DURATION = 1000;
const pages = document.querySelectorAll('.book-page.page-right');
const pageTurnBtn = document.querySelectorAll('.nextprev-btn');
let currentPage = 0;
let transitionTimeout = null;
let isAnimating = false;
let touchStartX = 0;
let touchEndX = 0;
const pageHashes = ['', 'services', 'skills', 'photo', 'quote', 'project', 'contact'];

/* ── Page turn logic ── */

pageTurnBtn.forEach((el) => {
    el.onclick = () => {
        if (isAnimating) return;

        const pageId = el.getAttribute('data-page');
        const pageIdx = Array.from(pages).findIndex(p => p.id === pageId);
        const isBack = el.classList.contains('back');
        const newCurrent = Math.max(0, Math.min(pages.length, isBack ? pageIdx : pageIdx + 1));
        const flippingPage = pageIdx;

        if (transitionTimeout) {
            clearTimeout(transitionTimeout);
            transitionTimeout = null;
        }

        pages.forEach((page, i) => {
            if (i === flippingPage) {
                page.style.zIndex = 100;
                if (isBack) {
                    page.classList.remove('turn');
                } else {
                    page.classList.add('turn');
                }
            } else if (i < newCurrent) {
                page.classList.add('turn');
                page.style.zIndex = i;
            } else {
                page.classList.remove('turn');
                page.style.zIndex = 90 - i;
            }
        });

        transitionTimeout = setTimeout(() => {
            pages.forEach((page, i) => {
                if (i < newCurrent) {
                    page.classList.add('turn');
                    page.style.zIndex = i;
                } else if (i === newCurrent) {
                    page.classList.remove('turn');
                    if (newCurrent === pages.length) {
                        page.classList.add('turn');
                    }
                    page.style.zIndex = 100;
                } else {
                    page.classList.remove('turn');
                    page.style.zIndex = 90 - i;
                }
            });
            currentPage = newCurrent;
            transitionTimeout = null;
            updateHash(currentPage);
            updatePageIndicator(currentPage);
        }, PAGE_TURN_DURATION);
    };
});

/* ── Shortcut: Contact Me! ── */

const contactMeBtn = document.querySelector('.btn.contact-me');
if (contactMeBtn) {
    contactMeBtn.onclick = () => {
        if (isAnimating) return;
        if (transitionTimeout) {
            clearTimeout(transitionTimeout);
            transitionTimeout = null;
        }
        currentPage = pages.length;
        pages.forEach((page, i) => {
            page.classList.add('turn');
            page.style.zIndex = i;
        });
        updateHash(currentPage);
        updatePageIndicator(currentPage);
    };
}

/* ── Shortcut: Back to Profile ── */

const backProfileBtn = document.querySelector('.back-profile');
if (backProfileBtn) {
    backProfileBtn.onclick = () => {
        if (isAnimating) return;
        if (transitionTimeout) {
            clearTimeout(transitionTimeout);
            transitionTimeout = null;
        }
        currentPage = 0;
        pages.forEach((page, i) => {
            page.classList.remove('turn');
            page.style.zIndex = i === 0 ? 100 : 90 - i;
        });
        updateHash(currentPage);
        updatePageIndicator(currentPage);
    };
}



/* ── Read More toggles ── */

document.querySelectorAll('.read-more').forEach((btn) => {
    btn.onclick = (e) => {
        e.preventDefault();
        const content = btn.parentElement;
        const moreText = content.querySelector('.more-text');
        if (moreText) {
            const isExpanded = moreText.classList.toggle('expanded');
            btn.textContent = isExpanded ? 'Show Less' : 'Read More';
        }
    };
});

/* ── Keyboard navigation ── */

document.addEventListener('keydown', (e) => {
    if (isAnimating) return;
    if (e.key === 'ArrowRight') {
        const nextBtn = document.querySelector('.nextprev-btn:not(.back)');
        if (nextBtn) nextBtn.click();
    } else if (e.key === 'ArrowLeft') {
        const prevBtn = document.querySelector('.nextprev-btn.back');
        if (prevBtn) prevBtn.click();
    }
});

/* ── Touch swipe support ── */

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    if (isAnimating) return;
    touchEndX = e.changedTouches[0].screenX;
    const swipeDistance = touchStartX - touchEndX;

    if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0) {
            const nextBtn = document.querySelector('.nextprev-btn:not(.back)');
            if (nextBtn) nextBtn.click();
        } else {
            const prevBtn = document.querySelector('.nextprev-btn.back');
            if (prevBtn) prevBtn.click();
        }
    }
}, { passive: true });

/* ── Page indicator ── */

function updatePageIndicator(page) {
    const indicator = document.querySelector('.page-indicator');
    if (indicator) {
        const leftPage = page * 2 + 1;
        indicator.textContent = `Page ${leftPage}-${leftPage + 1} of ${pages.length * 2}`;
    }
}

/* ── URL hash routing ── */

function updateHash(page) {
    const hash = pageHashes[page] || '';
    const url = hash ? `#${hash}` : window.location.pathname;
    history.replaceState(null, '', url);
}

/* ── Form submission ── */

const contactForm = document.querySelector('.contact-box form');
if (contactForm) {
    contactForm.onsubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('#send-btn');
        const originalText = submitBtn.value;

        submitBtn.value = 'Sending...';
        submitBtn.disabled = true;

        try {
            const res = await fetch(contactForm.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' },
            });

            if (res.ok) {
                contactForm.innerHTML = '<p class="success-message">Message sent! I\'ll get back to you soon. ✨</p>';
            } else {
                alert('Something went wrong. Please try again later.');
                submitBtn.value = originalText;
                submitBtn.disabled = false;
            }
        } catch {
            alert('Network error. Please check your connection.');
            submitBtn.value = originalText;
            submitBtn.disabled = false;
        }
    };
}

/* ── Auto-open animation ── */

const coverRight = document.querySelector('.cover.cover-right');

setTimeout(() => {
    coverRight.classList.add('turn');
}, 2100);

setTimeout(() => {
    coverRight.style.zIndex = -1;
}, 2800);

isAnimating = true;
pages.forEach((_, index) => {
    const pageIndex = pages.length - 1 - index;
    setTimeout(() => {
        pages[pageIndex].classList.remove('turn');
        if (pageIndex === 0) {
            setTimeout(() => {
                currentPage = 0;
                pages.forEach((page, i) => {
                    page.style.zIndex = i === 0 ? 100 : 90 - i;
                });
                updatePageIndicator(currentPage);
                isAnimating = false;
            }, 500);
        }
    }, (index + 1) * 200 + 2100);
});

/* ── Hash-based deep link on load ── */

window.addEventListener('load', () => {
    const hash = window.location.hash.slice(1);
    if (hash === 'contact' && contactMeBtn) {
        setTimeout(() => contactMeBtn.click(), 3000);
    }
});
