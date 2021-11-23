world = {
    'player': {
        'faction': 'ally',
        'gold': 999,
        'keys': 999,
        'crystalls': 999
    },
    'sprites': [
        {
            'pos': [0, 0],
            'sprite': [1, 2],
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
            'healthSprite': SPRITES.HEART,
            'size': CELL_SIZE,
            'sizeScaleLimit': 1000,
            'target': null,
            'speed': 2,
            'hp': 1000,
            'attack': [30, 30],
            'attackDamage': 1,
            'attackRange': CELL_SIZE * 2,
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
                    let targetPos = [projectile.owner.pos[0], projectile.owner.pos[1]];
                    world.splashes.push({
                        'pos': self.pos,
                        'life': [0, 30],
                        'size': ITEMS_SIZE_SM,
                        'sprite': SPRITES.COIN,
                        'fadeIn': true,
                        'points': [
                            self.pos,
                            getPosBetween(self.pos, targetPos),
                            targetPos,
                        ],
                        'onDrop': () => world.items.push({
                            'type': 'item',
                            'itemType': 'gold',
                            'pos': targetPos,
                            'sprite': SPRITES.COIN,
                            'size': CELL_SIZE,
                            'animation': Math.random(),
                        })
                    });
                }
            },
            'onDrop': (self) => {}
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
                    let targetPos = [projectile.owner.pos[0], projectile.owner.pos[1]];
                    world.splashes.push({
                        'pos': self.pos,
                        'life': [0, 30],
                        'size': ITEMS_SIZE_SM,
                        'sprite': SPRITES.COIN,
                        'fadeIn': true,
                        'points': [
                            self.pos,
                            getPosBetween(self.pos, targetPos),
                            targetPos,
                        ],
                        'onDrop': () => world.items.push({
                            'type': 'item',
                            'itemType': 'gold',
                            'pos': targetPos,
                            'sprite': SPRITES.COIN,
                            'size': ITEMS_SIZE_SM,
                            'animation': Math.random(),
                        })
                    });
                }
            },
            'onDrop': (self) => {}
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
                    let targetPos = [projectile.owner.pos[0], projectile.owner.pos[1]];
                    world.splashes.push({
                        'pos': self.pos,
                        'life': [0, 30],
                        'size': ITEMS_SIZE_SM,
                        'sprite': SPRITES.CRYSTALL,
                        'fadeIn': true,
                        'points': [
                            self.pos,
                            getPosBetween(self.pos, targetPos),
                            targetPos,
                        ],
                        'onDrop': () => world.items.push({
                            'type': 'item',
                            'itemType': 'crystall',
                            'pos': targetPos,
                            'sprite': SPRITES.CRYSTALL,
                            'size': ITEMS_SIZE_SM,
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
            'onHit': (self) => {},
            'onDrop': (self) => {
                let count = 150;
                while (count) {
                    let randomDir = vNormal(vSub(self.pos, [self.pos[0] + (-1 + Math.random() * 2), self.pos[1] + (-1 + Math.random() * 2)]));
                    let randomPos = getNearestPos(self, getNextPos(self.pos, randomDir, Math.random() * CELL_SIZE));

                    world.splashes.push({
                        'pos': self.pos,
                        'life': [0, 30],
                        'size': ITEMS_SIZE_SM,
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
                            'size': ITEMS_SIZE_SM,
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
            'size': ITEMS_SIZE_SM,
            'animation': Math.random() * 3,
        },
        // Еда
        {
            'type': 'item',
            'itemType': 'food',
            'pos': [CELL_SIZE * 4, CELL_SIZE * 4],
            'sprite': SPRITES.MEAT,
            'size': ITEMS_SIZE_SM,
            'animation': Math.random() * 3,
        },
        // Оружие
        {
            'type': 'item',
            'itemType': 'weapon',
            'pos': [CELL_SIZE * 5, CELL_SIZE * 8],
            'sprite': SPRITES.SWORD,
            'size': ITEMS_SIZE_SM,
            'animation': Math.random() * 3,
        },
        // Меч
        {
            'type': 'item',
            'itemType': 'equip',
            'title': 'Sword+',
            'equipType': 'weapon',
            'pos': [CELL_SIZE * 1, CELL_SIZE * 4],
            'sprite': SPRITES.I_SWORD_01,
            'size': ITEMS_SIZE_BG,
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
            'color': COLORS.GOLD,
            'pos': [CELL_SIZE * 2, CELL_SIZE * 5],
            'sprite': SPRITES.I_ARMOR_01,
            'size': ITEMS_SIZE_BG,
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
                                'size': ITEMS_SIZE_SM,
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
                                    'size': ITEMS_SIZE_SM,
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
                                'size': ITEMS_SIZE_SM,
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
                                    'size': ITEMS_SIZE_SM,
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
                            'size': ITEMS_SIZE_SM,
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
                                'size': ITEMS_SIZE_SM
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