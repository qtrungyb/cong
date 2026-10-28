/* ===== AUTH LOGIC ===== */
const DOMAIN = '@cong.com';

const AUTH_ERRORS = {
  'auth/email-already-in-use': 'Tên đăng nhập đã tồn tại',
  'auth/invalid-email': 'Tên đăng nhập không hợp lệ',
  'auth/operation-not-allowed': 'Chức năng đăng ký đang tắt',
  'auth/weak-password': 'Mật khẩu quá yếu (tối thiểu 6 ký tự)',
  'auth/user-disabled': 'Tài khoản đã bị khoá',
  'auth/user-not-found': 'Sai tên đăng nhập',
  'auth/wrong-password': 'Sai mật khẩu',
  'auth/invalid-credential': 'Sai tên đăng nhập hoặc mật khẩu',
  'auth/invalid-login-credentials': 'Sai tên đăng nhập hoặc mật khẩu',
  'auth/too-many-requests': 'Quá nhiều lần thử. Vui lòng thử lại sau ít phút.',
  'auth/network-request-failed': 'Lỗi mạng. Kiểm tra kết nối internet.',
  'auth/internal-error': 'Lỗi hệ thống. Vui lòng thử lại.',
  'auth/missing-password': 'Vui lòng nhập mật khẩu'
};

let authMode = 'login';

function normalizeUsername(input) {
  let t = (input || '').trim().toLowerCase();
  if (!t) return '';
  if (!t.includes('@')) t += DOMAIN;
  return t;
}
function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

function updateAuthUI() {
  const isLogin = authMode === 'login';
  document.querySelector('#authTitle').textContent = isLogin ? 'Đăng nhập' : 'Đăng ký';
  document.querySelector('#authSubmitText').textContent = isLogin ? 'Đăng nhập' : 'Đăng ký';
  document.querySelector('#nameField').style.display = isLogin ? 'none' : 'block';
  document.querySelector('#confirmPwField').style.display = isLogin ? 'none' : 'block';
  document.querySelector('#rememberWrap').style.display = isLogin ? 'flex' : 'none';
  document.querySelector('#switchText').textContent = isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?';
  document.querySelector('#btnSwitchMode').textContent = isLogin ? 'Đăng ký' : 'Đăng nhập';
  authError('');
}

function authError(msg) {
  const el = document.querySelector('#authError');
  if (msg) { el.textContent = msg; el.classList.add('show'); }
  else { el.textContent = ''; el.classList.remove('show'); }
  const btn = document.querySelector('#authSubmit');
  btn.disabled = false; 
  document.querySelector('#authSubmitText').textContent = authMode === 'login' ? 'Đăng nhập' : 'Đăng ký';
}

function showAuthScreen() {
  document.querySelector('#loadingScreen').style.display = 'none';
  document.querySelector('#mainApp').style.display = 'none';
  document.querySelector('#bottombar').style.display = 'none';
  document.querySelector('#authScreen').style.display = 'flex';
  authMode = 'login'; updateAuthUI();
  
  const se = localStorage.getItem('saved_email');
  const sp = localStorage.getItem('saved_pw');
  if (se) {
    document.querySelector('#authEmail').value = se;
    document.querySelector('#rememberMe').checked = true;
    if (sp) document.querySelector('#authPassword').value = sp;
  } else {
    document.querySelector('#authEmail').value = '';
    document.querySelector('#authPassword').value = '';
    document.querySelector('#rememberMe').checked = false;
  }
  document.querySelector('#authName').value = '';
  document.querySelector('#authConfirmPw').value = '';
  document.querySelector('#authPassword').type = 'password';
  authError('');
}

function logout() {
  // Gọi hàm dọn dẹp từ app.js (nếu có)
  if (typeof window.flushNow === 'function') window.flushNow();
  if (typeof window.detachAllListeners === 'function') window.detachAllListeners();
  if (typeof window.closeDropdown === 'function') window.closeDropdown();
  if (typeof window.hideSheet === 'function') window.hideSheet();
  
  if (auth) auth.signOut().catch(() => {});
}

