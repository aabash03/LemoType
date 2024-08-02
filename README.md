# LemoType
Challenge your typing speed and accuracy! Type as many correct words as possible in 30 seconds. Get instant feedback and see your WPM score.
Here's a sample README for your GitHub repository that describes the website code provided:

---

# Typing Speed Test

This project is a simple typing speed test game built using HTML, CSS, and JavaScript. The game presents a series of words and measures your typing speed in words per minute (WPM) over a 30-second interval.

# Features

- Randomly selected words from a predefined list
- Visual feedback for correct and incorrect keystrokes
- Dynamic cursor positioning for visual typing assistance
- Real-time timer and WPM calculation
- Game reset and restart functionality

# How to Play

1. Click the "New Game" button to start a new game.
2. Start typing the words displayed on the screen. The timer will start as soon as you begin typing.
3. The game lasts for 30 seconds. Your WPM will be displayed at the end of the game.
4. To play again, click the "New Game" button.

# Code Overview

### HTML

The HTML structure consists of:
- A `div` container for the game.
- A `div` for displaying the words to type.
- An `info` element to show game messages and timer.
- A `cursor` element to assist in tracking the current typing position.
- A `newgamebutton` to start a new game.

### CSS

The CSS styles are used to:
- Style the game interface and words.
- Position and animate the cursor.
- Provide visual feedback for correct and incorrect letters.

### JavaScript

The JavaScript functionality includes:
- Word selection and formatting.
- Timer management and game control.
- Real-time user input handling and visual feedback.
- WPM calculation based on correct words typed within the game time.

### Key Functions

- `addClass` and `removeClass`: Manage CSS class additions and removals.
- `randomWord`: Selects a random word from the predefined list.
- `formatWord`: Formats a word into HTML elements for display.
- `newGame`: Initializes and starts a new game.
- `getWpm`: Calculates the WPM based on correct words typed.
- `gameover`: Ends the game and displays the WPM.
- `updateCursor`: Updates the cursor position based on the current letter.

## Getting Started

To run this project locally, simply clone the repository and open the `index.html` file in your web browser.

```bash
git clone https://github.com/yourusername/typing-speed-test.git
cd typing-speed-test
open index.html




