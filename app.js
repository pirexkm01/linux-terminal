const term = new Terminal();
term.open(document.getElementById("terminal"));

let buffer = "";

// 🔑
const API_KEY = "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";

// 👤 LOGIN SYSTEM
let username = "";
let loggedIn = false;

// 📂 File system simulation
let fs = {
  "/": {
    home: {
      user: {
        "file.txt": "Hello world",
        docs: {}
      }
    }
  }
};

// 👥 users
let users = ["root"];

// ================= START =================
term.write("Welcome to Terminal \r\n");
term.write("Enter username: ");

// ================= INPUT =================
term.onData(async (key) => {

  if (key === "\r") {

    term.write("\r\n");

    // 🧑 LOGIN
    if (!loggedIn) {
      username = buffer.trim();
      loggedIn = true;

      users.push(username);

      term.write(`Welcome ${username} 🔥\r\n`);
      term.write(`${username}@a-terminal:~$ `);

      buffer = "";
      return;
    }

    await handle(buffer.trim());
    buffer = "";

    term.write(`\r\n${username}@a-terminal:~$ `);

  } else {
    buffer += key;
    term.write(key);
  }
});

// ================= HELP =================
function help() {
  term.write(`
COMMANDS:
ls        - list files
pwd       - show path
mkdir     - create folder
touch     - create file
rm        - delete file
users     - show users
adduser   - add user
deluser   - delete user
clear     - clear screen
help      - show help


Instagram: @siir_pirex
`);
}

// ================= LOCAL COMMANDS =================
function ls() {
  term.write("file.txt  docs");
}

function pwd() {
  term.write("/home/" + username);
}

function mkdir(name) {
  if (!name) return term.write("missing name");
  term.write("folder created: " + name);
}

function touch(name) {
  if (!name) return term.write("missing name");
  term.write("file created: " + name);
}

function rm(name) {
  if (!name) return term.write("missing name");
  term.write("deleted: " + name);
}

// ================= USERS =================
function usersList() {
  term.write(users.join(" "));
}

function addUser(name) {
  if (!name) return term.write("missing user");
  users.push(name);
  term.write("user added: " + name);
}

function delUser(name) {
  if (!name) return term.write("missing user");
  users = users.filter(u => u !== name);
  term.write("user deleted: " + name);
}

// ================= SECURITY =================
function security(cmd) {
  if (cmd === "rm -rf /") {
    term.write("sir tl3b awlidi hhhh 😂");
    return true;
  }
  return false;
}

// ================= AI =================
async function callAI(cmd) {

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are a Linux terminal simulator.
Return ONLY terminal output.
No explanations.
User: ${username}
`
          },
          {
            role: "user",
            content: cmd
          }
        ]
      })
    });

    const data = await res.json();
    term.write(data.choices[0].message.content);

  } catch (e) {
    term.write("error ❌");
  }
}

// ================= COMMAND HANDLER =================
async function handle(cmd) {

  if (!cmd) return;

  if (security(cmd)) return;

  let parts = cmd.split(" ");
  let c = parts[0];
  let arg = parts[1];

  switch (c) {

    case "help":
      help();
      break;

    case "ls":
      ls();
      break;

    case "pwd":
      pwd();
      break;

    case "mkdir":
      mkdir(arg);
      break;

    case "touch":
      touch(arg);
      break;

    case "rm":
      rm(arg);
      break;

    case "users":
      usersList();
      break;

    case "adduser":
      addUser(arg);
      break;

    case "deluser":
      delUser(arg);
      break;

    case "clear":
      term.clear();
      break;

    default:
      await callAI(cmd);
  }
}
