import * as React from "react"
import { cn } from "@/lib/utils/cn"
import { ChevronDown, ChevronUp } from "lucide-react"

// Custom hook to detect mobile view
const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

// Create a context for the collapsible state
const CollapsibleContext = React.createContext<{
  isCollapsible?: boolean;
  isCollapsed?: boolean;
  setIsCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
}>({});

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, collapsible = false, defaultCollapsed = false, ...props }, ref) => {
    const isMobile = useIsMobile();
    const [isCollapsed, setIsCollapsed] = React.useState(
      collapsible ? (isMobile ? true : defaultCollapsed) : false
    );

    // Update collapsed state when screen size changes
    React.useEffect(() => {
      if (collapsible) {
        setIsCollapsed(isMobile ? true : defaultCollapsed);
      }
    }, [isMobile, collapsible, defaultCollapsed]);

    return (
      <CollapsibleContext.Provider value={{ isCollapsible: collapsible, isCollapsed, setIsCollapsed }}>
        <div
          ref={ref}
          className={cn(
            "rounded-lg border bg-card text-card-foreground shadow-sm",
            collapsible && isCollapsed && "self-start h-auto",
            className
          )}
          {...props}
        />
      </CollapsibleContext.Provider>
    )
  }
)
Card.displayName = "Card"

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  additionalControls?: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, additionalControls, ...props }, ref) => {
    const { isCollapsible, isCollapsed, setIsCollapsed } = React.useContext(CollapsibleContext);
    
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col space-y-1.5 p-6",
          isCollapsible && "cursor-pointer",
          className
        )}
        {...props}
        onClick={(e) => {
          if (isCollapsible && props.onClick) {
            props.onClick(e);
          }
        }}
      >
        <div className="flex justify-between items-center">
          <div className="flex-1">
            {props.children}
          </div>
          <div className="flex items-center space-x-2">
            {additionalControls}
            {isCollapsible && setIsCollapsed && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCollapsed(!isCollapsed);
                }}
                className="flex items-center justify-center h-6 w-6 rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                {isCollapsed ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronUp size={18} />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isCollapsible, isCollapsed } = React.useContext(CollapsibleContext);
  
  if (isCollapsible && isCollapsed) {
    return null;
  }
  
  return (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
})
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isCollapsible, isCollapsed } = React.useContext(CollapsibleContext);
  
  if (isCollapsible && isCollapsed) {
    return null;
  }
  
  return (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
})
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
