const fs = require('fs');
const path = require('path');

const contentPath = 'C:/laragon/www/hernan-cortes-content.json';
const outputPath = path.join(__dirname, '..', 'src', 'data', 'chapters.json');

const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

const colorAssignments = [
  { accentColor: '--accent-gold',      bgColor: '--bg-primary' }, // Ch1
  { accentColor: '--accent-gold',      bgColor: '--bg-primary' }, // Ch2
  { accentColor: '--accent-gold',      bgColor: '--bg-primary' }, // Ch3
  { accentColor: '--accent-turquoise', bgColor: '--bg-warm'    }, // Ch4
  { accentColor: '--accent-gold',      bgColor: '--bg-warm'    }, // Ch5
  { accentColor: '--accent-blood',     bgColor: '--bg-primary' }, // Ch6
  { accentColor: '--accent-stone',     bgColor: '--bg-primary' }, // Ch7
];

const imagesPerChapter = [
  // Chapter 1
  [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Castillo_de_Medellin1.JPG', alt: 'Castillo de Medellín, Extremadura', usage: 'hero', width: 1200, height: 800 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Castillo_de_Medellin2.jpg', alt: 'Vista del Castillo de Medellín', usage: 'parallax', width: 1200, height: 800 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Capit%C3%A1n_general%2C_Copia_de_un_retrato_de_Hern%C3%A1n_Cort%C3%A9s%2C_~1485_-_2-12-1547%2C_retrato_an%C3%B3nimo_%281525%29.jpg', alt: 'Retrato anónimo de Hernán Cortés, c. 1525', usage: 'inline', width: 800, height: 1000 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Grabado_de_Hern%C3%A1n_Cort%C3%A9s.jpg', alt: 'Grabado antiguo de Hernán Cortés', usage: 'gallery', width: 800, height: 1000 },
  ],
  // Chapter 2
  [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Theodor_De_Bry_-_Central_America_1594.jpg', alt: 'Mapa de América Central y el Caribe, Theodor De Bry, 1594', usage: 'hero', width: 1200, height: 900 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/DiegoVelazquezCuellar.jpg', alt: 'Retrato de Diego Velázquez de Cuéllar', usage: 'inline', width: 800, height: 1000 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Conquista_de_M%C3%A9xico_%28Tabla_1%29_-_Manda_Cort%C3%A9s_echar_los_Naos_a_pique%2C_come_con_embajadores_de_Moctezuma%2C_Miguel_Gonz%C3%A1lez_%26_Juan_Gonz%C3%A1lez_%281698%29.png', alt: 'Biombo de la Conquista de México (1698)', usage: 'parallax', width: 1200, height: 800 },
  ],
  // Chapter 3
  [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Spanish_Galleon_Firing_its_Cannon.jpg', alt: 'Galeón español disparando sus cañones', usage: 'hero', width: 1200, height: 800 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Hern%C3%A1n_Cort%C3%A9s_and_La_Malinche_1576_Dur%C3%A1n_Codex.jpg', alt: 'Hernán Cortés y La Malinche, Códice Durán (1576)', usage: 'inline', width: 800, height: 900 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Cortez_%26_La_Malinche.jpg', alt: 'Cortés y La Malinche, pintura histórica', usage: 'gallery', width: 1000, height: 800 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Cortes%2C_la_llegada.jpg', alt: 'La llegada de Cortés a las costas de México', usage: 'parallax', width: 1200, height: 800 },
  ],
  // Chapter 4
  [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Iztaccihuatl-Popocatepetl_en_vista_a%C3%A9rea.jpg', alt: 'Vista aérea de los volcanes Iztaccíhuatl y Popocatépetl', usage: 'hero', width: 1200, height: 800 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Popocatepetl_pasodecortez_cut.JPG', alt: 'Popocatépetl desde el Paso de Cortés', usage: 'parallax', width: 1200, height: 800 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Aztec_Indians_Mexico_Tlaxcalan_Cortez-1000x873.jpg', alt: 'Guerreros tlaxcaltecas aliados con Cortés', usage: 'inline', width: 1000, height: 873 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Lienzo_de_Tlaxcala_Teciquauhtitla.jpg', alt: 'Lienzo de Tlaxcala', usage: 'gallery', width: 800, height: 1000 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Matanza_de_Cholula_-_Lienzo_de_Tlaxcala.jpg', alt: 'Matanza de Cholula, Lienzo de Tlaxcala', usage: 'gallery', width: 800, height: 800 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Codex_azcatitlan222.jpg', alt: 'Códice Azcatitlan', usage: 'gallery', width: 1200, height: 600 },
  ],
  // Chapter 5
  [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/The_great_Tenochtitlan.JPG', alt: 'La Gran Tenochtitlán, mural de Diego Rivera', usage: 'hero', width: 1200, height: 800 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/La_Gran_Tenochtitlan.JPG', alt: 'Mercado de Tlatelolco, mural de Diego Rivera', usage: 'parallax', width: 1200, height: 800 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Map_of_Tenochtitlan%2C_1524.jpg', alt: 'Mapa de Tenochtitlán, 1524', usage: 'inline', width: 1000, height: 1000 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/261-Meeting_of_CORTEZ_and_MONTEZUMA.jpg', alt: 'Encuentro entre Cortés y Moctezuma', usage: 'inline', width: 1000, height: 800 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Retrato_de_Moctezuma_II.png', alt: 'Retrato de Moctezuma II', usage: 'inline', width: 800, height: 1000 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Recinto_Templo_Mayor.JPG', alt: 'Reconstrucción del Templo Mayor', usage: 'gallery', width: 1200, height: 800 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/TenochtitlanModel.JPG', alt: 'Maqueta de Tenochtitlán', usage: 'gallery', width: 1200, height: 800 },
  ],
  // Chapter 6
  [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/5/56/The_Sad_Night_%28Noche_Triste%29_%28Conquest_of_Mexico%29_Painting.jpg', alt: 'La Noche Triste, pintura de la Conquista', usage: 'hero', width: 1200, height: 800 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Spanish_Conquistadors_in_retreat_from_Aztec_Warriors_after_La_Noche_Triste.jpg', alt: 'Conquistadores en retirada tras la Noche Triste', usage: 'parallax', width: 1200, height: 800 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/ROHM_D225_Noche_triste_aztecs_rise_against_the_conquistadors.jpg', alt: 'Los aztecas se levantan contra los conquistadores', usage: 'gallery', width: 1000, height: 800 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Arbol_de_la_Noche_Triste_-_Popotla_-_Ciudad_de_Mexico.JPG', alt: 'Árbol de la Noche Triste en Popotla', usage: 'gallery', width: 800, height: 1000 },
  ],
  // Chapter 7
  [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/0/03/LastDaysofTenochtitlanB.jpg', alt: 'Los últimos días de Tenochtitlán', usage: 'hero', width: 1200, height: 800 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Brigantines_in_the_Siege_of_Tenochtitlan.jpg', alt: 'Bergantines en el sitio de Tenochtitlán', usage: 'parallax', width: 1200, height: 800 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Cortes-Hernan-LOC.jpg', alt: 'Retrato de Hernán Cortés, Library of Congress', usage: 'inline', width: 800, height: 1000 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/The_Florentine_Codex-_The_Conquest_of_Mexico.png', alt: 'Códice Florentino - Conquista de México', usage: 'gallery', width: 1000, height: 800 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Florentine_Codex_IX_Aztec_Warriors.jpg', alt: 'Guerreros aztecas del Códice Florentino', usage: 'gallery', width: 1000, height: 800 },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Tumba_de_Cort%C3%A9s.JPG', alt: 'Tumba de Hernán Cortés', usage: 'inline', width: 800, height: 1000 },
  ],
];

const chapters = content.chapters.map((chapter, index) => {
  const colors = colorAssignments[index];
  const images = imagesPerChapter[index];

  const narrativeArray = chapter.narrative
    .split('\n\n')
    .map(p => p.trim())
    .filter(Boolean);

  return {
    id: `chapter-${chapter.number}`,
    number: chapter.number,
    title: chapter.title,
    subtitle: chapter.subtitle,
    accentColor: colors.accentColor,
    bgColor: colors.bgColor,
    narrative: narrativeArray,
    quotes: chapter.quotes,
    keyDates: chapter.keyDates,
    curiosities: chapter.curiosities,
    images: images,
  };
});

const output = { chapters };
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');

console.log(`Written ${chapters.length} chapters to ${outputPath}`);
chapters.forEach((ch, i) => {
  console.log(`  Chapter ${ch.number}: "${ch.title}" — ${ch.narrative.length} paragraphs, ${ch.images.length} images`);
});
