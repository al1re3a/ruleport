import { generateFiles } from '../src/generator.js';

const example = {
  name: 'Acme Dashboard',
  summary: 'A local-first analytics dashboard for independent teams.',
  stack: ['TypeScript', 'React', 'PostgreSQL'],
  commands: { dev: 'npm run dev', test: 'npm test', check: 'npm run check' },
  conventions: ['Use accessible semantic HTML.', 'Keep domain logic outside UI components.', 'Prefer named exports.'],
  boundaries: ['Never log customer data.', 'Do not change database migrations after release.', 'Ask before adding dependencies.'],
  verification: ['Run tests and type checking.', 'Check the affected flow at mobile width.', 'Document user-visible behavior.'],
  scope: '**/*.{ts,tsx,sql}'
};

const policy = document.querySelector('#policy');
const output = document.querySelector('#output');
const status = document.querySelector('#status');
const tabs = document.querySelector('#tabs');
const filename = document.querySelector('#filename');
let generated = {};
let active = 'AGENTS.md';

function render() {
  try {
    generated = generateFiles(JSON.parse(policy.value));
    const names = Object.keys(generated);
    if (!names.includes(active)) active = names[0];
    tabs.replaceChildren(...names.map((name) => {
      const button = document.createElement('button');
      button.textContent = name.split('/').pop();
      button.title = name;
      button.className = name === active ? 'active' : '';
      button.onclick = () => { active = name; render(); };
      return button;
    }));
    output.textContent = generated[active];
    filename.textContent = active;
    status.textContent = `${names.length} files ready · nothing uploaded`;
    status.classList.remove('error');
  } catch (error) {
    status.textContent = error.message;
    status.classList.add('error');
  }
}

policy.value = JSON.stringify(example, null, 2);
policy.addEventListener('input', render);
document.querySelector('#example').onclick = () => { policy.value = JSON.stringify(example, null, 2); render(); };
document.querySelector('#copy').onclick = async () => { await navigator.clipboard.writeText(generated[active]); status.textContent = 'Copied to clipboard'; };
document.querySelector('#download').onclick = () => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([generated[active]], { type: 'text/markdown' }));
  link.download = active.split('/').pop();
  link.click();
  URL.revokeObjectURL(link.href);
};
render();
