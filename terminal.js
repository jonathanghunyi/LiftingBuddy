//program from the terminal
const readline = require('readline');
const { OpenAI } = require('openai');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});


const openai = new OpenAI({ apiKey: process.env.API_KEY });


const getResponse = async (time, equipment, muscle_group) => {
    const prompt = `Give me a workout that takes "${time}" , and I have access to "${equipment}", and I want to target "${muscle_group}`;
    const response = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: 'gpt-3.5-turbo',
        max_tokens: 150
      });
      return response.choices[0].message;
    };


//used for command line
const getTime = () => {
return new Promise((resolve, reject) => {
rl.question('How much time do you have to workout?\n', (answer) => {
resolve(answer)
})})
}


const getEquipment = () => {
return new Promise((resolve, reject) => {
rl.question('What equipment do you have access to?\n', (answer) => {
resolve(answer)
})
})
}


const getMuscleGroup = () => {
    return new Promise((resolve, reject) => {
    rl.question('What muscle group do you wish to target?\n', (answer) => {
    resolve(answer)
    })
    })
    }


const run = async() => {
const time = await getTime()
const equipment = await getEquipment()
const muscle_group = await getMuscleGroup()
rl.close()
const response = await getResponse(time, equipment, muscle_group);
console.log(response)
}
run()