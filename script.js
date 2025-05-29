// --- Oyun Değişkenleri ---
let week = 1;
let population = 10000000;
let gdp = 1000000000;
let inflation = 2; // %
let satisfaction = 70; // %
let budget = 100000000; // $
let taxes = 10;           // Vergi oranı (%)
let educationSpending = 0; // Haftalık eğitim bütçesi (etki)
let healthSpending = 0;    // Haftalık sağlık bütçesi (etki)
let cultureSpending = 0;   // Haftalık kültür bütçesi (etki)
let crimeRate = 5; // %
let securityPerception = 75; // %
let politicalSystem = 'Demokrasi'; // 'Demokrasi', 'Diktatörlük'
let parliamentSupport = 70; // % Meclis desteği (yasaları geçirme şansı)
let foreignRelationsScore = 50; // Genel dış ilişkiler puanı (0-100)
let nationalHolidays = 0; // Eklenen milli bayram sayısı

// Geçici haftalık etki depolayıcıları
let weeklyBudgetChange = 0;
let weeklySatisfactionChange = 0;
let weeklyGdpChangeFactor = 1; // Çarpan olarak GSYİH değişimi
let weeklyInflationChange = 0;
let weeklyPopulationChangeFactor = 1; // Çarpan olarak nüfus değişimi
let weeklyForeignRelationsChange = 0;
let weeklyCrimeRateChange = 0;
let weeklySecurityPerceptionChange = 0;

// Kabine Üyeleri (basit model)
const cabinet = {
    economy: { name: 'Boş', efficiency: 0.5, corruption: 0.1 },
    education: { name: 'Boş', efficiency: 0.5, corruption: 0.1 },
    health: { name: 'Boş', efficiency: 0.5, corruption: 0.1 },
    foreign: { name: 'Boş', efficiency: 0.5, corruption: 0.1 },
    interior: { name: 'Boş', efficiency: 0.5, corruption: 0.1 },
    justice: { name: 'Boş', efficiency: 0.5, corruption: 0.1 }
};

// Ülkelerle İlişkiler (basit model)
const countries = {
    'Komşu A': { relation: 60, tradeDeal: false },
    'Komşu B': { relation: 30, tradeDeal: false },
    'Uzak C': { relation: 80, tradeDeal: true }
};

// Meclis Gündemi
const parliamentAgenda = [];

// --- DOM Elementleri ---
// Sekme Butonları
const tabButtons = document.querySelectorAll('.tab-btn');
const gameScreens = document.querySelectorAll('.game-screen');

// Ana Ekran
const currentWeekEl = document.getElementById('current-week');
const populationEl = document.getElementById('population');
const gdpEl = document.getElementById('gdp');
const inflationEl = document.getElementById('inflation');
const satisfactionEl = document.getElementById('satisfaction');
const budgetEl = document.getElementById('budget');
const politicalSystemEl = document.getElementById('political-system');
const foreignRelationsScoreEl = document.getElementById('foreign-relations-score'); // Geneldeki foreign relations
const gameLogEl = document.getElementById('game-log');
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');

const increaseTaxesBtn = document.getElementById('increase-taxes');
const decreaseTaxesBtn = document.getElementById('decrease-taxes');
const investEconomyBtn = document.getElementById('invest-economy');
const investEducationBtn = document.getElementById('invest-education');
const investHealthBtn = document.getElementById('invest-health');
const promoteCultureBtn = document.getElementById('promote-culture');
const declareHolidayBtn = document.getElementById('declare-holiday'); // Yeni buton
const endWeekBtn = document.getElementById('end-week-btn');

// Kabine Ekranı
const cabinetListEl = document.getElementById('cabinet-list');
const ministerTypeSelect = document.getElementById('minister-type-select');
const ministerNameInput = document.getElementById('minister-name-input');
const appointMinisterBtn = document.getElementById('appoint-minister-btn');

// Meclis Ekranı
const parliamentSupportEl = document.getElementById('parliament-support');
const parliamentAgendaList = document.getElementById('parliament-agenda');
const proposalInput = document.getElementById('proposal-input');
const proposeLawBtn = document.getElementById('propose-law-btn');
const dissolveParliamentBtn = document.getElementById('dissolve-parliament-btn');

// Dış İlişkiler Ekranı
const foreignRelationsDisplayEl = document.getElementById('foreign-relations-display');
const countryRelationsList = document.getElementById('country-relations-list');
const foreignEventsList = document.getElementById('foreign-events-list');
const globalSummitBtn = document.getElementById('global-summit-btn');

// Güvenlik Ekranı
const crimeRateEl = document.getElementById('crime-rate');
const securityPerceptionEl = document.getElementById('security-perception');
const increasePoliceBudgetBtn = document.getElementById('increase-police-budget');
const reformJusticeBtn = document.getElementById('reform-justice');
const surveillanceProgramBtn = document.getElementById('surveillance-program');

