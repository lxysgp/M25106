const validUsers = {
	"xinyuan": {
		password: "",
		role: "student",
		dev: true
	},
	"admin": {
		password: "fa4f924b2042699bdaff488c9cd2155e172c4242fee1f1f84766231e7f75df60c2205e20580a0cdebeacce168ef92beca8529b06607e544cd23f324e4023152e",
		role: "teacher",
		dev: true
	},
	"nzx.21106": {
		password: "0e4871d83cc281edc94ad00b203268e4adccc7dc2b8da7e717051ef86c13aae7bbff78e1732e02a6654080085315f0aa8b4975f1e4511b542ae5a211078b797e",
		role: "teacher",
		dev: true
	},
	"Bhatshreyas10601": {
		password: "0315d36e475c42b1b866c93ad3677601bba8098eae46414ecf5108f6655bbfded232c73984e6bd40656ccd92d3caee3e68ec36deed4e700ed2b2da1ca003ea23",
		role: "student",
		dev: true
	},
	"darsh": {
		password: "",
		role: "student",
		dev: true
	},
	"johnny": {
		password: "",
		role: "student",
		dev: true
	},
	"haoyu": {
		password: "",
		role: "student",
		dev: true
	},
	"jiahe" : {
		password: "",
		role: "student",
		dev: true
	},
	"Chatdanai" : {
		password: "88ebc74ad673de65fe5a23e4506b02d49e4fd90c0b32656ee5ae5e16275e1995e16aa21658d7236cd9572db820d27c9b49e4036eb73f5a871a8d7c0072cfa44f",
		role: "student",
		dev: true
	},
	"nutella" : {
		password: "d9e6762dd1c8eaf6d61b3c6192fc408d4d6d5f1176d0c29169bc24e71c3f274ad27fcd5811b313d681f7e55ec02d73d499c95455b6b5bb503acf574fba8ffe85",
		role:"teacher",
		dev: true
	},
	"test9" : {
		password: "0b3d1be846a4812b7043157e6e95d720341bff4dc1e437dd26ba96cec8735c9c74ebcf770cb0fe45dd3e4d04cd59b026240d540db03abf10b1f6e2f4dafcadce",
		role:"student",
		dev: true
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
