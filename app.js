const letters = document.querySelector('.letters');
const all_keys = document.querySelectorAll('.letter')
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
    'spoon',
    'learn',
    'house',
    'laugh',
    'dance',
]


const random_word = () =>{
    return words[Math.floor(Math.random() * words.length)]
}

let lucky_word = random_word()

let line = 0;
let box = 0;

const display = letter =>{

    if(guess_words[line].length === 5){
        return alert('Please Click The Enter Button')
    }
    guess_words[line].push(letter)
    boxes[line].children[box].textContent = guess_words[line][guess_words[line].length-1]
    box++

}

const check_word = word =>{

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

const check_letters = (word,test) =>{
    for (let i = 0; i < word.length; i++) {

        if(word.includes(test[i]) && word[i] === test[i]){

            add_toggle(boxes[line].children[i],'correct')

        }else if(word.includes(test[i])){

            add_toggle(boxes[line].children[i],'warning')
        
        }else{

            add_toggle(boxes[line].children[i],'wrong')

        }
            
    }
}


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

const toggel_button = letter =>{

    let curClicked = Array.from(all_keys).find(btn => btn.dataset.value == letter)
    
    if(curClicked == undefined) return false;
    add_toggle(curClicked,'clicked')
    remove_toggle(curClicked,'clicked',100)

    return curClicked.dataset.value
}

const keyboard = letter =>{

    if(toggel_button(letter)) display(letter)

}

const add_toggle = (item,clas) => item.classList.toggle(clas);

const remove_toggle = (item,clas,sec) =>{
    setTimeout(()=>{
        item.classList.remove(clas)
    },sec)
}


const keys = ev =>{

    // let char = ev.char || ev.charCode || ev.which;
    // let letter = String.fromCharCode(char)

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

const backspace = data =>{
    if(data.length <= 5 && data.length > 0){
        data.splice(-1)
        boxes[line].children[box-1].innerHTML = ''
        box--
    }
}


const body = document.body;
body.addEventListener('keydown',keys)
