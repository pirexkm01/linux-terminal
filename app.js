const term = document.getElementById("terminal");

let line = document.createElement("div");
term.appendChild(line);

let input = document.createElement("input");
line.innerHTML = "Enter username: ";
line.appendChild(input);

let buffer = "";

// 🔑 AI KEY
const API_KEY = "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";

//  system
let username = "";
let loggedIn = false;

//  fake file system
let fs = {
  "/": {
    home: {
      user: {
        "file.txt": "Hello Linux",
        docs: {}
      }
    }
  }
};

let users = [];

// 
function print(text) {
  let div = document.createElement("div");
  div.innerText = text;
  term.insertBefore(div, line);
}

// 📌 help
function help() {
  print(`
COMMANDS:
ls        - list files
pwd       - show path
mkdir x   - create folder
touch x   - create file
rm x      - delete file
users     - show users
adduser x - add user
deluser x - delete user
clear     - clear screen
help

Instagram: @siir_pirex
`);
}

// 📌 basic commands
function ls() { print("file.txt  docs"); }
function pwd() { print("/home/" + username); }
function mkdir(x) { print("folder created: " + x); }
function touch(x) { print("file created: " + x); }

function rm(x) {
  if (x === "/") return print("sir tl3b awlidi hhhh 😂");
  print("deleted: " + x);
}

// 👥 users
function usersList() {
  print(users.join(" "));
}

function addUser(x) {
  users.push(x);
  print("user added: " + x);
}

function delUser(x) {
  users = users.filter(u => u !== x);
  print("user deleted: " + x);
}

// 🤖 AI fallback
async function AI(cmd) {
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
You are Linux terminal simulator.
Return ONLY terminal output.
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
    print(data.choices[0].message.content);

  } catch (e) {
    print(" error ❌");
  }
}

// 🚀 input handler
input.addEventListener("keydown", async (e) => {

  if (e.key === "Enter") {

    let cmd = input.value.trim();

    // 🧑 LOGIN FIRST
    if (!loggedIn) {
      username = cmd;
      loggedIn = true;

      users.push(username);

      print("Welcome " + username + " ");

      line.innerHTML = username + "@-terminal:~$ ";
      input.value = "";
      line.appendChild(input);
      return;
    }

    print(username + "@-terminal:~$ " + cmd);

    let parts = cmd.split(" ");
    let c = parts[0];
    let arg = parts[1];

    switch (c) {

      case "help": help(); break;
      case "ls": ls(); break;
      case "pwd": pwd(); break;
      case "mkdir": mkdir(arg); break;
      case "touch": touch(arg); break;
      case "rm": rm(arg); break;
      case "users": usersList(); break;
      case "adduser": addUser(arg); break;
      case "deluser": delUser(arg); break;

      case "clear":
        term.innerHTML = "";
        term.appendChild(line);
        break;

      default:
        await AI(cmd);
    }

    input.value = "";
    term.scrollTop = term.scrollHeight;
  }
});
