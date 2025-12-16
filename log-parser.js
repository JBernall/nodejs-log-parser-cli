const fs = require('fs/promises');
const path = require('path');
async function parseLogs(){
    const inputPath = path.join(__dirname,'app.log');
   try
{    console.log('Reading log file');
    const fileContent = await fs.readFile(inputPath,'utf-8');
    const lines = fileContent.split('\n');
    const errorLines = lines.filter(line => line.includes('Error'));
    if(errorLines.legnth === 0){
        console.log('No error found congrats!');
        return
    }
    const filename = `Error_report_${Date.now()}.txt`;
    await fs.writeFile(filename, errorLines.join('\n'));
    console.log(`Report generated succesfully ${filename}`);}
catch (error){
    console.error(`Error found, please check that`, error.message)
}};
parseLogs()
