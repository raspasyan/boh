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
    BAD: "#ff5722",
    WHEAT: "wheat"
}

const SPRITES = {
    KEY: [16, 9],
    BOX: [16, 4],
    COIN: [16, 7],
    HEART: [17, 7],
    SWORD: [16, 8],
    HELMET: [17, 8],
    CROWN: [17, 9],
    MEAT: [18, 7],
    ORE: [18, 8],
    CHEST: [6, 5],
    GOLDEN_CHEST: [7, 5],
    ORE_MINE: [4, 7],
    CRYSTALL: [18, 9],
    CRYSTALL_MINE: [6, 7],
    GOLD_MINE: [5, 7],
    HOUSE_01: [12, 9],
    TOMB_01: [4, 3],
    ROGUE: [2, 6],
    PR_SWORD: [17, 5],
    PR_ARROW: [16, 5],
    PR_SPEAR: [18, 5],
    SIGN_01: [4, 4],
    SIGN_02: [5, 4],
    PEASANT: [3, 10],
    SKELETON: [2, 9],
    ORC: [2, 5],
    I_SWORD_01: [19, 18],
    I_ARMOR_01: [18, 17]
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
            'keys': 0,
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
                'attackSprite': SPRITES.PR_SWORD,
                'attackRotation': true,
                'faction': 'evil',
                'enemyFactions': [
                    'ally',
                    'orcs'
                ],
                'color': COLORS.WHEAT
            },
            // Орочий босс
            {
                'type': 'creature',
                'pos': [CELL_SIZE * 10, CELL_SIZE * 0],
                'sprite': SPRITES.ORC,
                'healthSprite': SPRITES.HEART,
                'size': CELL_SIZE,
                'sizeScaleLimit': 500,
                'target': null,
                'speed': 2,
                'hp': 500,
                'king': true,
                'attack': [45, 45],
                'attackRepeat': 0,
                'attackRepeatMulti': 500,
                'attackDamage': 50,
                'attackRange': CELL_SIZE * 7,
                'attackPower': 5,
                'attackType': 'ranged',
                'attackSprite': SPRITES.PR_SPEAR,
                'attackRotation': true,
                'faction': 'orcs',
                'enemyFactions': [
                    'ally',
                    ''
                ],
                'color': 'pink', //COLORS.BAD,
                'onDrop': (self) => {
                    let goldCount = 300;
                    while (goldCount) {
                        let randomPos = [self.pos[0] - CELL_SIZE + Math.random() * CELL_SIZE * 2, self.pos[1] - CELL_SIZE + Math.random() * CELL_SIZE * 2];
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
                'color': COLORS.GRAY,
                'onHit': (self, projectile) => {
                    if (Math.random() >= .9) {
                        world.splashes.push({
                            'pos': self.pos,
                            'life': [0, 30],
                            'size': CELL_SIZE / 2,
                            'sprite': SPRITES.COIN,
                            'fadeIn': true,
                            'points': [
                                self.pos,
                                getPosBetween(self.pos, projectile.owner.pos),
                                projectile.owner.pos,
                            ],
                            'onDrop': () => world.items.push({
                                'type': 'item',
                                'itemType': 'gold',
                                'pos': projectile.owner.pos,
                                'sprite': SPRITES.COIN,
                                'size': CELL_SIZE,
                                'animation': Math.random(),
                            })
                        });
                    }
                },
                'onDrop': (self) => console.log('dropped')
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
                'color': COLORS.GRAY,
                'onHit': (self, projectile) => {
                    if (Math.random() >= .8) {
                        world.splashes.push({
                            'pos': self.pos,
                            'life': [0, 30],
                            'size': CELL_SIZE / 2,
                            'sprite': SPRITES.COIN,
                            'fadeIn': true,
                            'points': [
                                self.pos,
                                getPosBetween(self.pos, projectile.owner.pos),
                                projectile.owner.pos,
                            ],
                            'onDrop': () => world.items.push({
                                'type': 'item',
                                'itemType': 'gold',
                                'pos': projectile.owner.pos,
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
                'color': COLORS.GRAY,
                'onHit': (self, projectile) => {
                    if (Math.random() >= .95) {
                        world.splashes.push({
                            'pos': self.pos,
                            'life': [0, 30],
                            'size': CELL_SIZE / 2,
                            'sprite': SPRITES.CRYSTALL,
                            'fadeIn': true,
                            'points': [
                                self.pos,
                                getPosBetween(self.pos, projectile.owner.pos),
                                projectile.owner.pos,
                            ],
                            'onDrop': () => world.items.push({
                                'type': 'item',
                                'itemType': 'crystall',
                                'pos': projectile.owner.pos,
                                'sprite': SPRITES.CRYSTALL,
                                'size': CELL_SIZE,
                                'animation': Math.random(),
                            })
                        });
                    }
                },
                'onDrop': (self) => {}
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
                        // let randomPos = [self.pos[0] - CELL_SIZE + Math.random() * CELL_SIZE * 2, self.pos[1] - CELL_SIZE + Math.random() * CELL_SIZE * 2];
                        let randomDir = vNormal(vSub(self.pos, [self.pos[0] + (-1 + Math.random() * 2), self.pos[1] + (-1 + Math.random() * 2)]));
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
            // Сундук
            {
                'type': 'creature',
                'pos': [CELL_SIZE * -1, CELL_SIZE * -1],
                'sprite': SPRITES.CHEST,
                'healthSprite': SPRITES.ORE,
                'size': CELL_SIZE,
                'sizeScaleLimit': 0,
                'target': null,
                'speed': 0,
                'hp': 10,
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
                },
                'onDrop': (self) => {
                    let count = 150;
                    while (count) {
                        let randomDir = vNormal(vSub(self.pos, [self.pos[0] + (-1 + Math.random() * 2), self.pos[1] + (-1 + Math.random() * 2)]));
                        let randomPos = getNearestPos(self, getNextPos(self.pos, randomDir, Math.random() * CELL_SIZE));

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
                                'animation': Math.random(),
                            })
                        });

                        count--;
                    }
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
            // Меч
            {
                'type': 'item',
                'itemType': 'equip',
                'title': 'Sword+',
                'color': COLORS.WHEAT,
                'equipType': 'weapon',
                'pos': [CELL_SIZE * 1, CELL_SIZE * 4],
                'sprite': SPRITES.I_SWORD_01,
                'size': CELL_SIZE,
                'animation': Math.random() * 5,
                'onEquip': (self, creature) => {
                    creature.attackDamage += 5;
                    creature.attackPower -= 1;
                },
                'onUnequip': (self, creature) => {
                    creature.attackDamage -= 5;
                    creature.attackPower += 1;
                },
            },
            // armor
            {
                'type': 'item',
                'itemType': 'equip',
                'equipType': 'weapon',
                'title': 'Armor+',
                'color': COLORS.WHEAT,
                'pos': [CELL_SIZE * 2, CELL_SIZE * 5],
                'sprite': SPRITES.I_ARMOR_01,
                'size': CELL_SIZE,
                'animation': Math.random() * 10,
                'onEquip': (self, creature) => {
                    creature.hp += 50;
                },
                'onUnequip': (self, creature) => {
                    if (creature.hp > 50) {
                        creature.hp -= 50;
                    } else {
                        creature.hp = 1;
                    }
                },
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
                            let count = 10;
                            while (count) {
                                let randomDir = vNormal(vSub(self.pos, [self.pos[0] + (-1 + Math.random() * 2), self.pos[1] + (-1 + Math.random() * 2)]));
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

                                count--;
                            }
                            
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
                'color': COLORS.GRAY
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
                            let randomDir = vNormal(vSub(self.pos, [self.pos[0] + (-1 + Math.random() * 2), self.pos[1] + (-1 + Math.random() * 2)]));
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
                'color': COLORS.GRAY
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
                            world.player.crystalls -= self.countToGive;

                            self.restock[0] = 0;

                            let count = 99;
                            while (count) {
                                let randomDir = vNormal(vSub(self.pos, [self.pos[0] + (-1 + Math.random() * 2), self.pos[1] + (-1 + Math.random() * 2)]));
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
                'color': COLORS.GRAY
            },
            // golden chest
            {
                'type': 'store',
                'pos': [CELL_SIZE * 0, CELL_SIZE * 3],
                'sprite': SPRITES.GOLDEN_CHEST,
                'spriteToReceive': null,
                'spriteToGive': SPRITES.KEY,
                'countToGive': 1,
                'restock': [0, 0],
                'size': CELL_SIZE,
                'onClick': self => {
                    if (self.restock[0] == self.restock[1]) {
                        if (world.player.keys >= self.countToGive) {
                            world.player.keys -= self.countToGive;

                            let randomDir = vNormal(vSub(self.pos, [self.pos[0] + (-1 + Math.random() * 2), self.pos[1] + (-1 + Math.random() * 2)]));
                            let randomPos = getNextPos(self.pos, randomDir, CELL_SIZE);

                            world.splashes.push({
                                'pos': self.pos,
                                'life': [0, 30],
                                'size': CELL_SIZE / 2,
                                'sprite': SPRITES.KEY,
                                'fadeIn': true,
                                'points': [
                                    self.pos,
                                    getPosBetween(self.pos, randomPos),
                                    randomPos,
                                ],
                                'onDrop': () => world.items.push({
                                    'type': 'item',
                                    'itemType': 'key',
                                    'pos': randomPos,
                                    'sprite': SPRITES.KEY,
                                    'size': CELL_SIZE,
                                    'animation': Math.random(),
                                })
                            });

                            world.splashes.push({
                                'pos': self.pos,
                                'life': [0, 15],
                                'size': CELL_SIZE,
                                'sprite': self.sprite,
                                'fadeOut': true,
                                'points': [
                                    self.pos,
                                    [self.pos[0], self.pos[1] - CELL_SIZE / 2]
                                ]
                            });

                            dropObj(world.stores, self);
                        }
                    }
                },
                'color': COLORS.GRAY
            },
        ]
    }
}
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

    onEnterFrame();
    function onEnterFrame() {
        onEnterFrameHandler(cvs, ctx);
        requestAnimationFrame(onEnterFrame);
    }
});

function onEnterFrameHandler(cvs, ctx) {
    ctx.fillStyle = COLORS.BACKGROUND;
    ctx.fillRect(0, 0, cvs.width, cvs.height);

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

    // render();
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
                        'size': CELL_SIZE / 2,
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

                    ctx.fillStyle = item.color;
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
                            'size': CELL_SIZE / 2,
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
                        Math.round(currentCreature.pos[0] - Math.round(CELL_SIZE / 3) - Math.round(CELL_SIZE * .75 / 2) - view.pos[0]),
                        Math.round(currentCreature.pos[1] + Math.round(CELL_SIZE / 3) - view.pos[1]),
                        CELL_SIZE * .75 ,CELL_SIZE * .75
                    );
                    ctx.fillStyle = currentCreature.color;
                    ctx.fillText(currentCreature.hp,
                        currentCreature.pos[0] + Math.round(CELL_SIZE / 3) - view.pos[0],
                        currentCreature.pos[1] + Math.round(CELL_SIZE * .75) - view.pos[1]
                    );
                }

                if (selected && currentCreature.attackDamage) {
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
                    if (currentCreature.kingAnimation == undefined) currentCreature.kingAnimation = Math.random() * 10;
                    currentCreature.kingAnimation += .1;

                    ctx.drawImage(TILESET, SPRITES.CROWN[0] * SPRITE_SIZE, SPRITES.CROWN[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, 
                        Math.round(currentCreature.pos[0] - Math.round(CELL_SIZE / 2) - view.pos[0]  - Math.cos(currentCreature.kingAnimation) * 2),
                        Math.round(currentCreature.pos[1] - Math.round(CELL_SIZE * 1.5) - view.pos[1] - Math.sin(currentCreature.kingAnimation) * 2),
                        CELL_SIZE ,CELL_SIZE
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
        element.selected = onMouse(element);

        ctx.fillStyle = (element.selected ? 'GOLD' : "VIOLET");
        ctx.fillRect(editor.pos[0] + element.pos[0] - (element.size / 2), editor.pos[1] + element.pos[1] - (element.size / 2), element.size, element.size);

        ctx.strokeStyle = (element.active ? 'LIME' : 'RED');
        ctx.strokeRect(editor.pos[0] + element.pos[0] - (element.size / 2), editor.pos[1] + element.pos[1] - (element.size / 2), element.size, element.size);

        ctx.drawImage(TILESET, element.sprite[0] * SPRITE_SIZE, element.sprite[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, editor.pos[0] + element.pos[0] - (element.size / 2), editor.pos[1] + element.pos[1] - (element.size / 2), element.size, element.size);
    });
}

function drawUI(ctx) {
    if (!controller.dragMap) view.pos = [world.player.king.pos[0] - (view.width / 2), world.player.king.pos[1] - (view.height / 2)];

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

    // Drag map
    if (!handled) {
        // controller.dragMap = true;
    }

    if (!handled && DEBUG) {
        let randomDir = vNormal(vSub(viewMousePos, [viewMousePos[0] + (-1 + Math.random() * 2), viewMousePos[1] + (-1 + Math.random() * 2)]));
        let randomPos = getNextPos(viewMousePos, randomDir, CELL_SIZE);

        world.splashes.push({
            'pos': viewMousePos,
            'life': [0, 30],
            'size': CELL_SIZE / 2,
            'sprite': SPRITES.MEAT,
            'fadeIn': true,
            'points': [
                viewMousePos,
                getPosBetween(viewMousePos, randomPos),
                randomPos,
            ],
            'onDrop': () => world.items.push({
                'type': 'item',
                'itemType': 'food',
                'pos': randomPos,
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