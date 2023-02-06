// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ChatGPTAPI } from "chatgpt";
import {
  window,
  commands,
  ExtensionContext,
  workspace,
  ExtensionMode,
} from "vscode";
import { splitByCodeBlocks } from "./splitByCodeBlocks";
import { wrapToExec } from "./wrapToExec";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: ExtensionContext) {
  const config = workspace.getConfiguration("chatgpt-pair-programming");

  const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY || config.get("apiKey") || "",
  });
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "chatgpt-pair-programming" is now active!'
  );

  /**
   * Shows a pick list using window.showQuickPick().
   */
  async function showQuickPick() {
    let i = 0;
    // const result = await window.showQuickPick(["Rust", "Go", "Brainfuck"], {
    //   placeHolder: "eins, zwei or drei",
    //   onDidSelectItem: (item) =>
    //     window.showInformationMessage(`Focus ${++i}: ${item}`),
    // });

    const result = await window.showInputBox({
      value: "Write a shell command to create a skeleton nodejs web app",
      valueSelection: [0, -1],
      placeHolder: "Write a shell command to create a skeleton nodejs web app",
      validateInput: (text) => {
        //window.showInformationMessage(`Validating: ${text}`);
        return text === "123" ? "Not 123!" : null;
      },
    });

    if (result) {
      console.log(`Selected ${result}, asking ChatGPT...`);
      const ask = api.sendMessage(result);
      window.setStatusBarMessage("ChatGPT...", ask);
      const res = await ask;
      window.showInformationMessage("ChatGPT replied");
      console.log("; ChatGPT reply:", res);
      const l = window.createOutputChannel("ChatGPT Pair Programming", {
        log: true,
      });
      l.info("User:", result);
      l.info("ChatGPT:");
      const blocks = splitByCodeBlocks(res.text);
      console.log("; Blocks:", blocks);
      const codeDir =
        context.extensionMode === ExtensionMode.Production
          ? undefined
          : __dirname + "/../sandbox";
      const term = window.createTerminal({
        name: "ChatGPT Pair Programming Terminal",
        cwd: codeDir,
      });

      ////////
      for (const block of blocks) {
        if (block.isCode) {
          l.warn(`${block.meta ? block.meta : "code"}:\n${block.text}`);
          const snippet = wrapToExec(
            block.text,
            config.get("wrappingTemplate") as string
          );
          l.warn(`To execute this (wrapped) snippet:\n${snippet}`);
          const yesno = (config.get("askBeforeEachRun") as boolean)
            ? await window.showInformationMessage(
                `Run snippet from ChatGPT?\nTerminal will be created${
                  context.extensionMode !== ExtensionMode.Production
                    ? " in sandbox " + codeDir
                    : ""
                }.`,
                "Yes",
                "No"
              )
            : "Yes";
          console.log("; yesno:", yesno);
          if (yesno === "Yes") {
            term.show();
            term.sendText(snippet);
          }
        } else {
          l.info(block.text);
        }
      }
      l.show();
    }
  }

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = commands.registerCommand(
    "chatgpt-pair-programming.ask",
    async () => {
      showQuickPick();
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
