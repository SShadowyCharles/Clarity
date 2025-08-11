const allNavs = document.querySelectorAll(".nav-list-anchor");
const allContentSidebars = document.querySelectorAll(".content-sidebar");
const allContentSize = document.querySelectorAll(".contentSize");
const notesFolderList = document.getElementById("notesFolderList");
const contentHeader = document.querySelector(".header-title");
const notesBody = document.getElementById("notesBody");
const addNoteIcon = document.getElementById("addNoteIcon");
const backButton = document.getElementById("backButton");
let uniqueFolders = [];
let uniqueTags = [];

function getPastelColor() {
  const hue = Math.floor(Math.random() * 360);
  const pastel = `hsl(${hue}, 70%, 85%)`;
  return pastel;
}

function getTagColor() {
  const contrastingColors = [
    "#2D3747", // Dark slate blue
    "#1A1A2E", // Deep navy
    "#4A2545", // Dark purple
    "#16262E", // Dark teal
    "#333333", // Charcoal gray
    "#D64045", // Deep red
    "#5C6BC0", // Rich indigo
    "#FF6B6B", // Coral red
    "#6A4C93", // Deep lavender
    "#2A9D8F", // Dark teal green
    "#8B5A2B", // Dark tan
    "#6B4226", // Coffee brown
    "#5E3023", // Deep rust
    "#4E3620", // Dark chocolate
    "#3D2B1F", // Almost black brown
    "#0A2463", // Deep sapphire
    "#3E6680", // Steel blue
    "#2E5266", // Slate blue
    "#1C3738", // Dark pine
    "#0B3C49", // Deep ocean
  ];
  return contrastingColors[
    Math.floor(Math.random() * contrastingColors.length)
  ];
}

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

function getData() {
  const getData = localStorage.getItem("data");
  if (getData) {
    return JSON.parse(getData);
  } else {
    return [];
  }
}

let data = getData();

function updateFoldersAndTags() {
  uniqueFolders = [...new Set(data.map((item) => item.folder))];
  uniqueTags = [...new Set(data.map((item) => item.tag))];
}

let currentNote = {
  folder: "default",
  title: "",
  tag: "",
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
  notesFolderList.innerHTML = "";
  contentHeader.textContent = "My Notes";
  updateFoldersAndTags();
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
        <ul class="notes-item-list hidden" id="${item}Lessons">
          ${data
            .filter((note) => note.folder === item)
            .map((note) => {
              if (note.folder === item) {
                return `
                <li class="notes-item">
                  <div class="circle"></div>
                  <p class="lesson">${note.title}</p>
                </li>
              `;
              }
            })
            .join("")}
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
        backButton.classList.add("hidden");
        contentHeader.textContent = item.querySelector("h4").textContent;
        allFolders.forEach((folder) => {
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
          const folderName = item.querySelector("h4").textContent;
          const noteObj = data.find(
            (note) =>
              note.title === lesson.textContent && note.folder === folderName
          );
          lessonBox.innerHTML = `
            <h3>${lesson.textContent}</h3>
            <div class="lesson-box-tag">${noteObj.tag}</div>
          `;
          const lessonBoxTag = lessonBox.querySelector(".lesson-box-tag");
          lessonBoxTag.style.backgroundColor = getTagColor();
          lessonBox.style.backgroundColor = getPastelColor();
          lessonBox.addEventListener("click", () => {
            backButton.classList.remove("hidden");
            backButton.addEventListener("click", () => {
              notesSidebarReset();
              const noteElement = e.target.closest(".open-note");
              if (noteElement) {
                const breadcrumb = noteElement.querySelector(".breadcrumb");
                const folderName = breadcrumb.textContent.split("/")[0];
              }
              backButton.classList.add("hidden");
            });

            allCircles.forEach((circle) => {
              circle.classList.remove("active");
            });
            allLessons.forEach((lesson) => {
              lesson.classList.remove("active");
            });
            const lessonText = lesson.textContent;
            allLessonItems.forEach((notesItem) => {
              const lessonElem = notesItem.querySelector(".lesson");
              if (lessonElem && lessonElem.textContent === lessonText) {
                notesItem.querySelector(".circle").classList.add("active");
                lessonElem.classList.add("active");
              }
            });

            contentHeader.textContent = noteObj.folder;
            notesBody.innerHTML = `
              <article class="open-note">
                <p class="breadcrumb">${noteObj.folder}/${noteObj.title}</p>
                <section class="open-note-header">
                  <h3>${noteObj.title}</h3>
                  <article class="misc">
                    <section class="lesson-tag">${noteObj.tag}</section>
                    <section class="edit-note-button">
                      <img src="Images/edit.svg" alt="Edit Note" class="misc-icons edit-button" />
                    </section>
                    <section class="delete-note">
                      <img src="Images/trash.svg" alt="Delete Note" class="misc-icons delete-button" />
                    </section>
                  </article>
                </section>
                <section class="open-note-body">
                  <p>${noteObj.content}</p>
                </section>
                <section class="open-note-footer">
                <p>${noteObj.date}</p>
                <p>${noteObj.time}</p>
                </section>
              </article>
            `;
            const lessonTag = notesBody.querySelector(".lesson-tag");
            lessonTag.style.backgroundColor = getTagColor();
          });
          lessonBody.appendChild(lessonBox);
        });
        item.classList.add("active-folder");
      });
    });
  }
}

