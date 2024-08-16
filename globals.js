/* MIT License

Copyright (c) 2024 Bhavya Jain, Austin Lu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

// These represent the main and magnifier canvases we draw on
const CANVAS = document.getElementById('canvas'); // The main canvas
const MAG_DIV_LIST = [document.getElementById('mag_viewer_1'), document.getElementById('mag_viewer_2'), document.getElementById('mag_viewer_3')]; // This includes the labels associated with each magnifier
const MAG_CANVAS_LIST = [document.getElementById('mag_canvas_1'), document.getElementById('mag_canvas_2'), document.getElementById('mag_canvas_3')]; // This refers to just the magnifier canvas
const CTX = CANVAS.getContext('2d', { willReadFrequently: true }); // Canvas contexts are used to draw on and read from

// Style values
let BACKGROUND_COLOR = '#FFFFFF';
let WALL_COLOR = '#FFA914';
let PART_COLOR = '#FF0000';
let PHOTON_HEAD_COLOR = '#E1FF00';
let PHOTON_TAIL_COLOR = '#00FFB3';
let MAG_COLOR = '#0000FF';
let LIGHT_SOURCE_COLOR = '#FF0000';
let MAG_POINT_COLOR = '#0000FF'

let SHOW_PART = true;
let PHOTON_RADIUS = 10/(Math.sqrt(2)); // Distance away from source
let ANGLE = 0;
let NUMBER_LIGHT_RAYS = 360;
const RENDER_INTERVAL_TIME = 33;
let SPEED_TIMES_TEN = 5;
let HEAD_SIZE = 1.25;
let TAIL_SIZE = 0.45;
let MAG_HEAD_SIZE = 2.50;
let MAG_TAIL_SIZE = 0.90;
let TRIANGLE_SIDE = 100;
let CORNER_EPS = 0.01; // Radius of the epsilon ball around each corner for collision detection

let TRIANGLES = [];
let SELECTED_TRIANGLES = [];
let BOUNDARIES = [];
let PARTITIONS = [];
let COORDS = [];
var PHOTONS = [];
var RENDER_INTERVAL;

let VIDEO = new Whammy.Video(33);
let MAG_VIDEO = [new Whammy.Video(33), new Whammy.Video(33), new Whammy.Video(33)];
var CURRENTLY_RECORDING = false;
var RECORDING = document.getElementById('recording');
let MAG_RECORDING = [document.getElementById('recordingM1'), document.getElementById('recordingM2'), document.getElementById('recordingM3')];
var DOWNLOAD_BUTTON = document.getElementById('downloadButton');
let MAG_DOWNLOAD_BUTTON = [document.getElementById('downloadButtonM1'), document.getElementById('downloadButtonM2'), document.getElementById('downloadButtonM3')];
var STATUS_ELEMENT = document.getElementById('status');
var NUM_CAPTURED_FRAMES = 0;

let SCREEN_ZOOM = 0.97 * (window.innerWidth / 1850);

let lightSource = { x: 500, y: 400 };

const angleDiv = document.getElementById('angleDiv');
const rayDiv = document.getElementById('rayDiv');
const angleRadio = document.getElementById('customAngle');
const rayRadio = document.getElementById('multipleRay');