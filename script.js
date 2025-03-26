const validUsers = {
  "xinyuan": {
    password: "",
    role: "student"
  },
  "admin": {
    password: "c617e9cc46b067cde468e61cfeb4b7118525d13ac2d5476ee79caae896e023137aa9b3ec56ba8a8676ded589ae8e7f38fecdcaecb75be9bcf5ad0d4295ecc7e0",
    role: "teacher"
  },
  "nzx.21106": {
    password: "",
    role: "teacher"
  },
  "bh10601": {
    password: "",
    role: "student"
  },
  "darsh": {
    password: "a163b7d63a68c53616ad2254c71d2a42090b2191675149f0efd06bd7e85cabe2f0b0c78e5d4c826cff06e062d8bf8e8b750435881acf7647817b93885d602dea",
    role: "student"
  },
  "johnny": {
    password: "",
    role: "student"
  },
  "haoyu": {
    password: "",
    role: "student"
  },
"jiahe" : {
    password: "5c0cb0b48926e2f1605ace6d30afb3a0cada6c7129a8a332b73a6b6849e2944affd599373f62868d466834b1bf804c0bd69e21531af7c3691bc167573b8d6910",
    role: "student"
}
};

let currentUserRole = null;
let loggedInUsername = "";

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const hashedPassword = await hashSHA512(password);

  const user = validUsers[username];
  if (user && user.password === hashedPassword) {
    currentUserRole = user.role;
    loggedInUsername = username;
    localStorage.setItem("loggedInUser", username);
    localStorage.setItem("userRole", currentUserRole);
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("main-content").style.display = "block";
    applyRoleVisibility();
  } else {
    document.getElementById("login-msg").textContent = "❌ Incorrect username or password.";
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("userRole");
  currentUserRole = null;
  loggedInUsername = "";
  document.getElementById("main-content").style.display = "none";
  document.getElementById("login-screen").style.display = "block";
}

function applyRoleVisibility() {
  const clearBtn = document.getElementById("clear-btn");
  const attendBtn = document.getElementById("attend");
  const doneBtn = document.getElementById("done-btn");

  if (clearBtn) clearBtn.style.display = currentUserRole === "teacher" ? "inline-block" : "none";
  if (attendBtn) attendBtn.style.display = currentUserRole === "teacher" ? "inline-block" : "none";
  if (doneBtn) doneBtn.style.display = currentUserRole === "teacher" ? "inline-block" : "none";
}

window.onload = function () {
  const savedUser = localStorage.getItem("loggedInUser");
  const savedRole = localStorage.getItem("userRole");
  if (savedUser && savedRole) {
    loggedInUsername = savedUser;
    currentUserRole = savedRole;
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("main-content").style.display = "block";
    applyRoleVisibility();
  }
};

async function hashSHA512(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-512", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function applyRoleVisibility() {
	currentUserRole = localStorage.getItem("userRole");
	
	const clearBtn = document.getElementById("clear-btn");
	const attendBtn = document.getElementById("attend");
	const doneBtn = document.getElementById("done-btn");
	
	if (clearBtn) {
		clearBtn.style.display = currentUserRole === "teacher" ? "inline-block" : "none";
	}
	
	if (attendBtn) {
		attendBtn.style.display = currentUserRole === "teacher" ? "inline-block" : "none";
	}
	
	if (doneBtn) {
		doneBtn.style.display = currentUserRole === "teacher" ? "inline-block" : "none";
	}
}



// --- Class attendance logic ---
const classmates = [
"Bhat Shreyas", "Chan Zhi Bin", "Cheah Wei Heng", "Darsh Singhal", "Dong LinTeng",
"Eyan Naim Koh Bin Dhahrulsalam", "Fan Jiarui", "Guan Xuhui", "Huang Zihan", "Jared Chee Zhan Jit",
"Jonathan Hoi Mun Hong", "Li Jiahe", "Li Xinyuan", "Lim Yueyi Jacob", "Limsirirangan Chatdanai",
"Ma Mingtai Tyler", "Ma Wenqiang", "Mao Yusu", "Mukherjee Annika", "Natalie Chay Yun Xi",
"Ng Zheng Xian", "Pinkaew Yanapak", "Shiv Gandotra", "Petchprima Srethapiyanont", "Tan Jia Xuan",
"Wang Haoyu", "Wang Qian", "Wei Ziheng", "Wong Kai Jun, Caden", "Zhao Zetai, Derek"
];

