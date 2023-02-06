import * as assert from "assert";
import { wrapToExec } from "../../wrapToExec";

describe("wrapToExec", () => {
  it("should wrap", () => {
    assert.strictEqual(
      wrapToExec("mkdir myapp", "bash -s <<EOF\n[SNIPPET]\nEOF"),
      "bash -s <<EOF\nmkdir myapp\nEOF\n"
    );
  });
  it("should wrap with smart last new line", () => {
    assert.strictEqual(
      wrapToExec("mkdir myapp\n", "bash -s <<EOF\n[SNIPPET]\nEOF"),
      "bash -s <<EOF\nmkdir myapp\nEOF\n"
    );
  });
});
