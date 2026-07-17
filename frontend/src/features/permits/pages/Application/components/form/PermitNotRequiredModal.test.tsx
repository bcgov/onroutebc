import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  PPC_EMAIL,
  TOLL_FREE_NUMBER,
} from "../../../../../../common/constants/constants";
import { ONROUTE_WEBPAGE_LINKS } from "../../../../../../routes/constants";
import { PermitNotRequiredModal } from "./PermitNotRequiredModal";

describe("PermitNotRequiredModal", () => {
  it("displays the permit guidance and closes from the Close button", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<PermitNotRequiredModal isOpen={true} onClose={onClose} />);

    expect(
      screen.getByRole("heading", {
        name: "This permit type is not required",
      }),
    ).toBeVisible();
    expect(
      screen.getByText(
        "Please note that you may require a different permit type.",
      ),
    ).toBeVisible();
    expect(screen.getByText(`Toll-free: ${TOLL_FREE_NUMBER}`)).toBeVisible();
    expect(screen.getByText(`Email: ${PPC_EMAIL}`)).toBeVisible();
    expect(
      screen.getByRole("link", {
        name: "Commercial Transport Procedures Manual",
      }),
    ).toHaveAttribute(
      "href",
      ONROUTE_WEBPAGE_LINKS.COMMERCIAL_TRANSPORT_PROCEDURES,
    );

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalledOnce();
  });
});