function notesSidebarReset() {
  notesFolderList.innerHTML = "";
  notesBody.innerHTML = "";
  currentNote = {
    folder: "default",
    title: "",
    tag: "",
    content: "",
    date: "",
    time: "",
  };
  data = getData();
  updateNotesSidebar();
  contentHeader.textContent = "My Notes";
  backButton.classList.add("hidden");
}

function showDialog(title, message) {
  const dialogbox = document.createElement("dialog");
  dialogbox.classList.add("dialog");
  dialogbox.innerHTML = `
    <form method="dialogbox" class="note-form">
      <h3>${title}</h3>
      <p>${message}</p>
      <section class="buttons">
        <button type="submit">OK</button>
      </section>
    </form>
  `;
  document.body.appendChild(dialogbox);
  dialogbox.showModal();
  dialogbox.addEventListener("submit", () => {
    dialogbox.close();
    dialogbox.remove();
  });
}

function showConfirmDialog(title, message, onsub) {
  const dialogbox = document.createElement("dialog");
  dialogbox.classList.add("dialog");
  dialogbox.innerHTML = `
    <form class="note-form">
      <h3>${title}</h3>
      <p>${message}</p>
      <section class="buttons">
        <button type="submit">Yes</button>
        <button id="cancelDialogButton">No</button>
      </section>
    </form>
  `;
  document.body.appendChild(dialogbox);
  dialogbox.showModal();

  const cancelButton = dialogbox.querySelector("#cancelDialogButton");
  cancelButton.addEventListener("click", () => {
    dialogbox.close();
    dialogbox.remove();
  });

  const form = dialogbox.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    onsub();
    dialogbox.close();
    dialogbox.remove();
  });
}

function createAddDialog(title, inputPlaceholder, onsub) {
  const dialogbox = document.createElement("dialog");
  dialogbox.classList.add("dialog");
  dialogbox.innerHTML = `
    <form class="note-form">
      <h3>${title}</h3>
      <input type="text" id="dialogInput" placeholder="${inputPlaceholder}" required />
      <section class="buttons">
        <button type="submit">Yes</button>
        <button id="cancelDialogButton">No</button>
      </section>
    </form>
  `;
  document.body.appendChild(dialogbox);
  dialogbox.showModal();

  const cancelButton = dialogbox.querySelector("#cancelDialogButton");
  cancelButton.addEventListener("click", () => {
    dialogbox.close();
    dialogbox.remove();
  });

  const form = dialogbox.querySelector("form");
  const input = dialogbox.querySelector("#dialogInput");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (value) {
      onsub(value);
    }
    dialogbox.close();
    dialogbox.remove();
  });
}

