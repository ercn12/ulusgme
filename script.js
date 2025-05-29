// Oyun Değişkenleri
let week = 1; // Yıl yerine hafta
let population = 10000000;
let gdp = 1000000000;
let inflation = 2;
let satisfaction = 70;
let budget = 100000000;
let taxes = 10;           // Vergi oranı (%)
let educationSpending = 0; // Haftalık eğitim bütçesi
let healthSpending = 0;    // Haftalık sağlık bütçesi
let cultureSpending = 0;   // Haftalık kültür bütçesi
let foreignRelations = 50;
let politicalSystem = 'Demokrasi'; // Demokrasi, Diktatörlük
let weeklyBudgetChange = 0; // Haftalık bütçe değişimi (geçici)
let weeklySatisfactionChange = 0; // Haftalık memnuniyet değişimi (geçici)

// DOM Elementleri
const currentWeekEl = document.getElementById('current-week'); // Hafta için
const populationEl = document.getElementById('population');
const gdpEl = document.getElementById('gdp');
const inflationEl = document.getElementById('inflation');
const satisfactionEl = document.getElementById('satisfaction');
const budgetEl = document.getElementById('budget');
const politicalSystemEl = document.getElementById('political-system');
const foreignRelationsEl = document.getElementById('foreign-relations'); // Dış ilişkileri de gösterelim
const gameLogEl = document.getElementById('game-log');
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');

// Butonlar
const increaseTaxesBtn = document.getElementById('increase-taxes');
const decreaseTaxesBtn = document.getElementById('decrease-taxes');
const investEconomyBtn = document.getElementById('invest-economy');
const investEducationBtn = document.getElementById('invest-education');
const investHealthBtn = document.getElementById('invest-health');
const promoteCultureBtn = document.getElementById('promote-culture'); // Yeni buton
const callElectionsBtn = document.getElementById('call-elections');
const declareDictatorshipBtn = document.getElementById('declare-dictatorship');
const crackdownDissentBtn = document.getElementById('crackdown-dissent'); // Yeni buton
const improveRelationsBtn = document.getElementById('improve-relations');
const declareWarBtn = document.getElementById('declare-war');
const signTradeDealBtn = document.getElementById('sign-trade-deal'); // Yeni buton
const endWeekBtn = document.getElementById('end-week-btn'); // Haftayı bitir butonu

// --- Yardımcı Fonksiyonlar ---

// Oyun değişkenlerini sıfırlama (Yeni oyun veya oyun sonu için)
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
    foreignRelations = 50;
    politicalSystem = 'Demokrasi';
    weeklyBudgetChange = 0;
    weeklySatisfactionChange = 0;
    gameLogEl.innerHTML = '';
    
    // Tüm butonları aktif hale getir
    enableAllActionButtons();
    // Diktatörlük ilan etmeden önce seçim butonu aktif olmalı
    callElectionsBtn.disabled = false;
    crackdownDissentBtn.disabled = true; // Diktatörlük ilan edilmeden pasif
    declareWarBtn.disabled = false; // Savaş butonu
    signTradeDealBtn.disabled = false; // Ticaret butonu

    updateGameStats();
    addLog('Ulus Simülatörü Başladı! Ülkenizin geleceği sizin ellerinizde.', 'info');
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
    foreignRelationsEl.textContent = foreignRelations.toFixed(0);

    drawCanvasStats();
}

// Oyun Loguna Mesaj Ekleme Fonksiyonu
function addLog(message, type = 'info') {
    const listItem = document.createElement('li');
    listItem.textContent = `Hafta ${week}: ${message}`;
    if (type === 'warning') listItem.style.color = '#f39c12';
    if (type === 'danger') listItem.style.color = '#e74c3c';
    if (type === 'success') listItem.style.color = '#2ecc71'; // Yeşil
    gameLogEl.prepend(listItem);
}

// Canvas Üzerinde Durumları Çizen Fonksiyon
function drawCanvasStats() {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.font = '18px Arial';
    ctx.fillStyle = '#ecf0f1';
    ctx.fillText(`Memnuniyet: ${satisfaction.toFixed(1)}%`, 20, 30);
    ctx.fillText(`Enflasyon: ${inflation.toFixed(1)}%`, 20, 60);
    ctx.fillText(`Dış İlişkiler: ${foreignRelations.toFixed(0)}%`, 20, 90);

    // Memnuniyet barı
    ctx.fillStyle = '#27ae60';
    ctx.fillRect(20, 110, (satisfaction / 100) * (gameCanvas.width - 40), 15);
    ctx.strokeStyle = '#ecf0f1';
    ctx.strokeRect(20, 110, gameCanvas.width - 40, 15);
}

