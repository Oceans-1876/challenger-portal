import background1 from '../../images/backgrounds/andrew-mcelroy-4P-GR256HJA-unsplash.jpg';
import background2 from '../../images/backgrounds/michael-olsen-aHCZXg0DodM-unsplash.jpg';
import background3 from '../../images/backgrounds/jakob-owens-dO8qMqWimo8-unsplash.jpg';

const backgrounds = [
    {
        url: background1,
        unsplash: 'https://unsplash.com/photos/4P-GR256HJA'
    },
    {
        url: background2,
        unsplash: 'https://unsplash.com/photos/aHCZXg0DodM'
    },
    {
        url: background3,
        unsplash: 'https://unsplash.com/photos/dO8qMqWimo8'
    }
];

export const getRandomBackground = () => {
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    return backgrounds[randomIndex];
};
