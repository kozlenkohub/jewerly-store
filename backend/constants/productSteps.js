export const STEPS = {
  START: 'start',
  NAME_EN: 'name_en',
  NAME_RU: 'name_ru',
  NAME_UK: 'name_uk',
  IMAGES: 'images',
  IMAGES_CONFIRMATION: 'images_confirmation',
  METAL: 'metal',
  CUT_FORM: 'cut_form',
  WEIGHT: 'weight',
  PRICE: 'price',
  COLLECTION: 'collection',
  DESC_EN: 'desc_en',
  DESC_RU: 'desc_ru',
  DESC_UK: 'desc_uk',
  SIZES: 'sizes',
  COMPLETE: 'complete',
};

export const getPromptForStep = (step) => {
  switch (step) {
    case STEPS.NAME_EN:
      return 'Enter product name in English:';
    case STEPS.NAME_RU:
      return 'Enter product name in Russian:';
    case STEPS.NAME_UK:
      return 'Enter product name in Ukrainian:';
    case STEPS.IMAGES:
      return 'Send me product photos (you can send multiple photos at once):';
    case STEPS.METAL:
      return 'Choose metal type:\n- white gold\n- yellow gold\n- rose gold';
    case STEPS.CUT_FORM:
      return 'Choose cut form:\n- asher\n- pear\n- round\n- cushion\n- marquise\n- oval\n- princess\n- radiant\n- heart\n- emerald';
    case STEPS.WEIGHT:
      return 'Enter product weight (in grams):';
    case STEPS.PRICE:
      return 'Enter product price:';
    case STEPS.COLLECTION:
      return 'Enter collection name:';
    case STEPS.DESC_EN:
      return 'Enter product description in English:';
    case STEPS.DESC_RU:
      return 'Enter product description in Russian:';
    case STEPS.DESC_UK:
      return 'Enter product description in Ukrainian:';
    case STEPS.SIZES:
      return 'Enter available sizes (comma-separated, e.g. 16,16.5,17):';
    default:
      return '';
  }
};

export const getNextStep = (currentStep) => {
  const steps = Object.values(STEPS);
  const currentIndex = steps.indexOf(currentStep);
  return steps[currentIndex + 1];
};