addNoteIcon.addEventListener("click", () => {
  notesBody.innerHTML = "";
  contentHeader.textContent = "New Note";
  const addNote = document.createElement("article");
  updateFoldersAndTags();
  addNote.classList.add("add-note");
  addNote.innerHTML = `
    <form action="" method="post" class="note-form" id="addNoteForm">
      <p class="breadcrumb">Notes/myNotes</p>
      <div class="note-header">
        <section>
          <label for="noteTitle" class="note-label">Title:</label>
          <input
            type="text"
            id="noteTitle"
            class="note-title"
            placeholder="Enter note title"
          />
        </section>
        <section>
          <select name="Folder" id="folderSelect" class="note-folder">
            <option value="" disabled selected>Select Folder</option>
            ${uniqueFolders
              .map((item) => {
                return `
                <option value="${item}">${item}</option>
              `;
              })
              .join("")}
            <option value="add">Add new Folder</option>
          </select>
          <button class="form-button" id="saveNote">Save</button>
          <button class="form-button" id="cancelNote">Cancel</button>
        </section>
        <section>
          <select name="tag" id="tagSelect" class="note-tag">
            <option value="" disabled selected>Select Tag</option>
            ${uniqueTags
              .map((item) => {
                return `
                  <option value="${item}">${item}</option>
                `;
              })
              .join("")}
            <option value="add" id="addTag">Add new Tag</option>
          </select>
        </section>
      </div>
      <div class="note-body">
        <textarea name="addNoteContent" id="addNoteContent" class="note-textarea" placeholder="Add notes here"></textarea>
      </div>
      <div class="note-footer">
        <p>${new Date().toDateString()}</p>
      </div>
    </form>
  `;
  const folderSelect = addNote.querySelector("#folderSelect");

  folderSelect.addEventListener("change", (e) => {
    e.preventDefault();
    createAddDialog("Add new Folder", "Input new folder name here", (value) => {
      uniqueFolders.push(value);
      folderSelect.innerHTML = `
          <option value="" disabled selected>Select Folder</option>
          ${uniqueFolders
            .map((item) => {
              return `
              <option value="${item}">${item}</option>
            `;
            })
            .join("")}
          <option value="add">Add new Folder</option>
          `;
      folderSelect.value = value;
    });
  });

  const tagSelect = addNote.querySelector("#tagSelect");

  tagSelect.addEventListener("change", (e) => {
    createAddDialog("Add new Tag", "Enter tag name", (value) => {
      e.preventDefault();

      uniqueTags.push(value);
      tagSelect.innerHTML = `
        <option value="" disabled selected>Select Tag</option>
        ${uniqueTags
          .map((item) => {
            return `
            <option value="${item}">${item}</option>
          `;
          })
          .join("")}
        <option value="add">Add new Tag</option>
        `;
      tagSelect.value = value;
    });
  });

  const saveNoteButton = addNote.querySelector("#saveNote");
  const cancelNoteButton = addNote.querySelector("#cancelNote");

  saveNoteButton.addEventListener("click", (e) => {
    e.preventDefault();
    const titleInput = addNote.querySelector("#noteTitle").value.trim();
    const folderSelect = addNote.querySelector("#folderSelect").value.trim();
    const tagSelect = addNote.querySelector("#tagSelect").value.trim();
    const contentTextarea = addNote
      .querySelector("#addNoteContent")
      .value.trim();
    const date = new Date();
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (
      data.some(
        (item) => item.title === titleInput && item.folder === folderSelect
      )
    ) {
      showDialog(
        "Note Already Exists",
        `A note with the title "${titleInput}" already exists in the folder "${folderSelect}".`
      );
      return;
    } else if (
      titleInput === "" ||
      folderSelect === "" ||
      tagSelect === "" ||
      contentTextarea === ""
    ) {
      showDialog(
        "Empty Fields",
        "Please fill in all fields before saving the note."
      );
    } else {
      currentNote = {
        folder: folderSelect,
        title: titleInput,
        tag: tagSelect,
        content: contentTextarea,
        date: date.toDateString(),
        time: time,
      };
      data.push(currentNote);
      localStorage.setItem("data", JSON.stringify(data));
      notesSidebarReset();
    }
  });

  cancelNoteButton.addEventListener("click", (e) => {
    e.preventDefault();
    showConfirmDialog(
      "Cancel Note Creation",
      "Are you sure you want to cancel creating this note? All unsaved changes will be lost.",
      notesSidebarReset
    );
  });
  notesBody.appendChild(addNote);
});

