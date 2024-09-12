import { useAppState } from "@/app/_providers/app-state-context";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger
} from "@/components/ui/menubar";

interface MainNavProps {
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onPrint: () => void;
}

export function MainNav({
  onNew: onNew,
  onOpen: onOpen,
  onSave: onSave,
  onPrint: onPrint
}: MainNavProps) {
  const { planMode } = useAppState();

  return (
    <Menubar className="bg-transparent border-none opacity-50 hover:opacity-100">
      <MenubarMenu>
        <MenubarTrigger className="font-bold">File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onSelect={onNew}>
            New <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onSelect={onOpen}>
            Open... <MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onSelect={onSave}>
            Save <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onSelect={onPrint} disabled={!planMode}>
            Print <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
