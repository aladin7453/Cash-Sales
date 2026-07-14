import React, { useEffect, useRef, useState } from "react";
import { FaBars, FaChevronLeft, FaChevronRight } from "react-icons/fa6";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type TabItem = {
  id: string;
  name: string;
  shortName: string;
  icon: React.ElementType;
};

interface TabsNavigatorProps {
  tabs: TabItem[];
  initialActiveTabId?: string;
  stickyTop?: string;
}

export function TabsNavigator({
  tabs,
  initialActiveTabId,
  stickyTop = "top-0",
}: TabsNavigatorProps) {
  const [activeTabId, setActiveTabId] = useState(initialActiveTabId || tabs[0].id);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const manualClickRef = useRef(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const visibleSections = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleSections.set(entry.target.id, {
            visible: entry.isIntersecting,
            ratio: entry.intersectionRatio,
          });
        });

        let maxRatio = 0;
        let mostVisibleId = activeTabId;

        visibleSections.forEach((data, id) => {
          if (data.visible && data.ratio > maxRatio) {
            maxRatio = data.ratio;
            mostVisibleId = id;
          }
        });

        if (maxRatio > 0 && mostVisibleId !== activeTabId) {
          setActiveTabId(mostVisibleId);
        }
      },
      {
        root: null,
        rootMargin: "0px 0px -20% 0px",
        threshold: [0.1, 0.2, 0.3, 0.4, 0.5],
      },
    );

    tabs.forEach((tab) => {
      const section = document.getElementById(tab.id);
      if (section) {
        observer.observe(section);
        visibleSections.set(tab.id, { visible: false, ratio: 0 });
      }
    });

    return () => {
      tabs.forEach((tab) => {
        const section = document.getElementById(tab.id);
        if (section) observer.unobserve(section);
      });
    };
  }, [tabs, activeTabId]);

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    const section = document.getElementById(tabId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      {isMobile && (
        <div className="relative">
          <button
            className="fixed right-0 top-1/2 z-10 flex h-11 w-6 -translate-y-1/2 items-center justify-center rounded bg-erp-blue-3 text-xs shadow-sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>
      )}
      <div
        className={`${
          isMobile ? (isOpen ? "flex" : "hidden") : "flex"
        } sticky ${stickyTop} flex-col pt-2`}
      >
        {tabs.map((tab) => (
          <TooltipProvider key={tab.id} delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={`#${tab.id}`}
                  className={`group flex h-11 w-12 flex-col items-center justify-center rounded-lg ${
                    activeTabId === tab.id
                      ? "bg-erp-blue-11 text-white"
                      : "bg-erp-blue-7 text-erp-blue-14"
                  } transition-all duration-300 hover:bg-erp-blue-11 hover:text-white`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabClick(tab.id);
                  }}
                >
                  <div
                    className={`${activeTabId === tab.id ? "text-white" : "text-erp-blue-14"} group-hover:text-white`}
                  >
                    <tab.icon className="h-4 w-4" />
                  </div>
                  <span
                    className={`w-12 truncate text-center text-[8px] ${activeTabId === tab.id ? "text-white" : "text-erp-blue-14"} group-hover:text-white`}
                  >
                    {tab.shortName}
                  </span>
                </a>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{tab.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}
