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

function getRandomProperty(obj) {
    const keys = Object.keys(obj);
    const key = keys[Math.floor(Math.random() * keys.length)];
    return obj[key]
  }

const style = getRandomProperty(styles)
const prompt = 'dancing american south indigene native amazon brazil african forest riverside plants chief warrior axe arrow bowl power muscle tribe religious pagé priest lightning fire sky'

WomboDream.signIn(process.env.WOMBO_USER, process.env.WOMBO_KEY).then(token => {
    WomboDream.generateImage(style, prompt, token.idToken, null, null, true ).then(image => {
        console.log('style: ' + image.input_spec.style);
        console.log('prompt: ' + image.input_spec.prompt);
        console.log('id: ' + image.id);
        const filename = 'public/images/' + image.id
        if (image.state === 'completed') {
            axios.get(image.result.final,{ responseType: 'arraybuffer' }).then( response => {
                fs.writeFile(filename + '.jpg', Buffer.from(response.data, 'utf-8')).then( () => {
                    fs.writeFile(filename + '.json', JSON.stringify(image), 'utf8').then( () => {
                    }).catch(er => {
                        console.log(er);
                    });
                }).catch(er => {
                    console.log(er);
                });
            }).catch(er => {
                console.log(er);
            });
        }
    });
});


// WomboDream.signIn("email@email.com", "password").then(token => {
//     WomboDream.generateImage(1, "dog", token.idToken, null, null, true, { "name": "", "public": false, "visible": false }).then(image => {
      
//     });
//   });

