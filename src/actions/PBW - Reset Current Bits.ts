import { ICCActionInputs, ICustomCode } from 'aitum.js/lib/interfaces';
import { BooleanInput, FloatInput, IntInput, StringInput } from 'aitum.js/lib/inputs';
import { AitumCC, AitumJS } from 'aitum.js';
import { DeviceType } from 'aitum.js/lib/enums';
import { WebsocketService } from '../services/WebsocketService';


/*********** CONFIG ***********/
// The custom code action name
const name: string = 'Reset Bit';

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
  const bitCurrent = allGlobalVars.find(v => v.name === 'Current Bits');

  // Check if we actually got a var at all 
  //  !bitGoal -- adding the '!' represents "not true"
 
  if (!bitCurrent) return;

  // get value of veriables

  var bitCurrentNum = bitCurrent.value;

  // console log bit goal and current total

  console.log('Bit current total:', bitCurrentNum);

  // set bitPercentage var to bitCurrentNum as any
  var bitPercentage = bitCurrentNum as any;

  // console log result of above math as bit percentage
  console.log('Percentage of goal complete:', bitPercentage);

  // Send update to frontend via socketio
  WebsocketService.get().broadcast('bitPercentage', bitPercentage);
}



/*********** DON'T EDIT BELOW ***********/
export default { name, inputs, method } as ICustomCode;