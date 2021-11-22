const CELL_SIZE = 32;
const SPRITE_SIZE = 16;
const ITEMS_SIZE_SM = CELL_SIZE / 2;
const ITEMS_SIZE_BG = CELL_SIZE;
const ICONS_SIZE = CELL_SIZE / 2;
const EDITOR_CELL_SIZE = 16;

const TILESET = new Image();
// TILESET.src = "src/media/colored_tilemap_packed.png";
TILESET.src = "src/media/tileset.png";
TILESET.src = "src/media/RoguelikeAllSpriteSheetAlpha.png";

const SM_FONT = "bold 10pt monospace";
const MD_FONT = "bold 12pt monospace";
const BG_FONT = "bold 16pt monospace";

const COLORS = {
    BACKGROUND: "BLACK",
    BROWN: "#3e2723",
    GOLD: "#FFE228",
    GRAY: "#eceff1",
    BLUE: "#5DE0E2",
    GOOD: "lime",
    BAD: "#ff5722",
    WHEAT: "wheat"
}

// const SPRITES = {
//     KEY: [16, 9],
//     BOX: [16, 4],
//     COIN: [16, 7],
//     HEART: [17, 7],
//     SWORD: [16, 8],
//     HELMET: [17, 8],
//     CROWN: [17, 9],
//     MEAT: [18, 7],
//     ORE: [18, 8],
//     CHEST: [6, 5],
//     GOLDEN_CHEST: [7, 5],
//     ORE_MINE: [4, 7],
//     CRYSTALL: [18, 9],
//     CRYSTALL_MINE: [6, 7],
//     GOLD_MINE: [5, 7],
//     HOUSE_01: [12, 9],
//     TOMB_01: [4, 3],
//     ROGUE: [2, 6],
//     PR_SWORD: [17, 5],
//     PR_ARROW: [16, 5],
//     PR_SPEAR: [18, 5],
//     SIGN_01: [4, 4],
//     SIGN_02: [5, 4],
//     PEASANT: [3, 10],
//     SKELETON: [2, 9],
//     ORC: [2, 5],
//     I_SWORD_01: [19, 18],
//     I_ARMOR_01: [18, 17]
// }
const SPRITES = {
    KEY: [24, 11],
    BOX: [1, 2],
    COIN: [24, 14],
    HEART: [25, 12],
    SWORD: [21, 3],
    HELMET: [12, 17],
    CROWN: [26, 2],
    MEAT: [25, 13],
    ORE: [10, 16],
    CHEST: [11, 12],
    GOLDEN_CHEST: [10, 12],
    ORE_MINE: [2, 29],
    CRYSTALL: [24, 13],
    CRYSTALL_MINE: [3, 29],
    GOLD_MINE: [1, 29],
    HOUSE_01: [2, 3],
    TOMB_01: [4, 3],
    ROGUE: [17, 22],
    PR_SWORD: [20, 3],
    PR_ARROW: [19, 6],
    PR_SPEAR: [20, 3],
    SIGN_01: [4, 2],
    SIGN_02: [5, 2],
    PEASANT: [17, 21],
    SKELETON: [17, 12],
    ORC: [17, 7],
    I_SWORD_01: [21, 3],
    I_ARMOR_01: [24, 3]
}

const DEFAULT_SIGHT = CELL_SIZE * 4;

let mouse = {
    pos: [0, 0],
    lastPos: [0, 0],
    startPos: [0, 0]
}

let controller = {
    mouse: false,
    up: false,
    right: false,
    down: false,
    left: false,
    use: false,
    dragMap: false,
    dragCreature: null
}

// LEVEL EDITOR
let editor = {
    'enabled': false,
    'mode': 'draw',
    'drawLayer': 0,
    'drawAnimate': 0,
    'viewMode': true,
    'eraserMode': false,
    'pos': [0, 0],
    'sprite': [1, 2]
}

// DEBUG
let AI = 1;
let DEBUG = 1;

