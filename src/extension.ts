// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ChatGPTAPI } from "chatgpt";
import { window, commands, ExtensionContext } from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: ExtensionContext) {
  const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY || "",
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
      value: "python",
      valueSelection: [0, -1],
      placeHolder: "For example: Python, Scala, Node.",
      validateInput: (text) => {
        window.showInformationMessage(`Validating: ${text}`);
        return text === "123" ? "Not 123!" : null;
      },
    });

    if (result) {
      console.log(`Selected ${result}, asking ChatGPT...`);
      const ask = api.sendMessage(
        `Write a Hello World! app in ${result}. And explain it.`
      );
      window.setStatusBarMessage("ChatGPT...", ask);
      const res = await ask;
      console.log(res);
      window.showInformationMessage("ChatGPT replied");
      const l = window.createOutputChannel("ChatGPT Pair Programming", {
        log: true,
      });
      l.append(res.text);
      l.show();
    }
  }

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = commands.registerCommand(
    "chatgpt-pair-programming.helloWorld",
    async () => {
      showQuickPick();
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
