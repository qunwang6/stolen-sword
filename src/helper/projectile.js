import {
  KEY_OBJECT_ON_COLLIDED,
  KEY_OBJECT_ON_UPDATE,
  KEY_PROJECTILE_IS_COMSUMED,
} from '../constants';
import {
  $timeRatio,
  draw,
  getReflection,
  playerDamage,
  transform,
  $reflectionGradient,
} from '../state';
import { getObjectBoundary, object, vector, vectorOp } from '../utils';
import { checkRipple } from './graphic';

function handleCollision(projectile, projectileBoundary, collidedSide) {
  if (collidedSide) {
    playerDamage();
    projectile[KEY_PROJECTILE_IS_COMSUMED] = true;
  }
}

function drawProjectile(projectile) {
  draw(35, (ctx) => {
    ctx.fillStyle = '#ec5751';
    const { l, t } = getObjectBoundary(projectile);
    ctx.fillRect(
      ...transform(vector(l, t)),
      transform(projectile.s.x),
      transform(projectile.s.y)
    );

    if ($reflectionGradient.$) {
      ctx.fillStyle = $reflectionGradient.$;
      ctx.fillRect(
        ...transform(vector(l, t)),
        transform(projectile.s.x),
        transform(projectile.s.y)
      );
    }

    const reflection = getReflection(projectile);
    if (reflection) {
      ctx.fillStyle = '#ec5751';
      ctx.globalAlpha = 0.2;
      ctx.fillRect(
        reflection.x - transform(projectile.s.x) / 2,
        reflection.y,
        transform(projectile.s.x),
        transform(projectile.s.y)
      );
      ctx.globalAlpha = 1;
    }
  });
}

function move(projectile) {
  vectorOp(
    (pos, v) => pos + v * $timeRatio.$,
    [projectile.p, projectile.v],
    projectile.p
  );
}

export const projectile = (pos, size, v, options = {}) => {
  return {
    ...object(pos.x, pos.y, size.x, size.y, v.x, v.y),
    ...options,
    [KEY_OBJECT_ON_COLLIDED]: handleCollision,
    [KEY_OBJECT_ON_UPDATE]: [
      move,
      ...(options[KEY_OBJECT_ON_UPDATE] || []),
      drawProjectile,
      checkRipple(),
    ],
  };
};
