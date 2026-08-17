// ======================================================
// DREAMPATH DISCOVER - MAIN JAVASCRIPT
// ======================================================


// ======================================================
// GOOGLE APPS SCRIPT WEB APP URL
// ======================================================

const APPS_SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbx8Mc6PVYk7G44OTZwlVyqc6yeJ9mMVY2dae16-Sl5yzWHJuPosG37Qq0Swn7_3FeUEPw/exec';


// ======================================================
// FEEDBACK API URL
// ======================================================

const FEEDBACK_API_URL =
    APPS_SCRIPT_URL + '?action=feedback';


// ======================================================
// HEADER
// ======================================================

const header = `
<header class="site-header">

    <nav class="nav container">

        <a class="brand" href="index.html">

            <img
                class="brand-logo"
                src="images/kodaikanal complete/WhatsApp Image 2026-08-08 at 1.10.08 PM.jpeg"
                alt="Dreampath Discover Logo"
            >

            <span class="brand-text">
                DREAMPATH<br>
                DISCOVER
            </span>

        </a>


        <button
            class="menu"
            aria-label="Open menu"
            aria-expanded="false"
            type="button">

            ☰

        </button>


        <ul class="nav-links">

            <li>
                <a href="index.html">
                    Home
                </a>
            </li>

            <li>
                <a href="trips.html">
                    Trips
                </a>
            </li>

            <li>
                <a href="tour-packages.html">
                    Journeys
                </a>
            </li>

            <li>
                <a href="about.html">
                    About
                </a>
            </li>

            <li>
                <a href="contact.html">
                    Contact
                </a>
            </li>

        </ul>


        <button
            class="nav-book js-book"
            type="button">

            Book a journey

        </button>

    </nav>

</header>
`;


// ======================================================
// FOOTER
// ======================================================

const footer = `
<footer class="site-footer">

    <div class="container">

        <div class="footer-top">

            <div>

                <a
                    class="footer-brand"
                    href="index.html">

                    DREAMPATH<br>
                    DISCOVER

                </a>


                <p class="footer-copy">

                    Thoughtful journeys through South India’s
                    most soulful places.

                </p>

            </div>


            <div class="footer-col">

                <strong>
                    EXPLORE
                </strong>

                <a href="trips.html">
                    Trips
                </a>

                <a href="tour-packages.html">
                    Journeys
                </a>

                <a href="about.html">
                    Our story
                </a>

                <a href="feedback.html">
                    Share feedback
                </a>

            </div>


            <div class="footer-col">

                <strong>
                    STAY IN TOUCH
                </strong>

                <a
                    href="mailto:queries.dreampathdiscover@gmail.com">

                    queries.dreampathdiscover@gmail.com

                </a>

                <span>
                    Sunday – Saturday
                </span>

                <span>
                    9:00 AM – 6:00 PM IST
                </span>

                <span>
                    India
                </span>

            </div>

        </div>


        <div class="footer-bottom">

            <span>
                © ${new Date().getFullYear()}
                Dreampath Discover
            </span>

            <span>
                Travel softly.
                Remember deeply.
            </span>

        </div>

    </div>

</footer>
`;


// ======================================================
// BOOKING MODAL
// ======================================================

