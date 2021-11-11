const CELL_SIZE = 16 * 2;
const SPRITE_SIZE = 16;

const TILESET = new Image();
// TILESET.src = "src/media/colored_tilemap_packed.png";
TILESET.src = "src/media/tileset.png";

const SM_FONT = "bold 8pt monospace";
const BG_FONT = "bold 14pt monospace";

const BACKGROUND_COLOR = "#112222";
const GOLD_COLOR = "#FFE228";
const CRYSTALLS_COLOR = "#5DE0E2";
const GOOD_COLOR = "lime";
const BAD_COLOR = "red";

const DEFAULT_SIGHT = CELL_SIZE * 8;

objects = [];

let prototypes = {
    palm_tree: {
        
    },
    wheat: {
        
    },
    gold: {
        
    },
    guardian: {
        
    },
    peasant: {
        faction: "ally",
        ai: "worker",
        respawn: [0, 30 * 60],
        speed: 2,
        sprite: [(2 * SPRITE_SIZE), (9 * SPRITE_SIZE)],
        hp: [3, 3],
        regen: [0, 120],
        attack: [0, 45],
        attackRange: CELL_SIZE,
        attackSprite: [(0 * SPRITE_SIZE), (3 * SPRITE_SIZE)],
        attackSpeed: 4,
        attackPower: 2,
        dmg: 0,
        sight: DEFAULT_SIGHT
    },
    wizard: {
        faction: "ally",
        ai: "follower",
        respawn: [0, 30 * 60],
        speed: 2,
        sprite: [(2 * SPRITE_SIZE), (6 * SPRITE_SIZE)],
        hp: [10, 10],
        regen: [0, 120],
        attack: [0, 45],
        attackRange: CELL_SIZE * 4,
        attackSprite: [(0 * SPRITE_SIZE), (3 * SPRITE_SIZE)],
        attackSpeed: 4,
        attackPower: 2,
        dmg: 2,
        sight: DEFAULT_SIGHT
    },
    goblin: {
       
    }
}