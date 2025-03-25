// Obfuscated login system with logout and role-based access
const validUsers = {
	"xinyuan": { password: "MTIzNA==", role: "student" },
	"admin": { password: "c2tpYmlkaQ==", role: "teacher" },
	"nzx.21106": {password: "Ym9va0AxMjEw", role: "teacher" },
	"bh10601" : { password: "Y2xhc3Njb20yNTEwNg==", role: "student" },
	"darsh" : {password: "ZGFyc2gxMDY=", role: "student" },
	"johnny" : {password: "MTAyNDIwMTI=", role: "student" },
	"haoyu" : {password: "SHkhMjUxMDE0NQ==", role: "student" }
};

let currentUserRole = null;

let currentUserRole = null;
let loggedInUsername = ""; // 🔒 Make username globally available

function login() {
	const name = document.getElementById("username").value.toLowerCase();
	const pass = document.getElementById("password").value;
	const user = validUsers[name];

	if (user && atob(user.password) === pass) {
		// ✅ Store in global + localStorage
		loggedInUsername = name;
		currentUserRole = user.role;

		localStorage.setItem("loggedInUser", name);           // for main login tracking
		localStorage.setItem("classwebUsername", name);       // ✅ for chill.html or other pages
		localStorage.setItem("userRole", user.role);

		document.getElementById("login-screen").style.display = "none";
		document.getElementById("main-content").style.display = "block";
		applyRoleVisibility();
		renderLeaderboard?.(); // Optional: refresh leaderboard if on main page
	} else {
		document.getElementById("login-msg").textContent = "Incorrect login.";
	}
}

function logout() {
	localStorage.removeItem("loggedInUser");
	localStorage.removeItem("classwebUsername"); // ✅ remove for cross-page
	localStorage.removeItem("userRole");

	loggedInUsername = "";
	currentUserRole = null;

	document.getElementById("main-content").style.display = "none";
	document.getElementById("login-screen").style.display = "block";
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

window.onload = function () {
	if (localStorage.getItem("loggedInUser")) {
		document.getElementById("login-screen").style.display = "none";
		document.getElementById("main-content").style.display = "block";
		applyRoleVisibility();
	}
};


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
