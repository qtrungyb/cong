/* ===== FIREBASE INIT ===== */
const firebaseConfig = {
  apiKey: "AIzaSyCu98wSHH6wcF1kazHwaNLcTDYNutIeb1Q",
  authDomain: "cong-53e3c.firebaseapp.com",
  databaseURL: "https://cong-53e3c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cong-53e3c",
  storageBucket: "cong-53e3c.firebasestorage.app",
  messagingSenderId: "768341507396",
  appId: "1:768341507396:web:d468c650bbbb87724d6b11"
};

const DB_ROOT = 'bangcong';

let fbApp = null;
let auth = null;
let rtdb = null;
let firebaseReady = false;

function initFirebase() {
  try {
    if (typeof firebase === 'undefined' || !firebase.initializeApp) {
      console.warn('Không tải được Firebase SDK');
      return;
    }
    if (!firebase.apps.length) {
      fbApp = firebase.initializeApp(firebaseConfig);
    } else {
      fbApp = firebase.app();
    }
    auth = firebase.auth();
    rtdb = firebase.database();
    firebaseReady = true;
  } catch (e) {
    console.error('Lỗi khởi tạo Firebase:', e);
  }
}