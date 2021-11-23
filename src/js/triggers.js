function trigger(source, type) {
    switch (type) {
        case "dropGold50": {
            let goldCount = 300;
            while (goldCount) {
                let randomDir = vNormal(vSub(source.pos, [source.pos[0] + (-1 + Math.random() * 2), source.pos[1] + (-1 + Math.random() * 2)]));
                let randomPos = getNearestPos(source, getNextPos(source.pos, randomDir, Math.random() * CELL_SIZE));
                world.splashes.push({
                    'pos': source.pos,
                    'life': [0, 30],
                    'size': ITEMS_SIZE_SM,
                    'sprite': SPRITES.COIN,
                    'fadeIn': true,
                    'points': [
                        source.pos,
                        getPosBetween(source.pos, randomPos),
                        randomPos,
                    ],
                    'onDrop': () => world.items.push({
                        'type': 'item',
                        'itemType': 'gold',
                        'pos': randomPos,
                        'sprite': SPRITES.COIN,
                        'size': ITEMS_SIZE_SM,
                        'animation': Math.random(),
                    })
                });
                goldCount--;
            }

            break;
        }
    }
}