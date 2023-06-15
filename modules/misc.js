function typeWriter(text, speed = 200) {
    return new Promise((res) => {
      process.stdout.write(text[0], () => {
        if (text.length > 1) setTimeout(() => typeWriter(text.slice(1)), speed);
        else res();
      });
    });
}

function delay(ms) {
    return new Promise((res) => {
        setTimeout(() => {
            res()
        }, ms)
    })
}

async function glitch_text(text) {
    let char_array = text.split('')
    let return_array = []
    for (let i = 0; i < char_array.length; i++) {
        if (i % 2 == 0) {
            return_array.push(char_array[i])
        } else {
            return_array.push(`$`)
            return_array.push(`%`)
            return_array.push('#')
            return_array.push(char_array[i])

        }
    }

    return return_array
}  

module.exports = {
    typeWriter,
    delay,
    glitch_text
}