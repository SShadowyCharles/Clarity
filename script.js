const allNavs = document.querySelectorAll(".nav-list-anchor");
const allContentSidebars = document.querySelectorAll(".content-sidebar");
const notesFolderList = document.getElementById("notesFolderList");
const notesSidebarContent = document.getElementById("notesSidebarContent");
const contentHeader = document.querySelector(".header-title");

const navIds = [
  {
    id: "homeNav",
    sidebar: "default",
    title: "Home",
  },
  {
    id: "calendarNav",
    sidebar: "default",
    title: "Calendar",
  },
  {
    id: "notesNav",
    sidebar: "notesSidebar",
    title: "Notes",
  },
];

function changeActiveNav() {
  allNavs.forEach((nav) => {
    nav.classList.remove("active-nav");
  });
  allContentSidebars.forEach((contentSidebar) => {
    contentSidebar.classList.add("hidden");
  });
  this.classList.add("active-nav");
  const currentNavId = this.id;
  const currentSidebar = navIds.find((nav) => nav.id === currentNavId).sidebar;
  contentHeader.textContent = navIds.find(
    (nav) => nav.id === currentNavId
  ).title;
  if (currentSidebar === "default") {
    return;
  }
  const sidebar = document.getElementById(currentSidebar);
  sidebar.classList.remove("hidden");
}

allNavs.forEach((nav) => {
  nav.addEventListener("click", changeActiveNav);
});

/* Data Getting and Submission */

let data = () => {
  const getData = localStorage.getItem("data");
  if (getData) {
    return JSON.parse(getData);
  } else {
    return [];
  }
};

let currentNote = {
  folder: "default",
  topicTitle: "",
  title: "",
  content: "",
  date: "",
  time: "",
};

function submitData() {
  const input = document.getElementById("title");
  const object = {
    title: input.value,
  };
  if (data.findIndex((item) => item.title === object.title) === -1) {
    data.push(object);
    localStorage.setItem("data", JSON.stringify(data));
  }
}

/* Notes Sidebar Functionality */

if (Array.isArray(data) && data.length > 0){
  data.forEach((item) => {
    const notesFolder = item.folder;
    const li = document.createElement("li");
    li.classList.add("notes-folder");
    li.innerHTML = `
      <div class="folder-wrapper">
        <figure>
          <img 
            src="Images/Folder 3 enhance.svg"
            alt="folder icon"
            class="notes-folder-icon"
          />
        </figure>
        <h4>${item.topicTitle}</h4>
      </div>
      <ul class="notes-item-list">
        ${data.forEach((note) => {
          if (note.folder === notesFolder){
            return `
              <li class="notes-item">
                <div class="circle"></div>
                <p>${note.title}</p>
              </li>
            `
          }
        })}
      </ul>
    `

    notesFolderList.appendChild(li);
  })
}