// Data
const SERVICES = {
  nails: [
    {id:'n1', icon:'💅', name:'Classic Manicure', desc:'Shape, cuticle care, and polish finish.', price:45, duration:45},
    {id:'n2', icon:'✨', name:'Gel Manicure', desc:'Long-lasting gel polish with glossy shine.', price:65, duration:60},
    {id:'n3', icon:'🎨', name:'Signature Nail Art', desc:'Hand-painted bespoke designs by our artists.', price:95, duration:90},
    {id:'n4', icon:'💎', name:'Luxe Pedicure', desc:'Exfoliation, massage, and premium polish.', price:75, duration:75},
    {id:'n5', icon:'🌸', name:'Acrylic Extensions', desc:'Full set of sculpted acrylic extensions.', price:110, duration:120},
    {id:'n6', icon:'🪞', name:'Chrome & Glass Finish', desc:'Mirror-finish chrome nails with holographic shimmer.', price:85, duration:75},
  ],
  hair: [
    {id:'h1', icon:'💇‍♀️', name:'Couture Cut & Style', desc:'Precision cut with expert blow-dry styling.', price:95, duration:75},
    {id:'h2', icon:'🌈', name:'Balayage', desc:'Hand-painted dimensional color, sun-kissed.', price:250, duration:180},
    {id:'h3', icon:'🌟', name:'Glossing Treatment', desc:'Shine-boosting gloss for radiant hair.', price:85, duration:60},
    {id:'h4', icon:'👑', name:'Bridal Styling', desc:'Elegant updo for your special day.', price:180, duration:120},
    {id:'h5', icon:'🧖‍♀️', name:'Keratin Smoothing', desc:'Frizz-free, silky hair for months.', price:320, duration:180},
    {id:'h6', icon:'🎀', name:'Blowout Bar', desc:'Voluminous, camera-ready blowout.', price:65, duration:45},
  ],
  spa: [
    {id:'s1', icon:'🌿', name:'Paraffin Hand Treatment', desc:'Deeply moisturizing warm wax therapy.', price:25, duration:20},
    {id:'s2', icon:'🌺', name:'Scalp Massage Ritual', desc:'Aromatic oil massage to restore calm.', price:45, duration:30},
    {id:'s3', icon:'🍯', name:'Honey Foot Soak', desc:'Warm honey & herbs for tired feet.', price:35, duration:25},
    {id:'s4', icon:'💆‍♀️', name:'Express Facial', desc:'Cleanse, exfoliate, and glow in 30.', price:75, duration:30},
  ],
};

// Loader
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 1400);
});

// Nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});
document.getElementById('burger').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
  document.querySelector('.nav-links').classList.remove('open');
}));

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Service Grid (menu)
const serviceGrid = document.getElementById('serviceGrid');
function renderServices(cat){
  serviceGrid.innerHTML = SERVICES[cat].map((s,i) => `
    <div class="service-card reveal" style="transition-delay:${i*60}ms">
      <span class="icon">${s.icon}</span>
      <h4>${s.name}</h4>
      <p class="desc">${s.desc}</p>
      <div class="meta">
        <span class="price">$${s.price}</span>
        <span class="duration">${s.duration} min</span>
      </div>
    </div>
  `).join('');
  document.querySelectorAll('#serviceGrid .reveal').forEach(el => io.observe(el));
}
renderServices('nails');
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderServices(tab.dataset.cat);
  });
});

// ============ BOOKING ============
const state = { service:null, date:null, time:null, name:'', email:'', phone:'', notes:'' };

