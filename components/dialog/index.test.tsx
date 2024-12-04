import { render, fireEvent, screen } from "@testing-library/react";
import { ResetAlertDialog } from ".";
import { expect, describe, it, vi } from "vitest";

describe("ResetAlertDialog", () => {
  it('should render the dialog when "open" is true', () => {
    render(
      <ResetAlertDialog open={true} onOpenChange={vi.fn()} onAction={vi.fn()} />
    );

    expect(screen.getByText("Are you absolutely sure?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "This action cannot be undone. This will permanently delete your progress."
      )
    ).toBeInTheDocument();
  });

  it('should not render the dialog when "open" is false', () => {
    render(
      <ResetAlertDialog
        open={false}
        onOpenChange={vi.fn()}
        onAction={vi.fn()}
      />
    );

    expect(
      screen.queryByText("Are you absolutely sure?")
    ).not.toBeInTheDocument();
  });

  it("should call onAction when Continue is clicked", () => {
    const onAction = vi.fn();
    render(
      <ResetAlertDialog
        open={true}
        onOpenChange={vi.fn()}
        onAction={onAction}
      />
    );

    fireEvent.click(screen.getByText("Continue"));

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("should call onOpenChange when Cancel is clicked", () => {
    const onOpenChange = vi.fn();
    render(
      <ResetAlertDialog
        open={true}
        onOpenChange={onOpenChange}
        onAction={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText("Cancel"));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("should call onOpenChange when Continue is clicked", () => {
    const onOpenChange = vi.fn();
    render(
      <ResetAlertDialog
        open={true}
        onOpenChange={onOpenChange}
        onAction={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText("Continue"));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
