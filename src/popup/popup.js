/*
  Variable Initialization
*/
let submitButton = document.getElementById('commit');
let noteArea = document.getElementById('note');
let view = document.getElementById('view');
let SRC = '';
let getTime = `x = document.getElementsByTagName('video')[0].currentTime;x;`;
/*
  Initializes Local Storage for the current URL
*/
const initFile = () => {
  chrome.tabs.executeScript({
    code: `x = window.location.href;x;`
  }, (src) => {
    SRC = src[0];
    //console.log(SRC);
    SRC = SRC.replace("https://www.youtube.com/watch?v=", "");
    //console.log(`id is ${SRC}`);
    SRC = SRC.replace(/&.+/, "");
    //console.log(`id is ${SRC}`);
    if (localStorage.getItem(SRC) == null) {
      localStorage.setItem(SRC, ``);
    }
    updateView();
    //console.log(localStorage.getItem(SRC))
  });
};

const sortNoteObject = (a, b) => {
  return ((parseInt(a.time) > parseInt(b.time)) ? 1 : -1);
};

const formatViewText = (text) => {
  let working = text.split('\n');
  let obj = [];
  working.forEach(item => {
    if (item != '') {
      let time = item.match(/Time=[0-9]+\.[0-9]+/)[0].replace("Time=", "").split(".")[0];
      let note = item.match(/Note=.+/)[0].replace("Note=", "");
      obj.push({
        "time": time,
        "note": note
      });
    }
  });
  obj = obj.sort(sortNoteObject);
  //console.log(obj);
  return obj;
};

const makeHTML = (obj) => {
  let text = ``;
  obj.forEach(item => {
    text += `<span data-time="${item.time}">${item.time} => ${item.note}</span><br>`;
  });
  return text;
};

/*
  Show the notes
*/
const updateView = () => {
  let obj = formatViewText(localStorage.getItem(SRC));
  let text = makeHTML(obj);
  view.innerHTML = text;
};

const updateHighlighter = () => {
  chrome.tabs.executeScript({
    code: getTime
  }, (timestamp) => {
    let obj = formatViewText(localStorage.getItem(SRC));
    let arr = [];
    obj.forEach(item => {
      arr.push(parseInt(item.time));
    });
    //console.log(arr);
    /*
    Check the closest timestamp and highlight that
    */
    let number = [...arr].reverse().find(e => e <= timestamp);
    //console.log(number);
    let elements = document.querySelectorAll(`[data-time="${number}"]`);
    if (elements.length == 0) return;
    //console.log(elements);
    let classes = document.getElementsByClassName('highlighted');
    //console.log(classes);
    for (let e of classes) {
      e.classList.remove('highlighted');
    }
    elements.forEach(item => {
      item.classList.add('highlighted');
    });
  });
};

const clearNotepad = () => {
  noteArea.value = '';
};

const saveNote = (data) => {
  console.log(data);
  console.log('NO');
};

const addToNote = (time, note) => {
  let text = localStorage.getItem(SRC) + `Time=${time}, Note=${note}\n`;
  console.log(text);
  localStorage.setItem(SRC, text);
  clearNotepad();
  updateView();
};

submitButton.onclick = (e) => {
  chrome.tabs.executeScript({
    code: getTime
  }, (timestamp) => {
    addToNote(timestamp, document.getElementById('note').value);
  });
};

viewButton.onclick = (e) => {
  updateView();
};

initFile();
setInterval(updateHighlighter, 1000);