// Service picker (all services flat)
const allServices = [...SERVICES.nails, ...SERVICES.hair, ...SERVICES.spa];
const picker = document.getElementById('servicePicker');
picker.innerHTML = allServices.map(s => `
  <div class="pick-card" data-id="${s.id}">
    <h5>${s.icon} ${s.name}</h5>
    <div class="pc-meta">
      <span>${s.duration} min</span>
      <span class="pc-price">$${s.price}</span>
    </div>
  </div>
`).join('');
picker.querySelectorAll('.pick-card').forEach(card => {
  card.addEventListener('click', () => {
    picker.querySelectorAll('.pick-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.service = allServices.find(s => s.id === card.dataset.id);
    document.getElementById('next1').disabled = false;
  });
});

// Step navigation
function goStep(n){
  document.querySelectorAll('.booking-step').forEach(s => s.classList.remove('active'));
  document.querySelector(`.booking-step[data-step="${n}"]`).classList.add('active');
  document.querySelectorAll('.step').forEach(s => {
    const num = +s.dataset.step;
    s.classList.toggle('active', num === n);
    s.classList.toggle('done', num < n);
  });
  document.getElementById('booking').scrollIntoView({behavior:'smooth', block:'start'});
}
document.getElementById('next1').addEventListener('click', () => goStep(2));
document.getElementById('next2').addEventListener('click', () => goStep(3));
document.getElementById('next3').addEventListener('click', () => {
  const form = document.getElementById('detailsForm');
  if (!form.checkValidity()) { form.reportValidity(); return; }
  state.name = document.getElementById('fName').value;
  state.email = document.getElementById('fEmail').value;
  state.phone = document.getElementById('fPhone').value;
  state.notes = document.getElementById('fNotes').value;
  renderSummary();
  goStep(4);
});
document.querySelectorAll('[data-back]').forEach(b => {
  b.addEventListener('click', () => goStep(+b.dataset.back));
});

// Calendar
let viewDate = new Date();
viewDate.setDate(1);
const monthLabel = document.getElementById('monthLabel');
const calDays = document.getElementById('calDays');
const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function renderCalendar(){
  const y = viewDate.getFullYear(), m = viewDate.getMonth();
  monthLabel.textContent = `${monthNames[m]} ${y}`;
  const first = new Date(y,m,1).getDay();
  const days = new Date(y,m+1,0).getDate();
  const today = new Date(); today.setHours(0,0,0,0);
  let html = '';
  for (let i=0;i<first;i++) html += '<div class="day empty"></div>';
  for (let d=1;d<=days;d++){
    const date = new Date(y,m,d);
    const isPast = date < today;
    const isMon = date.getDay() === 1;
    const classes = ['day'];
    if (isPast || isMon) classes.push('disabled');
    if (date.getTime() === today.getTime()) classes.push('today');
    if (state.date && date.getTime() === state.date.getTime()) classes.push('selected');
    html += `<div class="${classes.join(' ')}" data-d="${d}">${d}</div>`;
  }
  calDays.innerHTML = html;
  calDays.querySelectorAll('.day:not(.disabled):not(.empty)').forEach(el => {
    el.addEventListener('click', () => {
      const d = +el.dataset.d;
      state.date = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
      state.time = null;
      document.getElementById('next2').disabled = true;
      renderCalendar();
      renderSlots();
    });
  });
}
document.getElementById('prevMonth').addEventListener('click', () => {
  viewDate.setMonth(viewDate.getMonth()-1);
  renderCalendar();
});
document.getElementById('nextMonth').addEventListener('click', () => {
  viewDate.setMonth(viewDate.getMonth()+1);
  renderCalendar();
});
renderCalendar();

// Time slots
const slotsEl = document.getElementById('slots');
const timeDate = document.getElementById('timeDate');
const TIMES = ['10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM'];
function renderSlots(){
  if (!state.date){ slotsEl.innerHTML=''; return; }
  timeDate.textContent = state.date.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
  // Pseudo-random unavailable slots based on date
  const seed = state.date.getDate() * 7;
  slotsEl.innerHTML = TIMES.map((t,i) => {
    const taken = (i + seed) % 5 === 0;
    return `<div class="slot ${taken?'disabled':''}" data-t="${t}" ${taken?'style="opacity:.3;cursor:not-allowed;text-decoration:line-through"':''}>${t}</div>`;
  }).join('');
  slotsEl.querySelectorAll('.slot:not(.disabled)').forEach(s => {
    s.addEventListener('click', () => {
      slotsEl.querySelectorAll('.slot').forEach(x => x.classList.remove('selected'));
      s.classList.add('selected');
      state.time = s.dataset.t;
      document.getElementById('next2').disabled = false;
    });
  });
}

// Summary
function renderSummary(){
  const dateStr = state.date.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});
  document.getElementById('summary').innerHTML = `
    <div class="row"><span class="label">Service</span><span>${state.service.icon} ${state.service.name}</span></div>
    <div class="row"><span class="label">Duration</span><span>${state.service.duration} minutes</span></div>
    <div class="row"><span class="label">Date</span><span>${dateStr}</span></div>
    <div class="row"><span class="label">Time</span><span>${state.time}</span></div>
    <div class="row"><span class="label">Guest</span><span>${state.name}</span></div>
    <div class="row"><span class="label">Contact</span><span>${state.email}</span></div>
    <div class="row"><span class="label">Total</span><span>$${state.service.price}</span></div>
  `;
}

// Confirm
document.getElementById('confirmBtn').addEventListener('click', () => {
  document.getElementById('successName').textContent = state.name.split(' ')[0];
  goStep(5);
});
document.getElementById('resetBtn').addEventListener('click', () => {
  Object.assign(state, {service:null,date:null,time:null,name:'',email:'',phone:'',notes:''});
  document.getElementById('detailsForm').reset();
  picker.querySelectorAll('.pick-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('next1').disabled = true;
  document.getElementById('next2').disabled = true;
  renderCalendar();
  slotsEl.innerHTML = '';
  timeDate.textContent = 'Select a date to see times';
  goStep(1);
});

// Parallax orbs
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - .5) * 20;
  const y = (e.clientY / window.innerHeight - .5) * 20;
  document.querySelectorAll('.orb').forEach((orb,i) => {
    orb.style.transform = `translate(${x*(i+1)*.5}px,${y*(i+1)*.5}px)`;
  });
});
