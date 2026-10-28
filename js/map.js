/* 進度計算與地圖特效 */
        const ProgressSystem = {
            getBestStar: function(records) { if(!Array.isArray(records) || records.length === 0) return 0; return Math.max(...records.map(r => typeof r === 'object' ? r.stars : 0)); },
            calcTotal: function(prog) { let t = 0; ["加法島", "減法島", "乘法島", "除法島", "應用題島", "四則運算島"].forEach(i => { if (prog[i]) { t += this.getBestStar(prog[i]["LEARNING"]); t += this.getBestStar(prog[i]["PRACTICE"]); t += this.getBestStar(prog[i]["MASTERY"]); } }); return Math.min(t, 54); },
            getTitle: function(t) {
                if(t >= 54) return { title: "數學島守護者", nextMsg: "已達最高榮譽！" }; if(t >= 45) return { title: "智慧領航員", nextMsg: `再 ${54 - t} 星升級！` };
                if(t >= 36) return { title: "數學小達人", nextMsg: `再 ${45 - t} 星升級！` }; if(t >= 27) return { title: "解題小隊長", nextMsg: `再 ${36 - t} 星升級！` };
                if(t >= 18) return { title: "算術小勇士", nextMsg: `再 ${27 - t} 星升級！` }; if(t >= 9)  return { title: "數學探索家", nextMsg: `再 ${18 - t} 星升級！` };
                return { title: "數學小旅人", nextMsg: `再 ${9 - t} 星升級！` };
            }
        };

        const EffectEngine = {
            shakeElement: function(id) { const el = document.getElementById(id); if(el) { el.classList.remove('apply-shake'); void el.offsetWidth; el.classList.add('apply-shake'); } },
            flyStar: async function() { const _st = document.getElementById('ui-island-stars'); if (_st) _st.innerText = GameFlowController.state.stars; const c = document.getElementById('star-animation-container'); const s = document.createElement('div'); s.className = 'flying-star'; s.innerHTML = UIKit.icon('star', { size: 96 }); c.appendChild(s); s.style.animation = 'starFly 1.5s ease-in-out forwards'; await delay(1500); c.innerHTML = ''; },
            updateMap: function() {
                if(!currentUser || !currentUser.progress) return;
                let ts = ProgressSystem.calcTotal(currentUser.progress); currentUser.total_stars = ts; 
                let tInfo = ProgressSystem.getTitle(ts);
                document.getElementById('ui-nickname').innerText = currentUser.nickname; document.getElementById('ui-title').innerText = tInfo.title; document.getElementById('ui-total-stars').innerText = ts; document.getElementById('ui-next-title-hint').innerText = tInfo.nextMsg;
                document.getElementById('ui-my-avatar').innerHTML = AvatarKit.bustHTML(currentUser.progress && currentUser.progress.avatar, 40);

                /* 六座島的狀態（已完成／進行中／尚未開始＋目前停靠）、燈塔、星數、小船、航線：階段 5 起由 js/sea-map.js 負責 */
                SeaMap.render();
            }
        };