notesBody.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-button")) {
    e.stopPropagation();
    const noteElement = e.target.closest(".open-note");
    const title = noteElement.querySelector("h3").textContent;
    const breadcrumb = noteElement.querySelector(".breadcrumb").textContent;
    const folder = breadcrumb.split("/")[0];
    showConfirmDialog(
      "Delete Note?",
      "Are you sure you want to delete this note?",
      () => {
        const note = data.find(
          (item) => item.title === title && item.folder === folder
        );
        if (note) {
          const noteIndex = data.indexOf(note);
          data.splice(noteIndex, 1);
          localStorage.setItem("data", JSON.stringify(data));
          notesSidebarReset();
        }
      }
    );
  }
  if (e.target.classList.contains("edit-button")) {
    e.stopPropagation();
    const noteElement = e.target.closest(".open-note");
    const title = noteElement.querySelector("h3").textContent;
    const tag = noteElement.querySelector(".lesson-tag").textContent;
    const content = noteElement.querySelector(".open-note-body p").textContent;
    const breadcrumb = noteElement.querySelector(".breadcrumb").textContent;
    const folder = breadcrumb.split("/")[0];

    notesBody.innerHTML = `
      <article class="add-note">
        <form action="" method="post" class="note-form" id="editNoteForm">
          <p class="breadcrumb">${breadcrumb}</p>
          <div class="note-header">
            <section>
              <label for="editNoteTitle" class="note-label">Title:</label>
              <input
                type="text"
                id="editNoteTitle"
                class="note-title"
                value="${title}"
              />
            </section>
            <section>
              <select name="Folder" id="editFolderSelect" class="note-folder">
                <option value="" disabled>Select Folder</option>
                ${[...new Set(data.map((item) => item.folder))]
                  .map(
                    (item) => `
                  <option value="${item}" ${
                      item === folder ? "selected" : ""
                    }>${item}</option>
                `
                  )
                  .join("")}
                <option value="add">Add new Folder</option>
              </select>
              <button class="form-button" id="saveEditedNote">Save</button>
              <button class="form-button" id="cancelEditedNote">Cancel</button>
            </section>
            <section>
              <select name="tag" id="editTagSelect" class="note-tag">
                <option value="" disabled>Select Tag</option>
                ${[...new Set(data.map((item) => item.tag))]
                  .map(
                    (item) => `
                  <option value="${item}" ${
                      item === tag ? "selected" : ""
                    }>${item}</option>
                `
                  )
                  .join("")}
                <option value="add">Add new Tag</option>
              </select>
            </section>
          </div>
          <div class="note-body">
            <textarea name="editNoteContent" id="editNoteContent" class="note-textarea" placeholder="Edit notes here">${content}</textarea>
          </div>
          <div class="note-footer">
            <p>${new Date().toDateString()}</p>
            <p>${new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}</p> 
          </div>
        </form>
      </article>
    `;

    const folderSelect = notesBody.querySelector("#editFolderSelect");
    folderSelect.addEventListener("change", (ev) => {
      if (ev.target.value === "add") {
        folderSelect.addEventListener("change", (ev) => {
          ev.preventDefault();
          createAddDialog(
            "Add new Folder",
            "Input new folder name here",
            (value) => {
              uniqueFolders.push(value);
              folderSelect.innerHTML = `
              <option value="" disabled selected>Select Folder</option>
              ${uniqueFolders
                .map((item) => {
                  return `
                  <option value="${item}">${item}</option>
                `;
                })
                .join("")}
              <option value="add">Add new Folder</option>
              `;
              folderSelect.value = value;
            }
          );
        });
      }
    });

    const tagSelect = notesBody.querySelector("#editTagSelect");
    tagSelect.addEventListener("change", (ev) => {
      createAddDialog("Add new Tag", "Enter tag name", (value) => {
        ev.preventDefault();

        uniqueTags.push(value);
        tagSelect.innerHTML = `
        <option value="" disabled selected>Select Tag</option>
        ${uniqueTags
          .map((item) => {
            return `
            <option value="${item}">${item}</option>
          `;
          })
          .join("")}
        <option value="add">Add new Tag</option>
        `;
        tagSelect.value = value;
      });
    });

    notesBody
      .querySelector("#saveEditedNote")
      .addEventListener("click", function (ev) {
        ev.preventDefault();
        const newTitle = notesBody.querySelector("#editNoteTitle").value.trim();
        const newFolder = notesBody
          .querySelector("#editFolderSelect")
          .value.trim();
        const newTag = notesBody.querySelector("#editTagSelect").value.trim();
        const newContent = notesBody
          .querySelector("#editNoteContent")
          .value.trim();
        const date = new Date().toDateString();
        const time = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        if (!newTitle || !newFolder || !newTag || !newContent) {
          showDialog(
            "Empty Fields",
            "Please fill in all fields before saving the note."
          );
          return;
        }

        const idx = data.findIndex(
          (item) => item.title === title && item.folder === folder
        );
        if (idx !== -1) {
          data[idx] = {
            folder: newFolder,
            title: newTitle,
            tag: newTag,
            content: newContent,
            date,
            time,
          };
          localStorage.setItem("data", JSON.stringify(data));
          notesSidebarReset();
        }
      });

    notesBody
      .querySelector("#cancelEditedNote")
      .addEventListener("click", function (ev) {
        ev.preventDefault();
        showConfirmDialog(
          "Cancel Edit?",
          "Are you sure you want to cancel editing this note?",
          notesSidebarReset
        );
      });
  }
});
