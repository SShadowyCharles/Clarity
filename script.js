const allNavs = document.querySelectorAll(".nav-list-anchor");
const allContentSidebars = document.querySelectorAll(".content-sidebar");
const notesSidebar = document.getElementById("notesSidebar");
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

let data = () => {
  const getData = localStorage.getItem("data");
  if (getData) {
    return JSON.parse(getData);
  } else {
    data = [];
  }
};

currentNote = {};

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