// Loading objects
let world = localStorage.getItem("world");
if (world) {
    world = JSON.parse(world);
} else {
    world = {
        'player': {
            'faction': 'ally',
            'gold': 0,
            'keys': 0,
            'crystalls': 0
        },
        'sprites': [
            {
                'pos': [0, 0],
                'sprite': [1, 2],
                'size': CELL_SIZE,
                'layer': 0
            }
        ],
        'creatures': [],
        'projectiles': [],
        'blocks': [],
        'splashes': [],
        'items': [],
        'stores': [ ]
    }
}
// str = '{"player":{"faction":"ally","gold":0,"keys":0,"crystalls":0,"king":{"type":"creature","pos":[488.2752804606398,-166.7251185918365],"sprite":[17,21],"healthSprite":[12,17],"size":32,"sizeScaleLimit":1000,"speed":2,"hp":1,"attack":[30,30],"attackRepeat":0,"attackRepeatMulti":10000,"attackDamage":0,"attackRange":38.4,"attackPower":-1,"attackType":"melee","attackSprite":[20,3],"attackRotation":true,"faction":"ally","king":true,"enemyFactions":["evil","orcs","mine"],"color":"#cddc39","startPos":[0,160],"boxAnimation":40.2000000000003,"moveAnimation":655.3636515790307,"kingAnimation":660.7895226115993}},"sprites":[{"pos":[-96,-64],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[-64,-64],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[-32,-64],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[32,-64],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[64,-64],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[96,-64],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[-128,-64],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[-160,-96],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[-160,-128],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[-192,-128],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[-192,-160],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[-224,-192],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[-224,-224],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[-224,-256],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[-32,-384],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[-64,-384],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[-96,-384],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[-128,-384],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[-128,-352],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[-160,-352],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[-192,-352],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[-192,-320],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[-224,-320],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[-224,-288],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[0,-384],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[32,-416],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[64,-416],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[128,-96],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[128,-128],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[128,-160],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[128,-192],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[128,-224],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[128,-256],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[160,-256],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[192,-256],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[224,-256],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[256,-256],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[288,-288],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[320,-288],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[320,-320],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[320,-352],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[288,-384],"sprite":[9,5],"size":32,"layer":0,"animation":null},{"pos":[0,-64],"sprite":[5,31],"size":32,"layer":0,"animation":null},{"pos":[0,-96],"sprite":[5,31],"size":32,"layer":0,"animation":null},{"pos":[-32,-160],"sprite":[5,31],"size":32,"layer":0,"animation":null},{"pos":[-64,-192],"sprite":[5,31],"size":32,"layer":0,"animation":null},{"pos":[-64,-160],"sprite":[5,31],"size":32,"layer":0,"animation":null},{"pos":[-32,-288],"sprite":[5,31],"size":32,"layer":0,"animation":null},{"pos":[0,-288],"sprite":[5,31],"size":32,"layer":0,"animation":null},{"pos":[0,-320],"sprite":[5,31],"size":32,"layer":0,"animation":null},{"pos":[32,-320],"sprite":[5,31],"size":32,"layer":0,"animation":null},{"pos":[96,-416],"sprite":[8,22],"size":32,"layer":0,"animation":null},{"pos":[160,-416],"sprite":[8,22],"size":32,"layer":0,"animation":null},{"pos":[224,-416],"sprite":[8,22],"size":32,"layer":0,"animation":null},{"pos":[288,-416],"sprite":[8,22],"size":32,"layer":0,"animation":null},{"pos":[128,-416],"sprite":[9,22],"size":32,"layer":0,"animation":null},{"pos":[192,-416],"sprite":[9,22],"size":32,"layer":0,"animation":null},{"pos":[256,-416],"sprite":[9,22],"size":32,"layer":0,"animation":null},{"pos":[320,-416],"sprite":[9,22],"size":32,"layer":0,"animation":null},{"pos":[320,-448],"sprite":[9,21],"size":32,"layer":0,"animation":null},{"pos":[96,-448],"sprite":[8,21],"size":32,"layer":0,"animation":null},{"pos":[128,-448],"sprite":[8,28],"size":32,"layer":0,"animation":null},{"pos":[192,-448],"sprite":[8,28],"size":32,"layer":0,"animation":null},{"pos":[256,-448],"sprite":[8,28],"size":32,"layer":0,"animation":null},{"pos":[160,-448],"sprite":[9,28],"size":32,"layer":0,"animation":null},{"pos":[224,-448],"sprite":[9,28],"size":32,"layer":0,"animation":null},{"pos":[288,-448],"sprite":[9,28],"size":32,"layer":0,"animation":null},{"pos":[288,-480],"sprite":[9,21],"size":32,"layer":0,"animation":null},{"pos":[224,-480],"sprite":[9,21],"size":32,"layer":0,"animation":null},{"pos":[128,-480],"sprite":[8,21],"size":32,"layer":0,"animation":null},{"pos":[256,-480],"sprite":[8,21],"size":32,"layer":0,"animation":null},{"pos":[160,-480],"sprite":[8,28],"size":32,"layer":0,"animation":null},{"pos":[192,-480],"sprite":[9,28],"size":32,"layer":0,"animation":null},{"pos":[160,-512],"sprite":[8,21],"size":32,"layer":0,"animation":null},{"pos":[192,-512],"sprite":[9,21],"size":32,"layer":0,"animation":null},{"pos":[128,-352],"sprite":[11,24],"size":32,"layer":0,"animation":null},{"pos":[256,-320],"sprite":[11,24],"size":32,"layer":0,"animation":null},{"pos":[128,-288],"sprite":[11,24],"size":32,"layer":0,"animation":null},{"pos":[160,-384],"sprite":[1,15],"size":32,"layer":0,"animation":null},{"pos":[192,-384],"sprite":[2,15],"size":32,"layer":0,"animation":null},{"pos":[224,-384],"sprite":[3,15],"size":32,"layer":0,"animation":null},{"pos":[224,-352],"sprite":[3,16],"size":32,"layer":0,"animation":null},{"pos":[192,-352],"sprite":[2,16],"size":32,"layer":0,"animation":null},{"pos":[160,-352],"sprite":[1,16],"size":32,"layer":0,"animation":null},{"pos":[128,-384],"sprite":[3,19],"size":32,"layer":0,"animation":null},{"pos":[256,-384],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[288,-352],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[288,-320],"sprite":[4,22],"size":32,"layer":0,"animation":null},{"pos":[320,-384],"sprite":[4,22],"size":32,"layer":0,"animation":null},{"pos":[352,-288],"sprite":[4,22],"size":32,"layer":0,"animation":null},{"pos":[224,-224],"sprite":[4,22],"size":32,"layer":0,"animation":null},{"pos":[160,-224],"sprite":[4,22],"size":32,"layer":0,"animation":null},{"pos":[160,-160],"sprite":[4,22],"size":32,"layer":0,"animation":null},{"pos":[160,-128],"sprite":[4,22],"size":32,"layer":0,"animation":null},{"pos":[128,-64],"sprite":[4,22],"size":32,"layer":0,"animation":null},{"pos":[160,-96],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[256,-192],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[192,-160],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[352,-224],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[448,-384],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[384,-352],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[448,-256],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[416,-288],"sprite":[4,20],"size":32,"layer":0,"animation":null},{"pos":[288,-224],"sprite":[4,20],"size":32,"layer":0,"animation":null},{"pos":[192,-224],"sprite":[4,20],"size":32,"layer":0,"animation":null},{"pos":[160,-192],"sprite":[4,20],"size":32,"layer":0,"animation":null},{"pos":[384,-384],"sprite":[4,20],"size":32,"layer":0,"animation":null},{"pos":[352,-480],"sprite":[4,20],"size":32,"layer":0,"animation":null},{"pos":[384,-448],"sprite":[4,20],"size":32,"layer":0,"animation":null},{"pos":[352,-416],"sprite":[3,19],"size":32,"layer":0,"animation":null},{"pos":[416,-320],"sprite":[3,19],"size":32,"layer":0,"animation":null},{"pos":[384,-256],"sprite":[3,19],"size":32,"layer":0,"animation":null},{"pos":[352,-352],"sprite":[3,19],"size":32,"layer":0,"animation":null},{"pos":[192,-192],"sprite":[3,19],"size":32,"layer":0,"animation":null},{"pos":[96,-32],"sprite":[3,19],"size":32,"layer":0,"animation":null},{"pos":[96,-512],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-32,-480],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-64,-480],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-96,-480],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-96,-448],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-128,-448],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-160,-448],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-160,-416],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-224,-384],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-192,-416],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-224,-416],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-256,-384],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-288,-352],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-320,-320],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-320,-288],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-256,-32],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-224,-32],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-192,0],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-160,64],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-288,160],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-224,160],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-256,160],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-288,192],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-320,192],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-224,128],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-192,64],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-320,-160],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-320,-256],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-320,-224],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-320,-192],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-288,-192],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-288,-160],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-256,-128],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-256,-96],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-256,-64],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-224,-64],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-192,-32],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-128,32],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-128,64],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-128,96],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-160,96],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-192,96],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-192,128],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-160,32],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-192,32],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-224,32],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-480,160],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-448,128],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-288,-32],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-288,0],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-224,0],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-256,64],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-288,96],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-224,96],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-256,96],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-256,128],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-416,192],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-384,192],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-288,128],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-320,128],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-320,160],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-352,160],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-384,160],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-320,64],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-256,0],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-256,32],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-288,32],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-288,64],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-320,96],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-352,96],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-448,160],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-416,160],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-416,128],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-384,96],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-416,0],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-480,64],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-480,128],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-480,96],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-448,96],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-448,64],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-288,-64],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-352,0],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-288,-96],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-288,-128],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-320,-128],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-320,-96],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-320,-64],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-352,-32],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-352,-96],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-352,-64],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-384,0],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-384,32],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-416,32],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-384,-32],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-384,-64],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-384,-96],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-352,-128],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-352,-160],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-352,-192],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-352,-224],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-384,-192],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-384,-160],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-384,-128],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-416,-32],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-416,-64],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-416,-96],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-416,-128],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-416,-160],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-416,-192],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-416,-224],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-288,-448],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-256,-480],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-224,-512],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-128,-480],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-288,-416],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-288,-384],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-320,-384],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-320,-352],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-384,-288],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-416,-256],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-480,-224],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-448,-224],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-448,-256],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-416,-288],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-416,-320],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-384,-320],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-384,-352],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-352,-352],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-352,-384],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-352,-416],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-320,-416],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-320,-448],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-320,-480],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-288,-480],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-288,-512],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-256,-512],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-256,-544],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-224,-544],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-128,-512],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[96,-608],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[64,-608],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[32,-512],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[96,-576],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[128,-576],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[96,-544],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[64,-512],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[64,-480],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[32,-480],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[0,-480],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[64,-448],"sprite":[10,6],"size":32,"layer":0,"animation":null},{"pos":[32,-448],"sprite":[10,6],"size":32,"layer":0,"animation":null},{"pos":[0,-448],"sprite":[10,6],"size":32,"layer":0,"animation":null},{"pos":[-32,-448],"sprite":[10,6],"size":32,"layer":0,"animation":null},{"pos":[-64,-416],"sprite":[10,6],"size":32,"layer":0,"animation":null},{"pos":[-96,-416],"sprite":[10,6],"size":32,"layer":0,"animation":null},{"pos":[0,-416],"sprite":[10,6],"size":32,"layer":0,"animation":null},{"pos":[-32,-416],"sprite":[10,6],"size":32,"layer":0,"animation":null},{"pos":[-64,-448],"sprite":[10,6],"size":32,"layer":0,"animation":null},{"pos":[-128,-416],"sprite":[10,6],"size":32,"layer":0,"animation":null},{"pos":[-160,-384],"sprite":[10,6],"size":32,"layer":0,"animation":null},{"pos":[-192,-384],"sprite":[10,6],"size":32,"layer":0,"animation":null},{"pos":[-224,-352],"sprite":[10,6],"size":32,"layer":0,"animation":null},{"pos":[-256,-352],"sprite":[10,6],"size":32,"layer":0,"animation":null},{"pos":[-288,-320],"sprite":[10,6],"size":32,"layer":0,"animation":null},{"pos":[-288,-288],"sprite":[10,6],"size":32,"layer":0,"animation":null},{"pos":[-256,-320],"sprite":[10,6],"size":32,"layer":0,"animation":null},{"pos":[-256,-288],"sprite":[10,6],"size":32,"layer":0,"animation":null},{"pos":[-256,-256],"sprite":[10,6],"size":32,"layer":0,"animation":null},{"pos":[-288,-256],"sprite":[10,6],"size":32,"layer":0,"animation":null},{"pos":[-288,-224],"sprite":[10,6],"size":32,"layer":0,"animation":null},{"pos":[-256,-224],"sprite":[10,6],"size":32,"layer":0,"animation":null},{"pos":[-256,-192],"sprite":[10,6],"size":32,"layer":0,"animation":null},{"pos":[-256,-160],"sprite":[10,6],"size":32,"layer":0,"animation":null},{"pos":[-224,-128],"sprite":[10,6],"size":32,"layer":0,"animation":null},{"pos":[-224,-96],"sprite":[10,6],"size":32,"layer":0,"animation":null},{"pos":[-160,0],"sprite":[10,6],"size":32,"layer":0,"animation":null},{"pos":[64,-32],"sprite":[10,6],"size":32,"layer":0,"animation":null},{"pos":[0,0],"sprite":[1,3],"size":32,"layer":0,"animation":null},{"pos":[-32,-32],"sprite":[9,3],"size":32,"layer":0,"animation":null},{"pos":[32,-32],"sprite":[9,3],"size":32,"layer":0,"animation":null},{"pos":[-32,0],"sprite":[9,4],"size":32,"layer":0,"animation":null},{"pos":[32,0],"sprite":[9,4],"size":32,"layer":0,"animation":null},{"pos":[-320,-32],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-320,0],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-320,32],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-384,128],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-352,128],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-224,64],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-352,32],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-352,64],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-384,64],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-416,64],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-416,96],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-352,-320],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-352,-288],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-352,-256],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-384,-256],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-384,-224],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-256,-416],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-256,-448],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-224,-448],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-224,-480],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-160,-544],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[32,-576],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-96,-512],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-128,-192],"sprite":[2,4],"size":32,"layer":0,"animation":null},{"pos":[-96,-128],"sprite":[2,4],"size":32,"layer":0,"animation":null},{"pos":[-128,-256],"sprite":[2,4],"size":32,"layer":0,"animation":null},{"pos":[-64,-352],"sprite":[2,4],"size":32,"layer":0,"animation":null},{"pos":[96,-224],"sprite":[2,4],"size":32,"layer":0,"animation":null},{"pos":[96,-128],"sprite":[2,4],"size":32,"layer":0,"animation":null},{"pos":[32,-192],"sprite":[2,4],"size":32,"layer":0,"animation":null},{"pos":[-192,-256],"sprite":[3,4],"size":32,"layer":0,"animation":null},{"pos":[96,-256],"sprite":[3,4],"size":32,"layer":0,"animation":null},{"pos":[-160,-320],"sprite":[2,3],"size":32,"layer":0,"animation":null},{"pos":[-96,-352],"sprite":[2,3],"size":32,"layer":0,"animation":null},{"pos":[32,-384],"sprite":[2,3],"size":32,"layer":0,"animation":null},{"pos":[-96,-288],"sprite":[7,3],"size":32,"layer":0,"animation":null},{"pos":[96,-96],"sprite":[8,3],"size":32,"layer":0,"animation":null},{"pos":[192,32],"sprite":[10,4],"size":32,"layer":0,"animation":null},{"pos":[-64,160],"sprite":[10,4],"size":32,"layer":0,"animation":null},{"pos":[64,64],"sprite":[10,4],"size":32,"layer":0,"animation":null},{"pos":[-64,64],"sprite":[10,4],"size":32,"layer":0,"animation":null},{"pos":[-32,-224],"sprite":[10,4],"size":32,"layer":0,"animation":null},{"pos":[64,-128],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[0,96],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[0,224],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[0,256],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[-32,288],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[-64,320],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[-96,352],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[-192,384],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[-224,384],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[-256,384],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[0,128],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[32,128],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[64,128],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[96,128],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[96,96],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[128,96],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[160,64],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[192,64],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[224,32],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[256,0],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[256,-32],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[288,-32],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[288,-96],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[320,-96],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[320,-128],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[256,-96],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[352,-128],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[384,-128],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[384,-160],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[416,-160],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[448,-160],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[480,-160],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[480,-192],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[512,-192],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[512,-224],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[544,-224],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[544,-256],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[544,-288],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[576,-320],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[576,-352],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[608,-384],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[608,-416],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[640,-416],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[640,-448],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[640,-480],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[640,-512],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[640,-544],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[640,-576],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[640,-608],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[640,-640],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[672,-640],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[672,-672],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[672,-704],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[704,-704],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[704,-736],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[736,-736],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[736,-768],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[768,-768],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[768,-800],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[800,-800],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[800,-832],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[800,-864],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[800,-896],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[832,-896],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[64,-384],"sprite":[5,29],"size":32,"layer":0,"animation":null},{"pos":[-96,32],"sprite":[6,30],"size":32,"layer":0,"animation":null},{"pos":[-96,0],"sprite":[6,30],"size":32,"layer":0,"animation":null},{"pos":[-128,0],"sprite":[6,30],"size":32,"layer":0,"animation":null},{"pos":[-160,-32],"sprite":[6,30],"size":32,"layer":0,"animation":null},{"pos":[-192,-64],"sprite":[6,30],"size":32,"layer":0,"animation":null},{"pos":[-128,-32],"sprite":[4,24],"size":32,"layer":0,"animation":null},{"pos":[-96,-32],"sprite":[4,24],"size":32,"layer":0,"animation":null},{"pos":[-64,-32],"sprite":[4,24],"size":32,"layer":0,"animation":null},{"pos":[-160,-64],"sprite":[4,24],"size":32,"layer":0,"animation":null},{"pos":[-192,-96],"sprite":[4,24],"size":32,"layer":0,"animation":null},{"pos":[-224,-160],"sprite":[4,24],"size":32,"layer":0,"animation":null},{"pos":[128,32],"sprite":[4,27],"size":32,"layer":0,"animation":null},{"pos":[96,32],"sprite":[4,27],"size":32,"layer":0,"animation":null},{"pos":[160,32],"sprite":[4,27],"size":32,"layer":0,"animation":null},{"pos":[160,0],"sprite":[4,27],"size":32,"layer":0,"animation":null},{"pos":[-192,-192],"sprite":[3,4],"size":32,"layer":0,"animation":null},{"pos":[128,0],"sprite":[2,4],"size":32,"layer":0,"animation":null},{"pos":[288,-64],"sprite":[5,30],"size":32,"layer":0,"animation":null},{"pos":[-128,192],"sprite":[5,30],"size":32,"layer":0,"animation":null},{"pos":[-256,320],"sprite":[5,30],"size":32,"layer":0,"animation":null},{"pos":[0,-128],"sprite":[4,31],"size":32,"layer":0,"animation":null},{"pos":[-32,-128],"sprite":[4,31],"size":32,"layer":0,"animation":null},{"pos":[-32,-256],"sprite":[4,31],"size":32,"layer":0,"animation":null},{"pos":[-64,-256],"sprite":[4,31],"size":32,"layer":0,"animation":null},{"pos":[-64,-224],"sprite":[4,31],"size":32,"layer":0,"animation":null},{"pos":[64,-352],"sprite":[4,31],"size":32,"layer":0,"animation":null},{"pos":[64,-320],"sprite":[4,31],"size":32,"layer":0,"animation":null},{"pos":[0,-32],"sprite":[5,28],"size":32,"layer":0,"animation":null},{"pos":[-192,-288],"sprite":[7,3],"size":32,"layer":0,"animation":null},{"pos":[160,-320],"sprite":[6,3],"size":32,"layer":0,"animation":null},{"pos":[416,-704],"sprite":[8,22],"size":32,"layer":0,"animation":null},{"pos":[448,-704],"sprite":[9,22],"size":32,"layer":0,"animation":null},{"pos":[512,-736],"sprite":[9,22],"size":32,"layer":0,"animation":null},{"pos":[576,-768],"sprite":[9,22],"size":32,"layer":0,"animation":null},{"pos":[576,-800],"sprite":[9,21],"size":32,"layer":0,"animation":null},{"pos":[544,-800],"sprite":[8,21],"size":32,"layer":0,"animation":null},{"pos":[544,-768],"sprite":[8,22],"size":32,"layer":0,"animation":null},{"pos":[512,-768],"sprite":[9,21],"size":32,"layer":0,"animation":null},{"pos":[480,-768],"sprite":[8,21],"size":32,"layer":0,"animation":null},{"pos":[480,-736],"sprite":[8,22],"size":32,"layer":0,"animation":null},{"pos":[448,-736],"sprite":[9,21],"size":32,"layer":0,"animation":null},{"pos":[416,-736],"sprite":[8,21],"size":32,"layer":0,"animation":null},{"pos":[608,-928],"sprite":[9,27],"size":32,"layer":0,"animation":null},{"pos":[416,-1120],"sprite":[9,27],"size":32,"layer":0,"animation":null},{"pos":[288,-1056],"sprite":[9,27],"size":32,"layer":0,"animation":null},{"pos":[224,-832],"sprite":[9,27],"size":32,"layer":0,"animation":null},{"pos":[320,-768],"sprite":[9,27],"size":32,"layer":0,"animation":null},{"pos":[256,-832],"sprite":[8,27],"size":32,"layer":0,"animation":null},{"pos":[352,-768],"sprite":[8,27],"size":32,"layer":0,"animation":null},{"pos":[320,-1056],"sprite":[8,27],"size":32,"layer":0,"animation":null},{"pos":[448,-1120],"sprite":[8,27],"size":32,"layer":0,"animation":null},{"pos":[640,-928],"sprite":[8,27],"size":32,"layer":0,"animation":null},{"pos":[576,-896],"sprite":[8,22],"size":32,"layer":0,"animation":null},{"pos":[192,-800],"sprite":[8,22],"size":32,"layer":0,"animation":null},{"pos":[288,-736],"sprite":[8,22],"size":32,"layer":0,"animation":null},{"pos":[672,-896],"sprite":[9,22],"size":32,"layer":0,"animation":null},{"pos":[608,-896],"sprite":[9,22],"size":32,"layer":0,"animation":null},{"pos":[640,-896],"sprite":[8,22],"size":32,"layer":0,"animation":null},{"pos":[352,-736],"sprite":[8,22],"size":32,"layer":0,"animation":null},{"pos":[256,-800],"sprite":[8,22],"size":32,"layer":0,"animation":null},{"pos":[320,-1024],"sprite":[8,22],"size":32,"layer":0,"animation":null},{"pos":[352,-1024],"sprite":[9,22],"size":32,"layer":0,"animation":null},{"pos":[288,-1024],"sprite":[9,22],"size":32,"layer":0,"animation":null},{"pos":[224,-800],"sprite":[9,22],"size":32,"layer":0,"animation":null},{"pos":[288,-800],"sprite":[9,22],"size":32,"layer":0,"animation":null},{"pos":[384,-736],"sprite":[9,22],"size":32,"layer":0,"animation":null},{"pos":[320,-736],"sprite":[9,22],"size":32,"layer":0,"animation":null},{"pos":[320,-1088],"sprite":[9,21],"size":32,"layer":0,"animation":null},{"pos":[448,-1152],"sprite":[9,21],"size":32,"layer":0,"animation":null},{"pos":[480,-1120],"sprite":[9,21],"size":32,"layer":0,"animation":null},{"pos":[512,-1088],"sprite":[9,21],"size":32,"layer":0,"animation":null},{"pos":[480,-1056],"sprite":[8,22],"size":32,"layer":0,"animation":null},{"pos":[416,-1056],"sprite":[8,22],"size":32,"layer":0,"animation":null},{"pos":[384,-1056],"sprite":[9,22],"size":32,"layer":0,"animation":null},{"pos":[448,-1056],"sprite":[9,22],"size":32,"layer":0,"animation":null},{"pos":[576,-928],"sprite":[8,21],"size":32,"layer":0,"animation":null},{"pos":[640,-960],"sprite":[9,21],"size":32,"layer":0,"animation":null},{"pos":[672,-928],"sprite":[9,21],"size":32,"layer":0,"animation":null},{"pos":[448,-1088],"sprite":[9,27],"size":32,"layer":0,"animation":null},{"pos":[384,-1088],"sprite":[9,27],"size":32,"layer":0,"animation":null},{"pos":[352,-1056],"sprite":[9,27],"size":32,"layer":0,"animation":null},{"pos":[416,-1088],"sprite":[8,27],"size":32,"layer":0,"animation":null},{"pos":[192,-832],"sprite":[8,21],"size":32,"layer":0,"animation":null},{"pos":[224,-864],"sprite":[8,21],"size":32,"layer":0,"animation":null},{"pos":[288,-768],"sprite":[8,21],"size":32,"layer":0,"animation":null},{"pos":[320,-800],"sprite":[8,21],"size":32,"layer":0,"animation":null},{"pos":[256,-1056],"sprite":[8,21],"size":32,"layer":0,"animation":null},{"pos":[288,-1088],"sprite":[8,21],"size":32,"layer":0,"animation":null},{"pos":[352,-1088],"sprite":[8,21],"size":32,"layer":0,"animation":null},{"pos":[384,-1120],"sprite":[8,21],"size":32,"layer":0,"animation":null},{"pos":[416,-1152],"sprite":[8,21],"size":32,"layer":0,"animation":null},{"pos":[256,-864],"sprite":[9,21],"size":32,"layer":0,"animation":null},{"pos":[288,-832],"sprite":[9,21],"size":32,"layer":0,"animation":null},{"pos":[352,-800],"sprite":[9,21],"size":32,"layer":0,"animation":null},{"pos":[384,-768],"sprite":[9,21],"size":32,"layer":0,"animation":null},{"pos":[480,-1088],"sprite":[8,27],"size":32,"layer":0,"animation":null},{"pos":[512,-1056],"sprite":[8,27],"size":32,"layer":0,"animation":null},{"pos":[544,-1056],"sprite":[9,21],"size":32,"layer":0,"animation":null},{"pos":[576,-1056],"sprite":[8,21],"size":32,"layer":0,"animation":null},{"pos":[608,-1056],"sprite":[9,21],"size":32,"layer":0,"animation":null},{"pos":[608,-1024],"sprite":[9,22],"size":32,"layer":0,"animation":null},{"pos":[512,-1024],"sprite":[8,22],"size":32,"layer":0,"animation":null},{"pos":[576,-1024],"sprite":[9,27],"size":32,"layer":0,"animation":null},{"pos":[544,-1024],"sprite":[8,27],"size":32,"layer":0,"animation":null},{"pos":[544,-992],"sprite":[8,22],"size":32,"layer":0,"animation":null},{"pos":[576,-960],"sprite":[8,22],"size":32,"layer":0,"animation":null},{"pos":[576,-992],"sprite":[8,27],"size":32,"layer":0,"animation":null},{"pos":[608,-992],"sprite":[9,21],"size":32,"layer":0,"animation":null},{"pos":[608,-960],"sprite":[9,28],"size":32,"layer":0,"animation":null},{"pos":[224,-1024],"sprite":[8,21],"size":32,"layer":0,"animation":null},{"pos":[192,-992],"sprite":[8,21],"size":32,"layer":0,"animation":null},{"pos":[256,-928],"sprite":[9,22],"size":32,"layer":0,"animation":null},{"pos":[224,-896],"sprite":[9,22],"size":32,"layer":0,"animation":null},{"pos":[192,-896],"sprite":[8,22],"size":32,"layer":0,"animation":null},{"pos":[224,-992],"sprite":[9,27],"size":32,"layer":0,"animation":null},{"pos":[256,-1024],"sprite":[9,27],"size":32,"layer":0,"animation":null},{"pos":[256,-992],"sprite":[9,22],"size":32,"layer":0,"animation":null},{"pos":[192,-960],"sprite":[8,22],"size":32,"layer":0,"animation":null},{"pos":[192,-928],"sprite":[8,21],"size":32,"layer":0,"animation":null},{"pos":[224,-928],"sprite":[8,28],"size":32,"layer":0,"animation":null},{"pos":[224,-960],"sprite":[8,27],"size":32,"layer":0,"animation":null},{"pos":[256,-960],"sprite":[9,21],"size":32,"layer":0,"animation":null},{"pos":[320,-928],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[448,-832],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[448,-1024],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[416,-928],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[320,-864],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[288,-992],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[544,-864],"sprite":[4,30],"size":32,"layer":0,"animation":null},{"pos":[352,-992],"sprite":[5,30],"size":32,"layer":0,"animation":null},{"pos":[544,-928],"sprite":[5,30],"size":32,"layer":0,"animation":null},{"pos":[416,-864],"sprite":[5,30],"size":32,"layer":0,"animation":null},{"pos":[544,-960],"sprite":[4,3],"size":32,"layer":0,"animation":null},{"pos":[480,-832],"sprite":[4,3],"size":32,"layer":0,"animation":null},{"pos":[384,-864],"sprite":[4,4],"size":32,"layer":0,"animation":null},{"pos":[416,-992],"sprite":[5,4],"size":32,"layer":0,"animation":null},{"pos":[288,-960],"sprite":[5,3],"size":32,"layer":0,"animation":null},{"pos":[256,-896],"sprite":[7,6],"size":32,"layer":0,"animation":null},{"pos":[544,-736],"sprite":[8,6],"size":32,"layer":0,"animation":null},{"pos":[576,-736],"sprite":[8,6],"size":32,"layer":0,"animation":null},{"pos":[640,-864],"sprite":[8,6],"size":32,"layer":0,"animation":null},{"pos":[672,-864],"sprite":[8,6],"size":32,"layer":0,"animation":null},{"pos":[608,-736],"sprite":[8,6],"size":32,"layer":0,"animation":null},{"pos":[608,-768],"sprite":[8,6],"size":32,"layer":0,"animation":null},{"pos":[704,-864],"sprite":[8,6],"size":32,"layer":0,"animation":null},{"pos":[704,-896],"sprite":[8,6],"size":32,"layer":0,"animation":null},{"pos":[608,-800],"sprite":[8,6],"size":32,"layer":0,"animation":null},{"pos":[352,-1120],"sprite":[3,19],"size":32,"layer":0,"animation":null},{"pos":[192,-1056],"sprite":[3,19],"size":32,"layer":0,"animation":null},{"pos":[160,-1056],"sprite":[3,19],"size":32,"layer":0,"animation":null},{"pos":[160,-1024],"sprite":[3,19],"size":32,"layer":0,"animation":null},{"pos":[128,-832],"sprite":[3,19],"size":32,"layer":0,"animation":null},{"pos":[192,-704],"sprite":[3,19],"size":32,"layer":0,"animation":null},{"pos":[192,-736],"sprite":[3,19],"size":32,"layer":0,"animation":null},{"pos":[512,-672],"sprite":[3,19],"size":32,"layer":0,"animation":null},{"pos":[480,-1024],"sprite":[3,19],"size":32,"layer":0,"animation":null},{"pos":[320,-832],"sprite":[3,19],"size":32,"layer":0,"animation":null},{"pos":[416,-768],"sprite":[3,19],"size":32,"layer":0,"animation":null},{"pos":[736,-928],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[672,-832],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[800,-672],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[544,-576],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[704,-384],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[640,-256],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[576,-160],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[736,-544],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[544,-480],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[992,-992],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[896,-832],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[928,-960],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[864,-768],"sprite":[4,22],"size":32,"layer":0,"animation":null},{"pos":[992,-928],"sprite":[4,22],"size":32,"layer":0,"animation":null},{"pos":[736,-640],"sprite":[4,22],"size":32,"layer":0,"animation":null},{"pos":[832,-512],"sprite":[4,22],"size":32,"layer":0,"animation":null},{"pos":[736,-288],"sprite":[4,22],"size":32,"layer":0,"animation":null},{"pos":[704,-160],"sprite":[4,22],"size":32,"layer":0,"animation":null},{"pos":[544,-128],"sprite":[4,22],"size":32,"layer":0,"animation":null},{"pos":[512,-96],"sprite":[4,22],"size":32,"layer":0,"animation":null},{"pos":[416,32],"sprite":[4,22],"size":32,"layer":0,"animation":null},{"pos":[384,-32],"sprite":[4,22],"size":32,"layer":0,"animation":null},{"pos":[352,-704],"sprite":[4,22],"size":32,"layer":0,"animation":null},{"pos":[320,-544],"sprite":[4,22],"size":32,"layer":0,"animation":null},{"pos":[288,-640],"sprite":[4,22],"size":32,"layer":0,"animation":null},{"pos":[384,-576],"sprite":[4,22],"size":32,"layer":0,"animation":null},{"pos":[480,-704],"sprite":[4,23],"size":32,"layer":0,"animation":null},{"pos":[256,-768],"sprite":[4,23],"size":32,"layer":0,"animation":null},{"pos":[192,-864],"sprite":[4,23],"size":32,"layer":0,"animation":null},{"pos":[640,-992],"sprite":[4,23],"size":32,"layer":0,"animation":null},{"pos":[512,-1184],"sprite":[4,23],"size":32,"layer":0,"animation":null},{"pos":[384,-672],"sprite":[4,20],"size":32,"layer":0,"animation":null},{"pos":[320,-640],"sprite":[4,20],"size":32,"layer":0,"animation":null},{"pos":[320,-608],"sprite":[4,20],"size":32,"layer":0,"animation":null},{"pos":[288,-576],"sprite":[4,20],"size":32,"layer":0,"animation":null},{"pos":[320,-512],"sprite":[4,20],"size":32,"layer":0,"animation":null},{"pos":[256,-512],"sprite":[4,20],"size":32,"layer":0,"animation":null},{"pos":[352,-672],"sprite":[3,19],"size":32,"layer":0,"animation":null},{"pos":[320,-672],"sprite":[3,19],"size":32,"layer":0,"animation":null},{"pos":[384,-704],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[352,-640],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[288,-608],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[320,-576],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[288,-544],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[320,-480],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[352,-448],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[288,-512],"sprite":[4,21],"size":32,"layer":0,"animation":null},{"pos":[128,-640],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[128,-672],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[128,-704],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[128,-768],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[96,-736],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[96,-704],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[96,-672],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[128,-736],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[160,-736],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[160,-768],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[160,-800],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[96,-832],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[96,-864],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[96,-896],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[96,-768],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[96,-800],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[64,-736],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[64,-704],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[64,-672],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[64,-640],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[64,-800],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[64,-768],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[0,-640],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[256,-1184],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[224,-1184],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[224,-1152],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[192,-1152],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[192,-1120],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[160,-1120],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[160,-1088],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[128,-1056],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[96,-1024],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[96,-992],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[64,-928],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[64,-896],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[32,-1024],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[64,-1056],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[64,-1088],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[192,-1216],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[192,-1184],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[160,-1184],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[128,-1184],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[96,-1152],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[64,-1120],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[32,-1088],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[32,-1056],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[0,-1056],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[0,-1024],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-32,-992],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-32,-960],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-32,-928],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-32,-896],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-64,-864],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-32,-864],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[0,-992],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[0,-960],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[0,-896],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[0,-864],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[0,-832],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-64,-544],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[64,-864],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[64,-832],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[0,-800],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-32,-832],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-32,-800],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-32,-768],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-32,-736],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-32,-704],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-64,-704],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-64,-672],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-96,-672],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-128,-576],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-192,-576],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-192,-544],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-160,-576],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-128,-608],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-96,-608],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-96,-640],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[-64,-640],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[64,-960],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[64,-992],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[64,-1024],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[96,-1120],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[128,-1152],"sprite":[10,5],"size":32,"layer":0,"animation":null},{"pos":[160,-1152],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[128,-1120],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[128,-1088],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[96,-1088],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[96,-1056],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[32,-992],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[32,-960],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[0,-928],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[32,-928],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[32,-896],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[32,-864],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[32,-832],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[32,-800],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[32,-736],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-32,-576],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-160,-480],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-192,-448],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-192,-480],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-192,-512],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-160,-512],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-128,-544],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-96,-544],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-96,-576],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-64,-576],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-64,-608],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-32,-608],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-32,-640],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-32,-672],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[0,-672],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[0,-704],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[0,-736],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[0,-768],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[32,-768],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[32,-704],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[32,-672],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[32,-640],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[32,-608],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[0,-608],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[0,-576],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[0,-512],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-32,-512],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-64,-512],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[-32,-544],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[0,-544],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[32,-544],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[64,-544],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[64,-576],"sprite":[11,5],"size":32,"layer":0,"animation":null},{"pos":[192,-768],"sprite":[6,30],"size":32,"layer":0,"animation":null},{"pos":[160,-704],"sprite":[6,30],"size":32,"layer":0,"animation":null},{"pos":[192,-672],"sprite":[6,30],"size":32,"layer":0,"animation":null},{"pos":[160,-672],"sprite":[6,30],"size":32,"layer":0,"animation":null},{"pos":[160,-640],"sprite":[6,30],"size":32,"layer":0,"animation":null},{"pos":[160,-608],"sprite":[6,30],"size":32,"layer":0,"animation":null},{"pos":[128,-608],"sprite":[6,30],"size":32,"layer":0,"animation":null},{"pos":[160,-576],"sprite":[6,30],"size":32,"layer":0,"animation":null},{"pos":[128,-544],"sprite":[6,30],"size":32,"layer":0,"animation":null},{"pos":[128,-512],"sprite":[6,30],"size":32,"layer":0,"animation":null},{"pos":[96,-480],"sprite":[6,30],"size":32,"layer":0,"animation":null},{"pos":[160,-544],"sprite":[6,30],"size":32,"layer":0,"animation":null},{"pos":[192,-640],"sprite":[6,30],"size":32,"layer":0,"animation":null},{"pos":[224,-704],"sprite":[6,30],"size":32,"layer":0,"animation":null},{"pos":[224,-736],"sprite":[6,30],"size":32,"layer":0,"animation":null},{"pos":[224,-768],"sprite":[6,30],"size":32,"layer":0,"animation":null},{"pos":[224,-608],"sprite":[5,30],"size":32,"layer":0,"animation":null},{"pos":[224,-544],"sprite":[5,30],"size":32,"layer":0,"animation":null},{"pos":[288,-704],"sprite":[5,30],"size":32,"layer":0,"animation":null},{"pos":[256,-672],"sprite":[6,29],"size":32,"layer":0,"animation":null},{"pos":[384,-1024],"sprite":[5,29],"size":32,"layer":0,"animation":null},{"pos":[96,-384],"sprite":[8,31],"size":32,"layer":0,"animation":null},{"pos":[96,-352],"sprite":[8,31],"size":32,"layer":0,"animation":null},{"pos":[128,-320],"sprite":[8,31],"size":32,"layer":0,"animation":null},{"pos":[96,-288],"sprite":[8,31],"size":32,"layer":0,"animation":null},{"pos":[96,-320],"sprite":[8,31],"size":32,"layer":0,"animation":null},{"pos":[160,-288],"sprite":[8,31],"size":32,"layer":0,"animation":null},{"pos":[192,-288],"sprite":[8,31],"size":32,"layer":0,"animation":null},{"pos":[192,-320],"sprite":[8,31],"size":32,"layer":0,"animation":null},{"pos":[224,-320],"sprite":[8,31],"size":32,"layer":0,"animation":null},{"pos":[224,-288],"sprite":[8,31],"size":32,"layer":0,"animation":null},{"pos":[256,-288],"sprite":[8,31],"size":32,"layer":0,"animation":null},{"pos":[256,-352],"sprite":[8,31],"size":32,"layer":0,"animation":null},{"pos":[32,64],"sprite":[4,2],"size":32,"layer":0,"animation":null},{"pos":[640,-768],"sprite":[4,2],"size":32,"layer":0,"animation":null},{"pos":[160,-928],"sprite":[21,6],"size":32,"layer":0,"animation":null},{"pos":[160,-960],"sprite":[8,6],"size":32,"layer":0,"animation":null},{"pos":[128,-960],"sprite":[8,6],"size":32,"layer":0,"animation":null},{"pos":[128,-928],"sprite":[8,6],"size":32,"layer":0,"animation":null},{"pos":[128,-896],"sprite":[8,6],"size":32,"layer":0,"animation":null},{"pos":[160,-896],"sprite":[8,6],"size":32,"layer":0,"animation":null}],"creatures":[{"type":"creature","pos":[488.2752804606398,-166.7251185918365],"sprite":[17,21],"healthSprite":[12,17],"size":32,"sizeScaleLimit":1000,"speed":2,"hp":1,"attack":[30,30],"attackRepeat":0,"attackRepeatMulti":10000,"attackDamage":0,"attackRange":38.4,"attackPower":-1,"attackType":"melee","attackSprite":[20,3],"attackRotation":true,"faction":"ally","king":true,"enemyFactions":["evil","orcs","mine"],"color":"#cddc39","startPos":[0,160],"boxAnimation":40.2000000000003,"moveAnimation":655.3636515790307,"kingAnimation":660.7895226115993}],"projectiles":[],"blocks":[{"type":"block","pos":[-32,0],"size":32,"transparent":false},{"type":"block","pos":[-32,-32],"size":32,"transparent":false},{"type":"block","pos":[-64,-32],"size":32,"transparent":false},{"type":"block","pos":[-96,-32],"size":32,"transparent":false},{"type":"block","pos":[-128,-32],"size":32,"transparent":false},{"type":"block","pos":[-32,-64],"size":32,"transparent":false},{"type":"block","pos":[-64,-64],"size":32,"transparent":false},{"type":"block","pos":[-96,-64],"size":32,"transparent":false},{"type":"block","pos":[-128,-64],"size":32,"transparent":false},{"type":"block","pos":[32,64],"size":32,"transparent":false},{"type":"block","pos":[32,0],"size":32,"transparent":false},{"type":"block","pos":[32,-32],"size":32,"transparent":false},{"type":"block","pos":[32,-64],"size":32,"transparent":false},{"type":"block","pos":[64,-64],"size":32,"transparent":false},{"type":"block","pos":[96,-64],"size":32,"transparent":false},{"type":"block","pos":[96,-32],"size":32,"transparent":false},{"type":"block","pos":[128,0],"size":32,"transparent":false},{"type":"block","pos":[128,-64],"size":32,"transparent":false},{"type":"block","pos":[128,-96],"size":32,"transparent":false},{"type":"block","pos":[160,-96],"size":32,"transparent":false},{"type":"block","pos":[160,-128],"size":32,"transparent":false},{"type":"block","pos":[128,-128],"size":32,"transparent":false},{"type":"block","pos":[128,-160],"size":32,"transparent":false},{"type":"block","pos":[128,-192],"size":32,"transparent":false},{"type":"block","pos":[128,-224],"size":32,"transparent":false},{"type":"block","pos":[128,-256],"size":32,"transparent":false},{"type":"block","pos":[160,-256],"size":32,"transparent":false},{"type":"block","pos":[192,-256],"size":32,"transparent":false},{"type":"block","pos":[224,-256],"size":32,"transparent":false},{"type":"block","pos":[256,-256],"size":32,"transparent":false},{"type":"block","pos":[288,-288],"size":32,"transparent":false},{"type":"block","pos":[320,-288],"size":32,"transparent":false},{"type":"block","pos":[288,-320],"size":32,"transparent":false},{"type":"block","pos":[288,-352],"size":32,"transparent":false},{"type":"block","pos":[256,-384],"size":32,"transparent":false},{"type":"block","pos":[224,-352],"size":32,"transparent":false},{"type":"block","pos":[192,-352],"size":32,"transparent":false},{"type":"block","pos":[160,-352],"size":32,"transparent":false},{"type":"block","pos":[128,-384],"size":32,"transparent":false},{"type":"block","pos":[96,-416],"size":32,"transparent":false},{"type":"block","pos":[64,-384],"size":32,"transparent":false},{"type":"block","pos":[32,-384],"size":32,"transparent":false},{"type":"block","pos":[0,-384],"size":32,"transparent":false},{"type":"block","pos":[-32,-384],"size":32,"transparent":false},{"type":"block","pos":[-64,-384],"size":32,"transparent":false},{"type":"block","pos":[-64,-352],"size":32,"transparent":false},{"type":"block","pos":[-96,-352],"size":32,"transparent":false},{"type":"block","pos":[-128,-352],"size":32,"transparent":false},{"type":"block","pos":[-160,-320],"size":32,"transparent":false},{"type":"block","pos":[-192,-288],"size":32,"transparent":false},{"type":"block","pos":[-192,-256],"size":32,"transparent":false},{"type":"block","pos":[-224,-224],"size":32,"transparent":false},{"type":"block","pos":[-192,-192],"size":32,"transparent":false},{"type":"block","pos":[-192,-160],"size":32,"transparent":false},{"type":"block","pos":[-160,-128],"size":32,"transparent":false},{"type":"block","pos":[-160,-96],"size":32,"transparent":false},{"type":"block","pos":[-96,32],"size":32,"transparent":false},{"type":"block","pos":[-96,0],"size":32,"transparent":false},{"type":"block","pos":[-128,64],"size":32,"transparent":false},{"type":"block","pos":[-128,96],"size":32,"transparent":false},{"type":"block","pos":[-160,96],"size":32,"transparent":false},{"type":"block","pos":[-160,128],"size":32,"transparent":false},{"type":"block","pos":[-192,128],"size":32,"transparent":false},{"type":"block","pos":[-224,128],"size":32,"transparent":false},{"type":"block","pos":[-224,160],"size":32,"transparent":false},{"type":"block","pos":[-256,160],"size":32,"transparent":false},{"type":"block","pos":[-256,192],"size":32,"transparent":false},{"type":"block","pos":[-288,192],"size":32,"transparent":false},{"type":"block","pos":[-320,192],"size":32,"transparent":false},{"type":"block","pos":[-352,160],"size":32,"transparent":false},{"type":"block","pos":[-384,160],"size":32,"transparent":false},{"type":"block","pos":[384,-32],"size":32,"transparent":false},{"type":"block","pos":[416,32],"size":32,"transparent":false},{"type":"block","pos":[192,-160],"size":32,"transparent":false},{"type":"block","pos":[192,-192],"size":32,"transparent":false},{"type":"block","pos":[224,-224],"size":32,"transparent":false},{"type":"block","pos":[256,-192],"size":32,"transparent":false},{"type":"block","pos":[288,-224],"size":32,"transparent":false},{"type":"block","pos":[352,-224],"size":32,"transparent":false},{"type":"block","pos":[384,-256],"size":32,"transparent":false},{"type":"block","pos":[352,-288],"size":32,"transparent":false},{"type":"block","pos":[416,-288],"size":32,"transparent":false},{"type":"block","pos":[448,-256],"size":32,"transparent":false},{"type":"block","pos":[416,-320],"size":32,"transparent":false},{"type":"block","pos":[384,-352],"size":32,"transparent":false},{"type":"block","pos":[352,-352],"size":32,"transparent":false},{"type":"block","pos":[320,-320],"size":32,"transparent":false},{"type":"block","pos":[352,-416],"size":32,"transparent":false},{"type":"block","pos":[384,-384],"size":32,"transparent":false},{"type":"block","pos":[384,-448],"size":32,"transparent":false},{"type":"block","pos":[352,-480],"size":32,"transparent":false},{"type":"block","pos":[320,-512],"size":32,"transparent":false},{"type":"block","pos":[320,-544],"size":32,"transparent":false},{"type":"block","pos":[320,-576],"size":32,"transparent":false},{"type":"block","pos":[320,-608],"size":32,"transparent":false},{"type":"block","pos":[352,-640],"size":32,"transparent":false},{"type":"block","pos":[384,-576],"size":32,"transparent":false},{"type":"block","pos":[384,-672],"size":32,"transparent":false},{"type":"block","pos":[416,-704],"size":32,"transparent":false},{"type":"block","pos":[448,-704],"size":32,"transparent":false},{"type":"block","pos":[480,-704],"size":32,"transparent":false},{"type":"block","pos":[512,-672],"size":32,"transparent":false},{"type":"block","pos":[512,-736],"size":32,"transparent":false},{"type":"block","pos":[544,-736],"size":32,"transparent":false},{"type":"block","pos":[576,-736],"size":32,"transparent":false},{"type":"block","pos":[608,-736],"size":32,"transparent":false},{"type":"block","pos":[608,-800],"size":32,"transparent":false},{"type":"block","pos":[608,-768],"size":32,"transparent":false},{"type":"block","pos":[576,-800],"size":32,"transparent":false},{"type":"block","pos":[544,-800],"size":32,"transparent":false},{"type":"block","pos":[512,-768],"size":32,"transparent":false},{"type":"block","pos":[480,-768],"size":32,"transparent":false},{"type":"block","pos":[448,-736],"size":32,"transparent":false},{"type":"block","pos":[416,-768],"size":32,"transparent":false},{"type":"block","pos":[384,-768],"size":32,"transparent":false},{"type":"block","pos":[352,-800],"size":32,"transparent":false},{"type":"block","pos":[320,-832],"size":32,"transparent":false},{"type":"block","pos":[288,-832],"size":32,"transparent":false},{"type":"block","pos":[256,-864],"size":32,"transparent":false},{"type":"block","pos":[224,-896],"size":32,"transparent":false},{"type":"block","pos":[256,-928],"size":32,"transparent":false},{"type":"block","pos":[256,-960],"size":32,"transparent":false},{"type":"block","pos":[256,-1024],"size":32,"transparent":false},{"type":"block","pos":[224,-992],"size":32,"transparent":false},{"type":"block","pos":[288,-1024],"size":32,"transparent":false},{"type":"block","pos":[320,-1024],"size":32,"transparent":false},{"type":"block","pos":[352,-1024],"size":32,"transparent":false},{"type":"block","pos":[384,-1056],"size":32,"transparent":false},{"type":"block","pos":[416,-1056],"size":32,"transparent":false},{"type":"block","pos":[448,-1056],"size":32,"transparent":false},{"type":"block","pos":[480,-1024],"size":32,"transparent":false},{"type":"block","pos":[512,-1024],"size":32,"transparent":false},{"type":"block","pos":[544,-992],"size":32,"transparent":false},{"type":"block","pos":[576,-960],"size":32,"transparent":false},{"type":"block","pos":[576,-928],"size":32,"transparent":false},{"type":"block","pos":[576,-896],"size":32,"transparent":false},{"type":"block","pos":[608,-896],"size":32,"transparent":false},{"type":"block","pos":[640,-864],"size":32,"transparent":false},{"type":"block","pos":[672,-864],"size":32,"transparent":false},{"type":"block","pos":[704,-864],"size":32,"transparent":false},{"type":"block","pos":[704,-896],"size":32,"transparent":false},{"type":"block","pos":[672,-928],"size":32,"transparent":false},{"type":"block","pos":[640,-960],"size":32,"transparent":false},{"type":"block","pos":[640,-992],"size":32,"transparent":false},{"type":"block","pos":[608,-1024],"size":32,"transparent":false},{"type":"block","pos":[608,-1056],"size":32,"transparent":false},{"type":"block","pos":[576,-1056],"size":32,"transparent":false},{"type":"block","pos":[544,-1056],"size":32,"transparent":false},{"type":"block","pos":[512,-1088],"size":32,"transparent":false},{"type":"block","pos":[480,-1120],"size":32,"transparent":false},{"type":"block","pos":[448,-1152],"size":32,"transparent":false},{"type":"block","pos":[416,-1152],"size":32,"transparent":false},{"type":"block","pos":[384,-1120],"size":32,"transparent":false},{"type":"block","pos":[736,-928],"size":32,"transparent":false},{"type":"block","pos":[896,-832],"size":32,"transparent":false},{"type":"block","pos":[864,-768],"size":32,"transparent":false},{"type":"block","pos":[800,-672],"size":32,"transparent":false},{"type":"block","pos":[736,-640],"size":32,"transparent":false},{"type":"block","pos":[736,-544],"size":32,"transparent":false},{"type":"block","pos":[544,-576],"size":32,"transparent":false},{"type":"block","pos":[544,-480],"size":32,"transparent":false},{"type":"block","pos":[704,-384],"size":32,"transparent":false},{"type":"block","pos":[736,-288],"size":32,"transparent":false},{"type":"block","pos":[640,-256],"size":32,"transparent":false},{"type":"block","pos":[448,-384],"size":32,"transparent":false},{"type":"block","pos":[832,-512],"size":32,"transparent":false},{"type":"block","pos":[576,-160],"size":32,"transparent":false},{"type":"block","pos":[544,-128],"size":32,"transparent":false},{"type":"block","pos":[512,-96],"size":32,"transparent":false},{"type":"block","pos":[704,-160],"size":32,"transparent":false}],"splashes":[],"items":[],"stores":[]}'
// world = JSON.parse(str);
world.player.king = world.creatures[0];

