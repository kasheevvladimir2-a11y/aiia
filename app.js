function addBubble(cls, text) {
  const div = document.createElement('div');
  div.className = `msg ${cls}`;
  div.textContent = text;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
  return div;
}

async function send() {
  const text = inputEl.value.trim();
  if (!text) return;
  if (!apiKey) { alert('Сначала настрой: ⚙ → API key'); return; }

  history.push({ role: 'user', text });
  inputEl.value = '';
  render();
  saveHistory();

  sendEl.disabled = true;
  const thinking = addBubble('thinking', 'Думаю…');

  const contents = history.slice(-20, -1).map(m => ({
    role: m.role === 'model' ? 'model' : 'user',
    parts: [{ text: m.text }],
  }));
  contents.push({ role: 'user', parts: [{ text }] });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: SYSTEM }] }, contents }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error?.message || res.statusText);
    }

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    thinking.remove();
    if (!reply) throw new Error('Пустой ответ');
    history.push({ role: 'model', text: reply });
    saveHistory();
    render();
  } catch (e) {
    thinking.remove();
    addBubble('error', `⚠ ${e.message}`);
  } finally {
    sendEl.disabled = false;
    inputEl.focus();
  }
}

function openSettings() {
  const k = prompt('Gemini API key:', apiKey);
  if (k === null) return;
  apiKey = k.trim();
  localStorage.setItem(KEY_KEY, apiKey);
  location.reload();
}

sendEl.addEventListener('click', send);
settingsEl.addEventListener('click', openSettings);
inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
});

render();
if (!apiKey) addBubble('thinking', 'Введи Gemini API key в настройках ⚙');
