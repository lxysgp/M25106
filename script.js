#template
// Example classmates list
const classmates = ["Xinyuan", "linteng", "caden", "yusu", "zhengxian"];
const listElement = document.getElementById("class-list");
classmates.forEach(name => {
  const li = document.createElement("li");
  li.textContent = name;
  listElement.appendChild(li);
});