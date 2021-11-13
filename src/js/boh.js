const CELL_SIZE = 16 * 2;
const SPRITE_SIZE = 16;

const TILESET = new Image();
// TILESET.src = "src/media/colored_tilemap_packed.png";
TILESET.src = "src/media/tileset.png";

const SM_FONT = "bold 10pt monospace";
const MD_FONT = "bold 12pt monospace";
const BG_FONT = "bold 16pt monospace";

// const BACKGROUND_COLOR = "#112222";
const BACKGROUND_COLOR = "#263238";
const GOLD_COLOR = "#FFE228";
const CRYSTALLS_COLOR = "#5DE0E2";
const GOOD_COLOR = "lime";
const BAD_COLOR = "red";

const DEFAULT_SIGHT = CELL_SIZE * 8;

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
        'sprites': [
            {
                'pos': [0, 0],
                'sprite': [1, 1],
                'size': CELL_SIZE,
                'layer': 0
            }
        ],
        'creatures': [
            {
                'type': 'creature',
                'pos': [CELL_SIZE * 0, CELL_SIZE * 0],
                'sprite': [0, 6],
                'size': CELL_SIZE,
                'target': null,
                'speed': 2,
                'hp': 10,
                'attack': [30, 30],
                'attackDamage': 1,
                'attackRange': CELL_SIZE,
                'attackPower': 2,
                'attackType': 'melee',
                'attackSprite': [17, 4],
                'attackRotation': true,
                'faction': 'ally',
                'color': '#cddc39'
            },
            {
                'type': 'creature',
                'pos': [CELL_SIZE * 2, CELL_SIZE * 0],
                'sprite': [0, 4],
                'size': CELL_SIZE,
                'target': null,
                'speed': 2,
                'hp': 20,
                'attack': [45, 45],
                'attackDamage': 1,
                'attackRange': CELL_SIZE * 5,
                'attackPower': 1,
                'attackType': 'ranged',
                'attackSprite': [17, 5],
                'attackRotation': true,
                'faction': 'enemy',
                'color': '#ff5722'
            },
            {
                'type': 'creature',
                'pos': [CELL_SIZE * 2, CELL_SIZE * 2],
                'sprite': [2, 6],
                'size': CELL_SIZE,
                'target': null,
                'speed': 2,
                'hp': 20,
                'attack': [45, 45],
                'attackDamage': 1,
                'attackRange': CELL_SIZE * 5,
                'attackPower': 1,
                'attackType': 'ranged',
                'attackSprite': [16, 6],
                'attackRotation': false,
                'faction': 'mage',
                'color': 'pink'
            }
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

// Player
let player = null;
// player = {
//     type: "creature",
//     faction: "royal",
//     pos: [0, 0],
//     speed: 3,
//     hp: [10, 10],
//     regen: [0, 300],
//     dmg: 1,
//     attack: [30, 30],
//     attackRange: CELL_SIZE * 2,
//     attackSprite: [(15 * SPRITE_SIZE), (3 * SPRITE_SIZE)],
//     attackSpriteRotation: true,
//     attackSpeed: 5,
//     attackPower: 0,
//     attackRecoil: 0,
//     gold: 0,
//     crystalls: 0,
//     size: CELL_SIZE,
//     sprite: [(2 * SPRITE_SIZE), (6 * SPRITE_SIZE)],
//     sight: DEFAULT_SIGHT
// };
// objects.push(player);

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
        if (player) {
            if (e.code == "KeyW") controller.up = true;
            if (e.code == "KeyS") controller.down = true;
            if (e.code == "KeyA") controller.left = true;
            if (e.code == "KeyD") controller.right = true;
            if (e.code == "Space") controller.use = true;
        } else {
            if (e.code == "KeyW") view.pos[1] -= CELL_SIZE * 2;
            if (e.code == "KeyS") view.pos[1] += CELL_SIZE * 2;
            if (e.code == "KeyA") view.pos[0] -= CELL_SIZE * 2;
            if (e.code == "KeyD") view.pos[0] += CELL_SIZE * 2;

            if (e.code == "KeyZ") editorRemover = !editorRemover;
            if (e.code == "KeyX") editorAnimation = !editorAnimation;
            if (e.code == "KeyV") editorVisibleBlock = !editorVisibleBlock;

            if (e.code == "Digit1") editorObjectType = "sprite";
            if (e.code == "Digit2") editorObjectType = "block";
            if (e.code == "Digit3") editorObjectType = "guardian";
            if (e.code == "Digit4") editorObjectType = "axeman";
            if (e.code == "Digit5") editorObjectType = "goblin";
            if (e.code == "Digit6") editorObjectType = "orc";
            if (e.code == "Digit7") editorObjectType = "archer";
            
            if (e.code == "KeyE") editorObjectType = "item_gold";
            if (e.code == "KeyR") editorObjectType = "palm_tree";
            if (e.code == "KeyT") editorObjectType = "wheat";
            if (e.code == "KeyQ") editorObjectType = "item_criminal";

            if (e.code == "Space") {
                console.info("SAVED");
                localStorage.setItem("world", JSON.stringify(world));
            }
        }
    });
    document.body.addEventListener("keyup", function (e) {
        if (player) {
            if (e.code == "KeyW") controller.up = false;
            if (e.code == "KeyS") controller.down = false;
            if (e.code == "KeyA") controller.left = false;
            if (e.code == "KeyD") controller.right = false;
            if (e.code == "Space") controller.use = false;
        }
    });

    onFrameHandler();

    function onFrameHandler() {
        render(cvs, ctx);
        requestAnimationFrame(onFrameHandler);
    }
});