// Raporlar Ekranı (şimdilik boş, daha sonra eklenecek)
const gdpChangeReportEl = document.getElementById('gdp-change-report');
const inflationChangeReportEl = document.getElementById('inflation-change-report');
const educationQualityReportEl = document.getElementById('education-quality-report');
const healthQualityReportEl = document.getElementById('health-quality-report');
const holidayCountReportEl = document.getElementById('holiday-count-report');
const governmentSupportReportEl = document.getElementById('government-support-report');
const oppositionStrengthReportEl = document.getElementById('opposition-strength-report');
// const reportChartCanvas = document.getElementById('reportChartCanvas');
// const reportChartCtx = reportChartCanvas.getContext('2d'); // Eğer chart.js gibi kütüphane kullanmayacaksak, direkt çizim için

// Oyun Sonu Ekranı
const gameOverScreen = document.getElementById('game-over-screen');
const gameOverReasonEl = document.getElementById('game-over-reason');
const finalWeekEl = document.getElementById('final-week');
const finalPopulationEl = document.getElementById('final-population');
const finalGdpEl = document.getElementById('final-gdp');
const restartGameBtn = document.getElementById('restart-game-btn');


// --- Yardımcı Fonksiyonlar ---

// Ekran değiştirme fonksiyonu
function showScreen(screenId) {
    gameScreens.forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });
    document.getElementById(screenId).classList.add('active');
    document.getElementById(screenId).classList.remove('hidden');

    tabButtons.forEach(btn => {
        if (btn.dataset.tab === screenId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    updateReports(); // Her ekran değişiminde raporları güncelle
}

// Oyun değişkenlerini sıfırlama
function resetGame() {
    week = 1;
    population = 10000000;
    gdp = 1000000000;
    inflation = 2;
    satisfaction = 70;
    budget = 100000000;
    taxes = 10;
    educationSpending = 0;
    healthSpending = 0;
    cultureSpending = 0;
    crimeRate = 5;
    securityPerception = 75;
    politicalSystem = 'Demokrasi';
    parliamentSupport = 70;
    foreignRelationsScore = 50;
    nationalHolidays = 0;

    // Geçici etkileri sıfırla
    weeklyBudgetChange = 0;
    weeklySatisfactionChange = 0;
    weeklyGdpChangeFactor = 1;
    weeklyInflationChange = 0;
    weeklyPopulationChangeFactor = 1;
    weeklyForeignRelationsChange = 0;
    weeklyCrimeRateChange = 0;
    weeklySecurityPerceptionChange = 0;

    // Kabineyi sıfırla
    for (const type in cabinet) {
        cabinet[type] = { name: 'Boş', efficiency: 0.5, corruption: 0.1 };
    }
    updateCabinetDisplay();

    // Ülke ilişkilerini sıfırla
    for (const country in countries) {
        countries[country].relation = 50; // Ortaya çek
        countries[country].tradeDeal = false;
    }
    countries['Komşu A'].relation = 60; // Bazı başlangıç değerleri
    countries['Komşu B'].relation = 30;
    countries['Uzak C'].relation = 80;
    updateForeignRelationsDisplay();

    parliamentAgenda.length = 0; // Meclis gündemini temizle
    updateParliamentDisplay();
    foreignEventsList.innerHTML = ''; // Dış ilişkiler olaylarını temizle

    gameLogEl.innerHTML = ''; // Logu temizle
    
    enableAllActionButtons();
    showScreen('main-screen'); // Ana ekrana dön
    addLog('Ulus Simülatörü Başladı! Yeni bir oyun...');
    updateGameStats(); // İstatistikleri güncelle
}

// Oyun Durumunu HTML'e Güncelleyen Fonksiyon
function updateGameStats() {
    currentWeekEl.textContent = week;
    populationEl.textContent = population.toLocaleString();
    gdpEl.textContent = gdp.toLocaleString();
    inflationEl.textContent = inflation.toFixed(1);
    satisfactionEl.textContent = satisfaction.toFixed(1);
    budgetEl.textContent = budget.toLocaleString();
    politicalSystemEl.textContent = politicalSystem;
    foreignRelationsScoreEl.textContent = foreignRelationsScore.toFixed(0);

    // Güvenlik ekranı güncellemeleri
    crimeRateEl.textContent = crimeRate.toFixed(1);
    securityPerceptionEl.textContent = securityPerception.toFixed(1);

    drawCanvasStats(); // Canvas'ı güncelle
    updateReports(); // Raporları güncelle
}

// Oyun Loguna Mesaj Ekleme Fonksiyonu
function addLog(message, type = 'info') {
    const listItem = document.createElement('li');
    listItem.textContent = `Hafta ${week}: ${message}`;
    if (type === 'warning') listItem.style.color = '#f39c12';
    if (type === 'danger') listItem.style.color = '#e74c3c';
    if (type === 'success') listItem.style.color = '#2ecc71';
    gameLogEl.prepend(listItem); // En yeni mesaj en üste gelir
}

// Canvas Üzerinde Durumları Çizen Fonksiyon
function drawCanvasStats() {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    const barHeight = 20;
    const barWidth = gameCanvas.width - 120;
    const startX = 100;
    let currentY = 30;

    ctx.font = '16px Arial';
    ctx.fillStyle = '#ecf0f1';

    // Memnuniyet Barı
    ctx.fillText('Memnuniyet:', 10, currentY + barHeight / 2 + 5);
    const satisfactionFill = (satisfaction / 100) * barWidth;
    ctx.fillStyle = `rgb(${255 - (satisfaction * 2.55)}, ${satisfaction * 2.55}, 0)`;
    ctx.fillRect(startX, currentY, satisfactionFill, barHeight);
    ctx.strokeStyle = '#7f8c8d';
    ctx.strokeRect(startX, currentY, barWidth, barHeight);
    ctx.fillStyle = '#ecf0f1';
    ctx.fillText(`${satisfaction.toFixed(1)}%`, startX + barWidth + 5, currentY + barHeight / 2 + 5);
    currentY += barHeight + 20;

    // Enflasyon Barı
    ctx.fillText('Enflasyon:', 10, currentY + barHeight / 2 + 5);
    const scaledInflation = Math.min(inflation, 20) / 20;
    const inflationFill = scaledInflation * barWidth;
    ctx.fillStyle = `rgb(${scaledInflation * 255}, ${255 - (scaledInflation * 255)}, 0)`;
    ctx.fillRect(startX, currentY, inflationFill, barHeight);
    ctx.strokeStyle = '#7f8c8d';
    ctx.strokeRect(startX, currentY, barWidth, barHeight);
    ctx.fillStyle = '#ecf0f1';
    ctx.fillText(`${inflation.toFixed(1)}%`, startX + barWidth + 5, currentY + barHeight / 2 + 5);
    currentY += barHeight + 20;

    // Dış İlişkiler Barı
    ctx.fillText('Dış İlişkiler:', 10, currentY + barHeight / 2 + 5);
    const foreignRelationsFill = (foreignRelationsScore / 100) * barWidth;
    ctx.fillStyle = `rgb(0, ${foreignRelationsScore * 2.55}, ${255 - (foreignRelationsScore * 2.55)})`;
    ctx.fillRect(startX, currentY, foreignRelationsFill, barHeight);
    ctx.strokeStyle = '#7f8c8d';
    ctx.strokeRect(startX, currentY, barWidth, barHeight);
    ctx.fillStyle = '#ecf0f1';
    ctx.fillText(`${foreignRelationsScore.toFixed(0)}%`, startX + barWidth + 5, currentY + barHeight / 2 + 5);
    currentY += barHeight + 20;
}

// Tüm aksiyon butonlarını aktif/pasif hale getirme
function enableAllActionButtons(enable = true) {
    const allButtons = document.querySelectorAll('button:not(.tab-btn):not(#restart-game-btn)');
    allButtons.forEach(button => button.disabled = !enable);
    
    // Siyasi sisteme göre bazı butonların durumu
    if (politicalSystem === 'Demokrasi') {
        declareDictatorshipBtn.disabled = !enable;
        callElectionsBtn.disabled = !enable;
        dissolveParliamentBtn.disabled = true; // Demokraside meclis feshedilmez
        crackdownDissentBtn.disabled = true; // Demokraside muhalefet bastırılamaz
    } else { // Diktatörlük
        declareDictatorshipBtn.disabled = true; // Zaten diktatörlükse
        callElectionsBtn.disabled = true;
        dissolveParliamentBtn.disabled = !enable;
        crackdownDissentBtn.disabled = !enable;
    }
}

// Oyun Sonu Fonksiyonu
function gameOver(reason) {
    addLog(`Oyun Bitti! ${reason}`, 'danger');
    enableAllActionButtons(false); // Tüm butonları devre dışı bırak
    endWeekBtn.disabled = true;
    
    gameOverReasonEl.textContent = reason;
    finalWeekEl.textContent = week;
    finalPopulationEl.textContent = population.toLocaleString();
    finalGdpEl.textContent = gdp.toLocaleString();
    showScreen('game-over-screen');
}

// --- Oyun Döngüsü ve Mekanikleri ---

// Haftayı Bitir Fonksiyonu
function endWeek() {
    week++;

    // --- Haftalık GSYİH Değişimi ---
    gdp *= (1 + (Math.random() - 0.5) * 0.003 * cabinet.economy.efficiency); // Bakan verimliliği etkisi
    if (inflation > 5) gdp *= 0.999;
    if (satisfaction > 80) gdp *= 1.0005;
    gdp *= weeklyGdpChangeFactor; // Kararların etkisi
    weeklyGdpChangeFactor = 1; // Sıfırla

    // --- Haftalık Bütçe Hesabı ---
    const taxRevenue = (population * gdp * (taxes / 520000)); // Yıllık verginin 1/52'si
    budget += taxRevenue;
    
    // Harcamalar
    const totalWeeklySpending = (educationSpending * cabinet.education.efficiency) + (healthSpending * cabinet.health.efficiency) + (cultureSpending * cabinet.economy.efficiency); // Bakan verimliliği etkisi
    budget -= totalWeeklySpending;
    weeklyBudgetChange += taxRevenue - totalWeeklySpending; // Geçici bütçe değişimini güncelle

    // --- Haftalık Enflasyon Değişimi ---
    inflation += (weeklyBudgetChange / gdp * 100) * 0.0005; // Bütçe değişimine göre enflasyon
    inflation += (Math.random() - 0.5) * 0.05; // Küçük rastgele değişim
    inflation += weeklyInflationChange; // Kararların etkisi
    inflation = Math.max(0.1, Math.min(30, inflation));
    weeklyInflationChange = 0; // Sıfırla

    // --- Haftalık Nüfus Değişimi ---
    population *= (1 + (satisfaction / 100000) - (inflation / 50000));
    population *= weeklyPopulationChangeFactor; // Kararların etkisi
    population = Math.round(population);
    weeklyPopulationChangeFactor = 1; // Sıfırla

    // --- Haftalık Halk Memnuniyeti Değişimi ---
    // Önceki haftadan gelen etkileri uygula
    satisfaction += weeklySatisfactionChange;

    // Pasif etkiler
    satisfaction -= (taxes / 70); // Vergi etkisi her hafta yayılır
    satisfaction += (educationSpending / 500000) + (healthSpending / 500000) + (cultureSpending / 300000);
    
    // Enflasyonun memnuniyet etkisi
    if (inflation > 5) satisfaction -= (inflation - 5) * 0.2;
    // Suç oranının memnuniyet etkisi
    satisfaction -= crimeRate * 0.5;

    satisfaction = Math.max(0, Math.min(100, satisfaction)); // 0-100 arasında tut
    weeklySatisfactionChange = 0; // Sıfırla

    // --- Güvenlik Değişimi ---
    crimeRate += weeklyCrimeRateChange;
    crimeRate = Math.max(0.1, Math.min(20, crimeRate)); // Suç oranını sınırladık
    weeklyCrimeRateChange = 0;

    securityPerception += weeklySecurityPerceptionChange;
    securityPerception = Math.max(0, Math.min(100, securityPerception));
    weeklySecurityPerceptionChange = 0;

    // --- Dış İlişkiler Değişimi ---
    foreignRelationsScore += weeklyForeignRelationsChange;
    foreignRelationsScore = Math.max(0, Math.min(100, foreignRelationsScore));
    weeklyForeignRelationsChange = 0;

    // --- Rastgele Olaylar (her hafta %10 ihtimalle) ---
    if (Math.random() < 0.1) {
        triggerRandomEvent();
    }

    // --- Seçim Mekanizması (Diktatörlük değilse her 52 haftada bir kontrol) ---
    if (politicalSystem === 'Demokrasi' && week % 52 === 0 && week > 1) {
        addLog('Seçim zamanı yaklaşıyor! Halkın nabzını tutun.');
        if (satisfaction < 50) {
            addLog('Halk memnuniyeti düşük. Bir sonraki seçimde zorlanabilirsiniz.', 'warning');
        }
        // Seçim olayı 1-2 hafta içinde tetiklenebilir
        setTimeout(() => conductElections(), 1000); // 1 saniye sonra seçim yap
    }

    // --- Oyun Sonu Koşulları ---
    if (satisfaction < 15) {
        addLog('Halk memnuniyeti çok düşük! Büyük çaplı isyanlar patlak verdi!', 'danger');
        gameOver('Halkın isyanı sonucu hükümetiniz devrildi!');
        return;
    }
    if (budget < -500000000 && week > 20) {
        addLog('Ülke iflas etti! Ekonomik çöküş yaşandı.', 'danger');
        gameOver('Ülke iflas etti ve yönetilemez hale geldi!');
        return;
    }
    if (population < 1000000 && week > 20) { // Nüfus çok azalırsa
        addLog('Nüfus dramatik şekilde azaldı. Ülke yaşanmaz hale geldi.', 'danger');
        gameOver('Nüfus azaldı ve ülkeniz çöküşe geçti!');
        return;
    }

    addLog(`Hafta Sonu Özeti: Bütçe Değişimi: $${weeklyBudgetChange.toLocaleString()}, Memnuniyet: ${satisfaction.toFixed(1)}%. Enflasyon: ${inflation.toFixed(1)}%.`);
    weeklyBudgetChange = 0; // Haftalık bütçe değişimini sıfırla

    updateGameStats();
    enableAllActionButtons(); // Tüm butonları tekrar aktif et
}

// Rastgele Olay Tetikleyici
function triggerRandomEvent() {
    const events = [
        { desc: 'Şiddetli bir doğal afet yaşandı, alt yapıya zarar verdi.', type: 'danger', effect: () => { budget -= 10000000; weeklyBudgetChange -= 10000000; weeklySatisfactionChange -= 5; weeklyGdpChangeFactor *= 0.99; } },
        { desc: 'Yeni bir teknolojik buluş ekonomiye büyük katkı sağladı!', type: 'success', effect: () => { weeklyGdpChangeFactor *= 1.005; weeklySatisfactionChange += 3; } },
        { desc: 'Hükümette yolsuzluk iddiaları yayıldı. Halk memnuniyeti düştü.', type: 'danger', effect: () => { weeklySatisfactionChange -= 10; weeklyForeignRelationsChange -= 5; } },
        { desc: 'Ülkenize büyük bir uluslararası yatırım yapıldı!', type: 'success', effect: () => { budget += 50000000; weeklyBudgetChange += 50000000; weeklyGdpChangeFactor *= 1.002; } },
        { desc: 'Başarılı bir kültür festivali düzenlendi. Halk memnuniyeti arttı.', type: 'success', effect: () => { weeklySatisfactionChange += 7; } },
        { desc: 'Küresel petrol fiyatları fırladı.', type: 'warning', effect: () => { weeklyInflationChange += 1.5; } },
        { desc: 'Komşu ülke ile ilişkiler gerginleşti.', type: 'warning', effect: () => { weeklyForeignRelationsChange -= 10; } },
        { desc: 'Büyük bir sağlık kampanyası başarıyla sonuçlandı.', type: 'success', effect: () => { weeklyPopulationChangeFactor *= 1.0005; weeklySatisfactionChange += 5; } },
        { desc: 'Ülkede suç dalgası baş gösterdi.', type: 'danger', effect: () => { weeklyCrimeRateChange += 2; weeklySecurityPerceptionChange -= 10; weeklySatisfactionChange -= 5; } },
        { desc: 'Medya özgürlüğü kısıtlandı. Dış ilişkiler ve memnuniyet düştü.', type: 'danger', effect: () => { if(politicalSystem === 'Diktatörlük') { weeklySatisfactionChange -= 2; weeklyForeignRelationsChange -= 5; } else { weeklySatisfactionChange -= 15; weeklyForeignRelationsChange -= 10; } } }
    ];
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    randomEvent.effect();
    addLog(randomEvent.desc, randomEvent.type);
}

// Seçim yapma fonksiyonu
function conductElections() {
    if (politicalSystem !== 'Demokrasi') return;

    addLog('Seçimler yapılıyor...', 'info');
    if (satisfaction >= 60) {
        addLog('Halkın memnuniyeti yüksek. Seçimleri kazandınız ve iktidarda kaldınız!', 'success');
        parliamentSupport = Math.min(100, parliamentSupport + 10); // Seçimle birlikte meclis desteği artar
    } else if (satisfaction >= 40) {
        addLog('Seçimler zorlu geçti. Koalisyon kurmak zorunda kaldınız veya az farkla kazandınız.', 'warning');
        parliamentSupport = Math.max(0, parliamentSupport - 10); // Düşük meclis desteği
    } else {
        addLog('Halk memnuniyeti çok düşük. Seçimleri kaybettiniz ve iktidardan düştünüz!', 'danger');
        gameOver('Seçim mağlubiyeti sonucu iktidardan düştünüz!');
        return;
    }
    updateGameStats();
}


// --- Kabine Yönetimi Fonksiyonları ---
function updateCabinetDisplay() {
    cabinetListEl.innerHTML = '';
    for (const type in cabinet) {
        const minister = cabinet[type];
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${capitalizeFirstLetter(type)} Bakanı:</strong> ${minister.name} (Verimlilik: ${minister.efficiency.toFixed(1)}, Yolsuzluk: ${minister.corruption.toFixed(1)})`;
        cabinetListEl.appendChild(listItem);
    }
}

appointMinisterBtn.addEventListener('click', () => {
    const ministerType = ministerTypeSelect.value;
    let ministerName = ministerNameInput.value.trim();
    if (ministerName === '') {
        ministerName = 'Yeni Bakan'; // İsim girilmezse varsayılan
    }

    // Yeni bakanın özellikleri
    const newEfficiency = Math.random() * 0.4 + 0.6; // 0.6 ile 1.0 arası
    const newCorruption = Math.random() * 0.3; // 0.0 ile 0.3 arası

    cabinet[ministerType] = { name: ministerName, efficiency: newEfficiency, corruption: newCorruption };
    addLog(`${capitalizeFirstLetter(ministerType)} Bakanı ${ministerName} olarak atandı.`, 'info');
    updateCabinetDisplay();
    ministerNameInput.value = ''; // Inputu temizle
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// --- Meclis Yönetimi Fonksiyonları ---
function updateParliamentDisplay() {
    parliamentSupportEl.textContent = `${parliamentSupport.toFixed(0)}%`;
    parliamentAgendaList.innerHTML = '';

    if (parliamentAgenda.length === 0) {
        parliamentAgendaList.innerHTML = '<li>Gündemde yeni bir yasa teklifi yok.</li>';
    } else {
        parliamentAgenda.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<p>${item.description}</p>
                                  <button class="parliament-action-btn" data-action="approve" data-index="${index}">Onayla</button>
                                  <button class="parliament-action-btn" data-action="reject" data-index="${index}">Reddet</button>`;
            parliamentAgendaList.appendChild(listItem);
        });
    }

    // Butonların tıklama olaylarını tekrar atama
    document.querySelectorAll('.parliament-action-btn').forEach(btn => {
        btn.onclick = handleParliamentAction;
    });
}

