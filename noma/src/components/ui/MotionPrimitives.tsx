import type { ReactNode } from 'react'
import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from 'motion/react'

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

/**
 * Crisp route-level entrance transition. Key by `location.pathname` at the
 * layout level so every navigation animates smoothly instead of snapping.
 */
export function PageTransition({ children, className }: PageTransitionProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}

/**
 * Viewport-triggered scroll reveal. Uses `amount: 'some'` so tall sections on
 * mobile viewports always trigger as soon as they enter view and never stay hidden.
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  y = 22,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.45, delay, ease: EASE_OUT_EXPO }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerGridProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
  children: ReactNode
  className?: string
  staggerDelay?: number
  delayChildren?: number
  /**
   * Set to true for tab-switched or dynamically keyed grids already in view
   * so they animate immediately on mount instead of waiting for scroll.
   */
  animateOnMount?: boolean
}

export function StaggerGrid({
  children,
  className,
  staggerDelay = 0.055,
  delayChildren = 0,
  animateOnMount = false,
  ...rest
}: StaggerGridProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
    exit: {
      opacity: 0,
      y: -6,
      transition: { duration: 0.14, ease: EASE_OUT_EXPO },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      {...(animateOnMount
        ? { animate: 'visible', exit: 'exit' }
        : {
            whileInView: 'visible',
            viewport: { once: true, amount: 'some' },
          })}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: ReactNode
  className?: string
}

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: EASE_OUT_EXPO },
  },
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div variants={staggerItemVariants} className={className}>
      {children}
    </motion.div>
  )
}
