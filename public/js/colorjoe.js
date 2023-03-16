class ColorPicker {
  constructor(root) {
    this.root = root;
    this.colorjoe = colorjoe.rgb(this.root.querySelector(".colorjoe"));
    this.selectedColor = null;
    this.colorjoe.show();
    this.setSelectedColor("#009578");
    this.socket = io("http://localhost:3000");


    // this.eventValues =  this.getSavedSettings()
    // console.log(this.eventValues)
    this.getSavedSettings = async ()  => {
      const response = await fetch('/cjdb');
      const globalVars = await response.json();
      const value = globalVars.settings;
      return value ? value : null;
    }

    async function sendEventDataToServer(settings) {
      const url = "/cjdb";
      const data = {
        settings
      }
      console.log('post', data)
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        console.log("Response from server:", response);
      } catch (error) {
        console.error(error);
      }
    }

    // progress bar radius slider listener and socket emitter
    this.radiusSlider = document.getElementById("radiusSlider");

    this.radiusSlider.addEventListener("input", async (e) => {
      const radius = e.target.value;
      console.log(radius);
      const eventValues = await this.getSavedSettings();
      eventValues.radiusSlider = radius;
      await sendEventDataToServer(eventValues);
      this.socket.emit("radiusSlider", radius);
    });

    // progress bar width slider listener and socket emitter
    this.widthSlider = document.getElementById("widthSlider");

    this.widthSlider.addEventListener("input", async (e) => {
      const width = e.target.value;
      console.log(width);
      const eventValues = await this.getSavedSettings()
      eventValues.widthSlider = width;
      await sendEventDataToServer(eventValues)
      this.socket.emit("widthSlider", width);
    });

    // progress bar outer glow blur slider listener and socket emitter
    this.blurSlider = document.getElementById("blurSlider");

    this.blurSlider.addEventListener("input", async (e) => {
      const blur = e.target.value;
      console.log(blur);
      const eventValues = await this.getSavedSettings()
      eventValues.blurSlider = blur;
      await sendEventDataToServer(eventValues)
      this.socket.emit("blurSlider", blur);
    });

    // progress bar outer glow spread slider listener and socket emitter
    this.spreadSlider = document.getElementById("spreadSlider");

    this.spreadSlider.addEventListener("input", async (e) => {
      const spread = e.target.value;
      console.log(spread);
      const eventValues = await this.getSavedSettings()
      eventValues.spreadSlider = spread;
      await sendEventDataToServer(eventValues)
      this.socket.emit("spreadSlider", spread);
    });

    // toggle text on top or bottom with radios and socket emitter
    this.textRadio = document.querySelectorAll(`input[name="text_toggle"]`);
    this.textRadio.forEach((elem) => {
      elem.addEventListener("change", async (event) => {
        let item = event.target.value;
        console.log('log radio',item);
        const eventValues = await this.getSavedSettings()
        eventValues.textRadio = item;
        await sendEventDataToServer(eventValues)
        this.socket.emit("textRadio", item);
      }); 
    });

    // toggle rage on and off with checkbox
    this.rageToggle = document.getElementById("rageCheckbox");

    this.rageToggle.addEventListener("change", async () => {
      const eventValues = await this.getSavedSettings()
      eventValues.rageToggle = this.rageToggle.checked;
      await sendEventDataToServer(eventValues)
      this.socket.emit("rageToggle", this.rageToggle.checked);
    });

    // select font for progress bar widget
    this.fontChange = document.getElementById("fontStyles");

    this.fontChange.addEventListener("change", async () => {
      console.log(this.fontChange.value)
      const eventValues = await this.getSavedSettings()
      eventValues.fontChange = this.fontChange.value;
      await sendEventDataToServer(eventValues)
      this.socket.emit("fontChange", this.fontChange.value);
    });

    this.colorjoe.on("change", (color) => {
      this.setSelectedColor(color.hex(), true);
    });


    this.init();
  }

  async init() {
    this.savedColors = await this.getSavedColors();
    console.log("server colors on load", this.savedColors)
    
    this.root.querySelectorAll(".saved-color").forEach((el, i) => {
      this.showSavedColor(el, this.savedColors[i]);
      el.addEventListener("mouseup", (e) => {
        if (e.button == 1) {
          this.saveColor(this.selectedColor, i);
          this.showSavedColor(el, this.selectedColor);
        }
        this.setSelectedColor(el.dataset.color);
      });
    });
    this.radiusSlider = document.getElementById("radiusSlider");
    this.radiusSlider.value = await this.getSavedSettingsOnLoad("radiusSlider");

    this.widthSlider = document.getElementById("widthSlider")
    this.widthSlider.value = await this.getSavedSettingsOnLoad("widthSlider");
    console.log('width on load', this.widthSlider.value)

    this.blurSlider = document.getElementById("blurSlider")
    this.blurSlider.value = await this.getSavedSettingsOnLoad("blurSlider");

    this.spreadSlider = document.getElementById("spreadSlider")
    this.spreadSlider.value = await this.getSavedSettingsOnLoad("spreadSlider");
    
    this.textRadio = document.querySelectorAll(`input[name="text_toggle"]`)
    this.textRadio.value = JSON.stringify(await this.getSavedSettingsOnLoad("textRadio"))
    console.log('radio on load', this.textRadio.value)
      if (this.textRadio.value === '"column"') {
      document.getElementById('top').checked=true
      console.log('top true')
      }else if (this.textRadio.value === '"column-reverse"'){
      document.getElementById('bot').checked=true
      console.log('bot true')
      }
      
    this.rageToggle = document.getElementById("rageCheckbox")
    this.rageToggle.value = await this.getSavedSettingsOnLoad("rageToggle")
    console.log('toggle on load', Boolean(this.rageToggle.value))
    if (Boolean(this.rageToggle.value)) {
      document.getElementById('rageCheckbox').checked=true
      console.log('rage on')
    }else{
      document.getElementById('rageCheckbox').checked=false
      console.log('rage off')
    }

    this.fontChange = document.getElementById("fontStyles")
    this.fontChange.value = await this.getSavedSettingsOnLoad("fontChange")
    console.log('font', this.fontChange.value)
    if (this.fontChange.value === '"OpenSans"') {
      document.getElementById('fontStyles').value='Open Sans'
    } else if (this.fontChange.value === '"ComicNeue"') {
      document.getElementById('fontStyles').value='Comic Neue'
    } else if (this.fontChange.value === '"Poppins"') {
      document.getElementById('fontStyles').value='Poppins'
    } else if (this.fontChange.value === '"Roboto"') {
      document.getElementById('fontStyles').value='Roboto'
    } else if (this.fontChange.value === '"Arial"') {
      document.getElementById('fontStyles').value='Arial'
    } else if (this.fontChange.value === '"Impact"') {
      document.getElementById('fontStyles').value='Impact'
    }

  }
  

  async getSavedSettingsOnLoad(variableName) {
    const response = await fetch('/cjdb');
    const globalVars = await response.json();
    const value = globalVars.settings[variableName];
    return value ? value : null;
  }

  setSelectedColor(color, skipCjUpdate = false) {
    this.selectedColor = color;
    this.root.querySelector(".selected-color-text").textContent = color;
    this.root.querySelector(".selected-color").style.background = color;

    if (!skipCjUpdate) {
      this.colorjoe.set(color);
    }
  }

  async getSavedColors() {
    const url = "/cjdb";
    try {
      const response = await fetch(url);
      const data = await response.json();
      return Object.values(data.colors || {});
      
    } catch (error) {
      console.error(error);
    }
  }



  showSavedColor(element, color) {
    element.style.background = color;
    element.dataset.color = color;
  }

  async saveColor(color, i) {
    this.savedColors[i] = color;

    const savedColorsObject = {
      colors: {}
    };
    this.savedColors.forEach((color, index) => {
      savedColorsObject.colors[`color${index}`] = color;
    });

    const url = "/cjdb";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(savedColorsObject),
      });
      console.log("savecolor response from server:", response);
      this.showSavedColor(this.root.querySelectorAll(".saved-color")[i], color);
      this.socket.emit("pbwSavedColors", savedColorsObject);
    } catch (error) {
      console.error(error);
    }
    
  }
 
}

const cp = new ColorPicker(document.querySelector(".container"));
