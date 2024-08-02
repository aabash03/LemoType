const words = 'The world is a vast and intricate tapestry woven from diverse cultures, landscapes, and histories. From the towering peaks of the Himalayas to the bustling streets of Tokyo, each corner of the globe holds its unique stories and traditions. The interplay between human innovation and natural beauty creates a dynamic and ever-evolving environment. In a time when global connectivity allows for unprecedented interaction, understanding and appreciating the richness of different cultures is more important than ever. By embracing this diversity, we can foster greater empathy and collaboration across borders, contributing to a more harmonious world.'.split(' ');

const wordCount = words.length;
const gameTime = 30 * 1000; // 30 seconds in milliseconds

window.timer = null;
window.gameStart = null;

function addClass(el, name) {
    if (el) {
        el.classList.add(name);
    }
}

function removeClass(el, name) {
    if (el) {
        el.classList.remove(name);
    }
}

function randomWord() {
    const randomIndex = Math.floor(Math.random() * wordCount);
    return words[randomIndex];
}

function formatWord(word) {
    if (!word) return ''; // Handle the case where word is undefined or null
    return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}

function newGame() {
    clearInterval(window.timer); // Ensure the timer is cleared before starting a new game
    window.timer = null;
    window.gameStart = null;
    document.getElementById('info').innerHTML = 'Start typing...';
    document.getElementById('words').innerHTML = '';
    for (let i = 0; i < 200; i++) {
        document.getElementById('words').innerHTML += formatWord(randomWord());
    }
    // Correctly add the 'current' class to the first letter of the first word
    const firstWord = document.querySelector('.word');
    if (firstWord) {
        const firstLetter = firstWord.querySelector('.letter');
        addClass(firstLetter, 'current');
        addClass(firstWord, 'current');
    }
    removeClass(document.getElementById('game'), 'over');
    updateCursor();
}

function getWpm() {
    const words = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current');
    const lastTypedWordIndex = words.indexOf(lastTypedWord);
    const typedWords = words.slice(0, lastTypedWordIndex);
    const correctWords = typedWords.filter(word => {
        const letters = [...word.children];
        const incorrectLetters = letters.filter(letter => letter.classList.contains('incorrect'));
        const correctLetters = letters.filter(letter => letter.classList.contains('correct'));
        return incorrectLetters.length === 0 && correctLetters.length === letters.length;
    });
    return correctWords.length * 2; // Correct words in 30 seconds, double for WPM
}

function gameover() {
    clearInterval(window.timer);
    addClass(document.getElementById('game'), 'over');
    document.getElementById('info').innerHTML = `WPM: ${getWpm()}`;
}

function updateCursor() {
    const nextLetter = document.querySelector('.letter.current');
    const cursor = document.getElementById('cursor');
    const nextWord = document.querySelector('.word.current');

    if (nextLetter) {
        cursor.style.top = nextLetter.getBoundingClientRect().top + window.scrollY + 2 + 'px';
        cursor.style.left = nextLetter.getBoundingClientRect().left + window.scrollX + 'px';
    } else if (nextWord) {
        cursor.style.top = nextWord.getBoundingClientRect().top + window.scrollY + 2 + 'px';
        cursor.style.left = nextWord.getBoundingClientRect().right + window.scrollX + 'px';
    }
}

document.getElementById('game').addEventListener('keyup', ev => {
    const key = ev.key;
    const currentWord = document.querySelector('.word.current');
    const currentLetter = document.querySelector('.letter.current');
    const expected = currentLetter ? currentLetter.innerHTML : '';
    const isLetter = key.length === 1 && key !== ' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace';
    const isFirstLetter = currentLetter === currentWord.firstChild;

    if (document.querySelector('#game.over')) {
        return;
    }

    console.log({ key, expected });

    if (!window.timer && isLetter) {
        window.gameStart = new Date().getTime();
        window.timer = setInterval(() => {
            const currentTime = new Date().getTime();
            const mspassed = currentTime - window.gameStart;
            const sLeft = Math.round((gameTime - mspassed) / 1000);

            if (sLeft <= 0) {
                gameover();
                return;
            }

            document.getElementById('info').innerHTML = `${sLeft} seconds left`;
        }, 1000);
    }

    if (isLetter) {
        if (currentLetter) {
            addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
            removeClass(currentLetter, 'current');

            // Move to the next letter
            let nextLetter = currentLetter.nextElementSibling;
            if (nextLetter && nextLetter.classList.contains('letter')) {
                addClass(nextLetter, 'current');
            }
        }
    }

    if (isSpace) {
        if (currentWord && !currentWord.classList.contains('completed')) {
            // Invalidate the remaining letters in the current word if not already completed
            const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
            lettersToInvalidate.forEach(letter => {
                addClass(letter, 'incorrect');
            });
            removeClass(currentWord, 'current');
            addClass(currentWord, 'completed');

            // Move to the next word
            const nextWord = currentWord.nextElementSibling;
            if (nextWord && nextWord.classList.contains('word')) {
                addClass(nextWord, 'current');
                const firstLetterNextWord = nextWord.querySelector('.letter');
                if (firstLetterNextWord) {
                    addClass(firstLetterNextWord, 'current');
                }
            }
        }
    }

    if (isBackspace) {
        if (currentLetter && isFirstLetter) {
            // Make the previous word current and last letter current
            const previousWord = currentWord.previousSibling;
            if (previousWord && previousWord.classList.contains('word')) {
                removeClass(currentWord, 'current');
                addClass(previousWord, 'current');
                const lastLetter = previousWord.lastChild;
                if (lastLetter && lastLetter.classList.contains('letter')) {
                    addClass(lastLetter, 'current');
                    removeClass(lastLetter, 'incorrect');
                    removeClass(lastLetter, 'correct');
                }
            }
        } else if (currentLetter && !isFirstLetter) {
            // Move back one letter
            const previousLetter = currentLetter.previousElementSibling;
            if (previousLetter && previousLetter.classList.contains('letter')) {
                removeClass(currentLetter, 'current');
                addClass(previousLetter, 'current');
                removeClass(previousLetter, 'incorrect');
                removeClass(previousLetter, 'correct');
            }
        } else if (!currentLetter) {
            // If no current letter, make the last letter of the current word current
            const lastLetter = currentWord.lastChild;
            if (lastLetter && lastLetter.classList.contains('letter')) {
                addClass(lastLetter, 'current');
                removeClass(lastLetter, 'incorrect');
                removeClass(lastLetter, 'correct');
            }
        }
    }

    // Scroll Lines
    if (currentWord.getBoundingClientRect().top > 250) {
        const wordsContainer = document.getElementById('words');
        const margin = parseInt(wordsContainer.style.marginTop || '0px');
        wordsContainer.style.marginTop = (margin - 35) + 'px';
    }

    // Move cursor
    updateCursor();
});

document.getElementById('newgamebutton').addEventListener('click', newGame);

newGame();
