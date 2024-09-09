import { Node, mergeAttributes } from '@tiptap/core';

// 自定义 script 节点
const Script = Node.create({
  name: 'script',

  group: 'block',

  atom: true, // 原子节点，不嵌套其他内容

  addAttributes() {
    return {
      content: {
        default: '' // 保存 <script> 标签中的代码
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: 'script',
        getAttrs: (node) => {
          // 获取 <script> 标签中的 JavaScript 内容
          return { content: node.textContent };
        }
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'script',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      HTMLAttributes.content
    ];
  },

  // 当节点被添加时，立即执行 script 内容
  // @ts-ignore
  addNodeView() {
    return ({ node }) => {
      const scriptContent = node.attrs.content;

      // 创建 <script> 元素
      const scriptElement = document.createElement('script');
      scriptElement.textContent = scriptContent;

      // 插入并执行 JavaScript
      document.body.appendChild(scriptElement);

      // 防止重复执行，可以在执行完后移除
      document.body.removeChild(scriptElement);

      return null; // 不需要在编辑器中显示
    };
  }
});

export default Script;
