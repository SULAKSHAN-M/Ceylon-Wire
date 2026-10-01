(() => {
  const host = document.getElementById('content');
  const el = (tag, text) => { const node = document.createElement(tag); if (text) node.textContent = text; return node; };
  let saved = []; try { saved = JSON.parse(localStorage.getItem('colombo-wire-bookmarks') || '[]'); if (!Array.isArray(saved)) saved=[]; } catch {}
  const id = Number(new URL(location.href).searchParams.get('id') || location.pathname.match(/^\/news\/(\d+)/)?.[1]);
  const entry = saved.find(item => item.id === id);
  if (entry?.offlinePost) {
    const post = entry.offlinePost;
    const back = el('a', 'All offline stories'); back.href='/offline.html'; host.append(back);
    const heading = el('h1'); host.append(heading);
    const date = el('p', post.published); date.className='note'; host.append(date);
    const select = el('select'); select.setAttribute('aria-label','Reading language');
    for (const [value, label] of [['en','English'],['si','සිංහල'],['ta','தமிழ்']]) { const option=el('option',label); option.value=value; select.append(option); }
    host.append(select); const body=el('div'); host.append(body);
    function render(){
      body.replaceChildren(); body.lang=select.value; heading.lang=select.value;
      let tamil=null;try{tamil=JSON.parse(localStorage.getItem(`wire-tamil-${id}`)||'null');}catch{}
      heading.textContent=select.value==='si'?post.title:select.value==='ta'&&tamil?tamil.title:post.title_en||post.title;
      if(select.value==='ta'&&!tamil){body.append(el('p','தமிழ் மொழிபெயர்ப்பை இணைய இணைப்புடன் முதலில் திறந்து சேமிக்கவும்.'));return;}
      const paragraphs=select.value==='ta'?tamil.paragraphs:post.content.map(b=>select.value==='si'?b.data||b.data_en:b.data_en||b.data);
      for(const text of paragraphs) body.append(el('p',text));
    }
    select.addEventListener('change',render);render();
  } else {
    host.append(el('h1','Offline stories'));
    if(id)host.append(el('p','This story has not been saved for offline reading.'));
    const available=saved.filter(item=>item.offlinePost);
    if(!available.length)host.append(el('p','Connect to the internet and save a story first.'));
    const list=el('ul'); for(const item of available){const li=el('li');const link=el('a',item.title_en||item.title);link.href=`/offline.html?id=${item.id}`;li.append(link);list.append(li);}host.append(list);
  }
})();
