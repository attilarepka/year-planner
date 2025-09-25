import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MainNav } from "./main-nav";
import { expect, describe, it, vi, Mock, beforeEach } from "vitest";
import * as AppStateContext from "@/app/_providers/app-state-context";

describe("MainNav", () => {
  let onNew: Mock;
  let onOpen: Mock;
  let onSave: Mock;
  let onPrint: Mock;

  beforeEach(() => {
    onNew = vi.fn();
    onOpen = vi.fn();
    onSave = vi.fn();
    onPrint = vi.fn();
  });

  const user = userEvent.setup();

  it("should render all menu items correctly", async () => {
    vi.spyOn(AppStateContext, "useAppState").mockReturnValue({
      planMode: true
    });

    render(
      <MainNav
        onNew={onNew}
        onOpen={onOpen}
        onSave={onSave}
        onPrint={onPrint}
      />
    );

    expect(screen.getByText("File")).toBeInTheDocument();

    await waitFor(() => {
      user.click(screen.getByText("File"));
      expect(screen.getByText("New")).toBeInTheDocument();
      expect(screen.getByText("Open...")).toBeInTheDocument();
      expect(screen.getByText("Save")).toBeInTheDocument();
      expect(screen.getByText("Print")).toBeInTheDocument();
    });
  });

  it("should call the appropriate callbacks when menu items are clicked", async () => {
    vi.spyOn(AppStateContext, "useAppState").mockReturnValue({
      planMode: true
    });

    render(
      <MainNav
        onNew={onNew}
        onOpen={onOpen}
        onSave={onSave}
        onPrint={onPrint}
      />
    );
    expect(screen.getByText("File")).toBeInTheDocument();

    await waitFor(() => {
      user.click(screen.getByText("File"));
      expect(screen.getByText("New")).toBeInTheDocument();
      expect(screen.getByText("Open...")).toBeInTheDocument();
      expect(screen.getByText("Save")).toBeInTheDocument();
      expect(screen.getByText("Print")).toBeInTheDocument();
    });

    await user.click(screen.getByText("File"));
    const newItem = await screen.findByText("New");
    await user.click(newItem);

    await user.click(screen.getByText("File"));
    const openItem = await screen.findByText("Open...");
    await user.click(openItem);

    await user.click(screen.getByText("File"));
    const saveItem = await screen.findByText("Save");
    await user.click(saveItem);

    await user.click(screen.getByText("File"));
    const printItem = await screen.findByText("Print");
    await user.click(printItem);

    await waitFor(() => {
      expect(onNew).toHaveBeenCalledTimes(1);
      expect(onOpen).toHaveBeenCalledTimes(1);
      expect(onSave).toHaveBeenCalledTimes(1);
      expect(onPrint).toHaveBeenCalledTimes(1);
    });
  });

  it('should disable the "Print" menu item when planMode is false', async () => {
    vi.spyOn(AppStateContext, "useAppState").mockReturnValue({
      planMode: false
    });

    render(
      <MainNav
        onNew={onNew}
        onOpen={onOpen}
        onSave={onSave}
        onPrint={onPrint}
      />
    );

    await user.click(screen.getByText("File"));
    await waitFor(() => {
      expect(screen.getByText("New")).toBeInTheDocument();
      expect(screen.getByText("Open...")).toBeInTheDocument();
      expect(screen.getByText("Save")).toBeInTheDocument();
      expect(screen.getByText("Print")).toBeInTheDocument();
    });

    const printButton = screen.getByText("Print");

    expect(printButton).toHaveAttribute("aria-disabled", "true");

    await user.click(printButton);
    await waitFor(() => {
      expect(onPrint).not.toHaveBeenCalled();
    });
  });

  it('should enable the "Print" menu item when planMode is true', async () => {
    vi.spyOn(AppStateContext, "useAppState").mockReturnValue({
      planMode: true
    });

    render(
      <MainNav
        onNew={onNew}
        onOpen={onOpen}
        onSave={onSave}
        onPrint={onPrint}
      />
    );

    await user.click(screen.getByText("File"));
    await waitFor(() => {
      expect(screen.getByText("New")).toBeInTheDocument();
      expect(screen.getByText("Open...")).toBeInTheDocument();
      expect(screen.getByText("Save")).toBeInTheDocument();
      expect(screen.getByText("Print")).toBeInTheDocument();
    });

    const printButton = screen.getByText("Print");

    expect(printButton).not.toHaveAttribute("aria-disabled", "true");

    await user.click(printButton);
    await waitFor(() => {
      expect(onPrint).toHaveBeenCalledTimes(1);
    });
  });
});
