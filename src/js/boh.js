const CELL_SIZE = 16 * 2;
const SPRITE_SIZE = 16;

const TILESET = new Image();
// TILESET.src = "src/media/colored_tilemap_packed.png";
TILESET.src = "src/media/tileset.png";

const SM_FONT = "bold 10pt monospace";
const MD_FONT = "bold 12pt monospace";
const BG_FONT = "bold 16pt monospace";

const COLORS = {
    BACKGROUND: "#263238",
    GOLD: "#FFE228",
    GRAY: "#eceff1",
    BLUE: "#5DE0E2",
    GOOD: "lime",
    BAD: "#ff5722"
}

const SPRITES = {
    COIN: [15, 7],
    HEART: [16, 7],
    SWORD: [15, 8],
    HELMET: [16, 8],
    CROWN: [16, 9],
    MEAT: [17, 7],
    ORE: [17, 8],
    ORE_MINE: [4, 6],
    CRYSTALL: [17, 9],
    CRYSTALL_MINE: [5, 7],
    GOLD_MINE: [3, 7],
    HOUSE_01: [3, 3],
    TOMB_01: [6, 3],
    ROGUE: [1, 5],
    PR_SWORD: [17, 4],
    PR_KNIFE: [17, 3],
    SIGN_01: [7, 9],
    SIGN_02: [7, 8],
    PEASANT: [2, 9],
    SKELETON: [1, 8]
}

