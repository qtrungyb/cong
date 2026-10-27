/* ===== STATE & UTILS ===== */
const LS_BASE = 'bangcong_v30';
const LS_OLD = 'bangcong_v29';
const WD = ['CN','T2','T3','T4','T5','T6','T7'];

const RATES = { TH:170000, TCN:220000, HNT:300000, HNN:330000, YBT:180000, YBN:200000 };

// ✅ NEW: Tên mục mặc định dùng chung cho khởi tạo & reset
const DEFAULT_SYS_NAMES = {
  base: 'Lương cơ bản', cash: 'Tiền mặt', allowance: 'Trợ cấp', raise: 'Lương tăng',
  bhxh: 'BHXH', bhyt: 'BHYT', bhtn: 'BHTN', quy: 'Quỹ khoa / Hội ĐD', cd: 'Công đoàn', qdd: 'Quỹ Điều dưỡng'
};

const MAIN_VALUE = { 'x':1, 'x/2':0.5, 'CT':1, 'CT/2':0.5, 'L':0, 'P':0, 'O':0 };
const INFO = {
  'x':    { code:'x',    label:'Đi làm',         sub:'1 công' },
  'x/2':  { code:'x/2',  label:'Nửa ngày',       sub:'0,5 công' },
  'CT':   { code:'CT',   label:'Công tác',       sub:'1 công' },
  'CT/2': { code:'CT/2', label:'CT nửa ngày',    sub:'0,5 công' },
  'L':    { code:'L',    label:'Nghỉ lễ',        sub:'có lương' },
  'P':    { code:'P',    label:'Nghỉ phép',      sub:'—' },
  'O':    { code:'O',    label:'Không phép',     sub:'không lương' },
  'TH':   { code:'TH',   label:'Trực thường',    sub:'170.000 đ' },
  'TCN':  { code:'TCN',  label:'Trực CN',        sub:'220.000 đ' },
  'HNT':  { code:'HNT',  label:'Hà Nội · giờ',   sub:'300.000 đ' },
  'HNN':  { code:'HNN',  label:'Hà Nội · ngoài', sub:'330.000 đ' },
  'YBT':  { code:'YBT',  label:'Yên Bái · giờ',  sub:'180.000 đ' },
  'YBN':  { code:'YBN',  label:'Yên Bái · ngoài',sub:'200.000 đ' }
};

