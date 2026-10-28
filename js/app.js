/* 共用工具、API 呼叫、畫面切換、登出 */
        const ISLAND_ALIASES = {
            "加法島":"加法島", "減法島":"減法島", "乘法島":"乘法島", "除法島":"除法島",
            "應用題島":"應用題島", "四則運算島":"四則運算島",
            "addition":"加法島", "subtraction":"減法島", "multiplication":"乘法島", "division":"除法島",
            "wordProblems":"應用題島", "mixedOperations":"四則運算島"
        };
        const SESSION_ID = 'SES_' + new Date().getTime() + '_' + Math.floor(Math.random() * 10000);
        function genLogId() { return 'LOG_' + new Date().getTime() + '_' + Math.floor(Math.random() * 1000000); }

        let currentUser = null; let selectedIslandForModal = ""; let globalUsers = []; let globalLogs = [];
        const delay = ms => new Promise(res => setTimeout(res, ms));

        function escapeHTML(str) { if(str == null) return ''; return String(str).replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag])); }
        function generateUUID() { return 'USR_' + new Date().getTime() + '_' + Math.floor(Math.random() * 10000); }
        
        async function apiCall(payload) {
            if(!GAS_URL || !GAS_URL.startsWith("http")) return { status: 'offline' };
            const canRetry = payload.action !== 'register';
            for (let t = 0; t < 2; t++) {
                try { const r = await fetch(GAS_URL, { method: 'POST', body: JSON.stringify(payload) }); return await r.json(); }
                catch(e) { if (t === 1 || !canRetry) return { status: 'error', message: '連線失敗，請檢查網路後再試一次' }; await delay(800); }
            }
        }

        // 綁定首頁身分按鈕
        document.addEventListener("DOMContentLoaded", () => {
            const studentBtn = document.getElementById("btn-role-student");
            const teacherBtn = document.getElementById("btn-role-teacher");
            if(studentBtn) studentBtn.addEventListener("click", () => switchScreen("screen-student-login"));
            if(teacherBtn) teacherBtn.addEventListener("click", () => switchScreen("screen-admin-login"));
        });

        function switchScreen(id) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id).classList.add('active'); if (id === 'screen-map' && typeof SeaMap !== 'undefined') SeaMap.onShow(); }
        function logoutToRoleSelect() { WP2.reset(); AnimationEngine.stopAll(); QF.state = 'IDLE'; QuestionKeys.detach(); LighthouseSystem.skip(); currentUser = null; selectedIslandForModal = ""; document.getElementById('student-username').value = ""; document.getElementById('admin-pwd').value = ""; switchScreen('screen-role-select'); }
