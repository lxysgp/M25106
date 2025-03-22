const classmates = [
  "Bhat Shreyas",
  "Chan Zhi Bin",
  "Cheah Wei Heng",
  "Darsh Singhal",
  "Dong Linteng",
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

function updateList(filter = "") {
  listElement.innerHTML = "";
  const filtered = classmates.filter(name =>
    name.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    listElement.innerHTML = "<li>No matches found.</li>";
    return;
  }

  filtered.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;
    listElement.appendChild(li);
  });
}

searchInput.addEventListener("input", () => {
  updateList(searchInput.value);
});

// Initial display
updateList();
