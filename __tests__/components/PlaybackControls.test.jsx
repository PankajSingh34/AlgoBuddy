import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import PlaybackControls from "@/app/components/ui/PlaybackControls";

describe("PlaybackControls", () => {
  it("exposes the requested playback speed range and forwards changes", () => {
    const onSpeedChange = jest.fn();

    render(
      <PlaybackControls
        speed={1}
        onSpeedChange={onSpeedChange}
      />
    );

    const speedSlider = screen.getByRole("slider", {
      name: /animation speed: 1x/i,
    });

    expect(speedSlider).toHaveAttribute("min", "0.25");
    expect(speedSlider).toHaveAttribute("max", "2");
    expect(speedSlider).toHaveAttribute("step", "0.25");
    expect(speedSlider).toHaveAttribute("aria-valuemin", "0.25");
    expect(speedSlider).toHaveAttribute("aria-valuemax", "2");

    fireEvent.change(speedSlider, { target: { value: "1.5" } });

    expect(onSpeedChange).toHaveBeenCalledWith(1.5);
  });
});
