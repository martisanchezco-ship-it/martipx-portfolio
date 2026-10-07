/* ==================================================
   ELEMENTOS
================================================== */

const entranceScreen =
    document.querySelector("#entranceScreen");

const enterButton =
    document.querySelector("#enterButton");

const topMenu =
    document.querySelector("#topMenu");

const homeButton =
    document.querySelector("#homeButton");

const aboutButton =
    document.querySelector("#aboutButton");

const contactButton =
    document.querySelector("#contactButton");

const viewport =
    document.querySelector("#viewport");

const backButton =
    document.querySelector("#backButton");

const swipeHint =
    document.querySelector("#swipeHint");

const edgeHints =
    document.querySelector("#edgeHints");

const edgeHintLeft =
    document.querySelector("#edgeHintLeft");

const edgeHintRight =
    document.querySelector("#edgeHintRight");

const targetHud =
    document.querySelector("#targetHud");

const scrollCue =
    document.querySelector("#scrollCue");

const moveHint =
    document.querySelector("#moveHint");

const entrancePan =
    document.querySelector("#entrancePan");


/* ==================================================
   ESCENAS
================================================== */

const homeScene =
    document.querySelector(".scene-home");

const videosScene =
    document.querySelector(".scene-videos");

const videoclipsScene =
    document.querySelector(".scene-videoclips");

const ytEditScene =
    document.querySelector(".scene-yt-edit");

const publiScene =
    document.querySelector(".scene-publi");

const reelsScene =
    document.querySelector(".scene-reels");

const dopScene =
    document.querySelector(".scene-dop");

const aboutScene =
    document.querySelector(".scene-about");

const iaScene =
    document.querySelector(".scene-ia");

const projectsScene =
    document.querySelector(".scene-projects");

const disenoGraficoScene =
    document.querySelector(".scene-diseno-grafico");

const disenoWebScene =
    document.querySelector(".scene-diseno-web");

const marketingScene =
    document.querySelector(".scene-marketing");

const musicBusinessScene =
    document.querySelector(".scene-music-business");

const contactScene =
    document.querySelector(".scene-contact");

const clientsScene =
    document.querySelector(".scene-clients");


const scenes = [
    homeScene,
    videosScene,
    videoclipsScene,
    ytEditScene,
    publiScene,
    reelsScene,
    dopScene,
    aboutScene,
    iaScene,
    projectsScene,
    disenoGraficoScene,
    disenoWebScene,
    marketingScene,
    musicBusinessScene,
    contactScene,
    clientsScene
];


let currentScene = null;


/* ==================================================
   HISTORIAL DE NAVEGACIÓN
================================================== */

let navigationHistory = [];


/* ==================================================
   MOSTRAR ESCENA
================================================== */

function showScene(scene, options = {}) {

    if (!scene) return;


    const addToHistory =
        options.addToHistory !== false;


    if (
        currentScene === scene &&
        !options.force
    ) {
        return;
    }


    if (
        addToHistory &&
        currentScene &&
        currentScene !== scene
    ) {

        navigationHistory.push(
            currentScene
        );

    }


    scenes.forEach(function(item) {

        if (!item) return;

        item.classList.remove("active");
        item.classList.remove("scene-enter");

    });


    scene.classList.add("active");


    currentScene = scene;

    scene.scrollTop = 0;

    updateViewportMode();
    updateTargetHud();


    requestAnimationFrame(function() {

        centerImage();
        updateScrollCue();

        requestAnimationFrame(function() {
            centerImage();
        });

        window.setTimeout(function() {
            if (isScrollScene(scene)) return;

            centerImage();

            requestAnimationFrame(function() {
                centerImage();
            });
        }, 350);

    });

    window.setTimeout(function() {
        if (!isScrollScene(scene) && currentScene === scene) {
            viewport.scrollLeft =
                Math.max(
                    0,
                    (scene.offsetWidth - viewport.clientWidth) / 2
                );
            viewport.scrollTop =
                Math.max(
                    0,
                    (scene.offsetHeight - viewport.clientHeight) / 2
                );
        }
    }, 700);


    if (options.animate) {

        requestAnimationFrame(function() {

            scene.classList.add(
                "scene-enter"
            );

        });

    }


    updateBackButton();

    showSwipeHint();

}