// Tüm aksiyon butonlarını aktif/pasif hale getirme
function enableAllActionButtons() {
    const actionButtons = document.querySelectorAll('.actions-panel button:not(#end-week-btn)');
    actionButtons.forEach(button => button.disabled = false);
    
    // Siyasi sisteme göre bazı butonların durumu
    if (politicalSystem === 'Demokrasi') {
        callElectionsBtn.disabled = false;
        crackdownDissentBtn.disabled = true; // Demokraside muhalefet bastırılamaz
    } else { // Diktatörlük
        callElectionsBtn.disabled = true;
        crackdownDissentBtn.disabled = false;
    }
}

// --- Oyun Döngüsü ve Mekanikleri ---

// Haftayı Bitir Fonksiyonu
function endWeek() {
    week++;

    // Haftalık GSYİH artışı/azalışı
    gdp *= (1 + (Math.random() - 0.5) * 0.005); // Küçük haftalık değişim
    if (inflation > 5) gdp *= 0.999;
    if (satisfaction > 80) gdp *= 1.001;

    // Haftalık Vergi Geliri (GSYİH ve vergi oranına bağlı)
    const taxRevenue = (population * gdp * (taxes / 520000)); // Yıllık verginin 1/52'si
    budget += taxRevenue;
    weeklyBudgetChange += taxRevenue; // Haftalık bütçe değişimine ekle

    // Haftalık Harcamalar (Eğitim, Sağlık, Kültür)
    const weeklyEducationCost = educationSpending;
    const weeklyHealthCost = healthSpending;
    const weeklyCultureCost = cultureSpending;
    budget -= weeklyEducationCost + weeklyHealthCost + weeklyCultureCost;
    weeklyBudgetChange -= (weeklyEducationCost + weeklyHealthCost + weeklyCultureCost);

    // Enflasyon değişimi
    inflation += (weeklyBudgetChange / gdp * 100) * 0.001; // Bütçe değişimine göre enflasyon
    inflation += (Math.random() - 0.5) * 0.1; // Küçük rastgele değişim
    inflation = Math.max(0.1, Math.min(30, inflation));

    // Nüfus değişimi
    population *= (1 + (satisfaction / 100000) - (inflation / 50000)); // Haftalık nüfus değişimi
    population = Math.round(population);

    // Halk Memnuniyeti değişimi (Haftalık etki)
    satisfaction -= (taxes / 50); // Vergi etkisi her hafta yayılır
    satisfaction += (educationSpending / 500000) + (healthSpending / 500000) + (cultureSpending / 300000);

    // Rastgele Olaylar (her hafta %5-10 ihtimalle)
    if (Math.random() < 0.08) {
        triggerRandomEvent();
    }

    // Oyun Sonu Koşulları
    if (satisfaction < 15) {
        addLog('Halk memnuniyeti çok düşük! Büyük çaplı isyanlar patlak verdi!', 'danger');
        gameOver('Halkın isyanı sonucu hükümetiniz devrildi!');
        return;
    }
    if (budget < -200000000 && week > 10) { // Belirli bir haftadan sonra iflas
        addLog('Ülke iflas etti! Ekonomik çöküş yaşandı.', 'danger');
        gameOver('Ülke iflas etti ve yönetilemez hale geldi!');
        return;
    }

    // Bütçe ve memnuniyet değişimlerini sıfırla
    weeklyBudgetChange = 0;
    weeklySatisfactionChange = 0;
    
    addLog(`Hafta Sonu Özeti: Bütçe Değişimi: $${weeklyBudgetChange.toLocaleString()}, Memnuniyet Değişimi: ${weeklySatisfactionChange.toFixed(1)}%.`);
    updateGameStats();
    enableAllActionButtons(); // Tüm butonları aktif hale getir
}

