import { Node, mergeAttributes } from '@tiptap/core';

const Image = Node.create({
  name: 'customImage',

  group: 'inline',

  inline: true,

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null
      },
      alt: {
        default: null
      },
      title: {
        default: null
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]'
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  }
});

export default Image;
