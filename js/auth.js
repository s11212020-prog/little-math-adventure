/* 學生登入／註冊／選角色 */
        async function doStudentAuth(actionType) {
            const username = document.getElementById('student-username').value.trim(); if(!username) return alert("請輸入代碼！");
            document.getElementById('loading').style.display = 'flex'; const res = await apiCall({ action: actionType, username: username }); document.getElementById('loading').style.display = 'none';
            if (res.status === 'error' && res.message) { alert(res.message); return; }
            if (res.status !== 'success' && res.status !== 'offline') { alert('登入失敗，請稍後再試'); return; }
            if (res.status === 'offline' || res.status === 'error') { currentUser = { user_id: generateUUID(), username: username, nickname: username, total_stars: 0, progress: {} }; } 
            else { currentUser = res.user_data; if(!currentUser.user_id) currentUser.user_id = generateUUID(); if (typeof currentUser.progress === 'string') { try { currentUser.progress = JSON.parse(currentUser.progress); } catch(e) { currentUser.progress = {}; } } }
            if (!currentUser.progress || typeof currentUser.progress !== 'object') currentUser.progress = {}; WP2.reset(); AdaptiveEngine.reset();
            
            if (!currentUser.progress.avatar) { CrewRegistry.open(); switchScreen('screen-avatar-select'); CrewRegistry.focusStart(); } else { EffectEngine.updateMap(); switchScreen('screen-map'); }
        }

        /* avatar 可以是新的船員代碼（例如 C3-2-1），也可以是舊帳號原本存的 emoji；兩種都照原樣存，不改寫 */
        function selectAvatar(emoji) {
            if(currentUser) {
                if(!currentUser.progress) currentUser.progress = {}; currentUser.progress.avatar = emoji;
                if(GAS_URL.includes("http")) apiCall({ action: 'submit_answer', username: currentUser.username, user_id: currentUser.user_id, update_progress: currentUser.progress });
            }
            EffectEngine.updateMap(); switchScreen('screen-map');
        }