const svgWallet = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>`;
const svgBanknote = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>`;
const svgGift = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`;
const svgTrendingUp = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`;
const svgClock = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const svgMapPin = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
const svgShield = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
const getSvgEdit = (path) => `<svg data-edit-sys="${path}" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left:4px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
const svgTrash = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;
const svgPlus = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;

const now = new Date();
const state = {
  month: now.getMonth() + 1, year: now.getFullYear(),
  standard: 24.5, capStandard: 24,
  base: 6000000, cash: 2200000, allowance: 500000,
  raiseMax: 480000, raiseStandard: 24, countLeave: false,
  ded: { bhxh:480000, bhyt:90000, bhtn:60000, quy:100000, cd:40000, qdd:30000 },
  customIncome: [], customDeductions: [], days: {},
  // ✅ FIX: dùng hằng số mặc định
  sysNames: { ...DEFAULT_SYS_NAMES }
};

let currentUid = null, currentEmail = '', currentRole = null;
let currentProfile = { displayName: '', photoURL: '' };
let activeListeners = [], applyingRemote = false, pendingWrite = false, fbTimer = 0;
let activeDay = null, currentGroups = [], sheetMode = null, pickYear = state.year;

const $ = s => document.querySelector(s);
const nf = new Intl.NumberFormat('vi-VN');
const dim = (y, m) => new Date(y, m, 0).getDate();
const dk = (y, m, d) => y + '-' + String(m).padStart(2,'0') + '-' + String(d).padStart(2,'0');
const mk = () => state.year + '_' + state.month;
const todayKey = () => { const t = new Date(); return dk(t.getFullYear(), t.getMonth()+1, t.getDate()); };
const fmtInt = n => nf.format(Math.round(n || 0));
const fmtMoney = n => fmtInt(n) + ' đ';
const fmtQty = n => nf.format(Math.round((n || 0) * 10) / 10);
const tapFeedback = () => { if (navigator.vibrate) navigator.vibrate(8); };
function formatMoneyInput(num) {
  if (num === '' || num === null || num === undefined) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
function parseMoneyInput(str) {
  if (!str) return 0;
  return parseInt(str.toString().replace(/\./g, ''), 10) || 0;
}
function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function getInitial(name, email) { let n = (name || '').trim(); if (n) { const parts = n.split(/\s+/); return parts[parts.length - 1].charAt(0).toUpperCase(); } return (email || '?').trim().charAt(0).toUpperCase() || '?'; }
function avatarColor(str) { if (!str) return '#2563eb'; let hash = 0; for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash); const colors = ['#2563eb','#7c3aed','#db2777','#dc2626','#ea580c','#ca8a04','#16a34a','#0891b2','#0f766e']; return colors[Math.abs(hash) % colors.length]; }

function resetState() {
  const t = new Date();
  state.month = t.getMonth()+1; state.year = t.getFullYear();
  state.standard = calcAutoStandard(state.year, state.month);
  state.capStandard = 24;
  state.base = 6000000; state.cash = 2200000; state.allowance = 500000;
  state.raiseMax = 480000; state.raiseStandard = 24; state.countLeave = false;
  state.ded = { bhxh:480000, bhyt:90000, bhtn:60000, quy:100000, cd:40000, qdd:30000 };
  state.customIncome = []; state.customDeductions = []; state.days = {};
  currentProfile = { displayName: '', photoURL: '' };
  // ✅ FIX: dùng hằng số mặc định
  state.sysNames = { ...DEFAULT_SYS_NAMES };
}

function calcAutoStandard(y, m) {
  const n = dim(y, m); let cnt = 0;
  for (let d = 1; d <= n; d++) {
    const wd = new Date(y, m-1, d).getDay();
    if (wd === 0) continue;
    if (wd === 6) cnt += 0.5; else cnt += 1;
  }
  return Math.round(cnt * 10) / 10;
}

/* ===== THEME ===== */
let currentTheme = localStorage.getItem('theme') || 'light';
const svgSun = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
const svgMoon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

function applyTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  const themeIcon = $('#themeIcon'), text = $('#themeText');
  if (theme === 'dark') { if (themeIcon) themeIcon.innerHTML = svgSun; if (text) text.textContent = 'Giao diện sáng'; }
  else { if (themeIcon) themeIcon.innerHTML = svgMoon; if (text) text.textContent = 'Giao diện tối'; }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#1e293b' : '#2563eb');
}

/* ===== LOCAL STORAGE ===== */
const lsSettings = () => LS_BASE + '_' + currentUid + '_settings';
const lsMonth = () => LS_BASE + '_' + currentUid + '_m_' + mk();

function saveLocal() {
  if (!currentUid) return;
  try {
    const s = {
      standard: state.standard, capStandard: state.capStandard,
      base: state.base, cash: state.cash, allowance: state.allowance,
      raiseMax: state.raiseMax, raiseStandard: state.raiseStandard,
      countLeave: state.countLeave, ded: state.ded,
      customIncome: state.customIncome, customDeductions: state.customDeductions
    };
    localStorage.setItem(lsSettings(), JSON.stringify(s));
    localStorage.setItem(lsMonth(), JSON.stringify(state.days));
  } catch (e) {}
}
function loadLocal() {
  try {
    const s = JSON.parse(localStorage.getItem(lsSettings()) || 'null');
    if (s) Object.keys(s).forEach(k => {
      if (k === 'ded') Object.assign(state.ded, s.ded || {});
      else if (s[k] !== undefined) state[k] = s[k];
    });
    const d = JSON.parse(localStorage.getItem(lsMonth()) || 'null');
    if (d) state.days = d;
  } catch (e) {}
}
function loadLocalForMonth() {
  try { state.days = JSON.parse(localStorage.getItem(lsMonth()) || 'null') || {}; }
  catch (e) { state.days = {}; }
}

/* ===== FIREBASE DATA SYNC ===== */
async function ensureRole() {
  if (!rtdb || !currentUid) return 'user';
  const roleRef = rtdb.ref(DB_ROOT + '/roles/' + currentUid);
  try {
    const snap = await roleRef.once('value');
    if (snap.exists()) return snap.val();
    const allSnap = await rtdb.ref(DB_ROOT + '/roles').once('value');
    const all = allSnap.val() || {};
    const hasAdmin = Object.values(all).some(r => r === 'admin');
    const role = hasAdmin ? 'user' : 'admin';
    await roleRef.set(role);
    return role;
  } catch (e) { try { await roleRef.set('user'); } catch (e2) {} return 'user'; }
}

async function loadUserProfile() {
  if (!rtdb || !currentUid) return;
  try {
    const snap = await rtdb.ref(DB_ROOT + '/users/' + currentUid + '/profile').once('value');
    currentProfile = snap.val() || {};
    if (!currentProfile.displayName) currentProfile.displayName = currentEmail.split('@')[0];
  } catch (e) { currentProfile.displayName = currentEmail.split('@')[0]; }
}

function attachRoleListener() {
  if (!rtdb || !currentUid) return;
  const ref = rtdb.ref(DB_ROOT + '/roles/' + currentUid);
  ref.on('value', snap => {
    const nr = snap.val() || 'user';
    if (nr !== currentRole) {
      currentRole = nr;
      updateAvatarUI();
      if (sheetMode === 'admin' && currentRole !== 'admin') { hideSheet(); showToast('Bạn không còn quyền Admin'); }
      if (sheetMode === 'settings') openSettings();
    }
  });
  activeListeners.push(ref);
}

function updateAvatarUI() {
  const name = currentProfile.displayName || currentEmail.split('@')[0];
  const photoURL = currentProfile.photoURL || '';
  const color = avatarColor(currentEmail);
  const init = getInitial(name, currentEmail);

  const hImg = $('#avatarImg'), hInit = $('#avatarInitial');
  if (photoURL) { hImg.src = photoURL; hImg.style.display = 'block'; hInit.style.display = 'none'; }
  else { hImg.style.display = 'none'; hInit.style.display = 'grid'; hInit.textContent = init; hInit.style.background = color; }

  const ddImg = $('#ddImg'), ddInit = $('#ddInitial');
  if (photoURL) { ddImg.src = photoURL; ddImg.style.display = 'block'; ddInit.style.display = 'none'; }
  else { ddImg.style.display = 'none'; ddInit.style.display = 'grid'; ddInit.textContent = init; ddInit.style.background = color; }

  $('#ddName').textContent = name;
  const rl = $('#ddRole');
  if (currentRole === 'admin') {
    rl.className = 'dd-role admin';
    rl.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Admin';
  } else if (currentRole === 'user') {
    rl.className = 'dd-role user';
    rl.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> User';
  } else { rl.className = 'dd-role'; rl.textContent = '—'; }
  $('#ddAdmin').hidden = currentRole !== 'admin';
}

function showMainApp() {
  $('#loadingScreen').style.display = 'none';
  $('#authScreen').style.display = 'none';
  $('#mainApp').style.display = 'block';
  $('#bottombar').style.display = 'flex';
}

async function loadUserData() {
  loadLocal(); updateMonthLabel(); updateAll();
  try { await loadUserProfile(); currentRole = await ensureRole(); } catch (e) { currentRole = 'user'; }
  updateAvatarUI();

  try {
    const snap = await rtdb.ref(DB_ROOT + '/users/' + currentUid + '/settings').once('value');
    const v = snap.val();
    if (v && Object.keys(v).length > 0) {
      applyingRemote = true;
      Object.keys(v).forEach(k => {
        if (k === 'ded') Object.assign(state.ded, v.ded || {});
        else if (v[k] !== undefined) state[k] = v[k];
      });
      if (state.capStandard === undefined) state.capStandard = 24;
      saveLocal(); applyingRemote = false;
      updateMonthLabel(); updateAll();
    } else {
      pushAllToFirebase();
    }
    attachListeners(); attachRoleListener();
  } catch (e) { attachListeners(); attachRoleListener(); }
}

function attachListeners() {
  detachAllListeners();
  if (!firebaseReady || !currentUid) return;

  const pRef = rtdb.ref(DB_ROOT + '/users/' + currentUid + '/profile');
  pRef.on('value', snap => {
    const v = snap.val() || {};
    if (v.displayName || v.photoURL) {
      currentProfile.displayName = v.displayName || currentProfile.displayName;
      currentProfile.photoURL = v.photoURL || '';
      updateAvatarUI();
    }
  });
  activeListeners.push(pRef);

  const sRef = rtdb.ref(DB_ROOT + '/users/' + currentUid + '/settings');
  sRef.on('value', snap => {
    if (applyingRemote) return;
    const v = snap.val(); if (!v) return;
    applyingRemote = true;
    Object.keys(v).forEach(k => {
      if (k === 'ded') Object.assign(state.ded, v.ded || {});
      else if (v[k] !== undefined) state[k] = v[k];
    });
    if (state.capStandard === undefined) state.capStandard = 24;
    saveLocal(); applyingRemote = false;
    updateMonthLabel(); renderCalendar(); renderStats(compute());
    if (sheetMode === 'settings') openSettings();
  });
  activeListeners.push(sRef);

  const mRef = rtdb.ref(DB_ROOT + '/users/' + currentUid + '/months/' + mk());
  mRef.on('value', snap => {
    if (applyingRemote) return;
    const v = snap.val();
    applyingRemote = true;
    if (v && typeof v === 'object') state.days = v;
    else if (v === null && Object.keys(state.days).length > 0) { applyingRemote = false; scheduleFirebase(); applyingRemote = true; }
    saveLocal(); renderCalendar(); renderStats(compute()); applyingRemote = false;
  });
  activeListeners.push(mRef);

  // ✅ FIX: Đồng bộ tên mục hệ thống (global, mọi user đều thấy)
  const snRef = rtdb.ref(DB_ROOT + '/system/names');
  snRef.on('value', snap => {
    const v = snap.val() || {};
    const merged = { ...DEFAULT_SYS_NAMES, ...v };
    let changed = false;
    for (const k of Object.keys(merged)) {
      if (state.sysNames[k] !== merged[k]) { changed = true; break; }
    }
    state.sysNames = merged;
    if (changed && sheetMode === 'settings') {
      const bodyEl = $('#sheetBody');
      if (bodyEl) bodyEl.innerHTML = buildSettingsBody();
    }
  });
  activeListeners.push(snRef);
}

function detachAllListeners() { activeListeners.forEach(ref => { try { ref.off(); } catch (e) {} }); activeListeners = []; }

function scheduleFirebase() {
  if (!firebaseReady || !currentUid || applyingRemote) return;
  pendingWrite = true; clearTimeout(fbTimer); fbTimer = setTimeout(flushFirebase, 450);
}

function flushFirebase() {
  if (!firebaseReady || !currentUid) return;
  const writes = pendingWrite; pendingWrite = false;
  const s = {
    standard: state.standard, capStandard: state.capStandard,
    base: state.base, cash: state.cash, allowance: state.allowance,
    raiseMax: state.raiseMax, raiseStandard: state.raiseStandard,
    countLeave: state.countLeave, ded: state.ded,
    customIncome: state.customIncome, customDeductions: state.customDeductions
  };
  rtdb.ref(DB_ROOT + '/users/' + currentUid + '/settings').set(s).catch(onWriteError);
  if (writes) rtdb.ref(DB_ROOT + '/users/' + currentUid + '/months/' + mk()).set(state.days).catch(onWriteError);
}

function pushAllToFirebase() {
  if (!firebaseReady || !currentUid) return;
  const s = {
    standard: state.standard, capStandard: state.capStandard,
    base: state.base, cash: state.cash, allowance: state.allowance,
    raiseMax: state.raiseMax, raiseStandard: state.raiseStandard,
    countLeave: state.countLeave, ded: state.ded,
    customIncome: state.customIncome, customDeductions: state.customDeductions
  };
  rtdb.ref(DB_ROOT + '/users/' + currentUid + '/settings').set(s).catch(onWriteError);
  rtdb.ref(DB_ROOT + '/users/' + currentUid + '/months/' + mk()).set(state.days).catch(onWriteError);
}
function onWriteError(err) { showToast('Lỗi lưu: ' + (err.message || 'không rõ')); }
function save() { saveLocal(); scheduleFirebase(); }
function flushNow() { clearTimeout(fbTimer); if (pendingWrite) flushFirebase(); }

// Gán các hàm cần thiết vào window để file auth.js có thể gọi
window.flushNow = flushNow;
window.detachAllListeners = detachAllListeners;
window.closeDropdown = closeDropdown;
window.hideSheet = hideSheet;

/* ===== COMPUTE & RENDER ===== */
function compute() {
  const n = dim(state.year, state.month);
  const c = { 'x':0,'x/2':0,'CT':0,'CT/2':0,'L':0,'P':0,'O':0,'TH':0,'TCN':0,'HNT':0,'HNN':0,'YBT':0,'YBN':0 };
  let workMain = 0, workCT = 0;

  for (let d = 1; d <= n; d++) {
    const k = dk(state.year, state.month, d);
    const e = state.days[k]; if (!e) continue;
    const wd = new Date(state.year, state.month-1, d).getDay();
    const isSat = (wd === 6);
    if (e.main && c[e.main] !== undefined) c[e.main]++;
    if (e.truc && c[e.truc] !== undefined) c[e.truc]++;
    if (e.ct && c[e.ct] !== undefined) c[e.ct]++;

    let dw = MAIN_VALUE[e.main] || 0;
    if (isSat && dw > 0.5) dw = 0.5;
    if (e.main === 'CT' || e.main === 'CT/2') workCT += dw;
    else workMain += dw;
  }

  const workTotal = workMain + workCT;
  const actual = workMain + (state.countLeave ? c['L'] + c['P'] : 0);
  const cap = state.capStandard > 0 ? state.capStandard : 24;
  const capEff = Math.min(actual, cap);

  let salary = state.base / cap * actual;
  let cashM = state.cash / cap * capEff;
  let allowM = state.allowance / cap * capEff;

  const rs = state.raiseStandard > 0 ? state.raiseStandard : 1;
  let raisePay = Math.min(state.raiseMax, state.raiseMax / rs * actual);

  let customIncomeTotal = 0;
  state.customIncome.forEach(item => {
    if (item.type === 'calc') customIncomeTotal += item.value / cap * actual;
    else customIncomeTotal += item.value;
  });

  const trucM = c['TH']*RATES.TH + c['TCN']*RATES.TCN;
  const ctM = c['HNT']*RATES.HNT + c['HNN']*RATES.HNN + c['YBT']*RATES.YBT + c['YBN']*RATES.YBN;
  const total = salary + cashM + allowM + raisePay + customIncomeTotal + trucM + ctM;

  let ded = 0;
  ['bhxh','bhyt','bhtn','quy','cd','qdd'].forEach(k => { ded += (state.ded[k] || 0); });
  state.customDeductions.forEach(item => { ded += item.value; });

  const take = total - ded;
  const missing = state.standard - workTotal;
  let rank = 'C';
  if (missing < 2) rank = 'A';
  else if (missing >= 18) rank = 'TẠCH';
  else if (missing < 7) rank = 'B';

  return { c, workMain, workCT, workTotal, actual, cap, salary, cashM, allowM, raisePay, customIncomeTotal, trucM, ctM, total, ded, take, missing, rank };
}

function renderCalendar() {
  const y = state.year, m = state.month, n = dim(y, m);
  const offset = (new Date(y, m-1, 1).getDay() + 6) % 7;
  let html = '';
  for (let i = 0; i < offset; i++) html += '<div class="cell empty"></div>';
  for (let d = 1; d <= n; d++) {
    const k = dk(y, m, d);
    const e = state.days[k] || {};
    const wd = new Date(y, m-1, d).getDay();
    let cls = 'cell';
    if (wd === 0) cls += ' sun';
    if (k === todayKey()) cls += ' today';
    if (e.main || e.truc || e.ct) cls += ' has';
    let inner = '<span class="d">' + d + '</span>';
    
    let mainClass = '';
    if (e.main) {
      if (e.main === 'L') mainClass = 'k-l';
      else if (e.main === 'P') mainClass = 'k-p';
      else if (e.main === 'O') mainClass = 'k-o';
      else if (e.main === 'CT' || e.main === 'CT/2') mainClass = 'k-ct';
      else mainClass = 'k-x';
      inner += '<span class="m ' + mainClass + '">' + INFO[e.main].code + '</span>';
    }
    
    const tags = [];
    if (e.truc) tags.push('<i class="tg truc">' + e.truc + '</i>');
    if (e.ct) tags.push('<i class="tg ct">' + e.ct + '</i>');
    if (tags.length) inner += '<span class="tags">' + tags.join('') + '</span>';
    
    html += '<button type="button" class="' + cls + '" data-key="' + k + '">' + inner + '</button>';
  }
  $('#calGrid').innerHTML = html;
}

function updateCell(k) {
  const el = document.querySelector('[data-key="' + k + '"]'); if (!el) return;
  const p = k.split('-').map(Number);
  const d = p[2], m = p[1], y = p[0];
  const e = state.days[k] || {};
  const wd = new Date(y, m-1, d).getDay();
  
  let cls = 'cell';
  if (wd === 0) cls += ' sun';
  if (k === todayKey()) cls += ' today';
  if (e.main || e.truc || e.ct) cls += ' has';
  
  let inner = '<span class="d">' + d + '</span>';
  if (e.main) {
    let mainClass = '';
    if (e.main === 'L') mainClass = 'k-l';
    else if (e.main === 'P') mainClass = 'k-p';
    else if (e.main === 'O') mainClass = 'k-o';
    else if (e.main === 'CT' || e.main === 'CT/2') mainClass = 'k-ct';
    else mainClass = 'k-x';
    inner += '<span class="m ' + mainClass + '">' + INFO[e.main].code + '</span>';
  }
  
  const tags = [];
  if (e.truc) tags.push('<i class="tg truc">' + e.truc + '</i>');
  if (e.ct) tags.push('<i class="tg ct">' + e.ct + '</i>');
  if (tags.length) inner += '<span class="tags">' + tags.join('') + '</span>';
  
  const tmp = document.createElement('div');
  tmp.innerHTML = '<button type="button" class="' + cls + '" data-key="' + k + '">' + inner + '</button>';
  el.replaceWith(tmp.firstElementChild);
}

function renderStats(r) {
  $('#stWork').textContent = fmtQty(r.workTotal);
  $('#stActual').textContent = fmtQty(r.actual);
  $('#stTruc').textContent = r.c['TH'] + r.c['TCN'];
  $('#stCt').textContent = fmtQty(r.workCT);
  $('#stRank').textContent = r.rank;
  
  const sr = $('#statRank');
  sr.classList.remove('r-A','r-B','r-C','r-T');
  if (r.rank === 'A') sr.classList.add('r-A');
  else if (r.rank === 'B') sr.classList.add('r-B');
  else if (r.rank === 'C') sr.classList.add('r-C');
  else sr.classList.add('r-T');
  
  $('#bbTake').textContent = fmtMoney(r.take);

  $('#stActual2').textContent = fmtQty(r.actual);
  $('#stCap').textContent = fmtQty(r.cap);
  const pct = Math.min(100, (r.actual / r.cap) * 100);
  const fill = $('#targetFill');
  fill.style.width = pct + '%';
  fill.classList.toggle('reached', r.actual >= r.cap);
}

function buildSalaryHtml(r) {
  const cap = r.cap, capEff = Math.min(r.actual, cap);
  const rs = state.raiseStandard > 0 ? state.raiseStandard : 1;
  
  const addRow = (icon, name, calc, amount, cls) => {
    return `<div class="sal-row">
      <div class="sal-icon ${cls || ''}">${icon}</div>
      <div class="sal-info">
        <div class="sal-name">${name}</div>
        ${calc ? `<div class="sal-calc">${calc}</div>` : ''}
      </div>
      <div class="sal-amount ${cls || ''}">${amount}</div>
    </div>`;
  };

  let incomeHtml = '';
  const over = r.actual > cap ? ` (+${fmtQty(r.actual - cap)})` : '';
  
  incomeHtml += addRow(svgWallet, state.sysNames.base, `${fmtInt(state.base)} ÷ ${fmtQty(cap)} × ${fmtQty(r.actual)}${over}`, fmtInt(r.salary), 'plus');
  incomeHtml += addRow(svgBanknote, state.sysNames.cash, `${fmtInt(state.cash)} ÷ ${fmtQty(cap)} × ${fmtQty(capEff)}${r.actual>cap?' (tối đa)':''}`, fmtInt(r.cashM), 'plus');
  incomeHtml += addRow(svgGift, state.sysNames.allowance, `${fmtInt(state.allowance)} ÷ ${fmtQty(cap)} × ${fmtQty(capEff)}${r.actual>cap?' (tối đa)':''}`, fmtInt(r.allowM), 'plus');
  if (state.raiseMax > 0) {
    incomeHtml += addRow(svgTrendingUp, state.sysNames.raise, `${fmtInt(state.raiseMax)} ÷ ${fmtQty(rs)} × ${fmtQty(Math.min(r.actual, rs))}${r.actual>=rs?' (tối đa)':''}`, fmtInt(r.raisePay), 'plus');
  }

  state.customIncome.forEach(item => {
    const calc = item.type === 'calc' ? `${fmtInt(item.value)} ÷ ${fmtQty(cap)} × ${fmtQty(r.actual)}` : 'Cố định';
    const amt = item.type === 'calc' ? item.value / cap * r.actual : item.value;
    incomeHtml += addRow(svgWallet, item.name, calc, fmtInt(amt), 'plus');
  });
  
  if (r.c['TH']) incomeHtml += addRow(svgClock, `Trực thường × ${r.c['TH']}`, '170.000 đ/ngày', fmtInt(r.c['TH']*RATES.TH), 'plus');
  if (r.c['TCN']) incomeHtml += addRow(svgClock, `Trực chủ nhật × ${r.c['TCN']}`, '220.000 đ/ngày', fmtInt(r.c['TCN']*RATES.TCN), 'plus');
  if (r.c['HNT']) incomeHtml += addRow(svgMapPin, `Hà Nội trong giờ × ${r.c['HNT']}`, '300.000 đ/lần', fmtInt(r.c['HNT']*RATES.HNT), 'plus');
  if (r.c['HNN']) incomeHtml += addRow(svgMapPin, `Hà Nội ngoài giờ × ${r.c['HNN']}`, '330.000 đ/lần', fmtInt(r.c['HNN']*RATES.HNN), 'plus');
  if (r.c['YBT']) incomeHtml += addRow(svgMapPin, `Yên Bái trong giờ × ${r.c['YBT']}`, '180.000 đ/lần', fmtInt(r.c['YBT']*RATES.YBT), 'plus');
  if (r.c['YBN']) incomeHtml += addRow(svgMapPin, `Yên Bái ngoài giờ × ${r.c['YBN']}`, '200.000 đ/lần', fmtInt(r.c['YBN']*RATES.YBN), 'plus');

  incomeHtml += `<div class="sal-row total"><div class="sal-info"><div class="sal-name">Tổng thu nhập</div></div><div class="sal-amount">${fmtInt(r.total)}</div></div>`;

  let dedHtml = '';
  const dedMap = {
    bhxh: state.sysNames.bhxh, bhyt: state.sysNames.bhyt, bhtn: state.sysNames.bhtn,
    quy: state.sysNames.quy, cd: state.sysNames.cd, qdd: state.sysNames.qdd
  };
  Object.keys(dedMap).forEach(k => {
    if (state.ded[k] > 0) {
      dedHtml += addRow(svgShield, dedMap[k], '', `−${fmtInt(state.ded[k])}`, 'minus');
    }
  });
  state.customDeductions.forEach(item => {
    dedHtml += addRow(svgShield, item.name, 'Cố định', `−${fmtInt(item.value)}`, 'minus');
  });

  if (r.ded > 0) {
    dedHtml += `<div class="sal-row total"><div class="sal-info"><div class="sal-name">Tổng khấu trừ</div></div><div class="sal-amount minus">−${fmtInt(r.ded)}</div></div>`;
  } else {
    dedHtml = '<div style="padding: 12px 0; text-align: center; color: var(--muted); font-size: 13px;">Không có khoản khấu trừ nào</div>';
  }

  const takePct = r.total > 0 ? Math.min(100, (r.take / r.total) * 100) : 100;

  return `
    <div class="sal-hero">
      <div class="sal-hero-label">Thực lĩnh</div>
      <div class="sal-hero-amount">${fmtMoney(r.take)}</div>
      <div class="sal-bar"><div class="sal-bar-fill" style="width: ${takePct}%"></div></div>
      <div class="sal-hero-sub"><span>Thu nhập: ${fmtMoney(r.total)}</span><span>Khấu trừ: ${fmtMoney(r.ded)}</span></div>
    </div>
    <div class="sal-section"><div class="sal-section-title">Thu nhập</div>${incomeHtml}</div>
    <div class="sal-section"><div class="sal-section-title">Khấu trừ</div>${dedHtml}</div>
  `;
}

function updateMonthLabel() {
  $('#monthLabel').innerHTML = 'Tháng ' + state.month + '/' + state.year + '<span class="caret">▾</span>';
}

function updateAll() {
  saveLocal();
  renderCalendar();
  renderStats(compute());
}

function refreshUI() { save(); renderStats(compute()); }

let toastTimer = 0;
function showToast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
}

/* ===== SHEET CHUNG ===== */
function showSheet() { $('#sheet').classList.add('open'); $('#backdrop').classList.add('open'); document.body.style.overflow = 'hidden'; closeDropdown(); }
function hideSheet() { $('#sheet').classList.remove('open'); $('#backdrop').classList.remove('open'); document.body.style.overflow = ''; activeDay = null; sheetMode = null; }
function setSheet(title, sub, bodyHtml, actionsHtml) {
  $('#sheetTitle').innerHTML = title + (sub ? '<small>' + sub + '</small>' : '');
  $('#sheetBody').innerHTML = bodyHtml; $('#sheetActions').innerHTML = actionsHtml;
  showSheet(); $('#sheetBody').scrollTop = 0;
}

/* ===== NGÀY SHEET ===== */
function daySheetBody() {
  const e = state.days[activeDay] || {};
  let html = '';
  currentGroups.forEach(g => {
    const isOne = g.codes.length === 1;
    html += '<div class="pgrp"><div class="pgrp-lbl"><span class="name">' + g.label + '</span>' +
            (g.hint ? '<span class="hint">' + g.hint + '</span>' : '') +
            '</div><div class="popts' + (isOne ? ' one' : '') + '">';
    g.codes.forEach(code => {
      const info = INFO[code];
      const on = e[g.key] === code ? ' on' : '';
      html += '<button type="button" class="pop-opt' + on + ' ' + g.key +
              '" data-g="' + g.key + '" data-c="' + code + '">' +
              '<span class="l">' + info.label + '</span>' +
              (info.sub ? '<span class="s">' + info.sub + '</span>' : '') + '</button>';
    });
    html += '</div></div>';
  });
  return html;
}
function hasDayData(k) {
  const e = state.days[k] || {};
  return !!(e.main || e.truc || e.ct);
}
function buildDayActions() {
  const need = activeDay && hasDayData(activeDay);
  return (need ? '<button type="button" class="btn danger" data-act="clear">Xóa</button>' : '') +
         '<button type="button" class="btn primary" data-act="done">Đóng</button>';
}
function openDaySheet(k) {
  activeDay = k; sheetMode = 'day';
  const dayType = getDayType(k);
  const p = k.split('-').map(Number);
  const dt = new Date(p[0], p[1]-1, p[2]);
  if (dayType === 'saturday') {
    const cur = state.days[k];
    if (cur) {
      let ch = false;
      if (cur.main === 'x') { cur.main = 'x/2'; ch = true; }
      else if (cur.main === 'CT') { cur.main = 'CT/2'; ch = true; }
      if (ch) { save(); updateCell(k); }
    }
    if (!state.days[k]) {
      state.days[k] = { main: 'x/2' }; save(); updateCell(k); renderStats(compute());
    }
  }
  const tl = dayType === 'sunday' ? 'Chủ nhật'
           : (dayType === 'saturday' ? 'Thứ 7 · tối đa ½ ngày' : 'Ngày thường');
  const title = WD[dt.getDay()] + ', ' + String(p[2]).padStart(2,'0') + '/' +
                String(p[1]).padStart(2,'0') + '/' + p[0];
  currentGroups = getGroupsForDay(dayType);
  setSheet(title, tl, daySheetBody(), buildDayActions());
}
function getDayType(k) {
  const p = k.split('-').map(Number);
  const wd = new Date(p[0], p[1]-1, p[2]).getDay();
  if (wd === 0) return 'sunday';
  if (wd === 6) return 'saturday';
  return 'weekday';
}
function getGroupsForDay(dt) {
  const ctG = { key:'ct', label:'Đi công tác', hint:'không bắt buộc', codes:['HNT','HNN','YBT','YBN'] };
  if (dt === 'sunday') return [ { key:'truc', label:'Trực chủ nhật', hint:'', codes:['TCN'] }, ctG ];
  if (dt === 'saturday') return [
    { key:'main', label:'Công / nghỉ', hint:'tối đa ½ ngày', codes:['x/2','CT/2','L','P','O'] },
    { key:'truc', label:'Trực thường', hint:'không bắt buộc', codes:['TH'] }, ctG
  ];
  return [
    { key:'main', label:'Công / nghỉ', hint:'chọn 1', codes:['x','x/2','CT','CT/2','L','P','O'] },
    { key:'truc', label:'Trực thường', hint:'không bắt buộc', codes:['TH'] }, ctG
  ];
}

/* ===== THÁNG SHEET ===== */
function openMonthSheet() {
  activeDay = null; sheetMode = 'month'; pickYear = state.year;
  setSheet('Chọn tháng', 'Tháng / năm chấm công', buildMonthBody(),
    '<button type="button" class="btn primary" data-act="done">Đóng</button>');
}
function buildMonthBody() {
  let m = '';
  for (let i = 1; i <= 12; i++) {
    const on = (state.year === pickYear && state.month === i) ? ' on' : '';
    m += '<button type="button" class="mbtn' + on + '" data-m="' + i + '">T' + i + '</button>';
  }
  return '<div class="yearrow">' +
    '<button type="button" class="navbtn" data-yshift="-1"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>' +
    '<strong>' + pickYear + '</strong>' +
    '<button type="button" class="navbtn" data-yshift="1"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>' +
    '</div><div class="months">' + m + '</div>';
}

/* ===== CÀI ĐẶT SHEET ===== */
function openSettings() {
  activeDay = null; sheetMode = 'settings';
  setSheet('Cài đặt', 'Quản lý thu nhập & khấu trừ', buildSettingsBody(),
    '<button type="button" class="btn primary" data-act="done">Xong</button>');
  populateSettingsInputs(); updateSettingsPreview();
}
function buildSettingsBody() {
  let incomeRows = '';
  const addIncomeRow = (key, name, value, isCustom) => {
    const editBtn = (!isCustom && currentRole === 'admin') ? getSvgEdit(`income.${key}`) : '';
    const delBtn = isCustom ? `<button class="set-del-btn" data-del-custom="income.${key}">${svgTrash}</button>` : '';
    
    let hint = '';
    if (key === 'base') hint = 'Lương cứng theo hợp đồng';
    if (key === 'cash') hint = 'Tối đa theo chỉ tiêu';
    if (key === 'allowance') hint = 'Tối đa theo chỉ tiêu';
    if (key === 'raise') hint = 'Tối đa theo chỉ tiêu';

    return `
      <div class="set-row">
        <div class="set-row-left">
          <span class="set-row-label">${escapeHtml(name)} ${editBtn}</span>
          ${isCustom ? '<span class="custom-item-tag">Tùy chỉnh</span>' : (hint ? `<span class="field-hint">${hint}</span>` : '')}
        </div>
        <input type="text" inputmode="numeric" class="set-row-input" data-field="${isCustom ? 'customIncome' : 'income'}.${key}" value="${formatMoneyInput(value)}">
        ${delBtn}
      </div>
    `;
  };

  ['base', 'cash', 'allowance', 'raise'].forEach(k => {
    let val = state.base;
    if (k === 'cash') val = state.cash;
    if (k === 'allowance') val = state.allowance;
    if (k === 'raise') val = state.raiseMax;
    incomeRows += addIncomeRow(k, state.sysNames[k], val, false);
  });
  state.customIncome.forEach(item => {
    incomeRows += addIncomeRow(item.id, item.name, item.value, true);
  });

  let dedRows = '';
  const addDedRow = (key, name, value, isCustom) => {
    const editBtn = (!isCustom && currentRole === 'admin') ? getSvgEdit(`ded.${key}`) : '';
    const delBtn = isCustom ? `<button class="set-del-btn" data-del-custom="ded.${key}">${svgTrash}</button>` : '';
    return `
      <div class="set-row">
        <div class="set-row-left">
          <span class="set-row-label">${escapeHtml(name)} ${editBtn}</span>
          ${isCustom ? '<span class="custom-item-tag">Tùy chỉnh</span>' : ''}
        </div>
        <input type="text" inputmode="numeric" class="set-row-input" data-field="${isCustom ? 'customDeductions' : 'ded'}.${key}" value="${formatMoneyInput(value)}">
        ${delBtn}
      </div>
    `;
  };

  ['bhxh', 'bhyt', 'bhtn', 'quy', 'cd', 'qdd'].forEach(k => {
    dedRows += addDedRow(k, state.sysNames[k], state.ded[k] || 0, false);
  });
  state.customDeductions.forEach(item => {
    dedRows += addDedRow(item.id, item.name, item.value, true);
  });

  return `
    <div class="set-group-title">Cài đặt chung</div>
    <div class="set-group">
      <div class="set-row">
        <div class="set-row-left">
          <span class="set-row-label">Công đạt chỉ tiêu</span>
          <span class="field-hint">Mốc tính Lương cơ bản, Tiền mặt, Trợ cấp</span>
        </div>
        <input type="number" step="0.5" class="set-row-input" data-field="capStandard" value="${state.capStandard}">
      </div>
      
      <div class="set-row">
        <div class="set-row-left">
          <span class="set-row-label">Công chuẩn xếp loại</span>
          <span class="field-hint">Dùng để tính hạng A, B, C, TẠCH</span>
        </div>
        <input type="number" step="0.5" class="set-row-input" data-field="standard" value="${state.standard}">
      </div>

      <div class="set-row">
        <div class="set-row-left">
          <span class="set-row-label">Công tối đa (Lương tăng)</span>
          <span class="field-hint">Mốc đạt mức Lương tăng tối đa</span>
        </div>
        <input type="number" step="0.5" class="set-row-input" data-field="raiseStandard" value="${state.raiseStandard}">
      </div>
      
      <div class="set-action-row" data-act="autostd">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
        Tự tính công chuẩn tháng ${state.month}
      </div>

      <div class="set-row">
        <div class="set-row-left">
          <span class="set-row-label">Cộng Lễ/Phép vào lương</span>
        </div>
        <label class="ios-switch">
          <input type="checkbox" data-field="countLeave" ${state.countLeave?'checked':''}>
          <span class="ios-slider"></span>
        </label>
      </div>
    </div>

    <div class="set-group-title income">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
      Thu nhập
    </div>
    <div class="set-group">
      ${incomeRows}
      <div class="set-add-row" data-add="income">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Thêm khoản thu nhập
      </div>
    </div>

    <div class="set-group-title deduction">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
      Khấu trừ
    </div>
    <div class="set-group">
      ${dedRows}
      <div class="set-add-row" data-add="deduction">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Thêm khoản khấu trừ
      </div>
    </div>

    <div class="set-preview">
      <span>Thực lĩnh dự kiến</span>
      <strong id="setPreview">0 đ</strong>
    </div>
  `;
}
function populateSettingsInputs() { /* Inputs already populated */ }
function updateSettingsPreview() {
  const el = $('#setPreview'); if (el) el.textContent = fmtMoney(compute().take);
}

let currentAddType = 'income';
function openAddModal(type) {
  currentAddType = type;
  $('#addModalTitle').textContent = type === 'income' ? 'Thêm khoản thu nhập' : 'Thêm khoản khấu trừ';
  $('#newItemName').value = '';
  $('#newItemValue').value = '';
  $('#newItemTypeWrap').style.display = type === 'income' ? 'block' : 'none';
  $('#addModalBackdrop').classList.add('open');
  $('#addModal').classList.add('open');
  setTimeout(() => $('#newItemName').focus(), 100);
}
function closeAddModal() {
  $('#addModalBackdrop').classList.remove('open');
  $('#addModal').classList.remove('open');
}

/* ===== PROFILE SHEET ===== */
function openProfile() {
  activeDay = null; sheetMode = 'profile';
  const name = currentProfile.displayName || currentEmail.split('@')[0];
  const photoURL = currentProfile.photoURL || '';
  const color = avatarColor(currentEmail);
  const init = getInitial(name, currentEmail);

  let avatarHtml = '';
  if (photoURL) avatarHtml = '<img src="' + photoURL + '" alt="">';
  else avatarHtml = '<div style="width:100%;height:100%;background:' + color + ';display:grid;place-items:center;color:#fff;">' + init + '</div>';

  const body = `
    <div class="profile-banner">
      <div class="profile-avatar-wrap">
        <div class="profile-avatar">${avatarHtml}</div>
        <button type="button" class="profile-avatar-btn" id="btnEditAvatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
        </button>
      </div>
      <div style="display:flex;align-items:center;justify-content:center;gap:8px;">
        <h2 class="profile-name" id="profileNameDisplay">${escapeHtml(name)}</h2>
        <button type="button" id="btnEditName" style="background:rgba(255,255,255,0.2);border:0;color:#fff;border-radius:50%;width:28px;height:28px;display:grid;place-items:center;cursor:pointer;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        </button>
      </div>
      <div class="profile-email">${escapeHtml(currentEmail)}</div>
    </div>
    <div class="profile-actions">
      <button type="button" class="btn-outline" id="btnUploadAvatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Tải lên ảnh mới
      </button>
      ${photoURL ? `
      <button type="button" class="btn-outline" id="btnRemoveAvatar" style="color:var(--danger);border-color:rgba(220,38,38,0.3);">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> Xóa ảnh đại diện
      </button>` : ''}
    </div>
  `;

  setSheet('Hồ sơ cá nhân', 'Thông tin tài khoản', body, '<button type="button" class="btn primary" data-act="done">Đóng</button>');

  const fileInput = $('#avatarInput');
  const triggerUpload = () => fileInput.click();
  $('#btnEditAvatar').addEventListener('click', triggerUpload);
  $('#btnUploadAvatar').addEventListener('click', triggerUpload);

  $('#btnEditName').addEventListener('click', () => {
    const parent = $('#profileNameDisplay').parentElement;
    const oldName = currentProfile.displayName || currentEmail.split('@')[0];
    parent.innerHTML = `
      <input type="text" id="editNameInput" value="${escapeHtml(oldName)}" style="font-size:18px;font-weight:800;padding:6px 10px;border-radius:8px;border:0;background:#fff;color:#121a26;width:160px;text-align:center;outline:none;" maxlength="30">
      <button type="button" id="btnSaveName" style="background:#fff;border:0;color:var(--primary);font-weight:800;padding:6px 14px;border-radius:8px;cursor:pointer;font-size:14px;">Lưu</button>
    `;
    const inp = $('#editNameInput'); inp.focus();
    $('#btnSaveName').addEventListener('click', async () => {
      const newName = inp.value.trim();
      if (!newName) { showToast('Tên không được để trống'); return; }
      try {
        await rtdb.ref(DB_ROOT + '/users/' + currentUid + '/profile/displayName').set(newName);
        currentProfile.displayName = newName; updateAvatarUI(); openProfile(); showToast('Đã cập nhật tên');
      } catch (e) { showToast('Lỗi: ' + e.message); }
    });
  });

  const btnRemove = $('#btnRemoveAvatar');
  if (btnRemove) {
    btnRemove.addEventListener('click', async () => {
      if (!confirm('Xóa ảnh đại diện?')) return;
      try {
        await rtdb.ref(DB_ROOT + '/users/' + currentUid + '/profile/photoURL').remove();
        currentProfile.photoURL = ''; updateAvatarUI(); openProfile(); showToast('Đã xóa ảnh đại diện');
      } catch (e) { showToast('Lỗi: ' + e.message); }
    });
  }
}

/* ===== CHÚ THÍCH ===== */
function openHelp() {
  activeDay = null; sheetMode = 'help';
  setSheet('Chú thích', 'Mã chấm công', buildHelpBody(),
    '<button type="button" class="btn primary" data-act="done">Đóng</button>');
}
function buildHelpBody() {
  const gr = [
    { t: 'Công / nghỉ', i: [
      ['x', 'Đi làm (1 công)'], ['x/2', 'Làm nửa ngày (0,5)'],
      ['CT', 'Công tác (1 công)'], ['CT/2', 'Công tác nửa ngày'],
      ['L', 'Nghỉ lễ'], ['P', 'Nghỉ phép'], ['O', 'Không phép / không lương']
    ]},
    { t: 'Trực', i: [
      ['TH', 'Trực thường (170.000 đ)'], ['TCN', 'Trực chủ nhật (220.000 đ)']
    ]},
    { t: 'Đi công tác', i: [
      ['HNT', 'Hà Nội · trong giờ (300.000 đ)'],
      ['HNN', 'Hà Nội · ngoài giờ (330.000 đ)'],
      ['YBT', 'Yên Bái · trong giờ (180.000 đ)'],
      ['YBN', 'Yên Bái · ngoài giờ (200.000 đ)']
    ]}
  ];
  let html = '';
  gr.forEach(g => {
    html += '<div class="help-grp"><h3>' + g.t + '</h3><div class="help-list">';
    g.i.forEach(([c, d]) => {
      html += '<div class="help-item"><span class="help-code">' + c + '</span>' +
              '<span class="help-desc">' + d + '</span></div>';
    });
    html += '</div></div>';
  });
  html += '<div class="help-note">' +
    '<b>Lương theo công:</b> lương ÷ chỉ tiêu × công thực tế (vượt chỉ tiêu vẫn cộng).<br>' +
    '<b>Công tác (CT):</b> Không tính vào Công lương, chỉ tính vào tổng Công TT.<br>' +
    '<b>Tiền mặt &amp; Trợ cấp:</b> trần tại chỉ tiêu (24).<br>' +
    '<b>Thứ 7:</b> tối đa ½ ngày. <b>CN:</b> chỉ TCN và công tác.<br>' +
    'Người dùng đầu tiên là <b>Admin</b>. Dữ liệu lưu riêng theo tài khoản.' +
  '</div>';
  return html;
}

/* ===== LƯƠNG SHEET ===== */
function openSalary() {
  activeDay = null; sheetMode = 'salary';
  const r = compute();
  setSheet('Bảng lương tháng', `Tháng ${state.month}/${state.year}`, buildSalaryHtml(r),
    '<button type="button" class="btn primary" data-act="done">Đóng</button>');
}

/* ===== ADMIN SHEET ===== */
function openAdmin() {
  if (currentRole !== 'admin') { showToast('Chỉ Admin mới có quyền này'); return; }
  activeDay = null; sheetMode = 'admin';
  setSheet('Quản lý người dùng', 'Phân quyền Admin / User',
    '<div class="admin-loading">Đang tải danh sách…</div>',
    '<button type="button" class="btn ghost" data-act="refresh">Làm mới</button>' +
    '<button type="button" class="btn primary" data-act="done">Đóng</button>');
  loadAdminList();
}

async function loadAdminList() {
  if (!rtdb || currentRole !== 'admin') return;
  try {
    const rolesSnap = await rtdb.ref(DB_ROOT + '/roles').once('value');
    const roles = rolesSnap.val() || {};
    let usersData = {}, usersError = false;
    try {
      const usersSnap = await rtdb.ref(DB_ROOT + '/users').once('value');
      usersData = usersSnap.val() || {};
    } catch (e) { usersError = true; }

    const uidSet = new Set([...Object.keys(roles), ...Object.keys(usersData)]);
    if (uidSet.size === 0) { $('#sheetBody').innerHTML = '<div class="admin-loading">Chưa có người dùng nào.</div>'; return; }

    const userList = await Promise.all(Array.from(uidSet).map(async uid => {
      let email = null, name = null, photoURL = '';
      if (usersData[uid] && usersData[uid].profile) {
        const p = usersData[uid].profile; name = p.displayName; email = p.email; photoURL = p.photoURL;
      } else {
        try {
          const eSnap = await rtdb.ref(DB_ROOT + '/users/' + uid + '/profile').once('value');
          const p = eSnap.val() || {}; name = p.displayName; email = p.email; photoURL = p.photoURL;
        } catch (e) {}
      }
      if (!email) email = ('(UID ' + uid.substring(0, 8) + '…)');
      if (!name) name = email.split('@')[0];
      return { uid, name, email, photoURL, role: roles[uid] || null, isMe: uid === currentUid };
    }));

    const rank = { admin: 0, user: 1, none: 2 };
    userList.sort((a, b) => {
      const ar = a.role || 'none', br = b.role || 'none';
      if (rank[ar] !== rank[br]) return rank[ar] - rank[br];
      return a.name.localeCompare(b.name);
    });

    const adminCount = userList.filter(u => u.role === 'admin').length;
    const userCount = userList.filter(u => u.role === 'user').length;
    const noneCount = userList.filter(u => !u.role).length;

    let html = '';
    if (usersError) html += '<div class="admin-note" style="background:rgba(220,38,38,.1);color:var(--danger);border:1px solid var(--danger);"><b>Lỗi tải danh sách.</b> Kiểm tra Rules.</div>';

    html += '<div class="admin-stats">' +
      '<div class="as-item"><strong>' + userList.length + '</strong><span>Tổng</span></div>' +
      '<div class="as-item admin"><strong>' + adminCount + '</strong><span>Admin</span></div>' +
      '<div class="as-item user"><strong>' + userCount + '</strong><span>User</span></div>' +
    '</div>';

    html += '<div class="admin-list">';
    userList.forEach(u => {
      const color = avatarColor(u.email), init = getInitial(u.name, u.email);
      const roleLabel = u.role === 'admin' ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>Admin'
                      : u.role === 'user' ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>User'
                      : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>Chưa cấp';
      const cls = u.role === 'admin' ? 'admin' : u.role === 'user' ? 'user' : 'none';
      const avHtml = u.photoURL ? '<img src="' + u.photoURL + '" alt="">' : '<div style="width:100%;height:100%;background:' + color + ';display:grid;place-items:center;color:#fff;">' + init + '</div>';

      html += '<div class="admin-item">' +
        '<div class="ai-avatar">' + avHtml + '</div>' +
        '<div class="ai-info">' +
          '<div class="ai-name">' + escapeHtml(u.name) + (u.isMe ? ' <span class="ai-you">(bạn)</span>' : '') + '</div>' +
          '<div class="ai-email">' + escapeHtml(u.email) + '</div>' +
          '<div class="ai-uid">Mã User: ' + escapeHtml(u.uid.substring(0, 12)) + '…</div>' +
        '</div>' +
        '<button type="button" class="ai-role ' + cls + '" data-toggle-role="' + u.uid +
          '" data-current="' + (u.role || '') + '">' + roleLabel + '</button>' +
      '</div>';
    });
    html += '</div>';

    if (noneCount > 0) html += '<div class="admin-note">Có <b>' + noneCount + '</b> người chưa được cấp quyền. Chạm nút để cấp quyền User (chạm lần nữa để nâng Admin).</div>';
    html += '<div class="admin-note">Nếu thiếu người dùng, yêu cầu họ <b>đăng nhập lại</b> để hệ thống nhận diện tài khoản.</div>';

    $('#sheetBody').innerHTML = html;
  } catch (e) {
    $('#sheetBody').innerHTML = '<div class="admin-loading" style="color:var(--danger)">Lỗi tải danh sách: ' + escapeHtml(e.message) + '</div>';
  }
}

async function toggleUserRole(uid, currentRoleVal, btn) {
  if (currentRole !== 'admin') { showToast('Chỉ Admin mới có quyền này'); return; }
  let newRole;
  if (!currentRoleVal) newRole = 'user';
  else if (currentRoleVal === 'user') newRole = 'admin';
  else newRole = 'user';

  if (currentRoleVal === 'admin') {
    try {
      const snap = await rtdb.ref(DB_ROOT + '/roles').once('value');
      const roles = snap.val() || {};
      const admins = Object.values(roles).filter(r => r === 'admin').length;
      if (admins <= 1 && !confirm('Đây là Admin duy nhất. Hạ cấp sẽ không còn ai quản lý. Tiếp tục?')) return;
    } catch (e) {}
  }

  btn.disabled = true;
  try {
    await rtdb.ref(DB_ROOT + '/roles/' + uid).set(newRole);
    if (uid === currentUid) {
      currentRole = newRole; updateAvatarUI(); showToast('Bạn đã trở thành ' + (newRole === 'admin' ? 'Admin' : 'User'));
      if (newRole !== 'admin') { hideSheet(); return; }
    } else {
      showToast('Đã đổi thành ' + (newRole === 'admin' ? 'Admin' : 'User'));
    }
    loadAdminList();
  } catch (e) { btn.disabled = false; showToast('Lỗi: ' + (e.message || 'không rõ')); }
}

/* ===== DROPDOWN ===== */
function closeDropdown() { $('#dropdown').classList.remove('open'); }

/* ===== KHỞI TẠO VÀ GẮN SỰ KIỆN ===== */
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(currentTheme);
  initFirebase();

  if (firebaseReady) {
    auth.onAuthStateChanged(user => {
      $('#loadingScreen').style.display = 'none';
      if (user) {
        currentUid = user.uid;
        currentEmail = user.email || '';
        showMainApp();
        loadUserData();
      } else {
        currentUid = null; currentEmail = ''; currentRole = null;
        detachAllListeners();
        resetState();
        closeDropdown();
        showAuthScreen();
      }
    });
  } else {
    showAuthScreen();
    if (typeof authError === 'function') authError('Không tải được Firebase SDK');
  }

  // === CÁC SỰ KIỆN UI ===
  
    // Header Scroll (Đã tối ưu chống giật)
  const mainHeader = document.getElementById('mainHeader');
  let isHeaderCollapsed = false;
  let scrollTicking = false;

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 40 && !isHeaderCollapsed) {
          mainHeader.classList.add('collapsed');
          isHeaderCollapsed = true;
        } else if (window.scrollY <= 40 && isHeaderCollapsed) {
          mainHeader.classList.remove('collapsed');
          isHeaderCollapsed = false;
        }
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // Avatar & Dropdown
  const avatarBtn = $('#avatarBtn');
  const dropdown = $('#dropdown');
  avatarBtn.addEventListener('click', e => { 
    e.stopPropagation(); 
    dropdown.classList.toggle('open'); 
    if (dropdown.classList.contains('open')) updateAvatarUI(); 
  });
  dropdown.addEventListener('click', e => {
    const item = e.target.closest('.dd-item'); if (!item) return;
    const a = item.dataset.action; closeDropdown();
    if (a === 'settings') openSettings();
    else if (a === 'admin') openAdmin();
    else if (a === 'profile') openProfile();
    else if (a === 'theme') { applyTheme(currentTheme === 'dark' ? 'light' : 'dark'); }
    else if (a === 'help') openHelp();
    else if (a === 'logout') { if (typeof logout === 'function') logout(); }
  });
  document.addEventListener('click', e => {
    if (!dropdown.classList.contains('open')) return;
    if (e.target.closest('#avatarBtn') || e.target.closest('#dropdown')) return;
    closeDropdown();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDropdown(); });

  // Tháng
  $('#prevMonth').addEventListener('click', () => {
    flushNow(); hideSheet();
    let m = state.month - 1, y = state.year;
    if (m < 1) { m = 12; y--; }
    state.month = m; state.year = y;
    loadLocalForMonth(); updateMonthLabel(); attachListeners(); updateAll();
  });
  $('#nextMonth').addEventListener('click', () => {
    flushNow(); hideSheet();
    let m = state.month + 1, y = state.year;
    if (m > 12) { m = 1; y++; }
    state.month = m; state.year = y;
    loadLocalForMonth(); updateMonthLabel(); attachListeners(); updateAll();
  });
  $('#monthLabel').addEventListener('click', openMonthSheet);
  $('#btnHelp').addEventListener('click', openHelp);

  // Chạm vào ô ngày
  $('#calGrid').addEventListener('click', e => {
    const cell = e.target.closest('.cell[data-key]'); if (!cell) return;
    openDaySheet(cell.dataset.key); tapFeedback();
  });

  // Điền nhanh
  function fillWeekdays(lastDay) {
    const n = dim(state.year, state.month); let count = 0;
    for (let d = 1; d <= n; d++) {
      const wd = new Date(state.year, state.month-1, d).getDay();
      if (wd >= 1 && wd <= lastDay) {
        const k = dk(state.year, state.month, d);
        const e = state.days[k];
        if (!e || !e.main) { state.days[k] = state.days[k] || {}; state.days[k].main = (wd === 6) ? 'x/2' : 'x'; count++; }
      }
    }
    updateAll(); save();
    showToast(count > 0 ? 'Đã điền x cho ' + count + ' ngày trống' : 'Không có ngày trống để điền');
  }
  $('#btnFillX').addEventListener('click', () => fillWeekdays(5));
  $('#btnFillT7').addEventListener('click', () => fillWeekdays(6));
  $('#btnClear').addEventListener('click', () => {
    if (!confirm('Xóa toàn bộ chấm công tháng ' + state.month + '/' + state.year + '?')) return;
    const n = dim(state.year, state.month);
    for (let d = 1; d <= n; d++) delete state.days[dk(state.year, state.month, d)];
    updateAll(); save(); showToast('Đã xóa tháng ' + state.month);
  });

  // Sheet Backdrop & Close
  $('#backdrop').addEventListener('click', hideSheet);
  $('#sheetClose').addEventListener('click', hideSheet);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hideSheet(); });

  // Modal Add Item Events
  $('#addModalClose').addEventListener('click', closeAddModal);
  $('#addModalCancel').addEventListener('click', closeAddModal);
  $('#addModalBackdrop').addEventListener('click', closeAddModal);
  $('#addModalSave').addEventListener('click', () => {
    const name = $('#newItemName').value.trim();
    const val = parseFloat($('#newItemValue').value) || 0;
    if (!name) { showToast('Vui lòng nhập tên mục'); return; }
    
    const id = Date.now().toString(36);
    if (currentAddType === 'income') {
      const calcType = $('#newItemType').value;
      state.customIncome.push({ id, name, value: val, type: calcType });
    } else {
      state.customDeductions.push({ id, name, value: val });
    }
    closeAddModal(); refreshUI(); openSettings();
  });

  // Xem chi tiết lương
  $('#bbDetail').addEventListener('click', openSalary);

  // File Upload Avatar
  $('#avatarInput').addEventListener('change', e => {
    const file = e.target.files[0]; if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('Vui lòng chọn file ảnh'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 200; let w = img.width, h = img.height;
        if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } } else { if (h > MAX) { w *= MAX / h; h = MAX; } }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        const base64 = canvas.toDataURL('image/jpeg', 0.85);
        rtdb.ref(DB_ROOT + '/users/' + currentUid + '/profile/photoURL').set(base64)
          .then(() => { currentProfile.photoURL = base64; updateAvatarUI(); openProfile(); showToast('Đã cập nhật ảnh đại diện'); })
          .catch(err => showToast('Lỗi lưu ảnh: ' + err.message));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file); e.target.value = '';
  });

  // === SỰ KIỆN BÊN TRONG SHEET ===
  $('#sheetBody').addEventListener('click', async e => {
    // 1. Edit System Name (Admin only) — ✅ FIX
    const editSys = e.target.closest('[data-edit-sys]');
    if (editSys) {
      if (currentRole !== 'admin') return;
      const path = editSys.dataset.editSys;
      const key = path.split('.')[1];           // income.base -> 'base'
      const currentName = state.sysNames[key] || '';

      const newName = prompt('Sửa tên mục (sẽ đồng bộ cho tất cả User):', currentName);
      const trimmed = (newName || '').trim();
      if (!trimmed || trimmed === currentName) return;

      try {
        await rtdb.ref(DB_ROOT + '/system/names/' + key).set(trimmed);

        // Cập nhật local ngay để UI phản ánh tức thì
        state.sysNames[key] = trimmed;

        showToast('Đã cập nhật tên mục');
        openSettings();
      } catch (err) {
        console.error('[editSys]', err);
        const msg = (err && err.message) ? err.message : 'không rõ';
        if (msg.includes('PERMISSION_DENIED')) {
          showToast('Không có quyền sửa. Cần cập nhật Firebase Rules cho /system/names');
        } else {
          showToast('Lỗi: ' + msg);
        }
      }
      return;
    }

    // 2. Delete Custom Item
    const delCustom = e.target.closest('[data-del-custom]');
    if (delCustom) {
      if (!confirm('Xóa mục này?')) return;
      const path = delCustom.dataset.delCustom;
      const [group, id] = path.split('.');
      if (group === 'income') state.customIncome = state.customIncome.filter(i => i.id !== id);
      else state.customDeductions = state.customDeductions.filter(i => i.id !== id);
      refreshUI(); openSettings();
      return;
    }

    // 3. Add Item Flow
    const addBtn = e.target.closest('[data-add]');
    if (addBtn) { openAddModal(addBtn.dataset.add); return; }

     // 4. Tự động tính công chuẩn
    if (e.target.closest('[data-act="autostd"]')) {
      const cnt = calcAutoStandard(state.year, state.month);
      state.capStandard = cnt; 
      state.standard = cnt; 
      
      save(); // <--- THÊM DÒNG NÀY ĐỂ LƯU NGAY LẬP TỨC
      
      openSettings(); // Render lại giao diện để hiện số mới
      showToast('Đã tính công chuẩn: ' + fmtQty(cnt));
      return;
    }

    // 5. Chọn tháng
    if (sheetMode === 'month') {
      const yb = e.target.closest('[data-yshift]');
      if (yb) { pickYear += Number(yb.dataset.yshift); $('#sheetBody').innerHTML = buildMonthBody(); return; }
      const mb = e.target.closest('[data-m]');
      if (mb) {
        flushNow(); state.year = pickYear; state.month = Number(mb.dataset.m);
        loadLocalForMonth(); hideSheet(); updateMonthLabel(); attachListeners(); updateAll();
      }
      return;
    }

    // 6. Chọn ngày
    if (sheetMode === 'day') {
      const chip = e.target.closest('.pop-opt'); if (!chip || !activeDay) return;
      const g = chip.dataset.g, c = chip.dataset.c;
      const cur = state.days[activeDay] || (state.days[activeDay] = {});
      const wasOn = cur[g] === c;
      if (wasOn) delete cur[g]; else cur[g] = c;
      chip.parentElement.querySelectorAll('.pop-opt').forEach(el => el.classList.remove('on'));
      if (!wasOn) chip.classList.add('on');
      $('#sheetActions').innerHTML = buildDayActions();
      updateCell(activeDay); refreshUI(); tapFeedback();
    }
  });

  // Input thay đổi trong Settings
  $('#sheetBody').addEventListener('input', e => {
    if (sheetMode !== 'settings') return;
    const f = e.target.dataset.field; if (!f) return;
    
    if (f === 'countLeave') {
      state.countLeave = e.target.checked;
      refreshUI(); updateSettingsPreview();
      return;
    }
    
    // Phân biệt ô nhập tiền (text) và ô nhập công (number)
    let val;
    if (e.target.type === 'text') {
      val = parseMoneyInput(e.target.value);
      // Cập nhật lại giá trị hiển thị với dấu chấm
      e.target.value = formatMoneyInput(val);
    } else {
      val = parseFloat(e.target.value) || 0;
    }
    
    const [group, key] = f.split('.');
    
    if (group === 'customIncome') {
      const item = state.customIncome.find(i => i.id === key);
      if (item) item.value = val;
    } else if (group === 'customDeductions') {
      const item = state.customDeductions.find(i => i.id === key);
      if (item) item.value = val;
    } else if (group === 'income') {
      if (key === 'base') state.base = val;
      else if (key === 'cash') state.cash = val;
      else if (key === 'allowance') state.allowance = val;
      else if (key === 'raise') state.raiseMax = val;
    } else if (group === 'ded') {
      state.ded[key] = val;
    } else if (f === 'capStandard' || f === 'standard' || f === 'raiseStandard') {
      state[f] = Math.max(0.5, val);
    }
    refreshUI(); updateSettingsPreview();
  });

  // Click các nút ở Footer Sheet
  $('#sheetActions').addEventListener('click', e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    if (b.dataset.act === 'done') {
        if (sheetMode === 'settings') flushNow();
        hideSheet(); return;
    }
    if (b.dataset.act === 'refresh' && sheetMode === 'admin') { loadAdminList(); return; }
    if (b.dataset.act === 'clear' && sheetMode === 'day' && activeDay) {
      state.days[activeDay] = {};
      $('#sheetBody').querySelectorAll('.pop-opt.on').forEach(el => el.classList.remove('on'));
      $('#sheetActions').innerHTML = buildDayActions();
      updateCell(activeDay); refreshUI();
      showToast('Đã xóa ngày');
    }
  });

  // Click đổi Role trong Admin
  $('#sheetBody').addEventListener('click', e => {
    const roleBtn = e.target.closest('[data-toggle-role]');
    if (roleBtn && sheetMode === 'admin') {
      toggleUserRole(roleBtn.dataset.toggleRole, roleBtn.dataset.current, roleBtn);
      return;
    }
  });

});