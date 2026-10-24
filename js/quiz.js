// "Build my plan" questions: a full-screen step-by-step form. On finish it opens the plan page with the answers.
import { STEPS } from './planner.js?v=f2b211f8';
import { icon } from './icons.js?v=f2b211f8';
import { el, store } from './common.js?v=f2b211f8';

export const toQuery = a => {
  const p = new URLSearchParams();
  if (a.b) p.set('b', a.b);
  if (a.g?.length) p.set('g', a.g.join(','));
  if (a.r?.length) p.set('r', a.r.join(','));
  if (a.m) p.set('m', a.m);
  if (a.t) p.set('t', a.t);
  if (a.q?.trim()) p.set('q', a.q.trim().slice(0, 300));
  return p.toString();
};
export const fromQuery = qs => {
  const p = new URLSearchParams(qs);
  const ok = (step, v) => STEPS.find(s => s.id === step).options.some(o => o.id === v);
  const list = (step, v) => (v || '').split(',').filter(x => ok(step, x));
  const a = { b: ok('b', p.get('b')) ? p.get('b') : '', g: list('g', p.get('g')), r: list('r', p.get('r')), m: ok('m', p.get('m')) ? p.get('m') : '', t: ok('t', p.get('t')) ? p.get('t') : '', q: (p.get('q') || '').slice(0, 300) };
  return a.b || a.g.length || a.q ? a : null;
};

export function openQuiz({ inline = null, start = store.get('plan-answers', null) } = {}) {
  const ans = { b: '', g: [], r: [], m: '', t: '', q: '', ...(start || {}) };
  let step = 0;
  const box = el('div', { className: 'quiz' });
  const shell = inline || el('dialog', { className: 'quizdlg', ariaLabel: 'Build my plan' });
  if (!inline) {
    shell.append(box); document.body.append(shell);
    shell.addEventListener('close', () => shell.remove());
    shell.showModal();
  } else inline.replaceChildren(box);

  const finish = () => {
    store.set('plan-answers', ans);
    location.href = `plan?${toQuery(ans)}`;
  };
  const go = n => { step = Math.max(0, Math.min(STEPS.length - 1, n)); paint(); };

  function paint() {
    const s = STEPS[step];
    const bar = el('div', { className: 'quiz__bar' }, el('i', { style: `width:${((step + 1) / STEPS.length) * 100}%` }));
    const top = el('div', { className: 'quiz__top' },
      step ? el('button', { type: 'button', className: 'iconbtn', ariaLabel: 'Back', innerHTML: icon('arrow'), style: 'transform:rotate(180deg)', onclick: () => go(step - 1) }) : el('span'),
      el('span', { className: 'quiz__count', textContent: `${step + 1} / ${STEPS.length}` }),
      inline ? el('span') : el('button', { type: 'button', className: 'iconbtn', ariaLabel: 'Close', innerHTML: icon('close'), onclick: () => shell.close() }));
    const head = el('div', { className: 'quiz__head' }, el('p', { className: 'kicker', textContent: 'Build my plan' }), el('h2', { textContent: s.title }), s.sub ? el('p', { className: 'lede', textContent: s.sub }) : null);
    let body, next;
    if (s.type === 'text') {
      const ta = el('textarea', { rows: 4, maxLength: 300, placeholder: s.placeholder, value: ans.q });
      ta.addEventListener('input', () => { ans.q = ta.value; });
      body = el('label', { className: 'quiz__text' }, el('span', { className: 'sr', textContent: s.title }), ta);
      next = el('button', { type: 'button', className: 'btn btn--dark quiz__next', onclick: finish }, 'Show my plan', el('span', { innerHTML: icon('arrow') }));
      setTimeout(() => ta.focus(), 50);
    } else {
      const many = s.type === 'many';
      const sel = many ? new Set(ans[s.id]) : null;
      body = el('div', { className: `quiz__opts${s.options.length > 6 ? ' quiz__opts--wide' : ''}`, role: many ? 'group' : 'radiogroup', ariaLabel: s.title });
      next = el('button', { type: 'button', className: 'btn btn--dark quiz__next', onclick: () => go(step + 1) }, many ? 'Next' : 'Skip', el('span', { innerHTML: icon('arrow') }));
      const sync = () => { if (many) { next.disabled = false; next.firstChild.textContent = sel.size ? 'Next' : 'Skip'; } };
      for (const o of s.options) {
        const b = el('button', { type: 'button', className: 'quiz__opt' }, el('b', { textContent: o.label }), o.hint ? el('small', { textContent: o.hint }) : null);
        const on = many ? sel.has(o.id) : ans[s.id] === o.id;
        b.setAttribute(many ? 'aria-pressed' : 'aria-checked', on); if (!many) b.setAttribute('role', 'radio');
        b.addEventListener('click', () => {
          if (many) {
            if (sel.has(o.id)) sel.delete(o.id);
            else { if (o.id === 'all') sel.clear(); else sel.delete('all'); if (sel.size >= (s.max || 99)) sel.delete([...sel][0]); sel.add(o.id); }
            ans[s.id] = [...sel];
            body.querySelectorAll('.quiz__opt').forEach((x, k) => x.setAttribute('aria-pressed', sel.has(s.options[k].id)));
            sync();
          } else {
            ans[s.id] = o.id;
            body.querySelectorAll('.quiz__opt').forEach(x => x.setAttribute('aria-checked', x === b));
            setTimeout(() => go(step + 1), 160);
          }
        });
        body.append(b);
      }
      sync();
    }
    box.replaceChildren(bar, top, head, body, el('div', { className: 'quiz__foot' }, next));
    box.querySelector('.quiz__opt, textarea')?.focus({ preventScroll: true });
  }
  paint();
}
