function trigger(id, params) {
    switch (id) {
        case "dropGold50": {
            // source
            let goldCount = 50;
            while (goldCount) {
                let randomDir = vNormal(vSub(params.source.pos, [params.source.pos[0] + (-1 + Math.random() * 2), params.source.pos[1] + (-1 + Math.random() * 2)]));
                let randomPos = getNearestPos(params.source, getNextPos(params.source.pos, randomDir, Math.random() * CELL_SIZE));
                world.splashes.push({
                    'pos': params.source.pos,
                    'life': [0, 30],
                    'size': ITEMS_SIZE_SM,
                    'sprite': SPRITES.COIN,
                    'fadeIn': true,
                    'points': [
                        params.source.pos,
                        getPosBetween(params.source.pos, randomPos),
                        randomPos,
                    ],
                    'onDrop': 'createGold' 
                });
                goldCount--;
            }

            break;
        }

        case 'createGold': {
            // source
            world.items.push({
                'type': 'item',
                'itemType': 'gold',
                'pos': params.source.pos,
                'sprite': SPRITES.COIN,
                'size': ITEMS_SIZE_SM,
                'animation': Math.random(),
            });

            break;
        }

        case 'summonSkeleton': {
            // source
            if (Math.random() > .9) {
                let randomDir = vNormal(vSub(params.source.pos, [params.source.pos[0] + (-1 + Math.random() * 2), params.source.pos[1] + (-1 + Math.random() * 2)]));
                let randomPos = getNearestPos(params.source, getNextPos(params.source.pos, randomDir, CELL_SIZE * 2));
                world.splashes.push({
                    'pos': params.source.pos,
                    'life': [0, 30],
                    'size': CELL_SIZE,
                    'sprite': SPRITES.SKELETON,
                    'fadeIn': true,
                    'points': [
                        params.source.pos,
                        getPosBetween(params.source.pos, randomPos),
                        randomPos,
                    ],
                    'onDrop': 'createSkeleton'
                });
            }

            break;
        }

        case 'createSkeleton': {
            // source
            world.creatures.push({
                'type': 'creature',
                'pos': params.source.pos,
                'sprite': params.source.sprite,
                'size': CELL_SIZE,
                'target': null,
                'speed': 2,
                'hp': [5, 5],
                'attack': [30, 30],
                'attackDamage': 1,
                'attackRange': CELL_SIZE * 2,
                'attackPower': 1,
                'attackType': 'melee',
                'attackSprite': SPRITES.PR_SPEAR,
                'attackRotation': true,
                'faction': 'evil',
                'enemyFactions': [
                    'ally',
                    'orcs'
                ]
            });

            break;
        }

        case 'fireStorm': {
            // targetPos, source
            let count = 30;
            while (count) {
                let randomDir = vNormal(vSub(params.targetPos, [params.targetPos[0] + (-1 + Math.random() * 2), params.targetPos[1] + (-1 + Math.random() * 2)]));
                let randomPos = getNearestPos(params.source, getNextPos(params.targetPos, randomDir, Math.random() * CELL_SIZE), true);
                
                world.projectiles.push({
                    'owner': params.source,
                    'pos': params.source.pos,
                    'sprite': SPRITES.PR_FIRE,
                    'size': CELL_SIZE,
                    'points': [
                        params.source.pos,
                        getPosBetween(params.source.pos, randomPos),
                        [randomPos[0] - (CELL_SIZE / 4) + (Math.random() * (CELL_SIZE / 2)), randomPos[1] - (CELL_SIZE / 4) + (Math.random() * (CELL_SIZE / 2))]
                    ],
                    'life': [0, 45],
                    'rotation': params.source.attackRotation,
                    'onDrop': 'deflect'
                });

                count--;
            }
            
            break;
        }

        case 'deflect': {
            // source
            let randomDir = vNormal(vSub(params.source.pos, [params.source.pos[0] + (-1 + Math.random() * 2), params.source.pos[1] + (-1 + Math.random() * 2)]));
            let randomPos = getNearestPos(params.source, getNextPos(params.source.pos, randomDir, CELL_SIZE + Math.random() * CELL_SIZE), true);

            world.splashes.push({
                'pos': params.source.pos,
                'life': [0, 30],
                'size': params.source.size,
                'sprite': params.source.sprite,
                'spriteRotation': true,
                'fadeOut': true,
                'points': [
                    params.source.pos,
                    getPosBetween(params.source.pos, randomPos),
                    randomPos,
                ]
            });

            break;
        }

        case 'jump': {
            // source
            params.targetPos = getNearestPos(params.source, params.targetPos, true);

            world.splashes.push({
                'pos': params.source.pos,
                'life': [0, 30],
                'size': CELL_SIZE,
                'sprite': SPRITES.PR_SPELL_BLUE,
                'spriteRotation': true,
                'fadeIn': true,
                'points': [
                    params.source.pos,
                    getPosBetween(params.source.pos, params.targetPos),
                    params.targetPos
                ],
                'onDrop': 'setPlayerPosition'
            });

            break;
        }

        case 'setPlayerPosition': {
            // source
            world.player.king.pos = [params.source.pos[0], params.source.pos[1]];

            break;
        }
    }
}