function handleParliamentAction(event) {
    const index = parseInt(event.target.dataset.index);
    const action = event.target.dataset.action;
    const proposal = parliamentAgenda[index];

    if (!proposal) return;

    let success = false;
    if (action === 'approve') {
        const roll = Math.random() * 100;
        if (roll < parliamentSupport) {
            success = true;
            proposal.onApprove();
            addLog(`Meclis, "${proposal.description}" yasasını onayladı.`, 'success');
        } else {
            addLog(`Meclis, "${proposal.description}" yasasını onaylamadı. Yeterli destek yok.`, 'warning');
            parliamentSupport = Math.max(0, parliamentSupport - 5); // Başarısızlıkta destek düşer
        }
    } else { // Reject
        proposal.onReject();
        addLog(`"${proposal.description}" yasası reddedildi.`, 'info');
        parliamentSupport = Math.max(0, parliamentSupport - 2); // Reddetmek hafif destek düşürebilir
    }

    parliamentAgenda.splice(index, 1); // Gündemden kaldır
    updateParliamentDisplay();
    updateGameStats();
}

proposeLawBtn.addEventListener('click', () => {
    const proposalText = proposalInput.value.trim();
    if (proposalText === '') {
        addLog('Lütfen bir yasa teklifi girin.', 'warning');
        return;
    }

    // Basit bir yasa teklifi ekleme
    parliamentAgenda.push({
        description: proposalText,
        onApprove: () => {
            addLog(`Kendi teklifiniz olan "${proposalText}" yasası onaylandı!`, 'success');
            weeklySatisfactionChange += 1; // Genellikle iyi niyetli teklif memnuniyeti artırır
        },
        onReject: () => {
            addLog(`Kendi teklifiniz olan "${proposalText}" yasası reddedildi.`, 'warning');
            weeklySatisfactionChange -= 0.5; // Reddedilmesi hafif memnuniyet düşürebilir
        }
    });
    addLog(`Yeni yasa teklifi "${proposalText}" meclis gündemine eklendi.`, 'info');
    proposalInput.value = '';
    updateParliamentDisplay();
});