// Rastgele Olay Tetikleyici
function triggerRandomEvent() {
    const events = [
        { desc: 'Şiddetli bir fırtına yaşandı, alt yapıya zarar verdi.', effect: () => { budget -= 10000000; satisfaction -= 5; addLog('Doğal Afet!', 'danger'); } },
        { desc: 'Yeni bir teknolojik buluş ekonomiye büyük katkı sağladı!', effect: () => { gdp *= 1.01; satisfaction += 3; addLog('Teknolojik Atılım!', 'success'); } },
        { desc: 'Hükümette yolsuzluk iddiaları yayıldı. Halk memnuniyeti düştü.', effect: () => { satisfaction -= 10; foreignRelations -= 5; addLog('Yolsuzluk Skandalı!', 'danger'); } },
        { desc: 'Ülkenize büyük bir uluslararası yatırım yapıldı!', effect: () => { budget += 50000000; gdp *= 1.005; addLog('Uluslararası Yatırım!', 'success'); } },
        { desc: 'Başarılı bir kültür festivali düzenlendi. Halk memnuniyeti arttı.', effect: () => { satisfaction += 7; addLog('Kültür Festivali!', 'success'); } },
        { desc: 'Küresel petrol fiyatları fırladı.', effect: () => { inflation += 2; addLog('Petrol Krizi!', 'warning'); } },
        { desc: 'Komşu ülke ile ilişkiler gerginleşti.', effect: () => { foreignRelations -= 10; addLog('Diplomatik Gerilim!', 'warning'); } },
        { desc: 'Büyük bir sağlık kampanyası başarıyla sonuçlandı.', effect: () => { population *= 1.0005; satisfaction += 5; addLog('Sağlık Başarısı!', 'success'); } }
    ];
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    randomEvent.effect();
    addLog(randomEvent.desc);
}

// Oyun Sonu Fonksiyonu
function gameOver(reason) {
    addLog(`Oyun Bitti! ${reason}`, 'danger');
    // Oyun bittiğinde tüm butonları devre dışı bırak
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(btn => btn.disabled = true);
    // Belki bir oyun sonu ekranı gösterebiliriz (ileride eklenebilir)
    alert(`Oyun Bitti!\nSebep: ${reason}\nSon hafta: ${week}\nNüfus: ${population.toLocaleString()}`);
    resetGame(); // Otomatik olarak oyunu sıfırla
}

// --- Buton Olay Dinleyicileri ---

increaseTaxesBtn.addEventListener('click', () => {
    taxes = Math.min(taxes + 0.1, 20); // Haftalık küçük artış
    weeklyBudgetChange += (gdp * 0.00005);
    weeklySatisfactionChange -= 0.5;
    addLog(`Vergiler %${taxes.toFixed(1)} oranına yükseltildi. Halk memnuniyeti hafif düştü.`);
    updateGameStats();
});

decreaseTaxesBtn.addEventListener('click', () => {
    taxes = Math.max(taxes - 0.1, 5); // Haftalık küçük azalış
    weeklyBudgetChange -= (gdp * 0.00005);
    weeklySatisfactionChange += 0.5;
    addLog(`Vergiler %${taxes.toFixed(1)} oranına düşürüldü. Halk memnuniyeti hafif arttı.`);
    updateGameStats();
});

investEconomyBtn.addEventListener('click', () => {
    const cost = 10000000;
    if (budget >= cost) {
        budget -= cost;
        weeklyBudgetChange -= cost;
        gdp *= 1.002; // Ekonomi anlık etki
        inflation += 0.2;
        weeklySatisfactionChange += 0.2;
        addLog(`Ekonomiye $${cost.toLocaleString()} yatırım yapıldı. GSYİH hafif arttı.`);
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
        educationSpending = cost; // Haftalık harcama olarak ayarla
        weeklySatisfactionChange += 0.8;
        addLog(`Eğitime $${cost.toLocaleString()} yatırım yapıldı. Halk memnuniyeti arttı.`);
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
        healthSpending = cost; // Haftalık harcama olarak ayarla
        weeklySatisfactionChange += 1;
        addLog(`Sağlığa $${cost.toLocaleString()} yatırım yapıldı. Halk memnuniyeti arttı.`);
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
        cultureSpending = cost; // Haftalık harcama olarak ayarla
        weeklySatisfactionChange += 0.5;
        addLog(`Kültürü desteklemek için $${cost.toLocaleString()} harcandı. Halk memnuniyeti arttı.`);
    } else {
        addLog(`Yeterli bütçe yok! Kültür desteği maliyeti: $${cost.toLocaleString()}`, 'warning');
    }
    updateGameStats();
});

callElectionsBtn.addEventListener('click', () => {
    if (politicalSystem === 'Demokrasi') {
        addLog(`Seçim çağrısı yapıldı! Haftalar içinde sonuçlar görülecek.`, 'info');
        // Seçim sonucu, belirli bir haftada (örneğin 4 hafta sonra) veya memnuniyet durumuna göre belirlenebilir
        // Şimdilik, haftalık döngüde memnuniyet düşerse oyun biter.
        // Daha sonra buraya 'election_countdown' gibi bir mekanik eklenebilir.
        // Butonu geçici olarak devre dışı bırak
        callElectionsBtn.disabled = true;
    } else {
        addLog(`Diktatörlükte seçim olmaz!`, 'warning');
    }
    updateGameStats();
});

