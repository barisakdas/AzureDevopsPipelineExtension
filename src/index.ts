import tl = require("azure-pipelines-task-lib/task");
import JiraApi from "jira-client";
import moment from "moment";

interface TaskHistory {
  date: string;
  from: string;
  fromString: string;
  to: string;
  toString: string;
}

// ## İşimizi halledecek bir fonksiyona ihtiyacımız var.
async function run() {
  try {
    //#region Azure Devopstan gelecek değişkenler.
    let branchName: string | undefined = tl.getVariable(
      "Build.SourceBranchName"
    ); // Gelecek branch name `feature-60-VOLT` şeklinde olacaktır.
    let jiraAdminUserName: string | undefined = tl.getVariable("JIRA.USERNAME");
    let jiraAdminUserPassword: string | undefined = tl.getVariable(
      "JIRA.PASSWORD"
    );
    let userName: string | undefined = tl.getVariable("Jira.DomainUsername"); // İşlemi yapan kişiye atama yapılacağı için ismi aldık.
    //#endregion Azure Devopstan gelecek değişkenler.

    //#region task.json dan alınacak input değişkenler
    let projectName: string | undefined = tl
      .getInput("projectName", true)
      ?.toUpperCase(); // Proje adını dışardan string olarak alıyoruz. Branch adına da yazılabilir. İki durumda uygun.
    let reviewController: string | undefined = tl.getInput(
      "reviewController",
      false
    ); // Testi yapacak kişinin kullanıcı adı
    //#endregion task.json dan alınacak input değişkenler

    //#region Local Variables
    let transactionId: number = 231;
    let adminUser: string = jiraAdminUserName ? jiraAdminUserName : "";
    let adminPass: string = jiraAdminUserPassword ? jiraAdminUserPassword : "";
    if (branchName?.includes("merge")) {
      branchName = tl.getVariable("System.PullRequest.SourceBranch");
      transactionId = 241; // Buradaki id `Test In Review` adımına gidecek transactionun id si olacak.
      userName = reviewController ? reviewController : "DTBULCAN";
    }
    console.log("branch: ", branchName);

    let issueKey: string = branchName
      ? projectName + "-" + branchName?.split("-", 3)[1].split(".", 1)[0]
      : "";
    console.log("issueKey: ", issueKey);

    let jiraUrl: string =
      "https://jira.digiturk.com.tr/rest/api/2/issue/" +
      issueKey +
      "/transitions";

    let bodyText: string = "";
    //#endregion Local Variables

    //#region JiraApi Connection
    var jira = new JiraApi({
      protocol: "https",
      host: "jira.digiturk.com.tr",
      username: adminUser,
      password: adminPass,
      apiVersion: "2",
      strictSSL: true,
    });
    //#endregion JiraApi Connection

    bodyText =
      `{
        "transition": {
            "id": "` +
      transactionId +
      `"
        },
        "assignee": {
            "name": "` +
      userName +
      `"
        }
    }
`;

    console.log("bodyTesxt: ", bodyText);
    await jiraChangeStatu(bodyText, adminUser, adminPass, jiraUrl);
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

async function jiraChangeStatu(
  bodyText: string,
  jiraAdminUserName: string,
  jiraAdminUserPassword: string,
  jiraUrl: string
) {
  // ## Bu fonksiyonun amacı task üzerindeki transaction geçişini ve geçiş için gerekli parametrelerin doldurulmasını sağlamak.
  // ## Buradaki `body` kısmı dışarda hazırlanıp dinamik olarak içeri alınmalıdır.
  const fetch = require("node-fetch");
  try {
    console.log("#### START API Post - Change Statu of Issue ####");
    const response = await fetch(jiraUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization:
          "Basic " +
          Buffer.from(jiraAdminUserName + ":" + jiraAdminUserPassword).toString(
            "base64"
          ),
      },
      body: bodyText,
    });
    console.log("#### END API Post - Change Statu of Issue ####");
    console.log("response: ", response);
  } catch (error) {
    tl.setResult(tl.TaskResult.Failed, error.message);
  }
}

// Yukarda oluşturulan fonksiyonu burada çağırıyoruz
run();
