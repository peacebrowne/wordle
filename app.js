const letters = document.querySelector('.letters');
const buttons = document.querySelectorAll('.letter')
const boxes = document.querySelector('.boxes').children;

const guess_words = [
    [],
    [],
    [],
    [],
    [],
    []
]

const words = [
    // 'spoon',
    // 'learn',
    // 'house',
    // 'laugh',
    'dance',
]

/**
 * Generating random number
 * * @return -random number from the length of words array.
 * 
 *  */
const random_word = () =>{
    return words[Math.floor(Math.random() * words.length)]
}

let lucky_word = random_word()

/**
 * Display each letter user type in the boxes.
 * @return or cancel the display funtion if the boxes on each line is full
 * @param letter - keyboard character
 * */
let line = 0;
let box = 0;

const display = letter =>{

    if(guess_words[line].length === 5) return
    guess_words[line].push(letter)
    boxes[line].children[box].textContent = guess_words[line][guess_words[line].length-1]
    boxes[line].children[box].classList.toggle('border')
    box++

}


/**
 * checking each word the user guesses to know if guessed word is the same as the generated word
 * of the day.
 * @return Game over message if user guessed chance is over.
 *         or cancel the check word funtion if the boxes on each line is full with letters.
 * @param word - keyboard character
 * */

const check_word = word => {

    if(guess_words[line] == undefined)return alert('Game Over Please Wait For The Next Day')
    if(guess_words[line].length < 5) {

        add_toggle(boxes[line],'incomplete')
        remove_toggle(boxes[line],'incomplete',100)
        return;

    }
    if(word == undefined) check_word(lucky_word = random_word())
    let test = guess_words[line];
    check_letters(word,test)
    line++
    box = 0;

}

/**
 *  checking each letter the user type to know if it's apart of the generated word of the day
 *  or apart but not in the right position or it's not apart at all.
 *  @param word - keyboard character
 *  @param letters - array of letters
* */

const check_letters = (word,letters) => {

    for (let i = 0; i < word.length; i++) {

        let curClicked = Array.from(buttons).find(btn => btn.dataset.value == letters[i])
        let btn = btn_toggle(curClicked)

        if(word.includes(letters[i]) && word[i] === letters[i]){


            if(btn != false) add_toggle(btn,'correct-btn')
            add_toggle(boxes[line].children[i],'correct')
            add_toggle(boxes[line].children[i],'border')

        }else if(word.includes(letters[i])){


            if(btn != false) add_toggle(btn,'warning-btn')
            add_toggle(boxes[line].children[i],'warning')
            add_toggle(boxes[line].children[i],'border')
        
        }else{

            if(btn != false) add_toggle(btn,'wrong-btn')
            add_toggle(boxes[line].children[i],'wrong')
            add_toggle(boxes[line].children[i],'border')

        }
            
    }
}

let btn_class = ['correct-btn','warning-btn','wrong-btn']
const btn_toggle = btn => {
     let result = btn_class.some(val => btn.className.includes(val))
     if(result) return false;
     return btn
}

/**
 *  checking if user clicked enter key or delete key or any letter keys
 *  if "enter", checks if word is correct
 *  else if "delete", delete a letter from the guessed word
 *  else if "letter", display letter in a box.
 *  @param ev - targeted keyboard character
* */

letters.addEventListener('click', ev => {

    let letter = ev.target;

    if(letter.className.includes('enter')){

        toggel_button(letter.dataset.value)
        check_word(lucky_word)
        
    }else if(letter.className.includes('delete')){

        toggel_button(letter.dataset.value)
        backspace(guess_words[line])

    }
    else if(letter.className.includes('letter')){

        display(letter.dataset.value)
        toggel_button(letter.dataset.value)

    }
   
})


/**
 *  Toggling each button clicked with a blue bgColor if button has a letter, enter or delete
 *  else if "letter", display letter in a box.
 *  @param letter - targeted keyboard character
 *  @return false - if button is part of the three options else
 *  @return letter - targeted key character
 * 
* */
const toggel_button = letter =>{

    let curClicked = Array.from(buttons).find(btn => btn.dataset.value == letter)
    if(curClicked == undefined) return false;

    add_toggle(curClicked,'clicked')

    remove_toggle(curClicked,'clicked',100)

    return curClicked.dataset.value

}

/**
 *  if button is valid display it else cancel funtion execution
 *  @param letter - targeted keyboard character
 * 
* */
const keyboard = letter =>{

    if(toggel_button(letter)) display(letter)

}

/**
 *  Adding toggle event to each valid button
 *  @param item - targeted keyboard character
 *  @param clas - class => css style to add
 * 
* */
const add_toggle = (item,clas) => item.classList.toggle(clas);


/**
 *  Removing toggle event on each valid button
 *  @param item - targeted keyboard character
 *  @param clas - class => css style to add
 *  @param sec - delayed time before removing toggle
 * 
* */
const remove_toggle = (item,clas,sec) => {

    setTimeout(()=>{

        item.classList.remove(clas)

    },sec)

}

/**
 *  Targeting each key user typed on keyboard
 *  if key is part the three options
 *  @validKeys - ("letter","enter" or "delete") 
 *  @param item - targeted keyboard character
 * 
* */
const keys = ev =>{

    let char = ev.key;
    if(char === 'Enter'){

        toggel_button(char.toLowerCase())
        check_word(lucky_word)

    }else if (char === 'Backspace'){

        backspace(guess_words[line])
        toggel_button(char.toLowerCase())
        
    }else{

        keyboard(char)

    }

}

/**
 *  Removing a letter from user guessed word
 *  @param data - [array of boxes per line]
 * 
* */
const backspace = data => {
    if(data.length <= 5 && data.length > 0){
        data.splice(-1)
        boxes[line].children[box-1].classList.toggle('border')
        boxes[line].children[box-1].innerHTML = ''
        box--
    }
}

// Adding keyboard event to document body to handle all keys pressed on keyboard.
const body = document.body;
body.addEventListener('keydown',keys)