const listElement = document.getElementById("class-list");
const searchInput = document.getElementById("search");
const summary = document.getElementById("summary");
const historyDiv = document.getElementById("history");

const todayKey = new Date().toISOString().slice(0, 10);
let isTakingAttendance = false;

// Render student list (with/without checkboxes)
function updateList(filter = "") {
	listElement.innerHTML = "";
	const query = filter.toLowerCase();
	const todayData = JSON.parse(localStorage.getItem("attendance") || "{}");
	const filtered = classmates
	.map((name, index) => ({ number: index + 1, name }))
	.filter(student =>
	student.name.toLowerCase().includes(query) || student.number.toString().startsWith(query)
	);
	
	if (filtered.length === 0) {
		listElement.innerHTML = "<li>No matches found.</li>";
		return;
	}
	
	filtered.forEach(student => {
		const li = document.createElement("li");
		li.classList.add("student-entry");
		
		if (isTakingAttendance) {
			const checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.id = `student-${student.number}`;
			checkbox.value = student.number;
			checkbox.style.scale=2
			if (todayData[todayKey]?.includes(student.number)) {
				checkbox.checked = true;
			}
			li.appendChild(checkbox);
		}
		
		const label = document.createElement("span");
		label.textContent = ` ${student.number}. ${student.name}`;
		li.appendChild(label);
		listElement.appendChild(li);
	});
	
	listElement.className = isTakingAttendance ? "attendance-mode" : "";
}

// Toggle attendance mode
function toggleAttendance() {
	isTakingAttendance = !isTakingAttendance;
	document.getElementById("attend").textContent = isTakingAttendance
	? "Stop Attendance"
	: "Take Attendance";
	updateList(searchInput.value);
	listElement.style.fontSize = isTakingAttendance
	? "2rem"
	: "1rem";
	listElement.style.lineHeight = isTakingAttendance
	? "2"
	: "1";
}

// Save today's attendance
function finalizeAttendance() {
	const checkboxes = listElement.querySelectorAll("input[type=checkbox]");
	const present = [];
	checkboxes.forEach(cb => {
		if (cb.checked) present.push(parseInt(cb.value));
	});
	
	let allData = JSON.parse(localStorage.getItem("attendance") || "{}");
	allData[todayKey] = present;
	localStorage.setItem("attendance", JSON.stringify(allData));
	
	summary.textContent = `✔️ Attendance recorded: ${present.length}/${classmates.length}`;
	renderHistory();
}

// Show past history
function renderHistory() {
	const data = JSON.parse(localStorage.getItem("attendance") || "{}");
	historyDiv.innerHTML = "<h3>📅 Past Attendance</h3>";
	Object.keys(data).sort().reverse().forEach(date => {
		const count = data[date].length;
		const list = data[date]
		.sort((a, b) => a - b)
		.map(n => `${n}. ${classmates[n - 1]}`)
		.join("<br>");
		historyDiv.innerHTML += `
		<details>
			<summary>${date} - ${count}/${classmates.length} present</summary>
			<p>${list}</p>
		</details>
		`;
	});
}

// Clear all records
function clearHistory() {
	if (confirm("Are you sure you want to clear all attendance history?")) {
		localStorage.removeItem("attendance");
		renderHistory();
		updateList(searchInput.value);
		summary.textContent = "🗑️ Attendance history cleared.";
	}
}

// Events
searchInput.addEventListener("input", () => updateList(searchInput.value));

// Init
updateList();
renderHistory();
