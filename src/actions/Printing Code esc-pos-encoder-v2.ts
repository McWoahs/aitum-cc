import { ICCActionInputs, ICustomCode } from "aitum.js/lib/interfaces";
import { BooleanInput, FloatInput, IntInput, StringInput } from "aitum.js/lib/inputs"; 
import { AitumCC } from "aitum.js"; 
import { DeviceType } from "aitum.js/lib/enums"; 
import { alignCenter, alignLeft, boldOff, boldOn, clearBuffer, fontA, fontB, gap, largeText, normalText, underlineAltOn, underlineOff, underlineOn } from "../types/printerTypes";
let EscPosEncoder = require("esc-pos-encoder");
var printer = require("printer/lib");
const { Image } = require("canvas");

/*********** CONFIG ***********/
// The custom code action name
const name: string = "Printing Code v2";

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
  const { userName, userMessage, userBits, userImage, userLifetimeBits } =
    inputs;

  const today = new Date().toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
  const currrentTime = new Date().toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  let img = new Image();
  img.src = userImage;

  let encoder = new EscPosEncoder();

  img.onload = function () {
    let printValue = encoder
      .initialize()
      .raw([clearBuffer])
      .raw([alignCenter])
      .line(`${today} - ${currrentTime}`)
      .line("--------------------------------------")
      .image(img, 240, 240, "atkinson")
      .line("\n-------Thanks for the bitties!-------")
      .raw([boldOn])
      .raw([largeText])
      .line(`${userName}`)
      .raw([boldOff])
      .raw([alignLeft])
      .raw([normalText])
      .line(`${userName} donated ${userBits} bits!`)
      .line(`With a lifetime total of ${userLifetimeBits} bits donated!!`)
      .line(`Let's see what they had to say O.O`)
      // each ${gap} represents 10 line breaks...
      //  creating room draw some art on the receipt...
      .line(`${userMessage} ${gap} ${gap}`)
      .raw([alignCenter])
      .line("--------------------------------------")
      // These four .newline() functions stop the POS-80C from cutting early
      .newline()
      .newline()
      .newline()
      .newline()
      .cut("partial")
      .encode();

    var printerName = "POS-80C";
    var printerFormat = "RAW";

    printer.printDirect({
      data: printValue, // or simple String: "some text"
      printer: printerName, // printer name
      type: printerFormat, // type: RAW, TEXT, PDF, JPEG, .. depends on platform
      error: (err: any) => console.log("there was an error", err),
      success: () => console.log("print successful"),
    });
  };
}
/*********** DON'T EDIT BELOW ***********/
export default { name, inputs, method } as ICustomCode;