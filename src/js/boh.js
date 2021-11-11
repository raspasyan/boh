// Движок:
// [v]  Добавить влияние вектора скорости на вектор позиции для эффектов оттлакивания (это когда добавляем скорость противоположную вектору направления и гасим вектор скорости по времени).
// [v]   Добавить поворот спрайта снарядов в сторону полета.
// []   Разделить объекты на несколько списков для оптимизации вычислений, все списки объединить в объекте world.
// [v]   Спрайтам добавить время жизни, чтобы удалять их спустя некоторое время, таким способом можно рисовать декали (кровь, могилки, огонь и пр.).
// [v]   Устранить артефакты рендеринга
// [] Добавить тип объектов предмет с под-типами, например:
// дверь (непроходим, после применения меняет проходимость и спрайт)
// сундук (после использования дает обычный предмет и меняет спрайт)
// магазин (после использования меняет один предмет на другой, возможно меняет спрайт на время)
// казарма (после исплоьзования генерирует новый объект существо, который следует за игроком)

// CONTROL
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
    use: false
}

// LEVEL EDITOR
let editor = {
    'enabled': true,
    'mode': 'view',
    'elements': [
        {
            'title': 'viewControl',
            'pos': [CELL_SIZE, CELL_SIZE],
            'size': CELL_SIZE,
            'active': true,
            'selected': false,
            'sprite': [10, 10],
            'mode': 'view'
        },
        {
            'title': 'drawSprites',
            'pos': [CELL_SIZE + (CELL_SIZE + 4) * 1, CELL_SIZE],
            'size': CELL_SIZE,
            'active': false,
            'selected': false,
            'sprite': [15, 0],
            'mode': 'draw'
        }
    ]
}
// let editorSpriteOffsets = [0, 0];
// let editorRemover = false;
// let editorAnimation = false;
// let editorVisibleBlock = false;
// let editorObjectType = "sprite";

// DEBUG
let AI = 1;
let DEBUG = 1;

// Loading objects
let world = localStorage.getItem("world");
if (world) objects = JSON.parse(world);