const modal = `

<div
    class="modal"
    role="dialog"
    aria-modal="true"
    aria-label="Book a journey">

    <div class="modal-card">

        <button
            class="modal-close"
            aria-label="Close"
            type="button">

            ×

        </button>


        <p class="eyebrow">
            START YOUR JOURNEY
        </p>


        <h2>
            Let’s make a plan.
        </h2>


        <p class="lead">
            Share a few details and our travel team
            will be in touch.
        </p>


        <form
            class="form"
            data-form="booking">


            <!-- =========================================
                 FULL NAME
            ========================================== -->

            <label>

                Full name

                <input
                    name="name"
                    type="text"
                    required
                    autocomplete="name"
                    placeholder="Enter your full name">

            </label>


            <!-- =========================================
                 PHONE + EMAIL
            ========================================== -->

            <div class="form-row">

                <label>

                    Contact number

                    <input
                        name="phone"
                        type="tel"
                        inputmode="tel"
                        pattern="[0-9+ ]{10,15}"
                        required
                        autocomplete="tel"
                        placeholder="Enter phone number">

                </label>


                <label>

                    Email

                    <input
                        name="email"
                        type="email"
                        required
                        autocomplete="email"
                        placeholder="Enter email address">

                </label>

            </div>


            <!-- =========================================
                 JOURNEY / PACKAGE
            ========================================== -->

            <label>

                Journey / Package

                <input
                    name="trip"
                    type="text"
                    required
                    autocomplete="off"
                    placeholder="Example: Kodaikanal Package">

            </label>


            <!-- =========================================
                 PREFERRED JOURNEY DATE
            ========================================== -->

            <label>

                Preferred journey date

                <input
                    name="travelDate"
                    type="date"
                    required>

            </label>


            <!-- =========================================
                 ADULTS + CHILDREN
            ========================================== -->

            <div class="form-row">

                <label>

                    Adults

                    <input
                        name="adults"
                        type="number"
                        min="1"
                        max="100"
                        value="1"
                        required>

                </label>


                <label>

                    Children

                    <input
                        name="children"
                        type="number"
                        min="0"
                        max="100"
                        value="0">

                </label>

            </div>


            <!-- =========================================
                 CHILD POLICY
            ========================================== -->

            <div
                class="booking-policy"
                role="note">

                <strong>
                    Child & Accessibility Policy
                </strong>

                <p>

                    Children under 10 years are charged
                    50%, while children under 5 travel free.
                    Guests with disabilities may be eligible
                    for special assistance or applicable
                    concessions.

                </p>

                <p>

                    Please mention any accessibility
                    requirements or children under 5 in the
                    <strong>“Anything Else”</strong> field
                    when booking.

                </p>

            </div>


            <!-- =========================================
                 ADDITIONAL MESSAGE
            ========================================== -->

            <label>

                Anything else?

                <textarea
                    name="message"
                    rows="4"
                    placeholder="Tell us about children under 5, accessibility requirements, special requests, or anything else we should know."></textarea>

            </label>


            <!-- =========================================
                 SUBMIT
            ========================================== -->

            <button
                class="btn btn-primary"
                type="submit">

                Send enquiry

                <span>
                    →
                </span>

            </button>


            <p
                class="form-status"
                aria-live="polite">
            </p>


        </form>

    </div>

</div>

`;


// ======================================================
// INSERT HEADER / FOOTER / MODAL
// ======================================================

const headerContainer =
    document.getElementById('site-header');

const footerContainer =
    document.getElementById('site-footer');

const modalContainer =
    document.getElementById('booking-modal');


if (headerContainer) {

    headerContainer.innerHTML =
        header;

}


if (footerContainer) {

    footerContainer.innerHTML =
        footer;

}


if (modalContainer) {

    modalContainer.innerHTML =
        modal;

}


// ======================================================
// SET MINIMUM JOURNEY DATE
// ======================================================

function setMinimumTravelDate() {

    const travelDateInputs =
        document.querySelectorAll(
            'input[name="travelDate"]'
        );


    if (!travelDateInputs.length) {

        return;

    }


    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, '0');


    const day =
        String(
            today.getDate()
        ).padStart(2, '0');


    const todayString =
        `${year}-${month}-${day}`;


    travelDateInputs.forEach(
        input => {

            input.min =
                todayString;

        }
    );

}


setMinimumTravelDate();


// ======================================================
// ACTIVE NAVIGATION
// ======================================================

const page =
    document.body.dataset.page || '';


document
    .querySelectorAll('.nav-links a')
    .forEach(
        link => {

            const href =
                link.getAttribute('href') || '';


            const targetPage =
                page === 'packages'
                    ? 'tour-packages'
                    : page;


            if (
                targetPage &&
                href.includes(targetPage)
            ) {

                link.classList.add(
                    'active'
                );

            }

        }
    );


// ======================================================
// HEADER SCROLL EFFECT
// ======================================================

const nav =
    document.querySelector(
        '.site-header'
    );


if (nav) {

    const updateHeader =
        () => {

            nav.classList.toggle(
                'scrolled',
                window.scrollY > 20
            );

        };


    window.addEventListener(
        'scroll',
        updateHeader,
        {
            passive: true
        }
    );


    updateHeader();

}


// ======================================================
// MOBILE MENU
// ======================================================

const menuButton =
    document.querySelector(
        '.menu'
    );


