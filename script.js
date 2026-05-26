// ========================================
// MUSICAL CONSTANTS
// ========================================
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTE_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// ========================================
// SCALE LIBRARY: All available scales with intervals & labels
// ========================================
const SCALE_LIBRARY = {
  major: { label: 'Major', intervals: [0, 2, 4, 5, 7, 9, 11], intervalLabels: ['1', '2', '3', '4', '5', '6', '7'], family: 'major' },
  minor: { label: 'Minor', intervals: [0, 2, 3, 5, 7, 8, 10], intervalLabels: ['1', '2', '♭3', '4', '5', '♭6', '♭7'], family: 'minor' },
  pentatonic: { label: 'Pentatonic', intervals: [0, 2, 4, 7, 9], intervalLabels: ['1', '2', '3', '5', '6'], family: 'major' },
  blues: { label: 'Blues', intervals: [0, 3, 5, 6, 7, 10], intervalLabels: ['1', '♭3', '4', '♭5', '5', '♭7'], family: 'minor' },
  harmonicMinor: { label: 'Harmonic Minor', intervals: [0, 2, 3, 5, 7, 8, 11], intervalLabels: ['1', '2', '♭3', '4', '5', '♭6', '7'], family: 'minor' },
  melodicMinor: { label: 'Melodic Minor', intervals: [0, 2, 3, 5, 7, 9, 11], intervalLabels: ['1', '2', '♭3', '4', '5', '6', '7'], family: 'minor' },
  dorian: { label: 'Dorian', intervals: [0, 2, 3, 5, 7, 9, 10], intervalLabels: ['1', '2', '♭3', '4', '5', '6', '♭7'], family: 'minor' },
  mixolydian: { label: 'Mixolydian', intervals: [0, 2, 4, 5, 7, 9, 10], intervalLabels: ['1', '2', '3', '4', '5', '6', '♭7'], family: 'major' },
  lydian: { label: 'Lydian', intervals: [0, 2, 4, 6, 7, 9, 11], intervalLabels: ['1', '2', '3', '#4', '5', '6', '7'], family: 'major' },
  phrygian: { label: 'Phrygian', intervals: [0, 1, 3, 5, 7, 8, 10], intervalLabels: ['1', '♭2', '♭3', '4', '5', '♭6', '♭7'], family: 'minor' },
  locrian: { label: 'Locrian', intervals: [0, 1, 3, 5, 6, 8, 10], intervalLabels: ['1', '♭2', '♭3', '4', '♭5', '♭6', '♭7'], family: 'minor' },
  chromatic: { label: 'Chromatic', intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], intervalLabels: ['1', '♭2', '2', '♭3', '3', '4', '#4', '5', '♭6', '6', '♭7', '7'], family: 'major' },
  custom: { label: 'Custom', intervals: [], intervalLabels: [], family: 'major' }
};

// ========================================
// CHORD TYPES: Major, minor, diminished
// ========================================
const CHORD_TYPES = {
  major: { label: 'Major', tones: [0, 4, 7], description: 'Bright, stable harmony with a strong root.' },
  minor: { label: 'Minor', tones: [0, 3, 7], description: 'Dark, smooth color with a softer 3rd.' },
  diminished: { label: 'Diminished', tones: [0, 3, 6], description: 'Tense and often used as a passing chord.' }
};

// ========================================
// DIATONIC CHORD ORDER (per scale family)
// ========================================
const CHORD_ORDER = {
  major: ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'],
  minor: ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major']
};

// ========================================
// INSTRUMENTS: Tuning & string configuration
// ========================================
const INSTRUMENTS = {
  guitar: {
    label: 'Guitar',
    strings: [
      { note: 'E', octave: 2 },
      { note: 'A', octave: 2 },
      { note: 'D', octave: 3 },
      { note: 'G', octave: 3 },
      { note: 'B', octave: 3 },
      { note: 'E', octave: 4 }
    ]
  },
  bass: {
    label: 'Bass',
    strings: [
      { note: 'E', octave: 1 },
      { note: 'A', octave: 1 },
      { note: 'D', octave: 2 },
      { note: 'G', octave: 2 }
    ]
  },
  ukulele: {
    label: 'Ukulele',
    strings: [
      { note: 'G', octave: 3 },
      { note: 'C', octave: 4 },
      { note: 'E', octave: 4 },
      { note: 'A', octave: 4 }
    ]
  }
};

const DEFAULT_TAB_EXERCISES = {
  ascending: 'A steady ascending line to lock in the pattern.',
  descending: 'Reverse the line to reinforce the same tones in descending motion.',
  picking: 'Chord focus with arpeggio patterns for the current key.'
};

let audioContext = null;
let isPlaying = false;
let currentTimeout = null;
let selectedChord = null;
let selectedProgression = null;
let activeTabExercise = 'ascending';
let customIntervals = [0, 2, 4, 5, 7, 9, 11];
let currentState = {
  instrument: 'guitar',
  scaleType: 'major',
  rootNote: 'C',
  startingFret: 0,
  tempo: 120,
  leftHanded: false,
  showTriangle: true,
  showPassingNotes: true,
  theme: 'dark',
  beginnerMode: true
};

function normalizeRootNote(rootNote) {
  const idx = NOTES.indexOf(rootNote);
  return idx === -1 ? 'C' : NOTES[idx];
}

