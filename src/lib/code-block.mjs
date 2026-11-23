const plainLanguages = new Set(['', 'plaintext', 'text']);

const iconAttributes = {
  width: '14',
  height: '14',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  'aria-hidden': 'true',
};

const copyShapes = [
  ['rect', { width: '14', height: '14', x: '8', y: '8', rx: '2' }],
  ['path', { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' }],
];

function attributes(props) {
  return Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
}

export const copyIconHtml = `<svg ${attributes(iconAttributes)}>${copyShapes
  .map(([tag, props]) => `<${tag} ${attributes(props)}/>`)
  .join('')}</svg>`;

export function languageLabel(language) {
  return plainLanguages.has(language ?? '') ? '' : language;
}

function element(tagName, properties, children = []) {
  return { type: 'element', tagName, properties, children };
}

function bar(language) {
  const label = languageLabel(language);
  return element('div', { className: ['code-block__bar'] }, [
    element('span', { className: ['code-block__lang'] }, label ? [{ type: 'text', value: label }] : []),
    element('button', { type: 'button', className: ['copy-button'] }, [
      element(
        'svg',
        iconAttributes,
        copyShapes.map(([tag, props]) => element(tag, props)),
      ),
      element('span', {}, [{ type: 'text', value: '复制' }]),
    ]),
  ]);
}

const wrapped = new WeakSet();

export const codeBlockBar = {
  name: 'code-block-bar',
  element: {
    filter: ['pre'],
    visit(node) {
      if (wrapped.has(node)) return;
      wrapped.add(node);
      const properties = node.properties ?? {};
      const language = properties.dataLanguage ?? properties['data-language'];
      const pre = { ...node, properties: { ...properties, translate: 'no' } };
      wrapped.add(pre);
      return element('div', { className: ['code-block'] }, [bar(language), pre]);
    },
  },
};