dissolveParliamentBtn.addEventListener('click', () => {
    if (politicalSystem === 'Demokrasi') {
        addLog('Meclisi feshetmek diktatörlüğe yol açar ve halk memnuniyetini büyük ölçüde düşürür!', 'danger');
        weeklySatisfactionChange -= 30; // Büyük memnuniyet düşüşü
        politicalSystem = 'Diktatörlük';
        parliamentSupport = 0; // Meclis kalmadı
        // Tüm yasama yetkisi bize geçer
        parliamentAgenda.length = 0; // Gündemi temizle
        updateParliamentDisplay();
        enableAllActionButtons(); // Butonları yeniden düzenle
    } else {
        addLog('Zaten diktatörlükle yönetiliyorsunuz, meclis zaten feshedilmiş durumda.', 'warning');
    }
    updateGameStats();
});


// --- Dış İlişkiler Fonksiyonları ---
function updateForeignRelationsDisplay() {
    foreignRelationsDisplayEl.textContent = foreignRelationsScore.toFixed(0);
    countryRelationsList.innerHTML = '';
    for (const countryName in countries) {
        const country = countries[countryName];
        const listItem = document.createElement('li');
        let status = '';
        let color = '';
        if (country.relation >= 70) { status = 'Mükemmel'; color = 'green'; }
        else if (country.relation >= 40) { status = 'İyi'; color = 'orange'; }
        else { status = 'Kötü'; color = 'red'; }

        listItem.innerHTML = `
            ${countryName}: ${status} (<span style="color:${color};">${country.relation.toFixed(0)}</span>)
            <div>
                <button class="foreign-action-btn" data-country="${countryName}" data-action="trade">Ticaret Görüşmesi</button>
                <button class="foreign-action-btn" data-country="${countryName}" data-action="recall-ambassador">Elçiyi Geri Çek</button>
                ${country.relation < 20 ? `<button class="foreign-action-btn" data-country="${countryName}" data-action="declare-war-specific">Savaş İlan Et</button>` : ''}
            </div>
        `;
        countryRelationsList.appendChild(listItem);
    }

    document.querySelectorAll('.foreign-action-btn').forEach(btn => {
        btn.onclick = handleForeignAction;
    });
}

