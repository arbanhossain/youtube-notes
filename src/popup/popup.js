let submitButton = document.getElementById('commit');
let x = null;

let SRC = '';

const init_notepad = () => {
  //let pad = localStorage.getItem();
  chrome.tabs.executeScript({
    code: `x = window.location.href;x;`
  }, (src) => {
    SRC = src[0]
    console.log(SRC);
    SRC = SRC.replace("https://www.youtube.com/watch?v=", "");
    console.log(`id is ${SRC}`);
    if(localStorage.getItem(SRC) == null){
      localStorage.setItem(SRC, ``);
    }
  });
}

const clearNotepad = () => {
  document.getElementById('note').value = '';
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
}

submitButton.onclick = (e) => {
  chrome.tabs.executeScript({
    //can use some refactor
    code: `x = document.getElementsByTagName('video')[0].currentTime;console.log(x);x;`
  }, (timestamp) => {
    addToNote(timestamp, document.getElementById('note').value);
  });
}

init_notepad();