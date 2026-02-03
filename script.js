// ===== Mobile Navigation =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== Navbar Background on Scroll =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(13, 17, 23, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(13, 17, 23, 0.9)';
        navbar.style.boxShadow = 'none';
    }
});

// ===== Smooth Scroll for Safari =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Language Colors for GitHub =====
const languageColors = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'Python': '#3572A5',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C': '#555555',
    'C#': '#178600',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'SCSS': '#c6538c',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'Swift': '#ffac45',
    'Kotlin': '#A97BFF',
    'Dart': '#00B4AB',
    'Vue': '#41b883',
    'Shell': '#89e051',
    'Jupyter Notebook': '#DA5B0B',
    'default': '#8b949e'
};

// ===== Fetch GitHub Repositories =====
async function fetchGitHubRepos() {
    const username = 'kukjinman';
    const projectsContainer = document.getElementById('projects-container');
    const loadingElement = document.querySelector('.projects-loading');

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }

        const repos = await response.json();
        
        // Hide loading
        loadingElement.style.display = 'none';

        if (repos.length === 0) {
            projectsContainer.innerHTML = `
                <div class="no-projects">
                    <p>아직 공개된 저장소가 없습니다.</p>
                </div>
            `;
            return;
        }

        // Filter out forked repos and github.io repo, then display
        const filteredRepos = repos.filter(repo => !repo.fork);
        
        filteredRepos.forEach(repo => {
            const langColor = languageColors[repo.language] || languageColors['default'];
            
            const projectCard = document.createElement('a');
            projectCard.href = repo.html_url;
            projectCard.target = '_blank';
            projectCard.className = 'project-card';
            
            projectCard.innerHTML = `
                <div class="project-header">
                    <h3>
                        <i class="fas fa-folder-open"></i>
                        ${repo.name}
                    </h3>
                    <p>${repo.description || '설명이 없습니다.'}</p>
                </div>
                <div class="project-footer">
                    <div class="project-lang">
                        ${repo.language ? `
                            <span class="lang-color" style="background-color: ${langColor}"></span>
                            ${repo.language}
                        ` : '<span>-</span>'}
                    </div>
                    <div class="project-stats">
                        <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                        <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                    </div>
                </div>
            `;
            
            projectsContainer.appendChild(projectCard);
        });

    } catch (error) {
        console.error('Error fetching repos:', error);
        loadingElement.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <p>저장소를 불러오는데 실패했습니다.</p>
            <a href="https://github.com/${username}" target="_blank" class="btn btn-outline" style="margin-top: 20px;">
                GitHub에서 보기
            </a>
        `;
    }
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Add animate-in class styles
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    </style>
`);

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubRepos();
    
    // Make hero section visible immediately
    document.querySelector('.hero').style.opacity = '1';
    document.querySelector('.hero').style.transform = 'translateY(0)';
});

// ===== Typing Effect for Title (Optional) =====
const titles = ['Software Developer', 'Web Developer', 'Problem Solver', 'Tech Enthusiast'];
let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const titleElement = document.querySelector('.title');

function typeEffect() {
    const currentTitle = titles[titleIndex];
    
    if (isDeleting) {
        titleElement.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
    } else {
        titleElement.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentTitle.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typeSpeed = 500; // Pause before typing new word
    }
    
    setTimeout(typeEffect, typeSpeed);
}

// Start typing effect after page load
setTimeout(typeEffect, 2000);