function handleForeignAction(event) {
    const countryName = event.target.dataset.country;
    const action = event.target.dataset.action;
    const country = countries[countryName];

    if (!country) return;

    if (action === 'trade') {
        if (country.tradeDeal) {
            addLog(`${countryName} ile zaten ticaret anlaşmamız var.`, 'warning');
            return;
        }
        const cost = 5000000;
        if (budget >= cost) {
            budget -= cost;
            weeklyBudgetChange -= cost;
            country.relation = Math.min(100, country.relation + 10);
            country.tradeDeal = true;
            weeklyGdpChangeFactor *= 1.001; // Ticaret GDP'ye katkı
            addLog(`${countryName} ile yeni bir ticaret anlaşması imzalandı!`, 'success');
        } else {
            addLog(`Yeterli bütçe yok! Ticaret görüşmesi maliyeti: $${cost.toLocaleString()}`, 'warning');
        }
    } else if (action === 'recall-ambassador') {
        country.relation = Math.max(0, country.relation - 15);
        weeklyForeignRelationsChange -= 5;
        addLog(`${countryName} büyükelçisi geri çekildi. İlişkiler gerildi.`, 'warning');
    } else if (action === 'declare-war-specific') {
        if (country.relation < 20) {
            const cost = 50000000;
            if (budget < cost) {
                addLog(`Yeterli bütçe yok! Savaş başlatmak için $${cost.toLocaleString()} gerekiyor.`, 'warning');
                return;
            }
            budget -= cost;
            weeklyBudgetChange -= cost;
            addLog(`${countryName} ülkesine savaş ilan edildi!`, 'danger');
            weeklySatisfactionChange -= 5; // Savaş genelde memnuniyeti düşürür
            // Savaş sonucu daha detaylı bir fonksiyonla işlenebilir
            simulateWar(countryName);
        } else {
            addLog(`${countryName} ile ilişkiler savaş ilan etmek için yeterince kötü değil.`, 'warning');
        }
    }
    updateForeignRelationsDisplay();
    updateGameStats();
}

