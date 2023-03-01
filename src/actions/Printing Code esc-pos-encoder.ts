import { ICCActionInputs, ICustomCode } from "aitum.js/lib/interfaces";
import {
  BooleanInput,
  FloatInput,
  IntInput,
  StringInput,
} from "aitum.js/lib/inputs";
import { AitumCC } from "aitum.js";
import { DeviceType } from "aitum.js/lib/enums";
import { gap } from "../types/printerTypes";
let EscPosEncoder = require("esc-pos-encoder");
var printer = require("printer/lib");
// const { Image } = require('canvas')


/*********** CONFIG ***********/
// The custom code action name
const name: string = "Printing Code esc-pos-encoder";

// The custom code inputs
const inputs: ICCActionInputs = {
  userName: new StringInput("User Name", { required: false }),
  userMessage: new StringInput("User Message", { required: false }),
  userImage: new StringInput("User Profile Image", { required: false }),
  userBits: new IntInput("User Bits", { required: false }),
  userLifetimeBits: new IntInput("User Lifetime Bits", { required: false }),
};

// The code executed.
async function method(inputs: {
  [key: string]: number | string | boolean | string[];
}) {
  const lib = AitumCC.get().getAitumJS();

  const aitumDevice = (await lib.getDevices(DeviceType.AITUM))[0];
  const {userName, userMessage, userBits, userImage, userLifetimeBits} = inputs;
  const today = new Date().toLocaleDateString(undefined, {
    day: '2-digit', 
    month: '2-digit',
    year: '2-digit',
});
  const currrentTime = new Date().toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });


//   let img = new Image();
//   img.src = `${userImage}`;

//   img.onload = function() {
//     let result = encoder
//         .image(img, 320, 320, 'atkinson')
//         .encode()
// };
  
  let encoder = new EscPosEncoder();

  let printValue = encoder
    .codepage('cp437')
    //.image(img, 320, 320, 'atkinson')
    .line(`${today} - ${currrentTime}`)
    .bold()
    .line(`${userName}`)
    .bold()
    .line(`Donated ${userBits} bits, they have donated a total of ${userLifetimeBits} bits!!`)
    .newline()

    .line(`They said:`)
    .line(`${userMessage} ${gap} ${gap} ${gap}`)
    .cut('partial')
    .encode();

  // this is a string representation
  const result = Buffer.from(printValue.buffer).toString();

  console.log(
    "default printer name: " +
      (printer.getDefaultPrinterName() || "is not defined on your computer")
  );
 
  console.log('try to print file: ' + result);

    
    var printerName = 'POS-80C';
    var printerFormat = 'RAW';

printer.printDirect({
    data:printValue, // or simple String: "some text"
	printer:printerName, // printer name
	type: printerFormat, // type: RAW, TEXT, PDF, JPEG, .. depends on platform
    
});	
}
/*********** DON'T EDIT BELOW ***********/
export default { name, inputs, method } as ICustomCode;