if (menuButton) {

    menuButton.addEventListener(
        'click',
        () => {

            const navLinks =
                document.querySelector(
                    '.nav-links'
                );


            if (!navLinks) {

                return;

            }


            const isOpen =
                navLinks.classList.toggle(
                    'open'
                );


            menuButton.setAttribute(
                'aria-expanded',
                String(isOpen)
            );


            menuButton.setAttribute(
                'aria-label',
                isOpen
                    ? 'Close menu'
                    : 'Open menu'
            );

        }
    );

}


// ======================================================
// CLOSE MOBILE MENU AFTER NAVIGATION
// ======================================================

document
    .querySelectorAll(
        '.nav-links a'
    )
    .forEach(
        link => {

            link.addEventListener(
                'click',
                () => {

                    const navLinks =
                        document.querySelector(
                            '.nav-links'
                        );


                    if (navLinks) {

                        navLinks.classList.remove(
                            'open'
                        );

                    }


                    if (menuButton) {

                        menuButton.setAttribute(
                            'aria-expanded',
                            'false'
                        );


                        menuButton.setAttribute(
                            'aria-label',
                            'Open menu'
                        );

                    }

                }
            );

        }
    );


// ======================================================
// BOOKING MODAL
// ======================================================

const dialog =
    document.querySelector(
        '.modal'
    );


function openBook(
    trip = ''
) {

    if (!dialog) {

        return;

    }


    dialog.classList.add(
        'open'
    );


    document.body.classList.add(
        'modal-open'
    );


    if (trip) {

        const tripInput =
            dialog.querySelector(
                '[name="trip"]'
            );


        if (tripInput) {

            tripInput.value =
                trip;

        }

    }


    setMinimumTravelDate();


    const firstInput =
        dialog.querySelector(
            'input'
        );


    if (firstInput) {

        setTimeout(
            () => {

                firstInput.focus();

            },
            100
        );

    }

}


function closeBook() {

    if (!dialog) {

        return;

    }


    dialog.classList.remove(
        'open'
    );


    document.body.classList.remove(
        'modal-open'
    );

}


// ======================================================
// BOOK BUTTONS
// ======================================================

document
    .querySelectorAll(
        '.js-book'
    )
    .forEach(
        button => {

            button.addEventListener(
                'click',
                () => {

                    openBook(
                        button.dataset.trip || ''
                    );

                }
            );

        }
    );


// ======================================================
// CLOSE MODAL
// ======================================================

if (dialog) {

    dialog.addEventListener(
        'click',
        event => {

            if (
                event.target === dialog ||
                event.target.closest(
                    '.modal-close'
                )
            ) {

                closeBook();

            }

        }
    );

}


// ======================================================
// ESCAPE KEY
// ======================================================

window.addEventListener(
    'keydown',
    event => {

        if (
            event.key === 'Escape'
        ) {

            closeBook();

        }

    }
);


// ======================================================
// TRIP FILTERS
// ======================================================

document
    .querySelectorAll(
        '.filter'
    )
    .forEach(
        button => {

            button.addEventListener(
                'click',
                () => {

                    document
                        .querySelectorAll(
                            '.filter'
                        )
                        .forEach(
                            item => {

                                item.classList.remove(
                                    'active'
                                );

                            }
                        );


                    button.classList.add(
                        'active'
                    );


                    const filter =
                        button.dataset.filter;


                    document
                        .querySelectorAll(
                            '.trip-row'
                        )
                        .forEach(
                            row => {

                                const type =
                                    row.dataset.type || '';


                                row.hidden =
                                    filter !== 'all' &&
                                    !type.includes(
                                        filter
                                    );

                            }
                        );

                }
            );

        }
    );


// ======================================================
// FORM SUBMISSION
// ======================================================

