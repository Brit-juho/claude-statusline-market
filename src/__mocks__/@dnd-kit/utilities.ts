export const CSS = {
  Transform: {
    toString: (t: any) => t ? `translate3d(${t.x}px,${t.y}px,0)` : '',
  },
  Translate: {
    toString: (t: any) => t ? `translate(${t.x}px,${t.y}px)` : '',
  },
};
