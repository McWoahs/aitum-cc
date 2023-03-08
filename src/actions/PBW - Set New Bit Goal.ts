import { ICCActionInputs, ICustomCode } from 'aitum.js/lib/interfaces';
import { BooleanInput, FloatInput, IntInput, StringInput } from 'aitum.js/lib/inputs';
import { AitumCC, AitumJS } from 'aitum.js';
import { DeviceType } from 'aitum.js/lib/enums';
import { WebsocketService } from '../services/WebsocketService';
var fs  = require('fs');


/*********** CONFIG ***********/
// The custom code action name
const name: string = 'Set New Goal';

// The custom code inputs
const inputs: ICCActionInputs = {
  nullString: new StringInput('No Input Necessary', { required: false }),
}

// The code executed.
async function method() {
  // Get AitumCC's fixed AitumJS instance
  const lib = AitumCC.get().getAitumJS();

  // Get all global vars
  const allGlobalVars = await lib.getVariables();

  // Find a specific variable
  const bitGoal = allGlobalVars.find(v => v.name === 'Bit Goal');

  const bitCurrent = allGlobalVars.find(v => v.name === 'Current Bits');

  // Check if we actually got a var at all 
  //  !bitGoal -- adding the '!' represents "not true"
  if (!bitGoal) return;
  if (!bitCurrent) return;

  // get value of veriables
  var bitGoalNum = bitGoal.value;
  var bitCurrentNum = bitCurrent.value;

  // console log bit goal and current total
  console.log('Bit goal:', bitGoalNum);
  console.log('Bit current total:', bitCurrentNum);

  // divide current bits by bit goal and multiply by 100
  var bitPercentage = (bitCurrentNum as any) / (bitGoalNum as any) * 100;
  
  // console log result of above math as bit percentage
  console.log('Percentage of goal complete:', bitPercentage);

  // *******Write bitGoal, bitCurrent, and bitPercentage to JSON DataBase
  // create JSON object array
  var dataToBeStored = {
    "bitGoal": bitGoalNum,
    "bitCurrent": bitCurrentNum,
    "bitPercentage": bitPercentage
  }
  // stringify array and make it look pretty
  var jsonData = JSON.stringify(dataToBeStored, null, 2);

  // write json to database
  fs.writeFile('./src/db/pbwDB.json', jsonData, finished)
  function finished(err: any) {
    console.log('all set.');
  }



  // Send update to frontend via socketio
  WebsocketService.get().broadcast('bitPercentage', bitPercentage);
  WebsocketService.get().broadcast('bitGoal', bitGoalNum as any);
}



/*********** DON'T EDIT BELOW ***********/
export default { name, inputs, method } as ICustomCode;