function simulateWar(targetCountry) {
    // Basit bir savaş simülasyonu
    const outcome = Math.random();
    if (outcome < 0.4) {
        addLog(`Savaşı kaybettiniz! ${targetCountry} karşısında büyük kayıplar yaşandı.`, 'danger');
        weeklyGdpChangeFactor *= 0.9;
        weeklySatisfactionChange -= 20;
        weeklyPopulationChangeFactor *= 0.95;
        countries[targetCountry].relation = Math.max(0, countries[targetCountry].relation - 50); // İlişkiler daha da kötüleşir
    } else if (outcome < 0.8) {
        addLog(`Savaş berabere bitti. Kayıplar var ama durum kontrol altında.`, 'warning');
        weeklyGdpChangeFactor *= 0.98;
        weeklySatisfactionChange -= 10;
        countries[targetCountry].relation = Math.max(0, countries[targetCountry].relation - 20);
    } else {
        addLog(`Savaşı kazandınız! ${targetCountry} üzerinde zafer elde edildi, kaynaklar elde edildi.`, 'success');
        weeklyGdpChangeFactor *= 1.01;
        weeklySatisfactionChange += 15;
        budget += 50000000; // Savaş ganimeti
        weeklyBudgetChange += 50000000;
        countries[targetCountry].relation = Math.min(100, countries[targetCountry].relation + 10); // Belki ele geçirilen topraklar ilişkileri değiştirir
    }
    updateGameStats();
}

