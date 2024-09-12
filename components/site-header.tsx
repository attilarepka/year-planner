"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { MainNav } from "@/components/main-nav";
import { useAppState } from "@/app/_providers/app-state-context";
import { usePrintContext } from "@/app/_providers/print-context";
import { useAppSettings } from "@/app/_providers/app-settings-context";
import { ResetAlertDialog } from "./dialog";

export function SiteHeader() {
  const { resetAppState, loadAppState, saveAppState, isInProgress } =
    useAppState();
  const { appSettings } = useAppSettings();
  const { onPrint } = usePrintContext();

  const [showModal, setShowModal] = useState(false);
  const [handleAction, setHandleAction] = useState<() => void>(() => () => {});

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const clickFileHandler = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleNewFile = () => {
    if (isInProgress()) {
      setHandleAction(() => resetAppState);
      setShowModal(true);
      return;
    }
    resetAppState();
  };

  const handleOpenFileInput = () => {
    if (isInProgress()) {
      setHandleAction(() => clickFileHandler);
      setShowModal(true);
      return;
    }
    clickFileHandler();
  };

  const handleOnSave = () => {
    const serializedYear = saveAppState();
    const blob = new Blob([serializedYear], { type: "application/json" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download =
      appSettings.currentYear + "_" + appSettings.country + ".json";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleOnPrint = () => {
    onPrint();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          const jsonString = event.target.result as string;
          try {
            loadAppState(jsonString);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }
      };

      reader.readAsText(file);
    }
  };

  return (
    <header className="bg-white dark:bg-zinc-900 sticky top-0 z-40 w-full border-b">
      <div className="flex w-full items-center justify-between border-p p-4 h-10">
        <MainNav
          onNew={handleNewFile}
          onOpen={handleOpenFileInput}
          onSave={handleOnSave}
          onPrint={handleOnPrint}
        />
        <div className="flex items-center space-x-4">
          <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={buttonVariants({ size: "icon", variant: "ghost" })}
                >
                  <Icons.gitHub className="h-5 w-5" />
                </div>
              </TooltipTrigger>
              <TooltipContent>Star on GitHub</TooltipContent>
            </Tooltip>
          </Link>
          <ThemeToggle />
        </div>
      </div>
      <Input
        id="year-file-input"
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="application/json"
        multiple={false}
        onChange={handleFileChange}
        onClick={(e) => ((e.target as HTMLTextAreaElement).value = "")}
      />
      <ResetAlertDialog
        open={showModal}
        onOpenChange={setShowModal}
        onAction={handleAction}
      />
    </header>
  );
}
