let submitButton = document.getElementById('commit');
let x = null;

const clearNotepad = () => {
  document.getElementById('note').value = '';
}

const saveNote = (data) => {
  console.log(data);
  console.log('NO')
}

const addToNote = (time, note) => {
  console.log(`Time=${time}, Note=${note}`);
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