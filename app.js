class VirtualPetRock {
    constructor() {
        // Data from JSON
        this.clickResponses = [
            "...",
            "What do you want?", 
            "I am once again doing nothing.",
            "Ugh.",
            "*stares*",
            "Rock life.",
            "Seriously?",
            "Why?",
            "*cricket sounds*",
            "Fascinating.",
            "Cool story.",
            "And?",
            "*blinks slowly*"
        ];

        this.moods = [
            "Rock feels... bored.",
            "Rock is vibing.",
            "Rock is questioning its existence.", 
            "Rock is contemplating the universe.",
            "Rock is having an existential crisis.",
            "Rock is zen.",
            "Rock is feeling philosophical.",
            "Rock is wondering about the meaning of life.",
            "Rock is just existing.",
            "Rock is in deep thought."
        ];

        this.weatherMoods = {
            "sunny": "Rock is feeling warm and content.",
            "rainy": "Rock is feeling sleepy from the rain.",
            "cloudy": "Rock is feeling contemplative.",
            "stormy": "Rock is feeling dramatic."
        };

        this.weatherTypes = ["sunny", "rainy", "cloudy", "stormy"];
        this.weatherIcons = {
            "sunny": "☀️",
            "rainy": "🌧️", 
            "cloudy": "☁️",
            "stormy": "⛈️"
        };

        // Game state
        this.clickCount = parseInt(localStorage.getItem('rockClickCount')) || 0;
        this.messageCount = parseInt(localStorage.getItem('rockMessageCount')) || 0;
        this.currentAccessory = localStorage.getItem('rockAccessory') || 'none';
        this.currentWeather = 'sunny';
        this.lastMoodChange = 0;
        this.lastWeatherChange = 0;
        this.hasDoubleBlinkEasterEgg = localStorage.getItem('rockDoubleBlinkEgg') === 'true';

        // DOM elements
        this.rock = document.getElementById('rock');
        this.rockName = document.getElementById('rockName');
        this.responseBubble = document.getElementById('responseBubble');
        this.bubbleContent = document.getElementById('bubbleContent');
        this.moodText = document.getElementById('moodText');
        this.clickCountDisplay = document.getElementById('clickCount');
        this.messageCountDisplay = document.getElementById('messageCount');
        this.journalInput = document.getElementById('journalInput');
        this.journalMessages = document.getElementById('journalMessages');
        this.weatherIcon = document.getElementById('weatherIcon');
        this.weatherText = document.getElementById('weatherText');
        this.notification = document.getElementById('notification');
        this.notificationContent = document.getElementById('notificationContent');

        this.init();
    }

    init() {
        this.loadSavedData();
        this.setupEventListeners();
        this.startBlinkTimer();
        this.startMoodTimer();
        this.startWeatherTimer();
        this.updateStats();
        this.updateCurrentMood();
        this.updateWeather();
        this.loadJournalMessages();
    }

    loadSavedData() {
        // Load rock name
        const savedName = localStorage.getItem('rockName');
        if (savedName) {
            this.rockName.value = savedName;
        }

        // Load accessory
        this.setAccessory(this.currentAccessory);
        
        // Check for Dwayne easter egg
        this.checkDwayneEasterEgg();
    }

    setupEventListeners() {
        // Rock clicking
        this.rock.addEventListener('click', () => this.handleRockClick());

        // Name editing - fix the name replacement issue
        this.rockName.addEventListener('focus', () => {
            this.rockName.select(); // Select all text when focused
        });
        
        this.rockName.addEventListener('blur', () => this.saveName());
        this.rockName.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.rockName.blur();
            }
        });

        // Journal
        document.getElementById('sendMessage').addEventListener('click', () => this.sendMessage());
        this.journalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Accessories
        document.querySelectorAll('.accessory-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const accessory = e.target.getAttribute('data-accessory');
                this.setAccessory(accessory);
            });
        });
    }

    handleRockClick() {
        this.clickCount++;
        localStorage.setItem('rockClickCount', this.clickCount.toString());
        this.updateStats();

        // Show random response
        const response = this.getRandomResponse();
        this.showResponse(response);

        // Check for 100-click easter egg
        if (this.clickCount === 100 && !this.hasDoubleBlinkEasterEgg) {
            this.triggerDoubleBlinkEasterEgg();
        }

        // Random chance for extra blink on high clicks
        if (this.clickCount > 50 && Math.random() < 0.1) {
            setTimeout(() => this.blink(), 1000);
        }
    }

    getRandomResponse() {
        return this.clickResponses[Math.floor(Math.random() * this.clickResponses.length)];
    }

    showResponse(text) {
        this.bubbleContent.textContent = text;
        this.responseBubble.classList.remove('hidden');
        
        // Hide after 3 seconds
        setTimeout(() => {
            this.responseBubble.classList.add('hidden');
        }, 3000);
    }

    blink() {
    this.rock.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.rock.style.transform = 'scale(1)';
    }, 150);
}


    startBlinkTimer() {
        const blinkInterval = () => {
            // Random interval between 30-60 seconds
            const nextBlink = Math.random() * 30000 + 30000;
            setTimeout(() => {
                this.blink();
                blinkInterval();
            }, nextBlink);
        };
        blinkInterval();
    }

    triggerDoubleBlinkEasterEgg() {
        this.hasDoubleBlinkEasterEgg = true;
        localStorage.setItem('rockDoubleBlinkEgg', 'true');
        
        this.showNotification('🎉 Easter Egg! Your rock is impressed by your dedication!');
        
        // Double blink
        this.blink();
        setTimeout(() => this.blink(), 300);
    }

    saveName() {
        const name = this.rockName.value.trim() || 'Rock';
        this.rockName.value = name;
        localStorage.setItem('rockName', name);
        this.checkDwayneEasterEgg();
    }

    checkDwayneEasterEgg() {
        const name = this.rockName.value.toLowerCase();
        if (name === 'dwayne') {
            this.rock.classList.add('smirking');
            if (!localStorage.getItem('rockDwayneEgg')) {
                localStorage.setItem('rockDwayneEgg', 'true');
                setTimeout(() => {
                    this.showNotification('🤨 "Can you smell what the rock is cooking?"');
                }, 500);
            }
        } else {
            this.rock.classList.remove('smirking');
        }
    }

    sendMessage() {
        const message = this.journalInput.value.trim();
        if (!message) return;

        // Increment message count first
        this.messageCount++;
        localStorage.setItem('rockMessageCount', this.messageCount.toString());
        
        // Save message to localStorage
        const messages = JSON.parse(localStorage.getItem('rockMessages') || '[]');
        const newMessage = {
            text: message,
            timestamp: new Date().toLocaleString()
        };
        messages.push(newMessage);
        localStorage.setItem('rockMessages', JSON.stringify(messages));

        // Display message immediately
        this.addMessageToJournal(newMessage.text, newMessage.timestamp);
        
        // Rock nods in acknowledgment
        this.rock.classList.add('nod');
        setTimeout(() => {
            this.rock.classList.remove('nod');
        }, 800);

        // Clear input and update stats
        this.journalInput.value = '';
        this.updateStats();

        // Random chance for special response
        if (Math.random() < 0.2) {
            setTimeout(() => {
                const responses = ['*appreciative silence*', '*contemplative staring*', '*wise nodding*'];
                this.showResponse(responses[Math.floor(Math.random() * responses.length)]);
            }, 1200);
        }
    }

    loadJournalMessages() {
        const messages = JSON.parse(localStorage.getItem('rockMessages') || '[]');
        const noMessages = document.querySelector('.no-messages');
        
        if (messages.length > 0 && noMessages) {
            noMessages.style.display = 'none';
        }

        // Show last 5 messages
        messages.slice(-5).forEach(msg => {
            this.addMessageToJournal(msg.text, msg.timestamp);
        });
    }

    addMessageToJournal(text, timestamp) {
        const noMessages = document.querySelector('.no-messages');
        if (noMessages) {
            noMessages.style.display = 'none';
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = 'journal-message';
        messageDiv.innerHTML = `
            <div>${text}</div>
            <small style="color: var(--color-text-secondary); font-size: var(--font-size-xs);">${timestamp}</small>
        `;
        
        this.journalMessages.appendChild(messageDiv);
        
        // Keep only last 5 messages visible
        const messages = this.journalMessages.querySelectorAll('.journal-message');
        if (messages.length > 5) {
            messages[0].remove();
        }
        
        // Scroll to bottom
        this.journalMessages.scrollTop = this.journalMessages.scrollHeight;
    }

    setAccessory(accessory) {
        // Hide all accessories first
        document.querySelectorAll('.accessory').forEach(acc => {
            acc.classList.add('hidden');
        });

        // Show selected accessory with correct ID mapping
        if (accessory !== 'none') {
            let elementId = accessory;
            // Handle special cases for ID mapping
            if (accessory === 'bow-tie') {
                elementId = 'bowTie';
            }
            
            const accessoryElement = document.getElementById(elementId);
            if (accessoryElement) {
                accessoryElement.classList.remove('hidden');
            }
        }

        this.currentAccessory = accessory;
        localStorage.setItem('rockAccessory', accessory);
        this.updateAccessoryButtons();
    }

    updateAccessoryButtons() {
        document.querySelectorAll('.accessory-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-accessory') === this.currentAccessory) {
                btn.classList.add('active');
            }
        });
    }

    startMoodTimer() {
        const changeMood = () => {
            this.updateCurrentMood();
            // Change mood every 2-5 minutes
            const nextChange = Math.random() * 180000 + 120000;
            setTimeout(changeMood, nextChange);
        };
        changeMood();
    }

    updateCurrentMood() {
        // 70% chance for regular mood, 30% chance for weather-based mood
        let mood;
        if (Math.random() < 0.3) {
            mood = this.weatherMoods[this.currentWeather];
        } else {
            mood = this.moods[Math.floor(Math.random() * this.moods.length)];
        }
        
        this.moodText.textContent = mood;
    }

    startWeatherTimer() {
        const changeWeather = () => {
            this.currentWeather = this.weatherTypes[Math.floor(Math.random() * this.weatherTypes.length)];
            this.updateWeather();
            // Change weather every 3-8 minutes
            const nextChange = Math.random() * 300000 + 180000;
            setTimeout(changeWeather, nextChange);
        };
        
        // Initial weather change after 1 minute
        setTimeout(changeWeather, 60000);
    }

    updateWeather() {
        this.weatherIcon.textContent = this.weatherIcons[this.currentWeather];
        this.weatherText.textContent = this.currentWeather.charAt(0).toUpperCase() + this.currentWeather.slice(1);
    }

    updateStats() {
        this.clickCountDisplay.textContent = this.clickCount;
        this.messageCountDisplay.textContent = this.messageCount;
        
        // Calculate days (mock calculation based on total interactions)
        const totalInteractions = this.clickCount + this.messageCount;
        const days = Math.floor(totalInteractions / 10) + 1;
        document.getElementById('days').textContent = days;
    }

    showNotification(text) {
        this.notificationContent.textContent = text;
        this.notification.classList.remove('hidden');
        
        setTimeout(() => {
            this.notification.classList.add('hidden');
        }, 4000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VirtualPetRock();
    
    // Add some fun console messages
    console.log('🪨 Virtual Pet Rock initialized!');
    console.log('Pro tip: Try naming your rock "Dwayne" 😉');
    console.log('Keep clicking to discover easter eggs!');
});