/* ==================================================
   CENTRAR ESCENA
================================================== */

function centerImage() {

    if (!viewport) return;

    if (isScrollScene(currentScene)) return;


    const sceneWidth =
        currentScene ?
            currentScene.offsetWidth :
            viewport.scrollWidth;

    const sceneHeight =
        currentScene ?
            currentScene.offsetHeight :
            viewport.scrollHeight;

    const maxX =
        Math.max(
            0,
            sceneWidth -
            viewport.clientWidth
        );


    const maxY =
        Math.max(
            0,
            sceneHeight -
            viewport.clientHeight
        );


    const left = maxX / 2;
    const top = maxY / 2;

    viewport.scrollTo(left, top);

}


/* ==================================================
   VOLVER ATRÁS
================================================== */

function goBack() {

    if (
        videoModal &&
        videoModal.classList.contains("active")
    ) {

        closeVideo();

        return;

    }


    if (
        navigationHistory.length > 0
    ) {

        const previousScene =
            navigationHistory.pop();


        showScene(
            previousScene,
            {
                addToHistory: false
            }
        );


        return;

    }


    showScene(
        homeScene,
        {
            addToHistory: false
        }
    );

}


/* ==================================================
   FLECHA ATRÁS
================================================== */

function updateBackButton() {

    if (
        !currentScene ||
        currentScene === homeScene
    ) {

        backButton.classList.remove(
            "visible"
        );

        return;

    }


    backButton.classList.add(
        "visible"
    );

}


/* ==================================================
   SWIPE
================================================== */

function isScrollScene(scene) {

    return !!(
        scene &&
        scene.classList.contains("scene-scroll")
    );

}


function updateViewportMode() {

    if (!viewport) return;


    if (isScrollScene(currentScene)) {

        viewport.classList.add("mode-scroll");
        viewport.classList.remove("mode-pan");

    } else {

        viewport.classList.add("mode-pan");
        viewport.classList.remove("mode-scroll");

    }


    updateScrollCue();

}


function updateScrollCue() {

    if (!scrollCue) return;


    if (!isScrollScene(currentScene)) {

        scrollCue.classList.remove("visible");
        return;

    }


    const hasMore =
        currentScene.scrollHeight >
        currentScene.clientHeight + 48;


    const atTop =
        currentScene.scrollTop < 28;


    if (hasMore && atTop) {

        scrollCue.classList.add("visible");

    } else {

        scrollCue.classList.remove("visible");

    }

}


function showMoveHint() {

    if (!moveHint) return;

    moveHint.classList.add("visible");

}


function hideMoveHint() {

    if (!moveHint) return;

    moveHint.classList.remove("visible");

}


function showSwipeHint() {

    if (!swipeHint) return;


    if (
        isScrollScene(currentScene) ||
        window.innerWidth > 700
    ) {

        swipeHint.classList.add("hidden");
        swipeHint.style.opacity = "0";
        hideEdgeHints();

        if (!isScrollScene(currentScene)) {
            showMoveHint();
        } else {
            hideMoveHint();
        }

        return;

    }


    swipeHint.classList.add("hidden");
    if (edgeHints) edgeHints.classList.remove("visible");
    updateTargetHud();
    showMoveHint();

}


function hideEdgeHints() {

    if (!edgeHints) return;

    edgeHints.classList.remove("visible");

}


