export const slide = {
  initial: {
    y: 24,
    opacity: 0,
    filter: "blur(4px)"
  },
  animate: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)"
  },
  exit: {
    opacity: 0,
    filter: "blur(6px)"
  },
  transition: {
    duration: 0.4,
    ease: [0.22, 1, 0.36, 1] as const
  }
} as const
