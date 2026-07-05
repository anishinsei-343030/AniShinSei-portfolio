const pages = document.querySelectorAll('.book-page.page-right');
const pageTurnBtn = document.querySelectorAll('.nextprev-btn');
let currentPage = 0;
let transitionTimeout = null;

pageTurnBtn.forEach((el) => {
    el.onclick = () => {
        const pageId = el.getAttribute('data-page');
        const pageIdx = Array.from(pages).findIndex(p => p.id === pageId);
        const isBack = el.classList.contains('back');
        const newCurrent = Math.max(0, Math.min(pages.length, isBack ? pageIdx : pageIdx + 1));
        const flippingPage = pageIdx;

        if (transitionTimeout) {
            clearTimeout(transitionTimeout);
            transitionTimeout = null;
        }

        // Phase 1: flipping page on top while animating
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

        // Phase 2: set final state after CSS transition completes
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
        }, 1000);
    };
});

const contactMeBtn = document.querySelector('.btn.contact-me');
contactMeBtn.onclick = () => {
    if (transitionTimeout) {
        clearTimeout(transitionTimeout);
        transitionTimeout = null;
    }
    currentPage = pages.length;
    pages.forEach((page, i) => {
        page.classList.add('turn');
        page.style.zIndex = i;
    });
};

const backProfileBtn = document.querySelector('.back-profile');
backProfileBtn.onclick = () => {
    if (transitionTimeout) {
        clearTimeout(transitionTimeout);
        transitionTimeout = null;
    }
    currentPage = 0;
    pages.forEach((page, i) => {
        page.classList.remove('turn');
        page.style.zIndex = i === 0 ? 100 : 90 - i;
    });
};

const coverRight = document.querySelector('.cover.cover-right');

setTimeout(() => {
    coverRight.classList.add('turn');
}, 2100);

setTimeout(() => {
    coverRight.style.zIndex = -1;
}, 2800);

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
            }, 500);
        }
    }, (index + 1) * 200 + 2100);
});
