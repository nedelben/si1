document.addEventListener('DOMContentLoaded', function() {
    const shippingForm = document.getElementById('shippingForm');
    const resultsSection = document.getElementById('resultsSection');
    const resultsContainer = document.getElementById('resultsContainer');
    const routeSummary = document.getElementById('routeSummary');
    const packageSummary = document.getElementById('packageSummary');
    const sortPriceBtn = document.getElementById('sortPrice');
    const sortSpeedBtn = document.getElementById('sortSpeed');
    const sortReliableBtn = document.getElementById('sortReliable');
    
    // Mock data for shipping companies
    const shippingCompanies = [
        {
            id: 1,
            name: "EXO1",
            logo: "https://via.placeholder.com/50x50?text=SP",
            basePrice: 25,
            weightMultiplier: 1.2,
            distanceMultiplier: 0.05,
            deliveryTime: 3,
            reliability: 4,
            features: ["تتبع الشحنة", "إشعارات عبر البريد", "خزائن الشحن"],
            supportsCOD: true,
            supportsTracking: true,
            supportsDoorDelivery: true,
            supportsProof: true
        },
        {
            id: 2,
            name: "EXO2",
            logo: "https://via.placeholder.com/50x50?text=AR",
            basePrice: 35,
            weightMultiplier: 1.5,
            distanceMultiplier: 0.08,
            deliveryTime: 2,
            reliability: 4.5,
            features: ["توصيل سريع", "تتبع الشحنة", "إشعارات عبر SMS", "خدمة الاستلام"],
            supportsCOD: true,
            supportsTracking: true,
            supportsDoorDelivery: true,
            supportsProof: true
        },
        {
            id: 3,
            name: "EXO3",
            logo: "https://via.placeholder.com/50x50?text=DH",
            basePrice: 50,
            weightMultiplier: 1.8,
            distanceMultiplier: 0.1,
            deliveryTime: 1,
            reliability: 5,
            features: ["شحن دولي", "خدمة متميزة", "تتبع الشحنة", "تسليم بالتوقيع"],
            supportsCOD: false,
            supportsTracking: true,
            supportsDoorDelivery: true,
            supportsProof: true
        },
        {
            id: 4,
            name: "EXO4",
            logo: "https://via.placeholder.com/50x50?text=NQ",
            basePrice: 20,
            weightMultiplier: 1.1,
            distanceMultiplier: 0.04,
            deliveryTime: 4,
            reliability: 3.5,
            features: ["خدمة اقتصادية", "تتبع الشحنة"],
            supportsCOD: true,
            supportsTracking: true,
            supportsDoorDelivery: false,
            supportsProof: false
        },
        {
            id: 5,
            name: "EXO5",
            logo: "https://via.placeholder.com/50x50?text=FX",
            basePrice: 45,
            weightMultiplier: 1.6,
            distanceMultiplier: 0.09,
            deliveryTime: 2,
            reliability: 4.8,
            features: ["توصيل سريع", "تتبع الشحنة", "خدمة التغليف"],
            supportsCOD: false,
            supportsTracking: true,
            supportsDoorDelivery: true,
            supportsProof: true
        }
    ];
    
    // Distance between major Saudi cities (mock data in km)
    const cityDistances = {
        "medea": {
            "q1": 950,
            "q2": 395,
            "q3": 880,
            "q4": 850,
            "q5": 410
        },
        "oran": {
            "a1": 950,
            "a2": 1345,
            "a3": 80,
            "a4": 420,
            "a5": 1360
        },
        "blida": {
            "w1": 395,
            "w2": 1345,
            "w3": 1275,
            "w4": 1245,
            "w5": 25
        },
    };
    
    // Package type multipliers
    const packageMultipliers = {
        "documents": 1,
        "clothes": 1.3,
        "electronics": 1.8,
        "large": 2.2,
        "food": 1.7,
        "medicine": 2.5,
        "other": 1.5
    };
    
    // Urgency multipliers
    const urgencyMultipliers = {
        "normal": 1,
        "fast": 1.5,
        "express": 2.5
    };
    
    // Current results data
    let currentResults = [];
    let currentPriority = "price";
    
    // Form submission handler
    shippingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const origin = document.getElementById('origin').value.trim();
        const destination = document.getElementById('destination').value.trim();
        const packageType = document.getElementById('packageType').value;
        const weight = document.getElementById('weight').value;
        const urgency = document.getElementById('urgency').value;
        const priority = document.getElementById('priority').value;
        const tracking = document.getElementById('tracking').checked;
        const cod = document.getElementById('cod').checked;
        const doorDelivery = document.getElementById('doorDelivery').checked;
        const proof = document.getElementById('proof').checked;
        
        // Validate inputs
        if (!origin || !destination || !packageType || !weight) {
            alert("الرجاء تعبئة جميع الحقول المطلوبة");
            return;
        }
        
        // Calculate distance (mock calculation)
        const distance = calculateDistance(origin, destination);
        
        // Process each shipping company
        const results = shippingCompanies.map(company => {
            // Skip if company doesn't support required features
            if ((cod && !company.supportsCOD) || 
                (tracking && !company.supportsTracking) ||
                (doorDelivery && !company.supportsDoorDelivery) ||
                (proof && !company.supportsProof)) {
                return null;
            }
            
            // Calculate base price
            let price = company.basePrice;
            
            // Add weight factor (skip if weight is unknown)
            if (weight !== "unknown") {
                price += parseFloat(weight) * company.weightMultiplier;
            } else {
                // Average weight calculation for unknown
                price += 5 * company.weightMultiplier;
            }
            
            // Add distance factor
            price += distance * company.distanceMultiplier;
            
            // Apply package type multiplier
            price *= packageMultipliers[packageType];
            
            // Apply urgency multiplier
            price *= urgencyMultipliers[urgency];
            
            // Add extra services
            if (cod) {
                price += 15;
            }
            
            if (doorDelivery) {
                price += 10;
            }
            
            if (proof) {
                price += 5;
            }
            
            // Round to 2 decimal places
            price = Math.round(price * 100) / 100;
            
            // Determine delivery time based on urgency
            let deliveryTime = company.deliveryTime;
            if (urgency === "fast") {
                deliveryTime = Math.max(1, Math.round(deliveryTime * 0.5));
            } else if (urgency === "express") {
                deliveryTime = 0; // same day
            }
            
            // Adjust delivery time for distance
            if (distance > 500) {
                deliveryTime += 1;
            }
            if (distance > 1000) {
                deliveryTime += 1;
            }
            
            // Get features
            const features = [...company.features];
            if (tracking) {
                features.push("تتبع مباشر");
            }
            if (cod) {
                features.push("الدفع عند الاستلام");
            }
            if (doorDelivery) {
                features.push("توصيل حتى الباب");
            }
            if (proof) {
                features.push("إثبات التسليم");
            }
            
            return {
                ...company,
                price,
                deliveryTime,
                features,
                isTracking: tracking,
                isCOD: cod,
                isDoorDelivery: doorDelivery,
                isProof: proof
            };
        }).filter(company => company !== null); // Remove null entries
        
        // Store results and priority
        currentResults = results;
        currentPriority = priority;
        
        // Sort results based on priority
        sortResults(currentPriority);
        
        // Display results
        displayResults(origin, destination, packageType, weight, urgency, tracking, cod, doorDelivery, proof);
    });
    
    // Sort buttons event listeners
    sortPriceBtn.addEventListener('click', function() {
        if (currentPriority !== "price") {
            currentPriority = "price";
            sortResults("price");
            renderResults();
            updateSortButtons();
        }
    });
    
    sortSpeedBtn.addEventListener('click', function() {
        if (currentPriority !== "speed") {
            currentPriority = "speed";
            sortResults("speed");
            renderResults();
            updateSortButtons();
        }
    });
    
    sortReliableBtn.addEventListener('click', function() {
        if (currentPriority !== "reliable") {
            currentPriority = "reliable";
            sortResults("reliable");
            renderResults();
            updateSortButtons();
        }
    });
    
    // Calculate distance between two cities (mock function)
    function calculateDistance(origin, destination) {
        // Check if cities are the same
        if (origin === destination) {
            return 5; // Local delivery
        }
        
        // Try to find distance in our mock data
        if (cityDistances[origin] && cityDistances[origin][destination]) {
            return cityDistances[origin][destination];
        }
        
        if (cityDistances[destination] && cityDistances[destination][origin]) {
            return cityDistances[destination][origin];
        }
        
        // Default distance if not found in our data
        return 500;
    }
    
    // Sort results based on priority
    function sortResults(priority) {
        if (priority === "price") {
            currentResults.sort((a, b) => a.price - b.price);
        } else if (priority === "speed") {
            currentResults.sort((a, b) => a.deliveryTime - b.deliveryTime);
        } else if (priority === "balanced") {
            // Balance between price and speed (price * delivery days)
            currentResults.sort((a, b) => (a.price * a.deliveryTime) - (b.price * b.deliveryTime));
        } else if (priority === "reliable") {
            currentResults.sort((a, b) => b.reliability - a.reliability);
        }
    }
    
    // Display results section
    function displayResults(origin, destination, packageType, weight, urgency, tracking, cod, doorDelivery, proof) {
        // Update summary
        routeSummary.textContent = `🗺️ المسار: من ${origin} إلى ${destination}`;
        
        let packageText = `📦 الطرد: ${getPackageName(packageType)}`;
        if (weight !== "unknown") {
            packageText += ` (${getWeightDescription(weight)})`;
        } else {
            packageText += " (وزن غير معروف)";
        }
        
        packageText += ` | ⏱️ ${getUrgencyName(urgency)}`;
        
        if (tracking) packageText += " | تتبع مباشر";
        if (cod) packageText += " | الدفع عند الاستلام";
        if (doorDelivery) packageText += " | توصيل حتى الباب";
        if (proof) packageText += " | إثبات التسليم";
        
        packageSummary.textContent = packageText;
        
        // Render results
        renderResults();
        
        // Show results section
        resultsSection.style.display = "block";
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: "smooth" });
        
        // Update sort buttons
        updateSortButtons();
    }
    
    // Render results cards
    function renderResults() {
        resultsContainer.innerHTML = "";
        
        if (currentResults.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-box-open"></i>
                    <p>لا توجد شركات شحن متاحة تناسب متطلباتك</p>
                    <p>حاول تعديل خيارات الشحنة الخاصة بك</p>
                </div>
            `;
            return;
        }
        
        currentResults.forEach((company, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            
            // Add "Best Choice" badge for the first result
            if (index === 0) {
                let badgeText = "الأفضل";
                if (currentPriority === "price") badgeText = "أفضل سعر";
                else if (currentPriority === "speed") badgeText = "أسرع توصيل";
                else if (currentPriority === "reliable") badgeText = "الأكثر موثوقية";
                
                card.innerHTML += `<span class="best-choice">${badgeText}</span>`;
            }
            
            // Delivery time text
            let deliveryText = "";
            if (company.deliveryTime === 0) {
                deliveryText = "نفس اليوم";
            } else if (company.deliveryTime === 1) {
                deliveryText = "يوم واحد";
            } else {
                deliveryText = `${company.deliveryTime} أيام`;
            }
            
            card.innerHTML += `
                <div class="card-header">
                    <h3 class="card-title">${company.name}</h3>
                    <img src="${company.logo}" alt="${company.name} logo" class="card-logo">
                </div>
                <div class="card-price">${company.price.toFixed(2)} ريال</div>
                <div class="card-delivery">
                    <i class="fas fa-truck"></i>
                    <span>مدة التوصيل: ${deliveryText}</span>
                </div>
                <div class="card-features">
                    <h4>المميزات:</h4>
                    <ul class="feature-list">
                        ${company.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="card-reliability">
                    <span>التقييم: </span>
                    ${getRatingStars(company.reliability)}
                </div>
            `;
            
            resultsContainer.appendChild(card);
        });
    }
    
    // Generate rating stars
    function getRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }
    
    // Update active sort button
    function updateSortButtons() {
        sortPriceBtn.classList.remove('active');
        sortSpeedBtn.classList.remove('active');
        sortReliableBtn.classList.remove('active');
        
        if (currentPriority === "price") {
            sortPriceBtn.classList.add('active');
        } else if (currentPriority === "speed") {
            sortSpeedBtn.classList.add('active');
        } else if (currentPriority === "reliable") {
            sortReliableBtn.classList.add('active');
        }
    }
    
    // Get package name from value
    function getPackageName(packageType) {
        const names = {
            "documents": "وثائق",
            "clothes": "ملابس",
            "electronics": "إلكترونيات",
            "large": "طرود كبيرة",
            "food": "طعام",
            "medicine": "دواء",
            "other": "أخرى"
        };
        return names[packageType] || packageType;
    }
    
    // Get weight description
    function getWeightDescription(weight) {
        if (weight === "0.5") return "أقل من 1 كغ";
        if (weight === "3") return "1-5 كغ";
        if (weight === "7.5") return "5-10 كغ";
        if (weight === "15") return "أكثر من 10 كغ";
        return weight + " كغ";
    }
    
    // Get urgency name
    function getUrgencyName(urgency) {
        const names = {
            "normal": "عادي (3-5 أيام)",
            "fast": "مستعجل (48 ساعة)",
            "express": "عاجل (نفس اليوم)"
        };
        return names[urgency] || urgency;
    }

});
