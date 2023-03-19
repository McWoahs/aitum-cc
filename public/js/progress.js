// ******Initalize page on load with saved data

// fucntion to get specified global variable | await getStoredGlobalValue('Current Bits')
async function getStoredGlobalValue(variableName) {
  const response = await fetch('http://localhost:7777/aitum/state');
  const globalVars = await response.json();
  const findVar = await globalVars.data.find(v => v.name === variableName);
  return findVar ? findVar.value : null
}

// ******** Combine these into one function **********
//function to get stored colors
async function getStoredColorValue(variableName) {
  const response = await fetch('/cjdb');
  const globalVars = await response.json();
  const value = globalVars.colors[variableName];
  return value ? value : null;
}

// function to get saved settings
async function getSavedSettingsOnLoad(variableName) {
  const response = await fetch('/cjdb');
  const globalVars = await response.json();
  const value = globalVars.settings[variableName];
  return value ? value : null;
}
// ******** Combine these into one function **********

// do math for bit percentage (current bits / bit goal ) x 100 = x%
// create variables from getStoredGlobalValue function before doing math (because chat knows best prectices <3)
const curBit = await getStoredGlobalValue('Current Bits');
const bitGo = await getStoredGlobalValue('Bit Goal');
// do the maths!
const bitPercentage = (curBit / bitGo) * 100;

// push stored bit goal to html div
document.querySelector(".goalTotal").insertAdjacentText('beforeend', `${await (getStoredGlobalValue('Bit Goal'))}`);

// push stored bit percentage to html div
document.querySelector(".percentage").innerHTML = `${Math.round(bitPercentage)}%`;

// set css variables function
function setCssVariable(name, value) {
  const root = document.querySelector(":root");
  root.style.setProperty(`--${name}`, value);
}

// push stored bit percentage to css 
setCssVariable("progress", `${bitPercentage}%`);
//progress bar background gradient colors setting from database
setCssVariable("color0", await getStoredColorValue("color0"));
setCssVariable("color1", await getStoredColorValue("color1"));
// progress bar forground gradient colors setting from database
setCssVariable("color2", await getStoredColorValue("color2"));
setCssVariable("color3", await getStoredColorValue("color3"));
// progress bar bow shadow color setting from database
setCssVariable("color4", await getStoredColorValue("color4"));
// corner radius setting from database
setCssVariable('radius', await getSavedSettingsOnLoad('radiusSlider') + 'px');
// width setting from database
setCssVariable('width', await getSavedSettingsOnLoad('widthSlider') + 'em');
// blur setting from database
setCssVariable('blur', await getSavedSettingsOnLoad('blurSlider') + 'px');
// spread setting from database
setCssVariable('spread', await getSavedSettingsOnLoad('spreadSlider') + 'px');
// text position setting from database
setCssVariable('text-position', await getSavedSettingsOnLoad('textRadio'));
// rage toggle setting from database
if (await getSavedSettingsOnLoad('rageToggle') === true) {
  setCssVariable('rageDisplay', 'inline-flex')
} else {
  setCssVariable('rageDisplay', 'none')
}
// font family setting from database
setCssVariable('fontFamily', '"' + await getSavedSettingsOnLoad('fontChange') + '"');




// log goal, bits, percent
console.log('Stored Goal:', await getStoredGlobalValue('Bit Goal'));
console.log('Stored Current Bits:', await getStoredGlobalValue('Current Bits'));
console.log('Stored Percentage:', bitPercentage);

if(bitPercentage >= 90){
  const rage = 1;
  setCssVariable("dur", `${rage}s`);
  console.log('Rage Bool:', rage);
}else{
  const rage = 0;
  setCssVariable("dur", `${rage}s`);
  console.log('Rage Bool:', rage);
}

document.querySelector('.wrapper').classList.toggle('show')

// *******adjust page dynamically via socket io
const socket = io('http://localhost:3000')
        // confirm connection
        socket.on('connection', console.log('Connected to the server'));
        const r = document.querySelector(':root');
        // receiving bit percentage from backend
        socket.on('bitPercentage', bitPercentage => {
          // value of vairable passed from backaend
          console.log('Percentage of goal complete:', bitPercentage);
          //  selecting :root to get css veriables
          const r = document.querySelector(':root');

          // log old percentage
          const rs = getComputedStyle(r);
          console.log("Old percentage: " + rs.getPropertyValue('--progress'));

          //set progress bar percentage in text and css / log new percentage
          r.style.setProperty('--progress', `${bitPercentage}%`);
          console.log("New percentage:" + rs.getPropertyValue('--progress'));
          document.querySelector(".percentage").innerHTML = `${Math.round(bitPercentage)}%`;
          
          //check percentage for rage emoji ( < 90 no rage | > 90 rage )
          if(bitPercentage >= 90){
            const rage = 1;
            const rs = getComputedStyle(r);
            r.style.setProperty('--dur', `${rage}s`);
            console.log(rage);
          }else{
            const rage = 0;
            const rs = getComputedStyle(r);
            r.style.setProperty('--dur', `${rage}s`);
            console.log(rage);
          }

        })

        //set the bit goal text (clear before updating with new value)
        socket.on('bitGoal', async bitGoal => {
          async function clearGoal() {
          document.querySelector(".goalTotal").innerHTML = 'Bit Goal:';
          }
          clearGoal();
          document.querySelector(".goalTotal").insertAdjacentText('beforeend', `${bitGoal}`);
          console.log("This is the bitGoal:", bitGoal.toString());
        })

        socket.on("pbwSavedColors", (colors) => {
          const color0 = colors.colors.color0;
          const color1 = colors.colors.color1;
          const color2 = colors.colors.color2;
          const color3 = colors.colors.color3;
          const color4 = colors.colors.color4;
          console.log('Color0 is:', color0);
          console.log('Color1 is:', color1);
          r.style.setProperty('--color0', color0);
          r.style.setProperty('--color1', color1);
          r.style.setProperty('--color2', color2);
          r.style.setProperty('--color3', color3);
          r.style.setProperty('--color4', color4);
        });

        socket.on("radiusSlider", (slider) => {
          r.style.setProperty('--radius', slider + "px");
        });

        socket.on("widthSlider", (slider) => {
          r.style.setProperty('--width', slider + "em");
        });

        socket.on("blurSlider", (slider) => {
          r.style.setProperty('--blur', slider + "px");
        });

        socket.on("spreadSlider", (slider) => {
          r.style.setProperty('--spread', slider + "px");
        });

        socket.on("textRadio", (radio) => {
          r.style.setProperty('--text-position', radio);
        });

        socket.on("rageToggle", (checkbox) => {
          if (checkbox === true) {
          r.style.setProperty('--rageDisplay', 'inline-flex')
          } else {
          r.style.setProperty('--rageDisplay', 'none')
          }
        });

        socket.on("fontChange", (font) => {
          r.style.setProperty('--fontFamily', `"${font}"`)
        });


