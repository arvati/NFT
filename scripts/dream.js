const WomboDream = require('dream-api');
const fs = require('fs').promises;
const axios = require('axios');
require('dotenv').config()

// Styles
// * 53 = analogue
// * 47 = line-art
// * 52 = HDR
// * 50 = paint
// * 49 = polygon

const styles = {
    'Analogue': 53,
    'HDR': 52,
    'Paint': 50,
    'Polygon': 49,
    'Line-Art': 47,
  };

function getRandomProperty(obj, frequency = 1) {
    const keys = Object.keys(obj);
    frequency = frequency > keys.length ? keys.length : frequency
    let selected = '';
    while ( frequency > 0 ) {
        const key = keys[Math.floor(Math.random() * keys.length)];
        selected += obj[key]
        --frequency;
        keys.splice(keys.indexOf(key), 1)
    }
    return selected;
};

const words = {
    caboclo: 'native south american indigene amazon brazil african ',
    powerfull: 'chief warrior power ',
    nude: 'naked muscle ',
    priest: 'dancing priest religious pagé ',
    weapons: 'axe arrow bowl ',
    place: 'riverside forest plants ',
    people: 'tribe ',
    sky: 'sky lightning fire '
}

const style = getRandomProperty(styles, 1);
const { caboclo, ...lastwords } = words;
const prompt = words.caboclo + getRandomProperty(lastwords, 6);
const foldername = 'public/images/'

WomboDream.signIn(process.env.WOMBO_USER, process.env.WOMBO_KEY).then(token => {
    WomboDream.generateImage(style, prompt, token.idToken, null, null, true, { "name": "Dream Api Generated Picture", "public": true, "visible": false },
        function (parcial) {
            fs.writeFile(foldername + parcial.id + '-parcial.json', JSON.stringify(parcial), 'utf8').then( () => {
            }).catch(er => {
                console.log(er);
            });
        } , 100, 28).then(image => {
        console.log('style: ' + image.input_spec.style);
        console.log('prompt: ' + image.input_spec.prompt);
        console.log('id: ' + image.id);
        console.log('state: ' + image.state)
        fs.writeFile(foldername + image.id + '-final.json', JSON.stringify(image), 'utf8').then( () => {
        }).catch(er => {
            console.log(er);
        });
        axios.get(image.photo_url_list.slice(-1)[0],{ responseType: 'arraybuffer' }).then( response => {
            fs.writeFile(foldername + image.id + '-final.jpg', Buffer.from(response.data, 'utf-8')).then( () => {
            }).catch(er => {
                console.log(er);
            });
        }).catch(er => {
            console.log(er);
        });
        image.photo_url_list.splice(-1)
        image.photo_url_list.map( (imageurl, counter) => {
            axios.get(imageurl,{ responseType: 'arraybuffer' }).then( response => {
                fs.writeFile(foldername + image.id + '-' + counter + '.jpg', Buffer.from(response.data, 'utf-8')).then( () => {
                }).catch(er => {
                    console.log(er);
                });
            }).catch(er => {
                console.log(er);
            });
        });
    });
});


// WomboDream.signIn("email@email.com", "password").then(token => {
//     WomboDream.generateImage(1, "dog", token.idToken, null, null, true, { "name": "", "public": false, "visible": false }).then(image => {
      
//     });
//   });

