const allNavs = document.querySelectorAll(".nav-list-anchor");
const allContentSidebars = document.querySelectorAll(".content-sidebar");
const allContentSize = document.querySelectorAll(".contentSize");
const notesFolderList = document.getElementById("notesFolderList");
const contentHeader = document.querySelector(".header-title");
const notesBody = document.getElementById("notesBody");

const navIds = [
  {
    id: "homeNav",
    sidebar: "default",
    title: "Home",
    body: "default",
  },
  {
    id: "calendarNav",
    sidebar: "default",
    title: "Calendar",
    body: "default",
  },
  {
    id: "notesNav",
    sidebar: "notesSidebar",
    title: "Notes",
    body: "notesBody",
  },
];

function changeActiveNav() {
  notesSidebarReset();
  allNavs.forEach((nav) => {
    nav.classList.remove("active-nav");
  });
  allContentSidebars.forEach((contentSidebar) => {
    contentSidebar.classList.add("hidden");
  });
  allContentSize.forEach((contentSize) => {
    contentSize.innerHTML = ""; 
  })
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
  const currentContent = navIds.find((nav) => nav.id === currentNavId).body;
  if (currentContent === "default") {
    return;
  }
  const contentSection = document.getElementById(currentContent);
  contentSection.classList.remove("hidden");
}

allNavs.forEach((nav) => {
  nav.addEventListener("click", changeActiveNav);
});

/* Data Getting and Submission */

function getData () {
  const getData = localStorage.getItem("data");
  if (getData) {
    return JSON.parse(getData);
  } else {
    return [{ folder: "default", topicTitle: "Test", title: "", content: "", date: "", time: "" }, {folder: "default2", topicTitle: "Test2", title: "", content: "", date: "", time: "" }, ];
  }
};

let data = getData();

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
function updateNotesSidebar() {
  notesFolderList.innerHTML= "";
  const uniqueFolders = [...new Set(data.map(item => item.folder))];
  if (Array.isArray(data) && data.length > 0) {
    uniqueFolders.forEach((item) => {
      const li = document.createElement("li");
      li.classList.add("notes-folder");
      li.innerHTML = `
        <section class="folder-wrapper">
          <figure>
            <img 
              src="Images/Folder 3 enhance.svg"
              alt="folder icon"
              class="notes-folder-icon"
            />
          </figure>
          <h4>${item}</h4>
        </section>
        <ul class="notes-item-list hidden">
          ${data.filter((note) => note.folder === item).map((note) => {
            if (note.folder === item) {
              return `
                <li class="notes-item">
                  <div class="circle"></div>
                  <p class="lesson">${note.topicTitle}</p>
                </li>
              `
            }
          }).join("")}
        </ul>
      `;

      notesFolderList.appendChild(li);
    });

    const allFolders = document.querySelectorAll(".folder-wrapper");
    const allLessonItems = document.querySelectorAll(".notes-item");
    const allCircles = document.querySelectorAll(".circle");
    const allLessons = document.querySelectorAll(".lesson");
    const allNotesItemLists = document.querySelectorAll(".notes-item-list");

    allFolders.forEach((item) => {
      item.addEventListener("click", () => {
        allFolders.forEach((folder) =>  {
          folder.classList.remove("active-folder");
        });
        allNotesItemLists.forEach((list) => {
          list.classList.add("hidden");
        });
        allCircles.forEach((circle) => {
          circle.classList.remove("active");
        });
        allLessons.forEach((lesson) => {
          lesson.classList.remove("active");
        });
        const notesItemList = item.nextElementSibling;
        notesItemList.classList.remove("hidden");

        notesBody.innerHTML = "";
        const lessonBody = document.createElement("div");
        lessonBody.classList.add("lessons-container");
        notesBody.appendChild(lessonBody);
        const lessonTitles = notesItemList.querySelectorAll(".lesson");
        lessonTitles.forEach((lesson) => {
          const lessonBox = document.createElement("div");
          lessonBox.classList.add("lesson-box");
          lessonBox.innerHTML = `
            <h3>${lesson.textContent}</h3>
          `
          lessonBody.appendChild(lessonBox);
        })
        item.classList.add("active-folder");
      })
    })

    allLessonItems.forEach((item) => {
      item.addEventListener("click", () => {
        allCircles.forEach((circle) => {
          circle.classList.remove("active");
        });
        allLessons.forEach((lesson) => {
          lesson.classList.remove("active");
        });
        item.querySelector(".circle").classList.add("active");
        item.querySelector(".lesson").classList.add("active");  
      })
    })
  }
}

function notesSidebarReset(){
  notesFolderList.innerHTML = "";
  notesBody.innerHTML = "";
  currentNote = {
    folder: "default",
    topicTitle: "",
    title: "",
    content: "",
    date: "",
    time: "",
  };
  data = getData();
  updateNotesSidebar();
}