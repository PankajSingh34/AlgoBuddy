import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import PlaybackControls from "@/app/components/ui/PlaybackControls";

describe("PlaybackControls", () => {
  it("exposes discrete playback speed options and forwards changes", () => {
    const onSpeedChange = jest.fn();

    render(
      <PlaybackControls
        speed={1}
        onSpeedChange={onSpeedChange}
      />
    );

    const halfSpeed = screen.getByRole("radio", { name: /0.5 times playback speed/i });
    const oneSpeed = screen.getByRole("radio", { name: /1 times playback speed/i });
    const twoSpeed = screen.getByRole("radio", { name: /2 times playback speed/i });
    const fourSpeed = screen.getByRole("radio", { name: /4 times playback speed/i });

    expect(halfSpeed).toHaveAttribute("aria-checked", "false");
    expect(oneSpeed).toHaveAttribute("aria-checked", "true");
    expect(twoSpeed).toHaveAttribute("aria-checked", "false");
    expect(fourSpeed).toHaveAttribute("aria-checked", "false");

    fireEvent.click(fourSpeed);

    expect(onSpeedChange).toHaveBeenCalledWith(4);
  });
});
