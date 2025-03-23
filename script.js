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

const todayKey = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

// Display student list with checkboxes
function updateList(filter = "") {
	listElement.innerHTML = "";
	const filtered = classmates
		.map((name, index) => ({ number: index + 1, name }))
		.filter(student => {
			const query = filter.toLowerCase();
			return student.name.toLowerCase().includes(query) ||
				student.number.toString().startsWith(query);
		});

	if (filtered.length === 0) {
		listElement.innerHTML = "<li>No matches found.</li>";
		return;
	}

	const todayData = JSON.parse(localStorage.getItem("attendance") || "{}");

	filtered.forEach(student => {
		const li = document.createElement("li");
		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.id = `student-${student.number}`;
		checkbox.value = student.number;

		if (todayData[todayKey]?.includes(student.number)) {
			checkbox.checked = true;
		}

		li.appendChild(checkbox);
		li.appendChild(document.createTextNode(` ${student.number}. ${student.name}`));
		listElement.appendChild(li);
	});
}

// Save today's attendance
function finalizeAttendance() {
	const checkboxes = listElement.querySelectorAll("input[type=checkbox]");
	const present = [];

	checkboxes.forEach(cb => {
		if (cb.checked) present.push(parseInt(cb.value));
	});

	// Save to localStorage
	let allData = JSON.parse(localStorage.getItem("attendance") || "{}");
	allData[todayKey] = present;
	localStorage.setItem("attendance", JSON.stringify(allData));

	summary.textContent = `✔️ Attendance recorded: ${present.length}/${classmates.length}`;
	renderHistory();
}

// Show attendance history
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

// Live search
searchInput.addEventListener("input", () => updateList(searchInput.value));

// Initialize
updateList();
renderHistory();
