export const DIFFICULTIES = ['Très facile', 'Facile', 'Moyen', 'Difficile', 'Expert'] as const;
export type DifficultyEnum = (typeof DIFFICULTIES)[number];

export const DURATIONS = ['<15 min', '15-30 min', '30-60 min', '>1h'] as const;
export type DurationEnum = (typeof DURATIONS)[number];

export const TAGS = ['Entrée', 'Plat', 'Dessert', 'Végétarien', 'Vegan', 'Rapide'] as const;
export type TagEnum = (typeof TAGS)[number];
