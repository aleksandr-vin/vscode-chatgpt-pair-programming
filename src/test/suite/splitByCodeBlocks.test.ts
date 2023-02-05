import * as assert from "assert";
import { splitByCodeBlocks } from "../../splitByCodeBlocks";

describe("splitByCodeBlocks", () => {
  it("should not detect code blocks were there are none", () => {
    assert.deepEqual(splitByCodeBlocks(""), []);
    assert.deepEqual(splitByCodeBlocks("abc"), [
      { isCode: false, text: "abc" },
    ]);
  });

  it("should trim text blocks", () => {
    assert.deepEqual(splitByCodeBlocks("abc\n\nzxy"), [
      { isCode: false, text: "abc\n\nzxy" },
    ]);
    assert.deepEqual(splitByCodeBlocks("\n\n\nget\n\nsome\ngrog"), [
      { isCode: false, text: "get\n\nsome\ngrog" },
    ]);
  });

  it("should keep first para before code block", () => {
    assert.deepEqual(splitByCodeBlocks("**THIS**\n```\ntest\n\ntest\n```")[0], {
      isCode: false,
      text: "**THIS**",
    });
  });

  it("should detect code block", () => {
    assert.deepEqual(splitByCodeBlocks("```\ntest\n\ntest\n```"), [
      { isCode: true, text: "test\n\ntest\n", meta: undefined },
    ]);
  });

  it("should detect code block with language", () => {
    assert.deepEqual(splitByCodeBlocks("```python\ntest\n\ntest\n```"), [
      { isCode: true, text: "test\n\ntest\n", meta: "python" },
    ]);
  });

  it("should detect non-closed code block", () => {
    assert.deepEqual(splitByCodeBlocks("```\ntest\n\ntest\n"), [
      { isCode: true, text: "test\n\ntest\n\n", meta: undefined },
    ]);
  });

  it("should detect code block with text paragraph after", () => {
    assert.deepEqual(splitByCodeBlocks("```\ntest\n\ntest\n```**THAT**\n"), [
      { isCode: true, text: "test\n\ntest\n", meta: undefined },
      { isCode: false, text: "**THAT**" },
    ]);
  });

  it("should detect multiple code blocks", () => {
    assert.deepEqual(
      splitByCodeBlocks("```\ntest\n```**THAT\nIS\nFINE**\n```\ncat\n```"),
      [
        { isCode: true, text: "test\n", meta: undefined },
        { isCode: false, text: "**THAT\nIS\nFINE**" },
        { isCode: true, text: "cat\n", meta: undefined },
      ]
    );
  });
});