// Viewer
let view = {
    pos: [-320, -240],
    startPos: [0, 0],
    width: 640,
    height: 480
};

let drawList = [];

document.addEventListener("DOMContentLoaded", function () {
    let cvs = document.getElementById("game");
    let ctx = cvs.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    cvs.addEventListener("mousedown", e => {
        mouse.pos = getMousePos(cvs, e);
        mouse.startPos = getMousePos(cvs, e);
        view.startPos = [view.pos[0], view.pos[1]];

        controller.mouse = true;

        onClickHandler();
    });
    cvs.addEventListener("mousemove", e => {
        mouse.pos = getMousePos(cvs, e);
        if (controller.mouse && (!mouse.lastPos || mouse.pos[0] != mouse.lastPos[0] || mouse.pos[1] != mouse.lastPos[1])) onDragHandler();
    });
    cvs.addEventListener("mouseup", e => {
        controller.mouse = false;
        controller.dragMap = false,
        controller.dragCreature = false;
    });
    document.addEventListener("mouseup", function (e) {
        controller.mouse = false;
    });
    document.body.addEventListener("keydown", e => {
        console.log(e.code);
        if (editor.enabled) {
            if (e.code == 'KeyW') if (editor.sprite[1]) editor.sprite[1]--;
            if (e.code == 'KeyD') if (editor.sprite[0] >= 0) editor.sprite[0]++;
            if (e.code == 'KeyS') if (editor.sprite[1] >= 0) editor.sprite[1]++;
            if (e.code == 'KeyA') if (editor.sprite[0]) editor.sprite[0]--;

            if (e.code == "Digit1") editor.mode = "draw";
            if (e.code == "Digit2") editor.mode = "place";
            if (e.code == "Digit3") editor.mode = "block";

            if (e.code == "ArrowUp") editor.drawLayer = 1;
            if (e.code == "ArrowDown") editor.drawLayer = 0;

            if (e.code == "ShiftLeft") editor.viewMode = false;
            if (e.code == "ControlLeft") {
                editor.eraserMode = true;
                editor.viewMode = false;
            }
        } else {
            if (e.code == "KeyW") controller.up     = true;
            if (e.code == "KeyS") controller.down   = true;
            if (e.code == "KeyA") controller.left   = true;
            if (e.code == "KeyD") controller.right  = true;
            if (e.code == "Space") controller.use   = true;
        }

        if (e.code == "Space") {
            console.info("SAVED");
            localStorage.setItem("world", JSON.stringify(world));
        }
    });
    document.body.addEventListener("keyup", function (e) {
        if (editor.enabled) {
            if (e.code == "ShiftLeft") editor.viewMode = true;
            if (e.code == "ControlLeft") {
                editor.eraserMode = false;
                editor.viewMode = true;
            }
        } else {
            if (e.code == "KeyW") controller.up     = false;
            if (e.code == "KeyS") controller.down   = false;
            if (e.code == "KeyA") controller.left   = false;
            if (e.code == "KeyD") controller.right  = false;
            if (e.code == "Space") controller.use   = false;
        }
    });

    onEnterFrame();
    function onEnterFrame() {
        onEnterFrameHandler(cvs, ctx);
        requestAnimationFrame(onEnterFrame);
    }
});

