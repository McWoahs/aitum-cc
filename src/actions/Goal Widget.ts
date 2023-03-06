import { ICCActionInputs, ICustomCode } from 'aitum.js/lib/interfaces';
import { BooleanInput, FloatInput, IntInput, StringInput } from 'aitum.js/lib/inputs';
import { AitumCC } from 'aitum.js';
import { DeviceType } from 'aitum.js/lib/enums';
import { WebsocketService } from '../services/WebsocketService';

/*********** CONFIG ***********/
// The custom code action name
const name: string = 'Progress Bar';

// The custom code inputs
const inputs: ICCActionInputs = {
  testStringInput: new StringInput('What is your name?', { required: false }),
}

// The code executed.
async function method(inputs: { [key: string]: number | string | boolean | string[] }) {
  WebsocketService.get().broadcast('test', inputs);
}

/*********** DON'T EDIT BELOW ***********/
export default { name, inputs, method } as ICustomCode;