import { describe, expect, it } from "vitest";
import { getContentPage } from "../src/content/pages";
import { specializations, standardClassTableRows } from "../src/content/squad-data";

describe("shared squad data", () => {
  it("drives the visible eight-class comparison instead of duplicating class facts", () => {
    const classesPage = getContentPage("/classes")!;
    const classTable = classesPage.blocks.find(
      (block) => block.type === "table" && block.heading === "The eight standard Specializations",
    );
    const standardNames = specializations
      .filter((entry) => entry.availability === "standard")
      .map((entry) => entry.name);

    expect(standardNames).toHaveLength(8);
    expect(standardClassTableRows.map((row) => row[0])).toEqual(standardNames);
    expect(classTable?.type).toBe("table");
    if (classTable?.type !== "table") throw new Error("Expected the class comparison table");
    expect(classTable.rows).toEqual(standardClassTableRows);
  });
});
