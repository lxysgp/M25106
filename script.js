// Class list with register numbers
const classmates = [
	"Bhat Shreyas",
	"Chan Zhi Bin",
	"Cheah Wei Heng",
	"Darsh Singhal",
	"Dong LinTeng",
	"Eyan Naim Koh Bin Dhahrulsalam",
	"Fan Jiarui",
	"Guan Xuhui",
	"Huang Zihan",
	"Jared Chee Zhan Jit",
	"Jonathan Hoi Mun Hong",
	"Li Jiahe",
	"Li Xinyuan",
	"Lim Yueyi Jacob",
	"Limsirirangan Chatdanai",
	"Ma Mingtai Tyler",
	"Ma Wenqiang",
	"Mao Yusu",
	"Mukherjee Annika",
	"Natalie Chay Yun Xi",
	"Ng Zheng Xian",
	"Pinkaew Yanapak",
	"Shiv Gandotra",
	"Petchprima Srethapiyanont",
	"Tan Jia Xuan",
	"Wang Haoyu",
	"Wang Qian",
	"Wei Ziheng",
	"Wong Kai Jun, Caden",
	"Zhao Zetai, Derek"
];

const listElement = document.getElementById("class-list");
const searchInput = document.getElementById("search");

// Adds number filtering and name filtering
function updateList(filter = "") {
	listElement.innerHTML = "";
	
	const filtered = classmates
	.map((name, index) => ({ number: index + 1, name }))
	.filter(student => {
		const query = filter.toLowerCase();
		return (
			student.name.toLowerCase().includes(query) ||
			student.number.toString().startsWith(query)
		);
	});
	
	if (filtered.length === 0) {
		listElement.innerHTML = "<li>No matches found.</li>";
		return;
	}
	
	filtered.forEach(student => {
		const li = document.createElement("li");
		li.textContent = `${student.number}. ${student.name}`;
		listElement.appendChild(li);
	});
}

searchInput.addEventListener("input", () => {
	updateList(searchInput.value);
});

updateList(); // initial load

function attendance() {
	if (listElement.style.fontSize=="1rem") {
		document.getElementById("attend").textContent="Stop taking attendance";
		listElement.style.fontSize="2rem"
	} else {
		document.getElementById("attend").textContent="Take Attendance";
		listElement.style.fontSize="1rem"
	}
}