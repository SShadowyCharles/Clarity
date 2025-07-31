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