document
    .querySelectorAll(
        '[data-form]'
    )
    .forEach(
        form => {

            form.addEventListener(
                'submit',
                async event => {

                    event.preventDefault();


                    const status =
                        form.querySelector(
                            '.form-status'
                        );


                    const submitButton =
                        form.querySelector(
                            'button[type="submit"]'
                        );


                    // ----------------------------------
                    // CHECK URL
                    // ----------------------------------

                    if (!APPS_SCRIPT_URL) {

                        if (status) {

                            status.textContent =
                                'Form service is not configured.';

                            status.classList.add(
                                'error'
                            );

                        }

                        return;

                    }


                    // ----------------------------------
                    // DISABLE SUBMIT
                    // ----------------------------------

                    if (submitButton) {

                        submitButton.disabled =
                            true;


                        submitButton.innerHTML =
                            'Sending... <span>→</span>';

                    }


                    // ----------------------------------
                    // CLEAR STATUS
                    // ----------------------------------

                    if (status) {

                        status.textContent =
                            '';


                        status.classList.remove(
                            'success',
                            'error'
                        );

                    }


                    // ----------------------------------
                    // COLLECT FORM DATA
                    // ----------------------------------

                    const formData =
                        new FormData(
                            form
                        );


                    const data =
                        Object.fromEntries(
                            formData.entries()
                        );


                    // ----------------------------------
                    // FORM TYPE
                    // ----------------------------------

                    data.type =
                        form.dataset.form;


                    // ----------------------------------
                    // CLEAN BOOKING DATA
                    // ----------------------------------

                    if (
                        form.dataset.form ===
                        'booking'
                    ) {

                        data.name =
                            String(
                                data.name || ''
                            ).trim();


                        data.phone =
                            String(
                                data.phone || ''
                            ).trim();


                        data.email =
                            String(
                                data.email || ''
                            ).trim();


                        data.trip =
                            String(
                                data.trip || ''
                            ).trim();


                        data.travelDate =
                            String(
                                data.travelDate || ''
                            ).trim();


                        data.adults =
                            String(
                                data.adults || '1'
                            ).trim();


                        data.children =
                            String(
                                data.children || '0'
                            ).trim();


                        data.message =
                            String(
                                data.message || ''
                            ).trim();

                    }


                    // ----------------------------------
                    // DEBUG
                    // ----------------------------------

                    console.log(
                        'Dreampath form data:',
                        data
                    );


                    // ----------------------------------
                    // SEND TO APPS SCRIPT
                    // ----------------------------------

                    try {

                        await fetch(
                            APPS_SCRIPT_URL,
                            {

                                method:
                                    'POST',

                                mode:
                                    'no-cors',

                                headers: {

                                    'Content-Type':
                                        'text/plain;charset=utf-8'

                                },

                                body:
                                    JSON.stringify(
                                        data
                                    )

                            }
                        );


                        // --------------------------------
                        // RESET FORM
                        // --------------------------------

                        form.reset();


                        // --------------------------------
                        // RESTORE BOOKING DEFAULTS
                        // --------------------------------

                        if (
                            form.dataset.form ===
                            'booking'
                        ) {

                            const adultsInput =
                                form.querySelector(
                                    '[name="adults"]'
                                );


                            const childrenInput =
                                form.querySelector(
                                    '[name="children"]'
                                );


                            if (adultsInput) {

                                adultsInput.value =
                                    '1';

                            }


                            if (childrenInput) {

                                childrenInput.value =
                                    '0';

                            }


                            setMinimumTravelDate();

                        }


                        // --------------------------------
                        // SUCCESS MESSAGE
                        // --------------------------------

                        if (status) {

                            status.textContent =
                                'Thank you — we’ll be in touch soon.';

                            status.classList.add(
                                'success'
                            );

                        }


                        // --------------------------------
                        // SUCCESS BUTTON
                        // --------------------------------

                        if (submitButton) {

                            submitButton.disabled =
                                false;


                            submitButton.innerHTML =
                                'Sent successfully <span>✓</span>';

                        }


                        // --------------------------------
                        // REFRESH FEEDBACK
                        // --------------------------------

                        if (
                            form.dataset.form ===
                            'feedback'
                        ) {

                            setTimeout(
                                () => {

                                    loadTravellerStories();

                                },
                                1200
                            );

                        }


                        // --------------------------------
                        // CLOSE BOOKING MODAL
                        // --------------------------------

                        if (
                            form.dataset.form ===
                            'booking'
                        ) {

                            setTimeout(
                                () => {

                                    closeBook();


                                    if (submitButton) {

                                        submitButton.disabled =
                                            false;


                                        submitButton.innerHTML =
                                            'Send enquiry <span>→</span>';

                                    }

                                },
                                3000
                            );

                        }


                    } catch (error) {

                        console.error(
                            'Dreampath form error:',
                            error
                        );


                        // --------------------------------
                        // ERROR MESSAGE
                        // --------------------------------

                        if (status) {

                            status.textContent =
                                'Unable to send your enquiry. Please try again.';

                            status.classList.add(
                                'error'
                            );

                        }


                        // --------------------------------
                        // RESTORE BUTTON
                        // --------------------------------

                        if (submitButton) {

                            submitButton.disabled =
                                false;


                            submitButton.innerHTML =
                                form.dataset.form ===
                                'feedback'
                                    ? 'Share feedback <span>→</span>'
                                    : 'Send enquiry <span>→</span>';

                        }

                    }

                }
            );

        }
    );