function updateTargetHud() {

    if (!targetHud || !viewport || !currentScene) return;

    if (window.innerWidth > 700 || isScrollScene(currentScene)) {
        targetHud.innerHTML = "";
        targetHud.classList.remove("visible");
        return;
    }

    const viewportRect = viewport.getBoundingClientRect();
    const hotspots = currentScene.querySelectorAll(".hotspot");
    const indicators = [];

    hotspots.forEach(function(hotspot) {

        const rect = hotspot.getBoundingClientRect();
        const label = hotspot.querySelector(".label");
        const name = label ? label.textContent.trim() : hotspot.getAttribute("aria-label");

        if (!name) return;

        const isOutsideLeft = rect.right < viewportRect.left + 8;
        const isOutsideRight = rect.left > viewportRect.right - 8;

        if (!isOutsideLeft && !isOutsideRight) return;

        const direction = isOutsideLeft ? "left" : "right";
        const top = Math.min(
            Math.max(rect.top + rect.height / 2, viewportRect.top + 78),
            viewportRect.bottom - 78
        );

        const content = `<span class="target-dot"></span><span class="target-arrow target-arrow-${direction}" aria-hidden="true"></span>`;

        indicators.push(
            `<button class="target-indicator target-indicator-${direction}" style="top:${top}px" data-target-id="${hotspot.id}" aria-label="${name} fuera de pantalla">${content}</button>`
        );

    });

    targetHud.innerHTML = indicators.join("");
    targetHud.classList.toggle("visible", indicators.length > 0);

}


function scheduleTargetHudUpdate() {

    if (scheduleTargetHudUpdate.pending) return;

    scheduleTargetHudUpdate.pending = true;

    requestAnimationFrame(function() {
        scheduleTargetHudUpdate.pending = false;
        updateTargetHud();
    });

}


/* ==================================================
   ENTRAR
================================================== */

function enterSite() {

    navigationHistory = [];


    entranceScreen.classList.add(
        "hidden"
    );


    topMenu.classList.add(
        "visible"
    );


    showScene(
        homeScene,
        {
            addToHistory: false,
            animate: true,
            force: true
        }
    );


    setTimeout(function() {

        entranceScreen.style.display =
            "none";

    }, 850);

}


enterButton.addEventListener(
    "click",
    function(event) {

        if (panMoved) {

            event.preventDefault();
            return;

        }

        enterSite();

    }
);


/* ==================================================
   HOME
================================================== */

homeButton.addEventListener(
    "click",
    function() {

        navigationHistory = [];


        showScene(
            homeScene,
            {
                addToHistory: false
            }
        );

    }
);


/* ==================================================
   MENÚ
================================================== */

aboutButton.addEventListener(
    "click",
    function() {

        showScene(
            aboutScene
        );

    }
);


contactButton.addEventListener(
    "click",
    function() {

        showScene(
            contactScene
        );

    }
);


/* ==================================================
   HOME HOTSPOTS
================================================== */

document
    .querySelector("#homeVideos")
    .addEventListener(
        "click",
        function() {

            showScene(
                videosScene
            );

        }
    );


document
    .querySelector("#homeAbout")
    .addEventListener(
        "click",
        function() {

            showScene(
                aboutScene
            );

        }
    );


document
    .querySelector("#homeProjects")
    .addEventListener(
        "click",
        function() {

            showScene(
                projectsScene
            );

        }
    );


document
    .querySelector("#homeClients")
    .addEventListener(
        "click",
        function() {

            showScene(
                clientsScene
            );

        }
    );


/* ==================================================
   VIDEOS HOTSPOTS
================================================== */

document
    .querySelector("#videoclips")
    .addEventListener(
        "click",
        function() {

            showScene(
                videoclipsScene
            );

        }
    );


document
    .querySelector("#ytEdit")
    .addEventListener(
        "click",
        function() {

            showScene(
                ytEditScene
            );

        }
    );


document
    .querySelector("#publi")
    .addEventListener(
        "click",
        function() {

            showScene(
                publiScene
            );

        }
    );


