import { Node, mergeAttributes } from '@tiptap/core';

// 自定义 style 节点
const Style = Node.create({
  name: 'style',

  group: 'block',

  atom: true, // 原子节点，不可嵌套其他节点

  addAttributes() {
    return {
      content: {
        default: '' // 用于保存 <style> 标签中的 CSS 内容
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: 'style',
        getAttrs: (node) => {
          // 从 <style> 标签中获取内容
          return { content: node.textContent };
        }
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'style',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      HTMLAttributes.content
    ];
  },

  // 当该节点被添加到文档中时，自动将内容插入到页面的 <head> 中
  // @ts-ignore
  addNodeView() {
    return ({ node }) => {
      const styleContent = node.attrs.content;

      // 创建 <style> 元素
      const styleElement = document.createElement('style');
      styleElement.textContent = styleContent;

      // 确保样式只添加一次，不会重复添加
      if (!document.querySelector(`style[data-tiptap-style-id="${node.attrs.id}"]`)) {
        styleElement.setAttribute('data-tiptap-style-id', node.attrs.id);
        document.head.appendChild(styleElement);
      }

      return null; // 这个节点不需要在编辑器中渲染为可见元素
    };
  }
});

export default Style;