declareDictatorshipBtn.addEventListener('click', () => {
    if (politicalSystem === 'Demokrasi') {
        politicalSystem = 'Diktatörlük';
        weeklySatisfactionChange -= 5; // Diktatörlük ilan etmek memnuniyeti anında düşürür
        addLog(`Diktatörlük ilan edildi! Özgürlükler kısıtlandı, halk memnuniyeti düştü.`, 'danger');
        callElectionsBtn.disabled = true; // Diktatörlükte seçim butonu kapalı
        crackdownDissentBtn.disabled = false; // Muhalefet bastırma aktif
    } else {
        addLog(`Zaten bir diktatörlük hüküm sürüyor.`, 'warning');
    }
    updateGameStats();
});

crackdownDissentBtn.addEventListener('click', () => {
    const cost = 2000000;
    if (politicalSystem === 'Diktatörlük' && budget >= cost) {
        budget -= cost;
        weeklyBudgetChange -= cost;
        weeklySatisfactionChange -= 2; // Baskı memnuniyeti düşürür
        addLog(`Muhalefeti bastırmak için $${cost.toLocaleString()} harcandı. Halkın korkusu arttı, ancak memnuniyet düştü.`, 'warning');
    } else if (politicalSystem !== 'Diktatörlük') {
        addLog(`Bu eylem sadece diktatörlükte yapılabilir.`, 'warning');
    } else {
        addLog(`Yeterli bütçe yok! Muhalefeti bastırma maliyeti: $${cost.toLocaleString()}`, 'warning');
    }
    updateGameStats();
});

improveRelationsBtn.addEventListener('click', () => {
    const cost = 2000000;
    if (budget >= cost) {
        budget -= cost;
        weeklyBudgetChange -= cost;
        foreignRelations = Math.min(foreignRelations + 5, 100); // Haftalık küçük artış
        addLog(`Dış ilişkileri geliştirmeye $${cost.toLocaleString()} yatırım yapıldı. Dış ilişkiler puanı arttı.`);
    } else {
        addLog(`Yeterli bütçe yok! Dış ilişki geliştirme maliyeti: $${cost.toLocaleString()}`, 'warning');
    }
    updateGameStats();
});

declareWarBtn.addEventListener('click', () => {
    const cost = 50000000;
    if (budget < cost) {
        addLog(`Yeterli bütçe yok! Savaş başlatmak için $${cost.toLocaleString()} gerekiyor.`, 'warning');
        return;
    }
    
    budget -= cost;
    weeklyBudgetChange -= cost;
    addLog(`Savaş ilan edildi! Bu kararın sonuçları ağır olabilir...`, 'danger');
    
    // Savaş sonuçları haftalık olarak şekillensin veya tek seferlik büyük bir olay olsun
    // Şimdilik basit bir tek seferlik sonuç
    const outcome = Math.random();
    if (outcome < 0.3) {
        addLog(`Savaşı kaybettiniz! Büyük kayıplar yaşandı, GSYİH ve memnuniyet düştü.`, 'danger');
        gdp *= 0.9;
        satisfaction -= 20;
        population *= 0.95;
    } else if (outcome < 0.7) {
        addLog(`Savaş berabere bitti. Kayıplar var ama durum kontrol altında.`, 'warning');
        gdp *= 0.98;
        satisfaction -= 10;
    } else {
        addLog(`Savaşı kazandınız! Moral yükseldi, kaynaklar elde edildi.`, 'success');
        gdp *= 1.02;
        satisfaction += 15;
        budget += 50000000;
    }
    declareWarBtn.disabled = true; // Savaş ilan edildikten sonra tekrar hemen ilan edilmez
    updateGameStats();
});

signTradeDealBtn.addEventListener('click', () => {
    const cost = 1000000;
    if (budget >= cost) {
        budget -= cost;
        weeklyBudgetChange -= cost;
        gdp *= 1.001; // Ticaret GSYİH'yi hafif artırır
        foreignRelations = Math.min(foreignRelations + 3, 100);
        addLog(`Yeni bir ticaret anlaşması imzalandı. Ekonomi ve dış ilişkiler güçlendi.`, 'success');
    } else {
        addLog(`Yeterli bütçe yok! Ticaret anlaşması maliyeti: $${cost.toLocaleString()}`, 'warning');
    }
    updateGameStats();
});


// Haftayı Bitir butonu olay dinleyicisi
endWeekBtn.addEventListener('click', () => {
    endWeek(); // Haftayı bitir fonksiyonunu çağır
});

// Oyun ilk yüklendiğinde
resetGame();