// ======================================================
// TRAVELLER STORIES
// ======================================================

async function loadTravellerStories() {

    const container =
        document.getElementById(
            'traveller-stories'
        );


    if (!container) {

        return;

    }


    // ----------------------------------------------
    // LOADING
    // ----------------------------------------------

    container.innerHTML = `

        <div class="feedback-loading">

            <div class="loading-spinner"></div>

            <p>
                Loading traveller stories...
            </p>

        </div>

    `;


    try {

        const response =
            await fetch(
                FEEDBACK_API_URL +
                '&t=' +
                Date.now(),
                {

                    method:
                        'GET',

                    cache:
                        'no-store'

                }
            );


        if (!response.ok) {

            throw new Error(
                'Unable to connect to feedback service.'
            );

        }


        const data =
            await response.json();


        console.log(
            'Traveller feedback:',
            data
        );


        if (
            !data ||
            data.ok !== true
        ) {

            throw new Error(
                data?.error ||
                'Feedback API returned an error.'
            );

        }


        let feedback =
            Array.isArray(
                data.feedback
            )
                ? data.feedback
                : [];


        // ----------------------------------------------
        // SORT BY RATING
        // ----------------------------------------------

        feedback.sort(
            (a, b) => {

                const ratingA =
                    Number(
                        a['Rating'] || 0
                    );


                const ratingB =
                    Number(
                        b['Rating'] || 0
                    );


                if (
                    ratingB !==
                    ratingA
                ) {

                    return (
                        ratingB -
                        ratingA
                    );

                }


                const dateA =
                    new Date(
                        a['Submitted at'] || 0
                    ).getTime();


                const dateB =
                    new Date(
                        b['Submitted at'] || 0
                    ).getTime();


                return (
                    dateB -
                    dateA
                );

            }
        );


        // ----------------------------------------------
        // NO FEEDBACK
        // ----------------------------------------------

        if (
            feedback.length === 0
        ) {

            container.innerHTML = `

                <div class="no-feedback">

                    <p class="eyebrow">
                        TRAVELLER STORIES
                    </p>

                    <h3>
                        Traveller stories will
                        appear here soon.
                    </h3>

                    <p>
                        Be one of the first to
                        share your Dreampath
                        experience.
                    </p>

                </div>

            `;

            return;

        }


        renderTravellerStories(
            container,
            feedback
        );


    } catch (error) {

        console.error(
            'Traveller stories error:',
            error
        );


        container.innerHTML = `

            <div class="feedback-error">

                <p class="eyebrow">
                    TRAVELLER STORIES
                </p>

                <h3>
                    We couldn't load traveller
                    stories right now.
                </h3>

                <p>
                    Please try again in a moment.
                </p>

                <button
                    class="btn btn-dark"
                    type="button"
                    id="retry-feedback">

                    Try again
                    <span>↻</span>

                </button>

            </div>

        `;


        const retry =
            document.getElementById(
                'retry-feedback'
            );


        if (retry) {

            retry.addEventListener(
                'click',
                loadTravellerStories
            );

        }

    }

}


// ======================================================
// GET NUMBER OF FEEDBACK CARDS
// ======================================================

function getFeedbackCardsPerGroup() {

    const width =
        window.innerWidth;


    if (width <= 600) {

        return 1;

    }


    if (width <= 900) {

        return 2;

    }


    return 3;

}


// ======================================================
// CHUNK FEEDBACK
// ======================================================

