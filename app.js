const letters = document.querySelector(".letters");
const buttons = document.querySelectorAll(".letter");
const boxes = document.querySelector(".boxes").children;
const loader = document.querySelector(".loader");

const guess_words = [[], [], [], [], [], []];

const words = [
  "flaky",
  "caper",
  "quilt",
  "rumba",
  "fable",
  "motto",
  "gravy",
  "funky",
  "gloom",
  "hurry",
  "jolly",
  "knack",
  "laser",
  "mimic",
  "noble",
  "punch",
  "quack",
  "roast",
  "shaky",
  "tulip",
];

const popup_values = {
  win: {
    icon: `   <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="w-6 h-6"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M4.5 12.75l6 6 9-13.5"
    />
  </svg>`,
    msg: "You Win!!",
  },
  nextDay: {
    icon: `<svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="w-6 h-6"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>`,
    msg: "Game over!! You did not win.",
  },
};

/**
 * Generating random number
 * * @return -random number from the length of words array.
 *  */
const random_word = () => {
  return words[Math.floor(Math.random() * words.length)];
};

let lucky_word = random_word();

/**
 * Display each letter user type in the boxes.
 * @return or cancel the display funtion if the boxes on each line is full
 * @param letter - keyboard character
 * */
let line = 0;
let box = 0;

const display = (letter) => {
  if (guess_words[line].length === 5) return alert("Guesses finish");
  guess_words[line].push(letter);
  boxes[line].children[box].textContent =
    guess_words[line][guess_words[line].length - 1];
  boxes[line].children[box].classList.toggle("border");
  box++;
};

/**
 * checking each word the user guesses to know if guessed word is the same as the generated word
 * @return Game over message if user guessed chance is over or cancel the check word funtion if the boxes on each line is full with letters.
 * @param word - keyboard character
 * */

const check_word = (word) => {
  if (guess_words[line].length < 5) {
    add_toggle(boxes[line], "incomplete");
    remove_toggle(boxes[line], "incomplete", 100);
    return;
  }
  if (!word) check_word((lucky_word = random_word()));
  const letters = guess_words[line];
  check_letters(word, letters);
  line++;
  box = 0;
  gameOver(word, letters);
};

/**
 *  checking each letter the user type to know if it's apart of the generated word of the day or apart but not in the right position or it's not apart at all.
 *  @param word - keyboard character
 *  @param letters - array of letters
 * */

const check_letters = (word, letters) => {
  for (let i = 0; i < word.length; i++) {
    const curClicked = Array.from(buttons).find(
      (btn) => btn.dataset.value == letters[i]
    );
    const button = btn_toggle(curClicked);
    if (word.includes(letters[i]) && word[i] === letters[i]) {
      if (button !== false) add_toggle(button, "correct-btn");
      add_toggle(boxes[line].children[i], "correct");
      add_toggle(boxes[line].children[i], "border");
    } else if (word.includes(letters[i])) {
      if (button !== false) add_toggle(button, "warning-btn");
      add_toggle(boxes[line].children[i], "warning");
      add_toggle(boxes[line].children[i], "border");
    } else {
      if (button !== false) add_toggle(button, "wrong-btn");
      add_toggle(boxes[line].children[i], "wrong");
      add_toggle(boxes[line].children[i], "border");
    }
  }

  gameOver(word, letters);
};

const btn_class = ["correct-btn", "warning-btn", "wrong-btn"];
const btn_toggle = (btn) => {
  return btn_class.some((val) => btn.className.includes(val)) ? btn : false;
};

/**
 *  Targeting each key user typed on keyboard if key is part the three options
 *  @validKeys - ("letter","enter" or "delete")
 *  @param item - targeted keyboard character
 *
 * */
const keys = (event) => {
  const letter = !event.target.dataset.value
    ? event.key.toLowerCase()
    : event.target.dataset.value.toLowerCase();

  if (letter === "letter") display(letter);
  if (letter === "enter") check_word(lucky_word);
  if (letter === "backspace") backspace(guess_words[line]);
  else keyboard(letter);
};

/**
 *  Toggling each button clicked with a blue bgColor if button has a letter, enter or delete else if "letter", display letter in a box.
 *  @param {letter} - targeted keyboard character
 *  @returns {false} - if button is part of the three options else
 *  @return {letter} - targeted key character
 * */
const toggel_button = (letter) => {
  const targetEl = Array.from(buttons).find(
    (btn) => btn.dataset.value === letter
  );

  if (targetEl == undefined) return false;

  add_toggle(targetEl, "clicked");
  remove_toggle(targetEl, "clicked", 100);
  return targetEl.dataset.value;
};

/**
 *  if button is valid display it else cancel funtion execution
 *  @param letter - targeted keyboard character
 * */
const keyboard = (letter) => (toggel_button(letter) ? display(letter) : "");

/**
 *  Adding toggle event to each valid button
 *  @param item - targeted keyboard character
 *  @param clas - class => css style to add
 * */
const add_toggle = (item, clas) => item.classList.toggle(clas);

/**
 *  Removing toggle event on each valid button
 *  @param item - targeted keyboard character
 *  @param clas - class => css style to add
 *  @param sec - delayed time before removing toggle
 * */
const remove_toggle = (item, clas, sec) =>
  setTimeout(() => item.classList.remove(clas), sec);

/**
 *  Removing a letter from user guessed word
 *  @param letters - [array of boxes per line]
 * */
const backspace = (letters) => {
  if (letters.length <= 5 && letters.length > 0) {
    letters.splice(-1);
    boxes[line].children[box - 1].classList.toggle("border");
    boxes[line].children[box - 1].innerHTML = "";
    box--;
  }
};

// Adding keyboard event to document body to handle all keys pressed on keyboard.
const body = document.body;
body.removeEventListener("keydown", keys);
letters.addEventListener("click", keys);

window.onload = () => {
  loader.classList.toggle("hide");
  setTimeout(() => {
    loader.classList.toggle("hide");
    body.addEventListener("keydown", keys);
  }, 7000);
};

function gameOver(word, letters) {
  if (word === letters.join("")) {
    loader.classList.toggle("hide");
    body.removeEventListener("keydown", keys);
    popupMsg(popup_values.win.icon, popup_values.win.msg);
  }
  if (!guess_words[line + 1]) {
    setTimeout(() => {
      loader.classList.toggle("hide");
      body.removeEventListener("keydown", keys);
      popupMsg(popup_values.nextDay.icon, popup_values.nextDay.msg);
    }, 5000);
    return;
  }
}

function popupMsg(icon, msg) {
  const popup = loader.querySelector(".popup");
  const spinner = loader.querySelector(".spinner");
  popup.firstElementChild.insertAdjacentHTML("afterbegin", `${icon}${msg}`);
  popup.classList.toggle("hide");
  spinner.classList.toggle("hide");
}

const play_again = document.querySelector(".play-again");
play_again.addEventListener("click", () => location.reload());
