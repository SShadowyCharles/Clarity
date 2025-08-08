const allNavs = document.querySelectorAll(".nav-list-anchor");
const allContentSidebars = document.querySelectorAll(".content-sidebar");
const allContentSize = document.querySelectorAll(".contentSize");
const notesFolderList = document.getElementById("notesFolderList");
const contentHeader = document.querySelector(".header-title");
const notesBody = document.getElementById("notesBody");
const addNoteIcon = document.getElementById("addNoteIcon");
const backButton = document.getElementById("backButton");

function getPastelColor() {
  const hue = Math.floor(Math.random() * 360);
  const pastel = `hsl(${hue}, 70%, 85%)`;
  return pastel;
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
    return [];
  }
};

let data = getData();

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
  notesFolderList.innerHTML= "";
  contentHeader.textContent = "My Notes";
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
        <ul class="notes-item-list hidden" id="${item}Lessons">
          ${data.filter((note) => note.folder === item).map((note) => {
            if (note.folder === item) {
              return `
                <li class="notes-item">
                  <div class="circle"></div>
                  <p class="lesson">${note.title}</p>
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
          const folderName = item.querySelector("h4").textContent;
          const noteObj = data.find((note) => note.title === lesson.textContent && note.folder === folderName);
          lessonBox.innerHTML = `
            <h3>${lesson.textContent}</h3>
            <div class="lesson-box-tag">${noteObj.tag}</div>
          ` 
          lessonBox.style.backgroundColor = getPastelColor();
          lessonBox.addEventListener("click", () => {
            backButton.classList.remove("hidden");
            backButton.addEventListener("click", () => {
              notesSidebarReset();
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
                    <section class="note-tag">${noteObj.tag}</section>
                    <section class="edit-note">edit</section>
                    <section class="delete-note">delete</section>
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
          })
          lessonBody.appendChild(lessonBox);
        })
        item.classList.add("active-folder");
      })
    });
  }
}

function notesSidebarReset(){
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
}

addNoteIcon.addEventListener("click", () =>{
  notesBody.innerHTML = "";
  contentHeader.textContent = "New Note";
  const addNote = document.createElement("article");
  const uniqueFolders = [...new Set(data.map(item => item.folder))];
  const uniqueTags = [...new Set(data.map(item => item.tag))];
  addNote.classList.add("add-note");
  addNote.innerHTML = 
  `
    <form action="" method="post" class="add-note-form" id="addNoteForm">
      <p class="breadcrumb">Notes/myNotes</p>
      <div class="note-header">
        <section>
          <label for="noteTitle" class="add-note-label">Title:</label>
          <input
            type="text"
            id="noteTitle"
            class="add-note-title"
            placeholder="Enter note title"
          />
        </section>
        <section>
          <select name="Folder" id="folderSelect" class="add-note-folder">
            <option value="" disabled selected>Select Folder</option>
            ${uniqueFolders.map((item) => {
               return `
                <option value="${item}">${item}</option>
              `
            }).join("")}
            <option value="add">Add new Folder</option>
          </select>
          <button class="form-button" id="saveNote">Save</button>
          <button class="form-button" id="cancelNote">Cancel</button>
        </section>
        <section>
          <select name="tag" id="tagSelect" class="add-note-tag">
            <option value="" disabled selected>Select Tag</option>
            ${uniqueTags.map((item) => {
                return `
                  <option value="${item}">${item}</option>
                `
              }).join("")}
            <option value="add" id="addTag">Add new Tag</option>
          </select>
        </section>
      </div>
      <div class="note-body">
        <textarea name="addNoteContent" id="addNoteContent" class="add-note-textarea" placeholder="Add notes here"></textarea>
      </div>
      <div class="note-footer">
        <p>${new Date().toDateString()}</p>
      </div>
    </form>
  `
  const folderSelect = addNote.querySelector("#folderSelect");

  folderSelect.addEventListener("change", (e) => {
    if (e.target.value === "add") {
      const dialog = document.createElement("dialog");
      dialog.classList.add("dialog");
      dialog.innerHTML = `
        <form method="dialog" class="form" id="addFolderForm">
          <h3>Add New Folder</h3>
          <input type="text" id="newFolderName" placeholder="Enter folder name" required />
          <section class="buttons">
            <button type="submit">Add</button>
            <button type="button" id="dialogCancelButton">Cancel</button>
          </section>
        </form>
      `;
      const addFolderForm = dialog.querySelector("#addFolderForm");
      const newFolderNameInput = dialog.querySelector("#newFolderName");
      const cancelButton = dialog.querySelector("#dialogCancelButton");
      addFolderForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newFolderName = newFolderNameInput.value.trim();
        if (newFolderName){
          uniqueFolders.push(newFolderName);
          folderSelect.innerHTML =`
          <option value="" disabled selected>Select Folder</option>
          ${uniqueFolders.map((item) => {
            return `
              <option value="${item}">${item}</option>
            `
          }).join("")}
          <option value="add">Add new Folder</option>
          `
          folderSelect.value = newFolderName;
          dialog.close();
          dialog.remove();
        } 
      })

      cancelButton.addEventListener("click", (e) => {
        e.preventDefault();
        dialog.close();
        dialog.remove();
      });
      document.body.appendChild(dialog);
      dialog.showModal();
    }
  });

  const tagSelect = addNote.querySelector("#tagSelect");

  tagSelect.addEventListener("change", (e) => {
    if (e.target.value === "add") {
      const dialog = document.createElement("dialog");
      dialog.classList.add("dialog");
      dialog.innerHTML = `
        <form method="dialog" class="form" id="addTagForm">
          <h3>Add New Folder</h3>
          <input type="text" id="newTagName" placeholder="Enter tag name" required />
          <section class="buttons">
            <button type="submit">Add</button>
            <button type="button" id="dialogCancelButton">Cancel</button>
          </section>
        </form>
      `;
      const addTagForm = dialog.querySelector("#addTagForm");
      const newTagNameInput = dialog.querySelector("#newTagName");
      const cancelButton = dialog.querySelector("#dialogCancelButton");
      addTagForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newTagName = newTagNameInput.value.trim();
        if (newTagName){
          uniqueTags.push(newTagName);
          tagSelect.innerHTML =`
          <option value="" disabled selected>Select Tag</option>
          ${uniqueTags.map((item) => {
            return `
              <option value="${item}">${item}</option>
            `
          }).join("")}
          <option value="add">Add new Tag</option>
          `
          tagSelect.value = newTagName;
          dialog.close();
          dialog.remove();
        } 
      })

      cancelButton.addEventListener("click", (e) => {
        e.preventDefault();
        dialog.close();
        dialog.remove();
      });
      document.body.appendChild(dialog);
      dialog.showModal();
    }
  });

  const saveNoteButton = addNote.querySelector("#saveNote");
  const cancelNoteButton = addNote.querySelector("#cancelNote");

  saveNoteButton.addEventListener("click", (e) => {
    e.preventDefault();
    const titleInput = addNote.querySelector("#noteTitle");
    const folderSelect = addNote.querySelector("#folderSelect");
    const tagSelect = addNote.querySelector("#tagSelect");
    const contentTextarea = addNote.querySelector("#addNoteContent");
    const date = new Date();
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    titleInput.value = titleInput.value.trim();
    folderSelect.value = folderSelect.value.trim();
    tagSelect.value = tagSelect.value.trim();
    contentTextarea.value = contentTextarea.value.trim();
    if(data.some((item) => item.title === titleInput.value && item.folder === folderSelect.value)) {
      const existingNoteWarning = document.createElement("dialog");
      existingNoteWarning.classList.add("dialog");
      existingNoteWarning.innerHTML = `
        <form method="dialog" class="form">
          <h3>Note Already Exists</h3>
          <p>A note with the title "${titleInput.value}" already exists in the folder "${folderSelect.value}".</p>
          <section class="buttons">
            <button type="submit">OK</button>
          </section>
        </form>
      `;
      document.body.appendChild(existingNoteWarning);
      existingNoteWarning.showModal();
      existingNoteWarning.addEventListener("submit", () => {
        existingNoteWarning.close();
        existingNoteWarning.remove();
      });
      return;
    } else if(titleInput.value === "" || folderSelect.value === "" || tagSelect.value === "" || contentTextarea.value === "") {
      const emptyFieldsWarning = document.createElement("dialog");
      emptyFieldsWarning.classList.add("dialog");
      emptyFieldsWarning.innerHTML = `
        <form method="dialog" class="form">
          <h3>Empty Fields</h3>
          <p>Please fill in all fields before saving the note.</p>
          <section class="buttons">
            <button type="submit">OK</button>
          </section>
        </form>
      `;
      document.body.appendChild(emptyFieldsWarning);
      emptyFieldsWarning.showModal();
      emptyFieldsWarning.addEventListener("submit", () => {
        emptyFieldsWarning.close();
        emptyFieldsWarning.remove();
      }); 
    } else {
      currentNote ={
        folder: folderSelect.value,
        title: titleInput.value,
        tag: tagSelect.value,
        content: contentTextarea.value,
        date: date.toDateString(),
        time: time,
      }
      data.push(currentNote);
      localStorage.setItem("data", JSON.stringify(data));
      notesSidebarReset();
    }
  });

  cancelNoteButton.addEventListener("click", (e) => {
    e.preventDefault();
    const cancelDialog = document.createElement("dialog");
    cancelDialog.classList.add("dialog");
    cancelDialog.innerHTML = `
      <form method="dialog" class="form">
      <h3>Cancel Note Creation</h3>  
        <p>Are you sure you want to cancel creating this note? All unsaved changes will be lost.</p>
        <section class="buttons">
        <button type="submit">Yes, Cancel</button>
        <button type="button" id="cancelDialogButton">No, Go Back</button>
        </section>
      </form>
    `
    document.body.appendChild(cancelDialog);
    cancelDialog.showModal();
    const cancelDialogButton = cancelDialog.querySelector("#cancelDialogButton");
    cancelDialogButton.addEventListener("click", (e) => {
      e.preventDefault();
      cancelDialog.close();
      cancelDialog.remove();
    });

    const cancelDialogForm = cancelDialog.querySelector("form");
    cancelDialogForm.addEventListener("submit", (e) => {
      e.preventDefault();
      cancelDialog.close();
      cancelDialog.remove();
      notesSidebarReset();
    });
  });
  notesBody.appendChild(addNote);
});


notesBody.addEventListener("click", (e) => {
  if(e.target.classList.contains("delete-note")) {
    e.stopPropagation();
    const noteElement = e.target.closest(".open-note");
    const title = noteElement.querySelector("h3").textContent;
    const tag = noteElement.querySelector(".note-tag").textContent;
    const breadcrumb = noteElement.querySelector(".breadcrumb").textContent;
    const folder = breadcrumb.split("/")[0];
    const deleteDialog = document.createElement("dialog");
    deleteDialog.classList.add("dialog");
    deleteDialog.innerHTML = `
      <form method="dialog" class="form" id="deleteNoteForm">
        <h3>Delete Note?</h3>
        <p>Are you sure you want to delete the note titled "${title}"?</p>
        <section class="buttons">
          <button type="submit">Delete</button>
          <button type="button" id="dialogCancelButton">Cancel</button>
        </section>
      </form>
    `
    const deleteNoteForm = deleteDialog.querySelector("#deleteNoteForm");
    const cancelButton = deleteDialog.querySelector("#dialogCancelButton");
    cancelButton.addEventListener("click", (e) => {
      e.preventDefault();
      deleteDialog.close();
      deleteDialog.remove();
    })
    deleteNoteForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const note = data.find(item => item.title === title && item.folder === folder && item.tag === tag);
      if (note) {
        const idx = data.indexOf(note);
        if (idx !== -1) {
          data.splice(idx, 1);
          localStorage.setItem("data", JSON.stringify(data));
          notesSidebarReset();
          deleteDialog.close();
          deleteDialog.remove();
        }
      }
    });
    document.body.appendChild(deleteDialog);
    deleteDialog.showModal();
  }
  if (e.target.classList.contains("edit-note")) {
    e.stopPropagation();
    const noteElement = e.target.closest(".open-note");
    const title = noteElement.querySelector("h3").textContent;
    const tag = noteElement.querySelector(".note-tag").textContent;
    const content = noteElement.querySelector(".open-note-body p").textContent;
    const breadcrumb = noteElement.querySelector(".breadcrumb").textContent;
    const folder = breadcrumb.split("/")[0];

    notesBody.innerHTML = `
      <article class="add-note">
        <form action="" method="post" class="add-note-form" id="editNoteForm">
          <p class="breadcrumb">${breadcrumb}</p>
          <div class="note-header">
            <section>
              <label for="editNoteTitle" class="add-note-label">Title:</label>
              <input
                type="text"
                id="editNoteTitle"
                class="add-note-title"
                value="${title}"
              />
            </section>
            <section>
              <select name="Folder" id="editFolderSelect" class="add-note-folder">
                <option value="" disabled>Select Folder</option>
                ${[...new Set(data.map(item => item.folder))].map((item) => `
                  <option value="${item}" ${item === folder ? "selected" : ""}>${item}</option>
                `).join("")}
                <option value="add">Add new Folder</option>
              </select>
              <button class="form-button" id="saveEditedNote">Save</button>
              <button class="form-button" id="cancelEditedNote">Cancel</button>
            </section>
            <section>
              <select name="tag" id="editTagSelect" class="add-note-tag">
                <option value="" disabled>Select Tag</option>
                ${[...new Set(data.map(item => item.tag))].map((item) => `
                  <option value="${item}" ${item === tag ? "selected" : ""}>${item}</option>
                `).join("")}
                <option value="add">Add new Tag</option>
              </select>
            </section>
          </div>
          <div class="note-body">
            <textarea name="editNoteContent" id="editNoteContent" class="add-note-textarea" placeholder="Edit notes here">${content}</textarea>
          </div>
          <div class="note-footer">
            <p>${new Date().toDateString()}</p>
            <p>${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p> 
          </div>
        </form>
      </article>
    `;

    const folderSelect = notesBody.querySelector("#editFolderSelect");
    folderSelect.addEventListener("change", (e) => {
      if (e.target.value === "add") {
        const dialog = document.createElement("dialog");
        dialog.classList.add("dialog");
        dialog.innerHTML = `
          <form method="dialog" class="form" id="addFolderForm">
            <h3>Add New Folder</h3>
            <input type="text" id="newFolderName" placeholder="Enter folder name" required />
            <section class="buttons">
              <button type="submit">Add</button>
              <button type="button" id="dialogCancelButton">Cancel</button>
            </section>
          </form>
        `;
        const addFolderForm = dialog.querySelector("#addFolderForm");
        const newFolderNameInput = dialog.querySelector("#newFolderName");
        const cancelButton = dialog.querySelector("#dialogCancelButton");
        addFolderForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const newFolderName = newFolderNameInput.value.trim();
          if (newFolderName){
            const uniqueFolders = [...new Set(data.map(item => item.folder)), newFolderName];
            folderSelect.innerHTML =`
              <option value="" disabled>Select Folder</option>
              ${uniqueFolders.map((item) => `
                <option value="${item}">${item}</option>
              `).join("")}
              <option value="add">Add new Folder</option>
            `;
            folderSelect.value = newFolderName;
            dialog.close();
            dialog.remove();
          } 
        });
        cancelButton.addEventListener("click", (e) => {
          e.preventDefault();
          dialog.close();
          dialog.remove();
        });
        document.body.appendChild(dialog);
        dialog.showModal();
      }
    });

    const tagSelect = notesBody.querySelector("#editTagSelect");
    tagSelect.addEventListener("change", (e) => {
      if (e.target.value === "add") {
        const dialog = document.createElement("dialog");
        dialog.classList.add("dialog");
        dialog.innerHTML = `
          <form method="dialog" class="form" id="addTagForm">
            <h3>Add New Tag</h3>
            <input type="text" id="newTagName" placeholder="Enter tag name" required />
            <section class="buttons">
              <button type="submit">Add</button>
              <button type="button" id="dialogCancelButton">Cancel</button>
            </section>
          </form>
        `;
        const addTagForm = dialog.querySelector("#addTagForm");
        const newTagNameInput = dialog.querySelector("#newTagName");
        const cancelButton = dialog.querySelector("#dialogCancelButton");
        addTagForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const newTagName = newTagNameInput.value.trim();
          if (newTagName){
            const uniqueTags = [...new Set(data.map(item => item.tag)), newTagName];
            tagSelect.innerHTML =`
              <option value="" disabled>Select Tag</option>
              ${uniqueTags.map((item) => `
                <option value="${item}">${item}</option>
              `).join("")}
              <option value="add">Add new Tag</option>
            `;
            tagSelect.value = newTagName;
            dialog.close();
            dialog.remove();
          } 
        });
        cancelButton.addEventListener("click", (e) => {
          e.preventDefault();
          dialog.close();
          dialog.remove();
        });
        document.body.appendChild(dialog);
        dialog.showModal();
      }
    });

    notesBody.querySelector("#saveEditedNote").addEventListener("click", function(ev) {
      ev.preventDefault();
      const titleInput = notesBody.querySelector("#editNoteTitle");
      const folderInput = notesBody.querySelector("#editFolderSelect");
      const tagInput = notesBody.querySelector("#editTagSelect");
      const contentInput = notesBody.querySelector("#editNoteContent");
      const newTitle = titleInput.value.trim();
      const newFolder = folderInput.value.trim();
      const newTag = tagInput.value.trim();
      const newContent = contentInput.value.trim();
      const date = new Date().toDateString();
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (!newTitle || !newFolder || !newTag || !newContent) {
        const emptyFieldsWarning = document.createElement("dialog");
        emptyFieldsWarning.classList.add("dialog");
        emptyFieldsWarning.innerHTML = `
          <form method="dialog" class="form">
            <h3>Empty Fields</h3>
            <p>Please fill in all fields before saving the note.</p>
            <section class="buttons">
              <button type="submit">OK</button>
            </section>
          </form>
        `;
        document.body.appendChild(emptyFieldsWarning);
        emptyFieldsWarning.showModal();
        emptyFieldsWarning.addEventListener("submit", () => {
          emptyFieldsWarning.close();
          emptyFieldsWarning.remove();
        }); 
        return;
      }

      const duplicate = data.some(item => 
        item.title === newTitle && item.folder === newFolder && !(item.title === title && item.folder === folder)
      );
      if (duplicate) {
        const existingNoteWarning = document.createElement("dialog");
        existingNoteWarning.classList.add("dialog");
        existingNoteWarning.innerHTML = `
          <form method="dialog" class="form">
            <h3>Note Already Exists</h3>
            <p>A note with the title "${newTitle}" already exists in the folder "${newFolder}".</p>
            <section class="buttons">
              <button type="submit">OK</button>
            </section>
          </form>
        `;
        document.body.appendChild(existingNoteWarning);
        existingNoteWarning.showModal();
        existingNoteWarning.addEventListener("submit", () => {
          existingNoteWarning.close();
          existingNoteWarning.remove();
        });
        return;
      }

      const idx = data.findIndex(item => item.title === title && item.folder === folder);
      if (idx !== -1) {
        data[idx] = {
          folder: newFolder,
          title: newTitle,
          tag: newTag,
          content: newContent,
          date,
          time
        };
        localStorage.setItem("data", JSON.stringify(data));
        notesSidebarReset();
      }
    });

    notesBody.querySelector("#cancelEditedNote").addEventListener("click", function(ev) {
      ev.preventDefault();
      const cancelDialog = document.createElement("dialog");
      cancelDialog.classList.add("dialog");
      cancelDialog.innerHTML = `
        <form method="dialog" class="form">
          <h3>Cancel Edit</h3>  
          <p>Are you sure you want to cancel editing this note? All unsaved changes will be lost.</p>
          <section class="buttons">
            <button type="submit">Yes, Cancel</button>
            <button type="button" id="cancelDialogButton">No, Go Back</button>
          </section>
        </form>
      `;
      document.body.appendChild(cancelDialog);
      cancelDialog.showModal();
      const cancelDialogButton = cancelDialog.querySelector("#cancelDialogButton");
      cancelDialogButton.addEventListener("click", (e) => {
        e.preventDefault();
        cancelDialog.close();
        cancelDialog.remove();
      });
      const cancelDialogForm = cancelDialog.querySelector("form");
      cancelDialogForm.addEventListener("submit", (e) => {
        e.preventDefault();
        cancelDialog.close();
        cancelDialog.remove();
        notesSidebarReset();
      });
    });
  }
});

const allDeleteNotes = document.querySelectorAll(".delete-note");