function chunkFeedback(
    feedback,
    size
) {

    const groups = [];


    for (
        let i = 0;
        i < feedback.length;
        i += size
    ) {

        groups.push(
            feedback.slice(
                i,
                i + size
            )
        );

    }


    return groups;

}


// ======================================================
// RENDER TRAVELLER STORIES
// ======================================================

function renderTravellerStories(
    container,
    feedback
) {

    const cardsPerGroup =
        getFeedbackCardsPerGroup();


    const groups =
        chunkFeedback(
            feedback,
            cardsPerGroup
        );


    const slidesHTML =
        groups
            .map(
                (group, index) => {

                    const cards =
                        group
                            .map(
                                createFeedbackCard
                            )
                            .join('');


                    return `

                        <div
                            class="feedback-slide"
                            data-slide="${index}">

                            <div class="feedback-slide-grid">

                                ${cards}

                            </div>

                        </div>

                    `;

                }
            )
            .join('');


    const dotsHTML =
        groups
            .map(
                (_, index) => `

                    <button
                        class="feedback-dot ${index === 0 ? 'active' : ''}"
                        type="button"
                        aria-label="Go to feedback group ${index + 1}"
                        aria-current="${index === 0 ? 'true' : 'false'}"
                        data-feedback-dot="${index}">
                    </button>

                `
            )
            .join('');


    container.innerHTML = `

        <div class="feedback-slider-wrapper">

            <div
                class="feedback-slider"
                data-feedback-slider>

                <div
                    class="feedback-slider-track"
                    data-feedback-track>

                    ${slidesHTML}

                </div>

            </div>


            ${
                groups.length > 1
                    ? `

                        <div class="feedback-slider-controls">

                            <button
                                class="feedback-slider-prev"
                                type="button"
                                aria-label="Previous feedback group">

                                <span aria-hidden="true">
                                    ←
                                </span>

                                Previous

                            </button>


                            <div
                                class="feedback-pagination"
                                role="tablist"
                                aria-label="Feedback groups">

                                ${dotsHTML}

                            </div>


                            <button
                                class="feedback-slider-next"
                                type="button"
                                aria-label="Next feedback group">

                                Next

                                <span aria-hidden="true">
                                    →
                                </span>

                            </button>

                        </div>

                    `
                    : ''
            }

        </div>

    `;


    if (
        groups.length > 1
    ) {

        initializeFeedbackSlider(
            container,
            groups.length
        );

    }

}


// ======================================================
// FEEDBACK SLIDER
// ======================================================

function initializeFeedbackSlider(
    container,
    totalSlides
) {

    const slider =
        container.querySelector(
            '[data-feedback-slider]'
        );


    const track =
        container.querySelector(
            '[data-feedback-track]'
        );


    const previousButton =
        container.querySelector(
            '.feedback-slider-prev'
        );


    const nextButton =
        container.querySelector(
            '.feedback-slider-next'
        );


    const dots =
        Array.from(
            container.querySelectorAll(
                '.feedback-dot'
            )
        );


    if (
        !slider ||
        !track ||
        !previousButton ||
        !nextButton
    ) {

        return;

    }


    let currentSlide =
        0;


    function updateSlider() {

        currentSlide =
            Math.max(
                0,
                Math.min(
                    currentSlide,
                    totalSlides - 1
                )
            );


        track.style.transform =
            `translate3d(-${currentSlide * 100}%, 0, 0)`;


        dots.forEach(
            (dot, index) => {

                const active =
                    index === currentSlide;


                dot.classList.toggle(
                    'active',
                    active
                );


                dot.setAttribute(
                    'aria-current',
                    active
                        ? 'true'
                        : 'false'
                );

            }
        );


        previousButton.disabled =
            currentSlide === 0;


        nextButton.disabled =
            currentSlide ===
            totalSlides - 1;

    }


    function goToSlide(
        index
    ) {

        currentSlide =
            Math.max(
                0,
                Math.min(
                    index,
                    totalSlides - 1
                )
            );


        updateSlider();

    }


    previousButton.addEventListener(
        'click',
        () => {

            goToSlide(
                currentSlide - 1
            );

        }
    );


    nextButton.addEventListener(
        'click',
        () => {

            goToSlide(
                currentSlide + 1
            );

        }
    );


    dots.forEach(
        dot => {

            dot.addEventListener(
                'click',
                () => {

                    const index =
                        Number(
                            dot.dataset.feedbackDot
                        );


                    goToSlide(
                        index
                    );

                }
            );

        }
    );


    // ==================================================
    // TOUCH / SWIPE
    // ==================================================

    let touchStartX =
        0;


    let touchEndX =
        0;


    slider.addEventListener(
        'touchstart',
        event => {

            touchStartX =
                event.changedTouches[0]
                    .screenX;

        },
        {
            passive: true
        }
    );


    slider.addEventListener(
        'touchend',
        event => {

            touchEndX =
                event.changedTouches[0]
                    .screenX;


            const distance =
                touchEndX -
                touchStartX;


            if (
                Math.abs(distance) < 50
            ) {

                return;

            }


            if (
                distance < 0
            ) {

                goToSlide(
                    currentSlide + 1
                );

            } else {

                goToSlide(
                    currentSlide - 1
                );

            }

        },
        {
            passive: true
        }
    );


    updateSlider();

}


