/* Floating leaves */
for (let i = 0; i < 25; i++) {
  const l = document.createElement('div');
  l.className = 'leaf';
  l.innerHTML = '🍃';
  l.style.position = 'absolute';
  l.style.left = Math.random() * 100 + 'vw';
  l.style.animation = 'float 18s infinite linear';
  l.style.animationDelay = Math.random() * 10 + 's';
  document.body.appendChild(l);
}

/* Navigation */
document.querySelectorAll('nav button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    document.getElementById(btn.dataset.section).classList.add('active');
    btn.classList.add('active');
  });
});

/* Flip cards */
document.querySelectorAll('.plant-guide').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
});

/* Search Function */
const searchBox = document.getElementById('searchBox');
if (searchBox) {
  searchBox.addEventListener('keyup', () => {
    const term = searchBox.value.toLowerCase();
    document.querySelectorAll('.plant-guide').forEach(pg => {
      const name = pg.querySelector('h3').textContent.toLowerCase();
      pg.style.display = name.includes(term) ? 'block' : 'none';
    });
  });
}

/* Tracker with LocalStorage */
let plants = JSON.parse(localStorage.getItem('plants') || '[]');
const plantList = document.getElementById('plantList');
const form = document.getElementById('addPlantForm');

function savePlants() {
  localStorage.setItem('plants', JSON.stringify(plants));
}

function renderPlants() {
  plantList.innerHTML = '';
  plants.forEach((p, idx) => {
    const days = (Date.now() - new Date(p.date)) / 86400000 | 0;
    const progress = Math.min(100, days / p.estimated * 100) || 0;
    const li = document.createElement('li');
    li.className = 'plant-item';
    li.innerHTML = `
      <h4>${p.name}</h4>
      <p>${p.notes || 'No notes.'}</p>
      <progress value="${progress}" max="100"></progress>
      <div><button class="edit">Edit</button> <button class="remove">Remove</button></div>
    `;
    li.querySelector('.remove').onclick = () => {
      plants.splice(idx, 1);
      savePlants();
      renderPlants();
    };
    li.querySelector('.edit').onclick = () => {
      const n = prompt("Plant name:", p.name) || p.name;
      const d = prompt("Date (YYYY-MM-DD):", p.date) || p.date;
      const note = prompt("Notes:", p.notes) || p.notes;
      plants[idx] = { ...p, name: n, date: d, notes: note };
      savePlants();
      renderPlants();
    };
    plantList.appendChild(li);
  });
}

if (form) {
  form.onsubmit = e => {
    e.preventDefault();
    const name = document.getElementById('plantName').value.trim();
    const date = document.getElementById('plantDate').value;
    const notes = document.getElementById('plantNotes').value.trim();
    const estimates = { Tomato: 80, Carrot: 70, Radish: 30, Lemon: 365, Grapes: 150, Strawberry: 120, Chilli: 75 };
    const estimated = estimates[name] || 60;
    plants.push({ name, date, notes, estimated });
    savePlants();
    form.reset();
    renderPlants();
  };
}

renderPlants();

/* Reminder for plants older than 10 days */
setInterval(() => {
  const today = new Date();
  plants.forEach(p => {
    const days = Math.floor((today - new Date(p.date)) / 86400000);
    if (days > 10 && !p.reminded) {
      alert(`🌱 Reminder: Check on your ${p.name}! It's been ${days} days since planting.`);
      p.reminded = true;
      savePlants();
    }
  });
}, 60000); // Checks every minute

/* Random Daily Gardening Tip */
const tips = [
  "Water plants early in the morning 🌞",
  "Avoid overwatering – roots need oxygen too!",
  "Use organic fertilizer every 2 weeks 🌿",
  "Rotate your pots weekly for balanced sunlight ☀️",
  "Keep your garden clean to prevent pests 🐛"
];
window.addEventListener('load', () => {
  const tip = document.createElement('div');
  tip.className = 'daily-tip';
  tip.innerHTML = `<p><b>🌻 Today's Tip:</b> ${tips[Math.floor(Math.random() * tips.length)]}</p>`;
  tip.style.position = 'fixed';
  tip.style.bottom = '20px';
  tip.style.right = '20px';
  tip.style.background = '#81c784';
  tip.style.padding = '12px 20px';
  tip.style.borderRadius = '15px';
  tip.style.color = 'white';
  tip.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
  document.body.appendChild(tip);
  setTimeout(() => tip.remove(), 15000);
});