const DEFAULT_SIGHT = CELL_SIZE * 5;

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
    'mode': 'view',
    'drawLayer': 0,
    'drawAnimate': 0,
    'eraserMode': false,
    'pos': [0, 0],
    'elements': [
        {
            'pos': [CELL_SIZE, CELL_SIZE],
            'size': CELL_SIZE,
            'active': true,
            'selected': false,
            'sprite': [10, 10],
            'mode': 'view',
            'layer': 0
        },
        {
            'pos': [CELL_SIZE + (CELL_SIZE + 4) * 1, CELL_SIZE],
            'size': CELL_SIZE,
            'active': false,
            'selected': false,
            'sprite': [11, 1],
            'mode': 'draw',
            'drawLayer': 0,
            'layer': 0
        },
        {
            'pos': [CELL_SIZE + (CELL_SIZE + 4) * 1, CELL_SIZE + (CELL_SIZE + 4) * 1],
            'size': CELL_SIZE,
            'active': false,
            'selected': false,
            'sprite': [13, 0],
            'mode': 'draw',
            'drawLayer': 1,
            'layer': 0
        },
        {
            'pos': [CELL_SIZE + (CELL_SIZE + 4) * 1, CELL_SIZE + (CELL_SIZE + 4) * 2],
            'size': CELL_SIZE / 2,
            'active': false,
            'selected': false,
            'sprite': [17, 2],
            'mode': 'animate',
            'toggle': true,
            'layer': 2
        },
        {
            'pos': [CELL_SIZE + (CELL_SIZE + 4) * 2, CELL_SIZE],
            'size': CELL_SIZE,
            'active': false,
            'selected': false,
            'sprite': [1, 7],
            'mode': 'place',
            'layer': 0
        },
        {
            'pos': [CELL_SIZE + (CELL_SIZE + 4) * 0, CELL_SIZE + (CELL_SIZE + 4) * 1],
            'size': CELL_SIZE / 2,
            'active': false,
            'selected': false,
            'sprite': [15, 1],
            'mode': 'erase',
            'toggle': true,
            'layer': 1
        },
        {
            'pos': [CELL_SIZE + (CELL_SIZE + 4) * 3, CELL_SIZE],
            'size': CELL_SIZE / 2,
            'active': false,
            'selected': false,
            'sprite': [18, 0],
            'mode': 'test',
            'layer': 0
        },
    ]
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
            'ore': 0,
            'crystalls': 0
        },
        'sprites': [
            {
                'pos': [0, 0],
                'sprite': [1, 1],
                'size': CELL_SIZE,
                'layer': 0
            }
        ],
        'creatures': [
            // Герой
            {
                'type': 'creature',
                'pos': [CELL_SIZE * 0, CELL_SIZE * 0],
                'sprite': SPRITES.PEASANT,
                'healthSprite': SPRITES.HELMET,
                'size': CELL_SIZE,
                'sizeScaleLimit': 1000,
                'target': null,
                'speed': 2,
                'hp': 1,
                'attack': [30, 30],
                'attackRepeat': 0,
                'attackRepeatMulti': 50,
                'attackDamage': 0,
                'attackRange': CELL_SIZE * 1.2,
                'attackPower': -1,
                'attackType': 'melee',
                'attackSprite': SPRITES.PR_SWORD,
                'attackRotation': true,
                'faction': 'ally',
                'enemyFactions': [
                    'evil',
                    'orcs',
                    'mine'
                ],
                'color': '#cddc39'
            },
            // вор
            {
                'type': 'creature',
                'pos': [CELL_SIZE * 0, CELL_SIZE * -3],
                'sprite': SPRITES.ROGUE,
                'healthSprite': SPRITES.HELMET,
                'size': CELL_SIZE,
                'sizeScaleLimit': 1000,
                'target': null,
                'speed': 2,
                'hp': 10,
                'attack': [45, 45],
                'attackRepeat': 0,
                'attackRepeatMulti': 5,
                'attackDamage': 1,
                'attackRange': CELL_SIZE * 1.2,
                'attackPower': -1,
                'attackType': 'melee',
                'attackSprite': SPRITES.PR_KNIFE,
                'attackRotation': true,
                'faction': 'evil',
                'enemyFactions': [
                    'ally',
                    'orcs'
                ],
                'color': COLORS.GRAY
            },
            // Орочий босс
            {
                'type': 'creature',
                'pos': [CELL_SIZE * 10, CELL_SIZE * 0],
                'sprite': [0, 4],
                'healthSprite': SPRITES.HEART,
                'size': CELL_SIZE,
                'sizeScaleLimit': 500,
                'target': null,
                'speed': 2,
                'hp': 500,
                'king': true,
                'kingAnimation': 0,
                'attack': [45, 45],
                'attackRepeat': 0,
                'attackRepeatMulti': 500,
                'attackDamage': 50,
                'attackRange': CELL_SIZE * 7,
                'attackPower': 5,
                'attackType': 'ranged',
                'attackSprite': [17, 5],
                'attackRotation': true,
                'faction': 'orcs',
                'enemyFactions': [
                    'ally',
                    ''
                ],
                'color': '#ff5722', //COLORS.BAD,
                'onDrop': (thisCreature) => {
                    let goldCount = 300;
                    while (goldCount) {
                        let randomPos = [thisCreature.pos[0] - CELL_SIZE + Math.random() * CELL_SIZE * 2, thisCreature.pos[1] - CELL_SIZE + Math.random() * CELL_SIZE * 2];
                        world.splashes.push({
                            'pos': thisCreature.pos,
                            'life': [0, 30],
                            'size': CELL_SIZE / 2,
                            'sprite': SPRITES.COIN,
                            'fadeIn': true,
                            'points': [
                                thisCreature.pos,
                                getPosBetween(thisCreature.pos, randomPos),
                                randomPos,
                            ],
                            'onDrop': () => world.items.push({
                                'type': 'item',
                                'itemType': 'gold',
                                'pos': randomPos,
                                'sprite': SPRITES.COIN,
                                'size': CELL_SIZE,
                                'animation': Math.random(),
                            })
                        });
                        goldCount--;
                    }
                }
            },
            // Колдун
            {
                'type': 'creature',
                'pos': [CELL_SIZE * 10, CELL_SIZE * 10],
                'sprite': [2, 6],
                'healthSprite': SPRITES.HELMET,
                'size': CELL_SIZE,
                'target': null,
                'speed': 2,
                'hp': 20,
                'attack': [45, 45],
                'attackRepeat': 0,
                'attackRepeatMulti': 5,
                'attackDamage': 1,
                'attackRange': CELL_SIZE * 4,
                'attackPower': 1,
                'attackType': 'ranged',
                'attackSprite': [16, 6],
                'attackRotation': false,
                'faction': 'evil',
                'enemyFactions': [
                    'ally',
                    ''
                ],
                'color': 'pink'
            },
            // Шахта
            {
                'type': 'creature',
                'pos': [CELL_SIZE * -4, CELL_SIZE * 0],
                'sprite': SPRITES.ORE_MINE,
                'healthSprite': SPRITES.ORE,
                'size': CELL_SIZE,
                'sizeScaleLimit': 0,
                'target': null,
                'speed': 0,
                'hp': 999,
                'attack': [0, 0],
                'attackRepeat': 0,
                'attackRepeatMulti': 0,
                'attackDamage': 0,
                'attackRange': 0,
                'attackPower': 0,
                'attackType': '',
                'attackSprite': null,
                'attackRotation': false,
                'faction': 'mine',
                'enemyFactions': [],
                'color': '#cddc39',
                'onHit': (thisCreature) => {
                    if (Math.random() >= .95) {
                        let randomPos = [thisCreature.pos[0] - CELL_SIZE + Math.random() * CELL_SIZE * 2, thisCreature.pos[1] - CELL_SIZE + Math.random() * CELL_SIZE * 2];

                        world.splashes.push({
                            'pos': thisCreature.pos,
                            'life': [0, 30],
                            'size': CELL_SIZE / 2,
                            'sprite': SPRITES.COIN,
                            'fadeIn': true,
                            'points': [
                                thisCreature.pos,
                                getPosBetween(thisCreature.pos, randomPos),
                                randomPos,
                            ],
                            'onDrop': () => world.items.push({
                                'type': 'item',
                                'itemType': 'gold',
                                'pos': randomPos,
                                'sprite': SPRITES.COIN,
                                'size': CELL_SIZE,
                                'animation': Math.random(),
                            })
                        });
                    }
                },
                'onDrop': () => console.log('dropped')
            },
            // Шахта золота
            {
                'type': 'creature',
                'pos': [CELL_SIZE * -6, CELL_SIZE * 0],
                'sprite': SPRITES.GOLD_MINE,
                'healthSprite': SPRITES.ORE,
                'size': CELL_SIZE,
                'sizeScaleLimit': 0,
                'target': null,
                'speed': 0,
                'hp': 999,
                'attack': [0, 0],
                'attackRepeat': 0,
                'attackRepeatMulti': 0,
                'attackDamage': 0,
                'attackRange': 0,
                'attackPower': 0,
                'attackType': '',
                'attackSprite': null,
                'attackRotation': false,
                'faction': 'mine',
                'enemyFactions': [],
                'color': '#cddc39',
                'onHit': (thisCreature) => {
                    if (Math.random() >= .8) {
                        let randomPos = [thisCreature.pos[0] - CELL_SIZE + Math.random() * CELL_SIZE * 2, thisCreature.pos[1] - CELL_SIZE + Math.random() * CELL_SIZE * 2];

                        world.splashes.push({
                            'pos': thisCreature.pos,
                            'life': [0, 30],
                            'size': CELL_SIZE / 2,
                            'sprite': SPRITES.COIN,
                            'fadeIn': true,
                            'points': [
                                thisCreature.pos,
                                getPosBetween(thisCreature.pos, randomPos),
                                randomPos,
                            ],
                            'onDrop': () => world.items.push({
                                'type': 'item',
                                'itemType': 'gold',
                                'pos': randomPos,
                                'sprite': SPRITES.COIN,
                                'size': CELL_SIZE,
                                'animation': Math.random(),
                            })
                        });
                    }
                },
                'onDrop': () => console.log('dropped')
            },
            // Шахта кристаллов
            {
                'type': 'creature',
                'pos': [CELL_SIZE * -8, CELL_SIZE * 0],
                'sprite': SPRITES.CRYSTALL_MINE,
                'healthSprite': SPRITES.ORE,
                'size': CELL_SIZE,
                'sizeScaleLimit': 0,
                'target': null,
                'speed': 0,
                'hp': 999,
                'attack': [0, 0],
                'attackRepeat': 0,
                'attackRepeatMulti': 0,
                'attackDamage': 0,
                'attackRange': 0,
                'attackPower': 0,
                'attackType': '',
                'attackSprite': null,
                'attackRotation': false,
                'faction': 'mine',
                'enemyFactions': [],
                'color': '#cddc39',
                'onHit': (thisCreature) => {
                    if (Math.random() >= .95) {
                        let randomPos = [thisCreature.pos[0] - CELL_SIZE + Math.random() * CELL_SIZE * 2, thisCreature.pos[1] - CELL_SIZE + Math.random() * CELL_SIZE * 2];

                        world.splashes.push({
                            'pos': thisCreature.pos,
                            'life': [0, 30],
                            'size': CELL_SIZE / 2,
                            'sprite': SPRITES.CRYSTALL,
                            'fadeIn': true,
                            'points': [
                                thisCreature.pos,
                                getPosBetween(thisCreature.pos, randomPos),
                                randomPos,
                            ],
                            'onDrop': () => world.items.push({
                                'type': 'item',
                                'itemType': 'crystall',
                                'pos': randomPos,
                                'sprite': SPRITES.CRYSTALL,
                                'size': CELL_SIZE,
                                'animation': Math.random(),
                            })
                        });
                    }
                },
                'onDrop': () => console.log('dropped')
            },
            // Дом
            {
                'type': 'creature',
                'pos': [CELL_SIZE * -8, CELL_SIZE * 4],
                'sprite': SPRITES.HOUSE_01,
                'healthSprite': SPRITES.ORE,
                'size': CELL_SIZE,
                'sizeScaleLimit': 0,
                'target': null,
                'speed': 0,
                'hp': 50,
                'attack': [0, 0],
                'attackRepeat': 0,
                'attackRepeatMulti': 0,
                'attackDamage': 0,
                'attackRange': 0,
                'attackPower': 0,
                'attackType': '',
                'attackSprite': null,
                'attackRotation': false,
                'faction': 'mine',
                'enemyFactions': [],
                'color': COLORS.GRAY,
                'onHit': (self) => {
                    if (Math.random() >= .9) {
                        let randomPos = [self.pos[0] - CELL_SIZE + Math.random() * CELL_SIZE * 2, self.pos[1] - CELL_SIZE + Math.random() * CELL_SIZE * 2];

                        world.splashes.push({
                            'pos': self.pos,
                            'life': [0, 30],
                            'size': CELL_SIZE / 2,
                            'sprite': SPRITES.MEAT,
                            'fadeIn': true,
                            'points': [
                                self.pos,
                                getPosBetween(self.pos, randomPos),
                                randomPos,
                            ],
                            'onDrop': () => world.items.push({
                                'type': 'item',
                                'itemType': 'food',
                                'pos': randomPos,
                                'sprite': SPRITES.MEAT,
                                'size': CELL_SIZE,
                                'animation': Math.random(),
                            })
                        });
                    }
                },
                'onDrop': (self) => {
                    world.creatures.push({
                        'type': 'creature',
                        'pos': self.pos,
                        'sprite': [2, 6],
                        'healthSprite': SPRITES.HELMET,
                        'size': CELL_SIZE,
                        'target': null,
                        'speed': 2,
                        'hp': 100,
                        'attack': [60, 60],
                        'attackRepeat': 0,
                        'attackRepeatMulti': 25,
                        'attackDamage': 2,
                        'attackRange': CELL_SIZE * 4,
                        'attackPower': 1,
                        'attackType': 'ranged',
                        'attackSprite': [16, 6],
                        'attackRotation': false,
                        'faction': 'evil',
                        'enemyFactions': [
                            'ally',
                            ''
                        ],
                        'color': COLORS.GRAY
                    });
                }
            },
        ],
        'projectiles': [
            // 
        ],
        'blocks': [
            {
                'type': 'block',
                'pos': [CELL_SIZE * -1, CELL_SIZE * 0],
                'size': CELL_SIZE,
                'transparent': false
            },
            {
                'type': 'block',
                'pos': [CELL_SIZE * 0, CELL_SIZE * -1],
                'size': CELL_SIZE,
                'transparent': false
            },
            {
                'type': 'block',
                'pos': [CELL_SIZE * 1, CELL_SIZE * -1],
                'size': CELL_SIZE,
                'transparent': false
            },
            {
                'type': 'block',
                'pos': [CELL_SIZE * 2, CELL_SIZE * -1],
                'size': CELL_SIZE,
                'transparent': true
            },
            {
                'type': 'block',
                'pos': [CELL_SIZE * 3, CELL_SIZE * -1],
                'size': CELL_SIZE,
                'transparent': true
            },
        ],
        'splashes': [
            // 
        ],
        'items': [
            // Монетка
            {
                'type': 'item',
                'itemType': 'gold',
                'pos': [CELL_SIZE * 2, CELL_SIZE * 2],
                'sprite': SPRITES.COIN,
                'size': CELL_SIZE,
                'animation': Math.random() * 3,
            },
            // Еда
            {
                'type': 'item',
                'itemType': 'food',
                'pos': [CELL_SIZE * 4, CELL_SIZE * 4],
                'sprite': SPRITES.MEAT,
                'size': CELL_SIZE,
                'animation': Math.random() * 3,
            },
            // Оружие
            {
                'type': 'item',
                'itemType': 'weapon',
                'pos': [CELL_SIZE * 5, CELL_SIZE * 8],
                'sprite': SPRITES.SWORD,
                'size': CELL_SIZE,
                'animation': Math.random() * 3,
            },
        ],
        'stores': [
            // Gold to food
            {
                'type': 'store',
                'pos': [CELL_SIZE * -2, CELL_SIZE * -2],
                'sprite': SPRITES.SIGN_02,
                'spriteToReceive': SPRITES.MEAT,
                'spriteToGive': SPRITES.COIN,
                'countToGive': 10,
                'restock': [15, 15],
                'size': CELL_SIZE,
                'onClick': self => {
                    if (self.restock[0] == self.restock[1]) {
                        if (world.player.gold >= 10) {
                            // let randomPos = [self.pos[0] - CELL_SIZE + Math.random() * CELL_SIZE * 2, self.pos[1] - CELL_SIZE + Math.random() * CELL_SIZE * 2];
                            let randomDir = vNormal(vSub(self.pos, [self.pos[0] + (-1 + Math.random() * 2), self.pos[0] + (-1 + Math.random() * 2)]));
                            let randomPos = getNextPos(self.pos, randomDir, CELL_SIZE);

                            world.splashes.push({
                                'pos': self.pos,
                                'life': [0, 30],
                                'size': CELL_SIZE / 2,
                                'sprite': SPRITES.MEAT,
                                'fadeIn': true,
                                'points': [
                                    self.pos,
                                    getPosBetween(self.pos, randomPos),
                                    randomPos,
                                ],
                                'onDrop': () => world.items.push({
                                    'type': 'item',
                                    'itemType': 'food',
                                    'pos': randomPos,
                                    'sprite': SPRITES.MEAT,
                                    'size': CELL_SIZE,
                                    'animation': Math.random(),
                                })
                            });
                            
                            world.player.gold -= 10;
                            self.restock[0] = 0;
                        } else {
                            world.splashes.push({
                                'pos': [self.pos[0], self.pos[1]],
                                'life': [0, 45],
                                'size': CELL_SIZE / 2,
                                'text': 'Need 10 coins!',
                                'color': COLORS.BAD,
                                'fadeOut': true
                            });
                        }
                    }
                },
                'color': COLORS.GOLD
            },
            // Gold to skeleton
            {
                'type': 'store',
                'pos': [CELL_SIZE * -2, CELL_SIZE * -5],
                'sprite': SPRITES.TOMB_01,
                'spriteToReceive': SPRITES.SKELETON,
                'spriteToGive': SPRITES.COIN,
                'countToGive': 499,
                'restock': [300, 300],
                'size': CELL_SIZE,
                'onClick': self => {
                    if (self.restock[0] == self.restock[1]) {
                        if (world.player.gold >= self.countToGive) {
                            let randomDir = vNormal(vSub(self.pos, [self.pos[0] + (-1 + Math.random() * 2), self.pos[0] + (-1 + Math.random() * 2)]));
                            let randomPos = getNextPos(self.pos, randomDir, CELL_SIZE);

                            world.creatures.push({
                                'type': 'creature',
                                'pos': randomPos,
                                'sprite': SPRITES.SKELETON,
                                'healthSprite': SPRITES.HELMET,
                                'size': CELL_SIZE,
                                'sizeScaleLimit': 1000,
                                'target': null,
                                'speed': 2,
                                'hp': 50,
                                'attack': [30, 30],
                                'attackRepeat': 0,
                                'attackRepeatMulti': 10,
                                'attackDamage': 1,
                                'attackRange': CELL_SIZE * 1.2,
                                'attackPower': -1,
                                'attackType': 'melee',
                                'attackSprite': SPRITES.PR_SWORD,
                                'attackRotation': true,
                                'faction': 'ally',
                                'enemyFactions': [
                                    'evil',
                                    'orcs',
                                    'mine'
                                ],
                                'color': '#cddc39'
                            },);
                            
                            world.player.gold -= self.countToGive;
                            self.restock[0] = 0;
                        } else {
                            world.splashes.push({
                                'pos': [self.pos[0], self.pos[1]],
                                'life': [0, 45],
                                'size': CELL_SIZE / 2,
                                'text': 'Need ' + String(self.countToGive) + ' coins!',
                                'color': COLORS.BAD,
                                'fadeOut': true
                            });
                        }
                    }
                },
                'color': COLORS.GOLD
            },
            // Crystall to gold
            {
                'type': 'store',
                'pos': [CELL_SIZE * -3, CELL_SIZE * -3],
                'sprite': SPRITES.SIGN_01,
                'spriteToReceive': SPRITES.COIN,
                'spriteToGive': SPRITES.CRYSTALL,
                'countToGive': 1,
                'restock': [15, 15],
                'size': CELL_SIZE,
                'onClick': self => {
                    if (self.restock[0] == self.restock[1]) {
                        if (world.player.crystalls >= self.countToGive) {
                            let count = 99;
                            while (count) {
                                let randomDir = vNormal(vSub(self.pos, [self.pos[0] + (-1 + Math.random() * 2), self.pos[0] + (-1 + Math.random() * 2)]));
                                let randomPos = getNextPos(self.pos, randomDir, CELL_SIZE);

                                world.splashes.push({
                                    'pos': self.pos,
                                    'life': [0, 30],
                                    'size': CELL_SIZE / 2,
                                    'sprite': SPRITES.COIN,
                                    'fadeIn': true,
                                    'points': [
                                        self.pos,
                                        getPosBetween(self.pos, randomPos),
                                        randomPos,
                                    ],
                                    'onDrop': () => world.items.push({
                                        'type': 'item',
                                        'itemType': 'gold',
                                        'pos': randomPos,
                                        'sprite': SPRITES.COIN,
                                        'size': CELL_SIZE,
                                        'animation': Math.random() * 5,
                                    })
                                });
                                
                                count--;
                            }
                            
                            
                            world.player.crystalls -= self.countToGive;
                            self.restock[0] = 0;
                        } else {
                            world.splashes.push({
                                'pos': [self.pos[0], self.pos[1]],
                                'life': [0, 45],
                                'size': CELL_SIZE / 2,
                                'text': 'Need 10 coins!',
                                'color': COLORS.BAD,
                                'fadeOut': true
                            });
                        }
                    }
                },
                'color': COLORS.GOLD
            },
        ]
    }
}

