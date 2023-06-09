const blessed = require('blessed');
const contrib = require('blessed-contrib');
const fs = require('fs');
const { exec, spawn } = require('child_process');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


// misc shit
const style = {
    fg: "red",
    bg: "black",
    border: {
        fg: "red",
    }    
}

const screen = blessed.screen({
    smartCSR: true
});


const grid = new contrib.grid({
    rows: 12,
    cols: 12,
    screen: screen
});

const misc_box = grid.set(0,0,3,3, blessed.bigtext, {
    content: fs.readFileSync('./assets/anonymous.gif'),
    style: style
})

const log = grid.set(0, 9, 3, 3, contrib.log, {
    fg: "red",
    selectedFg: "green",
    label: "Activity Log",
    style: style
});



const header_logo = grid.set(0, 3, 3, 6, blessed.text, {
    align: 'center',
    content: fs.readFileSync('./assets/logo.txt', 'utf8'),
    style: style
});

screen.render()
