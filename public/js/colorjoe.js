class ColorPicker {
  constructor(root) {
    this.root = root;
    this.colorjoe = colorjoe.rgb(this.root.querySelector(".colorjoe"));
    this.selectedColor = null;
    this.colorjoe.show();
    this.setSelectedColor("#009578");
    this.socket = io('http://localhost:3000');


    this.slider = document.getElementById("slider");
    
    this.slider.addEventListener("input", (e) => {
        const slider = e.target.value
        console.log(slider)
        this.socket.emit('radiusSlider', slider)
    });

    this.colorjoe.on("change", (color) => {
      this.setSelectedColor(color.hex(), true);
    });

    this.init();
  }

  async init() {
    this.savedColors = await this.getSavedColors();

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
      console.log("saved colors from server:", data);
      return Object.values(data || {});
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
    
    const savedColorsObject = {};
    this.savedColors.forEach((color, index) => {
      savedColorsObject[`color${index}`] = color;
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
      this.socket.emit('pbwSavedColors', savedColorsObject)
    } catch (error) {
      console.error(error);
    }
  }


}

const cp = new ColorPicker(document.querySelector(".container"));