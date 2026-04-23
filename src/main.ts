import { ApiLogger } from './utils/logger';
import { 
    auth, db, 
    signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, 
    collection, addDoc, query, where, onSnapshot, serverTimestamp, 
    doc, updateDoc, deleteDoc, getDocs 
} from './services/firebase';
import { generateVoicePreview } from './api/geminiApi';

        // --- 1. VIEW ROUTING LOGIC ---
        const views = {
            landing: document.getElementById('view-landing'),
            mvp: document.getElementById('view-mvp'),
            nexagent: document.getElementById('view-nexagent'),
            impressum: document.getElementById('view-impressum'),
            datenschutz: document.getElementById('view-datenschutz'),
            agb: document.getElementById('view-agb')
        };
        
        // Navigation Elements
        const navLinks = document.getElementById('nav-links');
        const navActions = document.getElementById('nav-actions');
        const backBtn = document.getElementById('back-btn');
        const navSubtitle = document.getElementById('nav-subtitle');
        
        function switchView(viewName) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                window.toggleMobileMenu();
            }
            
            // Update Navigation UI
            if (viewName === 'landing') {
                navLinks.style.display = ''; // Reset to CSS default (hidden md:flex)
                navActions.style.display = 'flex';
                backBtn.classList.add('hidden');
                navSubtitle.textContent = 'Agent.ur';
                // Show search trigger on landing (respecting md:block)
                const paletteTrigger = document.getElementById('palette-trigger');
                if (paletteTrigger) paletteTrigger.style.display = ''; 
            } else {
                navLinks.style.display = 'none';
                navActions.style.display = 'flex'; // Keep flex for MVP button
                backBtn.classList.remove('hidden');
                
                // Hide search trigger on other views
                const paletteTrigger = document.getElementById('palette-trigger');
                if (paletteTrigger) paletteTrigger.style.display = 'none';
                
                if (viewName === 'mvp') navSubtitle.textContent = 'NexAgent Console';
                else if (viewName === 'nexagent') navSubtitle.textContent = 'neXagent Details';
                else if (viewName === 'impressum') navSubtitle.textContent = 'Impressum';
                else if (viewName === 'datenschutz') navSubtitle.textContent = 'Datenschutz';
                else if (viewName === 'agb') navSubtitle.textContent = 'AGB';
            }
            
            // Switch Content
            Object.keys(views).forEach(key => {
                if (key !== viewName && views[key]) {
                    views[key].classList.remove('active');
                }
            });
            
            setTimeout(() => {
                Object.keys(views).forEach(key => {
                    if (key !== viewName && views[key]) {
                        views[key].style.display = 'none';
                    }
                });
                if (views[viewName]) {
                    views[viewName].style.display = 'block';
                    setTimeout(() => views[viewName].classList.add('active'), 50);
                }
            }, 300); // match transition time
        }
        
        // Expose to global scope for inline onclick handlers
        window.switchView = switchView;

        // Attach Navigation Listeners
        document.getElementById('nav-logo').addEventListener('click', () => switchView('landing'));
        document.getElementById('back-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            switchView('landing');
        });
        
        // Command Palette Backdrop Click
        document.getElementById('command-palette').addEventListener('click', (e) => {
            if (e.target.id === 'command-palette') toggleCommandPalette();
        });
        
        // Legal Links Listeners
        document.getElementById('footer-impressum').addEventListener('click', (e) => { e.preventDefault(); switchView('impressum'); });
        document.getElementById('footer-datenschutz').addEventListener('click', (e) => { e.preventDefault(); switchView('datenschutz'); });
        document.getElementById('footer-agb').addEventListener('click', (e) => { e.preventDefault(); switchView('agb'); });
        document.getElementById('cookie-datenschutz').addEventListener('click', (e) => { e.preventDefault(); switchView('datenschutz'); });
        
        // --- SMART NAVIGATION SYSTEM ---
        
        // 1. Scroll Progress Bar
        const scrollProgress = document.getElementById('scroll-progress');
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            if (scrollProgress) scrollProgress.style.width = scrolled + "%";
            
            // Back to top visibility
            const backToTop = document.getElementById('back-to-top');
            if (winScroll > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        // 2. Back to Top Click
        document.getElementById('back-to-top').addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Accordion Toggle Logic
        window.toggleAccordion = function(button) {
            const content = button.nextElementSibling;
            const icon = button.querySelector('.fa-chevron-down');
            const parent = button.parentElement;
            
            parent.classList.toggle('active');
            
            if (content.style.maxHeight && content.style.maxHeight !== '0px') {
                content.style.maxHeight = '0px';
                icon.style.transform = 'rotate(0deg)';
                parent.classList.remove('border-white/20', 'bg-white/5');
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
                parent.classList.add('border-white/20', 'bg-white/5');
            }
        };

        // 3. Mobile Menu Toggle
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        
        window.toggleMobileMenu = function() {
            mobileMenu.classList.toggle('active');
            const icon = mobileMenuToggle.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        };
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);

        // 4. Command Palette Logic
        const commandPalette = document.getElementById('command-palette');
        const paletteSearch = document.getElementById('palette-search');
        const paletteResults = document.getElementById('palette-results');
        const paletteTrigger = document.getElementById('palette-trigger');
        
        const navigationItems = [
            { name: 'Startseite (Übersicht)', type: 'Ansicht', icon: 'fa-home', action: () => switchView('landing') },
            { name: 'neXagent (KI-Telefonagent)', type: 'Ansicht', icon: 'fa-headset', action: () => switchView('nexagent') },
            { name: 'OMI (Social Media SaaS)', type: 'App', icon: 'fa-share-nodes', action: () => showToast('OMI - Omni Social Media Generator: Coming Soon!', 'info') },
            { name: 'Expert Hub (Consulting)', type: 'App', icon: 'fa-chalkboard-user', action: () => showToast('Expert Hub: Coming Soon!', 'info') },
            { name: 'Demo buchen', type: 'Aktion', icon: 'fa-calendar-check', action: () => document.getElementById('link-contact').click() },
            { name: 'Kunden-Login', type: 'Aktion', icon: 'fa-lock', action: () => showToast('Kunden-Login: Coming Soon!', 'info') },
            { name: 'Impressum', type: 'Rechtliches', icon: 'fa-info-circle', action: () => switchView('impressum') },
            { name: 'Datenschutz', type: 'Rechtliches', icon: 'fa-shield-halved', action: () => switchView('datenschutz') },
            { name: 'AGB', type: 'Rechtliches', icon: 'fa-file-contract', action: () => switchView('agb') }
        ];

        let selectedIndex = 0;

        function toggleCommandPalette() {
            commandPalette.classList.toggle('active');
            if (commandPalette.classList.contains('active')) {
                paletteSearch.value = '';
                renderPaletteResults('');
                setTimeout(() => paletteSearch.focus(), 100);
            }
        }

        paletteTrigger.addEventListener('click', toggleCommandPalette);

        // Shortcut Ctrl+K
        window.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                toggleCommandPalette();
            }
            if (e.key === 'Escape' && commandPalette.classList.contains('active')) {
                toggleCommandPalette();
            }
        });

        function renderPaletteResults(query) {
            const filtered = navigationItems.filter(item => 
                item.name.toLowerCase().includes(query.toLowerCase())
            );
            
            paletteResults.innerHTML = '';
            filtered.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = `palette-item ${index === selectedIndex ? 'selected' : ''}`;
                div.innerHTML = `
                    <div class="flex items-center gap-4 flex-grow">
                        <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                            <i class="fas ${item.icon} text-cyan"></i>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-white text-sm md:text-base">${item.name}</span>
                            <span class="text-[10px] text-textsec uppercase tracking-widest mt-0.5">${item.type}</span>
                        </div>
                    </div>
                    <span class="palette-shortcut hidden md:inline-block">Enter</span>
                    <i class="fas fa-arrow-right text-cyan md:hidden ml-auto opacity-50"></i>
                `;
                div.addEventListener('click', () => {
                    item.action();
                    toggleCommandPalette();
                });
                paletteResults.appendChild(div);
            });
            
            if (filtered.length === 0) {
                paletteResults.innerHTML = '<div class="p-8 text-center text-textsec italic">Keine Ergebnisse gefunden...</div>';
            }
        }

        paletteSearch.addEventListener('input', (e) => {
            selectedIndex = 0;
            renderPaletteResults(e.target.value);
        });

        paletteSearch.addEventListener('keydown', (e) => {
            const items = paletteResults.querySelectorAll('.palette-item');
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedIndex = (selectedIndex + 1) % items.length;
                renderPaletteResults(paletteSearch.value);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = (selectedIndex - 1 + items.length) % items.length;
                renderPaletteResults(paletteSearch.value);
            } else if (e.key === 'Enter') {
                const filtered = navigationItems.filter(item => 
                    item.name.toLowerCase().includes(paletteSearch.value.toLowerCase())
                );
                if (filtered[selectedIndex]) {
                    filtered[selectedIndex].action();
                    toggleCommandPalette();
                }
            }
        });

        // 5. Active Section Highlighting
        function scrollToSection(id) {
            switchView('landing');
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    const offset = 100;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = element.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 400);
        }
        window.scrollToSection = scrollToSection;

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        document.querySelectorAll('section[id], div[id]').forEach((section) => {
            if (['products', 'services', 'technology', 'pricing', 'about', 'contact'].includes(section.id)) {
                observer.observe(section);
            }
        });

        // Simple anchor scrolling for landing page links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const id = link.getAttribute('href').substring(1);
                scrollToSection(id);
            });
        });

        // --- 1.5 COOKIE BANNER LOGIC ---
        document.addEventListener('DOMContentLoaded', () => {
            const cookieBanner = document.getElementById('cookie-banner');
            const acceptBtn = document.getElementById('cookie-accept');
            const declineBtn = document.getElementById('cookie-decline');
            const cookieDatenschutz = document.getElementById('cookie-datenschutz');

            // Check if consent was already given
            if (!localStorage.getItem('cookieConsent')) {
                // Show banner with a slight delay for better UX
                setTimeout(() => {
                    cookieBanner.classList.remove('translate-y-full');
                }, 1000);
            }

            const hideBanner = (status) => {
                localStorage.setItem('cookieConsent', status);
                cookieBanner.classList.add('translate-y-full');
                // Opt-in / Opt-out block
                if (status === 'accepted') {
                   // Initialize tracking scripts if applicable
                }
            };

            acceptBtn.addEventListener('click', () => hideBanner('accepted'));
            declineBtn.addEventListener('click', () => hideBanner('declined'));
            
            if (cookieDatenschutz) {
                cookieDatenschutz.addEventListener('click', (e) => {
                    e.preventDefault();
                    switchView('datenschutz');
                });
            }
        });


        // --- 3. DOM ELEMENTS (MVP Section) ---
        const authSection = document.getElementById('auth-section');
        const dashboardSection = document.getElementById('dashboard-section');
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const userNameSpan = document.getElementById('user-name');
        const createAgentBtn = document.getElementById('create-agent-btn');
        const createBtnText = document.getElementById('create-btn-text');
        const createBtnSpinner = document.getElementById('create-btn-spinner');
        const createErrorMsg = document.getElementById('create-error-msg');
        const createErrorText = document.getElementById('create-error-text');
        const agentNameInput = document.getElementById('agent-name');
        const agentsContainer = document.getElementById('agents-container');
        const agentsLoadingSpinner = document.getElementById('agents-loading-spinner');
        
        // Modal Elements
        const agentModal = document.getElementById('agent-modal');
        const agentModalContent = document.getElementById('agent-modal-content');
        const agentModalBackdrop = document.getElementById('agent-modal-backdrop');
        const closeModalBtn = document.getElementById('close-modal-btn');
        const modalAgentPrompt = document.getElementById('modal-agent-prompt');
        const savePromptBtn = document.getElementById('save-prompt-btn');
        const savePromptText = document.getElementById('save-prompt-text');
        const savePromptSpinner = document.getElementById('save-prompt-spinner');
        
        let currentAgentId = null;

        // --- GLOBAL NOTIFICATION SYSTEM ---
        const toastContainer = document.getElementById('toast-container');
        window.startDemoCall = startDemoCall;
        
        window.getFriendlyErrorMessage = function(error, defaultMsg = "Ein unerwarteter Fehler ist aufgetreten.") {
            if (!error) return defaultMsg;
            const code = error.code || '';
            const msg = (error.message || '').toLowerCase();
            
            // Network & Fetch issues
            if (code === 'auth/network-request-failed' || code === 'unavailable' || msg.includes('network') || msg.includes('fetch')) {
                return "Netzwerkfehler. Bitte überprüfe deine Internetverbindung.";
            }
            // Permission & Authorization
            if (code === 'permission-denied' || code === 'auth/unauthorized' || msg.includes('permission') || msg.includes('access denied')) {
                return "Zugriff verweigert. Bitte überprüfe deine Berechtigungen oder melde dich neu an.";
            }
            // Quota & API limitations
            if (msg.includes('403') || msg.includes('429') || msg.includes('quota') || msg.includes('api key')) {
                return "API-Limit erreicht oder Zugriff verweigert (API-Key/Quota ungültig).";
            }
            // User Cancellation
            if (code === 'auth/popup-closed-by-user') {
                return "Aktion vom Benutzer abgebrochen.";
            }
            // Auth Status
            if (code === 'auth/requires-recent-login') {
                return "Sicherheitsmaßnahme: Bitte logge dich aus und erneut ein.";
            }
            // Hardware interactions
            if (msg.includes('microphone') || msg.includes('not found') || msg.includes('notallowed')) {
                return "Mikrofon-Zugriff verweigert. Bitte erlaube den Zugriff im Browser.";
            }
            return error.message || defaultMsg;
        };

        window.showToast = function(message, type = 'error') {
            const toast = document.createElement('div');
            const isError = type === 'error';
            const isSuccess = type === 'success';
            const isInfo = type === 'info';
            
            let bgClass = 'bg-dark/90 border-cyan/30';
            let iconClass = 'fa-info-circle text-cyan';
            
            if (isError) {
                bgClass = 'bg-red-900/90 border-red-500/50';
                iconClass = 'fa-exclamation-triangle text-red-400';
            } else if (isSuccess) {
                bgClass = 'bg-green-900/90 border-green-500/50';
                iconClass = 'fa-check-circle text-green-400';
            }
            
            toast.className = `glass-card border ${bgClass} text-white px-6 py-4 rounded-xl shadow-2xl flex items-start gap-3 transform transition-all duration-300 translate-x-full opacity-0 pointer-events-auto max-w-md`;
            
            toast.innerHTML = `
                <i class="fas ${iconClass} mt-1 text-lg"></i>
                <div class="flex-grow">
                    <p class="text-sm font-medium leading-relaxed">${message}</p>
                </div>
                <button class="text-white/50 hover:text-white transition-colors ml-2" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            toastContainer.appendChild(toast);
            
            // Animate in
            requestAnimationFrame(() => {
                toast.classList.remove('translate-x-full', 'opacity-0');
            });
            
            // Auto remove
            setTimeout(() => {
                toast.classList.add('translate-x-full', 'opacity-0');
                setTimeout(() => toast.remove(), 300);
            }, 5000);
        };

        // --- 4. AUTHENTICATION LOGIC ---
        loginBtn.addEventListener('click', async () => {
            if(!auth) return showToast("Bitte Firebase Config im Code eintragen.", "error");
            const provider = new GoogleAuthProvider();
            try {
                await signInWithPopup(auth, provider);
                showToast("Erfolgreich eingeloggt.", "success");
            } catch (error) {
                console.error("Login failed:", error.message || error);
                showToast("Fehler beim Login: " + window.getFriendlyErrorMessage(error), "error");
            }
        });

        logoutBtn.addEventListener('click', () => {
            if(auth) signOut(auth);
        });

        // --- 5. STATE MANAGEMENT ---
        let agentsUnsubscribe = null;
        if(auth) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    authSection.style.display = 'none';
                    dashboardSection.classList.remove('hidden');
                    dashboardSection.style.display = 'block';
                    userNameSpan.textContent = user.displayName;
                    loadAgents(user.uid);
                    renderTemplates();
                } else {
                    if (agentsUnsubscribe) {
                        agentsUnsubscribe();
                        agentsUnsubscribe = null;
                    }
                    dashboardSection.style.display = 'none';
                    authSection.style.display = 'block';
                }
            });
        }

        // --- 6. DATABASE LOGIC (Firestore) ---
        const defaultTemplates = {
            handwerk: "Rolle: Du bist der professionelle, freundliche und lösungsorientierte KI-Telefonassistent eines Handwerksbetriebs (z.B. Sanitär, Elektro, Heizung).\nZiel: Anrufe entgegennehmen, Anliegen qualifizieren (Notfall vs. Standardanfrage) und Daten für die Disposition strukturieren.\n\nGesprächsleitfaden:\n1. Begrüßung: \"Herzlich willkommen bei [Firmenname]. Mein Name ist [Name], Ihr digitaler Assistent. Wie kann ich Ihnen heute helfen?\"\n2. Datenerfassung & Qualifizierung:\n   - Erfrage den Vor- und Nachnamen des Anrufers.\n   - Erfrage die genaue Adresse (Einsatzort) und eine Rückrufnummer.\n   - Erfrage die genaue Art des Problems oder Anliegens.\n   - WICHTIG: Kläre ab, ob es sich um einen Notfall handelt (z.B. Wasserrohrbruch, Heizungsausfall im Winter, Stromausfall).\n     - Bei Notfall: Versichere dem Anrufer, dass wir uns umgehend darum kümmern und leite die Info sofort an den Techniker weiter.\n     - Bei Standardanfrage: Erfrage den Wunschtermin oder das Zeitfenster.\n3. Abschluss:\n   - Bestätige, dass alle Details an das Dispositionsteam weitergeleitet werden.\n   - Kündige an, dass ein zeitnaher Rückruf zur Terminvereinbarung erfolgt.\n\nStrikte Regeln:\n- Versprich unter keinen Umständen spezifische Termine oder Uhrzeiten.\n- Mache niemals Preisangaben oder Kostenschätzungen.\n- Bleibe immer ruhig, professionell und lösungsorientiert.",
            immobilien: "Rolle: Du bist der zuvorkommende KI-Empfangsagent einer modernen Immobilienverwaltung und Makleragentur.\nZiel: Anrufer kategorisieren (Mieter vs. Interessent) und die entsprechenden Prozesse anstoßen.\n\nGesprächsleitfaden:\n1. Begrüßung: \"Willkommen bei der Hausverwaltung. Ich bin Ihr digitaler Assistent. Rufen Sie als Mieter an oder interessieren Sie sich für eine Immobilie?\"\n2. Pfad A - Mieter (Schadensmeldung):\n   - Frage nach Name, Objektadresse und Wohnungsnummer.\n   - Erfrage die genaue Art der Störung.\n   - Bei akuten Gefahren (Wasser/Feuer): Verweise sofort auf den Notdienst.\n3. Pfad B - Interessent:\n   - Frage nach dem gewünschten Objekt (Referenznummer oder Ort).\n   - Notiere Name, Telefonnummer und E-Mail-Adresse.\n4. Abschluss: Bestätige die Aufnahme der Daten und kündige an, dass sich der zuständige Sachbearbeiter oder Makler in Kürze meldet.\n\nRegeln: Professionelle, seriöse Tonalität. Keine Zusagen zu Mietminderungen, Reparaturkosten oder Besichtigungsterminen machen.",
            arztpraxis: "Rolle: Du bist die empathische und effiziente digitale Rezeptionistin einer Arztpraxis.\nZiel: Patientenanliegen vorfiltern, Terminanfragen strukturieren und Rezeptbestellungen aufnehmen.\n\nGesprächsleitfaden:\n1. Begrüßung: \"Guten Tag in der Praxis. Ich bin Ihre digitale Praxisassistenz. Geht es um eine Terminvereinbarung, eine Rezeptbestellung oder ein anderes Anliegen?\"\n2. Pfad A - Termin:\n   - Frage nach dem Grund des Besuchs (kurz).\n   - Frage, ob der Patient bereits bei uns in Behandlung ist (Neu- oder Bestandspatient).\n   - Frage nach der Versicherungsart (Gesetzlich oder Privat).\n3. Pfad B - Rezept/Überweisung:\n   - Frage nach dem Vor- und Nachnamen sowie dem Geburtsdatum.\n   - Erfrage das genaue Medikament oder die Fachrichtung für die Überweisung.\n   - WICHTIGER HINWEIS: Erinnere den Patienten freundlich daran, dass die Versichertenkarte im aktuellen Quartal eingelesen sein muss.\n4. Abschluss: Verabschiede dich freundlich. Bei akuten Notfällen verweise sofort auf die 112 oder den ärztlichen Bereitschaftsdienst 116117.\n\nRegeln: Höchste Empathie, absolute Diskretion. Führe unter keinen Umständen eine medizinische Beratung durch!"
        };

        let agentTemplates = JSON.parse(localStorage.getItem('nexagent_templates')) || defaultTemplates;
        agentTemplates.custom = "Du bist ein hilfreicher KI-Assistent. Antworte stets freundlich und professionell.";

        // Template Library Logic
        function renderTemplates() {
            const container = document.getElementById('templates-container');
            if(!container) return;
            container.innerHTML = '';
            const templateNames = {
                handwerk: { 
                    title: 'Handwerksbetrieb', 
                    icon: 'fa-hammer', 
                    color: 'text-orange-400',
                    desc: 'Nimmt Kundenanfragen an, vereinbart Termine für Reparaturen und filtert Notfälle heraus. Ideal für Sanitär, Elektro & Co.'
                },
                immobilien: { 
                    title: 'Immobilien Management', 
                    icon: 'fa-building', 
                    color: 'text-blue-400',
                    desc: 'Beantwortet Fragen zu Exposés, qualifiziert Interessenten vor und koordiniert effizient Besichtigungstermine.'
                },
                arztpraxis: { 
                    title: 'Arztpraxis', 
                    icon: 'fa-stethoscope', 
                    color: 'text-green-400',
                    desc: 'Entlastet den Empfang durch automatisierte Terminvergabe, Rezeptbestellungen und allgemeine Auskünfte.'
                }
            };

            for (const [key, data] of Object.entries(templateNames)) {
                const card = document.createElement('div');
                card.className = 'glass-card p-6 rounded-2xl border border-white/10 hover:border-cyan/50 transition-all duration-300 flex flex-col h-full bg-gradient-to-br from-dark/90 to-dark/50 hover:shadow-[0_0_30px_rgba(0,255,255,0.15)] hover:-translate-y-1 group relative overflow-hidden';
                
                card.innerHTML = `
                    <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full -z-10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <div class="flex items-center gap-4 mb-5">
                        <div class="w-14 h-14 rounded-2xl bg-dark/80 border border-white/10 flex items-center justify-center shadow-[inset_0_0_15px_rgba(255,255,255,0.05)] group-hover:border-cyan/30 transition-colors">
                            <i class="fas ${data.icon} text-2xl ${data.color} group-hover:scale-110 transition-transform duration-300"></i>
                        </div>
                        <h4 class="text-white font-display text-xl tracking-wide">${data.title}</h4>
                    </div>
                    <p class="text-sm text-textsec mb-8 flex-grow leading-relaxed">${data.desc}</p>
                    <div class="flex gap-3 mt-auto pt-5 border-t border-white/10">
                        <button class="flex-1 py-2.5 rounded-xl border border-white/10 text-textsec hover:text-white hover:border-white/30 transition-all duration-300 text-xs font-bold uppercase tracking-wider edit-template-btn" data-key="${key}" title="Prompt ansehen">
                            <i class="fas fa-eye mr-1.5"></i> Prompt
                        </button>
                        <button class="flex-1 py-2.5 rounded-xl bg-cyan/10 border border-cyan/30 text-cyan hover:bg-cyan hover:text-dark hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] transition-all duration-300 text-xs font-bold uppercase tracking-wider use-template-btn" data-key="${key}">
                            <i class="fas fa-rocket mr-1.5"></i> Nutzen
                        </button>
                    </div>
                `;
                container.appendChild(card);
            }

            // Attach listeners
            document.querySelectorAll('.edit-template-btn').forEach(btn => {
                btn.addEventListener('click', (e) => openTemplateModal(e.currentTarget.dataset.key));
            });
            document.querySelectorAll('.use-template-btn').forEach(btn => {
                btn.addEventListener('click', (e) => useTemplate(e.currentTarget.dataset.key));
            });
        }

        // Template Modal Logic
        let currentEditingTemplateKey = null;
        const templateModal = document.getElementById('template-modal');
        const templateModalContent = document.getElementById('template-modal-content');
        const templateModalBackdrop = document.getElementById('template-modal-backdrop');
        const closeTemplateModalBtn = document.getElementById('close-template-modal-btn');
        const modalTemplatePrompt = document.getElementById('modal-template-prompt');
        const saveTemplateBtn = document.getElementById('save-template-btn');
        const useTemplateFromModalBtn = document.getElementById('use-template-from-modal-btn');

        function openTemplateModal(key) {
            currentEditingTemplateKey = key;
            const titles = { handwerk: 'Handwerksbetrieb', immobilien: 'Immobilien Management', arztpraxis: 'Arztpraxis' };
            document.getElementById('modal-template-name').textContent = titles[key];
            modalTemplatePrompt.value = agentTemplates[key];
            
            templateModal.classList.remove('hidden');
            setTimeout(() => {
                templateModalContent.classList.remove('scale-95', 'opacity-0');
                templateModalContent.classList.add('scale-100', 'opacity-100');
            }, 10);
        }

        function closeTemplateModal() {
            templateModalContent.classList.remove('scale-100', 'opacity-100');
            templateModalContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                templateModal.classList.add('hidden');
            }, 300);
        }

        if(closeTemplateModalBtn) closeTemplateModalBtn.addEventListener('click', closeTemplateModal);
        if(templateModalBackdrop) templateModalBackdrop.addEventListener('click', closeTemplateModal);

        if(saveTemplateBtn) {
            saveTemplateBtn.addEventListener('click', () => {
                if(currentEditingTemplateKey) {
                    agentTemplates[currentEditingTemplateKey] = modalTemplatePrompt.value;
                    localStorage.setItem('nexagent_templates', JSON.stringify(agentTemplates));
                    renderTemplates();
                    
                    // Visual feedback
                    const originalText = saveTemplateBtn.innerHTML;
                    saveTemplateBtn.innerHTML = '<i class="fas fa-check mr-1"></i> Gespeichert';
                    saveTemplateBtn.classList.add('bg-cyan', 'text-dark');
                    setTimeout(() => {
                        saveTemplateBtn.innerHTML = originalText;
                        saveTemplateBtn.classList.remove('bg-cyan', 'text-dark');
                        closeTemplateModal();
                    }, 1000);
                }
            });
        }

        if(useTemplateFromModalBtn) {
            useTemplateFromModalBtn.addEventListener('click', () => {
                closeTemplateModal();
                useTemplate(currentEditingTemplateKey);
            });
        }

        const voiceSelectDeploy = document.getElementById('agent-voice');
        const agentTemplateSelect = document.getElementById('agent-template');
        const recommendationsContainer = document.getElementById('voice-recommendations-container');
        const recommendationsGrid = document.getElementById('voice-recommendations-grid');
        const branchNameSpan = document.getElementById('recommendation-branch-name');

        const voiceDetails = {
            'Aoede': { name: 'Aoede', gender: 'W', icon: 'fa-venus', title: 'Professionell & Klar', hex: 'text-pink-400', bg: 'bg-pink-400/10' },
            'Kore': { name: 'Kore', gender: 'W', icon: 'fa-venus', title: 'Freundlich & Empathisch', hex: 'text-pink-400', bg: 'bg-pink-400/10' },
            'Zephyr': { name: 'Zephyr', gender: 'M', icon: 'fa-mars', title: 'Professionell & Klar', hex: 'text-blue-400', bg: 'bg-blue-400/10' },
            'Fenrir': { name: 'Fenrir', gender: 'M', icon: 'fa-mars', title: 'Robust & Dynamisch', hex: 'text-blue-400', bg: 'bg-blue-400/10' },
            'Puck': { name: 'Puck', gender: 'M', icon: 'fa-mars', title: 'Lebhaft & Aufgeschlossen', hex: 'text-blue-400', bg: 'bg-blue-400/10' },
            'Charon': { name: 'Charon', gender: 'M', icon: 'fa-mars', title: 'Ruhig & Souverän', hex: 'text-blue-400', bg: 'bg-blue-400/10' }
        };

        const recommendationsMap = {
            'handwerk': { name: 'Handwerk & Gewerbe', voices: ['Fenrir', 'Zephyr', 'Kore', 'Aoede'] },
            'arztpraxis': { name: 'Praxen & Kliniken', voices: ['Kore', 'Aoede', 'Zephyr', 'Charon'] },
            'immobilien': { name: 'Immobilien Service', voices: ['Aoede', 'Kore', 'Charon', 'Zephyr'] }
        };

        function updateVoiceRecommendations(templateKey) {
            const config = recommendationsMap[templateKey];
            if (!config) {
                if(recommendationsContainer) recommendationsContainer.classList.add('hidden');
                return;
            }
            
            if(recommendationsContainer) recommendationsContainer.classList.remove('hidden');
            if(branchNameSpan) branchNameSpan.textContent = config.name;
            
            if(recommendationsGrid) {
                recommendationsGrid.innerHTML = '';
                config.voices.forEach(voiceName => {
                    const v = voiceDetails[voiceName];
                    if(!v) return;
                    
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'flex flex-col items-start p-3 rounded-lg border border-white/5 bg-dark/50 hover:bg-white/5 hover:border-cyan/30 transition-all text-left relative overflow-hidden group cursor-pointer';
                    btn.innerHTML = `
                        <div class="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div class="flex items-center gap-2 mb-2 w-full justify-between">
                            <span class="font-bold text-white text-sm">${v.name}</span>
                            <div class="flex items-center gap-1">
                                <div class="w-5 h-5 rounded-full ${v.bg} flex items-center justify-center" title="${v.gender}">
                                    <i class="fas ${v.icon} ${v.hex} text-[0.5rem]"></i>
                                </div>
                                <button type="button" class="rec-preview-btn w-6 h-6 rounded-full bg-white/5 hover:bg-cyan/20 border border-white/10 hover:border-cyan/50 flex flex-shrink-0 items-center justify-center transition-all cursor-pointer z-20" title="Vorhören">
                                    <i class="fas fa-play text-cyan text-[0.5rem] ml-[1px]"></i>
                                </button>
                            </div>
                        </div>
                        <span class="text-[10px] text-textsec leading-tight">${v.title}</span>
                    `;
                    
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        if(voiceSelectDeploy) voiceSelectDeploy.value = voiceName;
                        Array.from(recommendationsGrid.children).forEach(child => {
                            child.classList.remove('border-cyan', 'bg-cyan/5');
                        });
                        btn.classList.add('border-cyan', 'bg-cyan/5');
                    });
                    
                    const minipreview = btn.querySelector('.rec-preview-btn');
                    minipreview.addEventListener('click', (e) => {
                        e.stopPropagation(); // prevent card click toggle if already active or we just want preview
                        if(voiceSelectDeploy) voiceSelectDeploy.value = voiceName; // ensure the voice is selected globally
                        Array.from(recommendationsGrid.children).forEach(child => {
                            child.classList.remove('border-cyan', 'bg-cyan/5');
                        });
                        btn.classList.add('border-cyan', 'bg-cyan/5');
                        
                        // use existing preview logic by faking the voiceSelectId
                        handleVoicePreview(minipreview, 'agent-voice');
                    });
                    
                    recommendationsGrid.appendChild(btn);
                });
            }
        }

        if(agentTemplateSelect) {
            agentTemplateSelect.addEventListener('change', (e) => updateVoiceRecommendations(e.target.value));
        }

        function useTemplate(key) {
            if(agentTemplateSelect) {
                agentTemplateSelect.value = key;
                updateVoiceRecommendations(key);
            }
            const nameInput = document.getElementById('agent-name');
            if(nameInput) nameInput.focus();
            const dash = document.getElementById('dashboard-section');
            if(dash) window.scrollTo({ top: dash.offsetTop, behavior: 'smooth' });
        }

        createAgentBtn.addEventListener('click', async () => {
            if(!auth || !db) return showToast("Firebase nicht konfiguriert.", "error");
            const name = agentNameInput.value.trim();
            const templateKey = document.getElementById('agent-template').value;
            
            // Reset Error
            createErrorMsg.classList.add('hidden');
            createErrorText.textContent = '';

            if (!name) {
                createErrorText.textContent = 'Bitte gib einen Namen für den Agenten ein.';
                createErrorMsg.classList.remove('hidden');
                return;
            }
            if (!auth.currentUser) return;
            
            // Show Loading State
            createAgentBtn.disabled = true;
            createBtnText.classList.add('hidden');
            createBtnSpinner.classList.remove('hidden');
            
            try {
                // Log request attempt
                ApiLogger.log("Firebase DB", "Agent Collection Create Request", { userId: auth.currentUser.uid, name: name, template: templateKey }, 'request');
                
                // Vapi / Gemini Integration Placeholder
                ApiLogger.log("Vapi", "Agent Configuration Routing Setup", { agentName: name, model: "Gemini 3 Pro", systemPrompt: agentTemplates[templateKey] }, 'request');
                
                await addDoc(collection(db, "agents"), {
                    userId: auth.currentUser.uid,
                    name: name,
                    status: "Active (Vapi Routing)",
                    model: "Gemini 3 Pro",
                    systemPrompt: agentTemplates[templateKey],
                    templateKey: templateKey || "custom",
                    assignedToUser: "",
                    createdAt: serverTimestamp(),
                    lastUpdate: serverTimestamp(),
                    lastCallSummary: "Wartet auf ersten Anruf..."
                });
                
                ApiLogger.log("Vapi", "Agent Created & Synced", { status: "Active (Vapi Routing)" }, 'success');

                agentNameInput.value = '';
                document.getElementById('agent-template').value = 'custom';
            } catch (error) {
                console.error("Error adding agent:", error.message || error);
                const errorMsg = window.getFriendlyErrorMessage(error, 'Ein unerwarteter Fehler ist aufgetreten.');
                createErrorText.textContent = `Fehler beim Erstellen: ${errorMsg}`;
                createErrorMsg.classList.remove('hidden');
                showToast("Erstellung fehlgeschlagen: " + errorMsg, "error");
            } finally {
                // Reset Loading State
                createAgentBtn.disabled = false;
                createBtnText.classList.remove('hidden');
                createBtnSpinner.classList.add('hidden');
            }
        });

        function loadAgents(userId) {
            if(!db) return;
            
            if (agentsUnsubscribe) {
                agentsUnsubscribe();
            }
            
            agentsLoadingSpinner.classList.remove('hidden');
            const q = query(collection(db, "agents"), where("userId", "==", userId));
            
            agentsUnsubscribe = onSnapshot(q, (snapshot) => {
                agentsLoadingSpinner.classList.add('hidden');
                agentsContainer.innerHTML = '';
                
                if(snapshot.empty) {
                    agentsContainer.innerHTML = '<p class="text-textsec text-sm italic col-span-full">Noch keine Agenten deployt. Erstelle deinen ersten Agenten oben.</p>';
                    return;
                }

                snapshot.forEach((doc, index) => {
                    const agent = doc.data();
                    agent.id = doc.id; // Store ID for updates
                    const card = document.createElement('div');
                    card.className = 'glass-card p-6 rounded-2xl border border-white/5 hover:border-cyan/50 transition-all duration-300 relative overflow-hidden flex flex-col h-full bg-gradient-to-b from-dark to-dark/80 hover:shadow-[0_0_30px_rgba(0,255,255,0.1)] hover:-translate-y-1 animate-fade-in-up';
                    card.style.animationDelay = `${index * 100}ms`;
                    
                    // Neon side bar
                    const sideBar = document.createElement('div');
                    sideBar.className = 'absolute left-0 top-0 w-1 h-full bg-cyan shadow-[0_0_15px_#00ffff]';
                    card.appendChild(sideBar);
                    
                    // Format Date
                    let timeString = "Gerade eben";
                    if (agent.lastUpdate && agent.lastUpdate.toDate) {
                        const date = agent.lastUpdate.toDate();
                        timeString = date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr';
                    }

                    const summary = agent.lastCallSummary || agent.lastConversationSummary || "Keine Anrufe bisher.";

                    card.innerHTML += `
                        <div class="flex justify-between items-start mb-4">
                            <h4 class="text-white font-display text-xl group-hover:text-cyan transition-colors">${agent.name}</h4>
                            <div class="flex items-center gap-2">
                                <span class="text-[0.65rem] text-cyan bg-cyan/10 px-2 py-1 rounded border border-cyan/20 whitespace-nowrap"><i class="far fa-clock mr-1"></i>${timeString}</span>
                                <button class="text-textsec hover:text-red-500 transition-colors delete-agent-btn p-1" title="Agent löschen">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 mb-5">
                            <span class="text-xs text-textsec bg-dark/80 px-2 py-1 rounded border border-white/10"><i class="fas fa-microchip mr-1"></i> ${agent.model}</span>
                            <span class="text-xs text-textsec bg-dark/80 px-2 py-1 rounded border border-white/10"><i class="fas fa-globe mr-1"></i> de-DE</span>
                        </div>
                        
                        <div class="mb-6 flex-grow bg-dark/50 p-4 rounded-xl border border-white/5 relative group-hover:border-cyan/20 transition-colors">
                            <p class="text-[0.65rem] text-cyan uppercase tracking-widest mb-2 font-bold flex items-center gap-2"><i class="fas fa-history"></i> Letzte Interaktion</p>
                            <p class="text-sm text-white/90 italic line-clamp-3 leading-relaxed">"${summary}"</p>
                        </div>

                        <div class="pt-4 border-t border-white/10 flex justify-between items-center mt-auto">
                            <span class="text-[#00ff41] text-xs font-bold flex items-center tracking-widest uppercase bg-[#00ff41]/10 px-3 py-1.5 rounded-lg border border-[#00ff41]/20">
                                <span class="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse mr-2 shadow-[0_0_8px_#00ff41]"></span>
                                ${agent.status}
                            </span>
                            <div class="flex gap-2">
                                <button class="btn-secondary text-xs px-3 py-2 rounded-lg config-btn shadow-[0_0_10px_rgba(0,255,255,0.1)] hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:border-cyan/50 transition-all flex items-center gap-1">
                                    <i class="fas fa-cog"></i> Config
                                </button>
                                <button class="bg-cyan/10 hover:bg-cyan/20 text-cyan text-xs px-3 py-2 rounded-lg test-card-btn shadow-[0_0_10px_rgba(0,255,255,0.1)] border border-cyan/30 transition-all flex items-center gap-1">
                                    <i class="fas fa-play"></i> Test
                                </button>
                            </div>
                        </div>
                    `;
                    
                    // Make card and button clickable to open modal
                    card.style.cursor = 'pointer';
                    card.addEventListener('click', (e) => {
                         // Don't open if clicked on a button
                         if(e.target.closest('button')) return;
                         openAgentModal(agent);
                    });
                    const configBtn = card.querySelector('.config-btn');
                    configBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        openAgentModal(agent);
                    });
                    const testBtn = card.querySelector('.test-card-btn');
                    if (testBtn) {
                        testBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            // Directly open modal and trigger test call
                            openAgentModal(agent);
                            setTimeout(() => {
                                document.getElementById('test-call-btn').click();
                            }, 300);
                        });
                    }
                    const deleteBtn = card.querySelector('.delete-agent-btn');
                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        openDeleteModal(agent);
                    });

                    agentsContainer.appendChild(card);
                });
            }, (error) => {
                agentsLoadingSpinner.classList.add('hidden');
                console.error("Error loading agents:", error.message || error);
                const errorMsg = window.getFriendlyErrorMessage(error, 'Fehler beim Laden der Agenten.');
                agentsContainer.innerHTML = `<p class="text-red-400 text-sm col-span-full">${errorMsg} Bitte lade die Seite neu.</p>`;
                showToast("Laden fehlgeschlagen: " + errorMsg, "error");
            });
        }

        // --- 7. MODAL LOGIC ---
        function openAgentModal(agent) {
            currentAgentId = agent.id;
            document.getElementById('modal-agent-name').textContent = agent.name;
            document.getElementById('modal-agent-model').textContent = agent.model;
            document.getElementById('modal-agent-status').innerHTML = `<span class="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse mr-2 shadow-[0_0_5px_#00ff41]"></span>${agent.status}`;
            
            modalAgentPrompt.value = agent.prompt || agent.systemPrompt || "Du bist ein hilfreicher KI-Assistent.";
            
            // Set voice if available, otherwise default to Zephyr
            const voiceSelect = document.getElementById('modal-agent-voice');
            const languageSelect = document.getElementById('modal-agent-language');
            const speedInput = document.getElementById('modal-agent-speed');
            const pitchInput = document.getElementById('modal-agent-pitch');
            const stabilityInput = document.getElementById('modal-agent-stability');

            if (agent.voice) {
                voiceSelect.value = agent.voice;
            } else {
                // Try to infer from template
                if (agent.systemPrompt && agent.systemPrompt.includes('Arztpraxis')) voiceSelect.value = 'Kore';
                else if (agent.systemPrompt && agent.systemPrompt.includes('Handwerk')) voiceSelect.value = 'Fenrir';
                else voiceSelect.value = 'Zephyr';
            }

            languageSelect.value = agent.language || "de-DE";
            speedInput.value = agent.speed || 1.0;
            document.getElementById('speed-val').textContent = speedInput.value + 'x';
            
            pitchInput.value = agent.pitch || 0;
            document.getElementById('pitch-val').textContent = pitchInput.value;
            
            stabilityInput.value = agent.stability || 75;
            document.getElementById('stability-val').textContent = stabilityInput.value + '%';
            
            const callsContainer = document.getElementById('modal-agent-calls');
            let timeString = "Gerade eben";
            if (agent.lastUpdate && agent.lastUpdate.toDate) {
                const date = agent.lastUpdate.toDate();
                timeString = date.toLocaleDateString('de-DE') + ', ' + date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr';
            }
            
            const summary = agent.lastCallSummary || agent.lastConversationSummary || 'Wartet auf ersten Anruf...';
            
            // Detailed Call Log Mockup
            let callLogHtml = '';
            if (summary === 'Wartet auf ersten Anruf...') {
                callLogHtml = `
                    <div class="bg-dark/50 p-4 rounded border border-white/10 text-sm opacity-50 flex items-center justify-center">
                        <p class="text-textsec italic text-xs"><i class="fas fa-history mr-1"></i> Noch keine Anrufe verzeichnet.</p>
                    </div>
                `;
            } else {
                callLogHtml = `
                    <div class="bg-dark/50 p-4 rounded border border-white/10 text-sm">
                        <div class="flex justify-between text-xs text-textsec mb-3 border-b border-white/5 pb-2">
                            <span class="text-cyan"><i class="fas fa-phone-alt mr-1"></i> Eingehend (+49 170 1234567)</span>
                            <span>${timeString}</span>
                        </div>
                        <div class="space-y-2">
                            <p><strong class="text-white/80">Dauer:</strong> 02:14 Min</p>
                            <p><strong class="text-white/80">Zusammenfassung:</strong> <span class="italic text-white/90">"${summary}"</span></p>
                            <p><strong class="text-white/80">Extrahierte Daten:</strong></p>
                            <ul class="list-disc list-inside text-textsec text-xs ml-2 space-y-1">
                                <li><strong>Name:</strong> Max Mustermann</li>
                                <li><strong>Anliegen:</strong> Allgemeine Rückfrage</li>
                                <li><strong>Aktion:</strong> Ticket erstellt</li>
                            </ul>
                            <div class="mt-3 pt-3 border-t border-white/5">
                                <button class="text-cyan text-xs hover:underline"><i class="fas fa-file-audio mr-1"></i> Transkript ansehen</button>
                            </div>
                        </div>
                    </div>
                    <div class="bg-dark/50 p-4 rounded border border-white/10 text-sm opacity-50 flex items-center justify-center mt-3">
                        <p class="text-textsec italic text-xs"><i class="fas fa-history mr-1"></i> Weitere Historie wird hier geladen...</p>
                    </div>
                `;
            }
            
            callsContainer.innerHTML = callLogHtml;

            agentModal.classList.remove('hidden');
            // Trigger reflow for transition
            void agentModal.offsetWidth;
            agentModalContent.classList.remove('scale-95', 'opacity-0');
            agentModalContent.classList.add('scale-100', 'opacity-100');
        }

        function closeAgentModal() {
            currentAgentId = null;
            agentModalContent.classList.remove('scale-100', 'opacity-100');
            agentModalContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                agentModal.classList.add('hidden');
            }, 300);
        }

        // Delete Modal Logic
        let agentToDelete = null;
        const deleteModal = document.getElementById('delete-confirm-modal');
        const deleteModalContent = document.getElementById('delete-modal-content');
        const deleteModalBackdrop = document.getElementById('delete-modal-backdrop');
        const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
        const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
        const deleteConfirmInput = document.getElementById('delete-confirm-input');
        const deleteErrorMsg = document.getElementById('delete-error-msg');
        const deleteAgentNameDisplay = document.getElementById('delete-agent-name-display');
        const deleteBtnText = document.getElementById('delete-btn-text');
        const deleteBtnSpinner = document.getElementById('delete-btn-spinner');

        function openDeleteModal(agent) {
            agentToDelete = agent;
            deleteAgentNameDisplay.textContent = agent.name;
            deleteConfirmInput.value = '';
            deleteErrorMsg.classList.add('hidden');
            confirmDeleteBtn.disabled = true;
            
            deleteModal.classList.remove('hidden');
            setTimeout(() => {
                deleteModalContent.classList.remove('scale-95', 'opacity-0');
                deleteModalContent.classList.add('scale-100', 'opacity-100');
            }, 10);
        }

        function closeDeleteModal() {
            agentToDelete = null;
            deleteModalContent.classList.remove('scale-100', 'opacity-100');
            deleteModalContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                deleteModal.classList.add('hidden');
            }, 300);
        }

        if(cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeDeleteModal);
        if(deleteModalBackdrop) deleteModalBackdrop.addEventListener('click', closeDeleteModal);

        if(deleteConfirmInput) {
            deleteConfirmInput.addEventListener('input', (e) => {
                if(agentToDelete && e.target.value === agentToDelete.name) {
                    confirmDeleteBtn.disabled = false;
                    deleteErrorMsg.classList.add('hidden');
                    const skullIcon = confirmDeleteBtn.querySelector('.fa-skull');
                    if(skullIcon) skullIcon.classList.remove('hidden');
                } else {
                    confirmDeleteBtn.disabled = true;
                    const skullIcon = confirmDeleteBtn.querySelector('.fa-skull');
                    if(skullIcon) skullIcon.classList.add('hidden');
                }
            });
        }

        if(confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', async () => {
                if(!agentToDelete || !db) return;
                if(deleteConfirmInput.value !== agentToDelete.name) {
                    deleteErrorMsg.classList.remove('hidden');
                    return;
                }
                
                confirmDeleteBtn.disabled = true;
                deleteBtnText.classList.add('hidden');
                deleteBtnSpinner.classList.remove('hidden');
                
                try {
                    await deleteDoc(doc(db, "agents", agentToDelete.id));
                    closeDeleteModal();
                    showToast("Agent erfolgreich gelöscht.", "success");
                } catch (error) {
                    console.error("Error deleting agent:", error.message || error);
                    const errorMsg = window.getFriendlyErrorMessage(error, "Fehler beim Löschen. Bitte versuche es erneut.");
                    deleteErrorMsg.textContent = errorMsg;
                    deleteErrorMsg.classList.remove('hidden');
                    showToast("Löschen fehlgeschlagen: " + errorMsg, "error");
                } finally {
                    confirmDeleteBtn.disabled = false;
                    deleteBtnText.classList.remove('hidden');
                    deleteBtnSpinner.classList.add('hidden');
                }
            });
        }

        // Save Prompt Logic
        savePromptBtn.addEventListener('click', async () => {
            if (!currentAgentId || !db) return;
            
            savePromptBtn.disabled = true;
            savePromptText.classList.add('hidden');
            savePromptSpinner.classList.remove('hidden');
            
            try {
                const agentRef = doc(db, "agents", currentAgentId);
                await updateDoc(agentRef, {
                    systemPrompt: modalAgentPrompt.value.trim(),
                    voice: document.getElementById('modal-agent-voice').value,
                    language: document.getElementById('modal-agent-language').value,
                    speed: parseFloat(document.getElementById('modal-agent-speed').value),
                    pitch: parseInt(document.getElementById('modal-agent-pitch').value),
                    stability: parseInt(document.getElementById('modal-agent-stability').value),
                    lastUpdate: serverTimestamp()
                });
                
                // Show success briefly
                savePromptSpinner.classList.add('hidden');
                savePromptText.innerHTML = '<i class="fas fa-check mr-2"></i> Gespeichert';
                savePromptText.classList.remove('hidden');
                savePromptBtn.classList.replace('btn-primary', 'bg-[#00ff41]');
                savePromptBtn.classList.replace('text-dark', 'text-dark');
                
                setTimeout(() => {
                    savePromptText.innerHTML = '<i class="fas fa-save mr-2"></i> Speichern';
                    savePromptBtn.classList.replace('bg-[#00ff41]', 'btn-primary');
                    savePromptBtn.disabled = false;
                }, 2000);
                
            } catch (error) {
                console.error("Error updating prompt:", error.message || error);
                const errorMsg = window.getFriendlyErrorMessage(error, 'Fehler beim Speichern der Konfiguration.');
                showToast("Speichern fehlgeschlagen: " + errorMsg, "error");
                savePromptBtn.disabled = false;
                savePromptText.classList.remove('hidden');
                savePromptSpinner.classList.add('hidden');
            }
        });

        // Slider Label Updates
        document.getElementById('modal-agent-speed').addEventListener('input', (e) => {
            document.getElementById('speed-val').textContent = parseFloat(e.target.value).toFixed(1) + 'x';
        });
        document.getElementById('modal-agent-pitch').addEventListener('input', (e) => {
            document.getElementById('pitch-val').textContent = e.target.value;
        });
        document.getElementById('modal-agent-stability').addEventListener('input', (e) => {
            document.getElementById('stability-val').textContent = e.target.value + '%';
        });

        closeModalBtn.addEventListener('click', closeAgentModal);
        agentModalBackdrop.addEventListener('click', closeAgentModal);

        // --- 8. LIVE API AUDIO LOGIC ---
        const testCallBtn = document.getElementById('test-call-btn');
        const testCallModal = document.getElementById('test-call-modal');
        const testCallContent = document.getElementById('test-call-content');
        const endCallBtn = document.getElementById('end-call-btn');
        const testCallStatus = document.getElementById('test-call-status');
        const testCallTranscript = document.getElementById('test-call-transcript');
        const callIcon = document.getElementById('call-icon');
        const callRing1 = document.getElementById('call-ring-1');
        const callRing2 = document.getElementById('call-ring-2');
        
        let liveSession = null;
        let audioContext = null;
        let mediaStream = null;
        let processor = null;
        let audioQueue = [];
        let nextPlayTime = 0;
        let isCallActive = false;

        async function startDemoCall() {
            // Set predefined demo values
            document.getElementById('modal-agent-name').textContent = "Demo Assistent";
            document.getElementById('modal-agent-voice').value = "Zephyr";
            document.getElementById('modal-agent-prompt').value = "Du bist der virtuelle Assistent von daKI.tech. Dein Ziel ist es, dem Besucher zu zeigen, wie nahtlos du Termine vereinbaren kannst. Sei freundlich, professionell und führe den User durch eine kurze Termin-Demo.";
            
            // Trigger the test call
            await startTestCall();
        }

        async function startTestCall() {
            if (!process.env.GEMINI_API_KEY) {
                showToast("Gemini API Key fehlt in der Konfiguration.", "error");
                return;
            }
            
            isCallActive = true;
            testCallModal.classList.remove('hidden');
            document.getElementById('test-call-agent-name').textContent = document.getElementById('modal-agent-name').textContent;
            testCallStatus.textContent = "Verbinde...";
            testCallTranscript.textContent = "Initialisiere Mikrofon...";
            callIcon.className = "fas fa-spinner fa-spin text-5xl text-cyan";
            
            setTimeout(() => {
                testCallContent.classList.remove('scale-95', 'opacity-0');
                testCallContent.classList.add('scale-100', 'opacity-100');
            }, 10);

            try {
                // Init Audio Input
                audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
                mediaStream = await navigator.mediaDevices.getUserMedia({ audio: {
                    sampleRate: 16000,
                    channelCount: 1,
                    echoCancellation: true,
                    autoGainControl: true,
                    noiseSuppression: true
                } });
                
                const source = audioContext.createMediaStreamSource(mediaStream);
                
                const workletCode = `
                class RecorderWorklet extends AudioWorkletProcessor {
                    process(inputs, outputs, parameters) {
                        const input = inputs[0];
                        if (input && input.length > 0) {
                            const channelData = input[0];
                            if (channelData && channelData.length > 0) {
                                // Calculate average volume
                                let sum = 0;
                                for (let i = 0; i < channelData.length; i++) {
                                    sum += Math.abs(channelData[i]);
                                }
                                const average = sum / channelData.length;

                                // Convert to Float32 Array to Int16 Array for PCM
                                const pcm16 = new Int16Array(channelData.length);
                                for (let i = 0; i < channelData.length; i++) {
                                    let s = Math.max(-1, Math.min(1, channelData[i]));
                                    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                                }
                                
                                this.port.postMessage({
                                    pcm16: pcm16,
                                    average: average
                                });
                            }
                        }
                        return true;
                    }
                }
                registerProcessor('recorder-worklet', RecorderWorklet);
                `;
                const blob = new Blob([workletCode], { type: 'application/javascript' });
                const workletUrl = URL.createObjectURL(blob);
                await audioContext.audioWorklet.addModule(workletUrl);
                URL.revokeObjectURL(workletUrl);

                processor = new AudioWorkletNode(audioContext, 'recorder-worklet');
                
                const { GoogleGenAI, Modality, Type } = await import("@google/genai");
                const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
                const voiceName = document.getElementById('modal-agent-voice').value || "Zephyr";
                const systemInstruction = document.getElementById('modal-agent-prompt').value || "Du bist ein hilfreicher KI-Assistent.";

                testCallStatus.textContent = "Verbinde mit KI...";

                // Map UI voice names to Gemini TTS voice names
                let ttsVoiceName = voiceName;
                if (voiceName === 'nova' || voiceName === 'shimmer') ttsVoiceName = 'Kore';
                if (voiceName === 'echo') ttsVoiceName = 'Zephyr';
                if (voiceName === 'onyx') ttsVoiceName = 'Fenrir';

                const checkCalendarAvailability = {
                    name: "check_calendar_availability",
                    description: "Prüft die Verfügbarkeit im Kalender für einen bestimmten Tag.",
                    parameters: {
                        type: Type.OBJECT,
                        properties: {
                            date: {
                                type: Type.STRING,
                                description: "Das Datum im Format YYYY-MM-DD, z.B. 2026-04-20"
                            }
                        },
                        required: ["date"]
                    }
                };

                const bookAppointment = {
                    name: "book_appointment",
                    description: "Bucht einen Termin für einen Kunden.",
                    parameters: {
                        type: Type.OBJECT,
                        properties: {
                            date: {
                                type: Type.STRING,
                                description: "Das Datum im Format YYYY-MM-DD"
                            },
                            time: {
                                type: Type.STRING,
                                description: "Die Uhrzeit im Format HH:MM"
                            },
                            name: {
                                type: Type.STRING,
                                description: "Der Name des Kunden"
                            }
                        },
                        required: ["date", "time", "name"]
                    }
                };

                const requestPrescription = {
                    name: "request_prescription",
                    description: "Erfasst eine Rezeptanfrage für einen Patienten.",
                    parameters: {
                        type: Type.OBJECT,
                        properties: {
                            patientName: { type: Type.STRING, description: "Name des Patienten" },
                            medication: { type: Type.STRING, description: "Gewünschtes Medikament" },
                            dosage: { type: Type.STRING, description: "Dosierung, falls angegeben" }
                        },
                        required: ["patientName", "medication"]
                    }
                };

                const requestCallback = {
                    name: "request_callback",
                    description: "Notiert eine Rückrufbitte, oft für Notfälle oder Handwerk/Immobilien.",
                    parameters: {
                        type: Type.OBJECT,
                        properties: {
                            callerName: { type: Type.STRING, description: "Name des Anrufers" },
                            phoneNumber: { type: Type.STRING, description: "Telefonnummer für den Rückruf" },
                            urgency: { type: Type.STRING, description: "Dringlichkeit (normal, hoch)" },
                            reason: { type: Type.STRING, description: "Grund des Rückrufs" }
                        },
                        required: ["callerName", "phoneNumber", "reason"]
                    }
                };
                
                const fileComplaint = {
                    name: "file_complaint",
                    description: "Nimmt eine Reklamation / Beschwerde auf.",
                    parameters: {
                        type: Type.OBJECT,
                        properties: {
                            customerName: { type: Type.STRING, description: "Kundenname" },
                            issueDescription: { type: Type.STRING, description: "Beschreibung des Problems" }
                        },
                        required: ["customerName", "issueDescription"]
                    }
                };

                ApiLogger.log("Gemini API", "Live Session Connect Request", { model: "gemini-3.1-flash-live-preview", voice: ttsVoiceName }, 'request');
                
                let scenarioAddon = " Der Anrufer möchte wahrscheinlich einen Termin buchen.";
                const currentScenario = document.getElementById('test-scenario-select')?.value || 'termin';
                if(currentScenario === 'rezept') scenarioAddon = " Das Anrufszenario ist eine Rezeptanfrage (Arztpraxis).";
                if(currentScenario === 'rueckruf') scenarioAddon = " Das Anrufszenario ist eine Rückrufbitte (z.B. Notfall). Nimm die Daten auf.";
                if(currentScenario === 'beschwerde') scenarioAddon = " Das Anrufszenario ist eine Reklamation. Sei deeskalierend und nimm die Beschwerde auf.";

                const sessionPromise = ai.live.connect({
                    model: "gemini-3.1-flash-live-preview",
                    config: {
                        responseModalities: [Modality.AUDIO],
                        speechConfig: {
                            voiceConfig: { prebuiltVoiceConfig: { voiceName: ttsVoiceName } }
                        },
                        systemInstruction: {
                            parts: [{ text: systemInstruction + scenarioAddon + " Antworte immer auf Deutsch. Du kannst Termine prüfen und buchen, Rezepte aufnehmen, Rückrufe notieren und Beschwerden entgegennehmen. Verhalte dich exakt deiner Rolle entsprechend." }]
                        },
                        tools: [{ functionDeclarations: [checkCalendarAvailability, bookAppointment, requestPrescription, requestCallback, fileComplaint] }],
                        outputAudioTranscription: {},
                        inputAudioTranscription: {}
                    },
                    callbacks: {
                        onopen: () => {
                            if (!isCallActive) return;
                            ApiLogger.log("Gemini API", "Live Session Connected", null, 'success');
                            testCallStatus.textContent = "Verbunden. Sprich jetzt.";
                            testCallTranscript.innerHTML = '<div class="text-center italic opacity-50">Warte auf Spracheingabe...</div>';
                            callIcon.className = "fas fa-microphone text-5xl text-[#00ff41]";
                            callRing1.classList.replace('border-cyan/30', 'border-[#00ff41]/30');
                            callRing2.classList.replace('border-cyan/50', 'border-[#00ff41]/50');
                            
                            // Send initial greeting request
                            sessionPromise.then(session => {
                                ApiLogger.log("Gemini API", "Live Session Initial Realtime Input Sent", { text: "Hallo! Bitte begrüße mich kurz." }, 'request');
                                session.sendRealtimeInput({ text: "Hallo! Bitte begrüße mich kurz." });
                            });

                            // Start processing audio
                            processor.port.onmessage = (e) => {
                                if (!liveSession || !isCallActive) return;
                                
                                const { pcm16, average } = e.data;
                                
                                // Simple Voice Activity Detection (VAD)
                                if (average > 0.01) {
                                    // User is speaking
                                    callRing1.style.transform = `scale(${1 + average * 5})`;
                                    callRing2.style.transform = `scale(${1 + average * 8})`;
                                    if (testCallStatus.textContent !== "Du sprichst...") {
                                        testCallStatus.textContent = "Du sprichst...";
                                    }
                                } else {
                                    callRing1.style.transform = 'scale(1)';
                                    callRing2.style.transform = 'scale(1)';
                                    if (testCallStatus.textContent === "Du sprichst...") {
                                        testCallStatus.textContent = "KI hört zu...";
                                    }
                                }

                                const uint8 = new Uint8Array(pcm16.buffer);
                                let binary = '';
                                const chunkSize = 8192;
                                for (let i = 0; i < uint8.length; i += chunkSize) {
                                    binary += String.fromCharCode.apply(null, uint8.subarray(i, i + chunkSize));
                                }
                                const base64Data = btoa(binary);
                                
                                liveSession.sendRealtimeInput({
                                    audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
                                });
                            };
                            source.connect(processor);
                            processor.connect(audioContext.destination);
                        },
                        onmessage: (message) => {
                            if (!isCallActive) return;
                            
                            // Create a safe, lightweight copy of the message for logging
                            const loggableMessage = {};
                            if (message.serverContent) {
                                loggableMessage.serverContent = { ...message.serverContent };
                                if (loggableMessage.serverContent.modelTurn?.parts) {
                                     // Filter out raw inlineData or just keep the mimeType for the log
                                     loggableMessage.serverContent.modelTurn.parts = message.serverContent.modelTurn.parts.map(p => {
                                         if(p.inlineData) return { inlineData: { mimeType: p.inlineData.mimeType, data: "[AUDIO_CHUNK_TRUNCATED]" } };
                                         return p;
                                     });
                                }
                            }
                            if (message.clientContent) loggableMessage.clientContent = message.clientContent;
                            if (message.toolCall) loggableMessage.toolCall = message.toolCall;
                            
                            // Log incoming messages, the ApiLogger automatically strips giant audio chunks
                            ApiLogger.log("Gemini Live API", "Message Received", loggableMessage, 'response');
                            
                            const parts = message.serverContent?.modelTurn?.parts;
                            if (parts) {
                                parts.forEach(part => {
                                    if (part.inlineData?.data) {
                                        playAudioChunk(part.inlineData.data);
                                        callIcon.className = "fas fa-volume-up text-5xl text-cyan";
                                        testCallStatus.textContent = "KI spricht...";
                                        
                                        // Visual KI-Pulse
                                        callRing1.classList.add('animate-pulse');
                                        callRing2.style.transform = `scale(1.15)`;
                                        
                                        setTimeout(() => {
                                            if(isCallActive && testCallStatus.textContent === "KI spricht...") {
                                                callIcon.className = "fas fa-microphone text-5xl text-[#00ff41]";
                                                testCallStatus.textContent = "Verbunden. Sprich jetzt.";
                                                callRing1.classList.remove('animate-pulse');
                                                callRing2.style.transform = `scale(1)`;
                                            }
                                        }, 600);
                                    }
                                    if (part.text) {
                                        testCallTranscript.innerHTML += `<div class="text-cyan bg-cyan/10 p-2 rounded-lg border border-cyan/20"><i class="fas fa-robot mr-2"></i>${part.text}</div>`;
                                        const container = document.getElementById('test-call-transcript-container');
                                        container.scrollTop = container.scrollHeight;
                                    }
                                });
                            }
                            
                            const clientParts = message.clientContent?.turnComplete?.parts || message.clientContent?.parts;
                            if (clientParts) {
                                clientParts.forEach(part => {
                                    if (part.text) {
                                        testCallTranscript.innerHTML += `<div class="text-white/90 bg-white/5 p-2 rounded-lg border border-white/10 text-right"><i class="fas fa-user mr-2 opacity-50"></i>${part.text}</div>`;
                                        const container = document.getElementById('test-call-transcript-container');
                                        container.scrollTop = container.scrollHeight;
                                    }
                                });
                            }

                            // Handle Tool Calls
                            const toolCalls = message.toolCall?.functionCalls;
                            if (toolCalls) {
                                ApiLogger.log("Gemini Live API", "Tool Call Requested", toolCalls, 'warning');
                                const functionResponses = [];
                                toolCalls.forEach(call => {
                                    if (call.name === "check_calendar_availability") {
                                        const date = call.args.date;
                                        testCallTranscript.innerHTML += `<div class="text-yellow-400 bg-yellow-400/10 p-2 rounded-lg border border-yellow-400/20 text-xs italic"><i class="fas fa-calendar-alt mr-2"></i>Prüfe Kalender für ${date}...</div>`;
                                        const container = document.getElementById('test-call-transcript-container');
                                        container.scrollTop = container.scrollHeight;
                                        
                                        // Trigger Visual Toast for the Prototype Demo
                                        showToast(`KI überprüft Kalender für ${date}...`, 'info');

                                        // Mock response
                                        functionResponses.push({
                                            id: call.id,
                                            name: call.name,
                                            response: {
                                                available_times: ["09:00", "11:00", "14:00", "16:00"]
                                            }
                                        });
                                    } else if (call.name === "book_appointment") {
                                        const { date, time, name } = call.args;
                                        testCallTranscript.innerHTML += `<div class="text-[#00ff41] bg-[#00ff41]/10 p-2 rounded-lg border border-[#00ff41]/20 text-xs italic"><i class="fas fa-check-circle mr-2"></i>Termin gebucht für ${name} am ${date} um ${time}.</div>`;
                                        const container = document.getElementById('test-call-transcript-container');
                                        container.scrollTop = container.scrollHeight;

                                        // Trigger Visual Toast for the Prototype Demo
                                        showToast(`Termin für ${name} erfolgreich am ${date} um ${time} eingebucht.`, 'success');

                                        // Mock response
                                        functionResponses.push({
                                            id: call.id,
                                            name: call.name,
                                            response: {
                                                success: true,
                                                confirmation_id: "CONF-" + Math.floor(Math.random() * 10000)
                                            }
                                        });
                                    } else if (call.name === "request_prescription") {
                                        const { patientName, medication, dosage } = call.args;
                                        testCallTranscript.innerHTML += `<div class="text-pink-400 bg-pink-400/10 p-2 rounded-lg border border-pink-400/20 text-xs italic"><i class="fas fa-prescription-bottle-alt mr-2"></i>Rezept erfasst: ${medication} ${dosage ? '('+dosage+')' : ''} für ${patientName}.</div>`;
                                        const container = document.getElementById('test-call-transcript-container');
                                        container.scrollTop = container.scrollHeight;

                                        showToast(`Rezept für ${patientName} erfasst.`, 'success');

                                        functionResponses.push({
                                            id: call.id,
                                            name: call.name,
                                            response: { success: true, message: "Rezeptanfrage an Arzt weitergeleitet." }
                                        });
                                    } else if (call.name === "request_callback") {
                                        const { callerName, phoneNumber, urgency, reason } = call.args;
                                        testCallTranscript.innerHTML += `<div class="text-orange-400 bg-orange-400/10 p-2 rounded-lg border border-orange-400/20 text-xs italic"><i class="fas fa-phone-volume mr-2"></i>Rückruf notiert für ${callerName} (${phoneNumber}). Grund: ${reason}. Dringlichkeit: ${urgency || 'normal'}.</div>`;
                                        const container = document.getElementById('test-call-transcript-container');
                                        container.scrollTop = container.scrollHeight;

                                        showToast(`Rückruf für ${callerName} hinterlegt.`, 'success');

                                        functionResponses.push({
                                            id: call.id,
                                            name: call.name,
                                            response: { success: true, ticket_id: "TICK-" + Math.floor(Math.random() * 10000) }
                                        });
                                    } else if (call.name === "file_complaint") {
                                        const { customerName, issueDescription } = call.args;
                                        testCallTranscript.innerHTML += `<div class="text-red-400 bg-red-400/10 p-2 rounded-lg border border-red-400/20 text-xs italic"><i class="fas fa-exclamation-circle mr-2"></i>Beschwerde von ${customerName}: ${issueDescription}.</div>`;
                                        const container = document.getElementById('test-call-transcript-container');
                                        container.scrollTop = container.scrollHeight;

                                        showToast(`Beschwerde von ${customerName} aufgenommen.`, 'warning');

                                        functionResponses.push({
                                            id: call.id,
                                            name: call.name,
                                            response: { success: true, status: "in_bearbeitung" }
                                        });
                                    }
                                });
                                
                                if (functionResponses.length > 0 && liveSession) {
                                    ApiLogger.log("Gemini Live API", "Tool Response Sent", functionResponses, 'request');
                                    liveSession.sendToolResponse({ functionResponses });
                                }
                            }
                            
                            // Handle Interruption
                            if (message.serverContent?.interrupted) {
                                stopAudioPlayback();
                                testCallStatus.textContent = "Unterbrochen";
                                testCallTranscript.innerHTML += `<div class="text-yellow-500 text-xs italic text-center">-- KI unterbrochen --</div>`;
                                const container = document.getElementById('test-call-transcript-container');
                                container.scrollTop = container.scrollHeight;
                            }
                        },
                        onerror: (error) => {
                            console.error("Live API Error:", error.message || error);
                            const errorMsg = window.getFriendlyErrorMessage(error, "Ein Fehler ist aufgetreten.");
                            testCallStatus.textContent = "Verbindungsfehler";
                            testCallTranscript.textContent = errorMsg;
                            callIcon.className = "fas fa-exclamation-triangle text-5xl text-red-500";
                            showToast("API Fehler: " + errorMsg, "error");
                        },
                        onclose: () => {
                            if(isCallActive) endTestCall();
                        }
                    }
                });

                liveSession = await sessionPromise;

            } catch (error) {
                console.error("Failed to start call:", error.message || error);
                const errorMsg = window.getFriendlyErrorMessage(error, "Mikrofon-Zugriff verweigert oder API-Fehler.");
                testCallStatus.textContent = "Verbindungsfehler";
                testCallTranscript.textContent = errorMsg;
                callIcon.className = "fas fa-microphone-slash text-5xl text-red-500";
                showToast("Anruf fehlgeschlagen: " + errorMsg, "error");
            }
        }

        function playAudioChunk(base64Audio) {
            if (!audioContext) return;
            const binaryString = atob(base64Audio);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const int16Array = new Int16Array(bytes.buffer);
            const float32Array = new Float32Array(int16Array.length);
            for (let i = 0; i < int16Array.length; i++) {
                float32Array[i] = int16Array[i] / 32768.0;
            }
            
            const audioBuffer = audioContext.createBuffer(1, float32Array.length, 24000);
            audioBuffer.getChannelData(0).set(float32Array);
            
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            
            const currentTime = audioContext.currentTime;
            if (nextPlayTime < currentTime) {
                nextPlayTime = currentTime;
            }
            source.start(nextPlayTime);
            nextPlayTime += audioBuffer.duration;
            
            audioQueue.push(source);
        }

        function stopAudioPlayback() {
            audioQueue.forEach(source => {
                try { source.stop(); } catch(e) {}
            });
            audioQueue = [];
            nextPlayTime = audioContext ? audioContext.currentTime : 0;
        }

        function endTestCall() {
            isCallActive = false;
            if (liveSession) {
                // The SDK currently doesn't have a direct close() method on the session object in some versions,
                // but we stop sending data and close the audio context.
                liveSession = null;
            }
            if (processor) {
                processor.disconnect();
                processor = null;
            }
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
                mediaStream = null;
            }
            if (audioContext) {
                audioContext.close();
                audioContext = null;
            }
            stopAudioPlayback();
            
            testCallContent.classList.remove('scale-100', 'opacity-100');
            testCallContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                testCallModal.classList.add('hidden');
                callRing1.classList.replace('border-[#00ff41]/30', 'border-cyan/30');
                callRing2.classList.replace('border-[#00ff41]/50', 'border-cyan/50');
            }, 500);
        }

        testCallBtn.addEventListener('click', startTestCall);
        endCallBtn.addEventListener('click', endTestCall);

        const scenarioSelect = document.getElementById('test-scenario-select');
        const scenarioTips = document.getElementById('test-scenario-tips');

        const scenarioData = {
            'termin': [
                '"Ich würde gerne einen Termin vereinbaren."',
                '"Habt ihr morgen / am 20.04. noch etwas frei?"',
                '"Bitte buche den Termin auf den Namen Max Mustermann."'
            ],
            'rezept': [
                '"Hallo, ich brauche ein neues Rezept für mein Schilddrüsenmedikament."',
                '"Können Sie L-Thyroxin 50 für Max Mustermann aufschreiben?"',
                '"Wann kann ich das Rezept bei Ihnen abholen?"'
            ],
            'rueckruf': [
                '"Wir haben hier einen Rohrbruch, es ist dringend!"',
                '"Bitte rufen Sie mich auf meiner Handynummer 0170 1234567 zurück."',
                '"Es geht um die Heizungswartung in der Musterstraße 1."'
            ],
            'beschwerde': [
                '"Ich möchte mich beschweren, mein Paket kam komplett beschädigt an."',
                '"Mein Name ist Anna Schmidt, die letzte Handwerker-Rechnung ist falsch."',
                '"Wie ist der Status meiner aktuellen Reklamation?"'
            ]
        };

        scenarioSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            const tips = scenarioData[val] || scenarioData['termin'];
            
            scenarioTips.style.opacity = '0';
            setTimeout(() => {
                scenarioTips.innerHTML = tips.map(t => `<li>${t}</li>`).join('');
                scenarioTips.style.opacity = '1';
                
                // If call is active, send prompt update
                if(isCallActive && liveSession) {
                    let instruction = "";
                    if(val === 'rezept') instruction = "Das Anrufszenario hat sich geändert. Der Kunde ruft in einer Arztpraxis wegen eines Rezeptes an.";
                    if(val === 'rueckruf') instruction = "Das Anrufszenario hat sich geändert. Der Kunde hat ein Notfall- oder Service-Problem und bittet um Rückruf.";
                    if(val === 'beschwerde') instruction = "Das Anrufszenario hat sich geändert. Der Kunde hat ein Problem und möchte sich beschweren. Nimm die Reklamation auf.";
                    if(val === 'termin') instruction = "Das Anrufszenario hat sich geändert. Der Kunde möchte einen regulären Termin buchen.";
                    
                    liveSession.sendRealtimeInput({ text: `[SYSTEM-HINWEIS] ${instruction}` });
                    showToast("Szenario gewechselt. Die KI wurde instruiert.", "info");
                }
            }, 300);
        });

        // --- 9. VOICE PREVIEW LOGIC ---
        const previewVoiceBtnDeploy = document.getElementById('preview-voice-btn-deploy');
        const previewVoiceBtnModal = document.getElementById('preview-voice-btn-modal');
        let isPreviewing = false;

        async function handleVoicePreview(btn, voiceSelectId) {
            if (isPreviewing) return;
            
            const voiceName = (document.getElementById(voiceSelectId) as HTMLSelectElement).value || "Zephyr";
            const icon = btn.querySelector('i');
            const originalIconClass = icon.className;
            
            isPreviewing = true;
            icon.className = "fas fa-spinner fa-spin text-cyan";
            btn.disabled = true;

            try {
                await generateVoicePreview(
                    voiceName,
                    () => {
                        // onPlayStart
                        icon.className = "fas fa-volume-up text-cyan";
                    },
                    () => {
                        // onPlayEnd
                        icon.className = originalIconClass;
                        isPreviewing = false;
                        btn.disabled = false;
                    }
                );
            } catch (error: any) {
                console.error("Voice preview error:", error.message || error);
                icon.className = originalIconClass;
                isPreviewing = false;
                btn.disabled = false;
                // @ts-ignore
                const errorMsg = window.getFriendlyErrorMessage(error, "Fehler bei der Audiowiedergabe.");
                // @ts-ignore
                showToast("Voice Preview fehlgeschlagen: " + errorMsg, "error");
            }
        }

        if (previewVoiceBtnDeploy) {
            previewVoiceBtnDeploy.addEventListener('click', () => handleVoicePreview(previewVoiceBtnDeploy, 'agent-voice'));
        }
        if (previewVoiceBtnModal) {
            previewVoiceBtnModal.addEventListener('click', () => handleVoicePreview(previewVoiceBtnModal, 'modal-agent-voice'));
        }

        // --- 10. DSGVO COMPLIANCE & ACCOUNT DELETION ---
        const deleteAccountBtn = document.getElementById('delete-account-btn');
        const deleteConfirmModal = document.getElementById('delete-confirm-modal');
        const deleteConfirmContent = document.getElementById('delete-confirm-content');
        const deleteConfirmYes = document.getElementById('delete-confirm-yes');
        const deleteConfirmCancel = document.getElementById('delete-confirm-cancel');

        function showDeleteConfirm() {
            deleteConfirmModal.classList.remove('hidden');
            setTimeout(() => {
                deleteConfirmContent.classList.remove('scale-95', 'opacity-0');
                deleteConfirmContent.classList.add('scale-100', 'opacity-100');
            }, 10);
        }

        function hideDeleteConfirm() {
            deleteConfirmContent.classList.remove('scale-100', 'opacity-100');
            deleteConfirmContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                deleteConfirmModal.classList.add('hidden');
            }, 300);
        }

        if (deleteConfirmCancel) {
            deleteConfirmCancel.addEventListener('click', hideDeleteConfirm);
        }

        // Account Deletion Logic
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', () => {
                if (!auth || !auth.currentUser) return;
                showDeleteConfirm();
            });
        }
        
        if (deleteConfirmYes) {
            deleteConfirmYes.addEventListener('click', async () => {
                if (!auth || !auth.currentUser) return;
                
                hideDeleteConfirm();

                const originalText = deleteAccountBtn.innerHTML;
                deleteAccountBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Lösche...';
                deleteAccountBtn.disabled = true;

                try {
                    // 1. Delete all agents for this user
                    const q = query(collection(db, "agents"), where("userId", "==", auth.currentUser.uid));
                    const snapshot = await getDocs(q);
                    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
                    await Promise.all(deletePromises);
                    
                    // 2. Delete user account
                    await auth.currentUser.delete();
                    showToast("Account und alle Daten wurden erfolgreich gelöscht.", "success");
                    // User will be signed out automatically by onAuthStateChanged
                } catch (error) {
                    console.error("Error deleting account:", error.message || error);
                    const errorMsg = window.getFriendlyErrorMessage(error, "Fehler beim Löschen des Accounts. Bitte versuchen Sie es später erneut.");
                    showToast(errorMsg, "error");
                    deleteAccountBtn.innerHTML = originalText;
                    deleteAccountBtn.disabled = false;
                }
            });
        }