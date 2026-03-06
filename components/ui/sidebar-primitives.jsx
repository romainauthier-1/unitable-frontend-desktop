"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"

const SidebarContext = React.createContext(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }

  return context
}

const SidebarProvider = React.forwardRef(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [openMobile, setOpenMobile] = React.useState(false)
    const [isMobile, setIsMobile] = React.useState(false)

    // Track mobile
    React.useEffect(() => {
      const mediaQuery = window.matchMedia("(max-width: 768px)")
      setIsMobile(mediaQuery.matches)

      const handleChange = (e) => {
        setIsMobile(e.matches)
      }

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }, [])

    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value) => {
        setOpenProp?.(value)
        _setOpen(value)
      },
      [setOpenProp]
    )

    const toggleSidebar = React.useCallback(() => {
      return isMobile ? setOpenMobile((x) => !x) : setOpen((x) => !x)
    }, [isMobile, setOpen])

    const state = open ? "expanded" : "collapsed"

    const value = {
      state,
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar,
    }

    return (
      <SidebarContext.Provider value={value}>
        <div
          ref={ref}
          className={cn("flex h-screen w-full", className)}
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            }
          }
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (collapsible === "none") {
      return (
        <div
          ref={ref}
          className={cn(
            "flex h-full w-[var(--sidebar-width)] flex-col bg-sidebar text-sidebar-foreground",
            className
          )}
          {...props}
        >
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <SheetPrimitive.Root open={openMobile} onOpenChange={setOpenMobile}>
          <SheetPrimitive.Portal>
            <SheetPrimitive.Overlay className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" />
            <SheetPrimitive.Content
              className={cn(
                "fixed inset-y-0 z-50 flex w-[var(--sidebar-width-mobile)] flex-col bg-sidebar text-sidebar-foreground duration-300",
                side === "left" ? "left-0 border-r" : "right-0 border-l"
              )}
              {...props}
            >
              {children}
              <SheetPrimitive.Close className="absolute right-2 top-2">
                <X className="h-4 w-4" />
              </SheetPrimitive.Close>
            </SheetPrimitive.Content>
          </SheetPrimitive.Portal>
        </SheetPrimitive.Root>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex h-full flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300",
          state === "collapsed" ? "w-[var(--sidebar-width-icon)]" : "w-[var(--sidebar-width)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef(
  ({ className, onClick, ...props }, ref) => {
    const { toggleSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      onClick={(e) => {
        onClick?.(e)
        toggleSidebar()
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "h-10 w-10",
        className
      )}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="4" x2="20" y1="12" y2="12" />
        <line x1="4" x2="20" y1="18" y2="18" />
      </svg>
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarRail = React.forwardRef(
  ({ className, ...props }, ref) => (
  <button
    ref={ref}
    onClick={() => {
      // toggle sidebar
    }}
    className={cn(
      "absolute inset-y-0 z-20 hidden w-1 bg-sidebar-border p-0 opacity-0 transition-all ease-linear hover:opacity-100 focus-visible:opacity-100 group-hover/sidebar-wrapper:opacity-100 md:flex",
      "right-0",
      className
    )}
    {...props}
  />
))
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex min-h-screen w-full flex-col bg-background",
        className
      )}
      {...props}
    />
  )
)
SidebarInset.displayName = "SidebarInset"

const SidebarHeader = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef(
  ({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-2 border-t p-4", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarSeparator = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("mx-2 my-2 h-px bg-sidebar-border", className)}
      {...props}
    />
  )
)
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarContent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden p-2",
        className
      )}
      {...props}
    />
  )
)
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative flex w-full min-w-0 flex-col p-4", className)}
      {...props}
    />
  )
)
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
)
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupAction = React.forwardRef(
  ({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
))
SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarGroupContent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("w-full text-sm", className)} {...props} />
  )
)
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex w-full min-w-0 flex-col gap-1", className)} {...props} />
  )
)
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("group/menu-item relative", className)} {...props} />
  )
)
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md px-2 py-1.5 text-sm outline-none ring-sidebar-ring transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-data-[collapsible=icon]:justify-center",
  {
    variants: {
      isActive: {
        true: "bg-sidebar-accent text-sidebar-accent-foreground",
        false: "text-sidebar-foreground/70",
      },
      size: {
        default: "h-8",
        sm: "h-7",
        lg: "h-12 rounded-md px-2",
      },
    },
    defaultVariants: {
      isActive: false,
      size: "default",
    },
  }
)

const SidebarMenuButton = React.forwardRef(
  (
    { asChild = false, isActive = false, size = "default", className, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
      ref={ref}
      className={cn(sidebarMenuButtonVariants({ isActive, size }), className)}
      {...props}
      />
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuAction = React.forwardRef(
  ({ className, showOnHover = false, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden",
      showOnHover &&
        "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[pressed=true]/menu-button:opacity-100 [&_svg]:size-4 opacity-0 transition-opacity",
      className
    )}
    {...props}
  />
))
SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarMenuBadge = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "absolute right-1 flex items-center justify-center rounded-md px-1 text-xs font-medium pointer-events-none ml-auto text-sidebar-foreground group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
)
SidebarMenuBadge.displayName = "SidebarMenuBadge"

const SidebarMenuSkeleton = React.forwardRef(
  ({ className, showIcon = false, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props}>
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex gap-2">
        {showIcon && <div className="h-8 w-8 rounded-md bg-sidebar-accent" />}
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-sidebar-accent rounded" />
          <div className="h-3 bg-sidebar-accent rounded w-[80%]" />
        </div>
      </div>
    ))}
  </div>
))
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuSkeleton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  SidebarInset,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar,
}
