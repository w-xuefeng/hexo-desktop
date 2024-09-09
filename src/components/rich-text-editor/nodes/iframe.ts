import { Node, mergeAttributes } from '@tiptap/core';

const Iframe = Node.create({
  name: 'iframe',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null
      },
      frameborder: {
        default: 0
      },
      allow: {
        default: null
      },
      allowfullscreen: {
        default: false
      },
      width: {
        default: '100%'
      },
      height: {
        default: '400'
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: 'iframe'
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['iframe', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  }
});

export default Iframe;
