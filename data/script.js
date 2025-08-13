document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o particles.js
    particlesJS.load('particles-js', './data/particlesjs-config.json', function () {
        console.log('particles.js loaded - callback');
    });

    // Função para o efeito de máquina de escrever
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

    // Função para alternar o tema (modo claro/escuro)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        body.classList.add('light');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('light')) {
                body.classList.remove('light');
                themeIcon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'dark');
            } else {
                body.classList.add('light');
                themeIcon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Função para renderizar o portfólio com base no JSON
    fetch('./data/data.json')
        .then(response => response.json())
        .then(data => {
            // Renderizar o cabeçalho
            document.title = 'Portfólio - ' + data.bio.name;
            const portfolioTitle = document.getElementById('portfolio-title');
            if (portfolioTitle) {
                portfolioTitle.textContent = data.bio.name;
            }
            const copyright = document.getElementById('copyright');
            if (copyright) {
                copyright.textContent = `© ${new Date().getFullYear()} ${data.bio.name}. Todos os direitos reservados.`;
            }

            // Renderizar a seção de bio
            const bioSection = document.getElementById('bio-section');
            if (bioSection && data.bio.profilePictureUrl) {
                bioSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.75) 100%), url("${data.bio.profilePictureUrl}")`;
            }
            const devNameElement = document.getElementById('dev-name');
            if (devNameElement && data.bio.name) {
                devNameElement.textContent = data.bio.name;
            }
            const bioDescriptionElement = document.getElementById('bio-description');
            if (bioDescriptionElement && data.bio.description) {
                bioDescriptionElement.textContent = data.bio.description;
            }

            // Chamar o efeito de máquina de escrever para a tagline
            const taglineElement = document.getElementById('tagline-text');
            if (taglineElement && data.bio.tagline && data.bio.tagline.length > 0) {
                typewriterEffect(taglineElement, data.bio.tagline);
            }

            // Renderizar os links sociais
            const socialLinksContainer = document.getElementById('social-links');
            if (socialLinksContainer && data.bio.contact && data.bio.contact.links) {
                data.bio.contact.links.forEach(link => {
                    const socialLinkHtml = `
                        <a href="${link.url}" target="_blank" rel="noopener noreferrer" title="${link.title}" class="text-white hover:text-[#3d99f5] ">
                            <i class="${link.iconClass} text-2xl transition-colors duration-300"></i>
                        </a>
                    `;
                    socialLinksContainer.insertAdjacentHTML('beforeend', socialLinkHtml);
                });
            }

            // Renderizar a nova seção "Sobre Mim"
            const aboutMeText = document.getElementById('about-me-text');
            const aboutMePicture = document.getElementById('about-me-picture');
            if (aboutMeText && data.bio.aboutMe) {
                aboutMeText.textContent = data.bio.aboutMe;
            }
            if (aboutMePicture && data.bio.profilePictureAboutMe) {
                aboutMePicture.src = data.bio.profilePictureAboutMe;
            }

            // Função para renderizar projetos (web e design)
            function renderProjects(containerId, projects, projectType) {
                const container = document.getElementById(containerId);
                if (container) {
                    container.innerHTML = '';
                    projects.forEach((project, index) => {
                        const projectHtml = `
                            <div class="flex flex-col gap-3 p-5 cursor-pointer rounded-lg hover-bg-color transition-colors duration-300" data-project-type="${projectType}" data-project-id="${index}">
                                <div
                                    class="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
                                    style='background-image: url("${project.imageUrl}");'
                                ></div>
                                <div>
                                    <p class="text-base font-medium leading-normal">${project.title}</p>
                                    <p class="text-[#9cabba] text-sm font-normal leading-normal">${project.description}</p>
                                </div>
                            </div>
                        `;
                        container.insertAdjacentHTML('beforeend', projectHtml);
                    });
                }
            }

            // Renderiza os projetos web e de design
            renderProjects('web-projects-container', data.webProjects, 'web');
            renderProjects('design-projects-container', data.designProjects, 'design');

            // Renderizar as habilidades em categorias (agora em formato de lista)
            const skillsContainer = document.getElementById('skills-container');
            if (skillsContainer && data.skills) {
                skillsContainer.innerHTML = ''; // Limpa o container antes de renderizar
                let skillsHtml = '<ul>';

                for (const category in data.skills) {
                    const categoryTitle = category.replace(/_/g, ' ').toUpperCase();
                    const skillsList = data.skills[category];

                    skillsHtml += `<li class="mt-4"><h4 class="text-lg font-bold mb-2">${categoryTitle}: `;

                    if (Array.isArray(skillsList)) {
                        skillsList.forEach(skill => {
                            skillsHtml += `<span class="skill inline-block tag-bg text-sm font-medium rounded-full px-3 py-1">${skill}</span>`;
                        });
                    } else if (typeof skillsList === 'object') {
                        for (const skillName in skillsList) {
                            const proficiency = skillsList[skillName];
                            skillsHtml += `<span class="skill inline-block tag-bg text-sm font-medium rounded-full px-3 py-1">${skillName} - ${proficiency}</span>`;
                        }
                    }

                    skillsHtml += '</h4></li>';
                }
                skillsHtml += '</ul>';
                skillsContainer.insertAdjacentHTML('beforeend', skillsHtml);
            }

            // Adicionar funcionalidade de colapso
            document.querySelectorAll('.collapse-header').forEach(header => {
                header.addEventListener('click', () => {
                    const content = header.nextElementSibling;
                    const icon = header.querySelector('i');

                    content.classList.toggle('active');
                    icon.classList.toggle('rotate-180');
                });
            });

            // Adicionar eventos para abrir o modal
            const projectContainers = document.querySelectorAll('[data-project-id]');
            const modal = document.getElementById('project-modal');
            const modalContent = document.getElementById('modal-content');
            const closeModalBtn = document.getElementById('close-modal-btn');

            projectContainers.forEach(container => {
                container.addEventListener('click', () => {
                    const projectType = container.getAttribute('data-project-type');
                    const projectId = container.getAttribute('data-project-id');
                    const projectData = (projectType === 'web') ? data.webProjects[projectId] : data.designProjects[projectId];

                    const galleryHtml = projectData.details.gallery && projectData.details.gallery.length > 0
                        ? `<div class="mb-4">
                              <p class="font-bold mb-2">Galeria:</p>
                              <div class="swiper mySwiper">
                                <div class="swiper-wrapper">
                                  ${projectData.details.gallery.map(img => `
                                    <div class="swiper-slide flex items-center justify-center">
                                      <img src="${img}" alt="${projectData.title}" class="rounded-lg w-full h-auto max-h-96 object-contain">
                                    </div>`).join('')}
                                </div>
                                <div class="swiper-pagination"></div>
                                <div class="swiper-button-next"></div>
                                <div class="swiper-button-prev"></div>
                              </div>
                          </div>`
                        : '';

                    const linkHtml = projectData.details.link
                        ? `<a href="${projectData.details.link}" target="_blank" class="inline-block px-6 py-3 bg-[#3d99f5] rounded-lg text-white font-bold mt-4">Ver Projeto</a>`
                        : '';

                    const technologiesHtml = projectData.details.technologies && projectData.details.technologies.length > 0
                        ? `<p class="mb-2"><strong>Tecnologias:</strong>
                            ${projectData.details.technologies.map(tech => {
                                return `<span class="inline-block tag-bg text-sm font-medium rounded-full px-3 py-1 mr-2 my-1">${tech}</span>`
                            }).join('')}
                        </p>`
                        : '';

                    modalContent.innerHTML = `
                        <h3 class="text-3xl font-bold mb-4">${projectData.title}</h3>
                        <p class="text-lg mb-4">${projectData.details.fullDescription}</p>
                        ${technologiesHtml}
                        ${galleryHtml}
                        ${linkHtml}
                    `;

                    modal.classList.remove('hidden');

                    // Inicializa o Swiper após o modal ser exibido
                    if (projectData.details.gallery && projectData.details.gallery.length > 0) {
                        new Swiper(".mySwiper", {
                            navigation: {
                                nextEl: ".swiper-button-next",
                                prevEl: ".swiper-button-prev",
                            },
                            pagination: {
                                el: ".swiper-pagination",
                                clickable: true,
                            },
                        });
                    }
                });
            });

            // Adicionar evento para fechar o modal
            if (closeModalBtn) {
                closeModalBtn.addEventListener('click', () => {
                    modal.classList.add('hidden');
                });
            }

            // Fechar o modal clicando fora dele
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.classList.add('hidden');
                    }
                });
            }
        })
        .catch(error => console.error('Error loading data:', error));
});