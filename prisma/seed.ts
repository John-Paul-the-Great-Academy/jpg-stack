import { db } from "../app/models/db.server";
import { main } from "../app/util/dbLoader.server";

// get list of tables to load

// cycle through the tables
const runLoaders = async () => {
  await main();
  // for (let type of dbLoader.loaders) {
  //   console.log(`Loading table: ${type}`);
  //   const res = await dbLoader.runLoaded<any>(type);
  //   console.log(`Table '${type}' loaded.`);
  //   console.log(`\t${res.length} entries loaded`);
  //   console.log("\n");
  // }
};

runLoaders();
