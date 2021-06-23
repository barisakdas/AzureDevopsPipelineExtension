import tl = require("azure-pipelines-task-lib/task");

// ## We need a function to get our job done.
async function run() {
  try {
    let variableSample: string | undefined = tl.variableSample("Build.SourceBranchName");
    // When there is a parameter we want to import for extension, you can get it with the command `getInput`.
    let inputSample: string | undefined = tl.getInput("inputSample", true); 
    
    console.log("## input sample: ", inputSample);
    console.log("## system variable sample: ", variableSample); // system variables 
    
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

// ## We call the function created above here.
run();
