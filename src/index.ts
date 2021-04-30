import tl = require("azure-pipelines-task-lib/task");

// ## We need a function to get our job done.
async function run() {
  try {
    //#region You can take current branch name with following code.
    let branchName: string | undefined = tl.getVariable(
      "Build.SourceBranchName"
    );
    // //#endregion

    //#region When there is a parameter we want to import for extension, you can get it with the command `getInput`.
    let projectName: string | undefined = tl.getInput("projectName", true); // Proje adını dışardan string olarak alıyoruz.
    //#endregion

    console.log("Current Branch Name: ", branchName);
    console.log("##Parameter - ProjectName: ", projectName);
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

// ## We call the function created above here.
run();