function getNoteIndex(note) {
  const normalized = note.replace(/[#b]/g, '');
  const noteIndex = NOTES.indexOf(normalized);
  if (noteIndex === -1) return 0;
  if (note.includes('#')) return (noteIndex + 1) % 12;
  if (note.includes('b')) return (noteIndex - 1 + 12) % 12;
  return noteIndex;
}

function noteAtInterval(rootNote, interval) {
  return NOTES[(getNoteIndex(rootNote) + interval) % 12];
}

function getScaleTypeConfig(scaleType) {
  if (scaleType === 'custom') {
    return { ...SCALE_LIBRARY.custom, intervals: customIntervals.slice(), intervalLabels: buildIntervalLabels(customIntervals.slice()) };
  }
  return SCALE_LIBRARY[scaleType];
}

function buildIntervalLabels(intervals) {
  return intervals.map(interval => intervalLabel(interval));
}

function intervalLabel(interval) {
  const map = {
    0: '1',
    1: '♭2',
    2: '2',
    3: '♭3',
    4: '3',
    5: '4',
    6: '#4',
    7: '5',
    8: '♭6',
    9: '6',
    10: '♭7',
    11: '7'
  };
  return map[interval] || `${interval}`;
}

function buildScale(rootNote, scaleType) {
  const config = getScaleTypeConfig(scaleType);
  const scaleIntervals = config.intervals.length ? config.intervals : customIntervals;
  return scaleIntervals.map(interval => noteAtInterval(rootNote, interval));
}

function getIntervalNumber(rootNote, note) {
  const interval = (getNoteIndex(note) - getNoteIndex(rootNote) + 12) % 12;
  return intervalLabel(interval);
}

function getNoteAtFret(stringNote, fret) {
  return NOTES[(getNoteIndex(stringNote) + fret) % 12];
}

function getInstrumentStrings(instrument) {
  const strings = INSTRUMENTS[instrument].strings.map(entry => ({ ...entry }));
  return currentState.leftHanded ? strings.slice().reverse() : strings;
}

function getChordNotes(rootNote, quality) {
  return CHORD_TYPES[quality].tones.map(interval => noteAtInterval(rootNote, interval));
}

function isScaleNote(note, scaleNotes) {
  return scaleNotes.some(scaleNote => scaleNote.replace(/[#b]/g, '') === note.replace(/[#b]/g, ''));
}

function isRootNote(note, rootNote) {
  return note.replace(/[#b]/g, '') === rootNote.replace(/[#b]/g, '');
}

function estimateFinger(fret) {
  if (fret <= 0) return 1;
  if (fret <= 3) return 1;
  if (fret <= 5) return 2;
  if (fret <= 7) return 3;
  if (fret <= 9) return 4;
  return 4;
}

function getChordPositions(rootNote, quality, instrument, startingFret) {
  const targetNotes = getChordNotes(rootNote, quality);
  const strings = getInstrumentStrings(instrument);
  const positions = [];

  strings.forEach((string, stringIndex) => {
    for (let fret = startingFret; fret < startingFret + 12; fret++) {
      const note = getNoteAtFret(string.note, fret);
      if (targetNotes.includes(note)) {
        positions.push({ string: stringIndex, fret, note, finger: estimateFinger(fret) });
        break;
      }
    }
  });

  return positions.sort((a, b) => a.fret - b.fret || a.string - b.string);
}

function getRecommendedChords(rootNote, scaleType) {
  const scaleNotes = buildScale(rootNote, scaleType);
  const family = getScaleTypeConfig(scaleType).family;
  const qualities = CHORD_ORDER[family];

  return scaleNotes.slice(0, 7).map((note, index) => {
    const quality = qualities[index % qualities.length];
    const chordNotes = getChordNotes(note, quality);
    return {
      root: note,
      quality,
      label: `${note} ${CHORD_TYPES[quality].label}`,
      notes: chordNotes,
      description: CHORD_TYPES[quality].description,
      scaleDegree: index + 1
    };
  });
}

function getProgressionTemplates(scaleType) {
  const majorLike = ['major', 'pentatonic', 'mixolydian', 'lydian', 'chromatic'];
  const minorLike = ['minor', 'blues', 'harmonicMinor', 'melodicMinor', 'dorian', 'phrygian', 'locrian'];

  if (majorLike.includes(scaleType)) {
    return [
      { id: 'classic', label: '🎸 Classic Pop', description: 'I – V – vi – IV', note: 'The most popular progression in modern music - feels familiar and satisfying.', chordIndexes: [0, 4, 5, 3] },
      { id: 'pop2', label: '✨ Bright Pop', description: 'I – vi – IV – V', note: 'Perfect for upbeat, catchy songs with a happy feel.', chordIndexes: [0, 5, 3, 4] },
      { id: 'worship', label: '🙏 Worship', description: 'I – V – vi – IV', note: 'Emotional and uplifting, great for slower, meaningful songs.', chordIndexes: [0, 4, 5, 3] },
      { id: 'jazz', label: '🎷 Jazz', description: 'I – ii – V – I', note: 'Smooth and sophisticated, with lots of room for improvisation.', chordIndexes: [0, 1, 4, 0] },
      { id: 'blues', label: '🎵 Blues', description: 'I – I – I – I – IV – IV – I – I – V – IV – I – I', note: 'The foundation of rock and roll - full of feeling and soul.', chordIndexes: [0, 0, 0, 0, 3, 3, 0, 0, 4, 3, 0, 0] },
      { id: 'lofi', label: '🌙 Lo‑Fi', description: 'I – vi – ii – V', note: 'Chill and relaxed, perfect for background music and vibes.', chordIndexes: [0, 5, 1, 4] },
      { id: 'simple', label: '🎯 Beginner', description: 'I – IV – V – I', note: 'Super easy to learn - the first progression every guitarist should know!', chordIndexes: [0, 3, 4, 0] },
      { id: 'emotional', label: '💔 Emotional', description: 'I – vi – ii – IV', note: 'Tugs at the heartstrings - great for ballads and sad songs.', chordIndexes: [0, 5, 1, 3] }
    ];
  }

  return [
    { id: 'minor-loop', label: '🎸 Minor Pop', description: 'i – VI – III – VII', note: 'Moody and atmospheric, popular in modern pop.', chordIndexes: [0, 5, 2, 6] },
    { id: 'dark', label: '🌑 Dark & Tense', description: 'i – iv – v – i', note: 'Creates suspense and a heavy emotional feel.', chordIndexes: [0, 3, 4, 0] },
    { id: 'minor-blues', label: '🎵 Minor Blues', description: 'i – i – i – i – iv – iv – i – i – v – iv – i – i', note: 'Soulful and full of emotion - great for expressive solos.', chordIndexes: [0, 0, 0, 0, 3, 3, 0, 0, 4, 3, 0, 0] },
    { id: 'jazz-minor', label: '🎷 Minor Jazz', description: 'i – ii – V – i', note: 'Sophisticated and smooth, perfect for jazz improvisation.', chordIndexes: [0, 1, 4, 0] },
    { id: 'lofi-minor', label: '🌙 Lo‑Fi Minor', description: 'i – v – VI – iv', note: 'Chill and melancholic - great for late nights.', chordIndexes: [0, 4, 5, 3] }
  ];
}

function getProgressionChords(rootNote, scaleType, progression) {
  const chords = getRecommendedChords(rootNote, scaleType);
  return progression.chordIndexes.map(index => chords[index]).filter(Boolean);
}

function findTrianglePattern(rootNote, scaleType, startingFret, instrument) {
  const scaleNotes = buildScale(rootNote, scaleType);
  const strings = getInstrumentStrings(instrument);
  let rootString = -1;
  let rootFret = -1;

  for (let s = 0; s < strings.length; s++) {
    for (let fret = startingFret; fret < startingFret + 5; fret++) {
      if (isRootNote(getNoteAtFret(strings[s].note, fret), rootNote)) {
        rootString = s;
        rootFret = fret;
        break;
      }
    }
    if (rootString !== -1) break;
  }

  if (rootString === -1) return [];

  const candidates = [
    { string: rootString, fret: rootFret },
    { string: rootString, fret: rootFret + 2 },
    { string: rootString, fret: rootFret + 4 },
    { string: rootString + 1, fret: rootFret + 1 },
    { string: rootString + 1, fret: rootFret + 3 },
    { string: rootString + 2, fret: rootFret }
  ];

  const unique = [];
  candidates.forEach(candidate => {
    if (candidate.string < 0 || candidate.string >= strings.length) return;
    if (candidate.fret < startingFret || candidate.fret >= startingFret + 13) return;
    const note = getNoteAtFret(strings[candidate.string].note, candidate.fret);
    if (isScaleNote(note, scaleNotes)) {
      const key = `${candidate.string}-${candidate.fret}`;
      if (!unique.some(item => `${item.string}-${item.fret}` === key)) {
        unique.push({ ...candidate, note });
      }
    }
  });

  return unique.sort((a, b) => a.string - b.string || a.fret - b.fret);
}

function createFretboard(rootNote, scaleType, startingFret, instrument) {
  const fretboard = document.getElementById('fretboard');
  fretboard.innerHTML = '';
  const scaleNotes = buildScale(rootNote, scaleType);
  const strings = getInstrumentStrings(instrument);
  const triangleSet = currentState.showTriangle ? new Set(findTrianglePattern(rootNote, scaleType, startingFret, instrument).map(item => `${item.string}-${item.fret}`)) : new Set();

  const chordPositions = selectedChord ? getChordPositions(selectedChord.root, selectedChord.quality, instrument, startingFret) : [];
  const chordSet = new Set(chordPositions.map(item => `${item.string}-${item.fret}`));

  const header = document.createElement('div');
  header.className = 'fretboard-header';
  const blank = document.createElement('div');
  blank.className = 'fret-header-label';
  header.appendChild(blank);
  for (let fret = startingFret; fret < startingFret + 13; fret++) {
    const label = document.createElement('div');
    label.className = 'fret-header-label';
    label.textContent = fret;
    header.appendChild(label);
  }
  fretboard.appendChild(header);

  strings.forEach((string, stringIndex) => {
    const row = document.createElement('div');
    row.className = 'string-row';

    const label = document.createElement('div');
    label.className = 'string-label';
    label.textContent = string.note;
    row.appendChild(label);

    for (let fret = startingFret; fret < startingFret + 13; fret++) {
      const cell = document.createElement('div');
      cell.className = 'fret-cell';

      const note = getNoteAtFret(string.note, fret);
      const inScale = isScaleNote(note, scaleNotes);
      const isRoot = isRootNote(note, rootNote);
      const isChordTone = chordSet.has(`${stringIndex}-${fret}`);
      const isPassing = currentState.showPassingNotes && inScale && !isRoot && !isChordTone;

      if (inScale) {
        const noteDiv = document.createElement('button');
        noteDiv.type = 'button';
        noteDiv.className = 'note';
        noteDiv.dataset.note = note;
        noteDiv.dataset.string = String(stringIndex);
        noteDiv.dataset.fret = String(fret);
        noteDiv.title = `${note} • fret ${fret} • ${getIntervalNumber(rootNote, note)}`;

        if (isRoot) noteDiv.classList.add('note-root');
        else if (isChordTone) noteDiv.classList.add('note-chord');
        else if (isPassing) noteDiv.classList.add('note-passing');
        else noteDiv.classList.add('note-scale');

        if (triangleSet.has(`${stringIndex}-${fret}`)) noteDiv.classList.add('note-selected');

        const chordPosition = chordPositions.find(item => item.string === stringIndex && item.fret === fret);
        noteDiv.textContent = note;
        if (chordPosition) {
          const finger = document.createElement('span');
          finger.className = 'note-finger';
          finger.textContent = chordPosition.finger;
          noteDiv.appendChild(finger);
        }

        noteDiv.addEventListener('click', () => {
          playNote(getNoteFrequency(note, string.octave), 180);
          highlightNoteOnFretboard(note);
        });

        cell.appendChild(noteDiv);
      } else if (!currentState.beginnerMode) {
        cell.classList.add('fret-cell-dim');
      }

      row.appendChild(cell);
    }

    fretboard.appendChild(row);
  });

  fretboard.classList.remove('fretboard-animate');
  void fretboard.offsetWidth;
  fretboard.classList.add('fretboard-animate');
}

function renderScalePatternGrid(rootNote, scaleType) {
  const container = document.getElementById('scalePatternGrid');
  container.innerHTML = '';
  const scaleNotes = buildScale(rootNote, scaleType);
  const config = getScaleTypeConfig(scaleType);
  const positions = [
    { title: 'Position 1', fretRange: '0–4', notes: scaleNotes.slice(0, 5), fingering: '1-2-4-1-3', description: 'A compact root-position box that is easy to memorize.' },
    { title: 'Position 2', fretRange: '2–6', notes: scaleNotes.slice(1, 6), fingering: '1-2-4-2-4', description: 'Shift the same family of notes up the neck for a fresh register.' },
    { title: 'Position 3', fretRange: '5–9', notes: scaleNotes.slice(2, 7), fingering: '2-3-4-1-3', description: 'A useful mid-neck shape for melodic phrases and sweep practice.' },
    { title: 'Position 4', fretRange: '7–11', notes: scaleNotes.slice(3, 8), fingering: '1-2-4-1-4', description: 'Helps you build higher-position fluency without changing the scale logic.' },
    { title: 'Position 5', fretRange: '9–12', notes: scaleNotes.slice(4, 9), fingering: '1-3-4-1-2', description: 'A high-position finishing box for rapid note recognition.' }
  ];

  positions.forEach(position => {
    const card = document.createElement('div');
    card.className = 'pattern-card';
    card.innerHTML = `
      <h3>${position.title}</h3>
      <p>${position.fretRange}</p>
      <div class="pattern-note-list">
        ${position.notes.map((note, idx) => `<span class="pattern-pill ${idx === 0 ? 'root' : ''}">${note} · ${config.intervalLabels[idx]}</span>`).join('')}
      </div>
      <p class="pattern-meta">Fingering: ${position.fingering}<br>${position.description}</p>`;
    container.appendChild(card);
  });

  document.getElementById('horizontalMovementCopy').textContent = `Horizontal movement: stay in one box and move up the neck by one fret at a time to hear the scale degrees in order.`;
  document.getElementById('verticalMovementCopy').textContent = `Vertical movement: shift the pattern to a neighboring string group so the same scale formula stays playable in a new register.`;
}

function renderTabPattern(rootNote, scaleType, startingFret, instrument) {
  const strings = getInstrumentStrings(instrument);
  const scaleNotes = buildScale(rootNote, scaleType);
  const stringLabels = instrument === 'guitar' ? ['e', 'B', 'G', 'D', 'A', 'E'] : 
                       instrument === 'bass' ? ['G', 'D', 'A', 'E'] : 
                       ['A', 'E', 'C', 'G'];
  const displayLabels = currentState.leftHanded ? stringLabels.slice().reverse() : stringLabels;
  const recommendedChords = getRecommendedChords(rootNote, scaleType);
  
  let tabContent = '';
  let metaText = '';

  if (activeTabExercise === 'ascending' || activeTabExercise === 'descending') {
    const patternFrets = [];
    strings.forEach((string, stringIndex) => {
      const stringFrets = [];
      for (let fret = startingFret; fret < startingFret + 12; fret++) {
        const note = getNoteAtFret(string.note, fret);
        if (isScaleNote(note, scaleNotes)) {
          stringFrets.push({ fret, note });
        }
      }
      patternFrets.push(stringFrets);
    });

    let tabNotes = [];
    let minLength = Math.min(...patternFrets.map(s => s.length));
    
    for (let i = 0; i < Math.min(minLength, 10); i++) {
      for (let s = 0; s < strings.length; s++) {
        if (patternFrets[s][i]) {
          tabNotes.push({ string: s, fret: patternFrets[s][i].fret });
        }
      }
    }

    let tabLines = strings.map((_, stringIndex) => {
      let line = `${displayLabels[stringIndex]}|`;
      tabNotes.forEach(note => {
        if (note.string === stringIndex) {
          const fretStr = note.fret.toString().padStart(2, '-');
          line += `${fretStr}-`;
        } else {
          line += '----';
        }
      });
      return line;
    });

    if (activeTabExercise === 'descending') {
      tabLines = tabLines.slice().reverse();
      tabNotes = tabNotes.reverse();
    }

    tabContent = tabLines.join('\n');
    metaText = [
      `Exercise: ${DEFAULT_TAB_EXERCISES[activeTabExercise]}`,
      `Scale: ${rootNote} ${getScaleTypeConfig(scaleType).label}`,
      `Notes: ${scaleNotes.join(' • ')}`
    ].join('<br>');

  } else {
    let chordTab = '';
    chordTab += `Chord Progression TAB for ${rootNote} ${getScaleTypeConfig(scaleType).label}\n`;
    chordTab += `Suggested Chords:\n`;
    recommendedChords.forEach((chord, idx) => {
      chordTab += `${idx + 1}. ${chord.label} (${chord.notes.join(' • ')})\n`;
    });
    chordTab += `\nExample Arpeggio Pattern:\n`;
    
    const arpeggioFrets = [];
    strings.forEach((string, stringIndex) => {
      const stringFrets = [];
      for (let fret = startingFret; fret < startingFret + 8; fret++) {
        const note = getNoteAtFret(string.note, fret);
        if (recommendedChords[0].notes.includes(note)) {
          stringFrets.push({ fret, note });
        }
      }
      arpeggioFrets.push(stringFrets);
    });

    let arpeggioNotes = [];
    for (let i = 0; i < Math.min(6, arpeggioFrets.reduce((max, arr) => Math.max(max, arr.length), 0)); i++) {
      for (let s = 0; s < strings.length; s++) {
        if (arpeggioFrets[s][i]) {
          arpeggioNotes.push({ string: s, fret: arpeggioFrets[s][i].fret });
        }
      }
    }

    const arpeggioLines = strings.map((_, stringIndex) => {
      let line = `${displayLabels[stringIndex]}|`;
      arpeggioNotes.forEach(note => {
        if (note.string === stringIndex) {
          const fretStr = note.fret.toString().padStart(2, '-');
          line += `${fretStr}-`;
        } else {
          line += '----';
        }
      });
      return line;
    });

    tabContent = chordTab + '\n' + arpeggioLines.join('\n');
    metaText = [
      `Exercise: Chord Focus & Arpeggios`,
      `Key: ${rootNote} ${getScaleTypeConfig(scaleType).label}`,
      `Chords: ${recommendedChords.map(c => c.label).join(' • ')}`
    ].join('<br>');
  }

  document.getElementById('tabMeta').innerHTML = metaText;
  document.getElementById('tabOutput').textContent = tabContent;
}

function renderSuggestedChords(rootNote, scaleType) {
  const container = document.getElementById('suggestedChords');
  container.innerHTML = '';
  const recommended = getRecommendedChords(rootNote, scaleType);

  recommended.forEach(chord => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'suggested-chord';
    if (selectedChord && selectedChord.root === chord.root && selectedChord.quality === chord.quality) {
      button.classList.add('is-active');
    }
    button.innerHTML = `<span class="suggested-chord-label">${chord.label}</span><span class="suggested-chord-notes">${chord.notes.join(' • ')}</span>`;
    button.addEventListener('click', () => {
      selectedChord = { root: chord.root, quality: chord.quality };
      selectedProgression = null;
      renderSuggestedChords(rootNote, scaleType);
      renderProgressionOptions(rootNote, scaleType);
      renderChordDiagram(chord);
      updateChordDetails(chord);
      createFretboard(rootNote, scaleType, currentState.startingFret, currentState.instrument);
      updateImprovGuide(rootNote, scaleType, selectedChord);
    });
    container.appendChild(button);
  });

  renderChordDiagram(selectedChord ? recommended.find(chord => chord.root === selectedChord.root && chord.quality === selectedChord.quality) : null);
  updateChordDetails(selectedChord ? recommended.find(chord => chord.root === selectedChord.root && chord.quality === selectedChord.quality) : null);
}

function renderChordDiagram(chord) {
  const diagram = document.getElementById('chordDiagram');
  diagram.innerHTML = '';
  if (!chord) {
    diagram.innerHTML = '<p class="helper-text">Select a chord to preview its fretboard shape.</p>';
    return;
  }

  const positions = getChordPositions(chord.root, chord.quality, currentState.instrument, currentState.startingFret);
  const stringCount = getInstrumentStrings(currentState.instrument).length;
  const frets = [0, 1, 2, 3, 4];

  frets.forEach(fret => {
    const row = document.createElement('div');
    row.className = 'chord-diagram-row';
    const label = document.createElement('div');
    label.textContent = fret === 0 ? 'Open' : fret;
    row.appendChild(label);

    for (let i = 0; i < stringCount; i++) {
      const cell = document.createElement('div');
      cell.className = 'chord-diagram-cell';
      const match = positions.find(item => item.string === i && item.fret === fret);
      if (match) {
        cell.classList.add('active');
        cell.textContent = match.finger;
      } else if (fret === 0) {
        cell.classList.add('muted');
        cell.textContent = 'x';
      } else {
        cell.textContent = '•';
      }
      row.appendChild(cell);
    }

    diagram.appendChild(row);
  });
}

function updateChordDetails(chord) {
  const tone = document.getElementById('selectedChordTone');
  const notes = document.getElementById('selectedChordNotes');
  const hint = document.getElementById('selectedChordHint');

  if (!chord) {
    tone.textContent = 'Select a chord';
    notes.textContent = 'Choose a suggestion to preview the chord shape.';
    hint.textContent = 'The fretboard will highlight chord tones and finger positions.';
    return;
  }

  tone.textContent = chord.label;
  notes.textContent = chord.notes.join(' • ');
  hint.textContent = `${chord.description} Tap a chord to update the fretboard and chord diagram.`;
}

function renderProgressionOptions(rootNote, scaleType) {
  const container = document.getElementById('progressionList');
  const hint = document.getElementById('progressionHint');
  const progressions = getProgressionTemplates(scaleType);
  const active = progressions.find(item => item.id === selectedProgression) || progressions[0];

  container.innerHTML = '';
  progressions.forEach(progression => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'progression-card';
    const progressionChords = getProgressionChords(rootNote, scaleType, progression);
    
    button.innerHTML = `
      <span class="progression-card-title">${progression.label}</span>
      <span class="progression-card-path">${progressionChords.map(chord => chord.label).join(' → ')}</span>
      <span class="progression-card-desc">${progression.note}</span>`;

    if (progression.id === active.id) button.classList.add('is-active');

    button.addEventListener('click', () => {
      selectedProgression = progression.id;
      selectedChord = { root: progressionChords[0].root, quality: progressionChords[0].quality };
      
      renderProgressionOptions(rootNote, scaleType);
      renderSuggestedChords(rootNote, scaleType);
      createFretboard(rootNote, scaleType, currentState.startingFret, currentState.instrument);
      renderProgressionExplanation(rootNote, scaleType, progression.id);
      updateImprovGuide(rootNote, scaleType, selectedChord);
      renderTransitionTips(progression, progressionChords);
      
      updateProgressionHint(progression, progressionChords);
    });

    container.appendChild(button);
  });

  const activeChords = getProgressionChords(rootNote, scaleType, active);
  updateProgressionHint(active, activeChords);
}

function updateProgressionHint(progression, chords) {
  const hint = document.getElementById('progressionHint');
  hint.innerHTML = `
    <strong>${progression.label}:</strong> ${chords.map(c => c.label).join(' → ')}<br>
    <small>${progression.note}</small>
  `;
}

function renderTransitionTips(progression, chords) {
  const container = document.getElementById('transitionTips');
  if (chords.length < 2) {
    container.innerHTML = '<p class="helper-text">Select a progression with at least two chords!</p>';
    return;
  }

  let html = '<div class="improv-grid">';
  
  for (let i = 0; i < chords.length - 1; i++) {
    const from = chords[i];
    const to = chords[i + 1];
    
    let tips = [];
    tips.push('Slide smoothly between positions');
    tips.push('Light down strum for a gentle feel');
    tips.push('Let the previous chord sustain briefly');
    
    if (from.quality === 'minor' || to.quality === 'minor') {
      tips.push('Try fingerstyle plucking for emotion');
    }
    
    html += `
      <div class="improv-card">
        <h3>${from.label} → ${to.label}</h3>
        <ul>
          ${tips.map(tip => `<li>${tip}</li>`).join('')}
        </ul>
      </div>
    `;
  }
  
  html += '</div>';
  container.innerHTML = html;
}

function updateScaleInfo(rootNote, scaleType) {
  const config = getScaleTypeConfig(scaleType);
  const scaleNotes = buildScale(rootNote, scaleType);
  document.getElementById('currentScale').textContent = `${rootNote} ${config.label}`;
  document.getElementById('scaleNotes').textContent = `Notes: ${scaleNotes.join(', ')}`;
  document.getElementById('scaleIntervals').textContent = `Intervals: ${config.intervalLabels.join(' · ')}`;
  document.getElementById('scaleSummary').textContent = `${config.label} gives you ${scaleNotes.length} tones to practice. Roots are highlighted in orange, chord tones in purple, and passing tones in gray.`;
}

function playNote(frequency, duration = 250) {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  gain.gain.setValueAtTime(0.22, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration / 1000);
}

function getNoteFrequency(note, octave = 4) {
  const semitone = getNoteIndex(note);
  return 440 * Math.pow(2, ((octave - 4) * 12 + (semitone - 9)) / 12);
}

function clearHighlights() {
  document.querySelectorAll('.note').forEach(el => el.classList.remove('highlight'));
}

function highlightNoteOnFretboard(note) {
  clearHighlights();
  document.querySelectorAll('.note').forEach(el => {
    if (el.dataset.note === note) {
      el.classList.add('highlight');
    }
  });
}

function stopAudio() {
  isPlaying = false;
  if (currentTimeout) clearTimeout(currentTimeout);
  currentTimeout = null;
  clearHighlights();
}

async function playScale(rootNote, scaleType, tempo = 120) {
  if (isPlaying) return;
  isPlaying = true;
  const notes = buildScale(rootNote, scaleType);
  const duration = (60 / tempo) * 1000;

  for (let i = 0; i < notes.length; i++) {
    if (!isPlaying) break;
    highlightNoteOnFretboard(notes[i]);
    playNote(getNoteFrequency(notes[i], 4), duration * 0.75);
    await new Promise(resolve => { currentTimeout = setTimeout(resolve, duration); });
  }

  for (let i = notes.length - 2; i >= 0; i--) {
    if (!isPlaying) break;
    highlightNoteOnFretboard(notes[i]);
    playNote(getNoteFrequency(notes[i], 4), duration * 0.75);
    await new Promise(resolve => { currentTimeout = setTimeout(resolve, duration); });
  }

  clearHighlights();
  isPlaying = false;
}

async function playTrianglePattern(rootNote, scaleType, startingFret, tempo, instrument) {
  if (isPlaying) return;
  isPlaying = true;
  const points = findTrianglePattern(rootNote, scaleType, startingFret, instrument);
  const strings = getInstrumentStrings(instrument);
  const duration = (60 / tempo) * 1000;

  for (const point of points) {
    if (!isPlaying) break;
    const noteEl = [...document.querySelectorAll('.note')].find(el => Number(el.dataset.string) === point.string && Number(el.dataset.fret) === point.fret);
    if (noteEl) noteEl.classList.add('highlight');
    playNote(getNoteFrequency(point.note, strings[point.string].octave), duration * 0.75);
    await new Promise(resolve => { currentTimeout = setTimeout(resolve, duration); });
  }

  clearHighlights();
  isPlaying = false;
}

function downloadTabs() {
  const rootNote = currentState.rootNote;
  const scaleType = currentState.scaleType;
  const tabText = document.getElementById('tabOutput').textContent;
  const blob = new Blob([`${rootNote} ${getScaleTypeConfig(scaleType).label} TAB\n\n${tabText}`], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${rootNote}-${scaleType}-practice.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

function printTabs() {
  const data = document.getElementById('tabOutput').textContent;
  const win = window.open('', '', 'width=700,height=900');
  win.document.write(`<pre style="font-family: monospace; white-space: pre-wrap; padding: 24px;">${data}</pre>`);
  win.document.close();
  win.focus();
  win.print();
}

function validateCustomIntervals(raw) {
  const cleaned = raw.replace(/\s+/g, '').split(',').map(part => part.trim()).filter(Boolean);
  if (!cleaned.length) return [];
  const nums = cleaned.map(value => Number(value));
  if (nums.some(num => Number.isNaN(num) || num < 0 || num > 11)) {
    return null;
  }
  const unique = [...new Set(nums)].sort((a, b) => a - b);
  return unique;
}

function setTheme(mode) {
  currentState.theme = mode;
  document.body.setAttribute('data-theme', mode);
  document.getElementById('themeToggle').textContent = mode === 'dark' ? '🌙 Dark mode' : '☀ Light mode';
}

function setBeginnerMode(active) {
  currentState.beginnerMode = active;
  document.getElementById('beginnerModeToggle').dataset.active = String(active);
  document.getElementById('beginnerModeToggle').textContent = active ? '🎯 Beginner Mode' : '🎸 Advanced Mode';
  document.getElementById('beginnerModeToggle').classList.toggle('btn-primary', active);
  document.getElementById('beginnerModeToggle').classList.toggle('btn-secondary', !active);
  updateDisplay();
}

function syncStateFromInputs() {
  currentState.instrument = document.getElementById('instrument').value;
  currentState.scaleType = document.getElementById('scaleType').value;
  currentState.rootNote = normalizeRootNote(document.getElementById('rootNote').value.split(' / ')[0]);
  currentState.startingFret = Math.max(0, Number(document.getElementById('startingFret').value) || 0);
  currentState.showTriangle = document.getElementById('showTriangle').checked;
  currentState.showPassingNotes = document.getElementById('showPassingNotes').checked;
  currentState.leftHanded = document.getElementById('leftHandedToggle').dataset.active === 'true';
  currentState.tempo = Number(document.getElementById('tempo').value);
  currentState.beginnerMode = document.getElementById('beginnerModeToggle').dataset.active === 'true';
}

function createPianoKeyboard(rootNote, scaleType) {
  const piano = document.getElementById('piano');
  piano.innerHTML = '';
  const scaleNotes = buildScale(rootNote, scaleType);
  
  const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackKeyMap = { 'C#': 'C', 'D#': 'D', 'F#': 'F', 'G#': 'G', 'A#': 'A' };
  
  for (let octave = 3; octave <= 5; octave++) {
    whiteKeys.forEach(note => {
      const key = document.createElement('div');
      key.className = 'piano-key piano-key-white';
      key.dataset.note = note;
      key.dataset.octave = octave;
      
      const inScale = isScaleNote(note, scaleNotes);
      
      if (isRootNote(note, rootNote)) {
        key.classList.add('root');
      } else if (inScale) {
        key.classList.add('active');
      } else if (currentState.beginnerMode) {
        key.classList.add('piano-key-dim');
      }
      
      if (inScale || !currentState.beginnerMode) {
        key.addEventListener('click', () => {
          playNote(getNoteFrequency(note, octave), 300);
        });
      }
      
      piano.appendChild(key);
      
      if (blackKeyMap[`${note}#`]) {
        const blackKey = document.createElement('div');
        blackKey.className = 'piano-key piano-key-black';
        const blackNote = `${note}#`;
        blackKey.dataset.note = blackNote;
        blackKey.dataset.octave = octave;
        
        const blackInScale = isScaleNote(blackNote, scaleNotes);
        
        if (isRootNote(blackNote, rootNote)) {
          blackKey.classList.add('root');
        } else if (blackInScale) {
          blackKey.classList.add('active');
        } else if (currentState.beginnerMode) {
          blackKey.classList.add('piano-key-dim');
        }
        
        if (blackInScale || !currentState.beginnerMode) {
          blackKey.addEventListener('click', () => {
            playNote(getNoteFrequency(blackNote, octave), 300);
          });
        }
        
        piano.appendChild(blackKey);
      }
    });
  }
}

function renderProgressionExplanation(rootNote, scaleType, progressionId) {
  const container = document.getElementById('explanationContent');
  const progressions = getProgressionTemplates(scaleType);
  const progression = progressions.find(p => p.id === progressionId);
  if (!progression) {
    container.innerHTML = '<p class="helper-text">Select a chord progression to see the explanation!</p>';
    return;
  }
  
  const chords = getProgressionChords(rootNote, scaleType, progression);
  const explanations = [
    `${chords[0].label} = Home/root chord - feels stable and resolved`,
    `${chords[1].label} = Creates tension - wants to move somewhere`,
    `${chords[2].label} = Adds emotion - often a minor feeling`,
    `${chords[3].label} = Resolves smoothly back to the root`
  ];
  
  let html = '<div class="explanation-grid">';
  chords.forEach((chord, idx) => {
    html += `
      <div class="improv-card">
        <h3>${idx + 1}. ${chord.label}</h3>
        <p><strong>Notes:</strong> ${chord.notes.join(' • ')}</p>
        <p><small>${explanations[idx]}</small></p>
      </div>
    `;
  });
  html += '</div>';
  html += `<p style="margin-top:16px;"><strong>Why this works:</strong> ${progression.note}</p>`;
  
  container.innerHTML = html;
}

function updateImprovGuide(rootNote, scaleType, selectedChordObj) {
  const scaleNotes = buildScale(rootNote, scaleType);
  const safeNotes = selectedChordObj ? getChordNotes(selectedChordObj.root, selectedChordObj.quality) : scaleNotes.slice(0, 3);
  
  document.getElementById('safeNotes').textContent = `Safe notes: ${safeNotes.join(' • ')}`;
  document.getElementById('emotionalNotes').textContent = `Emotional notes: ${scaleNotes.filter(n => !safeNotes.includes(n)).join(' • ')} (7ths, passing tones)`;
}

function updateNoteCombinations(rootNote, scaleType) {
  const scaleNotes = buildScale(rootNote, scaleType);
  const root = scaleNotes[0];
  const third = scaleNotes[2] || scaleNotes[1];
  const fifth = scaleNotes[4] || scaleNotes[2];
  const seventh = scaleNotes[6] || scaleNotes[3];
  
  document.getElementById('brightNotes').innerHTML = `<strong>${root} + ${third}</strong>, <strong>${root} + ${fifth}</strong>, <strong>${third} + ${fifth}</strong> - Bright, stable, and happy!`;
  document.getElementById('emotionNotes').innerHTML = `<strong>${root} + ${seventh}</strong>, <strong>${third} + ${seventh}</strong>, <strong>${fifth} + ${seventh}</strong> - Emotional, tender, and warm!`;
  document.getElementById('tenseNotes').innerHTML = `<strong>${root} + ${scaleNotes[1]}</strong>, <strong>${scaleNotes[3]} + ${seventh}</strong> - Tense, dramatic, and full of energy!`;
}

function updatePianoSuggestions(rootNote, scaleType) {
  const scaleNotes = buildScale(rootNote, scaleType);
  const root = scaleNotes[0];
  const third = scaleNotes[2] || scaleNotes[1];
  const fifth = scaleNotes[4] || scaleNotes[2];
  const sixth = scaleNotes[5] || scaleNotes[3];
  
  document.getElementById('pianoLeftHand').innerHTML = `Play: <strong>${root}</strong> (root) on each chord change`;
  document.getElementById('pianoRightHand').innerHTML = 
    `Try these melodies:<br>` +
    `1. <strong>${root} → ${third} → ${fifth}</strong><br>` +
    `2. <strong>${fifth} → ${sixth} → ${fifth} → ${third}</strong><br>` +
    `3. <strong>${root} → ${scaleNotes[1]} → ${third} → ${fifth}</strong>`;
}

function updateTabExamples(rootNote, scaleType, instrument) {
  const container = document.getElementById('tabExamplesContent');
  const scaleNotes = buildScale(rootNote, scaleType);
  const root = scaleNotes[0];
  const recommendedChords = getRecommendedChords(rootNote, scaleType);
  
  let examplesHtml = '<div class="improv-grid">';
  
  examplesHtml += `
    <div class="improv-card">
      <h3>Simple Melody (${root})</h3>
      <pre class="tab-output">
e|----------------|
B|------1---------|
G|----0---0-------|
D|--2-------------|
A|3---------------|
E|----------------|
   ${root} Major Melody
      </pre>
    </div>
  `;
  
  if (recommendedChords.length >= 4) {
    examplesHtml += `
      <div class="improv-card">
        <h3>Progression TAB</h3>
        <pre class="tab-output">
${recommendedChords[0].label.padEnd(16)}${recommendedChords[1].label}
e|0-------------3--|
B|1-------------3--|
G|0-------------0--|
D|2-------------0--|
A|3-------------2--|
E|x-------------3--|

${recommendedChords[2].label.padEnd(16)}${recommendedChords[3].label}
e|0-------------1--|
B|1-------------1--|
G|2-------------2--|
D|2-------------3--|
A|0-------------3--|
E|x-------------1--|
        </pre>
      </div>
    `;
  }
  
  examplesHtml += '</div>';
  container.innerHTML = examplesHtml;
}

function generateBassChordMelodyTab(rootNote) {
  const bassStrings = ['G', 'D', 'A', 'E'];
  const bassChordShapes = {
    'A': { G: 2, D: 2, A: 0, E: 5 },
    'B': { G: 4, D: 4, A: 2, E: 7 },
    'C': { G: 5, D: 5, A: 3, E: 8 },
    'D': { G: 7, D: 7, A: 5, E: 10 },
    'E': { G: 9, D: 9, A: 7, E: 0 },
    'F': { G: 10, D: 10, A: 8, E: 1 },
    'G': { G: 0, D: 0, A: 10, E: 3 }
  };
  
  const baseNote = rootNote.replace('#', '').replace('b', '');
  const chordShape = bassChordShapes[baseNote] || bassChordShapes['A'];
  
  let tabLines = bassStrings.map((string) => {
    let line = `${string}|`;
    const fret = chordShape[string];
    
    const melodyFrets = [
      fret, 
      (typeof fret === 'number' ? fret + 2 : '-'), 
      (typeof fret === 'number' ? fret : '-'),
      (typeof fret === 'number' ? fret + 4 : '-')
    ];
    
    melodyFrets.forEach(mf => {
      if (mf === '-') {
        line += '-----';
      } else {
        const fretStr = mf.toString().padStart(2, '-');
        line += `-${fretStr}-`;
      }
    });
    
    return line;
  });
  
  return tabLines.join('\n');
}

function updateChordMelodies(rootNote, scaleType) {
  const container = document.getElementById('chordMelodiesContent');
  const scaleNotes = buildScale(rootNote, scaleType);
  const root = scaleNotes[0];
  const recommendedChords = getRecommendedChords(rootNote, scaleType);
  
  let html = '<div class="improv-grid">';
  
  const simpleMelodyTab = generateBassChordMelodyTab(rootNote);
  
  html += `
    <div class="improv-card">
      <h3>Simple Bass Chord Melody (${root})</h3>
      <pre class="tab-output">
${simpleMelodyTab}
   ${root} Bass Chord Melody
      </pre>
    </div>
  `;
  
  if (recommendedChords.length >= 2) {
    const chord1Tab = generateBassChordMelodyTab(recommendedChords[0].root);
    const chord2Tab = generateBassChordMelodyTab(recommendedChords[1].root);
    
    html += `
      <div class="improv-card">
        <h3>Bass Chord Melody Progression</h3>
        <pre class="tab-output">
${recommendedChords[0].label}
${chord1Tab}

${recommendedChords[1].label}
${chord2Tab}
        </pre>
      </div>
    `;
  }
  
  html += '</div>';
  container.innerHTML = html;
}

function updateDisplay() {
  syncStateFromInputs();

  if (!selectedProgression) {
    selectedProgression = getProgressionTemplates(currentState.scaleType)[0].id;
  }

  updateScaleInfo(currentState.rootNote, currentState.scaleType);
  createFretboard(currentState.rootNote, currentState.scaleType, currentState.startingFret, currentState.instrument);
  createPianoKeyboard(currentState.rootNote, currentState.scaleType);
  renderScalePatternGrid(currentState.rootNote, currentState.scaleType);
  renderTabPattern(currentState.rootNote, currentState.scaleType, currentState.startingFret, currentState.instrument);
  renderSuggestedChords(currentState.rootNote, currentState.scaleType);
  renderProgressionOptions(currentState.rootNote, currentState.scaleType);
  renderProgressionExplanation(currentState.rootNote, currentState.scaleType, selectedProgression);
  updateImprovGuide(currentState.rootNote, currentState.scaleType, selectedChord);
  updateNoteCombinations(currentState.rootNote, currentState.scaleType);
  updatePianoSuggestions(currentState.rootNote, currentState.scaleType);
  updateTabExamples(currentState.rootNote, currentState.scaleType, currentState.instrument);
  updateChordMelodies(currentState.rootNote, currentState.scaleType);
  
  const defaultProgression = getProgressionTemplates(currentState.scaleType).find(p => p.id === selectedProgression) || getProgressionTemplates(currentState.scaleType)[0];
  const defaultChords = getProgressionChords(currentState.rootNote, currentState.scaleType, defaultProgression);
  renderTransitionTips(defaultProgression, defaultChords);
  
  document.getElementById('customScaleInput').disabled = currentState.scaleType !== 'custom';
  document.getElementById('applyCustomScale').disabled = currentState.scaleType !== 'custom';
}

function resetSelection() {
  selectedChord = null;
  selectedProgression = null;
}

['instrument', 'scaleType', 'rootNote'].forEach(id => {
  document.getElementById(id).addEventListener('change', () => {
    resetSelection();
    updateDisplay();
  });
});

['startingFret', 'showTriangle', 'showPassingNotes'].forEach(id => {
  document.getElementById(id).addEventListener(id === 'startingFret' ? 'input' : 'change', updateDisplay);
});

document.getElementById('applyCustomScale').addEventListener('click', () => {
  const parsed = validateCustomIntervals(document.getElementById('customScaleInput').value);
  if (!parsed) {
    document.getElementById('scaleSummary').textContent = 'Custom scale input is invalid. Use numbers between 0 and 11 separated by commas.';
    return;
  }
  customIntervals = parsed;
  if (currentState.scaleType === 'custom') {
    updateDisplay();
  }
});

document.getElementById('tempo').addEventListener('input', e => {
  document.getElementById('tempoValue').textContent = e.target.value;
});

document.getElementById('themeToggle').addEventListener('click', () => {
  setTheme(currentState.theme === 'dark' ? 'light' : 'dark');
});

document.getElementById('leftHandedToggle').addEventListener('click', () => {
  const active = document.getElementById('leftHandedToggle').dataset.active !== 'true';
  document.getElementById('leftHandedToggle').dataset.active = String(active);
  document.getElementById('leftHandedToggle').textContent = active ? '⇄ Right-handed view' : '⇄ Left-handed view';
  updateDisplay();
});

document.getElementById('beginnerModeToggle').addEventListener('click', () => {
  const active = document.getElementById('beginnerModeToggle').dataset.active !== 'true';
  setBeginnerMode(active);
});

document.getElementById('playScale').addEventListener('click', () => {
  playScale(currentState.rootNote, currentState.scaleType, currentState.tempo);
});

document.getElementById('playTriangle').addEventListener('click', () => {
  playTrianglePattern(currentState.rootNote, currentState.scaleType, currentState.startingFret, currentState.tempo, currentState.instrument);
});

document.getElementById('stopAudio').addEventListener('click', stopAudio);

document.getElementById('downloadTabs').addEventListener('click', downloadTabs);

document.getElementById('printTabs').addEventListener('click', printTabs);

['tabAsc', 'tabDesc', 'tabPick'].forEach(id => {
  document.getElementById(id).addEventListener('click', () => {
    activeTabExercise = id === 'tabAsc' ? 'ascending' : id === 'tabDesc' ? 'descending' : 'picking';
    document.querySelectorAll('.tab-toggle').forEach(btn => btn.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    renderTabPattern(currentState.rootNote, currentState.scaleType, currentState.startingFret, currentState.instrument);
  });
});

setTheme('dark');
updateDisplay();