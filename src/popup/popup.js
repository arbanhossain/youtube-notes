/*
  Variable Initialization
*/
let submitButton = document.getElementById('commit');
let noteArea = document.getElementById('note');
let view = document.getElementById('view');
let SRC = '';

/*
  Initializes Local Storage for the current URL
*/
const initFile = () => {
  chrome.tabs.executeScript({
    code: `x = window.location.href;x;`
  }, (src) => {
    SRC = src[0];
    console.log(SRC);
    SRC = SRC.replace("https://www.youtube.com/watch?v=", "");
    console.log(`id is ${SRC}`);
    SRC = SRC.replace(/&.+/, "");
    console.log(`id is ${SRC}`);
    if (localStorage.getItem(SRC) == null) {
      localStorage.setItem(SRC, ``);
    }
    console.log(localStorage.getItem(SRC))
  });
}

const formatViewText = (text) => {
  text = text.replace(/Time=/g, "").replace(/, N/g, " => ").replace(/ote=/g, "");
  return text;
}

/*
  Show the notes
*/
const updateView = () => {
  let text = formatViewText(localStorage.getItem(SRC));
  view.innerHTML = text;
}

const clearNotepad = () => {
  noteArea.value = '';
}

const saveNote = (data) => {
  console.log(data);
  console.log('NO')
}

const addToNote = (time, note) => {
  let text = localStorage.getItem(SRC) + `Time=${time}, Note=${note}\n`;
  console.log(text);
  localStorage.setItem(SRC, text)
  clearNotepad();
  updateView();
}

submitButton.onclick = (e) => {
  chrome.tabs.executeScript({
    //can use some refactor
    code: `x = document.getElementsByTagName('video')[0].currentTime;console.log(x);x;`
  }, (timestamp) => {
    addToNote(timestamp, document.getElementById('note').value);
  });
}

/*
  Note Viewing is manual for now
*/
viewButton.onclick = (e) => {
  updateView();
}

initFile();