const validUsers = {
  "xinyuan": {
    password: "64816bdebdb511a519643ab992970c5fff322a38f9b5d2f46cda63ddc172295ba65c64a69d30ac4ad68f94157c919daadd0e89a5ed2000ff4a3b67586c493f91E",
    role: "student"
  },
  "admin": {
    password: "a920672eff860985bb68a99d004c37fb0c261bb60c20470f4ba5c2fa6a304c884c0d45c158155619cf508618b73d1f57b2084fad0f280208cdb48a469ac84ff1",
    role: "teacher"
  },
  "nzx.21106": {
    password: "ca96d2566c090886ea6950377f7e85bbb1d45c66a958d66ef31080fbd43280664ddf4facfa05d16416dcc8eff2e7f1564988cce6cab72a4b1f69c7321ae8e385",
    role: "teacher"
  },
  "bh10601": {
    password: "",
    role: "student"
  },
  "darsh": {
    password: "",
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
    password: "",
    role: "student"
},
"Chatdanai" : {
    password: "05877d44a007953059cd1cc639266eb1c5b3a01d5ca8ccb9e2097c71ec054e79e38042cabd3ffe9405864a2b5f31b79ebc8d4f0870bf1e48e497044fc3250812",
    role: "student"
},
"" : {
    password: "",
    role: "student"
},
"" : {
    password: "",
    role: "student"
}

};

let currentUserRole = null;
let loggedInUsername = "";

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const notfullyhashedPassword = await hashSHA512(password);
  const notyethashedPassword = atob(notfullyhashedPassword);
  const notHashedPassword = await hashSHA512(notyethashedPassword);
  const almosthashedPassword = atob(notHashedPassword);
  const hashedPassword = await hashSHA512(almosthashedPassword);
	

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