// Viewer
let view = {
    pos: [0, 0],
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

    cvs.addEventListener("mousedown", function (e) {
        mouse.pos = getMousePos(cvs, e);
        mouse.startPos = getMousePos(cvs, e);
        view.startPos = [view.pos[0], view.pos[1]];

        controller.mouse = true;
    });
    cvs.addEventListener("mousemove", function (e) {
        mouse.pos = getMousePos(cvs, e);
        if (controller.mouse && (!mouse.lastPos || mouse.pos[0] != mouse.lastPos[0] || mouse.pos[1] != mouse.lastPos[1])) drag();
    });
    cvs.addEventListener("mouseup", function (e) {
        mouse.pos = getMousePos(cvs, e);
        click();

        controller.mouse = false;
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
                localStorage.setItem("world", JSON.stringify(objects));
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

    // Player control
    // if (player) {
    //     // View moving
    //     view.pos[0] = player.pos[0] - (view.width / 2);
    //     view.pos[1] = player.pos[1] - (view.height / 2);

    //     // Player moving
    //     if (controller.up || controller.down || controller.left || controller.right) {
    //         let target = [0, 0];

    //         if (controller.up) target[1] = -1;
    //         if (controller.down) target[1] = 1;
    //         if (controller.left) target[0] = -1;
    //         if (controller.right) target[0] = 1;

    //         let dir = vNormal(vSub(player.pos, vAdd(player.pos, target)));
    //         player.target = getNextPos(player.pos, dir, CELL_SIZE / 3);
    //     } else {
    //         player.target = [];
    //     }

    //     // Player attack
    //     if (player.hp[0] && player.dmg && controller.mouse && player.attack[0] == player.attack[1]) {
    //         player.attack[0] = 0;

    //         if (player.attackRecoil) player.sp = vMultScalar(vNormal(vSub(player.pos, mousePos)), player.attackRecoil);

    //         objects.push({
    //             type: "projectile",
    //             faction: player.faction,
    //             owner: player,
    //             pos: getNextPos(player.pos, vNormal(vSub(player.pos, mousePos)), CELL_SIZE / 4),
    //             dir: vNormal(vSub(player.pos, mousePos)),
    //             sprite: player.attackSprite,
    //             rotation: player.attackSpriteRotation,
    //             speed: player.attackSpeed,
    //             dmg: player.dmg,
    //             power: player.attackPower,
    //             life: [0, Math.ceil(player.attackRange / 5)],
    //             size: CELL_SIZE * 1
    //         });
    //     }
    // }

    // Draw sprites
    let sprites = objects.filter(obj => obj.type == "sprite");
    if (sprites.length) drawSprites(ctx, sprites);

    // Draw blocks
    if (DEBUG) {
        let blocks = objects.filter(obj => obj.type == "block");
        blocks.forEach(obj => {
            obj.selected = onMouseInView(mouse, obj);

            ctx.strokeStyle = (obj.selected ? "blue" : "red");
            ctx.beginPath();
            ctx.arc(obj.pos[0] - view.pos[0], obj.pos[1] - view.pos[1], obj.size / 2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.stroke();
        });
    }

    // // Draw traps
    // if (!player || DEBUG) {
    //     let traps = objects.filter(function (obj) { return obj.type == "trap"; });
    //     traps.forEach(function (obj) {
    //         ctx.strokeStyle = "magenta";
    //         ctx.beginPath();
    //         ctx.arc(obj.pos[0] - view.pos[0], obj.pos[1] - view.pos[1], obj.size / 4, 0, Math.PI * 2, true);
    //         ctx.closePath();
    //         ctx.stroke();
    //     });
    // }

    // // Draw items
    // let items = objects.filter(function (obj) { return obj.type == "item"; });
    // if (items.length) drawItems(items);

    // // Draw creatures
    // let creatures = objects.filter(function (obj) { return obj.type == "creature"; });
    // if (creatures.length) drawCreatures(creatures);

    // // Draw projectiles
    // let projectiles = objects.filter(function (obj) { return obj.type == "projectile"; });
    // if (projectiles.length) drawProjectiles(projectiles, creatures);

    // // Draw splashes
    // let splashes = objects.filter(function (obj) { return obj.type == "splash"; });
    // if (splashes.length) drawSplashes(splashes);

    // // Respawn dead creatures
    // respawn();

    // // Draw UI
    // if (player) {
    //     ctx.font = SM_FONT;
    //     ctx.textAlign = "left";
    //     ctx.textBaseline = "middle";

    //     ctx.shadowOffsetX = 1;
    //     ctx.shadowOffsetY = 1;
    //     ctx.shadowColor = "black";

    //     ctx.drawImage(TILESET, SPRITE_SIZE * 16, SPRITE_SIZE * 7, SPRITE_SIZE, SPRITE_SIZE, 0, 0, CELL_SIZE / 1, CELL_SIZE / 1);
    //     ctx.fillStyle = "#FFF";
    //     ctx.fillText(player.hp[0] + "/" + player.hp[1], 32, 16);
        
    //     if (player.gold) {
    //         ctx.drawImage(TILESET, SPRITE_SIZE * 15, SPRITE_SIZE * 7, SPRITE_SIZE, SPRITE_SIZE, 0, 16, CELL_SIZE / 1, CELL_SIZE / 1);
    //         ctx.fillStyle = "#FFF";
    //         ctx.fillText(player.gold, 32, 32);
    //     }

    //     if (player.crystalls) {
    //         ctx.drawImage(TILESET, SPRITE_SIZE * 16, SPRITE_SIZE * 13, SPRITE_SIZE, SPRITE_SIZE, 12, 30, CELL_SIZE / 2, CELL_SIZE / 2);
    //         ctx.fillStyle = CRYSTALLS_COLOR;
    //         ctx.fillText(player.crystalls, 26, 19 * 2);
    //     }

    //     ctx.shadowOffsetX = 0;
    //     ctx.shadowOffsetY = 0;
    //     ctx.shadowColor = "";
        
    //     // ctx.drawImage(TILESET, SPRITE_SIZE * 6, SPRITE_SIZE * 4, SPRITE_SIZE, SPRITE_SIZE, 10 - (SPRITE_SIZE / 2), 10 - (SPRITE_SIZE / 2) + 22 * 1, CELL_SIZE, CELL_SIZE);
    //     // ctx.fillText(player.dmg, 36,  18 + 22 * 1);
    // } else {
    //     // Draw current sprite
    //     ctx.drawImage(TILESET, editorSpriteOffsets[0] * SPRITE_SIZE, editorSpriteOffsets[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, CELL_SIZE / 2, CELL_SIZE / 2, CELL_SIZE, CELL_SIZE);
    
    //     // Draw tileset
    //     ctx.drawImage(TILESET, 0, view.height);
        
    //     ctx.font = "bold 12pt Rubik";
    //     ctx.textAlign = "left";
    //     ctx.textBaseline = 'middle';
    //     if (editorRemover) {
    //         ctx.fillStyle = "red";
    //         ctx.fillText("editorRemover", 32, 16);
    //     }
    //     if (editorAnimation) {
    //         ctx.fillStyle = "aqua";
    //         ctx.fillText("editorAnimation", 32, 32);
    //     }
    //     if (editorVisibleBlock) {
    //         ctx.fillStyle = "aqua";
    //         ctx.fillText("editorVisibleBlock", 32, 48);
    //     }
    //     ctx.strokeStyle = "VIOLET";
    //     ctx.strokeRect(editorSpriteOffsets[0] * SPRITE_SIZE, view.height + editorSpriteOffsets[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE);
    // }

    if (editor.enabled) drawEditor(ctx);

    // // Draw view
    if (DEBUG || !player) {
        ctx.strokeStyle = "red";
        ctx.strokeRect(0, 0, view.width, view.height);
    }
}

function drawSprites(ctx, sprites) {
    sprites.forEach(function (obj) {
        if (inView(obj.pos, obj.size)) {
            let imageToDraw = obj.sprite;

            if (obj.animation != undefined) {
                if (obj.animation != undefined) {
                    obj.animation += .1;
                } else {
                    obj.animation = 0;
                }

                ctx.save();
                ctx.translate(Math.round(obj.pos[0] - view.pos[0]), Math.round(obj.pos[1] - view.pos[1] + Math.round(obj.size / 2)));
                ctx.rotate((Math.cos(obj.animation) * 5) * Math.PI / 180);
                ctx.drawImage(TILESET, imageToDraw[0], imageToDraw[1], SPRITE_SIZE, SPRITE_SIZE, - Math.round(obj.size / 2) , - Math.round(obj.size), obj.size, obj.size);
                ctx.restore();
            } else {
                ctx.drawImage(TILESET, imageToDraw[0], imageToDraw[1], SPRITE_SIZE, SPRITE_SIZE, Math.round(obj.pos[0] - Math.round(obj.size / 2) - view.pos[0]), Math.round(obj.pos[1] - Math.round(obj.size / 2) - view.pos[1]), obj.size, obj.size);
            }
        }
    });
}
function drawProjectiles(ctx, projectiles, creatures) {
    projectiles.forEach(function (obj) {
        let currentProjectile = obj;

        // Move
        currentProjectile.pos = getNextPos(currentProjectile.pos, currentProjectile.dir, currentProjectile.speed);

        // Calc collision with obstacles
        let obstacles = objects.filter(function(obj) {
            return obj.type == "creature" || (obj.type == "block" && !obj.visible);
        });
        obstacles.forEach(function (obstacle) {
            if (vLength(vSub(currentProjectile.pos, obstacle.pos)) < (obstacle.size + currentProjectile.size) / 2) {
                if (obstacle.type == "creature" && obstacle.faction != currentProjectile.faction) {
                    // Enemy
                    obstacle.hp[0] -= currentProjectile.dmg;
                    if (obstacle.regen) obstacle.regen[0] = 0;

                    // objects.push({
                    //     type: "splash",
                    //     pos: [obstacle.pos[0], obstacle.pos[1]],
                    //     size: CELL_SIZE,
                    //     sprite: [SPRITE_SIZE * 16, SPRITE_SIZE * 7],
                    //     text: "-" + currentProjectile.dmg,
                    //     color: "white",
                    //     life: [0, 60]
                    // });

                    // Push enemy
                    obstacle.sp = vMultScalar(currentProjectile.dir, -currentProjectile.power);

                    dropObj(objects, currentProjectile);
                    return;
                } else if (obstacle.type == "block") {
                    // Block
                    dropObj(objects, currentProjectile);
                    return;
                }
            }
        });

        // Calc pos
        if (currentProjectile.life[0] == currentProjectile.life[1]) {
            dropObj(objects, currentProjectile);
            return;
        } else {
            currentProjectile.life[0]++;
        }

        // Draw sprite
        if (inView(currentProjectile.pos, currentProjectile.size)) {
            let nextPos = getNextPos(currentProjectile.pos, currentProjectile.dir, currentProjectile.speed);
            let rad = angleBetweenVectors(vNormal(vSub(currentProjectile.pos, nextPos)), [-1,0]);
            let cf = (currentProjectile.pos[1] < nextPos[1] ? -1 : 1);
            let angle = rad * cf * 180 / Math.PI;

            
            if (currentProjectile.rotation != undefined && currentProjectile.rotation) {
                ctx.save();
                ctx.translate(Math.round(currentProjectile.pos[0] - view.pos[0]), Math.round(currentProjectile.pos[1] - view.pos[1]));
                ctx.rotate((-0 - angle) * Math.PI / 180);
                ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
                ctx.drawImage(TILESET, currentProjectile.sprite[0], currentProjectile.sprite[1], SPRITE_SIZE, SPRITE_SIZE, - Math.round(currentProjectile.size / 2) , - Math.round(currentProjectile.size / 2), currentProjectile.size, currentProjectile.size);
                ctx.restore();
            } else {
                ctx.drawImage(TILESET, currentProjectile.sprite[0], currentProjectile.sprite[1], SPRITE_SIZE, SPRITE_SIZE, Math.round(currentProjectile.pos[0] - Math.round(currentProjectile.size / 2) - view.pos[0]), Math.round(currentProjectile.pos[1] - Math.round(currentProjectile.size / 2) - view.pos[1]), currentProjectile.size, currentProjectile.size);
            }
        }

        if (DEBUG) {
            let nextPos = getNextPos(currentProjectile.pos, currentProjectile.dir, currentProjectile.speed * 10);
            // Current pos
            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.arc(currentProjectile.pos[0] - view.pos[0], currentProjectile.pos[1] - view.pos[1], 3, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.stroke();
            // Dir
            ctx.strokeStyle = "#magenta";
            ctx.beginPath();
            ctx.moveTo(currentProjectile.pos[0] - view.pos[0], currentProjectile.pos[1] - view.pos[1]);
            ctx.lineTo(nextPos[0] - view.pos[0], nextPos[1] - view.pos[1]);
            ctx.closePath();
            ctx.stroke();
        }
    });
}
function drawCreatures(ctx, creatures) {
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
                    console.log("HIT", currentCreature.target);
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

                if (vLength(vSub(currentCreature.pos, obj.pos)) <= currentCreature.attackRange + (CELL_SIZE / 4) && currentCreature.faction != obj.faction && isReachable(currentCreature.pos, obj.pos)) {
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
    splashes.forEach(function (obj) {
        if (obj.life[0] != obj.life[1]) {
            if (inView(obj.pos, obj.size)) {
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;
                ctx.shadowColor = "black";
                
                ctx.font = BG_FONT;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = obj.color;
                ctx.fillText(obj.text, obj.pos[0] - view.pos[0] + CELL_SIZE / 2, obj.pos[1] - view.pos[1] - CELL_SIZE / 2);

                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowColor = "";

                if (obj.sprite) ctx.drawImage(TILESET, obj.sprite[0], obj.sprite[1], SPRITE_SIZE, SPRITE_SIZE, obj.pos[0] - view.pos[0] - CELL_SIZE / 1.5, obj.pos[1] - view.pos[1] - CELL_SIZE, CELL_SIZE, CELL_SIZE);
                
                obj.pos[1]--;
            }
            obj.life[0]++;
        } else {
            // obj.type = "trash";
            dropObj(objects, obj);
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
function drawEditor(ctx) {
    editor.elements.forEach(element => {
        element.selected = onMouse(mouse, element);

        ctx.fillStyle = (element.selected ? 'GOLD' : "VIOLET");
        ctx.fillRect(element.pos[0] - (element.size / 2), element.pos[1] - (element.size / 2), element.size, element.size);

        ctx.strokeStyle = (element.active ? 'LIME' : 'RED');
        ctx.strokeRect(element.pos[0] - (element.size / 2), element.pos[1] - (element.size / 2), element.size, element.size);

        ctx.drawImage(TILESET, element.sprite[0] * SPRITE_SIZE, element.sprite[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, element.pos[0] - (element.size / 2), element.pos[1] - (element.size / 2), CELL_SIZE, CELL_SIZE);
    });
}
function handleEditor() {
    let haveSelected = editor.elements.filter((e) => e.selected);
    if (haveSelected.length) editor.elements.forEach(element => {
        element.active = element.selected;

        // element.selected = onMouse(mouse, element);

        // ctx.fillStyle = (element.selected ? 'GOLD' : "VIOLET");
        // ctx.fillRect(element.pos[0] - (element.size / 2), element.pos[1] - (element.size / 2), element.size, element.size);

        // ctx.strokeStyle = (element.active ? 'LIME' : 'RED');
        // ctx.strokeRect(element.pos[0] - (element.size / 2), element.pos[1] - (element.size / 2), element.size, element.size);

        // ctx.drawImage(TILESET, element.sprite[0] * SPRITE_SIZE, element.sprite[1] * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, element.pos[0] - (element.size / 2), element.pos[1] - (element.size / 2), CELL_SIZE, CELL_SIZE);
    }); 
}
function click() {
    mouse.lastPos = mouse.pos;
    let viewMousePos = vAdd(mouse.pos, view.pos);
    let viewMouseStartPos = vAdd(mouse.startPos, view.pos);
    let viewMousePosDelta = vSub(viewMouseStartPos, viewMousePos);

    if (editor.enabled) handleEditor();
}
function drag() {
    mouse.lastPos = mouse.pos;
    let viewMousePos = vAdd(mouse.pos, view.pos);
    let viewMouseStartPos = vAdd(mouse.startPos, view.pos);
    let viewMousePosDelta = vSub(viewMouseStartPos, viewMousePos);

    // Move view
    if (editor.enabled && editor.mode != 'view') {
        // Editor
    } else {
        // Game && editor view control
        view.pos = vAdd(view.startPos, viewMousePosDelta);
    }
}
function onMouse(mouse, obj) {
    return (mouse.pos != null && mouse.pos[0] >= obj.pos[0] - (obj.size / 2) && mouse.pos[0] <= obj.pos[0] + (obj.size / 2) && mouse.pos[1] >= obj.pos[1] - (obj.size / 2) && mouse.pos[1] <= obj.pos[1] + (obj.size / 2));
}
function onMouseInView(mouse, obj) {
    let viewMousePos = vAdd(mouse.pos, view.pos);
    return (mouse.pos != null && viewMousePos[0] >= obj.pos[0] - (obj.size / 2) && viewMousePos[0] <= obj.pos[0] + (obj.size / 2) && viewMousePos[1] >= obj.pos[1] - (obj.size / 2) && viewMousePos[1] <= obj.pos[1] + (obj.size / 2));
}
function respawn() {
    let deadCreatures = objects.filter(function (obj) { return obj.spawn && !obj.hp[0] });
    if (deadCreatures.length) deadCreatures.forEach(function (obj) {
        if (obj.respawn[0] == obj.respawn[1]) {
            obj.type = "creature";
            obj.pos = [obj.spawn[0], obj.spawn[1]];
            obj.target = null;
            obj.hp[0] = obj.hp[1];
            obj.respawn[0] = 0;
        } else {
            obj.respawn[0]++;
        }
    });
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
function isReachable(pos1, pos2, onlyVision, offset) {
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
function getReachablePos(pos1, pos2, offset) {
    if (offset == undefined) offset = - 2;

    let stepSize = 1;
    let canMove = true;
    let blocks = objects.filter(function (obj) { return obj.type == "block" || obj.type == "item" && obj.solid; });

    let nextPos = getNextPos(pos1, vNormal(vSub(pos1, pos2)), stepSize);
    while (canMove && vLength(vSub(nextPos, pos2)) > stepSize) {
        blocks.forEach(function (obj) { if (canMove && vLength(vSub(nextPos, obj.pos)) < obj.size + offset) canMove = false; });
        if (canMove) nextPos = getNextPos(nextPos, vNormal(vSub(nextPos, pos2)), stepSize);
    }

    return nextPos;
}