document
    .querySelector("#reels")
    .addEventListener(
        "click",
        function() {

            showScene(
                reelsScene
            );

        }
    );


document
    .querySelector("#dopButton")
    .addEventListener(
        "click",
        function() {

            showScene(
                dopScene
            );

        }
    );


document
    .querySelector("#iaButton")
    .addEventListener(
        "click",
        function() {

            showScene(
                iaScene
            );

        }
    );


document
    .querySelector("#salir")
    .addEventListener(
        "click",
        function() {

            navigationHistory = [];


            showScene(
                homeScene,
                {
                    addToHistory: false
                }
            );

        }
    );


/* ==================================================
   PROJECTS
================================================== */

document
    .querySelector("#disenoGraficoBtn")
    .addEventListener(
        "click",
        function() {

            showScene(
                disenoGraficoScene
            );

        }
    );


document
    .querySelector("#disenoWebBtn")
    .addEventListener(
        "click",
        function() {

            showScene(
                disenoWebScene
            );

        }
    );


document
    .querySelector("#marketingBtn")
    .addEventListener(
        "click",
        function() {

            showScene(
                marketingScene
            );

        }
    );


document
    .querySelector("#musicBusinessBtn")
    .addEventListener(
        "click",
        function() {

            showScene(
                musicBusinessScene
            );

        }
    );


document
    .querySelector("#aboutDisenoGraficoBtn")
    .addEventListener(
        "click",
        function() {
            showScene(disenoGraficoScene);
        }
    );


document
    .querySelector("#aboutDisenoWebBtn")
    .addEventListener(
        "click",
        function() {
            showScene(disenoWebScene);
        }
    );


document
    .querySelector("#aboutMarketingBtn")
    .addEventListener(
        "click",
        function() {
            showScene(marketingScene);
        }
    );


document
    .querySelector("#aboutMusicBusinessBtn")
    .addEventListener(
        "click",
        function() {
            showScene(musicBusinessScene);
        }
    );


/* ==================================================
   FLECHA ATRÁS
================================================== */

backButton.addEventListener(
    "click",
    function() {

        goBack();

    }
);


/* ==================================================
   DRAG + INERCIA
================================================== */

let panMoved = false;


function centerScroller(scroller) {

    if (!scroller) return;


    scroller.scrollLeft =
        Math.max(
            0,
            (scroller.scrollWidth - scroller.clientWidth) / 2
        );


    scroller.scrollTop =
        Math.max(
            0,
            (scroller.scrollHeight - scroller.clientHeight) / 2
        );

}


function attachPan(scroller, options) {

    if (!scroller) return;


    options = options || {};


    let dragging = false;
    let startPX = 0;
    let startPY = 0;
    let startSX = 0;
    let startSY = 0;
    let lastPX = 0;
    let lastPY = 0;
    let lastT = 0;
    let velX = 0;
    let velY = 0;
    let inertiaId = 0;


    function stopInertia() {

        if (inertiaId) {

            cancelAnimationFrame(inertiaId);
            inertiaId = 0;

        }

        velX = 0;
        velY = 0;

    }


    function shouldIgnore(event) {

        if (options.ignoreIf && options.ignoreIf(event)) {
            return true;
        }

        if (
            options.skipSelector &&
            event.target.closest(options.skipSelector)
        ) {
            return true;
        }

        return false;

    }


    scroller.addEventListener(
        "pointerdown",
        function(event) {

            if (event.button) return;

            if (shouldIgnore(event)) return;


            stopInertia();

            dragging = true;
            panMoved = false;

            startPX = lastPX = event.clientX;
            startPY = lastPY = event.clientY;

            startSX = scroller.scrollLeft;
            startSY = scroller.scrollTop;

            lastT = performance.now();

            scroller.classList.add("dragging");

            try {
                scroller.setPointerCapture(event.pointerId);
            } catch (error) {}

        }
    );


    scroller.addEventListener(
        "pointermove",
        function(event) {

            if (!dragging) return;


            const dx = event.clientX - startPX;
            const dy = event.clientY - startPY;


            if (!panMoved && (dx * dx + dy * dy) > 64) {

                panMoved = true;
                hideMoveHint();
                hideEdgeHints();

            }


            scroller.scrollLeft = startSX - dx;
            scroller.scrollTop = startSY - dy;


            const now = performance.now();
            const dt = Math.max(8, now - lastT);

            velX = (event.clientX - lastPX) / dt;
            velY = (event.clientY - lastPY) / dt;

            lastPX = event.clientX;
            lastPY = event.clientY;
            lastT = now;

        }
    );


    function endDrag() {

        if (!dragging) return;

        dragging = false;
        scroller.classList.remove("dragging");


        if (Math.hypot(velX, velY) < 0.035) {
            return;
        }


        function tick() {

            velX *= 0.92;
            velY *= 0.92;

            scroller.scrollLeft -= velX * 16;
            scroller.scrollTop -= velY * 16;

            if (Math.hypot(velX, velY) > 0.012) {

                inertiaId = requestAnimationFrame(tick);

            } else {

                inertiaId = 0;

            }

        }

        inertiaId = requestAnimationFrame(tick);

    }


    scroller.addEventListener("pointerup", endDrag);
    scroller.addEventListener("pointercancel", endDrag);

}


