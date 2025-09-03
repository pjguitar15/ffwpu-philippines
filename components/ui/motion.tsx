"use client"

import { motion, type MotionProps } from 'framer-motion'
import type { HTMLAttributes, PropsWithChildren } from 'react'
import clsx from 'clsx'

type FadeInProps = PropsWithChildren<
  {
    className?: string
    delay?: number
    y?: number
    duration?: number
  } & HTMLAttributes<HTMLDivElement> & MotionProps
>

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 18,
  duration = 0.55,
  ...rest
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
  transition={{ duration, delay, ease: 'easeInOut' }}
      className={clsx(className)}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

type StaggerProps = PropsWithChildren<{
  className?: string
  delayChildren?: number
  stagger?: number
  viewportAmount?: number
  once?: boolean
}>

export function StaggerContainer({
  children,
  className,
  delayChildren = 0.05,
  stagger = 0.05,
  viewportAmount = 0.2,
  once = true,
}: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
  viewport={{ once, amount: viewportAmount }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: stagger, delayChildren },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

type FadeInItemProps = PropsWithChildren<
  { className?: string; duration?: number; y?: number } &
  HTMLAttributes<HTMLDivElement> &
  MotionProps
>

export function FadeInItem({ children, className, duration = 0.45, y = 14, ...rest }: FadeInItemProps) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y }, show: { opacity: 1, y: 0 } }}
      transition={{ duration, ease: 'easeInOut' }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function PopInItem({
  children,
  className,
  delay = 0,
  duration = 0.24,
  y = 6,
  scale = 0.98,
}: PropsWithChildren<{ className?: string; delay?: number; duration?: number; y?: number; scale?: number }>) {
  return (
    <motion.div
      initial={{ opacity: 0, y, scale }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ delay, duration, ease: 'easeInOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