globalSummitBtn.addEventListener('click', () => {
    const cost = 10000000;
    if (budget >= cost) {
        budget -= cost;
        weeklyBudgetChange -= cost;
        weeklyForeignRelationsChange += 10;
        weeklySatisfactionChange += 2;
        addLog(`Uluslararası Zirveye katıldınız. Dış ilişkiler güçlendi ve itibarınız arttı.`, 'success');
    } else {
        addLog(`Yeterli bütçe yok! Uluslararası zirve maliyeti: $${cost.toLocaleString()}`, 'warning');
    }
    updateGameStats();
});

// --- Raporlar Fonksiyonları (Basit Placeholder) ---
function updateReports() {
    gdpChangeReportEl.textContent = `${((weeklyGdpChangeFactor - 1) * 100).toFixed(2)}%`;
    inflationChangeReportEl.textContent = `${weeklyInflationChange.toFixed(2)}%`;
    educationQualityReportEl.textContent = `${(educationSpending > 0 ? 'İyi' : 'Yetersiz')}`; // Basit
    healthQualityReportEl.textContent = `${(healthSpending > 0 ? 'İyi' : 'Yetersiz')}`; // Basit
    holidayCountReportEl.textContent = nationalHolidays;
    governmentSupportReportEl.textContent = `${satisfaction.toFixed(1)}%`; // Hükümet desteği şimdilik memnuniyetle eşleşsin
    oppositionStrengthReportEl.textContent = `${(100 - parliamentSupport).toFixed(1)}%`; // Muhalefet gücü meclis desteği tersi


    // Eğer Chart.js gibi bir kütüphane kullanıyorsak burada grafikleri güncelleyebiliriz.
    // Şimdilik sadece metinsel raporlar.
}


// --- Buton Olay Dinleyicileri (Genel) ---

// Sekme butonları için olay dinleyici
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.dataset.tab;
        showScreen(tabId);
    });
});

// Ana ekran butonları
increaseTaxesBtn.addEventListener('click', () => {
    taxes = Math.min(taxes + 0.1, 20);
    weeklyBudgetChange += (gdp * 0.00005);
    weeklySatisfactionChange -= 0.5; // Vergi artışı memnuniyeti düşürür
    addLog(`Vergiler %${taxes.toFixed(1)} oranına yükseltildi.`);
    updateGameStats();
});

decreaseTaxesBtn.addEventListener('click', () => {
    taxes = Math.max(taxes - 0.1, 5);
    weeklyBudgetChange -= (gdp * 0.00005);
    weeklySatisfactionChange += 0.5; // Vergi azalışı memnuniyeti artırır
    addLog(`Vergiler %${taxes.toFixed(1)} oranına düşürüldü.`);
    updateGameStats();
});