function render(cvs, ctx) {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    // Draw sprites
    if (world.sprites.length) drawSprites(ctx, world.sprites);

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
            let foes = world.creatures.filter(creature => creature.faction != projectile.faction && vLength(vSub(projectile.pos, creature.pos)) <= (projectile.size / 2));
            if (foes.length) foes.forEach(foe => {
                let damage = Math.ceil(projectile.owner.attackDamage * projectile.owner.hp / 2);
                if (damage <= 0) damage = 1;
                foe.hp -= damage;
                if (projectile.owner.attackPower) foe.sp = vMultScalar(vNormal(vSub(projectile.pos, foe.pos)), -projectile.owner.attackPower);

                addDamageSplash(foe.pos, damage);
            })

            dropObj(projectiles, projectile);
        }
    });
}

function drawCreatures(ctx, creatures) {
    creatures.forEach(currentCreature => {
        let moving = false;

        // Move
        if (currentCreature.target && (Math.round(currentCreature.pos[0]) != Math.round(currentCreature.target[0]) || Math.round(currentCreature.pos[1]) != Math.round(currentCreature.target[1]))) {
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
        if (currentCreature.sp && (currentCreature.sp[0] != 0 || currentCreature.sp[1] != 0)) {
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
                    newPos = getNextPos(currentCreature.pos, vMultScalar(dir, -1), Math.ceil((closestDistance - distanceBetween)) / 2);
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
        if (AI && currentCreature != player && currentCreature.attackDamage) {
            let foe = null;
            let closestDistance = null;
            creatures.forEach(otherCreature => {
                if (currentCreature == otherCreature) return;
                if (vLength(vSub(currentCreature.pos, otherCreature.pos)) <= currentCreature.attackRange + (CELL_SIZE / 4) && currentCreature.faction != otherCreature.faction && isReachable(currentCreature, [otherCreature.pos[0], otherCreature.pos[1]])) {
                    let currentDistance = vLength(vSub(currentCreature.pos, otherCreature.pos));
                    if (!foe || currentDistance < closestDistance) {
                        closestDistance = currentDistance;
                        foe = otherCreature;
                    }
                }
            });
            
            if (foe && vLength(vSub(currentCreature.pos, foe.pos)) <= currentCreature.attackRange + (CELL_SIZE / 4) && currentCreature.attack[0] == currentCreature.attack[1]) {
                currentCreature.attack[0] = 0;

                // world.splashes.push({
                //     'pos': [currentCreature.pos[0], currentCreature.pos[1]],
                //     'life': [0, 30],
                //     'size': CELL_SIZE / 2,
                //     'text': 'Atk!',
                //     'color': "red"
                // });

                switch (currentCreature.attackType) {
                    case "melee": {
                        world.projectiles.push({
                            'owner': currentCreature,
                            'pos': currentCreature.pos,
                            'sprite': currentCreature.attackSprite,
                            'size': CELL_SIZE,
                            'points': [
                                currentCreature.pos,
                                foe.pos
                            ],
                            'life': [0, 10],
                            'rotation': currentCreature.attackRotation
                        });

                        break;
                    }

                    case "ranged": {
                        let projectileTargetPos = foe.pos;
                        if (foe.target && Math.random() >= .5) projectileTargetPos = getNearestPos(foe, getNextPos(foe.pos, vNormal(vSub(foe.pos, foe.target)), 90));
                        world.projectiles.push({
                            'owner': currentCreature,
                            'pos': currentCreature.pos,
                            'sprite': currentCreature.attackSprite,
                            'size': CELL_SIZE,
                            'points': [
                                currentCreature.pos,
                                [currentCreature.pos[0] + (projectileTargetPos[0] - currentCreature.pos[0]) / 2, (projectileTargetPos[1] > currentCreature.pos[1] ? currentCreature.pos[1] : projectileTargetPos[1]) - CELL_SIZE * 2],
                                [projectileTargetPos[0] - (foe.size / 4) + (Math.random() * (foe.size / 2)), projectileTargetPos[1] - (foe.size / 4) + (Math.random() * (foe.size / 2))]
                            ],
                            'life': [0, 45],
                            'rotation': currentCreature.attackRotation
                        });
                        break;
                    }
                }
            }
        }

        // Draw
        if (inView(currentCreature.pos, currentCreature.size)) {
            if (moving) {
                if (currentCreature.i != undefined) {
                    currentCreature.i += .1;
                } else {
                    currentCreature.i = 0;
                }

                ctx.save();
                ctx.translate(Math.round(currentCreature.pos[0] - view.pos[0]), Math.round(currentCreature.pos[1] - view.pos[1] + Math.round(currentCreature.size / 2)));
                ctx.rotate((Math.cos(currentCreature.i) * 5) * Math.PI / 180);
                ctx.drawImage(TILESET, currentCreature.sprite[0] * SPRITE_SIZE, currentCreature.sprite[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, - Math.round(currentCreature.size / 2) , - Math.round(currentCreature.size), currentCreature.size, currentCreature.size);
                ctx.restore();
            } else {
                ctx.drawImage(TILESET, currentCreature.sprite[0] * SPRITE_SIZE, currentCreature.sprite[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, Math.round(currentCreature.pos[0] - Math.round(currentCreature.size / 2) - view.pos[0]), Math.round(currentCreature.pos[1] - Math.round(currentCreature.size / 2) - view.pos[1]), currentCreature.size, currentCreature.size);
            }

            if (currentCreature.hp != undefined) {
                ctx.font = SM_FONT;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = currentCreature.color;

                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;
                ctx.shadowColor = "black";

                ctx.drawImage(TILESET, 16 * SPRITE_SIZE, 8 * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, Math.round(currentCreature.pos[0] - Math.round(CELL_SIZE * .75 / 2) - view.pos[0]), Math.round(currentCreature.pos[1] + CELL_SIZE * .75 - view.pos[1]), CELL_SIZE * .75 ,CELL_SIZE * .75);
                ctx.fillText(currentCreature.hp, currentCreature.pos[0] - view.pos[0], currentCreature.pos[1] - view.pos[1] + CELL_SIZE * .8 );

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
    });
}
function drawCreaturesOLD(ctx, creatures) {
    creatures.forEach(function (obj) {
        let currentCreature = obj;
        let emotion = null;
        let moving = false;

        // Dead
        if (currentCreature.hp[0] <= 0) {
            // currentCreature.hp[0] = 0;
            // if (currentCreature.respawn) {
            //     currentCreature.type = "sprite";    
            // } else {
            //     dropObj(objects, currentCreature);
            // }

            dropObj(objects, currentCreature);

            // Drop item
            // if (Math.random() <= .4) {
            //     objects.push({
            //         type: "item",
            //         pos: [currentCreature.pos[0], currentCreature.pos[1]],
            //         sprite: [(5 * SPRITE_SIZE), (11 * SPRITE_SIZE)],
            //         size: CELL_SIZE
            //     });
            // }

            return;
        } else if (currentCreature.hp[0] < currentCreature.hp[1]) {
            if (currentCreature.regen[0] == currentCreature.regen[1]) {
                currentCreature.regen[0] = 0;
                currentCreature.hp[0] += 1;

                // objects.push({
                //     type: "splash",
                //     pos: [currentCreature.pos[0], currentCreature.pos[1]],
                //     size: CELL_SIZE,
                //     sprite: [SPRITE_SIZE * 16, SPRITE_SIZE * 7],
                //     text: "+" + 1,
                //     color: "lime",
                //     life: [0, 45]
                // });
            } else {
                currentCreature.regen[0]++;
            }
        } else if (currentCreature.hp[0] > currentCreature.hp[1]) currentCreature.hp[0] = currentCreature.hp[1];

        // AI
        if (AI && currentCreature != player) {
            let closestTarget = null;
            if (currentCreature.dmg) {
                let closestTargetDistance = null;
                creatures.forEach(function (obj) {
                    if (currentCreature == obj) return;
                    let currentTarget = obj;

                    if (vLength(vSub(currentCreature.pos, currentTarget.pos)) <= currentCreature.sight && currentCreature.faction != currentTarget.faction && isReachable(currentCreature.pos, obj.pos)) {
                        let currentDistance = vLength(vSub(currentCreature.pos, currentTarget.pos));
                        if (!closestTarget || currentDistance < closestTargetDistance) {
                            closestTargetDistance = currentDistance;
                            closestTarget = currentTarget;
                        }
                    }
                });
            }
            if (closestTarget) {
                if (currentCreature.hp[0] > Math.ceil(currentCreature.hp[1] / 5)) {
                    if (vLength(vSub(currentCreature.pos, closestTarget.pos)) > currentCreature.attackRange + (CELL_SIZE / 4)) {
                        // Pursuit
                        let closestPosToAttack = getNextPos(closestTarget.pos, vNormal(vSub(closestTarget.pos, currentCreature.pos)), currentCreature.attackRange);
                        currentCreature.target = closestPosToAttack;

                        // Emotion
                        emotion = [SPRITE_SIZE * 18, SPRITE_SIZE * 1];
                    } else {
                        // Evasion
                        if (Math.random() <= .05) {
                            let newDir = vNormal(vSub(currentCreature.pos, [currentCreature.pos[0] - 1 + Math.random() * 2, currentCreature.pos[1] - 1 + Math.random() * 3]));
                            let newPos = getReachablePos(currentCreature.pos, getNextPos(currentCreature.pos, newDir, CELL_SIZE + (CELL_SIZE * Math.random() * 1)));
                            if (vLength(vSub(newPos, closestTarget.pos)) <= currentCreature.attackRange + (CELL_SIZE / 4)) currentCreature.target = newPos;
                        }

                        // Emotion
                        emotion = [SPRITE_SIZE * 16, SPRITE_SIZE * 0];
                    }
                } else {
                    // Try to escape
                    let posToEscape = getReachablePos(currentCreature.pos, getNextPos(closestTarget.pos, vNormal(vSub(closestTarget.pos, currentCreature.pos)), closestTarget.sight + 1));
                    
                    currentCreature.target = posToEscape;

                    // Emotion
                    emotion = [SPRITE_SIZE * 17, SPRITE_SIZE * 0];
                }
            } else {
                // AI
                if (currentCreature.ai) {
                    // console.log("think");
                    // Follower
                    if (currentCreature.ai == "follower" && player && (vLength(vSub(currentCreature.pos, player.pos)) <= currentCreature.sight && vLength(vSub(currentCreature.pos, player.pos)) > CELL_SIZE * 1.5) && isReachable(currentCreature.pos, player.pos)) {
                        currentCreature.target = getNextPos(player.pos, vNormal(vSub(player.pos, currentCreature.pos)), CELL_SIZE * 1.5);
                    } else if (currentCreature.ai == "worker" && player && !currentCreature.target) {
                        // Worker
                        let items = objects.filter(function(obj) { return obj.type == "item" && !obj.itemType;});
                        let closestItem = null;
                        let closestItemDistance = null;
                        console.log("search");
                        items.forEach(function (obj) {
                            if (currentCreature == obj) return;
                            let currentItem = obj;

                            if (vLength(vSub(currentCreature.pos, currentItem.pos)) <= currentCreature.sight && isReachable(currentCreature.pos, currentItem.pos)) {
                                let currentDistance = vLength(vSub(currentCreature.pos, currentItem.pos));
                                if (!closestItem || currentDistance < closestItemDistance) {
                                    closestItemDistance = currentDistance;
                                    closestItem = currentItem;
                                }
                            }
                        });
                        if (closestItem) {
                            console.log("found");
                            if (vLength(vSub(currentCreature.pos, closestItem.pos)) <= CELL_SIZE * 2) {
                                console.log("gather");
                                // currentCreature.target = undefined;
                                // closestItem.use[0]++; 
                            } else {
                                console.log("go to");
                                currentCreature.target = getNextPos(closestItem.pos, vNormal(vSub(closestItem.pos, currentCreature.pos)), CELL_SIZE / 2);
                            }
                            // console.log(closestItem);
                            // currentCreature.target = closestItem.pos;
                            // currentCreature.target = getNextPos(currentCreature.pos, vNormal(vSub(currentCreature.pos, closestItem.pos)), currentCreature.speed);
                        } else if ((vLength(vSub(currentCreature.pos, player.pos)) <= currentCreature.sight && vLength(vSub(currentCreature.pos, player.pos)) > CELL_SIZE * 1.5) && isReachable(currentCreature.pos, player.pos)) {
                            console.log(2);
                            currentCreature.target = getNextPos(player.pos, vNormal(vSub(player.pos, currentCreature.pos)), CELL_SIZE * 1.5);
                        }
                    }
                } else {
                    if (Math.random() <= .01) {
                        let newDir = vNormal(vSub(currentCreature.pos, [currentCreature.pos[0] - 1 + Math.random() * 2, currentCreature.pos[1] - 1 + Math.random() * 2]));
                        let newPos = getReachablePos(currentCreature.pos, getNextPos(currentCreature.pos, newDir, CELL_SIZE + (CELL_SIZE * Math.random() * 3)));
                        currentCreature.target = newPos;
                    }
                }
                // ..
                // AI - Guard
                // ..
                // AI - Hunter
            }
        }

        // Move
        if (currentCreature.target && (Math.round(currentCreature.pos[0]) != Math.round(currentCreature.target[0]) || Math.round(currentCreature.pos[1]) != Math.round(currentCreature.target[1]))) {
            if (vLength(vSub(currentCreature.pos, currentCreature.target)) > currentCreature.speed) {
                let nextPos = getNextPos(currentCreature.pos, vNormal(vSub(currentCreature.pos, currentCreature.target)), currentCreature.speed);
                currentCreature.pos = nextPos;

                if (!emotion && player != currentCreature) emotion = [SPRITE_SIZE * 5, SPRITE_SIZE * 12];

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
        if (currentCreature.sp && (currentCreature.sp[0] != 0 || currentCreature.sp[1] != 0)) {
            currentCreature.pos = vAdd(currentCreature.pos, currentCreature.sp);
            
            currentCreature.sp = vMultScalar(currentCreature.sp, .9);
            if (Math.abs(currentCreature.sp[0]) <= .05) currentCreature.sp[0] = 0;
            if (Math.abs(currentCreature.sp[1]) <= .05) currentCreature.sp[1] = 0;
        }

        // Calc collisions
        let col = false;
        obstacles = objects.filter(function (obj) {
            return obj.type == "creature" || obj.type == "block" || obj.type == "trap" || obj.type == "item" && obj.solid;
        });
        obstacles.forEach(function (obj2) {
            if (currentCreature == obj2) return;
            let distanceBetween = vLength(vSub(currentCreature.pos, obj2.pos));
            let closestDistance = (currentCreature.size + obj2.size) / 2;
            if (distanceBetween < closestDistance) {
                col = true;
                let dir = vNormal(vSub(currentCreature.pos, obj2.pos));
                let newPos = [];
                if (obj2.type == "creature") {
                    newPos = getNextPos(currentCreature.pos, vMultScalar(dir, -1), Math.ceil((closestDistance - distanceBetween)) / 2);
                    currentCreature.pos = newPos;
                } else if (obj2.type == "block" || obj2.type == "item" && obj2.solid) {
                    newPos = getNextPos(currentCreature.pos, vMultScalar(dir, -1), Math.round((closestDistance - distanceBetween)));
                    currentCreature.pos = newPos;
                } else if (obj2.type == "trap") {
                    currentCreature.target = undefined;
                    currentCreature.sp = vMultScalar(dir, obj2.speed);
                }

                if (DEBUG) {
                    ctx.strokeStyle = "#FFFFFF";
                    ctx.beginPath();
                    ctx.moveTo(obj.pos[0] - view.pos[0], obj.pos[1] - view.pos[1]);
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
        if (DEBUG) {
            if (col) {
                ctx.strokeStyle = "blue";
            } else {
                ctx.strokeStyle = "white";
            }
            ctx.beginPath();
            ctx.arc(currentCreature.pos[0] - view.pos[0], currentCreature.pos[1] - view.pos[1], currentCreature.size / 2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.stroke();
        }

        // Prepare to attack
        if (currentCreature.dmg && currentCreature.attack[0] < currentCreature.attack[1]) currentCreature.attack[0]++;

        // Attack nearest foes
        if (currentCreature != player && currentCreature.dmg && AI) {
            let foe = null;
            let closestDistance = null;
            creatures.forEach(function (obj) {
                if (currentCreature == obj) return;

                if (vLength(vSub(currentCreature.pos, obj.pos)) <= currentCreature.attackRange + (CELL_SIZE / 4) && currentCreature.faction != obj.faction && isReachable(currentCreature, obj.pos)) {
                    let currentDistance = vLength(vSub(currentCreature.pos, obj.pos));
                    if (!foe || currentDistance < closestDistance) {
                        closestDistance = currentDistance;
                        foe = obj;
                    }
                }
            });
            if (foe && vLength(vSub(currentCreature.pos, foe.pos)) <= currentCreature.attackRange + (CELL_SIZE / 4) && currentCreature.attack[0] == currentCreature.attack[1]) {
                currentCreature.attack[0] = 0;
                objects.push({
                    type: "projectile",
                    faction: currentCreature.faction,
                    owner: currentCreature,
                    pos: getNextPos(currentCreature.pos, vNormal(vSub(currentCreature.pos, foe.pos)), CELL_SIZE / 4),
                    dir: vNormal(vSub(currentCreature.pos, foe.pos)),
                    rotation: currentCreature.attackSpriteRotation,
                    sprite: currentCreature.attackSprite,
                    speed: currentCreature.attackSpeed,
                    dmg: currentCreature.dmg,
                    power: (currentCreature.attackPower ? currentCreature.attackPower : 0),
                    life: [0, Math.ceil(currentCreature.attackRange / 4)],
                    size: CELL_SIZE / 1
                });
            }
        }

        // Drawing
        if (inView(currentCreature.pos, currentCreature.size)) {
            // Draw health
            if (currentCreature.hp[0] < currentCreature.hp[1]) {
                ctx.fillStyle = "red";
                ctx.fillRect(Math.round(obj.pos[0] - Math.round(obj.size / 2) - view.pos[0]), Math.round(obj.pos[1] + Math.round(obj.size / 2) + 2 - view.pos[1]), obj.size, 4);
                ctx.fillStyle = "gold";
                ctx.fillRect(Math.round(obj.pos[0] - Math.round(obj.size / 2) - view.pos[0]), Math.round(obj.pos[1] + Math.round(obj.size / 2) + 2 - view.pos[1]), Math.ceil(obj.size * (obj.hp[0] / obj.hp[1])), 4);
            }

            // Draw sprite
            if (moving) {
                if (obj.i != undefined) {
                    obj.i += .1;
                } else {
                    obj.i = 0;
                }

                ctx.save();
                ctx.translate(Math.round(obj.pos[0] - view.pos[0]), Math.round(obj.pos[1] - view.pos[1] + Math.round(obj.size / 2)));
                ctx.rotate((Math.cos(obj.i) * 5) * Math.PI / 180);
                ctx.drawImage(TILESET, currentCreature.sprite[0], currentCreature.sprite[1], SPRITE_SIZE, SPRITE_SIZE, - Math.round(obj.size / 2) , - Math.round(obj.size), obj.size, obj.size);
                ctx.restore();
            } else {
                ctx.drawImage(TILESET, currentCreature.sprite[0], currentCreature.sprite[1], SPRITE_SIZE, SPRITE_SIZE, Math.round(obj.pos[0] - Math.round(obj.size / 2) - view.pos[0]), Math.round(obj.pos[1] - Math.round(obj.size / 2) - view.pos[1]), obj.size, obj.size);
            }
            
            // Draw emotion
            if (emotion) ctx.drawImage(TILESET, emotion[0], emotion[1], SPRITE_SIZE, SPRITE_SIZE, Math.round(obj.pos[0] - Math.round(obj.size / 2) - view.pos[0]), Math.round(obj.pos[1] - Math.round(obj.size * 1.8) - view.pos[1]), obj.size, obj.size);
            
            // Draw krown
            // if (currentCreature.king) ctx.drawImage(TILESET, 44 * SPRITE_SIZE, 2 * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, currentCreature.pos[0] - Math.round(CELL_SIZE / 4) - view.pos[0], currentCreature.pos[1] - (currentCreature.size / 2) - 16 - view.pos[1], CELL_SIZE / 2, CELL_SIZE / 2);
        }
    });
}

function drawSplashes(ctx, splashes) {
    splashes.forEach(function (splash) {
        if (splash.life[0] != splash.life[1]) {
            if (inView(splash.pos, splash.size)) {
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;
                ctx.shadowColor = "black";

                ctx.font = MD_FONT;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = splash.color;

                ctx.save();
                if (splash.life[0] >= Math.round(splash.life[1] / 2)) ctx.globalAlpha = 1 - (splash.life[0] - Math.round(splash.life[1] / 2)) / Math.round(splash.life[1] / 2);
                if (splash.text) ctx.fillText(splash.text, splash.pos[0] - view.pos[0], splash.pos[1] - view.pos[1] - CELL_SIZE / 2);
                if (splash.sprite) ctx.drawImage(TILESET, splash.sprite[0] * SPRITE_SIZE, splash.sprite[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, splash.pos[0] - view.pos[0] - CELL_SIZE / 2, splash.pos[1] - view.pos[1] - CELL_SIZE / 2, CELL_SIZE, CELL_SIZE);
                ctx.restore();

                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowColor = "";
                
                if (splash.points != undefined && splash.points.length) splash.pos = getNextPosByBezier(splash.life[0] / splash.life[1], splash.points);
            }
            splash.life[0]++;
        } else {
            dropObj(splashes, splash);
        }
    });
}

function drawItems(ctx, items) {
    // return;
    items.forEach(function (obj) {
        if (player && obj.despawn) {
            if (obj.despawn[0] == obj.despawn[1]) {
                dropObj(objects, obj);
                return;
            } else {
                obj.despawn[0]++;
            }
        }

        // Apply use
        if (obj.use && obj.use[0] >= obj.use[1]) {
            obj.use[0] = 0;

            if (obj.useResults) {
                if (obj.useResults.gold) player.gold += obj.useResults.gold;
                if (obj.useResults.hp != undefined) player.hp[0] += obj.useResults.hp;

                if (obj.useResults.dmg) player.dmg = obj.useResults.dmg;
                if (obj.useResults.attack) player.attack = obj.useResults.attack;
                if (obj.useResults.attackRange) player.attackRange = obj.useResults.attackRange;
                if (obj.useResults.attackSprite) player.attackSprite = obj.useResults.attackSprite;
                if (obj.useResults.attackSpeed) player.attackSpeed = obj.useResults.attackSpeed;
                if (obj.useResults.attackPower) player.attackPower = obj.useResults.attackPower;
                if (obj.useResults.attackRecoil) player.attackRecoil = obj.useResults.attackRecoil;

                if (obj.useResults.faction) player.faction = obj.useResults.faction;

                if (obj.useResults.message) objects.push({
                    type: "splash",
                    pos: [obj.pos[0], obj.pos[1]],
                    size: CELL_SIZE,
                    text: obj.useResults.message.text,
                    color: obj.useResults.message.color,
                    sprite: obj.useResults.message.sprite,
                    life: [0, 60]
                });

                if (obj.useResults.sprite) objects.push({
                    type: "sprite",
                    pos: [obj.pos[0], obj.pos[1]],
                    size: CELL_SIZE,
                    sprite: obj.useResults.sprite
                });
            }

            switch (obj.itemType) {
                default: {
                    dropObj(objects, obj);
                    break;
                }
                case "tree": {
                    dropObj(objects, obj);
                    break;
                }
                case "wheat": {
                    obj.states[0] = 0;
                    break;
                }
                case "chest": {
                    obj.isUse = true;
                    obj.use[0] = 0;

                    obj.contains.forEach(function(innerItem) {
                        innerItem.pos = obj.pos;
                        innerItem.use[0] = 0;
                        objects.push(innerItem);
                    });

                    break;
                }
            }
        }

        if (obj.state) {
            // if (obj.state == undefined) obj.state = [0, obj.state[1]];
            // if (obj.states == undefined) obj.states = [0, obj.states[1]];

            if (obj.states[0] < obj.states[1]) {
                if (obj.state[0] < obj.state[1]) {
                    obj.state[0]++;
                } else {
                    obj.state[0] = 0;
                    obj.states[0]++;
                }
            }
        }

        // Draw sprite
        if (inView(obj.pos, obj.size)) {
            // Player use
            if (player && (obj.states == undefined || obj.states[0] == obj.states[1]) && (vLength(vSub(player.pos, obj.pos)) <= obj.useDistance)) {
                // Using
                if (controller.use) {
                    if (obj.use[0] <= obj.use[1]) obj.use[0]++;
                }

                // Draw tip
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;
                ctx.shadowColor = "black";
                
                ctx.font = BG_FONT;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "white";
                ctx.fillText("F", obj.pos[0] - view.pos[0], obj.pos[1] - obj.size - view.pos[1]);

                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowColor = "";

                // Draw round
                ctx.strokeStyle = "violet";
                ctx.beginPath();
                ctx.arc(obj.pos[0] - view.pos[0], obj.pos[1] - view.pos[1], (obj.size / 2) + Math.cos(obj.j) * 2, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.stroke();
            } else {
                if (obj.use[0]) obj.use[0]--;
            }

            // Draw using
            if (!obj.isUse) {
                // Round animation
                if (obj.j != undefined) {
                    obj.j += .1;
                } else {
                    obj.j = 0;
                }

                // Draw use
                if (obj.use[0]) {
                    ctx.fillStyle = "red";
                    ctx.fillRect(Math.round(obj.pos[0] - Math.round(obj.size / 2) - view.pos[0]), Math.round(obj.pos[1] + Math.round(obj.size / 2) + 2 - view.pos[1]), obj.size, 4);
                    ctx.fillStyle = "gold";
                    ctx.fillRect(Math.round(obj.pos[0] - Math.round(obj.size / 2) - view.pos[0]), Math.round(obj.pos[1] + Math.round(obj.size / 2) + 2 - view.pos[1]), Math.ceil(obj.size * (obj.use[0] / obj.use[1])), 4);    
                }
            }

            // Animation
            if (!obj.itemType) {
                if (obj.i != undefined) {
                    obj.i += .1;
                } else {
                    obj.i = 0;
                }
            }

            // Draw sprite
            let spriteToDraw = obj.sprite;
            if (obj.state) spriteToDraw = obj.sprites[obj.states[0]];
            ctx.drawImage(TILESET, spriteToDraw[0], spriteToDraw[1], SPRITE_SIZE, SPRITE_SIZE, obj.pos[0] - Math.round(obj.size / 2) - view.pos[0], obj.pos[1] - Math.round(obj.size / 2) - view.pos[1] - (obj.i != undefined ? Math.cos(obj.i) * 2 : 0), obj.size, obj.size);
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
                'life': [0, 30],
                'size': CELL_SIZE / 2,
                'text': 'Go!',
                'color': "white"
            });
        });
    }

    // Drag map
    if (!handled) {
        controller.dragMap = true;
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
function moveAt(pos, target, speed) {
    return vAdd(pos, vMultScalar(vNormal(vSub(pos, target)), -1 * speed));
}
function getNextPos(pos, dir, speed) {
    let nextPos = vAdd(pos, vMultScalar(dir, -1 * speed));
    return nextPos;
}
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

function addDamageSplash(foePos, damage) {
    world.splashes.push({
        'pos': foePos,
        'life': [0, 30],
        'size': CELL_SIZE / 2,
        'text': -damage,
        'color': 'red',
        'points': [
            foePos,
            [foePos[0] + (CELL_SIZE / 2), foePos[1] - (CELL_SIZE / 2)],
            [foePos[0] + (CELL_SIZE * .75), foePos[1] - (CELL_SIZE / 4)],
        ]
    });
}