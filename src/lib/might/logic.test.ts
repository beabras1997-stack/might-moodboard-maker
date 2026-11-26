import { describe, it, expect } from "vitest";
import { aggregate } from "./logic";
import { initialState } from "./store";

describe("All MighT", () => {
  it("ships with three accepted demo MighTs so All MighT unlocks", () => {
    expect(initialState().received.filter((r) => r.status === "accepted")).toHaveLength(3);
  });
  it("weights words by how many accepted MighTs used them", () => {
    const acc = initialState().received.filter((r) => r.status === "accepted");
    expect(aggregate(acc).pers[0]).toEqual({ tag: "Criativa", count: 2, pct: 67 });
  });
});