if (edgeHintLeft) {
    edgeHintLeft.addEventListener("click", function() {
        if (!viewport || isScrollScene(currentScene)) return;
        viewport.scrollBy({
            left: -Math.max(160, viewport.clientWidth * .55),
            behavior: "smooth"
        });
        hideEdgeHints();
    });
}


if (edgeHintRight) {
    edgeHintRight.addEventListener("click", function() {
        if (!viewport || isScrollScene(currentScene)) return;
        viewport.scrollBy({
            left: Math.max(160, viewport.clientWidth * .55),
            behavior: "smooth"
        });
        hideEdgeHints();
    });
}


if (viewport) {
    viewport.addEventListener("scroll", scheduleTargetHudUpdate, { passive: true });
}


window.addEventListener("resize", scheduleTargetHudUpdate);


attachPan(
    viewport,
    {
        ignoreIf: function() {
            return viewport.classList.contains("mode-scroll");
        },
        skipSelector:
            ".hotspot, .back-button, .top-menu, .editorial-text, .graphic-text, .video-page, .video-modal, .contact-page"
    }
);


attachPan(
    entranceScreen,
    {
        skipSelector: ".enter-button"
    }
);


/* ==================================================
   VIDEOCLIPS DATA
================================================== */

function getYoutubeId(video) {

    const raw =
        (video && (video.id || video.url)) || "";


    const fromUrl =
        String(raw).match(
            /(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/
        );


    if (fromUrl) {
        return fromUrl[1];
    }


    if (/^[A-Za-z0-9_-]{11}$/.test(raw)) {
        return raw;
    }


    return "";

}


const videoclipData = [

    {
        id: "QS4XYVPanrQ",
        title: "LA ORACIÓN",
        artist: "Akaa020, Jflow, TKamelo",
        date: "2026",
        description: "Videoclip / proyecto audiovisual.",
        instagram: "#"
    },

    {
        id: "1pnYvQWMP70",
        title: "SAHAS",
        artist: "MCbuzz",
        date: "2026",
        description: "Videoclip / proyecto audiovisual.",
        instagram: "#"
    },

    {
        id: "UPXkW2Diqrg",
        title: "SE NOS FUE",
        artist: "Akaa020",
        date: "2026",
        description: "Videoclip / proyecto audiovisual.",
        instagram: "#"
    },

    {
        id: "8EhEStN4ytc",
        title: "NUEVO RICO",
        artist: "Esbabyface",
        date: "2024",
        description: "Videoclip / proyecto audiovisual.",
        instagram: "#"
    },

    {
        id: "RGdAo8KJ5d4",
        title: "MIÉNTEME",
        artist: "Pol Fores",
        date: "2026",
        description: "Videoclip / proyecto audiovisual.",
        instagram: "#"
    },

    {
        id: "3W2V5JLNRSs",
        title: "CHEAT CHAT",
        artist: "RXquaff",
        date: "2025",
        description: "Videoclip / proyecto audiovisual.",
        instagram: "#"
    },

    {
        id: "FwhvvJYCqH4",
        title: "HIJA DE LUCIFER",
        artist: "Yorkel",
        date: "2026",
        description: "Videoclip / proyecto audiovisual.",
        instagram: "#"
    },

    {
        id: "2L_z0qQDSmY",
        title: "DOSIS DE TI",
        artist: "GMD",
        date: "2026",
        description: "Videoclip / proyecto audiovisual.",
        instagram: "#"
    },

    {
        id: "Uvd62TCSTZ8",
        title: "MALA MÍA",
        artist: "—",
        date: "2026",
        description: "Videoclip / proyecto audiovisual.",
        instagram: "#"
    },

    {
        id: "nVCEtfmk4t4",
        title: "GATILLERITO (REMIX)",
        artist: "Akaa, MCbuzz",
        date: "2025",
        description: "Videoclip / proyecto audiovisual.",
        instagram: "#"
    },

    {
        id: "iLoBELJilyk",
        title: "CARTIER",
        artist: "Akaa020",
        date: "2026",
        description: "Videoclip / proyecto audiovisual.",
        instagram: "#"
    },

    {
        id: "WecPUY_SH68",
        title: "BRUJERIA",
        artist: "Durango, Trikynoyse",
        date: "2026",
        description: "Videoclip / proyecto audiovisual.",
        instagram: "#"
    },

    {
        id: "a17ym6E8XUg",
        title: "RAPAPAM",
        artist: "Heredia",
        date: "2026",
        description: "Videoclip / proyecto audiovisual.",
        instagram: "#"
    },

    {
        id: "rV5H7sG7h9E",
        title: "BARCELONA",
        artist: "Coreano loco, NosoyCantante",
        date: "2026",
        description: "Videoclip / proyecto audiovisual.",
        instagram: "#"
    },

    {
        id: "NllfFeXZJyA",
        title: "NUEVO VIDEO 01",
        artist: "Proyecto audiovisual",
        date: "2026",
        description: "Videoclip / proyecto audiovisual.",
        instagram: "#"
    },

    {
        id: "0lf8jywXjQs",
        title: "NUEVO VIDEO 02",
        artist: "Proyecto audiovisual",
        date: "2026",
        description: "Videoclip / proyecto audiovisual.",
        instagram: "#"
    },

    {
        id: "yOdp50mvlgE",
        title: "NUEVO VIDEO 03",
        artist: "Proyecto audiovisual",
        date: "2026",
        description: "Videoclip / proyecto audiovisual.",
        instagram: "#"
    },

    {
        id: "iVKZ62mQeg0",
        title: "NUEVO VIDEO 04",
        artist: "Proyecto audiovisual",
        date: "2026",
        description: "Videoclip / proyecto audiovisual.",
        instagram: "#"
    },

    {
        id: "sdUNp_M4Le8",
        title: "NUEVO VIDEO 05",
        artist: "Proyecto audiovisual",
        date: "2026",
        description: "Videoclip / proyecto audiovisual.",
        instagram: "#"
    },

    {
        id: "GqX-UiH4qEA",
        title: "NUEVO VIDEO 06",
        artist: "Proyecto audiovisual",
        date: "2026",
        description: "Videoclip / proyecto audiovisual.",
        instagram: "#"
    },

    {
        id: "e3PLDxrsjw8",
        title: "NUEVO VIDEO 07",
        artist: "Proyecto audiovisual",
        date: "2026",
        description: "Videoclip / proyecto audiovisual.",
        instagram: "#"
    }

];


const publiData = [

    {
        id: "h-pC4cZwIVY",
        title: "PUBLI 01",
        artist: "Salomon",
        date: "2026",
        description: "Spot / publicidad.",
        instagram: "#"
    },

    {
        id: "Z7r8Ahp9IWk",
        title: "PUBLI 02",
        artist: "EHMC",
        date: "2026",
        description: "Spot / publicidad.",
        instagram: "#"
    },

    {
        id: "x4_9lavfxIE",
        title: "PUBLI 03",
        artist: "NewGen",
        date: "2026",
        description: "Spot / publicidad.",
        instagram: "#"
    },

    {
        id: "8ugNpYFLABw",
        title: "PUBLI 04",
        artist: "Proyecto publicitario",
        date: "2026",
        description: "Spot / publicidad.",
        instagram: "#"
    }

];

const ytEditData = [
    {
        id: "8XTHsmQWcy8",
        title: "YOUTUBE / EDIT 01",
        artist: "Contenido para YouTube",
        date: "2026",
        description: "Grabación y edición de contenido para YouTube.",
        instagram: "#"
    },
    {
        id: "bO_BdLins-8",
        title: "YOUTUBE / EDIT 02",
        artist: "Contenido para YouTube",
        date: "2026",
        description: "Grabación y edición de contenido para YouTube.",
        instagram: "#"
    }
];


/* ==================================================
   GRID (SIN TEXTO EN LAS TARJETAS)
================================================== */

const videoGrid =
    document.querySelector("#videoGrid");

const publiGrid =
    document.querySelector("#publiGrid");

const ytEditGrid =
    document.querySelector("#ytEditGrid");


function renderVideoGrid(grid, data, typeLabel) {

    if (!grid) return;


    grid.innerHTML = "";


    const list =
        (data || []).filter(function(video) {

            return getYoutubeId(video);

        });


    if (!list.length) {

        grid.style.display = "none";
        return;

    }


    grid.style.display = "";


    list.forEach(
        function(video) {

            const youtubeId =
                getYoutubeId(video);


            const card =
                document.createElement("button");


            card.className =
                "video-card";


            card.type =
                "button";


            card.innerHTML = `
                <div class="video-thumbnail">
                    <img
                        src="https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg"
                        alt="${video.title || ""}"
                        draggable="false"
                    >
                    <span class="video-play"></span>
                </div>
            `;


            const image =
                card.querySelector("img");


            image.addEventListener(
                "error",
                function() {

                    image.src =
                        `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

                }
            );


            card.addEventListener(
                "click",
                function() {

                    openVideo(video, typeLabel);

                }
            );


            grid.appendChild(card);

        }
    );

}


renderVideoGrid(videoGrid, videoclipData, "VIDEOCLIP");
renderVideoGrid(publiGrid, publiData, "PUBLI");
renderVideoGrid(ytEditGrid, ytEditData, "YT & EDIT");


/* ==================================================
   IA LAB INTERACTIVO
================================================== */

const iaLab =
    document.querySelector(".ia-lab");

if (iaLab) {

    const iaStatus =
        iaLab.querySelector(".ia-lab-status");

    iaLab.querySelectorAll(".ia-lab-control").forEach(function(control) {

        control.addEventListener("click", function() {

            const mode =
                control.dataset.iaMode || "GENERATE";

            iaLab.dataset.iaMode = mode;

            if (iaStatus) {
                iaStatus.textContent =
                    `MODE: ${mode}`;
            }

            iaLab.querySelectorAll(".ia-lab-control").forEach(function(item) {
                item.classList.toggle(
                    "is-active",
                    item === control
                );
            });

        });

    });

    iaLab.addEventListener("pointermove", function(event) {

        const rect =
            iaLab.getBoundingClientRect();

        const x =
            ((event.clientX - rect.left) / rect.width) * 100;

        const y =
            ((event.clientY - rect.top) / rect.height) * 100;

        iaLab.style.setProperty("--ia-pointer-x", `${x}%`);
        iaLab.style.setProperty("--ia-pointer-y", `${y}%`);

    });

}


scenes.forEach(function(scene) {

    if (!isScrollScene(scene)) return;

    scene.addEventListener(
        "scroll",
        updateScrollCue,
        { passive: true }
    );

});


/* ==================================================
   MODAL VIDEO (DETALLE COMPLETO AL PULSAR)
================================================== */

const videoModal =
    document.querySelector("#videoModal");

const videoModalClose =
    document.querySelector("#videoModalClose");

const videoFrame =
    document.querySelector("#videoFrame");

const videoInfoType =
    document.querySelector("#videoInfoType");

const videoInfoTitle =
    document.querySelector("#videoInfoTitle");

const videoInfoArtist =
    document.querySelector("#videoInfoArtist");

const videoInfoDate =
    document.querySelector("#videoInfoDate");

const videoInfoDescription =
    document.querySelector("#videoInfoDescription");

const videoInfoSocial =
    document.querySelector("#videoInfoSocial");



function openVideo(video, typeLabel) {

    if (!videoModal) return;


    const youtubeId =
        getYoutubeId(video);


    if (!youtubeId) return;


    videoFrame.src =
        `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;


    videoInfoType.textContent =
        typeLabel || video.type || "VIDEOCLIP";


    videoInfoTitle.textContent =
        video.title;


    videoInfoArtist.textContent =
        video.artist;


    videoInfoDate.textContent =
        video.date;


    videoInfoDescription.textContent =
        video.description;


    if (
        video.instagram &&
        video.instagram !== "#"
    ) {

        videoInfoSocial.href =
            video.instagram;

        videoInfoSocial.style.display =
            "block";

    } else {

        videoInfoSocial.style.display =
            "none";

    }


    videoModal.classList.add(
        "active"
    );

    if (scrollCue) {
        scrollCue.classList.remove("visible");
    }

}



function closeVideo() {

    if (!videoModal) return;


    videoModal.classList.remove(
        "active"
    );


    videoFrame.src = "";

}



/* ==================================================
   CERRAR VIDEO
================================================== */

videoModalClose.addEventListener(
    "click",
    function() {

        closeVideo();

    }
);


videoModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === videoModal
        ) {

            closeVideo();

        }

    }
);


/* ==================================================
   ESCAPE
================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            if (
                videoModal.classList.contains(
                    "active"
                )
            ) {

                closeVideo();

                return;

            }


            goBack();

        }

    }
);


/* ==================================================
   RESIZE
================================================== */

window.addEventListener(
    "resize",
    function() {

        if (currentScene) {

            centerImage();

        }


        if (
            entranceScreen &&
            entranceScreen.style.display !== "none" &&
            !entranceScreen.classList.contains("hidden")
        ) {

            centerScroller(entranceScreen);

        }

    }
);


/* ==================================================
   INICIO
================================================== */

window.addEventListener(
    "load",
    function() {

        entranceScreen.style.display =
            "block";


        entranceScreen.classList.remove(
            "hidden"
        );


        topMenu.classList.remove(
            "visible"
        );


        backButton.classList.remove(
            "visible"
        );


        scenes.forEach(
            function(scene) {

                if (!scene) return;

                scene.classList.remove(
                    "active"
                );

                scene.classList.remove(
                    "scene-enter"
                );

            }
        );


        navigationHistory = [];


        currentScene = null;


        if (scrollCue) {

            scrollCue.classList.remove("visible");

        }

        hideEdgeHints();


        if (viewport) {

            viewport.classList.remove("mode-scroll");
            viewport.classList.add("mode-pan");

        }


        requestAnimationFrame(function() {

            centerScroller(entranceScreen);
            showMoveHint();

        });

    }
);