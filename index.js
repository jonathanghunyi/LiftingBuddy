const { OpenAI } = require('openai');
const express = require('express');
const bodyParser = require('body-parser');
//import statements to read from terminal
// const readline = require('readline');

// const rl = readline.createInterface({
// input: process.stdin,
// output: process.stdout
// });


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('styles'));

//initialize object for openai and access API KEY
const openai = new OpenAI({ apiKey: process.env.API_KEY });

//function to call openai and return generated workout
const getResponse = async (time, equipment, muscle_group) => {
    const prompt = `Give me a workout that takes "${time}" , and I have access to "${equipment}", and I want to target "${muscle_group}`;
    const response = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: 'gpt-3.5-turbo',
        max_tokens: 1000
      });
    return response.choices[0].message.content;
};
//title and set up for user input screen
const title = '<head><link rel="stylesheet" href="styles.css"><title>Lifting Buddy</title></head>'
app.get('/', (request, response) => {
    response.send(`
      <html>
        ${title}
        <body>
          <h1>Lifting Buddy</h1>
          <form method="POST" action='/WorkoutGenerator'>
  
            <label for="time">How much time do you have to workout?</label>
            <input type="text" id="time" name="time"><br>

            <label for="equipment">What equipment do you have access to?</label>
            <input type="text" id="equipment" name="equipment"><br>

            <label for="muscle">What muscle group do you wish to target?</label>
            <input type="text" id="muscle" name="muscle"><br>
  
            <input type="submit" value="Generate Workout">
          </form>
        </body>
      </html>
    `);
  });

//workout generated screen after user input
app.post('/WorkoutGenerator', async (request, response) => {
    const time = request.body.time;
    const equipment = request.body.equipment;
    const muscle = request.body.muscle;
      
    const openai_response = await getResponse(time, equipment, muscle);
    response.send(output(openai_response.replace('\n','</br><br>')));
    });
//formatting the output
const output = (response) => {
  return `<html>
            ${title}
            <body>
            <h1> Lifting Buddy </h1>
            <h2>Workout Generated: </h2>
            <p>${response}</p>
            </body>
            </html>`
}

//start app
app.listen(port, () => {
    console.log(`Go to http://localhost:3000/`);
  });

//used for command line 
// const getTime = () => {
// return new Promise((resolve, reject) => {
// rl.question('How much time do you have to workout?\n', (answer) => {
// resolve(answer)
// })})
// }

// const getEquipment = () => {
// return new Promise((resolve, reject) => {
// rl.question('What equipment do you have access to?\n', (answer) => {
// resolve(answer)
// })
// })
// }

// const getMuscleGroup = () => {
//     return new Promise((resolve, reject) => {
//     rl.question('What muscle group do you wish to target?\n', (answer) => {
//     resolve(answer)
//     })
//     })
//     }

// const run = async() => {
// const time = await getTime()
// const equipment = await getEquipment()
// const muscle_group = await getMuscleGroup()
// rl.close()
// const response = await getResponse(time, equipment, muscle_group);
// console.log(response)
// }
// run()