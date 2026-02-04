var file_to_read = "";

document.addEventListener('DOMContentLoaded', () => {
    particlesJS.load('particles-js', './data/particlesjs-config.json', function () {
        console.log('particles.js loaded - callback');
    });

    if(document.documentElement.lang == "en")
        file_to_read = './data/data-en.json';
    else
        file_to_read = './data/data.json';

    function addClassesOnView(el, classes, options = {}) {
        if (!el || !classes?.length) return;
        if (el.__onViewObserved) return;
        el.__onViewObserved = true;

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(...classes);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2, ...options });

        observer.observe(el);
    }

    function typewriterEffect(element, texts, typingDelay = 100, erasingDelay = 50, newTextDelay = 2000) {
        let textIndex = 0;
        let charIndex = 0;
        let isErasing = false;

        function type() {
            const currentText = texts[textIndex];
            const speed = isErasing ? erasingDelay : typingDelay;

            if (!isErasing && charIndex < currentText.length) {
                element.textContent += currentText.charAt(charIndex);
                charIndex++;
            } else if (isErasing && charIndex > 0) {
                element.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else if (!isErasing && charIndex === currentText.length) {
                isErasing = true;
                element.innerHTML = `${currentText.substring(0, charIndex)}&nbsp;`;
                setTimeout(type, newTextDelay);
                return;
            } else if (isErasing && charIndex === 0) {
                isErasing = false;
                textIndex = (textIndex + 1) % texts.length;
                element.innerHTML = "&nbsp;";
            }
            setTimeout(type, speed);
        }

        element.innerHTML = "&nbsp;";
        type();
    }

    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            themeIcon.classList.add('animate__animated', 'animate__rotateIn');
            if (body.classList.contains('light')) {
                body.classList.remove('light');
                themeIcon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'dark');
            } else {
                body.classList.add('light');
                themeIcon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'light');
            }
            setTimeout(() => themeIcon.classList.remove('animate__animated', 'animate__rotateIn'), 500);
        });
    }

    fetch(file_to_read)
        .then(response => response.json())
        .then(data => {
            document.title = 'Portfólio - ' + data.bio.name;
            const portfolioTitle = document.getElementById('portfolio-title');
            if (portfolioTitle) {
                portfolioTitle.textContent = data.bio.name;
                addClassesOnView(portfolioTitle, ['animate__animated', 'animate__fadeInLeft']);
            }

            document.getElementById('copyright').textContent = `© ${new Date().getFullYear()} ${data.bio.name}. Todos os direitos reservados.`;

            const bioSection = document.getElementById('bio-section');
            if (bioSection && data.bio.profilePictureUrl) {
                bioSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.75) 100%), url("${data.bio.profilePictureUrl}")`;
                addClassesOnView(bioSection, ['animate__animated', 'animate__fadeIn']);
            }

            const devNameElement = document.getElementById('dev-name');
            if (devNameElement) {
                devNameElement.textContent = data.bio.name;
                addClassesOnView(devNameElement, ['animate__animated', 'animate__backInDown']);
            }

            const bioDesc = document.getElementById('bio-description');
            if (bioDesc) {
                bioDesc.textContent = data.bio.description;
                addClassesOnView(bioDesc, ['animate__animated', 'animate__fadeInUp']);
            }

            const taglineElement = document.getElementById('tagline-text');
            if (taglineElement && data.bio.tagline?.length > 0) {
                typewriterEffect(taglineElement, data.bio.tagline);
            }

            const socialLinksContainer = document.getElementById('social-links');
            if (socialLinksContainer && data.bio.contact?.links) {
                data.bio.contact.links.forEach((link, index) => {
                    const socialLinkHtml = `
                        <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="text-white hover:text-[#3d99f5] opacity-0" id="social-${index}">
                            <i class="${link.iconClass} text-2xl transition-transform duration-300 hover:scale-125 inline-block"></i>
                        </a>
                    `;
                    socialLinksContainer.insertAdjacentHTML('beforeend', socialLinkHtml);
                    const el = document.getElementById(`social-${index}`);
                    addClassesOnView(el, ['animate__animated', 'animate__bounceIn', 'opacity-100'], { delay: index * 100 });
                });
            }

            const aboutText = document.getElementById('about-me-text');
            const aboutPic = document.getElementById('about-me-picture');
            if (aboutText) {
                aboutText.textContent = data.bio.aboutMe;
                addClassesOnView(aboutText, ['animate__animated', 'animate__fadeInLeft']);
            }
            if (aboutPic) {
                aboutPic.src = data.bio.profilePictureAboutMe;
                addClassesOnView(aboutPic, ['animate__animated', 'animate__fadeInRight']);
            }

            function renderProjects(containerId, projects, projectType) {
                const container = document.getElementById(containerId);
                if (!container) return;
                container.innerHTML = '';
                projects.forEach((project, index) => {
                    const id = `proj-${projectType}-${index}`;
                    const projectHtml = `
                        <div id="${id}" class="flex flex-col gap-3 p-5 cursor-pointer rounded-lg hover-bg-color transition-all duration-300 transform hover:-translate-y-2 opacity-0" data-project-type="${projectType}" data-project-id="${index}">
                            <div class="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg shadow-md" style='background-image: url("${project.imageUrl}");'></div>
                            <div>
                                <p class="text-base font-medium leading-normal">${project.title}</p>
                                <p class="text-[#9cabba] text-sm font-normal leading-normal">${project.description}</p>
                            </div>
                        </div>
                    `;
                    container.insertAdjacentHTML('beforeend', projectHtml);
                    addClassesOnView(document.getElementById(id), ['animate__animated', 'animate__fadeInUp', 'opacity-100']);
                });
            }

            renderProjects('web-projects-container', data.webProjects, 'web');
            renderProjects('design-projects-container', data.designProjects, 'design');

            const skillsContainer = document.getElementById('skills-container');
            if (skillsContainer && data.skills) {
                skillsContainer.innerHTML = '';
                let skillsHtml = '<ul class="opacity-0" id="skills-list">';
                for (const category in data.skills) {
                    const skillsList = data.skills[category];
                    skillsHtml += `<li class="mt-4"><h4 class="text-lg font-bold mb-2">${category.replace(/_/g, ' ').toUpperCase()}: `;
                    const list = Array.isArray(skillsList) ? skillsList : Object.entries(skillsList).map(([k, v]) => `${k} - ${v}`);
                    list.forEach(skill => {
                        skillsHtml += `<span class="skill inline-block tag-bg text-sm font-medium rounded-full px-3 py-1 mr-2 transition-transform hover:scale-110 cursor-default">${skill}</span>`;
                    });
                    skillsHtml += '</h4></li>';
                }
                skillsHtml += '</ul>';
                skillsContainer.insertAdjacentHTML('beforeend', skillsHtml);
                addClassesOnView(document.getElementById('skills-list'), ['animate__animated', 'animate__fadeIn', 'opacity-100']);
            }

            document.querySelectorAll('.collapse-header').forEach(header => {
                header.addEventListener('click', () => {
                    header.nextElementSibling.classList.toggle('active');
                    header.querySelector('i').classList.toggle('rotate-180');
                });
            });

            const modal = document.getElementById('project-modal');
            const modalContent = document.getElementById('modal-content');

            document.addEventListener('click', (e) => {
                const container = e.target.closest('[data-project-id]');
                if (container) {
                    const type = container.getAttribute('data-project-type');
                    const id = container.getAttribute('data-project-id');
                    const project = (type === 'web') ? data.webProjects[id] : data.designProjects[id];

                    const galleryHtml = project.details.gallery?.length > 0
                        ? `<div class="mb-4"><div class="swiper mySwiper"><div class="swiper-wrapper">${project.details.gallery.map(img => `<div class="swiper-slide flex items-center justify-center"><img src="${img}" class="rounded-lg w-full h-auto max-h-96 object-contain"></div>`).join('')}</div><div class="swiper-pagination"></div><div class="swiper-button-next"></div><div class="swiper-button-prev"></div></div></div>`
                        : '';

                    modalContent.innerHTML = `<h3 class="text-3xl font-bold mb-4">${project.title}</h3><p class="text-lg mb-4">${project.details.fullDescription}</p><p class="mb-2"><strong>Tecnologias:</strong> ${project.details.technologies.map(t => `<span class="inline-block tag-bg text-sm font-medium rounded-full px-3 py-1 mr-2 my-1">${t}</span>`).join('')}</p>${galleryHtml}${project.details.link ? `<a href="${project.details.link}" target="_blank" class="inline-block px-6 py-3 bg-[#3d99f5] rounded-lg text-white font-bold mt-4 transition-transform hover:scale-105">Ver Projeto</a>` : ''}`;
                    modal.classList.remove('hidden');
                    modalContent.classList.add('animate__animated', 'animate__zoomIn', 'animate__faster');

                    if (project.details.gallery?.length > 0) {
                        new Swiper(".mySwiper", { navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }, pagination: { el: ".swiper-pagination", clickable: true } });
                    }
                }
            });

            const hideModal = () => {
                modalContent.classList.replace('animate__zoomIn', 'animate__zoomOut');
                setTimeout(() => { modal.classList.add('hidden'); modalContent.classList.remove('animate__animated', 'animate__zoomOut', 'animate__faster'); }, 200);
            };

            document.getElementById('close-modal-btn')?.addEventListener('click', hideModal);
            modal?.addEventListener('click', (e) => { if (e.target === modal) hideModal(); });

            document.querySelectorAll('[animate-on-view]').forEach(el => {
                const attr = el.getAttribute('animate-on-view');
                addClassesOnView(el, attr ? attr.split(' ') : ['animate__animated', 'animate__fadeInUp']);
            });
        })
        .catch(err => console.error('Error:', err));
});