// Intersection Observer para animar elementos ao aparecer no ecrã
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.fade-in, .slide-up, .design-img, .about-img, .industry-img').forEach(el => {
  observer.observe(el);
});

// Generic inline SVG fallback generator
function svgFallback(text, w = 800, h = 500) {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <rect width="100%" height="100%" fill="#012147" />
      <text x="50%" y="50%" fill="#7aafff" font-family="Poppins, sans-serif" font-size="20" text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>
  `);
}

// Fallback handlers for images that may be missing
document.querySelectorAll('.about-img, .industry-img, .design-img, .vantagens-img').forEach(img => {
  img.addEventListener('error', () => {
    img.src = svgFallback('Imagem indisponível');
    // ensure animation still triggers
    img.classList.add('visible');
  });
  // in case image is already cached as missing, trigger error handler manually
  if (img.complete && img.naturalWidth === 0) {
    img.dispatchEvent(new Event('error'));
  }
});

// Smooth scroll para links do menu
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', e => {
    if (link.hash === '#contact') {
      e.preventDefault();
      document.getElementById('contact-popup').classList.add('active');
    } else if (link.hash) {
      e.preventDefault();
      document.querySelector(link.hash).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Popup functionality (shared between contact and calculator)
const contactPopup = document.getElementById('contact-popup');
const calculatorPopup = document.getElementById('calculator-popup');
const closeButtons = document.querySelectorAll('.close-popup');
const openCalcBtn = document.getElementById('openCalcBtn');

// Function to close any active popup
function closeActivePopup() {
  document.querySelectorAll('.popup-overlay').forEach(popup => {
    popup.classList.remove('active');
  });
}

// Close popup when clicking the close buttons
closeButtons.forEach(button => {
  button.addEventListener('click', closeActivePopup);
});

// Close popup when clicking outside
document.querySelectorAll('.popup-overlay').forEach(popup => {
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      closeActivePopup();
    }
  });
});

// Close popup with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeActivePopup();
  }
});

// Calculator functionality
openCalcBtn.addEventListener('click', () => {
  calculatorPopup.classList.add('active');
});

document.getElementById('calcBtn').addEventListener('click', function(){
  // Get input values
  const dailyDistance = parseFloat(document.getElementById('dailyDistance').value) || 0;
  const daysPerMonth = parseFloat(document.getElementById('daysPerMonth').value) || 0;
  const currentConsumption = parseFloat(document.getElementById('currentConsumption').value) || 0;
  const fuelPrice = parseFloat(document.getElementById('fuelPrice').value) || 0;
  const electricityPrice = parseFloat(document.getElementById('electricityPrice').value) || 0;

  // Constants for Luzion
  const luzionEnergyConsumption = 10; // kWh/100km
  const co2PerLiter = 2.31; // kg of CO2 per liter of gasoline
  const luzionRange = 100; // km per charge

  // Monthly calculations
  const monthlyDistance = dailyDistance * daysPerMonth;
  
  // Energy calculations
  const currentFuelConsumption = (monthlyDistance / 100) * currentConsumption; // Liters per month
  const luzionEnergyMonth = (monthlyDistance / 100) * luzionEnergyConsumption; // kWh per month
  
  // Cost calculations
  const currentMonthlyCost = currentFuelConsumption * fuelPrice; // Current fuel cost per month
  const luzionMonthlyCost = luzionEnergyMonth * electricityPrice; // Luzion electricity cost per month
  const monthlySavings = currentMonthlyCost - luzionMonthlyCost; // Monthly savings
  const yearlySavings = monthlySavings * 12; // Annual savings
  
  // Cost per 100km
  const currentCostPer100km = (currentConsumption * fuelPrice).toFixed(2);
  const luzionCostPer100km = (luzionEnergyConsumption * electricityPrice).toFixed(2);
  
  // CO2 emissions saved
  const co2Saved = currentFuelConsumption * co2PerLiter; // kg of CO2 saved per month

  // Update results
  document.getElementById('moneySaved').textContent = 
    monthlySavings.toFixed(2) + ' €';
  
  document.getElementById('yearSavings').textContent = 
    yearlySavings.toFixed(2) + ' €';
  
  document.getElementById('emissionSavings').textContent = 
    co2Saved.toFixed(1) + ' kg';
  
  document.getElementById('currentCost').textContent = 
    currentCostPer100km + ' €';
  
  document.getElementById('luzionCost').textContent = 
    luzionCostPer100km + ' €';
  
  document.getElementById('range').textContent = 
    luzionRange + ' km';

  // Add animation to results
  document.querySelectorAll('.result-card').forEach(card => {
    card.style.animation = 'none';
    card.offsetHeight; // Trigger reflow
    card.style.animation = 'resultPulse 0.5s ease';
  });
});
