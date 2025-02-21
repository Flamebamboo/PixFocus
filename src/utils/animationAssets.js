export const AnimationAssets = {
  FIRE_CAMP: require('assets/gif/firecamp.gif'),
  OWL: require('assets/gif/Owl.gif'),
  RABBIT: require('assets/gif/Rabbit.gif'),
};

export const getAnimationAsset = (type) => {
  const normalizedType = type.toUpperCase();
  return AnimationAssets[normalizedType] || AnimationAssets.FIRE_CAMP;
};
