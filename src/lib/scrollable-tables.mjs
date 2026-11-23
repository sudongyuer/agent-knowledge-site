export const scrollableTables = {
  name: 'scrollable-tables',
  element: {
    filter: ['table'],
    visit(node) {
      if (node.properties?.tabindex === '0') return;
      return { ...node, properties: { ...node.properties, tabindex: '0' } };
    },
  },
};