function onEnterFrameHandler(cvs, ctx) {
    ctx.fillStyle = COLORS.BACKGROUND;
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    if (!editor.enabled) handlePlayer();

    // Draw sprites
    if (world.sprites.length) drawSprites(ctx, world.sprites);

    // Draw stores
    if (world.stores.length) drawStores(ctx, world.stores);

    // Draw creatures
    if (world.creatures.length) drawCreatures(ctx, world.creatures);

    // Draw items
    if (world.items.length) drawItems(ctx, world.items);

    // Draw projectiles
    if (world.projectiles.length) drawProjectiles(ctx, world.projectiles);

    // Draw splashes
    if (world.splashes.length) drawSplashes(ctx, world.splashes);

    // Draw blocks
    if (DEBUG) {
        if (world.blocks.length) world.blocks.forEach(block => {
            ctx.strokeStyle = (block.transparent ? "blue" : "red");
            ctx.beginPath();
            ctx.arc(block.pos[0] - view.pos[0], block.pos[1] - view.pos[1], block.size / 2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.stroke();
        });
    }

    // Draw UI
    drawUI(ctx);

    if (editor.enabled) drawEditor(ctx);
}

// function render() {
//     let drawLayers = [];
//     drawList.forEach(e => {
//         drawList[e.layer].push(e);
//     });

//     console.log(drawLayers);
// }

function drawSprites(ctx, sprites) {
    let spritesDown = sprites.filter(e => e.layer == 0);
    if (spritesDown.length) spritesDown.forEach(element => {
        if (inView(element.pos, element.size)) drawSprite(ctx, element);
    });

    let spritesUp = sprites.filter(e => e.layer == 1);
    if (spritesUp.length) spritesUp.forEach(element => {
        if (inView(element.pos, element.size)) drawSprite(ctx, element);
    });
}
function drawSprite(ctx, element) {
    let imageToDraw = element.sprite;

    if (element.animation != undefined) {
        if (element.animation != undefined) {
            element.animation += .1;
        } else {
            element.animation = 0;
        }

        ctx.save();
        ctx.translate(Math.round(element.pos[0] - view.pos[0]), Math.round(element.pos[1] - view.pos[1] + Math.round(element.size / 2)));
        ctx.rotate((Math.cos(element.animation) * 5) * Math.PI / 180);
        ctx.drawImage(TILESET, imageToDraw[0] * SPRITE_SIZE, imageToDraw[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, - Math.round(element.size / 2) , - Math.round(element.size), element.size, element.size);
        ctx.restore();
    } else {
        ctx.drawImage(TILESET, imageToDraw[0] * SPRITE_SIZE, imageToDraw[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, Math.round(element.pos[0] - Math.round(element.size / 2) - view.pos[0]), Math.round(element.pos[1] - Math.round(element.size / 2) - view.pos[1]), element.size, element.size);
    }
}

function drawProjectiles(ctx, projectiles) {
    projectiles.forEach(projectile => {
        if (projectile.life[0] != projectile.life[1]) {
            let nextPos = getNextPosByBezier(projectile.life[0] / projectile.life[1], projectile.points);        
            if (inView(projectile.pos, projectile.size)) {
                let rad = angleBetweenVectors(vNormal(vSub(projectile.pos, nextPos)), [-1,0]);
                let cf = (projectile.pos[1] < nextPos[1] ? -1 : 1);
                let angle = rad * cf * 180 / Math.PI;

                if (projectile.rotation != undefined && projectile.rotation) {
                    ctx.save();
                    ctx.translate(Math.round(projectile.pos[0] - view.pos[0]), Math.round(projectile.pos[1] - view.pos[1]));
                    ctx.rotate((-0 - angle) * Math.PI / 180);
                    if (projectile.life[0] <= Math.round(projectile.life[1] / 2)) ctx.globalAlpha = projectile.life[0] / Math.round(projectile.life[1] / 2);
                    ctx.drawImage(TILESET, projectile.sprite[0] * SPRITE_SIZE, projectile.sprite[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, - Math.round(projectile.size / 2) , - Math.round(projectile.size / 2), projectile.size, projectile.size);
                    ctx.restore();
                } else {
                    ctx.save();
                    if (projectile.life[0] <= Math.round(projectile.life[1] / 2)) ctx.globalAlpha = projectile.life[0] / Math.round(projectile.life[1] / 2);
                    ctx.drawImage(TILESET, projectile.sprite[0] * SPRITE_SIZE, projectile.sprite[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, Math.round(projectile.pos[0] - Math.round(projectile.size / 2) - view.pos[0]), Math.round(projectile.pos[1] - Math.round(projectile.size / 2) - view.pos[1]), projectile.size, projectile.size);
                    ctx.restore();
                }

                if (DEBUG) {
                    ctx.strokeStyle = "red";
                    ctx.beginPath();
                    ctx.arc(projectile.pos[0] - view.pos[0], projectile.pos[1] - view.pos[1], 3, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.stroke();

                    ctx.strokeStyle = "#magenta";
                    ctx.beginPath();
                    ctx.moveTo(projectile.pos[0] - view.pos[0], projectile.pos[1] - view.pos[1]);
                    ctx.lineTo(nextPos[0] - view.pos[0], nextPos[1] - view.pos[1]);
                    ctx.closePath();
                    ctx.stroke();
                }
            }
            projectile.pos = nextPos;

            projectile.life[0]++;
        } else {
            let foes = world.creatures.filter(creature => creature.faction != projectile.owner.faction && vLength(vSub(projectile.pos, creature.pos)) <= ((projectile.size + creature.size) / 2));
            if (foes.length) foes.forEach(foe => {
                let damage = (projectile.owner.attackDamage <= foe.hp ? projectile.owner.attackDamage : foe.hp);
                foe.hp -= damage;
                if (projectile.owner.attackPower) foe.sp = vMultScalar(vNormal(vSub(projectile.pos, foe.pos)), -projectile.owner.attackPower);

                let count = damage;
                while (count) {
                    let randomPos = [foe.pos[0] - CELL_SIZE + Math.random() * CELL_SIZE * 2, foe.pos[1] - CELL_SIZE + Math.random() * CELL_SIZE * 2];
                    world.splashes.push({
                        'pos': foe.pos,
                        'life': [0, 30],
                        'size': ICONS_SIZE,
                        'sprite': foe.healthSprite,
                        'fadeOut': true,
                        'points': [
                            foe.pos,
                            getPosBetween(foe.pos, randomPos),
                            randomPos,
                        ]
                    });

                    if (foe.onHit != undefined) foe.onHit(foe, projectile);
                    
                    count--;
                }
            })

            dropObj(projectiles, projectile);
        }
    });
}

function drawItems(ctx, items) {
    items.forEach(item => {
        if (inView(item.pos, item.size)) {
            // Join same items
            let sameItems = world.items.filter(otherItem => item != otherItem && otherItem.itemType == item.itemType && item.itemType != 'equip' && vLength(vSub(item.pos, otherItem.pos)) <= ((item.size + otherItem.size) / 2));
            if (sameItems.length) sameItems.forEach(otherItem => {
                if (item.count == undefined) item.count = 1;
                item.count += (otherItem.count != undefined ? otherItem.count : 1);

                world.splashes.push({
                    'pos': otherItem.pos,
                    'life': [0, 10],
                    'size': CELL_SIZE / 2,
                    'sprite': otherItem.sprite,
                    'fadeOut': true,
                    'points': [
                        otherItem.pos,
                        item.pos
                    ]
                });

                dropObj(items, otherItem);
            });

            let selected = false;

            if (item.spriteAnimation == undefined) item.spriteAnimation = Math.random() * 10;
            item.spriteAnimation += .1;

            // Shadow
            ctx.save();
            ctx.scale(1, .5);
            ctx.globalAlpha = .2;
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc((item.pos[0] - view.pos[0]), (item.pos[1] - view.pos[1] + CELL_SIZE / 2) * 2, (CELL_SIZE / 4) + Math.cos(item.spriteAnimation) * 2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            let scale = 1 + (item.count != undefined ? item.count / 100 : 0);
            if (scale > 2) scale = 2;
            ctx.drawImage(TILESET, item.sprite[0] * SPRITE_SIZE, item.sprite[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE,
                Math.round(item.pos[0] - Math.round(item.size * scale / 2) - view.pos[0]),
                Math.round(item.pos[1] - Math.round(item.size * scale / 2) - view.pos[1] - Math.cos(item.spriteAnimation) * 4),
                item.size * scale, item.size * scale
            );

            if (onMouseInView(item)) {
                if (item.boxAnimation == undefined) item.boxAnimation = 0;
                item.boxAnimation += .1;
                selected = true;
            } else {
                item.boxAnimation = 0;
            }

            if (selected) {
                ctx.drawImage(TILESET, SPRITES.BOX[0] * SPRITE_SIZE, SPRITES.BOX[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE,
                    Math.round(item.pos[0] - (item.size / 2) - Math.cos(item.boxAnimation) * 2 - view.pos[0]),
                    Math.round(item.pos[1] - (item.size / 2) - Math.cos(item.boxAnimation) * 2 - view.pos[1]),
                    item.size + Math.cos(item.boxAnimation) * 4, item.size + Math.cos(item.boxAnimation) * 4
                );

                if (item.title || item.count != undefined) {
                    ctx.shadowOffsetX = 1;
                    ctx.shadowOffsetY = 1;
                    ctx.shadowColor = "black";

                    ctx.font = SM_FONT;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";

                    let textToDraw = (item.count != undefined ? 'x' + item.count : item.title);
                    let measure = ctx.measureText(textToDraw);
                    ctx.save();
                    ctx.globalAlpha = .2;
                    ctx.fillStyle = 'black';
                    ctx.fillRect(item.pos[0] - view.pos[0] - Math.round((measure.width + 8) / 2), item.pos[1] - view.pos[1] - CELL_SIZE * .8 - 8, (measure.width + 8), 16);
                    ctx.restore();

                    ctx.fillStyle = (item.color ? item.color : COLORS.WHEAT);
                    ctx.fillText(textToDraw,
                        item.pos[0] - view.pos[0],
                        item.pos[1] - view.pos[1] - CELL_SIZE * .8
                    );

                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowColor = "";
                }
            }
        } else {
            if (item.spriteAnimation != undefined) item.spriteAnimation = undefined;  
        }

        let allyCreatures = world.creatures.filter(creature => creature.faction == 'ally' && vLength(vSub(item.pos, creature.pos)) <= ((item.size + creature.size) / 2));
        if (allyCreatures.length) allyCreatures.forEach(allyCreature => {
            world.splashes.push({
                'pos': item.pos,
                'life': [0, 15],
                'size': item.size,
                'sprite': item.sprite,
                'fadeOut': true,
                'points': [
                    item.pos,
                    [item.pos[0], item.pos[1] - CELL_SIZE / 2]
                ]
            });

            switch (item.itemType) {
                case "gold": {
                    world.player.gold += (item.count != undefined ? item.count : 1);
                    break;
                }
                case "weapon": {
                    allyCreature.attackDamage += (item.count != undefined ? item.count : 1);
                    break;
                }
                case "crystall": {
                    world.player.crystalls += (item.count != undefined ? item.count : 1);
                    break;
                }
                case "key": {
                    world.player.keys += (item.count != undefined ? item.count : 1);
                    break;
                }
                case "food": {
                    allyCreature.hp += (item.count != undefined ? item.count : 1);
                    break;
                }
                case "equip": {
                    if (allyCreature.equip) {
                        let randomDir = vNormal(vSub(allyCreature.pos, [allyCreature.pos[0] + (-1 + Math.random() * 2), allyCreature.pos[1] + (-1 + Math.random() * 2)]));
                        let randomPos = getNearestPos(allyCreature, getNextPos(allyCreature.pos, randomDir, Math.round(CELL_SIZE * 1.1)));

                        let itemClone = Object.assign({}, allyCreature.equip, {'pos': randomPos});

                        world.splashes.push({
                            'pos': allyCreature.pos,
                            'life': [0, 30],
                            'size': allyCreature.equip.size,
                            'sprite': itemClone.sprite,
                            'fadeIn': true,
                            'points': [
                                allyCreature.pos,
                                getPosBetween(allyCreature.pos, randomPos),
                                randomPos,
                            ],
                            'onDrop': () => world.items.push(itemClone)
                        });

                        allyCreature.equip.onUnequip(allyCreature.equip, allyCreature);
                    }

                    item.onEquip(item, allyCreature);
                    
                    allyCreature.equip = item;

                    break;
                }
            }

            dropObj(items, item);
        });
    });
}

function drawStores(ctx, stores) {
    stores.forEach(store => {
        if (store.restock[0] < store.restock[1]) store.restock[0]++;

        if (inView(store.pos, store.size)) {
            let selected = false;
            ctx.drawImage(TILESET, store.sprite[0] * SPRITE_SIZE, store.sprite[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE,
                Math.round(store.pos[0] - Math.round(store.size / 2) - view.pos[0]),
                Math.round(store.pos[1] - Math.round(store.size / 2) - view.pos[1]),
                store.size, store.size
            );

            if (onMouseInView(store)) {
                if (store.boxAnimation == undefined) store.boxAnimation = 0;
                store.boxAnimation += .1;
                selected = true;
            }

            if (selected) {
                ctx.drawImage(TILESET, SPRITES.BOX[0] * SPRITE_SIZE, SPRITES.BOX[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE,
                    Math.round(store.pos[0] - (store.size / 2) - Math.cos(store.boxAnimation) * 2 - view.pos[0]),
                    Math.round(store.pos[1] - (store.size / 2) - Math.cos(store.boxAnimation) * 2 - view.pos[1]),
                    store.size + Math.cos(store.boxAnimation) * 4, store.size + Math.cos(store.boxAnimation) * 4
                );
            }

            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.shadowColor = "black";

            if (store.spriteToReceive) {
                if (store.spriteToReceiveAnimation == undefined) store.spriteToReceiveAnimation = Math.random() * 5;
                store.spriteToReceiveAnimation += .1; 
                ctx.drawImage(TILESET, store.spriteToReceive[0] * SPRITE_SIZE, store.spriteToReceive[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, 
                    Math.round(store.pos[0] - (CELL_SIZE * (store.restock[0] / store.restock[1]) / 2) - view.pos[0]  - Math.cos(store.spriteToReceiveAnimation) * 4),
                    Math.round(store.pos[1] - (CELL_SIZE * (store.restock[0] / store.restock[1]) / 2) - view.pos[1] - Math.sin(store.spriteToReceiveAnimation) * 2),
                    CELL_SIZE * (store.restock[0] / store.restock[1]), CELL_SIZE * (store.restock[0] / store.restock[1])
                );
            }

            if (store.restock[0] == store.restock[1] && selected) {
                ctx.font = SM_FONT;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                ctx.drawImage(TILESET, store.spriteToGive[0] * SPRITE_SIZE, store.spriteToGive[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, 
                    Math.round(store.pos[0] - Math.round(CELL_SIZE / 3) - Math.round(CELL_SIZE * .25) - view.pos[0]),
                    Math.round(store.pos[1] + Math.round(CELL_SIZE / 2.5) - view.pos[1]),
                    CELL_SIZE / 2, CELL_SIZE / 2
                );
                
                ctx.fillStyle = store.color;
                ctx.fillText(store.countToGive,
                    store.pos[0] + Math.round(CELL_SIZE / 3) - view.pos[0],
                    store.pos[1] + Math.round(CELL_SIZE * .75) - view.pos[1]
                );
            }

            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowColor = "";
        }
    });
}

function drawCreatures(ctx, creatures) {
    creatures.forEach(currentCreature => {
        if (currentCreature.hp > 0) {
            if (currentCreature.startPos == undefined) currentCreature.startPos = currentCreature.pos;
            // AI
            if (currentCreature.faction != world.player.faction && currentCreature.speed) {
                if (currentCreature.attackDamage) {
                    let foe = null;
                    let closestDistance = null;
                    creatures.forEach(otherCreature => {
                        if (currentCreature == otherCreature) return;
                        if (vLength(vSub(currentCreature.pos, otherCreature.pos)) <= DEFAULT_SIGHT && currentCreature.enemyFactions.indexOf(otherCreature.faction) != -1 && isReachable(currentCreature, [otherCreature.pos[0], otherCreature.pos[1]])) {
                            let currentDistance = vLength(vSub(currentCreature.pos, otherCreature.pos));
                            if (!foe || currentDistance < closestDistance) {
                                closestDistance = currentDistance;
                                foe = otherCreature;
                            }
                        }
                    });

                    if (foe && Math.random() >= .9 && Math.round(vLength(vSub(currentCreature.pos, foe.pos))) > currentCreature.attackRange) {
                        currentCreature.target = getNextPos(foe.pos, vNormal(vSub(foe.pos, currentCreature.pos)), currentCreature.attackRange);
                    }

                    // Attack nearest foes
                    if (AI && currentCreature.attackDamage) {
                        if (foe && vLength(vSub(currentCreature.pos, foe.pos)) <= currentCreature.attackRange + (CELL_SIZE / 4) && currentCreature.attack[0] == currentCreature.attack[1]) {
                            let projectileTargetPos = foe.pos;
                            if (foe.target && Math.random() >= .5) projectileTargetPos = getNearestPos(foe, getNextPos(foe.pos, vNormal(vSub(foe.pos, foe.target)), 20));
                            createProjectile(currentCreature, projectileTargetPos);
                        }
                    }
                }

                if (Math.random() <= .01) {
                    let newDir = vNormal(vSub(currentCreature.pos, [currentCreature.pos[0] - 1 + Math.random() * 2, currentCreature.pos[1] - 1 + Math.random() * 2]));
                    let newPos = getNearestPos(currentCreature, getNextPos(currentCreature.startPos, newDir, CELL_SIZE + (CELL_SIZE * Math.random() * 3)));
                    currentCreature.target = newPos;
                }
            }

            // Move
            let moving = false;
            if (currentCreature.speed && currentCreature.target && (Math.round(currentCreature.pos[0]) != Math.round(currentCreature.target[0]) || Math.round(currentCreature.pos[1]) != Math.round(currentCreature.target[1]))) {
                if (Math.round(vLength(vSub(currentCreature.pos, currentCreature.target))) > currentCreature.speed) {
                    let nextPos = getNextPos(currentCreature.pos, vNormal(vSub(currentCreature.pos, currentCreature.target)), currentCreature.speed);
                    currentCreature.pos = nextPos;

                    // if (!emotion && player != currentCreature) emotion = [SPRITE_SIZE * 5, SPRITE_SIZE * 12];

                    if (DEBUG || currentCreature.faction == world.player.faction) {
                        ctx.strokeStyle = "#00FF00";
                        ctx.beginPath();
                        ctx.moveTo(currentCreature.pos[0] - view.pos[0], currentCreature.pos[1] - view.pos[1]);
                        ctx.lineTo(currentCreature.target[0] - view.pos[0], currentCreature.target[1] - view.pos[1]);
                        ctx.closePath();
                        ctx.stroke();
                        ctx.strokeStyle = "#00FF00";
                        ctx.beginPath();
                        ctx.arc(currentCreature.target[0] - view.pos[0], currentCreature.target[1] - view.pos[1], currentCreature.size / 2, 0, Math.PI * 2, true);
                        ctx.closePath();
                        ctx.stroke();
                    }

                    if (currentCreature.faction == world.player.faction) {
                        ctx.drawImage(TILESET, SPRITES.BOX[0] * SPRITE_SIZE, SPRITES.BOX[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE,
                            Math.round(currentCreature.target[0] - (CELL_SIZE / 2) - view.pos[0]),
                            Math.round(currentCreature.target[1] - (CELL_SIZE / 2) - view.pos[1]),
                            CELL_SIZE,
                            CELL_SIZE
                        );
                    }

                    moving = true;
                } else {
                    currentCreature.target = undefined;
                }
            }

            // Speed
            if (currentCreature.speed && currentCreature.sp && (currentCreature.sp[0] != 0 || currentCreature.sp[1] != 0)) {
                currentCreature.pos = vAdd(currentCreature.pos, currentCreature.sp);
                
                currentCreature.sp = vMultScalar(currentCreature.sp, .9);
                if (Math.abs(currentCreature.sp[0]) <= .05) currentCreature.sp[0] = 0;
                if (Math.abs(currentCreature.sp[1]) <= .05) currentCreature.sp[1] = 0;
            }

            // Collide
            let col = false;
            let obstacles = [].concat(creatures, world.blocks, world.stores);
            obstacles.forEach(function (obstacle) {
                if (currentCreature == obstacle) return;
                let distanceBetween = vLength(vSub(currentCreature.pos, obstacle.pos));
                let closestDistance = (currentCreature.size + obstacle.size) / 2;
                if (distanceBetween < closestDistance) {
                    col = true;
                    let dir = vNormal(vSub(currentCreature.pos, obstacle.pos));
                    let newPos = [];
                    if (obstacle.type == "creature") {
                        newPos = getNextPos(currentCreature.pos, vMultScalar(dir, -1), Math.ceil((closestDistance - distanceBetween)) / (obstacle.speed ? 2 : 1));
                        currentCreature.pos = newPos;
                    } else if (obstacle.type == "block" || obstacle.type == "store" || obstacle.type == "item" && obstacle.solid) {
                        newPos = getNextPos(currentCreature.pos, vMultScalar(dir, -1), Math.round((closestDistance - distanceBetween)));
                        currentCreature.pos = newPos;
                    }

                    if (DEBUG) {
                        ctx.strokeStyle = "gold";
                        ctx.beginPath();
                        ctx.moveTo(currentCreature.pos[0] - view.pos[0], currentCreature.pos[1] - view.pos[1]);
                        ctx.lineTo(newPos[0] - view.pos[0], newPos[1] - view.pos[1]);
                        ctx.closePath();
                        ctx.stroke();

                        ctx.beginPath();
                        ctx.arc(newPos[0] - view.pos[0], newPos[1] - view.pos[1], 5, 0, Math.PI * 2, true);
                        ctx.closePath();
                        ctx.stroke();
                    }
                }
            });

            // Prepare to attack
            if (currentCreature.attackDamage && currentCreature.attack[0] < currentCreature.attack[1]) currentCreature.attack[0]++;

            // Draw
            if (inView(currentCreature.pos, currentCreature.size)) {
                let selected = false;
                let sizeScale = 1;
                if (currentCreature.sizeScaleLimit) sizeScale = (currentCreature.hp < currentCreature.sizeScaleLimit ?  1 + (currentCreature.hp / currentCreature.sizeScaleLimit) : 2);
                let trueSize = currentCreature.size * sizeScale;

                if (onMouseInView(currentCreature)) {
                    if (currentCreature.boxAnimation == undefined) currentCreature.boxAnimation = 0;
                    currentCreature.boxAnimation += .1;
                    selected = true;
                }
                
                if (currentCreature.speed) {
                    if (currentCreature.moveAnimation == undefined) {
                        currentCreature.moveAnimation = Math.random() * 5;
                    } else {
                        currentCreature.moveAnimation += .1;
                    }
                } else {
                    currentCreature.moveAnimation = 0;
                }

                // Shadow
                ctx.save();
                ctx.scale(1, .5);
                ctx.globalAlpha = .2;
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.arc((currentCreature.pos[0] - view.pos[0]), (currentCreature.pos[1] - view.pos[1] + CELL_SIZE / 2) * 2, (CELL_SIZE / 4), 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fill();
                ctx.restore();

                if (moving) {
                    ctx.save();
                    ctx.translate(Math.round(currentCreature.pos[0] - view.pos[0]), Math.round(currentCreature.pos[1] - view.pos[1] + Math.round(trueSize / 2)));
                    ctx.rotate((Math.cos(currentCreature.moveAnimation) * 5) * Math.PI / 180);
                    ctx.drawImage(TILESET, currentCreature.sprite[0] * SPRITE_SIZE, currentCreature.sprite[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE,
                        - Math.round(trueSize / 2),
                        - Math.round(trueSize),
                        trueSize, trueSize
                    );
                    ctx.restore();
                } else {
                    ctx.drawImage(TILESET, currentCreature.sprite[0] * SPRITE_SIZE, currentCreature.sprite[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE,
                        Math.round(currentCreature.pos[0] - (trueSize / 2) - view.pos[0]),
                        Math.round(currentCreature.pos[1] - (trueSize / 2) - Math.cos(currentCreature.moveAnimation) - view.pos[1]),
                        trueSize, trueSize + Math.cos(currentCreature.moveAnimation)
                    );
                }

                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;
                ctx.shadowColor = "black";

                ctx.font = SM_FONT;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                if (selected) {
                    ctx.drawImage(TILESET, SPRITES.BOX[0] * SPRITE_SIZE, SPRITES.BOX[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE,
                        Math.round(currentCreature.pos[0] - (trueSize / 2) - Math.cos(currentCreature.boxAnimation) * 2 - view.pos[0]),
                        Math.round(currentCreature.pos[1] - (trueSize / 2) - Math.cos(currentCreature.boxAnimation) * 2 - view.pos[1]),
                        trueSize + Math.cos(currentCreature.boxAnimation) * 4, trueSize + Math.cos(currentCreature.boxAnimation) * 4
                    );
                }

                if (currentCreature.hp != undefined) {
                    ctx.drawImage(TILESET, currentCreature.healthSprite[0] * SPRITE_SIZE, currentCreature.healthSprite[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, 
                        Math.round(currentCreature.pos[0] - Math.round(CELL_SIZE / 3) - Math.round(CELL_SIZE * .25) - view.pos[0]),
                        Math.round(currentCreature.pos[1] + Math.round(CELL_SIZE / 2.2) - view.pos[1]),
                        CELL_SIZE / 2, CELL_SIZE / 2
                    );
                    ctx.fillStyle = currentCreature.color;
                    ctx.fillText(currentCreature.hp,
                        currentCreature.pos[0] + Math.round(CELL_SIZE / 3) - view.pos[0],
                        currentCreature.pos[1] + Math.round(CELL_SIZE * .75) - view.pos[1]
                    );
                }

                if (selected && currentCreature.attackDamage) {
                    ctx.drawImage(TILESET, SPRITES.SWORD[0] * SPRITE_SIZE, SPRITES.SWORD[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, 
                        Math.round(currentCreature.pos[0] - Math.round(CELL_SIZE / 3) - Math.round(CELL_SIZE * .25) - view.pos[0]),
                        Math.round(currentCreature.pos[1] + Math.round(CELL_SIZE / 2.5) * 2.5 - view.pos[1]),
                        CELL_SIZE / 2, CELL_SIZE / 2
                    );
                    ctx.fillStyle = COLORS.GRAY;
                    ctx.fillText((currentCreature.hp <= currentCreature.attackRepeatMulti ? currentCreature.attackDamage : currentCreature.attackDamage + '*' + Math.ceil(currentCreature.hp / currentCreature.attackRepeatMulti)),
                        currentCreature.pos[0] + Math.round(CELL_SIZE / 3) - view.pos[0],
                        currentCreature.pos[1] + Math.round(CELL_SIZE * .75) + Math.round(CELL_SIZE / 2) - view.pos[1]
                    );
                }

                if (currentCreature.king != undefined && currentCreature.king) {
                    if (currentCreature.kingAnimation == undefined) currentCreature.kingAnimation = Math.random() * 10;
                    currentCreature.kingAnimation += .1;

                    ctx.drawImage(TILESET, SPRITES.CROWN[0] * SPRITE_SIZE, SPRITES.CROWN[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, 
                        Math.round(currentCreature.pos[0] - Math.round(CELL_SIZE / 2) - view.pos[0]  - Math.cos(currentCreature.kingAnimation) * 2),
                        Math.round(currentCreature.pos[1] - Math.round(CELL_SIZE * 1.5) - view.pos[1] - Math.sin(currentCreature.kingAnimation) * 2),
                        CELL_SIZE, CELL_SIZE
                    );

                    if (selected) {
                        //
                    }
                }

                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowColor = "";

                if (DEBUG) {
                    ctx.strokeStyle = (col ? "gold" : "lime");
                    ctx.beginPath();
                    ctx.arc(currentCreature.pos[0] - view.pos[0], currentCreature.pos[1] - view.pos[1], currentCreature.size / 2, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.stroke();
                }
            }
        } else {
            if (currentCreature.onDrop != undefined) currentCreature.onDrop(currentCreature);

            dropObj(world.creatures, currentCreature);
        }
    });
}

function drawSplashes(ctx, splashes) {
    splashes.forEach(function (splash) {
        if (splash.life[0] != splash.life[1]) {
            let nextPos = undefined;
            if (splash.points != undefined && splash.points.length) nextPos = getNextPosByBezier(splash.life[0] / splash.life[1], splash.points);

            if (inView(splash.pos, splash.size)) {
                ctx.save();
                if (splash.fadeIn != undefined && splash.fadeIn && splash.life[0] <= Math.round(splash.life[1] / 2)) ctx.globalAlpha = splash.life[0] / Math.round(splash.life[1] / 2);
                if (splash.fadeOut != undefined && splash.fadeOut && splash.life[0] >= Math.round(splash.life[1] / 2)) ctx.globalAlpha = 1 - (splash.life[0] - Math.round(splash.life[1] / 2)) / Math.round(splash.life[1] / 2);
                if (splash.sprite) {
                    if (splash.spriteRotation != undefined && splash.spriteRotation) {
                        let rad = angleBetweenVectors(vNormal(vSub(splash.pos, nextPos)), [-1,0]);
                        let cf = (splash.pos[1] < nextPos[1] ? -1 : 1);
                        let angle = rad * cf * 180 / Math.PI;
    
                        ctx.translate(Math.round(splash.pos[0] - view.pos[0]), Math.round(splash.pos[1] - view.pos[1]));
                        ctx.rotate((-0 - angle) * Math.PI / 180);
                        ctx.drawImage(TILESET, splash.sprite[0] * SPRITE_SIZE, splash.sprite[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE,
                            - Math.round(splash.size / 2),
                            - Math.round(splash.size / 2),
                            splash.size, splash.size
                        );
                    } else {
                        ctx.drawImage(TILESET, splash.sprite[0] * SPRITE_SIZE, splash.sprite[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE,
                            Math.round(splash.pos[0] - view.pos[0] - (splash.size / 2)),
                            Math.round(splash.pos[1] - view.pos[1] - (splash.size / 2)),
                            splash.size, splash.size
                        );
                    }
                } else {
                    ctx.font = MD_FONT;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = splash.color;
                    ctx.shadowOffsetX = 1;
                    ctx.shadowOffsetY = 1;
                    ctx.shadowColor = "black";
                    ctx.fillText(splash.text.substr(0, Math.ceil(splash.text.length * (splash.life[0] / Math.ceil(splash.life[1] / 4)))), splash.pos[0] - view.pos[0], splash.pos[1] - view.pos[1] - CELL_SIZE / 2);
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowColor = "";
                }
                ctx.restore();
            }

            if (nextPos) splash.pos = nextPos;
            splash.life[0]++;
        } else {
            if (splash.onDrop) splash.onDrop();
            dropObj(splashes, splash);
        }
    });
}

// EDITOR
function drawEditor(ctx) {
    let size = 9;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            ctx.fillStyle = COLORS.BACKGROUND;
            ctx.fillRect(editor.pos[0] + i * EDITOR_CELL_SIZE, editor.pos[1] + j * EDITOR_CELL_SIZE, EDITOR_CELL_SIZE, EDITOR_CELL_SIZE);
            ctx.drawImage(TILESET,
                (editor.sprite[0] - Math.floor(size / 2) + i) * SPRITE_SIZE,
                (editor.sprite[1] - Math.floor(size / 2) + j) * SPRITE_SIZE,
                SPRITE_SIZE, SPRITE_SIZE,
                editor.pos[0] + i * EDITOR_CELL_SIZE,
                editor.pos[1] + j * EDITOR_CELL_SIZE,
                EDITOR_CELL_SIZE, EDITOR_CELL_SIZE
            );

        }
    }
    ctx.strokeStyle = 'YELLOW';
    ctx.strokeRect(
        Math.round(editor.pos[0] + Math.floor(size / 2) * EDITOR_CELL_SIZE) - .5,
        Math.round(editor.pos[1] + Math.floor(size / 2) * EDITOR_CELL_SIZE) - .5,
        EDITOR_CELL_SIZE, EDITOR_CELL_SIZE
    );
    
    ctx.font = MD_FONT;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    ctx.save();

    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowColor = "black";

    ctx.fillStyle = 'wheat';
    ctx.fillText(editor.mode,
        CELL_SIZE,
        Math.round(CELL_SIZE * 5 + (CELL_SIZE / 2))
    );
    ctx.fillText("L:" + editor.drawLayer,
        CELL_SIZE * 3,
        Math.round(CELL_SIZE * 5 + (CELL_SIZE / 2))
    );
    ctx.fillText("S: [" + editor.sprite[0] + ", " + editor.sprite[1] + "]",
        CELL_SIZE * 5,
        Math.round(CELL_SIZE * 5 + (CELL_SIZE / 2))
    );

    ctx.fillStyle = (editor.viewMode ? "LIME" : "CRIMSON");
    ctx.fillText("MOVE",
        CELL_SIZE,
        Math.round(CELL_SIZE * 6 + (CELL_SIZE / 2))
    );
    ctx.fillStyle = (editor.eraserMode ? "LIME" : "CRIMSON");
    ctx.fillText("ERASE",
        CELL_SIZE * 3,
        Math.round(CELL_SIZE * 6 + (CELL_SIZE / 2))
    );

    ctx.restore();
}

function drawUI(ctx) {
    if (!editor.enabled) view.pos = [world.player.king.pos[0] - (view.width / 2), world.player.king.pos[1] - (view.height / 2)];

    ctx.font = MD_FONT;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowColor = "black";

    if (world.player.gold) {
        ctx.drawImage(TILESET, SPRITES.COIN[0] * SPRITE_SIZE, SPRITES.COIN[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, 
            CELL_SIZE - Math.round(CELL_SIZE / 2),
            CELL_SIZE - Math.round(CELL_SIZE / 2),
            CELL_SIZE, CELL_SIZE
        );
        ctx.fillStyle = 'wheat';
        ctx.fillText(world.player.gold,
            CELL_SIZE * 2,
            CELL_SIZE
        );
    }

    if (world.player.crystalls) {
        ctx.drawImage(TILESET, SPRITES.CRYSTALL[0] * SPRITE_SIZE, SPRITES.CRYSTALL[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, 
            CELL_SIZE - Math.round(CELL_SIZE / 2),
            (CELL_SIZE * 2) - Math.round(CELL_SIZE / 2),
            CELL_SIZE, CELL_SIZE
        );
        ctx.fillStyle = COLORS.BLUE;
        ctx.fillText(world.player.crystalls,
            CELL_SIZE * 2,
            CELL_SIZE * 2
        );
    }

    if (world.player.keys) {
        ctx.drawImage(TILESET, SPRITES.KEY[0] * SPRITE_SIZE, SPRITES.KEY[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, 
            CELL_SIZE - Math.round(CELL_SIZE / 2),
            (CELL_SIZE * 3) - Math.round(CELL_SIZE / 2),
            CELL_SIZE, CELL_SIZE
        );
        ctx.fillStyle = COLORS.GOLD;
        ctx.fillText(world.player.keys,
            CELL_SIZE * 2,
            CELL_SIZE * 3
        );
    }

    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowColor = "";
}

function onClickHandler() {
    mouse.lastPos = mouse.pos;
    let viewMousePos = vAdd(mouse.pos, view.pos);
    let viewMouseStartPos = vAdd(mouse.startPos, view.pos);
    let viewMousePosDelta = vSub(viewMouseStartPos, viewMousePos);

    if (editor.enabled) {
        if (editor.viewMode) {
            controller.dragMap = true;
        } else {
            handleEditor();
        }
    } else {
        let handled = false;

        // Creatures
        if (!handled) {
            let creaturesInView = world.creatures.filter(creature => inView(creature.pos, creature.size) && onMouseInView(creature));
            if (creaturesInView.length) creaturesInView.forEach(creature => {
                controller.dragCreature = creature;
                handled = true;

                world.splashes.push({
                    'pos': [creature.pos[0], creature.pos[1]],
                    'life': [0, 45],
                    'size': CELL_SIZE / 2,
                    'text': 'Go!',
                    'color': "white",
                    'fadeOut': true
                });
            });
        }

        // Stores
        if (!handled) {
            let storesInView = world.stores.filter(store => inView(store.pos, store.size) && onMouseInView(store));
            if (storesInView.length) storesInView.forEach(store => {
                handled = true;
                if (store.onClick != undefined) store.onClick(store);
            });
        }

        // Items
        if (!handled) {
            let itemsInView = world.items.filter(item => item.itemType == 'equip' && inView(item.pos, item.size) && onMouseInView(item));
            if (itemsInView.length) itemsInView.forEach(item => {
                handled = true;
                if (item.onClick != undefined) item.onClick(item);
            });
        }
        //if (!handled && DEBUG) {
            //     let randomDir = vNormal(vSub(viewMousePos, [viewMousePos[0] + (-1 + Math.random() * 2), viewMousePos[1] + (-1 + Math.random() * 2)]));
            //     let randomPos = getNextPos(viewMousePos, randomDir, CELL_SIZE);
        
            //     world.splashes.push({
            //         'pos': viewMousePos,
            //         'life': [0, 30],
            //         'size': ITEMS_SIZE_SM,
            //         'sprite': SPRITES.MEAT,
            //         'fadeIn': true,
            //         'points': [
            //             viewMousePos,
            //             getPosBetween(viewMousePos, randomPos),
            //             randomPos,
            //         ],
            //         'onDrop': () => world.items.push({
            //             'type': 'item',
            //             'itemType': 'food',
            //             'pos': randomPos,
            //             'sprite': SPRITES.MEAT,
            //             'size': ITEMS_SIZE_SM,
            //             'animation': 0,
            //         })
            //     });
            // }
    }
}
function onDragHandler() {
    mouse.lastPos = mouse.pos;
    let viewMousePos = vAdd(mouse.pos, view.pos);
    let viewMouseStartPos = vAdd(mouse.startPos, view.pos);
    let viewMousePosDelta = vSub(viewMouseStartPos, viewMousePos);

    if (editor.enabled && !editor.viewMode) {
        handleEditor();  
    } else {
        // Game && editor view control
        // view.pos = vAdd(view.startPos, viewMousePosDelta);
    }
    if (controller.dragCreature) controller.dragCreature.target = getNearestPos(controller.dragCreature, viewMousePos, true);
    if (controller.dragMap) view.pos = vAdd(view.startPos, viewMousePosDelta);
}

function handlePlayer() {
    if (controller.up || controller.down || controller.left || controller.right) {
        let target = [0, 0];

        if (controller.up) target[1] = -1;
        if (controller.down) target[1] = 1;
        if (controller.left) target[0] = -1;
        if (controller.right) target[0] = 1;

        let dir = vNormal(vSub(world.player.king.pos, vAdd(world.player.king.pos, target)));
        world.player.king.target = getNextPos(world.player.king.pos, dir, CELL_SIZE / 3);
    } else {
        world.player.king.target = [];
    }

    let viewMousePos = vAdd(mouse.pos, view.pos);
    if (controller.mouse &&
            world.player.king.attack[0] == world.player.king.attack[1] &&
            vLength(vSub(world.player.king.pos, viewMousePos)) <= world.player.king.attackRange &&
            isReachable(world.player.king, [viewMousePos[0], viewMousePos[1]])) {

        // let dir = vNormal(vSub(world.player.king.pos, vAdd(mouse.pos, view.pos)));
        // let nextPos = getNextPos(world.player.king.pos, dir, world.player.king.attackRange);
        createProjectile(world.player.king, viewMousePos);
    }
}
function handleEditor() {
    mouse.lastPos = mouse.pos;
    let viewMousePos = vAdd(mouse.pos, view.pos);

    // Editor
    let viewMousePosGrid = [Math.floor((viewMousePos[0] + (CELL_SIZE / 2)) / CELL_SIZE) * CELL_SIZE, Math.floor((viewMousePos[1] + (CELL_SIZE / 2)) / CELL_SIZE) * CELL_SIZE];
        
    switch (editor.mode) {
        case "draw": {
            let objectsToReplace = world.sprites.filter(e => e.pos[0] == viewMousePosGrid[0] && e.pos[1] == viewMousePosGrid[1] && e.layer == editor.drawLayer);
            if (objectsToReplace.length) objectsToReplace.forEach(e => dropObj(world.sprites, e));

            if (!editor.eraserMode) world.sprites.push({
                'pos': viewMousePosGrid,
                'sprite': [editor.sprite[0], editor.sprite[1]],
                'size': CELL_SIZE,
                'layer': editor.drawLayer,
                'animation': (editor.drawAnimate ? 0 : null)
            });

            break;
        }

        case "place": {
            let objectsToReplace = world.creatures.filter(e => e.pos[0] == viewMousePosGrid[0] && e.pos[1] == viewMousePosGrid[1]);
            if (objectsToReplace.length) objectsToReplace.forEach(e => dropObj(world.items, e));
            
            if (!editor.eraserMode) world.creatures.push({
                'type': 'creature',
                'pos': viewMousePosGrid,
                'sprite': [editor.sprite[0], editor.sprite[1]],
                'healthSprite': SPRITES.HELMET,
                'size': CELL_SIZE,
                'sizeScaleLimit': 1000,
                'target': null,
                'speed': 2,
                'hp': 1,
                'attack': [30, 30],
                'attackRepeat': 0,
                'attackRepeatMulti': 10000,
                'attackDamage': 0,
                'attackRange': CELL_SIZE * 1.2,
                'attackPower': -1,
                'attackType': 'melee',
                'attackSprite': SPRITES.PR_SWORD,
                'attackRotation': true,
                'faction': 'ally',
                'king': true,
                'enemyFactions': [
                    'evil',
                    'orcs',
                    'mine'
                ],
                'color': '#cddc39'
            });

            break;
        }

        case "block": {
            let objectsToReplace = world.blocks.filter(e => e.pos[0] == viewMousePosGrid[0] && e.pos[1] == viewMousePosGrid[1]);
            if (objectsToReplace.length) objectsToReplace.forEach(e => dropObj(world.blocks, e));

            if (!editor.eraserMode) world.blocks.push({
                'type': 'block',
                'pos': viewMousePosGrid,
                'size': CELL_SIZE,
                'transparent': false
            });

            break;
        }
    }
}

function onMouse(obj) {
    return (mouse.pos != null && mouse.pos[0] >= obj.pos[0] - (obj.size / 2) && mouse.pos[0] <= obj.pos[0] + (obj.size / 2) && mouse.pos[1] >= obj.pos[1] - (obj.size / 2) && mouse.pos[1] <= obj.pos[1] + (obj.size / 2));
}
function onMouseInView(obj) {
    let viewMousePos = vAdd(mouse.pos, view.pos);
    return (mouse.pos != null && viewMousePos[0] >= obj.pos[0] - (obj.size / 2) && viewMousePos[0] <= obj.pos[0] + (obj.size / 2) && viewMousePos[1] >= obj.pos[1] - (obj.size / 2) && viewMousePos[1] <= obj.pos[1] + (obj.size / 2));
}
function inView(pos, size) {
    return (pos[0] + (size / 2)) >= view.pos[0] && (pos[0] - (size / 2)) <= view.pos[0] + view.width && (pos[1] + (size / 2)) > view.pos[1] && (pos[1] - (size / 2)) <= view.pos[1] + view.height;
}
function dropObj(objArray, objToDrop) {
    for (i = 0; i < objArray.length; i++) if (objArray[i] == objToDrop) objArray.splice(i, 1);
}
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return [Math.round(evt.clientX - rect.left), Math.round(evt.clientY - rect.top)];
}
let getNextPos = (pos, dir, speed) => vAdd(pos, vMultScalar(dir, -1 * speed));
let getPosBetween = (posStart, posEnd) => [posStart[0] + (posEnd[0] - posStart[0]) / 2, (posEnd[1] > posStart[1] ? posStart[1] : posEnd[1]) - CELL_SIZE * 2];
function isReachable(creature, targetPos) {
    let nearestPos = getNearestPos(creature, targetPos, true);
    return Math.floor(vLength(vSub(nearestPos, targetPos))) == 0;
}
function getNearestPos(creature, targetPos, ignoreTransparent) {
    if (ignoreTransparent == undefined) ignoreTransparent = false;

    let stepSize = 1;
    let canMove = true;

    let obstacles = world.blocks.filter(obstacle => !ignoreTransparent || ignoreTransparent && !obstacle.transparent);
    let nextPos = getNextPos(creature.pos, vNormal(vSub(creature.pos, targetPos)), stepSize);
    while (canMove && vLength(vSub(nextPos, targetPos)) > stepSize) {
        obstacles.forEach(block => {
            if (canMove && vLength(vSub(nextPos, block.pos)) <= (creature.size + block.size) / 2 - 2) canMove = false; 
        });
        if (canMove) nextPos = getNextPos(nextPos, vNormal(vSub(nextPos, targetPos)), stepSize);
    }

    return nextPos;
}

function addDamageSplash(foePos, healthSprite) {
    world.splashes.push({
        'pos': foePos,
        'life': [0, 30],
        'size': CELL_SIZE / 2,
        // 'text': -damage,
        // 'color': 'red',
        'sprite': healthSprite,
        'points': [
            foePos,
            [foePos[0] + (CELL_SIZE / 2), foePos[1] - (CELL_SIZE / 2)],
            [foePos[0] + (CELL_SIZE * .75), foePos[1] - (CELL_SIZE / 4)],
        ],
        'fadeOut': true
    });
}
function createProjectile(owner, projectileTargetPos) {
    owner.attack[0] = 0;

    switch (owner.attackType) {
        case "melee": {
            world.projectiles.push({
                'owner': owner,
                'pos': owner.pos,
                'sprite': owner.attackSprite,
                'size': CELL_SIZE,
                'points': [
                    owner.pos,
                    [projectileTargetPos[0] - (CELL_SIZE / 4) + (Math.random() * (CELL_SIZE / 2)), projectileTargetPos[1] - (CELL_SIZE / 4) + (Math.random() * (CELL_SIZE / 2))]
                ],
                'life': [0, 10],
                'rotation': owner.attackRotation
            });

            break;
        }

        case "ranged": {
            world.projectiles.push({
                'owner': owner,
                'pos': owner.pos,
                'sprite': owner.attackSprite,
                'size': CELL_SIZE,
                'points': [
                    owner.pos,
                    getPosBetween(owner.pos, projectileTargetPos),
                    [projectileTargetPos[0] - (CELL_SIZE / 4) + (Math.random() * (CELL_SIZE / 2)), projectileTargetPos[1] - (CELL_SIZE / 4) + (Math.random() * (CELL_SIZE / 2))]
                ],
                'life': [0, 45],
                'rotation': owner.attackRotation
            });
            break;
        }
    }
}