// Viewer
let view = {
    pos: [-320, -240],
    startPos: [0, 0],
    width: 640,
    height: 480
};

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
    document.body.addEventListener("keydown", function (e) {
        // if (player) {
        //     if (e.code == "KeyW") controller.up = true;
        //     if (e.code == "KeyS") controller.down = true;
        //     if (e.code == "KeyA") controller.left = true;
        //     if (e.code == "KeyD") controller.right = true;
        //     if (e.code == "Space") controller.use = true;
        // } else {
        //     if (e.code == "KeyW") view.pos[1] -= CELL_SIZE * 2;
        //     if (e.code == "KeyS") view.pos[1] += CELL_SIZE * 2;
        //     if (e.code == "KeyA") view.pos[0] -= CELL_SIZE * 2;
        //     if (e.code == "KeyD") view.pos[0] += CELL_SIZE * 2;

        //     if (e.code == "KeyZ") editorRemover = !editorRemover;
        //     if (e.code == "KeyX") editorAnimation = !editorAnimation;
        //     if (e.code == "KeyV") editorVisibleBlock = !editorVisibleBlock;

        //     if (e.code == "Digit1") editorObjectType = "sprite";
        //     if (e.code == "Digit2") editorObjectType = "block";
        //     if (e.code == "Digit3") editorObjectType = "guardian";
        //     if (e.code == "Digit4") editorObjectType = "axeman";
        //     if (e.code == "Digit5") editorObjectType = "goblin";
        //     if (e.code == "Digit6") editorObjectType = "orc";
        //     if (e.code == "Digit7") editorObjectType = "archer";
            
        //     if (e.code == "KeyE") editorObjectType = "item_gold";
        //     if (e.code == "KeyR") editorObjectType = "palm_tree";
        //     if (e.code == "KeyT") editorObjectType = "wheat";
        //     if (e.code == "KeyQ") editorObjectType = "item_criminal";

        //     if (e.code == "Space") {
        //         console.info("SAVED");
        //         localStorage.setItem("world", JSON.stringify(world));
        //     }
        // }
    });
    document.body.addEventListener("keyup", function (e) {
        // if (player) {
        //     if (e.code == "KeyW") controller.up = false;
        //     if (e.code == "KeyS") controller.down = false;
        //     if (e.code == "KeyA") controller.left = false;
        //     if (e.code == "KeyD") controller.right = false;
        //     if (e.code == "Space") controller.use = false;
        // }
    });

    onFrameHandler();

    function onFrameHandler() {
        render(cvs, ctx);
        requestAnimationFrame(onFrameHandler);
    }
});