/* Live Weather Widget using Open-Meteo API */
async function loadWeather() {
  const box = document.getElementById('weather-box');
  try {
    // Get user location
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
      const data = await res.json();
      const temp = data.current_weather.temperature;
      const wind = data.current_weather.windspeed;
      box.innerHTML = `
        <h3>Temperature: ${temp}°C</h3>
        <p>Wind Speed: ${wind} km/h</p>
        <p>${temp < 30 ? "✅ Great time to water your plants!" : "🔥 Too hot – water early morning or late evening."}</p>
      `;
    });
  } catch (err) {
    box.innerHTML = "⚠️ Unable to load weather. Please allow location access.";
  }
}
loadWeather();

/* Monthly planting suggestion */
const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const month = new Date().getMonth();
const monthlyPlants = {
  January: ["Carrot", "Spinach", "Radish"],
  February: ["Tomato", "Coriander", "Mint"],
  March: ["Chilli", "Basil", "Strawberry"],
  April: ["Tomato", "Cucumber", "Lemon"],
  May: ["Okra", "Brinjal", "Chilli"],
  June: ["Coriander", "Basil", "Spinach"],
  July: ["Pumpkin", "Bitter Gourd", "Lemon"],
  August: ["Tomato", "Cucumber", "Mint"],
  September: ["Carrot", "Radish", "Spinach"],
  October: ["Strawberry", "Tomato", "Lettuce"],
  November: ["Peas", "Garlic", "Onion"],
  December: ["Carrot", "Cabbage", "Radish"]
};
document.getElementById("monthPlants").textContent = 
  `In ${monthNames[month]}, ideal plants to grow are: ${monthlyPlants[monthNames[month]].join(", ")}.`;

  /* Simple watering reminder every 3 days */
setInterval(() => {
  const lastWater = localStorage.getItem("lastWater") || 0;
  const diff = (Date.now() - lastWater) / 86400000;
  if (diff >= 3) {
    alert("💧 Time to water your plants again!");
    localStorage.setItem("lastWater", Date.now());
  }
}, 60000);

document.getElementById("notifyBell").onclick = () => {
  alert("🪴 Reminder alerts enabled! You'll get notified about watering and growth checks.");
};

// 🌙 Dark Mode Toggle
const themeBtn = document.getElementById('themeToggle');
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  themeBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  localStorage.setItem('darkMode', isDark);
});

// Keep theme saved on reload
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
  themeBtn.textContent = '☀️ Light Mode';
}

// 🧺 Harvest Tracker
const harvestForm = document.getElementById('harvestForm');
const harvestList = document.getElementById('harvestList');

function loadHarvests() {
  const harvests = JSON.parse(localStorage.getItem('harvests') || '[]');
  harvestList.innerHTML = '';
  harvests.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      🌾 <b>${item.plant}</b> - ${item.qty} pcs - ${item.date}
      <button onclick="deleteHarvest(${index})">❌</button>
    `;
    harvestList.appendChild(li);
  });
}

harvestForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const plant = document.getElementById('harvestPlant').value;
  const qty = document.getElementById('harvestQty').value;
  const date = document.getElementById('harvestDate').value;

  const harvests = JSON.parse(localStorage.getItem('harvests') || '[]');
  harvests.push({ plant, qty, date });
  localStorage.setItem('harvests', JSON.stringify(harvests));

  harvestForm.reset();
  loadHarvests();
});

function deleteHarvest(index) {
  const harvests = JSON.parse(localStorage.getItem('harvests') || '[]');
  harvests.splice(index, 1);
  localStorage.setItem('harvests', JSON.stringify(harvests));
  loadHarvests();
}

loadHarvests();


