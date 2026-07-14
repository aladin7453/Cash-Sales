"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils/cn"

export function Breadcrumb(props: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" {...props} />
}

export function BreadcrumbList(
  props: React.ComponentProps<"ol">
) {
  return (
    <ol
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-sm"
      )}
      {...props}
    />
  )
}

export function BreadcrumbItem(
  props: React.ComponentProps<"li">
) {
  return (
    <li
      className="inline-flex items-center gap-1.5"
      {...props}
    />
  )
}

export function BreadcrumbLink({
  asChild,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      className="hover:text-foreground transition-colors"
      {...props}
    />
  )
}

export function BreadcrumbPage(
  props: React.ComponentProps<"span">
) {
  return (
    <span
      className="text-foreground font-normal"
      {...props}
    />
  )
}

export function BreadcrumbSeparator(
  props: React.ComponentProps<"li">
) {
  return (
    <li role="presentation" {...props}>
      <ChevronRight className="h-3.5 w-3.5" />
    </li>
  )
}

export function BreadcrumbEllipsis(
  props: React.ComponentProps<"span">
) {
  return (
    <span {...props}>
      <MoreHorizontal className="h-4 w-4" />
    </span>
  )
}