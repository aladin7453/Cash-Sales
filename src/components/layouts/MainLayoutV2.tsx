"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { checkAccessToken } from "@/lib/constants";
import { DashboardProvider } from "../../app/dashboard/DashboardContext";
import LoadingUI from "../LoadingUI";
import LoadingUIV2 from "../LoadingUIV2";

import type { Dispatch, SetStateAction } from "react";

export default function MainLayout({
  children,
  isAccountLayout,
  isDashboardLayout,
  setIsDashboardLayout,
}: {
  children: React.ReactNode;
  isAccountLayout?: boolean;
  isDashboardLayout?: boolean;
  setIsDashboardLayout?: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [showSidebar, setShowSidebar] = useState(false);

  const [isLoadingLogOut, setIsLoadingLogOut] = useState(false);
  const [isDashboard, setIsDashboard] = useState(false);

  const toggleSidebar = () => setShowSidebar((prev) => !prev);
  const closeSidebar = () => setShowSidebar(false);
  const [isCompanySwitching, setIsCompanySwitching] = useState(false);

  // useEffect(() => {
  //   const username = JSON.parse(localStorage.getItem("username") ?? '""');
  //   const authToken = JSON.parse(localStorage.getItem("authToken") ?? '""');

  //   if (!username || !authToken) return;

  //   const validateToken = async () => {
  //     const isValid = await checkAccessToken(username, authToken);

  //     if (!isValid) {
  //       console.error("Session expired. Redirecting to login.");

  //       toast({
  //         variant: "destructive",
  //         title: "Session expired!",
  //         description: "Session expired. Redirecting to login.",
  //       });

  //       router.push("/login");
  //     }
  //   };

  //   validateToken();

  //   const interval = setInterval(
  //     () => {
  //       validateToken();
  //     },
  //     15 * 60 * 1000,
  //   );

  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    if (setIsDashboardLayout) {
      setIsDashboardLayout(isDashboard === true);
    }
  }, [isDashboard, setIsDashboardLayout]);

  return (
   <DashboardProvider>
      <div className="grid h-screen w-screen grid-rows-[1fr_auto]" id="root">
        <div
          className={`grid ${
            showSidebar ? "grid-cols-[auto_1fr]" : "grid-cols-[1fr]"
          } overflow-hidden md:grid-cols-[auto_1fr]`}
        >
          <div className="sticky left-0 top-0 z-30 h-full">
            <Sidebar
              showSidebar={showSidebar}
              onClose={closeSidebar}
              isDashboard={isDashboard}
              setIsDashboard={setIsDashboard}
            />
          </div>

          <div className="grid h-screen grid-rows-[auto_1fr] overflow-hidden bg-erp-gray-1">
            {/* Topbar - Breadcrumb & Settings */}
            <div className="sticky top-0 z-20">
              <Topbar
                isLoadingLogOut={isLoadingLogOut}
                setIsLoadingLogOut={setIsLoadingLogOut}
                toggleSidebar={toggleSidebar}
                isAccountLayout={isAccountLayout}
                onCompanySwitching={setIsCompanySwitching}
              />
            </div>

            {/* Workspace area */}
            <main
              className={`relative bg-white ${
                isCompanySwitching ? "overflow-hidden" : "overflow-auto"
              }`}
            >
              {/* Workspace loading */}
              {isCompanySwitching && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white">
                  <LoadingUIV2 />
                </div>
              )}

              {children}
            </main>

            {/* Footer  */}
            <div className="sticky bottom-0 z-10 hidden md:block">
              <Footer isDashboardLayout={isDashboardLayout} />
            </div>
          </div>
        </div>
        {isLoadingLogOut && <LoadingUI progressValue={50} />}
      </div>
      <Toaster />
    </DashboardProvider>
  );
}
