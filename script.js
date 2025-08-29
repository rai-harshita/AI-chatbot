class RestaurantChatbot {
    constructor() {
        this.currentLanguage = 'en';
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.languageSelect = document.getElementById('languageSelect');
        this.reservations = this.loadReservations();
        this.orders = this.loadOrders();
        this.currentCustomerName = null;
        this.waitingForName = false;
        this.pendingAction = null;
        
        this.menu = {
            pizza: { name: 'Pizza', price: 12, available: true, veg: true, popular: true, halal: true },
            burger: { name: 'Burger', price: 8, available: true, veg: false, popular: true, halal: false },
            pasta: { name: 'Pasta', price: 10, available: true, veg: true, glutenFree: false, halal: true },
            coke: { name: 'Coke', price: 3, available: true, veg: true, vegan: true, halal: true },
            salad: { name: 'Salad', price: 6, available: true, veg: true, vegan: true, glutenFree: true, halal: true },
            vegBurger: { name: 'Veg Burger', price: 9, available: true, veg: true, vegan: true, halal: true },
            glutenFreePasta: { name: 'Gluten-Free Pasta', price: 12, available: true, veg: true, glutenFree: true, halal: true },
            garlicBread: { name: 'Garlic Bread', price: 4, available: true, veg: true, halal: true }
        };
        
        this.offers = {
            en: "🍔 Buy 1 Get 1 Free on Burgers today! 🎉 20% off on Pizza orders above $20!",
            hi: "🍔 आज बर्गर पर खरीदें 1 पाएं 1 मुफ्त! 🎉 $20 से ऊपर पिज़्ज़ा ऑर्डर पर 20% छूट!",
            es: "🍔 ¡Compra 1 y llévate 1 gratis en hamburguesas hoy! 🎉 ¡20% de descuento en pedidos de pizza superiores a $20!",
            fr: "🍔 Achetez 1, obtenez 1 gratuit sur les burgers aujourd'hui! 🎉 20% de réduction sur les commandes de pizza supérieures à 20$!",
            de: "🍔 Kaufe 1, bekomme 1 gratis bei Burgern heute! 🎉 20% Rabatt auf Pizza-Bestellungen über $20!"
        };
        
        this.loyaltyPoints = this.loadLoyaltyPoints();
        this.lastOrder = null;
        
        this.orderStatuses = ['confirmed', 'preparing', 'ready', 'delivered'];
        this.customerFeedback = [];
        
        this.responses = {
            en: {
                welcome: "Welcome! I can help with menu, reservations, orders, dietary preferences, recommendations, and feedback. What would you like?",
                menu: "Our menu: Pizza ($12), Burger ($8), Pasta ($10), Coke ($3), Salad ($6). All items available!",
                hours: "We're open Monday-Sunday: 11:00 AM - 10:00 PM. Kitchen closes at 9:30 PM.",
                location: "We're at 123 Main Street, Downtown. Phone: (555) 123-4567. Free parking available.",
                reservation_success: "✅ Table reserved successfully!",
                order_success: "✅ Order placed successfully!",
                ask_name: "May I know your name, please?",
                offers: "🍔 Buy 1 Get 1 Free on Burgers today! 🎉 20% off on Pizza orders above $20!",
                delivery: "Yes, we deliver within 5km radius. Delivery charge: $3. Free delivery on orders above $25.",
                parking: "Free parking available behind the building. Valet service available on weekends.",
                payment: "We accept Card, UPI, Cash, and Digital Wallets. Choose your payment method.",
                cancel_success: "✅ Cancelled successfully!",
                track_order: "Your order is being prepared. Estimated time: 20 minutes. 👨‍🍳",
                feedback_request: "How was your experience today? Please rate us 1-5 ⭐",
                loyalty_earned: "You've earned 10 loyalty points! 🎉 Total points: ",
                halal: "🕌 Halal options: Pizza, Pasta, Salad, Veg Burger, Coke, Garlic Bread. All certified halal!",
                recommendations: "🌟 Popular dishes: Pizza & Burger! Chef's special: Gluten-Free Pasta with herbs.",
                vegetarian: "🥗 Vegetarian options: Pizza, Pasta, Salad, Veg Burger, Coke. All fresh and delicious!",
                vegan: "🌱 Vegan options: Salad, Veg Burger, Coke. Made with plant-based ingredients!",
                glutenFree: "🌾 Gluten-free options: Salad, Gluten-Free Pasta. Safe for celiac customers!",
                escalation: "I understand your frustration. Let me connect you with our manager. Please hold on...",
                feedback_thanks: "Thank you for your feedback! We appreciate your review and will use it to improve.",
                default: "I can help with menu, reservations, orders, dietary needs, recommendations, and feedback. What do you need?"
            },
            hi: {
                welcome: "स्वागत है! मैं मेन्यू, बुकिंग, ऑर्डर, आहार प्राथमिकताएं, सुझाव और फीडबैक में मदद कर सकता हूं।",
                menu: "हमारा मेन्यू: पिज़्ज़ा (₹300), बर्गर (₹200), पास्ता (₹250), कोक (₹80), सलाद (₹150)। सभी उपलब्ध हैं!",
                hours: "हम सोमवार-रविवार: सुबह 11:00 - रात 10:00 बजे तक खुले हैं। रसोई 9:30 बजे बंद हो जाती है।",
                location: "हम 123 मेन स्ट्रीट, डाउनटाउन में हैं। फोन: (555) 123-4567। मुफ्त पार्किंग उपलब्ध।",
                reservation_success: "✅ टेबल सफलतापूर्वक बुक हो गई!",
                order_success: "✅ ऑर्डर सफलतापूर्वक दिया गया!",
                ask_name: "कृपया अपना नाम बताएं?",
                offers: "🍔 आज बर्गर पर खरीदें 1 पाएं 1 मुफ्त! 🎉 $20 से ऊपर पिज़्ज़ा ऑर्डर पर 20% छूट!",
                delivery: "हाँ, हम 5 किमी के दायरे में डिलीवरी करते हैं। डिलीवरी चार्ज: $3। $25 से ऊपर मुफ्त डिलीवरी।",
                parking: "बिल्डिंग के पीछे मुफ्त पार्किंग उपलब्ध। वीकेंड पर वैलेट सेवा उपलब्ध।",
                payment: "हम कार्ड, UPI, कैश और डिजिटल वॉलेट स्वीकार करते हैं। अपना पेमेंट मेथड चुनें।",
                cancel_success: "✅ सफलतापूर्वक रद्द कर दिया गया!",
                track_order: "आपका ऑर्डर तैयार हो रहा है। अनुमानित समय: 20 मिनट। 👨‍🍳",
                feedback_request: "आज आपका अनुभव कैसा रहा? कृपया हमें 1-5 ⭐ रेटिंग दें।",
                loyalty_earned: "आपने 10 लॉयल्टी पॉइंट्स कमाए हैं! 🎉 कुल पॉइंट्स: ",
                halal: "🕌 हलाल विकल्प: पिज़्ज़ा, पास्ता, सलाद, वेज बर्गर, कोक, गार्लिक ब्रेड। सभी प्रमाणित हलाल!",
                recommendations: "🌟 लोकप्रिय व्यंजन: पिज़्ज़ा और बर्गर! शेफ स्पेशल: ग्लूटन-फ्री पास्ता।",
                vegetarian: "🥗 शाकाहारी विकल्प: पिज़्ज़ा, पास्ता, सलाद, वेज बर्गर, कोक। सभी ताज़ा!",
                vegan: "🌱 वीगन विकल्प: सलाद, वेज बर्गर, कोक। पूर्णतः पौधे आधारित!",
                glutenFree: "🌾 ग्लूटन-फ्री विकल्प: सलाद, ग्लूटन-फ्री पास्ता। सुरक्षित!",
                escalation: "मैं आपकी परेशानी समझता हूं। मैं आपको हमारे मैनेजर से जोड़ता हूं।",
                feedback_thanks: "आपके फीडबैक के लिए धन्यवाद! हम इसका उपयोग सुधार के लिए करेंगे।",
                default: "मैं मेन्यू, बुकिंग, ऑर्डर, आहार, सुझाव और फीडबैक में मदद कर सकता हूं।"
            },
            es: {
                welcome: "¡Bienvenido! Puedo ayudar con menú, reservas, pedidos, preferencias dietéticas, recomendaciones y comentarios.",
                menu: "Nuestro menú: Pizza ($12), Hamburguesa ($8), Pasta ($10), Coca ($3), Ensalada ($6). ¡Todo disponible!",
                hours: "Abrimos Lunes-Domingo: 11:00 AM - 10:00 PM. La cocina cierra a las 9:30 PM.",
                location: "Estamos en 123 Main Street, Centro. Teléfono: (555) 123-4567. Estacionamiento gratuito.",
                reservation_success: "✅ ¡Mesa reservada exitosamente!",
                order_success: "✅ ¡Pedido realizado exitosamente!",
                ask_name: "¿Puedo saber su nombre, por favor?",
                offers: "🍔 ¡Compra 1 y llévate 1 gratis en hamburguesas hoy! 🎉 ¡20% de descuento en pedidos de pizza superiores a $20!",
                delivery: "Sí, entregamos dentro de un radio de 5km. Cargo de entrega: $3. Entrega gratuita en pedidos superiores a $25.",
                parking: "Estacionamiento gratuito disponible detrás del edificio. Servicio de valet disponible los fines de semana.",
                payment: "Aceptamos Tarjeta, UPI, Efectivo y Billeteras Digitales. Elija su método de pago.",
                cancel_success: "✅ ¡Cancelado exitosamente!",
                track_order: "Su pedido se está preparando. Tiempo estimado: 20 minutos. 👨‍🍳",
                feedback_request: "¿Cómo fue su experiencia hoy? Por favor califíquenos 1-5 ⭐",
                loyalty_earned: "¡Has ganado 10 puntos de lealtad! 🎉 Puntos totales: ",
                halal: "🕌 Opciones halal: Pizza, Pasta, Ensalada, Hamburguesa Vegetal, Coca, Pan de Ajo. ¡Todo certificado halal!",
                recommendations: "🌟 Platos populares: ¡Pizza y Hamburguesa! Especial del chef: Pasta sin gluten.",
                vegetarian: "🥗 Opciones vegetarianas: Pizza, Pasta, Ensalada, Hamburguesa Vegetal, Coca.",
                vegan: "🌱 Opciones veganas: Ensalada, Hamburguesa Vegetal, Coca. ¡Ingredientes vegetales!",
                glutenFree: "🌾 Sin gluten: Ensalada, Pasta sin gluten. ¡Seguro para celíacos!",
                escalation: "Entiendo su frustración. Le conecto con nuestro gerente. Por favor espere...",
                feedback_thanks: "¡Gracias por sus comentarios! Apreciamos su opinión y la usaremos para mejorar.",
                default: "Puedo ayudar con menú, reservas, pedidos, dieta, recomendaciones y comentarios."
            },
            fr: {
                welcome: "Bienvenue! Je peux aider avec menu, réservations, commandes, préférences alimentaires, recommandations et avis.",
                menu: "Notre menu: Pizza (12$), Burger (8$), Pâtes (10$), Coca (3$), Salade (6$). Tout disponible!",
                hours: "Nous sommes ouverts Lundi-Dimanche: 11h00 - 22h00. La cuisine ferme à 21h30.",
                location: "Nous sommes au 123 Main Street, Centre-ville. Téléphone: (555) 123-4567. Parking gratuit.",
                reservation_success: "✅ Table réservée avec succès!",
                order_success: "✅ Commande passée avec succès!",
                ask_name: "Puis-je connaître votre nom, s'il vous plaît?",
                offers: "🍔 Achetez 1, obtenez 1 gratuit sur les burgers aujourd'hui! 🎉 20% de réduction sur les commandes de pizza supérieures à 20$!",
                delivery: "Oui, nous livrons dans un rayon de 5km. Frais de livraison: 3$. Livraison gratuite sur les commandes supérieures à 25$.",
                parking: "Parking gratuit disponible derrière le bâtiment. Service de voiturier disponible le week-end.",
                payment: "Nous acceptons Carte, UPI, Espèces et Portefeuilles Numériques. Choisissez votre méthode de paiement.",
                cancel_success: "✅ Annulé avec succès!",
                track_order: "Votre commande est en préparation. Temps estimé: 20 minutes. 👨‍🍳",
                feedback_request: "Comment était votre expérience aujourd'hui? Veuillez nous noter 1-5 ⭐",
                loyalty_earned: "Vous avez gagné 10 points de fidélité! 🎉 Points totaux: ",
                halal: "🕌 Options halal: Pizza, Pâtes, Salade, Burger Végétal, Coca, Pain à l'Ail. Tout certifié halal!",
                recommendations: "🌟 Plats populaires: Pizza et Burger! Spécial du chef: Pâtes sans gluten.",
                vegetarian: "🥗 Options végétariennes: Pizza, Pâtes, Salade, Burger Végétal, Coca.",
                vegan: "🌱 Options véganes: Salade, Burger Végétal, Coca. Ingrédients végétaux!",
                glutenFree: "🌾 Sans gluten: Salade, Pâtes sans gluten. Sûr pour les cœliaques!",
                escalation: "Je comprends votre frustration. Je vous connecte avec notre manager.",
                feedback_thanks: "Merci pour vos commentaires! Nous apprécions votre avis.",
                default: "Je peux aider avec menu, réservations, commandes, régime, recommandations et avis."
            },
            de: {
                welcome: "Willkommen! Ich kann bei Menü, Reservierungen, Bestellungen, Ernährungspräferenzen, Empfehlungen und Feedback helfen.",
                menu: "Unser Menü: Pizza (12$), Burger (8$), Pasta (10$), Cola (3$), Salat (6$). Alles verfügbar!",
                hours: "Wir haben Montag-Sonntag geöffnet: 11:00 - 22:00 Uhr. Die Küche schließt um 21:30 Uhr.",
                location: "Wir sind in der 123 Main Street, Innenstadt. Telefon: (555) 123-4567. Kostenlose Parkplätze.",
                reservation_success: "✅ Tisch erfolgreich reserviert!",
                order_success: "✅ Bestellung erfolgreich aufgegeben!",
                ask_name: "Darf ich Ihren Namen erfahren, bitte?",
                offers: "🍔 Kaufe 1, bekomme 1 gratis bei Burgern heute! 🎉 20% Rabatt auf Pizza-Bestellungen über $20!",
                delivery: "Ja, wir liefern im Umkreis von 5km. Liefergebühr: $3. Kostenlose Lieferung bei Bestellungen über $25.",
                parking: "Kostenlose Parkplätze hinter dem Gebäude verfügbar. Parkservice am Wochenende verfügbar.",
                payment: "Wir akzeptieren Karte, UPI, Bargeld und Digitale Geldbörsen. Wählen Sie Ihre Zahlungsmethode.",
                cancel_success: "✅ Erfolgreich storniert!",
                track_order: "Ihre Bestellung wird zubereitet. Geschätzte Zeit: 20 Minuten. 👨‍🍳",
                feedback_request: "Wie war Ihre Erfahrung heute? Bitte bewerten Sie uns 1-5 ⭐",
                loyalty_earned: "Sie haben 10 Treuepunkte verdient! 🎉 Gesamtpunkte: ",
                halal: "🕌 Halal-Optionen: Pizza, Pasta, Salat, Veggie-Burger, Cola, Knoblauchbrot. Alles halal-zertifiziert!",
                recommendations: "🌟 Beliebte Gerichte: Pizza und Burger! Chefspezialität: Glutenfreie Pasta.",
                vegetarian: "🥗 Vegetarische Optionen: Pizza, Pasta, Salat, Veggie-Burger, Cola.",
                vegan: "🌱 Vegane Optionen: Salat, Veggie-Burger, Cola. Pflanzliche Zutaten!",
                glutenFree: "🌾 Glutenfrei: Salat, Glutenfreie Pasta. Sicher für Zöliakie!",
                escalation: "Ich verstehe Ihre Frustration. Ich verbinde Sie mit unserem Manager.",
                feedback_thanks: "Danke für Ihr Feedback! Wir schätzen Ihre Meinung.",
                default: "Ich kann bei Menü, Reservierungen, Bestellungen, Ernährung, Empfehlungen und Feedback helfen."
            }
        };
        
        this.init();
    }
    
    init() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        this.languageSelect.addEventListener('change', (e) => {
            this.currentLanguage = e.target.value;
            this.addBotMessage(this.responses[this.currentLanguage].welcome);
        });
        
        // Welcome message
        this.addBotMessage(this.responses[this.currentLanguage].welcome);
    }
    
    sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        this.addUserMessage(message);
        this.messageInput.value = '';
        
        // Show typing indicator
        this.showTyping();
        
        // Simulate response delay
        setTimeout(() => {
            this.hideTyping();
            const response = this.generateResponse(message);
            this.addBotMessage(response);
        }, 1000);
    }
    
    addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.textContent = message;
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    addBotMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.textContent = message;
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <span>Typing</span>
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    hideTyping() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    detectLanguage(message) {
        const hindiPattern = /[ऀ-ॿ]/;
        const spanishWords = ['hola', 'gracias', 'por favor', 'quiero', 'mesa'];
        const frenchWords = ['bonjour', 'merci', 'voulez', 'table', 'réservation'];
        const germanWords = ['hallo', 'danke', 'bitte', 'tisch', 'reservierung'];
        
        if (hindiPattern.test(message)) return 'hi';
        if (spanishWords.some(word => message.toLowerCase().includes(word))) return 'es';
        if (frenchWords.some(word => message.toLowerCase().includes(word))) return 'fr';
        if (germanWords.some(word => message.toLowerCase().includes(word))) return 'de';
        return 'en';
    }
    
    generateResponse(message) {
        // Auto-detect language if not manually set
        const detectedLang = this.detectLanguage(message);
        if (detectedLang !== 'en' && this.currentLanguage === 'en') {
            this.currentLanguage = detectedLang;
            this.languageSelect.value = detectedLang;
        }
        
        const lowerMessage = message.toLowerCase();
        const responses = this.responses[this.currentLanguage];
        
        // Handle name input if waiting for name
        if (this.waitingForName) {
            return this.handleNameInput(message);
        }
        
        // Check for reservations
        if (this.isReservationRequest(message)) {
            return this.handleReservationRequest(message);
        }
        
        // Check for orders
        if (this.isOrderRequest(message)) {
            return this.handleOrderRequest(message);
        }
        
        // Sentiment detection
        if (this.detectNegativeSentiment(message)) {
            return responses.escalation;
        }
        
        // Order tracking
        if (this.isOrderTrackingRequest(message)) {
            return this.handleOrderTracking(message);
        }
        
        // Feedback collection
        if (this.isFeedbackRequest(message)) {
            return this.handleFeedback(message);
        }
        
        // Admin commands
        if (this.isAdminCommand(message)) {
            return this.handleAdminCommand(message);
        }
        
        // Special queries
        if (this.isSpecialQuery(message)) {
            return this.handleSpecialQuery(message);
        }
        
        // Dietary preferences
        if (this.isDietaryRequest(message)) {
            return this.handleDietaryPreferences(message);
        }
        
        // Recommendations
        if (lowerMessage.includes('recommend') || lowerMessage.includes('popular') || lowerMessage.includes('suggest') || lowerMessage.includes('सुझाव')) {
            return responses.recommendations;
        }
        
        // Menu queries
        if (lowerMessage.includes('menu') || lowerMessage.includes('food') || lowerMessage.includes('मेन्यू') || lowerMessage.includes('पिज़्ज़ा')) {
            return responses.menu;
        }
        
        // Hours
        if (lowerMessage.includes('hour') || lowerMessage.includes('open') || lowerMessage.includes('समय')) {
            return responses.hours;
        }
        
        // Location
        if (lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('कहां')) {
            return responses.location;
        }
        
        // Greetings
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('नमस्ते')) {
            return responses.welcome;
        }
        
        return responses.default;
    }
    
    isReservationRequest(message) {
        const reservationKeywords = ['book', 'reserve', 'table', 'टेबल', 'बुक'];
        return reservationKeywords.some(keyword => message.toLowerCase().includes(keyword));
    }
    
    isOrderRequest(message) {
        const orderKeywords = ['order', 'want', 'buy', 'ऑर्डर', 'चाहिए'];
        const menuItems = Object.keys(this.menu);
        return orderKeywords.some(keyword => message.toLowerCase().includes(keyword)) ||
               menuItems.some(item => message.toLowerCase().includes(item));
    }
    
    handleReservationRequest(message) {
        const nameMatch = message.match(/name\s+is\s+(\w+)|my\s+name\s+is\s+(\w+)|i\s+am\s+(\w+)|मेरा\s+नाम\s+(\w+)/i);
        
        if (!nameMatch && !this.currentCustomerName) {
            this.waitingForName = true;
            this.pendingAction = { type: 'reservation', message };
            return this.responses[this.currentLanguage].ask_name;
        }
        
        return this.handleReservation(message);
    }
    
    handleReservation(message) {
        const nameMatch = message.match(/name\s+is\s+(\w+)|my\s+name\s+is\s+(\w+)|i\s+am\s+(\w+)|मेरा\s+नाम\s+(\w+)/i);
        const timeMatch = message.match(/(\d{1,2})\s*(pm|am|:रात|सुबह)/i);
        const peopleMatch = message.match(/(\d+)\s*(people|person|लोग)/i);
        const dateMatch = message.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})|today|tomorrow|आज|कल/i);
        
        const name = nameMatch ? (nameMatch[1] || nameMatch[2] || nameMatch[3] || nameMatch[4]) : 'Guest';
        const time = timeMatch ? timeMatch[1] + (timeMatch[2].includes('pm') || timeMatch[2].includes('रात') ? ' PM' : ' AM') : '7 PM';
        const people = peopleMatch ? peopleMatch[1] : '2';
        const date = dateMatch ? (dateMatch[0].includes('/') ? dateMatch[0] : new Date().toLocaleDateString()) : new Date().toLocaleDateString();
        
        const reservation = { name, people, date, time, id: Date.now() };
        this.reservations.push(reservation);
        this.saveReservations();
        
        const responses = this.responses[this.currentLanguage];
        return `${responses.reservation_success} ${name}, table for ${people} on ${date} at ${time}.`;
    }
    
    handleOrderRequest(message) {
        const nameMatch = message.match(/name\s+is\s+(\w+)|my\s+name\s+is\s+(\w+)|i\s+am\s+(\w+)|मेरा\s+नाम\s+(\w+)/i);
        
        if (!nameMatch && !this.currentCustomerName) {
            this.waitingForName = true;
            this.pendingAction = { type: 'order', message };
            return this.responses[this.currentLanguage].ask_name;
        }
        
        return this.handleOrder(message);
    }
    
    handleOrder(message) {
        const nameMatch = message.match(/name\s+is\s+(\w+)|my\s+name\s+is\s+(\w+)|i\s+am\s+(\w+)|मेरा\s+नाम\s+(\w+)/i);
        const customerName = nameMatch ? (nameMatch[1] || nameMatch[2] || nameMatch[3] || nameMatch[4]) : (this.currentCustomerName || 'Guest');
        
        const orderItems = [];
        let total = 0;
        
        Object.keys(this.menu).forEach(item => {
            const regex = new RegExp(`(\\d+)\\s*${item}`, 'i');
            const match = message.match(regex);
            if (match || message.toLowerCase().includes(item)) {
                const quantity = match ? parseInt(match[1]) : 1;
                orderItems.push(`${quantity} ${this.menu[item].name}`);
                total += quantity * this.menu[item].price;
            }
        });
        
        if (orderItems.length > 0) {
            const order = { customerName, items: orderItems, total, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString(), id: Date.now() };
            this.orders.push(order);
            this.lastOrder = order;
            this.saveOrders();
            this.updateLoyaltyPoints(customerName, Math.floor(total));
            
            const responses = this.responses[this.currentLanguage];
            let response = `${responses.order_success} ${customerName}, ${orderItems.join(', ')}. Total: $${total}`;
            
            // Add personalized recommendations
            if (orderItems.some(item => item.includes('Pizza'))) {
                response += ` Would you like to add Coke or Garlic Bread with your pizza? 🍕🥤`;
            }
            
            return response;
        }
        
        return this.responses[this.currentLanguage].menu;
    }
    
    detectNegativeSentiment(message) {
        const negativeWords = ['angry', 'frustrated', 'terrible', 'awful', 'worst', 'hate', 'disgusting', 'गुस्सा', 'बुरा', 'खराब'];
        return negativeWords.some(word => message.toLowerCase().includes(word));
    }
    
    isOrderTrackingRequest(message) {
        const trackingKeywords = ['track', 'status', 'where', 'ready', 'स्थिति', 'कहां'];
        return trackingKeywords.some(keyword => message.toLowerCase().includes(keyword)) && 
               (message.toLowerCase().includes('order') || message.toLowerCase().includes('ऑर्डर'));
    }
    
    handleOrderTracking(message) {
        if (this.orders.length === 0) {
            return "No active orders found. Please place an order first.";
        }
        
        const lastOrder = this.orders[this.orders.length - 1];
        const randomStatus = this.orderStatuses[Math.floor(Math.random() * this.orderStatuses.length)];
        
        const statusMessages = {
            en: {
                confirmed: "📋 Your order is confirmed and being processed.",
                preparing: "👨‍🍳 Your order is being prepared in the kitchen.",
                ready: "✅ Your order is ready for pickup/delivery!",
                delivered: "🚚 Your order has been delivered. Enjoy your meal!"
            },
            hi: {
                confirmed: "📋 आपका ऑर्डर कन्फर्म हो गया है और प्रोसेस हो रहा है।",
                preparing: "👨‍🍳 आपका ऑर्डर रसोई में तैयार हो रहा है।",
                ready: "✅ आपका ऑर्डर तैयार है!",
                delivered: "🚚 आपका ऑर्डर डिलीवर हो गया है। खाना एन्जॉय करें!"
            }
        };
        
        const lang = this.currentLanguage === 'hi' ? 'hi' : 'en';
        return statusMessages[lang][randomStatus] || statusMessages.en[randomStatus];
    }
    
    isFeedbackRequest(message) {
        const feedbackKeywords = ['feedback', 'review', 'rating', 'experience', 'service', 'फीडबैक', 'समीक्षा'];
        return feedbackKeywords.some(keyword => message.toLowerCase().includes(keyword));
    }
    
    handleFeedback(message) {
        this.customerFeedback.push({
            message: message,
            timestamp: new Date().toISOString(),
            language: this.currentLanguage
        });
        
        return this.responses[this.currentLanguage].feedback_thanks;
    }
    
    isDietaryRequest(message) {
        const dietaryKeywords = ['vegetarian', 'vegan', 'gluten', 'dairy', 'शाकाहारी', 'वीगन', 'ग्लूटन'];
        return dietaryKeywords.some(keyword => message.toLowerCase().includes(keyword));
    }
    
    handleDietaryPreferences(message) {
        const responses = this.responses[this.currentLanguage];
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('vegetarian') || lowerMessage.includes('शाकाहारी')) {
            return responses.vegetarian;
        } else if (lowerMessage.includes('vegan') || lowerMessage.includes('वीगन')) {
            return responses.vegan;
        } else if (lowerMessage.includes('gluten') || lowerMessage.includes('ग्लूटन')) {
            return responses.glutenFree;
        } else if (lowerMessage.includes('halal') || lowerMessage.includes('हलाल')) {
            return responses.halal;
        }
        
        return responses.menu;
    }
    
    loadReservations() {
        try {
            const saved = localStorage.getItem('restaurantReservations');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    }
    
    saveReservations() {
        try {
            localStorage.setItem('restaurantReservations', JSON.stringify(this.reservations));
            this.downloadFile('reservations.txt', this.formatReservationsForFile());
        } catch (e) {
            console.error('Error saving reservations:', e);
        }
    }
    
    loadOrders() {
        try {
            const saved = localStorage.getItem('restaurantOrders');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    }
    
    saveOrders() {
        try {
            localStorage.setItem('restaurantOrders', JSON.stringify(this.orders));
            this.downloadFile('orders.txt', this.formatOrdersForFile());
        } catch (e) {
            console.error('Error saving orders:', e);
        }
    }
    
    formatReservationsForFile() {
        let content = 'RESTAURANT RESERVATIONS\n';
        content += '========================\n\n';
        this.reservations.forEach(res => {
            content += `Name: ${res.name}\n`;
            content += `People: ${res.people}\n`;
            content += `Date: ${res.date}\n`;
            content += `Time: ${res.time}\n`;
            content += `ID: ${res.id}\n`;
            content += '-------------------\n';
        });
        return content;
    }
    
    formatOrdersForFile() {
        let content = 'RESTAURANT ORDERS\n';
        content += '=================\n\n';
        this.orders.forEach(order => {
            content += `Customer: ${order.customerName}\n`;
            content += `Items: ${order.items.join(', ')}\n`;
            content += `Total: $${order.total}\n`;
            content += `Date: ${order.date}\n`;
            content += `Time: ${order.time}\n`;
            content += `ID: ${order.id}\n`;
            content += '-------------------\n';
        });
        return content;
    }
    
    downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }
    
    handleNameInput(message) {
        // Extract name from the message
        const nameMatch = message.match(/^([a-zA-Z\s]+)$/) || message.match(/name\s+is\s+(\w+)|my\s+name\s+is\s+(\w+)|i\s+am\s+(\w+)|मेरा\s+नाम\s+(\w+)/i);
        
        if (nameMatch) {
            this.currentCustomerName = nameMatch[1] || nameMatch[2] || nameMatch[3] || nameMatch[4] || message.trim();
            this.waitingForName = false;
            
            // Process the pending action
            if (this.pendingAction) {
                const result = this.pendingAction.type === 'reservation' 
                    ? this.handleReservation(this.pendingAction.message)
                    : this.handleOrder(this.pendingAction.message);
                this.pendingAction = null;
                return result;
            }
        }
        
        return this.responses[this.currentLanguage].ask_name;
    }
    
    isAdminCommand(message) {
        const adminKeywords = ['show reservations', 'show orders', 'cancel', 'daily report'];
        return adminKeywords.some(keyword => message.toLowerCase().includes(keyword));
    }
    
    handleAdminCommand(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('show reservations')) {
            if (this.reservations.length === 0) return 'No reservations found.';
            let result = 'Current Reservations:\n';
            this.reservations.forEach((res, i) => {
                result += `${i+1}. ${res.name} reserved table for ${res.people} on ${res.date} at ${res.time}\n`;
            });
            return result;
        }
        
        if (lowerMessage.includes('show orders')) {
            if (this.orders.length === 0) return 'No orders found.';
            let result = 'Current Orders:\n';
            this.orders.forEach((order, i) => {
                result += `${i+1}. ${order.customerName}: ${order.items.join(', ')} - $${order.total}\n`;
            });
            return result;
        }
        
        if (lowerMessage.includes('cancel')) {
            const nameMatch = message.match(/cancel\s+(\w+)/i);
            if (nameMatch) {
                const name = nameMatch[1];
                this.reservations = this.reservations.filter(res => res.name.toLowerCase() !== name.toLowerCase());
                this.orders = this.orders.filter(order => order.customerName.toLowerCase() !== name.toLowerCase());
                this.saveReservations();
                this.saveOrders();
                return this.responses[this.currentLanguage].cancel_success;
            }
        }
        
        if (lowerMessage.includes('daily report')) {
            return `Daily Report:\nReservations: ${this.reservations.length}\nOrders: ${this.orders.length}\nTotal Revenue: $${this.orders.reduce((sum, order) => sum + order.total, 0)}`;
        }
        
        return this.responses[this.currentLanguage].default;
    }
    
    isSpecialQuery(message) {
        const specialKeywords = ['offer', 'deal', 'discount', 'deliver', 'parking', 'payment', 'track', 'feedback', 'rate'];
        return specialKeywords.some(keyword => message.toLowerCase().includes(keyword));
    }
    
    handleSpecialQuery(message) {
        const lowerMessage = message.toLowerCase();
        const responses = this.responses[this.currentLanguage];
        
        if (lowerMessage.includes('offer') || lowerMessage.includes('deal') || lowerMessage.includes('discount')) {
            return responses.offers;
        }
        
        if (lowerMessage.includes('deliver')) {
            return responses.delivery;
        }
        
        if (lowerMessage.includes('parking')) {
            return responses.parking;
        }
        
        if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
            return responses.payment;
        }
        
        if (lowerMessage.includes('track')) {
            return responses.track_order;
        }
        
        if (lowerMessage.includes('feedback') || lowerMessage.includes('rate')) {
            return responses.feedback_request;
        }
        
        return responses.default;
    }
    
    loadLoyaltyPoints() {
        try {
            const saved = localStorage.getItem('loyaltyPoints');
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    }
    
    updateLoyaltyPoints(customerName, points) {
        if (!this.loyaltyPoints[customerName]) {
            this.loyaltyPoints[customerName] = 0;
        }
        this.loyaltyPoints[customerName] += points;
        localStorage.setItem('loyaltyPoints', JSON.stringify(this.loyaltyPoints));
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Function to start chat (hide cover page and show chatbot)
function startChat() {
    document.getElementById('coverPage').style.display = 'none';
    document.getElementById('chatContainer').style.display = 'flex';
    // Initialize chatbot after showing the container
    new RestaurantChatbot();
}

// Initialize the page when loaded
document.addEventListener('DOMContentLoaded', () => {
    // Cover page is shown by default, chatbot initializes when user clicks start
});