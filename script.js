/* ==========================================================================
   ROMANTIC DARK THEME - DYNAMIC LOGIC & ANIMATIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- CANVAS FALLING PETALS ANIMATION ---
    const canvas = document.getElementById('petals-canvas');
    const ctx = canvas.getContext('2d');

    let petals = [];
    let maxPetals = window.innerWidth < 768 ? 10 : 20;
    let targetMaxPetals = maxPetals;

    // Petal Colors
    const colors = {
        rose: '#FF5E9C',
        sakura: '#FFD1E6',
        pink: '#FF7EB6'
    };

    class Petal {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * canvas.width;
            this.y = initial ? (Math.random() * canvas.height) : -20;
            this.size = Math.random() * 12 + 8; // Size between 8px and 20px
            this.speedY = Math.random() * 0.3 + 0.2;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = Math.random() * 0.01 - 0.005;
            this.opacity = Math.random() * 0.2 + 0.2; // Opacity 0.2 to 0.4
            this.oscillation = Math.random() * Math.PI;
            this.oscillationSpeed = Math.random() * 0.02 + 0.01;
            
            // 60% chance rose petal (darker), 40% sakura (lighter)
            const rand = Math.random();
            if (rand < 0.5) {
                this.color = colors.rose;
                this.type = 'rose';
            } else if (rand < 0.8) {
                this.color = colors.pink;
                this.type = 'pink';
            } else {
                this.color = colors.sakura;
                this.type = 'sakura';
            }
        }

        update() {
            this.y += this.speedY;
            this.oscillation += this.oscillationSpeed;
            this.x += this.speedX + Math.sin(this.oscillation) * 0.5;
            this.rotation += this.rotationSpeed;

            // Reset when petal reaches bottom or off sides
            if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
                this.reset(false);
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;

            if (this.type === 'rose') {
                // Classic oval rose petal
                ctx.ellipse(0, 0, this.size, this.size * 0.7, 0, 0, Math.PI * 2);
            } else {
                // Sakura petal shape with top indent
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, 0, 0, this.size);
                ctx.bezierCurveTo(this.size, 0, this.size / 2, -this.size / 2, 0, 0);
            }
            
            ctx.fill();
            ctx.restore();
        }
    }

    function initPetals() {
        petals = [];
        for (let i = 0; i < targetMaxPetals; i++) {
            petals.push(new Petal());
        }
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        maxPetals = window.innerWidth < 768 ? 10 : 20;
        if (targetMaxPetals !== maxPetals * 2) { // Unless we are in love letter section
            targetMaxPetals = maxPetals;
        }
        initPetals();
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function animatePetals() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Adjust petal count dynamically if needed
        if (petals.length < targetMaxPetals) {
            petals.push(new Petal());
        } else if (petals.length > targetMaxPetals) {
            petals.pop();
        }

        petals.forEach(petal => {
            petal.update();
            petal.draw();
        });
        requestAnimationFrame(animatePetals);
    }
    animatePetals();


    // --- MUSIC CONTROLS ---
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const playIcon = document.getElementById('music-icon-play');
    const muteIcon = document.getElementById('music-icon-mute');
    const ctaOpenHeart = document.getElementById('cta-open-heart');

    function playAudio() {
        bgMusic.play().then(() => {
            playIcon.classList.add('hidden');
            muteIcon.classList.remove('hidden');
        }).catch(err => {
            console.log("Audio play blocked: ", err);
        });
    }

    function pauseAudio() {
        bgMusic.pause();
        playIcon.classList.remove('hidden');
        muteIcon.classList.add('hidden');
    }

    ctaOpenHeart.addEventListener('click', () => {
        // Start playing music
        playAudio();
        // Show the floating music control
        musicToggle.classList.remove('hidden');
        // Scroll to Section 02 (Birthday Wishes)
        document.getElementById('birthday').scrollIntoView({ behavior: 'smooth' });
    });

    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            playAudio();
        } else {
            pauseAudio();
        }
    });


    // --- INTERSECTION OBSERVER FOR SECTIONS & TRANSITIONS ---
    const sections = document.querySelectorAll('.snap-section');
    const anniversaryProgress = document.getElementById('anniversary-progress');
    
    // States to prevent multiple triggers
    let chatStarted = false;
    let typingStarted = false;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the section is visible
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                
                // Add active class to animate child elements
                entry.target.classList.add('active');
                
                // Animate elements inside the section
                const animateItems = entry.target.querySelectorAll('.animate-item');
                animateItems.forEach(item => {
                    item.classList.add('active-item');
                });

                // Section Specific Triggers
                if (sectionId === 'anniversary') {
                    // Fill timeline connection line
                    anniversaryProgress.style.width = '100%';
                } else {
                    // Reset timeline if they scroll away (optional, let's keep it filled or reset)
                    // anniversaryProgress.style.width = '0%';
                }

                if (sectionId === 'chat-memories' && !chatStarted) {
                    chatStarted = true;
                    // Start WhatsApp chat simulation
                    setTimeout(playChat, 1000);
                }

                if (sectionId === 'love-letter') {
                    // Increase falling petal density in final section
                    targetMaxPetals = maxPetals * 1.5; 
                    if (!typingStarted) {
                        typingStarted = true;
                        // Start final typewriter typing animation
                        setTimeout(typeAnimation, 1200);
                    }
                } else {
                    // Restore default petal density in other sections
                    targetMaxPetals = maxPetals;
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });


    // --- WHATSAPP CHAT PLAYBACK SIMULATION ---
    const chatMessages = [
        { side: 'right', text: 'halooooo' },
        { side: 'left', text: 'heyyy' },
        { side: 'right', text: 'kamuuu main gamee apaa ajaa' },
        { side: 'left', text: 'ak ada rosblok ama emel si' },
        { side: 'right', text: 'drop ur id' },
        { side: 'right', text: 'km rosblok biasaa main apaa😭' },
        { side: 'left', text: 'ak main aoa aja yg seru' },
        { side: 'left', text: 'main horror' },
        { side: 'left', text: 'kalo mendaki aku udah jarang' },
        { side: 'left', text: 'km mau mabar ama ak yh' }
    ];

    const chatBody = document.getElementById('chat-messages-container');
    let currentMsgIndex = 0;

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'chat-typing-indicator';
        indicator.className = 'chat-bubble bubble-left bubble-typing';
        indicator.innerHTML = `
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
        `;
        chatBody.appendChild(indicator);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('chat-typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    function appendMessage(side, text) {
        const bubble = document.createElement('div');
        const isRight = side === 'right';
        bubble.className = `chat-bubble ${isRight ? 'bubble-right bubble-right-romantic' : 'bubble-left'}`;
        
        // Generate current timestamp or dummy time
        const now = new Date();
        const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        
        bubble.innerHTML = `
            ${text}
            <span class="chat-time">${timeString}</span>
        `;
        
        chatBody.appendChild(bubble);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function playChat() {
        if (currentMsgIndex >= chatMessages.length) {
            // Chat finishes -> reveal romantic text caption
            setTimeout(() => {
                document.getElementById('chat-caption').classList.add('show');
            }, 1000);
            return;
        }

        const msg = chatMessages[currentMsgIndex];

        if (msg.side === 'left') {
            // Partner typing simulation
            setTimeout(() => {
                showTypingIndicator();
                
                // Typing duration based on text length
                const typingDuration = Math.min(1500, Math.max(800, msg.text.length * 50));
                
                setTimeout(() => {
                    removeTypingIndicator();
                    appendMessage(msg.side, msg.text);
                    currentMsgIndex++;
                    // Play next message
                    setTimeout(playChat, 1200);
                }, typingDuration);
            }, 600);
        } else {
            // Right side (sender): short delay and instant spawn
            setTimeout(() => {
                appendMessage(msg.side, msg.text);
                currentMsgIndex++;
                // Play next message
                setTimeout(playChat, 1200);
            }, 800);
        }
    }


    // --- FINAL TYPING ANIMATION (SECTION 06) ---
    const typingTexts = [
        "Happy Birthday ❤️",
        "Happy 2 Month Anniversary 🌸",
        "I Love You."
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingTextEl = document.getElementById('final-typing-text');

    function typeAnimation() {
        const currentText = typingTexts[textIndex];

        if (isDeleting) {
            typingTextEl.innerHTML = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingTextEl.innerHTML = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentText.length) {
            // If it is the final phrase "I Love You.", stop deleting and keep it glowing
            if (textIndex === typingTexts.length - 1) {
                // Done forever
                return;
            }
            speed = 2200; // Pause at the end of typing
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex++;
            speed = 400; // Pause before typing the next phrase
        }

        setTimeout(typeAnimation, speed);
    }

});
