const axios = require('axios');
const fs = require('fs');
const path = require('path');


const TOKEN = fs.readFileSync(path.join(__dirname, '../token.txt'), 'utf8').trim();


const { Log } = require('../logging_middleware/index');

const headers = { Authorization: `Bearer ${TOKEN}` };


function knapsack(vehicles, capacity) {
  const n = vehicles.length;
  const dp = new Array(capacity + 1).fill(0);
  
  for (let i = 0; i < n; i++) {
    const duration = vehicles[i].Duration;
    const impact = vehicles[i].Impact;
    

    for (let w = capacity; w >= duration; w--) {
      dp[w] = Math.max(dp[w], dp[w - duration] + impact);
    }
  }
  

  let w = capacity;
  const selected = [];
  for (let i = n - 1; i >= 0; i--) {
    const duration = vehicles[i].Duration;
    const impact = vehicles[i].Impact;
    if (w >= duration && dp[w] === dp[w - duration] + impact) {
      selected.push(vehicles[i].TaskID);
      w -= duration;
    }
  }
  
  return {
    maxImpact: dp[capacity],
    selectedTasks: selected
  };
}

async function main() {
  try {

    await Log("backend", "info", "service", "Fetching depots from evaluation service");
    const depotsResponse = await axios.get(
      'http://20.207.122.201/evaluation-service/depots',
      { headers }
    );
    const depots = depotsResponse.data.depots;
    await Log("backend", "info", "service", `Successfully fetched ${depots.length} depots`);
    console.log("Depots fetched:", depots.length);


    await Log("backend", "info", "service", "Fetching vehicles from evaluation service");
    const vehiclesResponse = await axios.get(
      'http://20.207.122.201/evaluation-service/vehicles',
      { headers }
    );
    const vehicles = vehiclesResponse.data.vehicles;
    await Log("backend", "info", "service", `Successfully fetched ${vehicles.length} vehicles`);
    console.log("Vehicles fetched:", vehicles.length);


    const results = [];
    for (const depot of depots) {
      await Log("backend", "info", "domain", `Knapsack depot ${depot.ID} budget ${depot.MechanicHours}hrs`);
      
      const result = knapsack(vehicles, depot.MechanicHours);
      
      await Log("backend", "info", "domain", `Depot ${depot.ID} max impact score is ${result.maxImpact}`);
      
      results.push({
        depotID: depot.ID,
        mechanicHours: depot.MechanicHours,
        maxImpact: result.maxImpact,
        selectedTasks: result.selectedTasks,
        totalTasksSelected: result.selectedTasks.length
      });

      console.log(`\nDepot ${depot.ID} (Budget: ${depot.MechanicHours} hours)`);
      console.log(`Max Impact: ${result.maxImpact}`);
      console.log(`Selected Tasks (${result.selectedTasks.length}):`, result.selectedTasks);
    }


    fs.writeFileSync(
      path.join(__dirname, 'results.json'),
      JSON.stringify(results, null, 2)
    );
    await Log("backend", "info", "service", "Vehicle scheduling completed and results saved");
    console.log("\nResults saved to results.json");

  } catch (error) {
    await Log("backend", "error", "handler", `Vehicle scheduler failed: ${error.message}`);
    console.error("Error:", error.response?.data || error.message);
  }
}

main();