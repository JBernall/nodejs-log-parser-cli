const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function processLogsByStream() {
  const inputPath = path.join(__dirname, 'app.log');
  const outputPath = path.join(__dirname, `streamed_errors_${Date.now()}.txt`);

  console.log('🚀 Starting stream processing...');

  try {
    // 1. Create the Streams
    const fileStream = fs.createReadStream(inputPath);

    // Handle file not found error on the stream itself
    fileStream.on('error', (err) => {
        if (err.code === 'ENOENT') {
            console.error('❌ Error: Input file app.log not found!');
            process.exit(1);
        } else {
            throw err;
        }
    });
    
    // 2. Setup Readline
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    // 3. Create Write Stream
    const outputStream = fs.createWriteStream(outputPath);

    let errorCount = 0;

    // 4. Process line by line
    for await (const line of rl) {
      // FIXED 1: Simple string check. No .filter() needed here.
      // Note: We use [ERROR] to be precise, as 'Error' might appear in normal text.
      if (line.includes('[ERROR]')) {
          
          // FIXED 2: Write to the stream. 
          // We must manually add '\n' because readline removes it.
          outputStream.write(line + '\n');
          
          // FIXED 3: Increment only when we find an error
          errorCount++;
      }
    }

    console.log(`✅ Finished! Found ${errorCount} errors.`);
    console.log(`📂 Output saved to: ${outputPath}`);

  } catch (err) {
      console.error('🔥 Critical Failure:', err);
  }
}

processLogsByStream();