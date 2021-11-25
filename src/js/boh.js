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
    PR_SPEAR: [20, 13],
    PR_FIRE: [11, 22],
    PR_SPELL_BLUE: [19, 6],
    SIGN_01: [4, 2],
    SIGN_02: [5, 2],
    PEASANT: [17, 21],
    SKELETON: [17, 12],
    ORC: [17, 7],
    I_SWORD_01: [21, 3],
    I_ARMOR_01: [24, 3],
    PT_SNAKE: [12, 2]
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
    selectedObj: null,
    dragMap: false,
    dragCreature: null
}

let view = {
    pos: [0, 0],
    startPos: [0, 0],
    width: 640,
    height: 480
};

let editor = {
    'enabled': false,
    'mode': 'draw',
    'drawLayer': 0,
    'drawAnimate': false,
    'transparentBlock': false,
    'copyMode': false,
    'viewMode': true,
    'eraserMode': false,
    'pos': [0, 0],
    'sprite': [1, 2],
    'objToPlace': null
}

// DEBUG
let AI = 1;
let DEBUG = 1;

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
// world = JSON.parse(str);
if (world.creatures.length) {
    let allyCreatures = world.creatures.filter(e => e.faction == world.player.faction);
    if (allyCreatures.length) {
        world.player.king = allyCreatures[0];
        view.pos = [Math.round(world.player.king.pos[0] - (view.width / 2)), Math.round(world.player.king.pos[1] - (view.height / 2))];
    }
}

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
        mouse.viewPos = vAdd(mouse.pos, view.pos);

        if (controller.mouse && (!mouse.lastPos || mouse.pos[0] != mouse.lastPos[0] || mouse.pos[1] != mouse.lastPos[1])) onDragHandler();
    });
    cvs.addEventListener("mouseup", e => {
        controller.mouse = false;
        controller.dragMap = false;
    });
    document.addEventListener("mouseup", function (e) {
        controller.mouse = false;
    });
    document.body.addEventListener("keydown", e => {
        // console.log(e.code);
        if (e.code == 'KeyQ') editor.enabled = !editor.enabled;

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

            if (e.code == 'KeyZ') editor.drawAnimate = !editor.drawAnimate;
            if (e.code == 'KeyX') editor.transparentBlock = !editor.transparentBlock;

            if (e.code == 'KeyC') {
                editor.copyMode = true;
                editor.viewMode = false;
            }
        } else {
            if (e.code == "KeyW") controller.up     = true;
            if (e.code == "KeyS") controller.down   = true;
            if (e.code == "KeyA") controller.left   = true;
            if (e.code == "KeyD") controller.right  = true;
            if (e.code == "Space") controller.use   = true;

            if (e.code == "KeyE") {
                // trigger('fireStorm', {'targetPos': mouse.viewPos, 'source': world.player.king});
                trigger('jump', {'targetPos': mouse.viewPos, 'source': world.player.king});
            }
        }

        if (e.code == "Space") {
            console.info("SAVED");
            localStorage.setItem("world", JSON.stringify(world));
        }
    });
    document.body.addEventListener("keyup", e => {
        if (editor.enabled) {
            if (e.code == "ShiftLeft") editor.viewMode = true;
            if (e.code == "ControlLeft") {
                editor.eraserMode = false;
                editor.viewMode = true;
            }
            if (e.code == 'KeyC') {
                editor.copyMode = false;
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
    controller.selectedObj = null;

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
            element.animation += (Math.random() / 10) * (Math.round(Math.random) ? 1 : -1);
        } else {
            element.animation = 0;
        }

        ctx.save();
        ctx.translate(Math.round(element.pos[0] - view.pos[0]), Math.round(element.pos[1] - view.pos[1] + Math.round(element.size / 2)));
        ctx.rotate((Math.cos(element.animation) * 4) * Math.PI / 180);
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

                ctx.save();
                if (projectile.life[0] <= Math.round(projectile.life[1] / 2)) ctx.globalAlpha = projectile.life[0] / Math.round(projectile.life[1] / 2);
                if (projectile.rotation != undefined && projectile.rotation) {
                    ctx.translate(Math.round(projectile.pos[0] - view.pos[0]), Math.round(projectile.pos[1] - view.pos[1]));
                    ctx.rotate((-0 - angle) * Math.PI / 180);
                    ctx.drawImage(TILESET, projectile.sprite[0] * SPRITE_SIZE, projectile.sprite[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, - Math.round(projectile.size / 2) , - Math.round(projectile.size / 2), projectile.size, projectile.size);
                } else {
                    ctx.drawImage(TILESET, projectile.sprite[0] * SPRITE_SIZE, projectile.sprite[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, Math.round(projectile.pos[0] - Math.round(projectile.size / 2) - view.pos[0]), Math.round(projectile.pos[1] - Math.round(projectile.size / 2) - view.pos[1]), projectile.size, projectile.size);
                }
                ctx.restore();

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
                let attackDamage = (projectile.owner ? projectile.owner.attackDamage : projectile.attackDamage);
                let attackPower = (projectile.owner ? projectile.owner.attackPower : projectile.attackPower);
                let damage = (attackDamage <= foe.hp[0] ? attackDamage : foe.hp[0]);
                foe.hp[0] -= damage;
                if (attackPower) foe.sp = vMultScalar(vNormal(vSub(projectile.pos, foe.pos)), -attackPower);

                let randomPos = [foe.pos[0] - CELL_SIZE + Math.random() * CELL_SIZE * 2, foe.pos[1] - CELL_SIZE + Math.random() * CELL_SIZE * 2];
                world.splashes.push({
                    'pos': foe.pos,
                    'life': [0, 30],
                    'size': ICONS_SIZE,
                    'text': String(damage),
                    'color': 'gold',
                    'shadowColor': 'crimson',
                    'fadeOut': true,
                    'points': [
                        foe.pos,
                        getPosBetween(foe.pos, randomPos),
                        randomPos,
                    ]
                });

                if (foe.onHit != undefined) trigger(foe.onHit, {'source': foe,'projectile': projectile});
                // foe.onHit(foe, projectile);
            });
            if (projectile.onDrop != undefined) trigger(projectile.onDrop, {'source': projectile});

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
                    allyCreature.hp[0] += (item.count != undefined ? item.count : 1);
                    if (allyCreature.hp[0] > allyCreature.hp[1]) allyCreature.hp[0] = allyCreature.hp[1];
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
        if (currentCreature.hp[0] > 0) {
            // AI
            if (AI && world.player.king != currentCreature && currentCreature.speed) {
                if (currentCreature.startPos == undefined) currentCreature.startPos = currentCreature.pos;

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
                    if (foe && vLength(vSub(currentCreature.pos, foe.pos)) <= currentCreature.attackRange + (CELL_SIZE / 4) && currentCreature.attack[0] == currentCreature.attack[1]) {
                        let projectileTargetPos = foe.pos;
                        // if (foe.target && Math.random() >= .5) projectileTargetPos = getNearestPos(foe, getNextPos(foe.pos, vNormal(vSub(foe.pos, foe.target)), 20));
                        createProjectile(currentCreature, projectileTargetPos);
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
                let trueSize = currentCreature.size * sizeScale;

                if (onMouseInView(currentCreature)) {
                    if (currentCreature.boxAnimation == undefined) currentCreature.boxAnimation = 0;
                    currentCreature.boxAnimation += .1;
                    selected = true;
                    controller.selectedObj = currentCreature;
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

                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowColor = "";

                if (currentCreature.hp[0] != undefined) {                    
                    ctx.fillStyle = 'WHEAT';
                    ctx.fillRect(
                        Math.round(currentCreature.pos[0] - (CELL_SIZE / 2) - view.pos[0]),
                        Math.round(currentCreature.pos[1] + (CELL_SIZE * .6) - view.pos[1]),
                        CELL_SIZE,
                        6
                    );
                    
                    let hpState = currentCreature.hp[0] / currentCreature.hp[1];
                    if (hpState >= .7) {
                        if (currentCreature.hpBlinkAnimation != undefined) currentCreature.hpBlinkAnimation = undefined;

                        ctx.fillStyle = '#4caf50';
                    } else if (hpState >= .33) {
                        if (currentCreature.hpBlinkAnimation != undefined) currentCreature.hpBlinkAnimation = undefined;

                        ctx.fillStyle = '#e53935';
                    } else {
                        if (currentCreature.hpBlinkAnimation == undefined) currentCreature.hpBlinkAnimation = 0;
                        currentCreature.hpBlinkAnimation += .1;

                        ctx.fillStyle = '#e53935';
                    }
                    ctx.save();
                    if (currentCreature.hpBlinkAnimation != undefined) ctx.globalAlpha = Math.abs(Math.cos(currentCreature.hpBlinkAnimation));
                    ctx.fillRect(
                        Math.round(currentCreature.pos[0] - (CELL_SIZE / 2) - view.pos[0] + 1),
                        Math.round(currentCreature.pos[1] + (CELL_SIZE * .6) - view.pos[1] + 1),
                        Math.round((currentCreature.hp[0] / currentCreature.hp[1]) * (CELL_SIZE - 2)),
                        4
                    );
                    ctx.restore();

                    ctx.fillStyle = 'white';
                    ctx.save();
                    ctx.globalAlpha = .5;
                    ctx.fillRect(
                        Math.round(currentCreature.pos[0] - (CELL_SIZE / 2) - view.pos[0]),
                        Math.round(currentCreature.pos[1] + (CELL_SIZE * .6) - view.pos[1] + 1),
                        CELL_SIZE,
                        2
                    );
                    ctx.restore();
                }

                if (DEBUG) {
                    ctx.strokeStyle = (col ? "gold" : "lime");
                    ctx.beginPath();
                    ctx.arc(currentCreature.pos[0] - view.pos[0], currentCreature.pos[1] - view.pos[1], currentCreature.size / 2, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.stroke();
                    if (currentCreature.startPos != undefined) {
                        ctx.drawImage(TILESET, SPRITES.BOX[0] * SPRITE_SIZE, SPRITES.BOX[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE,
                            Math.round(currentCreature.startPos[0] - (CELL_SIZE / 2) - view.pos[0]),
                            Math.round(currentCreature.startPos[1] - (CELL_SIZE / 2) - view.pos[1]),
                            CELL_SIZE,
                            CELL_SIZE
                        );
                    }
                }
            }
        } else {
            if (currentCreature.onDrop != undefined) trigger(currentCreature.onDrop, {'source': currentCreature});

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
                    ctx.shadowColor = (splash.shadowColor ? splash.shadowColor : "black");
                    // ctx.fillText(splash.text.substr(0, Math.ceil(splash.text.length * (splash.life[0] / Math.ceil(splash.life[1] / 4)))), splash.pos[0] - view.pos[0], splash.pos[1] - view.pos[1] - CELL_SIZE / 2);
                    ctx.fillText(splash.text, splash.pos[0] - view.pos[0], splash.pos[1] - view.pos[1] - CELL_SIZE / 2);
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowColor = "";
                }
                ctx.restore();
            }

            if (nextPos) splash.pos = nextPos;
            splash.life[0]++;
        } else {
            if (splash.onDrop) trigger(splash.onDrop, {'source': splash});

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
    
    ctx.font = SM_FONT;
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
    ctx.fillText("VI",
        CELL_SIZE,
        Math.round(CELL_SIZE * 6 + (CELL_SIZE / 2))
    );
    ctx.fillStyle = (editor.eraserMode ? "LIME" : "CRIMSON");
    ctx.fillText("ER",
        CELL_SIZE * 2,
        Math.round(CELL_SIZE * 6 + (CELL_SIZE / 2))
    );
    ctx.fillStyle = (editor.copyMode ? "LIME" : "CRIMSON");
    ctx.fillText("CP",
        CELL_SIZE * 3,
        Math.round(CELL_SIZE * 6 + (CELL_SIZE / 2))
    );

    ctx.fillStyle = (editor.drawAnimate ? "LIME" : "CRIMSON");
    ctx.fillText("AN",
        CELL_SIZE,
        Math.round(CELL_SIZE * 7 + (CELL_SIZE / 2))
    );
    ctx.fillStyle = (editor.transparentBlock ? "LIME" : "CRIMSON");
    ctx.fillText("TR",
        CELL_SIZE * 2,
        Math.round(CELL_SIZE * 7 + (CELL_SIZE / 2))
    );

    ctx.restore();
}

function drawUI(ctx) {
    if (!editor.enabled) {
        let shift = .05;
        view.pos = [
            Math.round((view.pos[0] + ((world.player.king.pos[0] - view.pos[0]) * shift)) - (view.width * shift / 2)),
            Math.round((view.pos[1] + ((world.player.king.pos[1] - view.pos[1]) * shift)) - (view.height * shift / 2)),
            // world.player.king.pos[0] - (view.width / 2), 
            // world.player.king.pos[1] - (view.height / 2)
        ];
    }

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
    if (editor.enabled) {
        if (editor.viewMode) {
            controller.dragMap = true;
        } else {
            handleEditor();
        }
    } else {
        // Creatures
        if (!handled) {
            let creaturesInView = world.creatures.filter(creature => inView(creature.pos, creature.size) && onMouseInView(creature) && creature.faction == world.player.faction);
            if (creaturesInView.length) creaturesInView.forEach(creature => {
                world.player.king.startPos = world.player.king.pos;
                world.player.king = creature;
                handled = true;
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
    if (controller.mouse && world.player.king.attack[0] == world.player.king.attack[1]) {
        let targetPos = getNextPos(world.player.king.pos, vNormal(vSub(world.player.king.pos, viewMousePos)), world.player.king.attackRange);
        createProjectile(world.player.king, getNearestPos(world.player.king, targetPos, true));
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
            if (objectsToReplace.length) {
                if (editor.copyMode) {
                    editor.sprite = [objectsToReplace[0].sprite[0], objectsToReplace[0].sprite[1]];
                } else {
                    objectsToReplace.forEach(e => dropObj(world.sprites, e));
                }
            }

            if (!editor.eraserMode && !editor.copyMode) world.sprites.push({
                'pos': viewMousePosGrid,
                'sprite': [editor.sprite[0], editor.sprite[1]],
                'size': CELL_SIZE,
                'layer': editor.drawLayer,
                'animation': (editor.drawAnimate ? 0 : null)
            });

            break;
        }

        case "place": {
            let objectsToReplace = world.creatures.filter(e => onMouseInView(e));
            if (objectsToReplace.length) {
                if (editor.copyMode) {
                    editor.objToPlace = Object.assign({}, objectsToReplace[0]);
                } else {
                    objectsToReplace.forEach(e => dropObj(world.creatures, e));
                }
            }

            let blocks = world.blocks.filter(e => e.pos[0] == viewMousePosGrid[0] && e.pos[1] == viewMousePosGrid[1]);
            if (!blocks.length) {
                if (editor.objToPlace && !editor.eraserMode && !editor.copyMode) {
                    let objToPlace = Object.assign({}, editor.objToPlace, {
                        'pos': viewMousePosGrid,
                        'sprite': [editor.sprite[0], editor.sprite[1]]
                    });
                    world.creatures.push(objToPlace);
                }   
            }

            break;
        }

        case "block": {
            let objectsToReplace = world.blocks.filter(e => e.pos[0] == viewMousePosGrid[0] && e.pos[1] == viewMousePosGrid[1]);
            if (objectsToReplace.length) objectsToReplace.forEach(e => dropObj(world.blocks, e));

            if (!editor.eraserMode) world.blocks.push({
                'type': 'block',
                'pos': viewMousePosGrid,
                'size': CELL_SIZE,
                'transparent': editor.transparentBlock
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