investEconomyBtn.addEventListener('click', () => {
    const cost = 10000000;
    if (budget >= cost) {
        budget -= cost;
        weeklyBudgetChange -= cost;
        weeklyGdpChangeFactor *= 1.002;
        weeklyInflationChange += 0.2;
        weeklySatisfactionChange += 0.2;
        addLog(`Ekonomiye $${cost.toLocaleString()} yatırım yapıldı.`);
    } else {
        addLog(`Yeterli bütçe yok! Ekonomi yatırım maliyeti: $${cost.toLocaleString()}`, 'warning');
    }
    updateGameStats();
});

investEducationBtn.addEventListener('click', () => {
    const cost = 5000000;
    if (budget >= cost) {
        budget -= cost;
        weeklyBudgetChange -= cost;
        educationSpending = cost;
        weeklySatisfactionChange += 0.8 * cabinet.education.efficiency; // Bakan verimliliği
        addLog(`Eğitime $${cost.toLocaleString()} yatırım yapıldı.`);
    } else {
        addLog(`Yeterli bütçe yok! Eğitim yatırım maliyeti: $${cost.toLocaleString()}`, 'warning');
    }
    updateGameStats();
});

investHealthBtn.addEventListener('click', () => {
    const cost = 7000000;
    if (budget >= cost) {
        budget -= cost;
        weeklyBudgetChange -= cost;
        healthSpending = cost;
        weeklySatisfactionChange += 1 * cabinet.health.efficiency; // Bakan verimliliği
        addLog(`Sağlığa $${cost.toLocaleString()} yatırım yapıldı.`);
    } else {
        addLog(`Yeterli bütçe yok! Sağlık yatırım maliyeti: $${cost.toLocaleString()}`, 'warning');
    }
    updateGameStats();
});

promoteCultureBtn.addEventListener('click', () => {
    const cost = 3000000;
    if (budget >= cost) {
        budget -= cost;
        weeklyBudgetChange -= cost;
        cultureSpending = cost;
        weeklySatisfactionChange += 0.5;
        addLog(`Kültürü desteklemek için $${cost.toLocaleString()} harcandı.`);
    } else {
        addLog(`Yeterli bütçe yok! Kültür desteği maliyeti: $${cost.toLocaleString()}`, 'warning');
    }
    updateGameStats();
});

declareHolidayBtn.addEventListener('click', () => {
    const cost = 2000000;
    if (budget >= cost) {
        budget -= cost;
        weeklyBudgetChange -= cost;
        nationalHolidays++;
        weeklySatisfactionChange += 3; // Tatil memnuniyeti artırır
        weeklyGdpChangeFactor *= 0.999; // Ama ekonomik aktiviteyi hafif düşürür
        addLog(`Yeni bir resmi tatil ilan edildi! Halk mutlu ama ekonomi hafif etkilenecek.`, 'success');
    } else {
        addLog(`Yeterli bütçe yok! Tatil ilan etme maliyeti: $${cost.toLocaleString()}`, 'warning');
    }
    updateGameStats();
});


// Güvenlik Ekranı Butonları
increasePoliceBudgetBtn.addEventListener('click', () => {
    const cost = 3000000;
    if (budget >= cost) {
        budget -= cost;
        weeklyBudgetChange -= cost;
        weeklyCrimeRateChange -= 0.5 * cabinet.interior.efficiency;
        weeklySecurityPerceptionChange += 2 * cabinet.interior.efficiency;
        addLog(`Polis bütçesi artırıldı. Suç oranları düşebilir, güvenlik algısı artabilir.`, 'info');
    } else {
        addLog(`Yeterli bütçe yok! Polis bütçesi artırma maliyeti: $${cost.toLocaleString()}`, 'warning');
    }
    updateGameStats();
});

reformJusticeBtn.addEventListener('click', () => {
    const cost = 5000000;
    if (budget >= cost) {
        budget -= cost;
        weeklyBudgetChange -= cost;
        weeklyCrimeRateChange -= 0.2 * cabinet.justice.efficiency;
        weeklySecurityPerceptionChange += 3 * cabinet.justice.efficiency;
        weeklySatisfactionChange += 1;
        addLog(`Adalet sistemi reforme edildi. Suçla mücadele ve halk güveni artabilir.`, 'info');
    } else {
        addLog(`Yeterli bütçe yok! Adalet reformu maliyeti: $${cost.toLocaleString()}`, 'warning');
    }
    updateGameStats();
});

surveillanceProgramBtn.addEventListener('click', () => {
    const cost = 4000000;
    if (budget >= cost) {
        budget -= cost;
        weeklyBudgetChange -= cost;
        weeklyCrimeRateChange -= 1;
        weeklySecurityPerceptionChange += 1;
        weeklySatisfactionChange -= 5; // Gözetim memnuniyeti düşürür
        addLog(`Geniş çaplı gözetim programı başlatıldı. Suç oranı düşebilir, ancak özgürlükler kısıtlandı.`, 'warning');
    } else {
        addLog(`Yeterli bütçe yok! Gözetim programı maliyeti: $${cost.toLocaleString()}`, 'warning');
    }
    updateGameStats();
});

// Oyun Sonu Ekranı Butonu
restartGameBtn.addEventListener('click', () => {
    resetGame();
});

// Haftayı Bitir butonu olay dinleyicisi
endWeekBtn.addEventListener('click', () => {
    endWeek();
});

// İlk yüklemede oyunu başlat
resetGame();
