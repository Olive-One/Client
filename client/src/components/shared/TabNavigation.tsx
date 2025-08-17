import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabNavigationProps {
  tabs: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  tabsListClassName?: string;
  tabsContentClassName?: string;
  orientation?: "horizontal" | "vertical";
}

const TabNavigation = React.forwardRef<HTMLDivElement, TabNavigationProps>(
  ({
    tabs,
    defaultValue,
    value,
    onValueChange,
    className,
    tabsListClassName,
    tabsContentClassName,
    orientation = "horizontal",
    ...props
  }, ref) => {
    const firstTab = tabs[0]?.id;
    const activeValue = value || defaultValue || firstTab;

    return (
      <Tabs
        ref={ref}
        value={activeValue}
        onValueChange={onValueChange}
        orientation={orientation}
        className={cn("w-full", className)}
        {...props}
      >
        <TabsList className={cn("bg-muted", tabsListClassName)}>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              disabled={tab.disabled}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent
            key={tab.id}
            value={tab.id}
            className={cn("space-y-6", tabsContentClassName)}
          >
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    );
  }
);

TabNavigation.displayName = "TabNavigation";

export { TabNavigation };