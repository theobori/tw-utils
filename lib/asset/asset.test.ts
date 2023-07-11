import { unlinkSync, rmSync } from 'fs'
import Skin, { SkinWeapon } from './skin';
import Gameskin from './gameskin';
import { GameskinPart, SkinPart } from './part';
import { ColorRGB, ColorCode } from '../color';

import { createSkinOverview } from '../board';

const SKIN = 'data/skins/ahl_red_nanami.png';
const GAMESKIN = 'data/gameskins/ahl_red.png';
const GAMESKIN_SRC = 'data/gameskins/cellegen_grid.png';
const GAMESKIN_4K = 'data/gameskins/4k.png';

describe('Abstract class Asset', () => {
  test('Load from path', async () => {
    const skin = new Skin();

    await skin.loadFromPath(SKIN);
  });

  test('Load and save the canvas as PNG', async () => {
    const path = 'skin_test.png';
    const skin = new Skin();

    await skin.loadFromPath(SKIN);
    skin.saveAs(path);

    unlinkSync(path);
  });

  test('Load and save gameskin part', async () => {
    const gameskin = new Gameskin();
    const dir = './gameskin_parts'

    await gameskin.loadFromUrl(GAMESKIN);

    gameskin
      .setPartSaveDirectory(dir)
      .saveParts(
        GameskinPart.SHOTGUN_AMMO,
        GameskinPart.GUN,
        GameskinPart.GUN_PARTICLE_1,
        GameskinPart.GUN_PARTICLE_3,
        GameskinPart.LASER,
      )
      .savePart(GameskinPart.GRENADE);

    rmSync(dir, { recursive: true, force: true });
  });

  test('Color parts of gameskin', async () => {
    const gameskin = new Gameskin();
    const color = new ColorRGB(0, 127, 0);

    await gameskin.loadFromPath(GAMESKIN);

    gameskin
      .colorParts(
        color,
        GameskinPart.SHOTGUN_AMMO,
        GameskinPart.GUN,
        GameskinPart.GUN_PARTICLE_1,
        GameskinPart.GUN_PARTICLE_3,
        GameskinPart.LASER,
      )
      .colorPart(color, GameskinPart.GRENADE)
  });

  test('Copy parts of gameskin (from a bigger one)', async () => {
    const gameskin = new Gameskin();
    await gameskin.loadFromPath(GAMESKIN);

    const gameskin_src = new Gameskin();
    await gameskin_src.loadFromPath(GAMESKIN_SRC);

    const gameskin_4K = new Gameskin();
    await gameskin_4K.loadFromPath(GAMESKIN_4K);

    gameskin
      .copyParts(
        gameskin_src,
        GameskinPart.SHOTGUN_AMMO,
        GameskinPart.GUN,
        GameskinPart.GUN_PARTICLE_1,
        GameskinPart.GUN_PARTICLE_3,
        GameskinPart.LASER,
      )
      .copyParts(
        gameskin_4K,
        GameskinPart.HAMMER,
        GameskinPart.HAMMER_CURSOR,
        GameskinPart.GRENADE,
        GameskinPart.SHIELD,
      )
  });

  test('Copy parts of gameskin (from a smaller one)', async () => {
    const gameskin = new Gameskin();
    await gameskin.loadFromPath(GAMESKIN);

    const gameskin_src = new Gameskin();
    await gameskin_src.loadFromPath(GAMESKIN_SRC);

    const gameskin_4K = new Gameskin();
    await gameskin_4K.loadFromPath(GAMESKIN_4K);

    gameskin_4K
      .copyParts(
        gameskin_src,
        GameskinPart.SHOTGUN_AMMO,
        GameskinPart.GUN,
        GameskinPart.GUN_PARTICLE_1,
        GameskinPart.GUN_PARTICLE_3,
        GameskinPart.LASER,
      )
      .copyParts(
        gameskin,
        GameskinPart.HAMMER,
        GameskinPart.HAMMER_CURSOR,
        GameskinPart.GRENADE,
        GameskinPart.SHIELD,
      )
  });

  test('Render skin then save with an eye angle', async () => {
    const path = 'skin.png';
    const skin = new Skin();

    await skin.loadFromPath(SKIN);

    skin
      .render()
      .saveRenderAs(path);

    unlinkSync('render_' + path);
  });

  test('Color skin then render', async () => {
    const path = 'skin.png'
    const skin = new Skin();

    await skin.loadFromPath('data/skins/santa_cammo.png');

    skin
      .colorTee(
        new ColorCode(6619008),
        new ColorRGB(136, 113, 255),
      )
      .render()
      .saveRenderAs(path);
    
    unlinkSync('render_' + path);
  });

  test('Skin board', async () => {
    const path = 'board.png';

    const skin = new Skin();
    await skin.loadFromPath('data/skins/santa_cammo.png');

    const gameskin = new Gameskin();
    await gameskin.loadFromPath('data/gameskins/0_6.png');

    const grey = new ColorRGB(255, 255, 255);

    skin
    skin.colorTee(
      grey,
      grey
    )
    .colorParts(
      grey,
      SkinPart.SCARY_EYE,
      SkinPart.ANGRY_EYE,
      SkinPart.BLINK_EYE,
      SkinPart.CROSS_EYE,
      SkinPart.DEFAULT_EYE,
      SkinPart.HAPPY_EYE
    )
    .setOrientation(120);

    createSkinOverview(skin, gameskin)
      .saveAs(path, true);

    unlinkSync(path);
  });

  test('Create a tee with a weapon', async () => {
    const path = 'tee_with_weapon.png'
    
    const skin = new Skin();
    await skin.loadFromPath('data/skins/nanami.png');

    skin
      .setEyeAssetPart(SkinPart.ANGRY_EYE)
      .colorTee(
        new ColorRGB(255, 255, 255),
        new ColorRGB(255, 255, 255),
      )
      .setOrientation(0);

    const gameskin = new Gameskin();
    await gameskin.loadFromPath('data/gameskins/0_6.png');

    new SkinWeapon()
      .setSkin(skin)
      .setGameskin(gameskin)
      .setWeapon(GameskinPart.GUN)
      .process()
      .saveAs(path, true);

    unlinkSync(path);
  });
});
