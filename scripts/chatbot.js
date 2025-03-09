class Chatbot {
    constructor() {
        this.isOpen = false;
        this.initialize();
    }

    initialize() {
        this.createChatbotUI();
        this.attachEventListeners();
    }

    createChatbotUI() {
        const chatbotHTML = `
            <div class="chatbot-container">
                <div class="chat-icon">
                    <i class="fas fa-comment"></i>
                </div>
                <div class="chat-window">
                    <div class="chat-header">
                        <h4>AI Assistant</h4>
                    </div>
                    <div class="chat-messages"></div>
                    <div class="chat-input">
                        <input type="text" placeholder="Type your question...">
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    attachEventListeners() {
        const chatIcon = document.querySelector('.chat-icon');
        const chatWindow = document.querySelector('.chat-window');
        const chatInput = document.querySelector('.chat-input input');

        chatIcon.addEventListener('click', () => {
            this.isOpen = !this.isOpen;
            chatWindow.style.display = this.isOpen ? 'flex' : 'none';
        });

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const message = chatInput.value.trim();
                if (message) {
                    this.addMessage('user', message);
                    this.processUserMessage(message);
                    chatInput.value = '';
                }
            }
        });
    }

    addMessage(type, content) {
        const messagesContainer = document.querySelector('.chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${type}-message`);
        messageDiv.textContent = content;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async processUserMessage(message) {
        // Simulate AI response
        const response = await this.getAIResponse(message);
        this.addMessage('bot', response);
    }

    async getAIResponse(message) {
        const greetings = {
            morning: ['good morning', 'morning', 'ohayo'],
            afternoon: ['good afternoon'],
            evening: ['good evening'],
            night: ['good night', 'night'],
            general: ['hello', 'hi', 'hey', 'hola', 'salama', 'jambo', 'muraho', 'bonjour', 'mwaramutse', 'mwiriwe']
        };

        const lowercaseMessage = message.toLowerCase().trim();

        // Handle greetings based on time of day
        const hour = new Date().getHours();
        let timeBasedGreeting = '';

        if (hour >= 5 && hour < 12) {
            timeBasedGreeting = 'Good morning! ';
        } else if (hour >= 12 && hour < 17) {
            timeBasedGreeting = 'Good afternoon! ';
        } else if (hour >= 17 && hour < 22) {
            timeBasedGreeting = 'Good evening! ';
        } else {
            timeBasedGreeting = 'Good night! ';
        }

        // Check if message is a greeting
        const isGreeting = Object.values(greetings).some(greetingArray => 
            greetingArray.some(greeting => lowercaseMessage.includes(greeting))
        );

        if (isGreeting) {
            return `${timeBasedGreeting}I'm your loan application assistant. How can I help you today? Type "help" to see what I can explain.`;
        }

        // Rest of the existing response logic
        const loanInfo = {
            'credit score': 'Credit score is a number between 300-850 that represents your creditworthiness. A higher score (700+) indicates better credit history and increases your loan approval chances. Factors affecting credit score include payment history, debt levels, and credit history length.',
            
            'collateral': 'Collateral is an asset (like property, vehicles, or equipment) that you pledge to secure your loan. If you fail to repay the loan, the lender can claim this asset. Having collateral often improves your chances of loan approval and may get you better interest rates.',
            
            'default rate': 'Default rate shows the percentage of previous loans that weren\'t repaid on time. A rate of 30% means 30% of previous loans were defaulted. Lower default rates (ideally 0%) increase your chances of loan approval.',
            
            'unpaid loans': 'Unpaid loans refer to any existing loans that haven\'t been fully repaid. Having unpaid loans may affect your ability to get new loans as it indicates higher risk for lenders.',
            
            'business registration': 'Business registration means your business is officially registered with the government. Registered businesses often have better chances of loan approval as they\'re considered more credible.',
            
            'business age': 'Business age refers to how long your business has been operating. Older businesses (typically over 12 months) are often considered more stable and may have better approval chances.',
            
            'revenue': 'Monthly revenue is your business\'s average monthly income before expenses. Higher revenue shows better ability to repay loans.',
            
            'loan amount': 'The loan amount ranges from 300,000 to 10,000,000 Frw. Request an amount that you can realistically repay based on your monthly revenue.',
            
            'eligibility': 'Loan eligibility is determined by factors including:\n- Credit score\n- Business age\n- Monthly revenue\n- Collateral availability\n- Default rate\n- Business registration status',
            
            'help': 'I can explain various aspects of the loan application system. You can ask about:\n- Credit Score\n- Collateral\n- Default Rate\n- Unpaid Loans\n- Business Registration\n- Business Age\n- Revenue Requirements\n- Loan Amount\n- Eligibility Criteria',
        };

        // Check for exact matches first
        for (const [key, value] of Object.entries(loanInfo)) {
            if (lowercaseMessage.includes(key)) {
                return value;
            }
        }

        // Handle other queries
        if (lowercaseMessage.includes('thank')) {
            return 'You\'re welcome! Let me know if you have any other questions.';
        }

        if (lowercaseMessage.includes('explain') || lowercaseMessage.includes('what is')) {
            return 'I can explain various loan terms. Try asking specifically about credit score, collateral, default rate, or other loan-related terms.';
        }

        return "I'm not sure about that. For best results, ask about specific terms like 'credit score', 'collateral', 'default rate', etc. Or type 'help' to see all topics I can explain.";
    }
}
