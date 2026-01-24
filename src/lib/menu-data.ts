import type { MenuItem } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id);

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Smoky BBQ Ribs',
    description: 'Fall-off-the-bone ribs with our signature smoky BBQ sauce.',
    price: 850,
    image: getImage('smoky-bbq-ribs')?.imageUrl || '',
    imageHint: getImage('smoky-bbq-ribs')?.imageHint || ''
  },
  {
    id: 2,
    name: 'Grilled Chicken Sandwich',
    description: 'Juicy grilled chicken, fresh lettuce, and tomato on a toasted bun.',
    price: 450,
    image: getImage('grilled-chicken-sandwich')?.imageUrl || '',
    imageHint: getImage('grilled-chicken-sandwich')?.imageHint || ''
  },
  {
    id: 3,
    name: 'Classic Beef Burger',
    description: 'A hearty beef patty with cheddar cheese, pickles, and our special sauce.',
    price: 550,
    image: getImage('classic-beef-burger')?.imageUrl || '',
    imageHint: getImage('classic-beef-burger')?.imageHint || ''
  },
  {
    id: 4,
    name: 'Veggie Skewers',
    description: 'Grilled bell peppers, zucchini, onions, and cherry tomatoes with a light herb marinade.',
    price: 350,
    image: getImage('veggie-skewer')?.imageUrl || '',
    imageHint: getImage('veggie-skewer')?.imageHint || ''
  },
  {
    id: 5,
    name: 'Loaded Fries',
    description: 'Crispy fries topped with melted cheese, bacon, and a dollop of sour cream.',
    price: 300,
    image: getImage('loaded-fries')?.imageUrl || '',
    imageHint: getImage('loaded-fries')?.imageHint || ''
  },
  {
    id: 6,
    name: 'Grilled Corn on the Cob',
    description: 'Sweet corn grilled to perfection and brushed with chili-lime butter.',
    price: 150,
    image: getImage('grilled-corn')?.imageUrl || '',
    imageHint: getImage('grilled-corn')?.imageHint || ''
  }
];
