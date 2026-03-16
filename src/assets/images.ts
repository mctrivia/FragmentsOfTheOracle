// Centralized image asset registry
// All images are loaded via require() for React Native static analysis

export const images = {
  // App
  appIcon: require('../../assets/images/app_icon.jpg'),
  titleBackground: require('../../assets/images/title_background.jpg'),

  // Characters
  characters: {
    archivist: require('../../assets/images/character_archivist.jpg'),
    historian: require('../../assets/images/character_historian.jpg'),
    linguist: require('../../assets/images/character_linguist.jpg'),
    curator: require('../../assets/images/character_curator.jpg'),
  } as Record<string, any>,

  // Room headers
  rooms: {
    hall_of_kings: require('../../assets/images/room_hall_of_kings.jpg'),
    prophets_gallery: require('../../assets/images/room_prophets_gallery.jpg'),
    exile_records: require('../../assets/images/room_exile_records.jpg'),
    interpretation_wing: require('../../assets/images/room_interpretation_wing.jpg'),
    messianic_hall: require('../../assets/images/room_hall_of_expectations.jpg'),
  } as Record<string, any>,

  // Puzzle backgrounds
  puzzles: {
    reconstruction: require('../../assets/images/puzzle_reconstruction.jpg'),
    context_match: require('../../assets/images/puzzle_context_match.jpg'),
    genre: require('../../assets/images/puzzle_genre_classification.jpg'),
    timeline: require('../../assets/images/puzzle_timeline.jpg'),
    translation: require('../../assets/images/puzzle_translation.jpg'),
    investigation: require('../../assets/images/puzzle_investigation_board.jpg'),
    prophecy_check: require('../../assets/images/puzzle_investigation_board.jpg'),
    geography: require('../../assets/images/puzzle_context_match.jpg'),
  } as Record<string, any>,

  // UI elements
  ui: {
    scrollFragment: require('../../assets/images/ui_scroll_fragment.png'),
    archiveKey: require('../../assets/images/ui_archive_key.png'),
    scholarNote: require('../../assets/images/ui_scholar_note.png'),
    insightPoint: require('../../assets/images/ui_insight_point.png'),
    parchmentTexture: require('../../assets/images/ui_parchment_texture.jpg'),
    tornEdge: require('../../assets/images/ui_torn_edge.jpg'),
  },

  // Investigation board
  board: {
    pin: require('../../assets/images/board_pin.png'),
    string: require('../../assets/images/board_string.png'),
    clueCard: require('../../assets/images/board_clue_card.png'),
  },

  // Verdict stamps
  verdict: {
    fulfilled: require('../../assets/images/verdict_fulfilled.png'),
    unfulfilled: require('../../assets/images/verdict_unfulfilled.png'),
    scale: require('../../assets/images/verdict_scale.png'),
  },
};

// Map speaker names to character image keys
export function getCharacterImage(speaker: string): any | undefined {
  const name = speaker.toLowerCase().replace(/^the\s+/, '');
  return images.characters[name];
}