// Gắn sự kiện Auth (sẽ chạy sau khi DOM tải xong)
document.addEventListener('DOMContentLoaded', () => {
  const btnSwitchMode = document.querySelector('#btnSwitchMode');
  const togglePw = document.querySelector('#togglePw');
  const authForm = document.querySelector('#authForm');

  btnSwitchMode.addEventListener('click', () => {
    authMode = authMode === 'login' ? 'register' : 'login';
    updateAuthUI();
    if (authMode === 'register') {
      document.querySelector('#authEmail').value = '';
      document.querySelector('#authPassword').value = '';
      document.querySelector('#authConfirmPw').value = '';
      document.querySelector('#authEmail').autocomplete = 'off';
      document.querySelector('#authPassword').autocomplete = 'new-password';
    } else {
      document.querySelector('#authEmail').autocomplete = 'username';
      document.querySelector('#authPassword').autocomplete = 'current-password';
    }
  });

  togglePw.addEventListener('click', () => {
    const inp = document.querySelector('#authPassword');
    inp.type = inp.type === 'password' ? 'text' : 'password';
  });

  authForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (!firebaseReady) { authError('Firebase chưa sẵn sàng'); return; }
    
    const name = document.querySelector('#authName').value.trim();
    const rawEmail = document.querySelector('#authEmail').value.trim();
    const password = document.querySelector('#authPassword').value;
    const confirmPw = document.querySelector('#authConfirmPw').value;
    const email = normalizeUsername(rawEmail);
    const remember = document.querySelector('#rememberMe').checked;

    authError(''); 
    document.querySelector('#authEmail').classList.remove('error'); 
    document.querySelector('#authPassword').classList.remove('error');

    if (authMode === 'register') {
      if (!name) { authError('Vui lòng nhập tên người dùng'); document.querySelector('#authName').classList.add('error'); return; }
      if (password !== confirmPw) { authError('Mật khẩu gõ lại không khớp'); document.querySelector('#authConfirmPw').classList.add('error'); return; }
    }
    if (!email) { authError('Vui lòng nhập tên đăng nhập'); document.querySelector('#authEmail').classList.add('error'); return; }
    if (!isValidEmail(email)) { authError('Tên đăng nhập không hợp lệ'); document.querySelector('#authEmail').classList.add('error'); return; }
    if (!password) { authError('Vui lòng nhập mật khẩu'); document.querySelector('#authPassword').classList.add('error'); return; }
    if (authMode === 'register' && password.length < 6) { authError('Mật khẩu phải có ít nhất 6 ký tự'); document.querySelector('#authPassword').classList.add('error'); return; }

    document.querySelector('#authSubmit').disabled = true;
    document.querySelector('#authSubmitText').textContent = authMode === 'login' ? 'Đang xử lý…' : 'Đang tạo…';

    try {
      if (authMode === 'login') {
        if (remember) {
          localStorage.setItem('saved_email', rawEmail); localStorage.setItem('saved_pw', password);
          await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        } else {
          localStorage.removeItem('saved_email'); localStorage.removeItem('saved_pw');
          await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
        }
        await auth.signInWithEmailAndPassword(email, password);
      } else {
        const cred = await auth.createUserWithEmailAndPassword(email, password);
        if (cred.user) {
          await cred.user.updateProfile({ displayName: name });
          await rtdb.ref(DB_ROOT + '/users/' + cred.user.uid + '/profile').set({ displayName: name, email: email, photoURL: '' });
        }
      }
    } catch (err) {
      authError(AUTH_ERRORS[err.code] || err.message || 'Thao tác thất bại');
      if (['auth/user-not-found','auth/invalid-credential','auth/invalid-login-credentials','auth/invalid-email'].includes(err.code)) document.querySelector('#authEmail').classList.add('error');
      if (['auth/wrong-password','auth/invalid-credential','auth/invalid-login-credentials'].includes(err.code)) document.querySelector('#authPassword').classList.add('error');
    }
  });
});