function render(cvs, ctx) {
    ctx.fillStyle = COLORS.BACKGROUND;
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    // Draw sprites
    if (world.sprites.length) drawSprites(ctx, world.sprites);

    // Draw stores
    if (world.stores.length) drawStores(ctx, world.stores);

    // Draw items
    if (world.items.length) drawItems(ctx, world.items);

    // Draw creatures
    if (world.creatures.length) drawCreatures(ctx, world.creatures);

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
            // let nextPos = getNextPosByBezier(back(1.5, projectile.life[0] / projectile.life[1]), projectile.points);
            // let nextPos = getNextPosByBezier(bounceEaseOut(projectile.life[0] / projectile.life[1]), projectile.points);
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

                    // if (Math.random() >= .8) {
                    //     world.splashes.push({
                    //         'pos': foe.pos,
                    //         'life': [0, 30],
                    //         'size': CELL_SIZE / 2,
                    //         'sprite': SPRITES.COIN,
                    //         'fadeIn': true,
                    //         'points': [
                    //             foe.pos,
                    //             getPosBetween(foe.pos, randomPos),
                    //             randomPos,
                    //         ],
                    //         'onDrop': () => world.items.push({
                    //             'type': 'item',
                    //             'itemType': 'gold',
                    //             'pos': randomPos,
                    //             'sprite': SPRITES.COIN,
                    //             'size': CELL_SIZE,
                    //             'animation': Math.random(),
                    //         })
                    //     });
                    // }
                    if (foe.onHit != undefined) foe.onHit(foe);

                    world.splashes.push({
                        'pos': foe.pos,
                        'life': [0, 30],
                        'size': CELL_SIZE / 2,
                        'sprite': foe.healthSprite,
                        'fadeOut': true,
                        'points': [
                            foe.pos,
                            getPosBetween(foe.pos, randomPos),
                            randomPos,
                        ]
                    });
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
            item.animation += .1;
            ctx.drawImage(TILESET, item.sprite[0] * SPRITE_SIZE, item.sprite[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE,
                Math.round(item.pos[0] - Math.round(item.size / 2) - view.pos[0]),
                Math.round(item.pos[1] - Math.round(item.size / 2) - view.pos[1] - Math.cos(item.animation) * 4),
                item.size, item.size
            );
        }

        let allyCreatures = world.creatures.filter(creature => creature.faction == 'ally' && vLength(vSub(item.pos, creature.pos)) <= ((item.size + creature.size) / 2));
        if (allyCreatures.length) allyCreatures.forEach(allyCreature => {
            world.splashes.push({
                'pos': item.pos,
                'life': [0, 15],
                'size': CELL_SIZE,
                'sprite': item.sprite,
                'fadeOut': true,
                'points': [
                    item.pos,
                    [item.pos[0], item.pos[1] - CELL_SIZE / 2]
                ]
            });

            switch (item.itemType) {
                case "gold": {
                    world.player.gold += 1;
                    break;
                }
                case "weapon": {
                    allyCreature.attackDamage += 1;

                    world.splashes.push({
                        'pos': item.pos,
                        'life': [0, 60],
                        'size': CELL_SIZE,
                        'sprite': SPRITES.SWORD,
                        'fadeIn': true,
                        'points': [
                            [allyCreature.pos[0], allyCreature.pos[1] - CELL_SIZE],
                            allyCreature.pos
                        ]
                    });

                    break;
                }
                case "crystall": {
                    world.player.crystalls += 1;
                    break;
                }
                case "food": {
                    allyCreature.hp += 1;

                    world.splashes.push({
                        'pos': item.pos,
                        'life': [0, 60],
                        'size': CELL_SIZE,
                        'sprite': SPRITES.HELMET,
                        'fadeIn': true,
                        'points': [
                            [allyCreature.pos[0], allyCreature.pos[1] - CELL_SIZE],
                            allyCreature.pos
                        ]
                    });

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
            ctx.drawImage(TILESET, store.sprite[0] * SPRITE_SIZE, store.sprite[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE,
                Math.round(store.pos[0] - Math.round(store.size / 2) - view.pos[0]),
                Math.round(store.pos[1] - Math.round(store.size / 2) - view.pos[1]),
                store.size, store.size
            );

            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.shadowColor = "black";

            if (store.spriteToReceiveAnimation == undefined) store.spriteToReceiveAnimation = 0;
            store.spriteToReceiveAnimation += .1; 
            ctx.drawImage(TILESET, store.spriteToReceive[0] * SPRITE_SIZE, store.spriteToReceive[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, 
                Math.round(store.pos[0] - (CELL_SIZE * (store.restock[0] / store.restock[1]) / 2) - view.pos[0]  - Math.cos(store.spriteToReceiveAnimation) * 4),
                Math.round(store.pos[1] - (CELL_SIZE * (store.restock[0] / store.restock[1]) / 2) - view.pos[1] - Math.sin(store.spriteToReceiveAnimation) * 2),
                CELL_SIZE * (store.restock[0] / store.restock[1]), CELL_SIZE * (store.restock[0] / store.restock[1])
            );

            if (store.restock[0] == store.restock[1]) {
                ctx.font = SM_FONT;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                ctx.drawImage(TILESET, store.spriteToGive[0] * SPRITE_SIZE, store.spriteToGive[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, 
                    Math.round(store.pos[0] - (CELL_SIZE / 3) - Math.round(CELL_SIZE * .75 / 2) - view.pos[0]),
                    Math.round(store.pos[1] + (CELL_SIZE / 3) - view.pos[1]),
                    CELL_SIZE * .75 ,CELL_SIZE * .75
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
                        // console.log(vLength(vSub(currentCreature.pos, foe.pos)), currentCreature.attackRange);
                        currentCreature.target = getNextPos(foe.pos, vNormal(vSub(foe.pos, currentCreature.pos)), currentCreature.attackRange);
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

                    if (DEBUG) {
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
            let obstacles = [].concat(creatures, world.blocks);
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
                    } else if (obstacle.type == "block" || obstacle.type == "item" && obstacle.solid) {
                        newPos = getNextPos(currentCreature.pos, vMultScalar(dir, -1), Math.round((closestDistance - distanceBetween)));
                        currentCreature.pos = newPos;
                    // } else if (obstacle.type == "trap") {
                    //     currentCreature.target = undefined;
                    //     currentCreature.sp = vMultScalar(dir, obstacle.speed);
                    //     console.log("HIT", currentCreature.target);
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

            // Attack nearest foes
            if (AI && currentCreature.attackDamage) {
                let foe = null;
                let closestDistance = null;
                creatures.forEach(otherCreature => {
                    if (currentCreature == otherCreature) return;
                    if (vLength(vSub(currentCreature.pos, otherCreature.pos)) <= currentCreature.attackRange + (CELL_SIZE / 4) && currentCreature.enemyFactions.indexOf(otherCreature.faction) != -1 && isReachable(currentCreature, [otherCreature.pos[0], otherCreature.pos[1]])) {
                        let currentDistance = vLength(vSub(currentCreature.pos, otherCreature.pos));
                        if (!foe || currentDistance < closestDistance) {
                            closestDistance = currentDistance;
                            foe = otherCreature;
                        }
                    }
                });
                
                if (foe && vLength(vSub(currentCreature.pos, foe.pos)) <= currentCreature.attackRange + (CELL_SIZE / 4) && currentCreature.attack[0] == currentCreature.attack[1]) {
                    if (currentCreature.attackRepeat < Math.ceil(currentCreature.hp / currentCreature.attackRepeatMulti)) {
                        let projectileTargetPos = foe.pos;
                        switch (currentCreature.attackType) {
                            case "melee": {
                                if (foe.target && Math.random() >= .5) projectileTargetPos = getNearestPos(foe, getNextPos(foe.pos, vNormal(vSub(foe.pos, foe.target)), 20));
                                world.projectiles.push({
                                    'owner': currentCreature,
                                    'pos': currentCreature.pos,
                                    'sprite': currentCreature.attackSprite,
                                    'size': CELL_SIZE,
                                    'points': [
                                        currentCreature.pos,
                                        [projectileTargetPos[0] - (foe.size / 4) + (Math.random() * (foe.size / 2)), projectileTargetPos[1] - (foe.size / 4) + (Math.random() * (foe.size / 2))]
                                    ],
                                    'life': [0, 10],
                                    'rotation': currentCreature.attackRotation
                                });

                                break;
                            }

                            case "ranged": {
                                if (foe.target && Math.random() >= .5) projectileTargetPos = getNearestPos(foe, getNextPos(foe.pos, vNormal(vSub(foe.pos, foe.target)), 90));
                                world.projectiles.push({
                                    'owner': currentCreature,
                                    'pos': currentCreature.pos,
                                    'sprite': currentCreature.attackSprite,
                                    'size': CELL_SIZE,
                                    'points': [
                                        currentCreature.pos,
                                        getPosBetween(currentCreature.pos, projectileTargetPos),
                                        // [currentCreature.pos[0] + (projectileTargetPos[0] - currentCreature.pos[0]) / 2, (projectileTargetPos[1] > currentCreature.pos[1] ? currentCreature.pos[1] : projectileTargetPos[1]) - CELL_SIZE * 2],
                                        [projectileTargetPos[0] - (foe.size / 4) + (Math.random() * (foe.size / 2)), projectileTargetPos[1] - (foe.size / 4) + (Math.random() * (foe.size / 2))]
                                    ],
                                    'life': [0, 45],
                                    'rotation': currentCreature.attackRotation
                                });
                                break;
                            }
                        }
                        
                        currentCreature.attack[0] -= 5;
                        currentCreature.attackRepeat++;
                    } else {
                        currentCreature.attack[0] = 0;
                        currentCreature.attackRepeat = 0; 
                    }
                }
            }

            // Draw
            if (inView(currentCreature.pos, currentCreature.size)) {
                let sizeScale = 1;
                if (currentCreature.sizeScaleLimit) sizeScale = (currentCreature.hp < currentCreature.sizeScaleLimit ?  1 + (currentCreature.hp / currentCreature.sizeScaleLimit) : 2);
                let trueSize = currentCreature.size * sizeScale;
                
                if (currentCreature.i != undefined && currentCreature.speed) {
                    currentCreature.i += .1;
                } else {
                    currentCreature.i = 0;
                }

                if (moving) {
                    ctx.save();
                    ctx.translate(Math.round(currentCreature.pos[0] - view.pos[0]), Math.round(currentCreature.pos[1] - view.pos[1] + Math.round(trueSize / 2)));
                    ctx.rotate((Math.cos(currentCreature.i) * 5) * Math.PI / 180);
                    ctx.drawImage(TILESET, currentCreature.sprite[0] * SPRITE_SIZE, currentCreature.sprite[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE,
                        - Math.round(trueSize / 2),
                        - Math.round(trueSize),
                        trueSize, trueSize
                    );
                    ctx.restore();
                } else {
                    ctx.drawImage(TILESET, currentCreature.sprite[0] * SPRITE_SIZE, currentCreature.sprite[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE,
                        Math.round(currentCreature.pos[0] - (trueSize / 2) - view.pos[0]),
                        Math.round(currentCreature.pos[1] - (trueSize / 2) - Math.cos(currentCreature.i) - view.pos[1]),
                        trueSize, trueSize + Math.cos(currentCreature.i)
                    );
                }

                if (currentCreature.hp != undefined) {
                    ctx.font = SM_FONT;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";

                    ctx.shadowOffsetX = 1;
                    ctx.shadowOffsetY = 1;
                    ctx.shadowColor = "black";

                    ctx.drawImage(TILESET, currentCreature.healthSprite[0] * SPRITE_SIZE, currentCreature.healthSprite[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, 
                        Math.round(currentCreature.pos[0] - Math.round(CELL_SIZE / 3) - Math.round(CELL_SIZE * .75 / 2) - view.pos[0]),
                        Math.round(currentCreature.pos[1] + Math.round(CELL_SIZE / 3) - view.pos[1]),
                        CELL_SIZE * .75 ,CELL_SIZE * .75
                    );
                    ctx.fillStyle = currentCreature.color;
                    ctx.fillText(currentCreature.hp,
                        currentCreature.pos[0] + Math.round(CELL_SIZE / 3) - view.pos[0],
                        currentCreature.pos[1] + Math.round(CELL_SIZE * .75) - view.pos[1]
                    );

                    if (currentCreature.attackDamage) {
                        ctx.drawImage(TILESET, SPRITES.SWORD[0] * SPRITE_SIZE, SPRITES.SWORD[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, 
                            Math.round(currentCreature.pos[0] - Math.round(CELL_SIZE / 3) - Math.round(CELL_SIZE * .75 / 2) - view.pos[0]),
                            Math.round(currentCreature.pos[1] + Math.round(CELL_SIZE / 3) + Math.round(CELL_SIZE / 2) - view.pos[1]),
                            CELL_SIZE * .75 ,CELL_SIZE * .75
                        );
                        ctx.fillStyle = COLORS.GRAY;
                        ctx.fillText((currentCreature.hp <= currentCreature.attackRepeatMulti ? currentCreature.attackDamage : currentCreature.attackDamage + '*' + Math.ceil(currentCreature.hp / currentCreature.attackRepeatMulti)),
                            currentCreature.pos[0] + Math.round(CELL_SIZE / 3) - view.pos[0],
                            currentCreature.pos[1] + Math.round(CELL_SIZE * .75) + Math.round(CELL_SIZE / 2) - view.pos[1]
                        );
                    }

                    if (currentCreature.king != undefined && currentCreature.king) {
                        currentCreature.kingAnimation += .1;
                        ctx.drawImage(TILESET, SPRITES.CROWN[0] * SPRITE_SIZE, SPRITES.CROWN[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, 
                            Math.round(currentCreature.pos[0] - Math.round(CELL_SIZE / 2) - view.pos[0]  - Math.cos(currentCreature.kingAnimation) * 2),
                            Math.round(currentCreature.pos[1] - Math.round(CELL_SIZE * 1.5) - view.pos[1] - Math.sin(currentCreature.kingAnimation) * 2),
                            CELL_SIZE ,CELL_SIZE
                        );
                    }

                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowColor = "";
                }

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
// function drawCreaturesOLD(ctx, creatures) {
//     creatures.forEach(function (obj) {
//         let currentCreature = obj;
//         let emotion = null;
//         let moving = false;

//         // Dead
//         if (currentCreature.hp[0] <= 0) {
//             // currentCreature.hp[0] = 0;
//             // if (currentCreature.respawn) {
//             //     currentCreature.type = "sprite";    
//             // } else {
//             //     dropObj(objects, currentCreature);
//             // }

//             dropObj(objects, currentCreature);

//             // Drop item
//             // if (Math.random() <= .4) {
//             //     objects.push({
//             //         type: "item",
//             //         pos: [currentCreature.pos[0], currentCreature.pos[1]],
//             //         sprite: [(5 * SPRITE_SIZE), (11 * SPRITE_SIZE)],
//             //         size: CELL_SIZE
//             //     });
//             // }

//             return;
//         } else if (currentCreature.hp[0] < currentCreature.hp[1]) {
//             if (currentCreature.regen[0] == currentCreature.regen[1]) {
//                 currentCreature.regen[0] = 0;
//                 currentCreature.hp[0] += 1;

//                 // objects.push({
//                 //     type: "splash",
//                 //     pos: [currentCreature.pos[0], currentCreature.pos[1]],
//                 //     size: CELL_SIZE,
//                 //     sprite: [SPRITE_SIZE * 16, SPRITE_SIZE * 7],
//                 //     text: "+" + 1,
//                 //     color: "lime",
//                 //     life: [0, 45]
//                 // });
//             } else {
//                 currentCreature.regen[0]++;
//             }
//         } else if (currentCreature.hp[0] > currentCreature.hp[1]) currentCreature.hp[0] = currentCreature.hp[1];

//         // AI
//         if (AI && currentCreature != player) {
//             let closestTarget = null;
//             if (currentCreature.dmg) {
//                 let closestTargetDistance = null;
//                 creatures.forEach(function (obj) {
//                     if (currentCreature == obj) return;
//                     let currentTarget = obj;

//                     if (vLength(vSub(currentCreature.pos, currentTarget.pos)) <= currentCreature.sight && currentCreature.faction != currentTarget.faction && isReachable(currentCreature.pos, obj.pos)) {
//                         let currentDistance = vLength(vSub(currentCreature.pos, currentTarget.pos));
//                         if (!closestTarget || currentDistance < closestTargetDistance) {
//                             closestTargetDistance = currentDistance;
//                             closestTarget = currentTarget;
//                         }
//                     }
//                 });
//             }
//             if (closestTarget) {
//                 if (currentCreature.hp[0] > Math.ceil(currentCreature.hp[1] / 5)) {
//                     if (vLength(vSub(currentCreature.pos, closestTarget.pos)) > currentCreature.attackRange + (CELL_SIZE / 4)) {
//                         // Pursuit
//                         let closestPosToAttack = getNextPos(closestTarget.pos, vNormal(vSub(closestTarget.pos, currentCreature.pos)), currentCreature.attackRange);
//                         currentCreature.target = closestPosToAttack;

//                         // Emotion
//                         emotion = [SPRITE_SIZE * 18, SPRITE_SIZE * 1];
//                     } else {
//                         // Evasion
//                         if (Math.random() <= .05) {
//                             let newDir = vNormal(vSub(currentCreature.pos, [currentCreature.pos[0] - 1 + Math.random() * 2, currentCreature.pos[1] - 1 + Math.random() * 3]));
//                             let newPos = getReachablePos(currentCreature.pos, getNextPos(currentCreature.pos, newDir, CELL_SIZE + (CELL_SIZE * Math.random() * 1)));
//                             if (vLength(vSub(newPos, closestTarget.pos)) <= currentCreature.attackRange + (CELL_SIZE / 4)) currentCreature.target = newPos;
//                         }

//                         // Emotion
//                         emotion = [SPRITE_SIZE * 16, SPRITE_SIZE * 0];
//                     }
//                 } else {
//                     // Try to escape
//                     let posToEscape = getReachablePos(currentCreature.pos, getNextPos(closestTarget.pos, vNormal(vSub(closestTarget.pos, currentCreature.pos)), closestTarget.sight + 1));
                    
//                     currentCreature.target = posToEscape;

//                     // Emotion
//                     emotion = [SPRITE_SIZE * 17, SPRITE_SIZE * 0];
//                 }
//             } else {
//                 // AI
//                 if (currentCreature.ai) {
//                     // console.log("think");
//                     // Follower
//                     if (currentCreature.ai == "follower" && player && (vLength(vSub(currentCreature.pos, player.pos)) <= currentCreature.sight && vLength(vSub(currentCreature.pos, player.pos)) > CELL_SIZE * 1.5) && isReachable(currentCreature.pos, player.pos)) {
//                         currentCreature.target = getNextPos(player.pos, vNormal(vSub(player.pos, currentCreature.pos)), CELL_SIZE * 1.5);
//                     } else if (currentCreature.ai == "worker" && player && !currentCreature.target) {
//                         // Worker
//                         let items = objects.filter(function(obj) { return obj.type == "item" && !obj.itemType;});
//                         let closestItem = null;
//                         let closestItemDistance = null;
//                         console.log("search");
//                         items.forEach(function (obj) {
//                             if (currentCreature == obj) return;
//                             let currentItem = obj;

//                             if (vLength(vSub(currentCreature.pos, currentItem.pos)) <= currentCreature.sight && isReachable(currentCreature.pos, currentItem.pos)) {
//                                 let currentDistance = vLength(vSub(currentCreature.pos, currentItem.pos));
//                                 if (!closestItem || currentDistance < closestItemDistance) {
//                                     closestItemDistance = currentDistance;
//                                     closestItem = currentItem;
//                                 }
//                             }
//                         });
//                         if (closestItem) {
//                             console.log("found");
//                             if (vLength(vSub(currentCreature.pos, closestItem.pos)) <= CELL_SIZE * 2) {
//                                 console.log("gather");
//                                 // currentCreature.target = undefined;
//                                 // closestItem.use[0]++; 
//                             } else {
//                                 console.log("go to");
//                                 currentCreature.target = getNextPos(closestItem.pos, vNormal(vSub(closestItem.pos, currentCreature.pos)), CELL_SIZE / 2);
//                             }
//                             // console.log(closestItem);
//                             // currentCreature.target = closestItem.pos;
//                             // currentCreature.target = getNextPos(currentCreature.pos, vNormal(vSub(currentCreature.pos, closestItem.pos)), currentCreature.speed);
//                         } else if ((vLength(vSub(currentCreature.pos, player.pos)) <= currentCreature.sight && vLength(vSub(currentCreature.pos, player.pos)) > CELL_SIZE * 1.5) && isReachable(currentCreature.pos, player.pos)) {
//                             console.log(2);
//                             currentCreature.target = getNextPos(player.pos, vNormal(vSub(player.pos, currentCreature.pos)), CELL_SIZE * 1.5);
//                         }
//                     }
//                 } else {
//                     if (Math.random() <= .01) {
//                         let newDir = vNormal(vSub(currentCreature.pos, [currentCreature.pos[0] - 1 + Math.random() * 2, currentCreature.pos[1] - 1 + Math.random() * 2]));
//                         let newPos = getReachablePos(currentCreature.pos, getNextPos(currentCreature.pos, newDir, CELL_SIZE + (CELL_SIZE * Math.random() * 3)));
//                         currentCreature.target = newPos;
//                     }
//                 }
//                 // ..
//                 // AI - Guard
//                 // ..
//                 // AI - Hunter
//             }
//         }

//         // Move
//         if (currentCreature.target && (Math.round(currentCreature.pos[0]) != Math.round(currentCreature.target[0]) || Math.round(currentCreature.pos[1]) != Math.round(currentCreature.target[1]))) {
//             if (vLength(vSub(currentCreature.pos, currentCreature.target)) > currentCreature.speed) {
//                 let nextPos = getNextPos(currentCreature.pos, vNormal(vSub(currentCreature.pos, currentCreature.target)), currentCreature.speed);
//                 currentCreature.pos = nextPos;

//                 if (DEBUG) {
//                     ctx.strokeStyle = "#00FF00";
//                     ctx.beginPath();
//                     ctx.moveTo(currentCreature.pos[0] - view.pos[0], currentCreature.pos[1] - view.pos[1]);
//                     ctx.lineTo(currentCreature.target[0] - view.pos[0], currentCreature.target[1] - view.pos[1]);
//                     ctx.closePath();
//                     ctx.stroke();
//                     ctx.strokeStyle = "#00FF00";
//                     ctx.beginPath();
//                     ctx.arc(currentCreature.target[0] - view.pos[0], currentCreature.target[1] - view.pos[1], currentCreature.size / 2, 0, Math.PI * 2, true);
//                     ctx.closePath();
//                     ctx.stroke();
//                 }

//                 moving = true;
//             } else {
//                 currentCreature.target = undefined;
//             }
//         }

//         // Speed
//         if (currentCreature.sp && (currentCreature.sp[0] != 0 || currentCreature.sp[1] != 0)) {
//             currentCreature.pos = vAdd(currentCreature.pos, currentCreature.sp);
            
//             currentCreature.sp = vMultScalar(currentCreature.sp, .9);
//             if (Math.abs(currentCreature.sp[0]) <= .05) currentCreature.sp[0] = 0;
//             if (Math.abs(currentCreature.sp[1]) <= .05) currentCreature.sp[1] = 0;
//         }

//         // Calc collisions
//         let col = false;
//         obstacles = objects.filter(function (obj) {
//             return obj.type == "creature" || obj.type == "block" || obj.type == "trap" || obj.type == "item" && obj.solid;
//         });
//         obstacles.forEach(function (obj2) {
//             if (currentCreature == obj2) return;
//             let distanceBetween = vLength(vSub(currentCreature.pos, obj2.pos));
//             let closestDistance = (currentCreature.size + obj2.size) / 2;
//             if (distanceBetween < closestDistance) {
//                 col = true;
//                 let dir = vNormal(vSub(currentCreature.pos, obj2.pos));
//                 let newPos = [];
//                 if (obj2.type == "creature") {
//                     newPos = getNextPos(currentCreature.pos, vMultScalar(dir, -1), Math.ceil((closestDistance - distanceBetween)) / 2);
//                     currentCreature.pos = newPos;
//                 } else if (obj2.type == "block" || obj2.type == "item" && obj2.solid) {
//                     newPos = getNextPos(currentCreature.pos, vMultScalar(dir, -1), Math.round((closestDistance - distanceBetween)));
//                     currentCreature.pos = newPos;
//                 } else if (obj2.type == "trap") {
//                     currentCreature.target = undefined;
//                     currentCreature.sp = vMultScalar(dir, obj2.speed);
//                 }

//                 if (DEBUG) {
//                     ctx.strokeStyle = "#FFFFFF";
//                     ctx.beginPath();
//                     ctx.moveTo(obj.pos[0] - view.pos[0], obj.pos[1] - view.pos[1]);
//                     ctx.lineTo(newPos[0] - view.pos[0], newPos[1] - view.pos[1]);
//                     ctx.closePath();
//                     ctx.stroke();

//                     ctx.beginPath();
//                     ctx.arc(newPos[0] - view.pos[0], newPos[1] - view.pos[1], 5, 0, Math.PI * 2, true);
//                     ctx.closePath();
//                     ctx.stroke();
//                 }
//             }
//         });
//         if (DEBUG) {
//             if (col) {
//                 ctx.strokeStyle = "blue";
//             } else {
//                 ctx.strokeStyle = "white";
//             }
//             ctx.beginPath();
//             ctx.arc(currentCreature.pos[0] - view.pos[0], currentCreature.pos[1] - view.pos[1], currentCreature.size / 2, 0, Math.PI * 2, true);
//             ctx.closePath();
//             ctx.stroke();
//         }

//         // Prepare to attack
//         if (currentCreature.dmg && currentCreature.attack[0] < currentCreature.attack[1]) currentCreature.attack[0]++;

//         // Attack nearest foes
//         if (currentCreature.dmg && AI) {
//             let foe = null;
//             let closestDistance = null;
//             creatures.forEach(function (obj) {
//                 if (currentCreature == obj) return;

//                 if (vLength(vSub(currentCreature.pos, obj.pos)) <= currentCreature.attackRange + (CELL_SIZE / 4) && currentCreature.faction != obj.faction && isReachable(currentCreature, obj.pos)) {
//                     let currentDistance = vLength(vSub(currentCreature.pos, obj.pos));
//                     if (!foe || currentDistance < closestDistance) {
//                         closestDistance = currentDistance;
//                         foe = obj;
//                     }
//                 }
//             });
//             if (foe && vLength(vSub(currentCreature.pos, foe.pos)) <= currentCreature.attackRange + (CELL_SIZE / 4) && currentCreature.attack[0] == currentCreature.attack[1]) {
//                 currentCreature.attack[0] = 0;
//                 objects.push({
//                     type: "projectile",
//                     faction: currentCreature.faction,
//                     owner: currentCreature,
//                     pos: getNextPos(currentCreature.pos, vNormal(vSub(currentCreature.pos, foe.pos)), CELL_SIZE / 4),
//                     dir: vNormal(vSub(currentCreature.pos, foe.pos)),
//                     rotation: currentCreature.attackSpriteRotation,
//                     sprite: currentCreature.attackSprite,
//                     speed: currentCreature.attackSpeed,
//                     dmg: currentCreature.dmg,
//                     power: (currentCreature.attackPower ? currentCreature.attackPower : 0),
//                     life: [0, Math.ceil(currentCreature.attackRange / 4)],
//                     size: CELL_SIZE / 1
//                 });
//             }
//         }

//         // Drawing
//         if (inView(currentCreature.pos, currentCreature.size)) {
//             // Draw health
//             if (currentCreature.hp[0] < currentCreature.hp[1]) {
//                 ctx.fillStyle = "red";
//                 ctx.fillRect(Math.round(obj.pos[0] - Math.round(obj.size / 2) - view.pos[0]), Math.round(obj.pos[1] + Math.round(obj.size / 2) + 2 - view.pos[1]), obj.size, 4);
//                 ctx.fillStyle = "gold";
//                 ctx.fillRect(Math.round(obj.pos[0] - Math.round(obj.size / 2) - view.pos[0]), Math.round(obj.pos[1] + Math.round(obj.size / 2) + 2 - view.pos[1]), Math.ceil(obj.size * (obj.hp[0] / obj.hp[1])), 4);
//             }

//             // Draw sprite
//             if (moving) {
//                 if (obj.i != undefined) {
//                     obj.i += .1;
//                 } else {
//                     obj.i = 0;
//                 }

//                 ctx.save();
//                 ctx.translate(Math.round(obj.pos[0] - view.pos[0]), Math.round(obj.pos[1] - view.pos[1] + Math.round(obj.size / 2)));
//                 ctx.rotate((Math.cos(obj.i) * 5) * Math.PI / 180);
//                 ctx.drawImage(TILESET, currentCreature.sprite[0], currentCreature.sprite[1], SPRITE_SIZE, SPRITE_SIZE, - Math.round(obj.size / 2) , - Math.round(obj.size), obj.size, obj.size);
//                 ctx.restore();
//             } else {
//                 ctx.drawImage(TILESET, currentCreature.sprite[0], currentCreature.sprite[1], SPRITE_SIZE, SPRITE_SIZE, Math.round(obj.pos[0] - Math.round(obj.size / 2) - view.pos[0]), Math.round(obj.pos[1] - Math.round(obj.size / 2) - view.pos[1]), obj.size, obj.size);
//             }
            
//             // Draw emotion
//             if (emotion) ctx.drawImage(TILESET, emotion[0], emotion[1], SPRITE_SIZE, SPRITE_SIZE, Math.round(obj.pos[0] - Math.round(obj.size / 2) - view.pos[0]), Math.round(obj.pos[1] - Math.round(obj.size * 1.8) - view.pos[1]), obj.size, obj.size);
            
//             // Draw krown
//             // if (currentCreature.king) ctx.drawImage(TILESET, 44 * SPRITE_SIZE, 2 * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, currentCreature.pos[0] - Math.round(CELL_SIZE / 4) - view.pos[0], currentCreature.pos[1] - (currentCreature.size / 2) - 16 - view.pos[1], CELL_SIZE / 2, CELL_SIZE / 2);
//         }
//     });
// }

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
                        ctx.drawImage(TILESET, splash.sprite[0] * SPRITE_SIZE, splash.sprite[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, - Math.round(splash.size / 2) , - Math.round(splash.size / 2), CELL_SIZE, CELL_SIZE);
                    } else {
                        ctx.drawImage(TILESET, splash.sprite[0] * SPRITE_SIZE, splash.sprite[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, splash.pos[0] - view.pos[0] - CELL_SIZE / 2, splash.pos[1] - view.pos[1] - CELL_SIZE / 2, CELL_SIZE, CELL_SIZE);
                    }
                } else {
                    ctx.font = MD_FONT;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = splash.color;
                    ctx.shadowOffsetX = 1;
                    ctx.shadowOffsetY = 1;
                    ctx.shadowColor = "black";
                    // ctx.fillText(splash.text, splash.pos[0] - view.pos[0], splash.pos[1] - view.pos[1] - CELL_SIZE / 2);
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
    editor.elements.forEach(element => {
        element.selected = onMouse(mouse, element);

        ctx.fillStyle = (element.selected ? 'GOLD' : "VIOLET");
        ctx.fillRect(editor.pos[0] + element.pos[0] - (element.size / 2), editor.pos[1] + element.pos[1] - (element.size / 2), element.size, element.size);

        ctx.strokeStyle = (element.active ? 'LIME' : 'RED');
        ctx.strokeRect(editor.pos[0] + element.pos[0] - (element.size / 2), editor.pos[1] + element.pos[1] - (element.size / 2), element.size, element.size);

        ctx.drawImage(TILESET, element.sprite[0] * SPRITE_SIZE, element.sprite[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, editor.pos[0] + element.pos[0] - (element.size / 2), editor.pos[1] + element.pos[1] - (element.size / 2), element.size, element.size);
    });
}

function drawUI(ctx) {
    ctx.font = MD_FONT;
    ctx.textAlign = "center";
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
        ctx.fillStyle = COLORS.GOLD;
        ctx.fillText(world.player.gold,
            CELL_SIZE * 2,
            CELL_SIZE
        );
    }

    // ctx.drawImage(TILESET, SPRITES.ORE[0] * SPRITE_SIZE, SPRITES.ORE[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, 
    //     CELL_SIZE - Math.round(CELL_SIZE / 2),
    //     (CELL_SIZE * 2) - Math.round(CELL_SIZE / 2),
    //     CELL_SIZE, CELL_SIZE
    // );
    // ctx.fillStyle = COLORS.GRAY;
    // ctx.fillText(world.player.ore,
    //     CELL_SIZE * 2,
    //     CELL_SIZE * 2
    // );

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

    // ctx.drawImage(TILESET, SPRITES.SWORD[0] * SPRITE_SIZE, SPRITES.SWORD[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, 
    //     Math.round(currentCreature.pos[0] - Math.round(CELL_SIZE / 3) - Math.round(CELL_SIZE * .75 / 2) - view.pos[0]),
    //     Math.round(currentCreature.pos[1] + Math.round(CELL_SIZE / 3) + Math.round(CELL_SIZE / 2) - view.pos[1]),
    //     CELL_SIZE * .75 ,CELL_SIZE * .75
    // );
    // ctx.fillStyle = COLORS.BAD;
    // ctx.fillText('~' + currentCreature.attackDamage * Math.ceil(currentCreature.hp / currentCreature.attackRepeatMulti),
    //     currentCreature.pos[0] + Math.round(CELL_SIZE / 3) - view.pos[0],
    //     currentCreature.pos[1] + Math.round(CELL_SIZE * .75) + Math.round(CELL_SIZE / 2) - view.pos[1]
    // );

    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowColor = "";
}

function onClickHandler() {
    mouse.lastPos = mouse.pos;
    let viewMousePos = vAdd(mouse.pos, view.pos);
    let viewMouseStartPos = vAdd(mouse.startPos, view.pos);
    let viewMousePosDelta = vSub(viewMouseStartPos, viewMousePos);

    let handled = false;

    // Editor
    let haveSelected = editor.elements.filter(e => e.selected);
    if (haveSelected.length) editor.elements.forEach(element => {
        if (element.selected) {
            let sameLayerElements = editor.elements.filter(e => element.layer == e.layer && !e.toggle);
            if (sameLayerElements.length) sameLayerElements.forEach(e => e.active = false);
            element.active = !element.active;

            switch (element.mode) {
                case "view": {
                    editor.mode = element.mode;
                    break;
                }
                case "draw": {
                    editor.mode = element.mode;
                    editor.drawLayer = element.drawLayer;
                    break;   
                }
                case "animate": {
                    editor.drawAnimate = element.active;
                    break;   
                }
                case "place": {
                    editor.mode = element.mode;
                    break;   
                }
                case "erase": {
                    editor.eraserMode = element.active;
                    break;   
                }
                case "test": {
                    editor.mode = element.mode;
                    break;  
                }
            }

            handled = true;
        }
    });

    // Creatures
    if (!handled) {
        let creaturesInView = world.creatures.filter(creature => inView(creature.pos, creature.size) && onMouseInView(mouse, creature));
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
        let storesInView = world.stores.filter(store => inView(store.pos, store.size) && onMouseInView(mouse, store));
        if (storesInView.length) storesInView.forEach(store => {
            handled = true;
            if (store.onClick != undefined) store.onClick(store);
        });
    }

    // Drag map
    if (!handled) {
        controller.dragMap = true;
    }

    if (!handled && DEBUG) {
        world.splashes.push({
            'pos': [0,0],
            'life': [0, 30],
            'size': CELL_SIZE / 2,
            'sprite': SPRITES.MEAT,
            'fadeIn': true,
            'points': [
                [0,0],
                getPosBetween([0,0], viewMousePos),
                viewMousePos,
            ],
            'onDrop': () => world.items.push({
                'type': 'item',
                'itemType': 'food',
                'pos': viewMousePos,
                'sprite': SPRITES.MEAT,
                'size': CELL_SIZE,
                'animation': 0,
            })
        });
    }
}
function onDragHandler() {
    mouse.lastPos = mouse.pos;
    let viewMousePos = vAdd(mouse.pos, view.pos);
    let viewMouseStartPos = vAdd(mouse.startPos, view.pos);
    let viewMousePosDelta = vSub(viewMouseStartPos, viewMousePos);

    if (editor.enabled && editor.mode != 'view') {
        // Editor
        let viewMousePosGrid = [Math.floor((viewMousePos[0] + (CELL_SIZE / 2)) / CELL_SIZE) * CELL_SIZE, Math.floor((viewMousePos[1] + (CELL_SIZE / 2)) / CELL_SIZE) * CELL_SIZE];
        
        switch (editor.mode) {
            case "draw": {
                let objectsToReplace = world.sprites.filter(e => e.pos[0] == viewMousePosGrid[0] && e.pos[1] == viewMousePosGrid[1] && e.layer == editor.drawLayer);
                if (objectsToReplace.length) objectsToReplace.forEach(e => dropObj(world.sprites, e));

                if (!editor.eraserMode) world.sprites.push({
                    'pos': viewMousePosGrid,
                    'sprite': [Math.round(Math.random() * 8),Math.round(Math.random() * 8)],
                    'size': CELL_SIZE,
                    'layer': editor.drawLayer,
                    'animation': (editor.drawAnimate ? 0 : null)
                });

                break;
            }
        }
    } else {
        // Game && editor view control
        // view.pos = vAdd(view.startPos, viewMousePosDelta);
    }
    if (controller.dragCreature) controller.dragCreature.target = getNearestPos(controller.dragCreature, viewMousePos, true);
    if (controller.dragMap) view.pos = vAdd(view.startPos, viewMousePosDelta);
}

function onMouse(mouse, obj) {
    return (mouse.pos != null && mouse.pos[0] >= obj.pos[0] - (obj.size / 2) && mouse.pos[0] <= obj.pos[0] + (obj.size / 2) && mouse.pos[1] >= obj.pos[1] - (obj.size / 2) && mouse.pos[1] <= obj.pos[1] + (obj.size / 2));
}
function onMouseInView(mouse, obj) {
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
function isReachableOLD(pos1, pos2, onlyVision, offset) {
    if (onlyVision == undefined) onlyVision = false;
    if (offset == undefined) offset = - 2;

    let stepSize = 1;
    let vision = true;
    let obstacles = objects.filter(function (obj) { return ((onlyVision && obj.type == "block" && obj.vision) || (!onlyVision && obj.type == "block")) || obj.type == "item" && obj.solid; });

    let nextPos = getNextPos(pos1, vNormal(vSub(pos1, pos2)), stepSize);
    while (vision && vLength(vSub(nextPos, pos2)) > stepSize) {
        obstacles.forEach(function (obstacle) { if (vision && vLength(vSub(nextPos, obstacle.pos)) < (obstacle.size + offset)) vision = false; });
        if (vision) nextPos = getNextPos(nextPos, vNormal(vSub(nextPos, pos2)), stepSize);
    }

    return vision;
}
function getNearestPos(creature, targetPos, ignoreTransparent) {
    if (ignoreTransparent == undefined) ignoreTransparent = false;

    let stepSize = 1;
    let canMove = true;

    let obstacles = world.blocks.filter(obstacle => !ignoreTransparent || ignoreTransparent && !obstacle.transparent);
    let nextPos = getNextPos(creature.pos, vNormal(vSub(creature.pos, targetPos)), stepSize);
    while (canMove && vLength(vSub(nextPos, targetPos)) > stepSize) {
        obstacles.forEach(block => {
            if (canMove && vLength(vSub(nextPos, block.pos)) <= (creature.size + block.size) / 2) canMove = false; 
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