// ======================================================
// CREATE FEEDBACK CARD
// ======================================================

function createFeedbackCard(
    item
) {

    const name =
        escapeHTML(
            item['Name'] ||
            'Traveller'
        );


    const trip =
        escapeHTML(
            item['Trip'] ||
            'Dreampath Journey'
        );


    const message =
        escapeHTML(
            item['Message'] ||
            'A beautiful Dreampath experience.'
        );


    const rating =
        Math.max(
            0,
            Math.min(
                5,
                Number(
                    item['Rating'] || 0
                )
            )
        );


    const date =
        escapeHTML(
            formatFeedbackDate(
                item['Submitted at'] ||
                ''
            )
        );


    const stars =
        createStars(
            rating
        );


    return `

        <article class="feedback-card">

            <div class="feedback-card-content">

                <div
                    class="feedback-stars"
                    aria-label="${rating} out of 5 stars">

                    ${stars}

                </div>


                <blockquote>

                    “${message}”

                </blockquote>

            </div>


            <div class="feedback-card-footer">

                <div class="feedback-person">

                    <strong>
                        ${name}
                    </strong>

                    <span>
                        ${trip}
                    </span>

                </div>


                ${
                    date
                        ? `

                            <time>
                                ${date}
                            </time>

                        `
                        : ''
                }

            </div>

        </article>

    `;

}


// ======================================================
// FORMAT FEEDBACK DATE
// ======================================================

function formatFeedbackDate(
    value
) {

    if (!value) {

        return '';

    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(
            value
        );

    }


    return date.toLocaleDateString(
        'en-IN',
        {

            day:
                'numeric',

            month:
                'short',

            year:
                'numeric'

        }
    );

}


// ======================================================
// CREATE STAR RATING
// ======================================================

function createStars(
    rating
) {

    let stars =
        '';


    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        stars +=
            i <= rating
                ? '<span class="star filled">★</span>'
                : '<span class="star">★</span>';

    }


    return stars;

}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHTML(
    value
) {

    return String(
        value
    )

        .replace(
            /&/g,
            '&amp;'
        )

        .replace(
            /</g,
            '&lt;'
        )

        .replace(
            />/g,
            '&gt;'
        )

        .replace(
            /"/g,
            '&quot;'
        )

        .replace(
            /'/g,
            '&#039;'
        );

}


// ======================================================
// REBUILD FEEDBACK SLIDER ON RESIZE
// ======================================================

let feedbackResizeTimer =
    null;


let previousFeedbackLayout =
    getFeedbackCardsPerGroup();


window.addEventListener(
    'resize',
    () => {

        clearTimeout(
            feedbackResizeTimer
        );


        feedbackResizeTimer =
            setTimeout(
                () => {

                    const newLayout =
                        getFeedbackCardsPerGroup();


                    if (
                        newLayout !==
                        previousFeedbackLayout
                    ) {

                        previousFeedbackLayout =
                            newLayout;


                        loadTravellerStories();

                    }

                },
                250
            );

    }
);


// ======================================================
// LOAD STORIES WHEN PAGE IS READY
// ======================================================

if (
    document.body.dataset.page ===
    'home'
) {

    loadTravellerStories();

}


if (
    document.body.dataset.page ===
    'feedback'
) {

    loadTravellerStories();

}


// ======================================================
// END OF SCRIPT
// ======================================================
