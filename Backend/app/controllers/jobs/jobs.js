const schedule = require('node-schedule');
const fs = require("fs");
const { exec } = require('child_process');
const axios = require('axios').default;
const csv = require('csv-parser')

// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

let clusteringJob = schedule.scheduleJob("* */5 * * *", async function () {
    // java -Xmx1g -jar jSymbolic2.jar -configrun <ConfigurationFilePath> -csv <SymbolicMusicFileOrDirectoryInputPath> <AceXmlFeatureValuesOutputPath> <AceXmlFeatureDefinitionsOutputPath>
    let extractMidiFeatures = "java -Xmx1g -jar ./clustering/jSymbolic2/dist/jSymbolic2.jar -configrun ./clustering/jSymbolic2/dist/config.txt ./uploads/midi/ ./clustering/extracted_feature_values.xml ./clustering/feature_definitions.xml";

	console.log("==================================================");
	console.log("Running: " + extractMidiFeatures);
	exec(extractMidiFeatures, (error, stdout, stderr) => {
		console.log(stdout)
		if (error) {
			console.log("Error while extracting features!");
			console.log(`error: ${error.message}`);
			return;
		}

        console.log("Midi features successfully extracted!");

        console.log("Running: kmeans");
        exec("python3 ./clustering/kmeans.py", (error, stdout, stderr) => {
            console.log(stdout)
            if (error) {
                console.log("Error while generating clusters!");
                console.log(`error: ${error.message}`);
                return;
            }
            console.log("Clusters successfully generated!");
            console.log("==================================================");
            
            let results = [];
            fs.createReadStream('./clustering/predict.csv')
            .pipe(csv({ separator: ',' }))
            .on('data', (data) => results.push(data))
            .on('end', () => {
                // console.log(results);
                axios.post("http://localhost:3000/sendClusters", {"clusters":results}).then().catch(function(error){
                    console.log("Error on axios!");
                    console.log(error);
                });
            });
        });	
	});
});