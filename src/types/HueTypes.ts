export interface HueTheme {
  on: boolean;
  bri?: number;
  hue?: number;
  sat?: number;
  effect?: string;
  xy?: [number, number];
  ct?: number;
  alert?: string;
  colormode?: string;
}

// get data from https://192.168.1.230/debug/clip.html
export const singleStateThemes: { [key: string]: HueTheme } = {
  white: {
    on: true,
    bri: 254,
    hue: 0,
    sat: 254,
    xy: [0.305, 0.3227],
  },
  red: {
    on: true,
    bri: 254,
    hue: 0,
    sat: 254,
    xy: [0.6906, 0.3089],
  },
  blue: {
    on: true,
    bri: 254,
    hue: 0,
    sat: 254,
    xy: [0.1533, 0.053],
  },
  purple: {
    on: true,
    bri: 254,
    hue: 0,
    sat: 254,
    xy: [0.1913, 0.0679],
  },
  pink: {
    on: true,
    bri: 254,
    hue: 0,
    sat: 254,
    xy: [0.406, 0.17],
  },
  orange: {
    on: true,
    bri: 254,
    hue: 0,
    sat: 254,
    xy: [0.5592, 0.4077],
  },
  green: {
    on: true,
    bri: 254,
    hue: 0,
    sat: 254,
    xy: [0.2535, 0.636],
  },
  aqua: {
    on: true,
    bri: 254,
    hue: 0,
    sat: 254,
    xy: [0.1588, 0.2632],
  },
  yellow: {
    on: true,
    bri: 254,
    hue: 0,
    sat: 254,
    xy: [0.4849, 0.4635],
  },
};

export const multiStateThemes: { [key: string]: { [key: string]: HueTheme } } =
  {
    default: {
      "18": {
        // Globe 2
        // Pink
        on: true,
        bri: 254,
        hue: 0,
        sat: 254,
        xy: [0.406, 0.17],
      },
      "16": {
        // Right Monitor
        // Pink
        on: true,
        bri: 254,
        hue: 0,
        sat: 254,
        xy: [0.406, 0.17],
      },
      "17": {
        // Left Monitor
        // Pink
        on: true,
        bri: 254,
        hue: 0,
        sat: 254,
        xy: [0.406, 0.17],
      },
      "12": {
        // Globe
        // Pink
        on: true,
        bri: 254,
        hue: 0,
        sat: 254,
        xy: [0.406, 0.17],
      },
    },
    multicolor: {
      "18": {
        // Globe 2
        // Yellow
        on: true,
        bri: 254,
        hue: 0,
        sat: 254,
        xy: [0.4849, 0.4635],
      },
      "16": {
        // Right Monitor
        // Green
        on: true,
        bri: 254,
        hue: 0,
        sat: 254,
        xy: [0.2535, 0.636],
      },
      "17": {
        // Left Monitor
        // Purple
        on: true,
        bri: 254,
        hue: 0,
        sat: 254,
        xy: [0.1913, 0.0679],
      },
      "12": {
        // Globe
        // Aqua
        on: true,
        bri: 254,
        hue: 0,
        sat: 254,
        xy: [0.1588, 0.2632],
      },
    },
  };
