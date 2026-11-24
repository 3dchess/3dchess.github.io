import type { LocaleCode } from './locales';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HowToSection {
  title: string;
  description: string;
  items: { label: string; detail: string }[];
}

export interface SpecialtyItem {
  title: string;
  description: string;
}

export interface GameTranslations {
  newGame: string;
  modeLabel: string;
  modeAi: string;
  modeLocal: string;
  playAsLabel: string;
  white: string;
  black: string;
  difficultyLabel: string;
  diffEasy: string;
  diffMedium: string;
  diffHard: string;
  diffExpert: string;
  cameraLabel: string;
  camWhite: string;
  camBlack: string;
  camTop: string;
  camSide: string;
  camWhiteAria: string;
  camBlackAria: string;
  camTopAria: string;
  camSideAria: string;
  hint: string;
  hintAria: string;
  undo: string;
  undoAria: string;
  soundOn: string;
  soundOff: string;
  soundToggleAria: string;
  turnWhite: string;
  turnBlack: string;
  aiThinking: string;
  inCheck: string;
  checkmateWhiteWins: string;
  checkmateBlackWins: string;
  stalemate: string;
  drawRepetition: string;
  drawInsufficient: string;
  drawGeneral: string;
  playAgain: string;
  dismissOverlay: string;
  promotionTitle: string;
  promotionSubtitle: string;
  queen: string;
  rook: string;
  bishop: string;
  knight: string;
  pawn: string;
  king: string;
  capturedByWhite: string;
  capturedByBlack: string;
  movesLabel: string;
  noMovesYet: string;
  keyboardMoveLabel: string;
  keyboardMovePlaceholder: string;
  keyboardMoveSubmit: string;
  keyboardMoveInvalid: string;
  boardControlsTip: string;
  hintSuggested: string;
  canvasAriaLabel: string;
  loading3D: string;
  webglFallbackTitle: string;
  webglFallbackBody: string;
  fullscreenEnter: string;
  fullscreenExit: string;
  fullscreenToggleAria: string;
}

export interface TranslationBundle {
  locale: LocaleCode;
  siteName: string;
  ogImageAlt: string;
  nav: {
    home: string;
    howToPlay: string;
    hireMe: string;
    languageAria: string;
    themeToggleAria: string;
    installApp: string;
    installAppAria: string;
    installedLabel: string;
    supportDev: string;
    supportDevAria: string;
    githubAria: string;
    skipToContent: string;
    iosInstallTitle: string;
    iosInstallStep1: string;
    iosInstallStep2: string;
    iosInstallStep3: string;
    close: string;
  };
  breadcrumbs: {
    ariaLabel: string;
    home: string;
    howToPlay: string;
    hireMe: string;
  };
  home: {
    title: string;
    description: string;
    h1: string;
    heroSubtitle: string;
    faqHeading: string;
    faqSubheading: string;
    faqs: FaqItem[];
  };
  howToPlay: {
    title: string;
    description: string;
    h1: string;
    intro: string;
    startPlayingCta: string;
    sections: HowToSection[];
  };
  hireMe: {
    title: string;
    description: string;
    badge: string;
    heading: string;
    intro: string;
    subcopy: string;
    specialties: SpecialtyItem[];
    ctaHeading: string;
    email: string;
    emailLabel: string;
    copyButtonLabel: string;
    copiedLabel: string;
    playChessCta: string;
  };
  footer: {
    tagline: string;
    builtBy: string;
    supportLink: string;
    openSource: string;
  };
  game: GameTranslations;
}

export const TRANSLATIONS: Record<LocaleCode, TranslationBundle> = {
  en: {
    locale: 'en',
    siteName: '3DChess',
    ogImageAlt: '3DChess interactive 3D wooden chessboard with sculpted Staunton pieces in a browser',
    nav: {
      home: 'Home',
      howToPlay: 'How to Play',
      hireMe: 'Hire Me',
      languageAria: 'Select language',
      themeToggleAria: 'Toggle light and dark theme',
      installApp: 'Add to Home Screen',
      installAppAria: 'Add 3DChess to Home Screen for offline play',
      installedLabel: 'App Installed',
      supportDev: 'Support the Developer',
      supportDevAria: 'Support the developer on Gumroad',
      githubAria: 'View source code on GitHub',
      skipToContent: 'Skip to main content',
      iosInstallTitle: 'Add 3DChess to Home Screen',
      iosInstallStep1: 'Tap the Share button in Safari or your browser toolbar.',
      iosInstallStep2: 'Scroll down and choose "Add to Home Screen".',
      iosInstallStep3: 'Tap "Add" to play 3DChess offline anytime in full screen.',
      close: 'Close',
    },
    breadcrumbs: {
      ariaLabel: 'Breadcrumb',
      home: 'Home',
      howToPlay: 'How to Play',
      hireMe: 'Hire Me',
    },
    home: {
      title: '3D Chess Online - Free Browser Chess vs AI & Friends',
      description:
        'Play 3D chess online in your browser against AI or a friend locally. Rotate the board, get move hints, and play offline—100% free, no sign-up.',
      h1: '3D Chess Online — Play Free Against AI or a Friend',
      heroSubtitle:
        'Rotate a tactile 3D wooden chessboard right in your browser. Challenge four smart AI levels or play locally with a friend—instant load, offline-ready, and no account required.',
      faqHeading: 'Frequently Asked Questions',
      faqSubheading: 'Everything you need to know about playing 3DChess in your browser.',
      faqs: [
        {
          question: 'Can I play 3D chess against the computer or a friend without creating an account?',
          answer:
            'Yes. 3DChess launches ready to play with no sign-up, login, or download. You can face the built-in AI across four difficulty levels (Easy, Medium, Hard, and Expert) as either White or Black, or switch to 2-Player Pass & Play to share the same screen with a friend.',
        },
        {
          question: 'Does 3DChess work offline on mobile and desktop?',
          answer:
            'Yes. All 3D piece geometries, board textures, chess rules, and AI calculations run 100% inside your browser without needing a server. Click "Add to Home Screen" to install it as a lightweight offline app on iOS, Android, Windows, or macOS.',
        },
        {
          question: 'How do I rotate, zoom, or reset the 3D chessboard camera?',
          answer:
            'Click and drag (or swipe with one finger on touchscreens) anywhere on the scene to orbit around the board. Scroll your mouse wheel or pinch with two fingers to zoom in and out. You can also jump instantly to White, Black, Top-Down, or Side camera presets with one tap.',
        },
        {
          question: 'Does the game support full chess rules including castling, en passant, and pawn promotion?',
          answer:
            'Yes. Every move is validated against full FIDE chess rules, including kingside and queenside castling, en passant captures, pawn promotion with a piece-selection dialog, check detection, checkmate, stalemate, threefold repetition, and insufficient-material draws.',
        },
      ],
    },
    howToPlay: {
      title: 'How to Play 3D Chess Online - Rules & Controls | 3DChess',
      description:
        'Learn how to play 3D chess in your browser. Master camera orbit controls, legal move highlights, castling, AI difficulty levels, and pass-and-play.',
      h1: 'How to Play 3D Chess — Camera Controls, Modes & Rules',
      intro:
        '3DChess combines classic Staunton wooden craftsmanship with responsive WebGL camera controls and full FIDE rule validation. Use this guide to master the 3D view, game modes, and special moves.',
      startPlayingCta: 'Start Playing 3DChess',
      sections: [
        {
          title: '1. 3D Camera & Board Controls',
          description:
            'Inspect every diagonal and tactical threat from any angle without losing sight of the board.',
          items: [
            {
              label: 'Orbit & Rotate',
              detail: 'Click and drag with your mouse—or swipe with one finger on mobile—to smoothly orbit around the chessboard.',
            },
            {
              label: 'Zoom In & Out',
              detail: 'Use your mouse scroll wheel, trackpad pinch, or two-finger touchscreen pinch to move closer or pull back.',
            },
            {
              label: 'One-Tap Camera Presets',
              detail: 'Switch cleanly between White POV, Black POV, Top-Down (ideal for fast tactical calculation), and Side Angle using the preset buttons or keys 1–4.',
            },
            {
              label: 'Selecting & Moving Pieces',
              detail: 'Tap or click any of your pieces to reveal glowing legal-move rings and capture markers, then click a highlighted target square to glide the piece into place. You can also type moves like e2e4 or Nf3 in the keyboard move bar.',
            },
          ],
        },
        {
          title: '2. Game Modes & AI Difficulty Levels',
          description:
            'Play solo at your own pace or turn your device into a portable wooden chessboard for two players.',
          items: [
            {
              label: 'Play vs AI (4 Levels)',
              detail: 'Choose Easy for relaxed learning, Medium for balanced club-casual matches, Hard for sharper tactics, or Expert for deep Alpha-Beta search with endgame awareness. The engine runs in a background Web Worker so 3D animations stay smooth at 60fps.',
            },
            {
              label: 'Choose White or Black',
              detail: 'Play the opening initiative as White, or test your defensive repertoire as Black—the camera automatically frames your side.',
            },
            {
              label: '2-Player Pass & Play',
              detail: 'Switch to 2-Player mode to take turns locally on the same computer, tablet, or phone, with quick White/Black/Top-Down camera presets ready whenever you want to flip perspectives.',
            },
            {
              label: 'Hints, Undo & Wood Audio',
              detail: 'Stuck in a complex position? Tap Hint to highlight a strong recommended move, use Undo to step back and explore alternatives, or toggle subtle synthesized wood-tap sounds on or off.',
            },
          ],
        },
        {
          title: '3. Full Chess Rules & Special Moves',
          description:
            'All official rules are enforced automatically so you can focus purely on strategy.',
          items: [
            {
              label: 'Castling (Kingside & Queenside)',
              detail: 'When neither your King nor Rook has moved and the squares between them are clear and not under attack, select your King and click two squares toward the Rook—both pieces animate smoothly into position.',
            },
            {
              label: 'En Passant',
              detail: 'If an opponent advances a pawn two squares beside your pawn on the fifth rank, the diagonal capture square highlights immediately on the very next turn.',
            },
            {
              label: 'Pawn Promotion',
              detail: 'Reaching the opposite edge of the board opens a clean promotion picker where you can promote your pawn to a Queen, Rook, Bishop, or Knight.',
            },
            {
              label: 'Check, Checkmate & Draws',
              detail: 'A subtle crimson glow marks a King in check. Checkmate, stalemate, threefold repetition, fifty-move rule, and insufficient material are detected and announced automatically.',
            },
          ],
        },
      ],
    },
    hireMe: {
      title: 'Hire Kishara Dilshan - Astro, React & 3D Web Dev | 3DChess',
      description:
        'Need an ultra-fast Astro, React, or Next.js web app or client-side WebAssembly tool? Hire Kishara Dilshan for custom SEO-ready IT solutions.',
      badge: 'Available for Freelance Projects',
      heading: 'Need a Custom IT Solution?',
      intro: "Hi, I'm Kishara Dilshan, the developer behind 3DChess.",
      subcopy:
        'If you love this fast, client-side tool and need a world-class IT solution for your own business, I am available for freelance projects. I specialize in:',
      specialties: [
        {
          title: 'Ultra-fast, SEO-optimized web applications',
          description:
            'Astro, React, Next.js — engineered for sub-second loads, technical SEO, and clean scalability.',
        },
        {
          title: 'Client-side processing & WebAssembly (WASM) tools',
          description:
            'Zero-server media, PDF, and data utilities that run privately inside the browser.',
        },
        {
          title: 'UI/UX design & High-converting landing pages',
          description:
            'Minimal, accessible interfaces crafted to convert visitors effortlessly across desktop and mobile.',
        },
      ],
      ctaHeading: "Let's build something amazing together.",
      email: 'kisharadilshan007@gmail.com',
      emailLabel: 'Email me directly: kisharadilshan007@gmail.com',
      copyButtonLabel: 'Copy Email',
      copiedLabel: 'Copied!',
      playChessCta: 'Back to 3D Chessboard',
    },
    footer: {
      tagline: '100% client-side WebGL 3D chess. Instant load, offline-ready, free forever.',
      builtBy: 'Crafted by Kishara Dilshan',
      supportLink: 'Support the Developer',
      openSource: 'MIT Open Source on GitHub',
    },
    game: {
      newGame: 'New Game',
      modeLabel: 'Mode',
      modeAi: 'vs AI',
      modeLocal: '2-Player Pass & Play',
      playAsLabel: 'Play as',
      white: 'White',
      black: 'Black',
      difficultyLabel: 'AI Level',
      diffEasy: 'Easy',
      diffMedium: 'Medium',
      diffHard: 'Hard',
      diffExpert: 'Expert',
      cameraLabel: 'Camera',
      camWhite: 'White',
      camBlack: 'Black',
      camTop: 'Top-Down',
      camSide: 'Side',
      camWhiteAria: 'Switch camera to White side view',
      camBlackAria: 'Switch camera to Black side view',
      camTopAria: 'Switch camera to Top-Down overhead view',
      camSideAria: 'Switch camera to Side angle view',
      hint: 'Hint',
      hintAria: 'Show best move hint',
      undo: 'Undo',
      undoAria: 'Undo last move',
      soundOn: 'Sound On',
      soundOff: 'Sound Off',
      soundToggleAria: 'Toggle wood chess sound effects',
      turnWhite: 'White to move',
      turnBlack: 'Black to move',
      aiThinking: 'AI thinking…',
      inCheck: 'Check!',
      checkmateWhiteWins: 'Checkmate — White wins!',
      checkmateBlackWins: 'Checkmate — Black wins!',
      stalemate: 'Draw — Stalemate',
      drawRepetition: 'Draw — Threefold repetition',
      drawInsufficient: 'Draw — Insufficient material',
      drawGeneral: 'Game drawn',
      playAgain: 'Play Again',
      dismissOverlay: 'Inspect Board',
      promotionTitle: 'Promote Pawn',
      promotionSubtitle: 'Choose the piece to replace your pawn:',
      queen: 'Queen',
      rook: 'Rook',
      bishop: 'Bishop',
      knight: 'Knight',
      pawn: 'Pawn',
      king: 'King',
      capturedByWhite: 'White captures',
      capturedByBlack: 'Black captures',
      movesLabel: 'Moves',
      noMovesYet: 'Click a piece on the 3D board to make the first move.',
      keyboardMoveLabel: 'Keyboard move',
      keyboardMovePlaceholder: 'e.g. e2e4 or Nf3',
      keyboardMoveSubmit: 'Move',
      keyboardMoveInvalid: 'Illegal or unrecognized move. Try notation like e2e4 or Nf3.',
      boardControlsTip: 'Drag to orbit • Scroll/pinch to zoom • Click a piece to move',
      hintSuggested: 'Suggested move',
      canvasAriaLabel: 'Interactive 3D chessboard canvas',
      loading3D: 'Preparing 3D chessboard…',
      webglFallbackTitle: '3D WebGL view unavailable',
      webglFallbackBody: 'Your browser or device has WebGL disabled. Enable hardware acceleration to view the 3D chessboard.',
      fullscreenEnter: 'Full Screen',
      fullscreenExit: 'Exit Full Screen',
      fullscreenToggleAria: 'Toggle full screen chessboard mode',
    },
  },

  es: {
    locale: 'es',
    siteName: '3DChess',
    ogImageAlt: 'Tablero de ajedrez 3D interactivo de madera con piezas Staunton en el navegador',
    nav: {
      home: 'Inicio',
      howToPlay: 'Cómo Jugar',
      hireMe: 'Contrátame',
      languageAria: 'Seleccionar idioma',
      themeToggleAria: 'Cambiar tema claro u oscuro',
      installApp: 'Añadir a inicio',
      installAppAria: 'Añadir 3DChess a la pantalla de inicio para jugar sin conexión',
      installedLabel: 'App instalada',
      supportDev: 'Apoyar al desarrollador',
      supportDevAria: 'Apoyar al desarrollador en Gumroad',
      githubAria: 'Ver código fuente en GitHub',
      skipToContent: 'Saltar al contenido principal',
      iosInstallTitle: 'Añadir 3DChess a la pantalla de inicio',
      iosInstallStep1: 'Toca el botón Compartir en Safari o en la barra del navegador.',
      iosInstallStep2: 'Desplázate hacia abajo y selecciona "Añadir a pantalla de inicio".',
      iosInstallStep3: 'Toca "Añadir" para jugar a 3DChess sin conexión en pantalla completa.',
      close: 'Cerrar',
    },
    breadcrumbs: {
      ariaLabel: 'Ruta de navegación',
      home: 'Inicio',
      howToPlay: 'Cómo Jugar',
      hireMe: 'Contrátame',
    },
    home: {
      title: 'Ajedrez 3D Online - Juega Gratis contra IA y Amigos',
      description:
        'Juega ajedrez 3D online en tu navegador contra la IA o un amigo local. Gira el tablero, pide pistas y juega sin conexión, gratis y sin registro.',
      h1: 'Ajedrez 3D Online — Juega Gratis contra la IA o un Amigo',
      heroSubtitle:
        'Gira un tablero de madera en 3D directamente en tu navegador. Desafía cuatro niveles de IA o juega en modo local con un amigo: carga instantánea, listo sin conexión y sin cuenta.',
      faqHeading: 'Preguntas Frecuentes',
      faqSubheading: 'Todo lo que necesitas saber para jugar a 3DChess en tu navegador.',
      faqs: [
        {
          question: '¿Puedo jugar ajedrez 3D contra la IA o un amigo sin crear una cuenta?',
          answer:
            'Sí. 3DChess abre listo para jugar sin registro, inicio de sesión ni descargas. Puedes enfrentarte a la IA integrada en cuatro niveles (Fácil, Medio, Difícil y Experto) con blancas o negras, o cambiar al modo 2 jugadores para compartir pantalla.',
        },
        {
          question: '¿Funciona 3DChess sin conexión en móviles y computadoras?',
          answer:
            'Sí. Todas las piezas 3D, las reglas del ajedrez y los cálculos de la IA se ejecutan al 100% en tu navegador. Pulsa "Añadir a inicio" para instalarlo como aplicación ligera sin conexión en iOS, Android, Windows o macOS.',
        },
        {
          question: '¿Cómo giro, acerco o restablezco la cámara del tablero 3D?',
          answer:
            'Haz clic y arrastra (o desliza con un dedo en pantallas táctiles) para rotar alrededor del tablero. Usa la rueda del ratón o pellizca con dos dedos para hacer zoom, o elige vistas rápidas: Blancas, Negras, Superior o Lateral.',
        },
        {
          question: '¿El juego admite todas las reglas como enroque, captura al paso y coronación?',
          answer:
            'Sí. Cada jugada cumple las reglas oficiales de la FIDE, incluyendo enroque corto y largo, captura al paso, coronación de peón con selector de pieza, jaque, jaque mate, ahogado, triple repetición y tablas por material insuficiente.',
        },
      ],
    },
    howToPlay: {
      title: 'Cómo Jugar Ajedrez 3D Online - Reglas y Controles | 3DChess',
      description:
        'Aprende a jugar ajedrez 3D en tu navegador. Domina los controles de cámara, movimientos legales, enroque, niveles de IA y el modo local para dos.',
      h1: 'Cómo Jugar Ajedrez 3D — Cámara, Modos y Reglas',
      intro:
        '3DChess une piezas clásicas Staunton con controles de cámara fluidos en WebGL y validación completa de reglas FIDE. Sigue esta guía para dominar el tablero.',
      startPlayingCta: 'Empezar a Jugar 3DChess',
      sections: [
        {
          title: '1. Controles de Cámara y Tablero 3D',
          description: 'Analiza cada diagonal y táctica desde cualquier ángulo con total claridad.',
          items: [
            {
              label: 'Orbitar y Girar',
              detail: 'Haz clic y arrastra con el ratón, o desliza con un dedo en móvil, para rodear el tablero suavemente.',
            },
            {
              label: 'Acercar y Alejar',
              detail: 'Utiliza la rueda del ratón o el gesto de pellizco con dos dedos para ajustar la distancia de cámara.',
            },
            {
              label: 'Vistas Rápidas de Cámara',
              detail: 'Cambia al instante entre vista de Blancas, Negras, Superior (ideal para cálculo rápido) y Lateral mediante los botones o las teclas 1–4.',
            },
            {
              label: 'Seleccionar y Mover Piezas',
              detail: 'Haz clic en cualquiera de tus piezas para iluminar las casillas legales y capturas, y luego toca el destino. También puedes escribir jugadas como e2e4 o Nf3 en el campo de teclado.',
            },
          ],
        },
        {
          title: '2. Modos de Juego y Niveles de IA',
          description: 'Entrena en solitario o comparte una partida clásica cara a cara.',
          items: [
            {
              label: 'Contra la IA (4 Niveles)',
              detail: 'Elige Fácil para practicar, Medio para partidas equilibradas, Difícil para retos tácticos o Experto para búsqueda profunda Alpha-Beta. La IA corre en un Web Worker sin frenar los 60fps.',
            },
            {
              label: 'Jugar con Blancas o Negras',
              detail: 'Toma la iniciativa con blancas o defiende con negras; la cámara se orienta automáticamente hacia tu lado.',
            },
            {
              label: 'Modo 2 Jugadores Local',
              detail: 'Juega por turnos en la misma pantalla con un amigo y utiliza la vista Superior o el cambio de lado en cualquier momento.',
            },
            {
              label: 'Pistas, Deshacer y Sonido',
              detail: 'Pide una pista en posiciones difíciles, deshaz la última jugada para probar variantes y activa o silencia el sonido sutil de madera.',
            },
          ],
        },
        {
          title: '3. Reglas Oficiales y Movimientos Especiales',
          description: 'Todas las normas oficiales se aplican de forma automática.',
          items: [
            {
              label: 'Enroque Corto y Largo',
              detail: 'Cuando el rey y la torre no se han movido y el camino está libre y seguro, selecciona el rey y pulsa dos casillas hacia la torre.',
            },
            {
              label: 'Captura al Paso',
              detail: 'Si el rival avanza un peón dos casillas junto al tuyo en quinta fila, la casilla diagonal de captura se marcará en el turno siguiente.',
            },
            {
              label: 'Coronación de Peón',
              detail: 'Al llegar a la última fila aparece un selector accesible para coronar en Dama, Torre, Alfil o Caballo.',
            },
            {
              label: 'Jaque, Mate y Tablas',
              detail: 'Un resplandor carmesí señala al rey en jaque. Se detectan automáticamente jaque mate, ahogado, triple repetición y material insuficiente.',
            },
          ],
        },
      ],
    },
    hireMe: {
      title: 'Contrata a Kishara Dilshan - Web Astro, React y 3D | 3DChess',
      description:
        '¿Necesitas una app web rápida en Astro, React o Next.js o herramientas WebAssembly? Contrata a Kishara Dilshan para soluciones IT listas para SEO.',
      badge: 'Disponible para Proyectos Freelance',
      heading: '¿Necesitas una Solución IT a Medida?',
      intro: 'Hola, soy Kishara Dilshan, el desarrollador detrás de 3DChess.',
      subcopy:
        'Si te encanta esta herramienta rápida del lado del cliente y necesitas una solución IT de primer nivel para tu negocio, estoy disponible para proyectos freelance. Me especializo en:',
      specialties: [
        {
          title: 'Aplicaciones web ultrarrápidas y optimizadas para SEO',
          description:
            'Astro, React, Next.js — diseñadas para cargas en milisegundos, SEO técnico y escalabilidad limpia.',
        },
        {
          title: 'Procesamiento en el cliente y herramientas WebAssembly (WASM)',
          description:
            'Utilidades de multimedia, PDF y datos sin servidor que se ejecutan en privado dentro del navegador.',
        },
        {
          title: 'Diseño UI/UX y páginas de aterrizaje de alta conversión',
          description:
            'Interfaces minimalistas y accesibles pensadas para convertir visitantes en escritorio y móvil.',
        },
      ],
      ctaHeading: 'Construyamos algo increíble juntos.',
      email: 'kisharadilshan007@gmail.com',
      emailLabel: 'Escríbeme directamente: kisharadilshan007@gmail.com',
      copyButtonLabel: 'Copiar Correo',
      copiedLabel: '¡Copiado!',
      playChessCta: 'Volver al Tablero 3D',
    },
    footer: {
      tagline: 'Ajedrez 3D WebGL 100% en tu navegador. Carga instantánea, sin conexión y gratis.',
      builtBy: 'Creado por Kishara Dilshan',
      supportLink: 'Apoyar al desarrollador',
      openSource: 'Código Abierto MIT en GitHub',
    },
    game: {
      newGame: 'Nueva Partida',
      modeLabel: 'Modo',
      modeAi: 'vs IA',
      modeLocal: '2 Jugadores Local',
      playAsLabel: 'Jugar con',
      white: 'Blancas',
      black: 'Negras',
      difficultyLabel: 'Nivel IA',
      diffEasy: 'Fácil',
      diffMedium: 'Medio',
      diffHard: 'Difícil',
      diffExpert: 'Experto',
      cameraLabel: 'Cámara',
      camWhite: 'Blancas',
      camBlack: 'Negras',
      camTop: 'Superior',
      camSide: 'Lateral',
      camWhiteAria: 'Cambiar cámara a vista de Blancas',
      camBlackAria: 'Cambiar cámara a vista de Negras',
      camTopAria: 'Cambiar cámara a vista superior cenital',
      camSideAria: 'Cambiar cámara a vista lateral',
      hint: 'Pista',
      hintAria: 'Mostrar pista de mejor jugada',
      undo: 'Deshacer',
      undoAria: 'Deshacer última jugada',
      soundOn: 'Sonido Sí',
      soundOff: 'Silencio',
      soundToggleAria: 'Activar o desactivar sonidos de madera',
      turnWhite: 'Turno de Blancas',
      turnBlack: 'Turno de Negras',
      aiThinking: 'La IA está pensando…',
      inCheck: '¡Jaque!',
      checkmateWhiteWins: 'Jaque mate — ¡Ganan las Blancas!',
      checkmateBlackWins: 'Jaque mate — ¡Ganan las Negras!',
      stalemate: 'Tablas — Ahogado',
      drawRepetition: 'Tablas — Triple repetición',
      drawInsufficient: 'Tablas — Material insuficiente',
      drawGeneral: 'Partida en tablas',
      playAgain: 'Jugar de Nuevo',
      dismissOverlay: 'Ver Tablero',
      promotionTitle: 'Coronar Peón',
      promotionSubtitle: 'Elige la pieza para sustituir tu peón:',
      queen: 'Dama',
      rook: 'Torre',
      bishop: 'Alfil',
      knight: 'Caballo',
      pawn: 'Peón',
      king: 'Rey',
      capturedByWhite: 'Capturas de Blancas',
      capturedByBlack: 'Capturas de Negras',
      movesLabel: 'Jugadas',
      noMovesYet: 'Haz clic en una pieza del tablero 3D para hacer la primera jugada.',
      keyboardMoveLabel: 'Jugada por teclado',
      keyboardMovePlaceholder: 'ej. e2e4 o Nf3',
      keyboardMoveSubmit: 'Mover',
      keyboardMoveInvalid: 'Jugada no válida. Prueba notación como e2e4 o Nf3.',
      boardControlsTip: 'Arrastra para girar • Rueda/pellizco para zoom • Clic en pieza para mover',
      hintSuggested: 'Jugada sugerida',
      canvasAriaLabel: 'Lienzo interactivo de ajedrez 3D',
      loading3D: 'Preparando tablero 3D…',
      webglFallbackTitle: 'Vista 3D WebGL no disponible',
      webglFallbackBody: 'WebGL está desactivado en tu navegador. Activa la aceleración por hardware para ver el tablero 3D.',
      fullscreenEnter: 'Pantalla Completa',
      fullscreenExit: 'Salir de Pantalla Completa',
      fullscreenToggleAria: 'Alternar modo de pantalla completa',
    },
  },

  pt: {
    locale: 'pt',
    siteName: '3DChess',
    ogImageAlt: 'Tabuleiro de xadrez 3D interativo em madeira com peças Staunton no navegador',
    nav: {
      home: 'Início',
      howToPlay: 'Como Jogar',
      hireMe: 'Contrate-me',
      languageAria: 'Selecionar idioma',
      themeToggleAria: 'Alternar tema claro e escuro',
      installApp: 'Adicionar à Tela Inicial',
      installAppAria: 'Adicionar 3DChess à tela inicial para jogar offline',
      installedLabel: 'App Instalado',
      supportDev: 'Apoiar o Desenvolvedor',
      supportDevAria: 'Apoiar o desenvolvedor no Gumroad',
      githubAria: 'Ver código-fonte no GitHub',
      skipToContent: 'Pular para o conteúdo principal',
      iosInstallTitle: 'Adicionar 3DChess à Tela Inicial',
      iosInstallStep1: 'Toque no botão Compartilhar no Safari ou na barra do navegador.',
      iosInstallStep2: 'Role para baixo e toque em "Adicionar à Tela de Início".',
      iosInstallStep3: 'Toque em "Adicionar" para jogar 3DChess offline em tela cheia.',
      close: 'Fechar',
    },
    breadcrumbs: {
      ariaLabel: 'Navegação estrutural',
      home: 'Início',
      howToPlay: 'Como Jogar',
      hireMe: 'Contrate-me',
    },
    home: {
      title: 'Xadrez 3D Online - Xadrez Grátis contra IA e Amigos',
      description:
        'Jogue xadrez 3D online no navegador contra a IA ou um amigo local. Gire o tabuleiro, receba dicas e jogue offline — 100% grátis, sem cadastro.',
      h1: 'Xadrez 3D Online — Jogue Grátis contra IA ou um Amigo',
      heroSubtitle:
        'Gire um tabuleiro de madeira em 3D direto no navegador. Desafie quatro níveis de IA ou jogue localmente com um amigo — carregamento instantâneo, pronto para offline e sem cadastro.',
      faqHeading: 'Perguntas Frequentes',
      faqSubheading: 'Tudo o que você precisa saber para jogar 3DChess no seu navegador.',
      faqs: [
        {
          question: 'Posso jogar xadrez 3D contra o computador ou um amigo sem criar conta?',
          answer:
            'Sim. O 3DChess abre pronto para jogar sem cadastro, login ou downloads. Enfrente a IA em quatro níveis (Fácil, Médio, Difícil e Especialista) de Brancas ou Pretas, ou mude para 2 Jogadores Local na mesma tela.',
        },
        {
          question: 'O 3DChess funciona offline no celular e no computador?',
          answer:
            'Sim. Todas as peças 3D, regras oficiais e cálculos da IA rodam 100% dentro do seu navegador. Clique em "Adicionar à Tela Inicial" para instalar como app leve offline no iOS, Android, Windows ou macOS.',
        },
        {
          question: 'Como girar, aproximar ou redefinir a câmera do tabuleiro 3D?',
          answer:
            'Clique e arraste (ou deslize com um dedo em telas sensíveis ao toque) para orbitar ao redor do tabuleiro. Use a roda do mouse ou pinça com dois dedos para dar zoom, ou escolha visões rápidas: Brancas, Pretas, Topo ou Lateral.',
        },
        {
          question: 'O jogo segue todas as regras, incluindo roque, en passant e promoção?',
          answer:
            'Sim. Todos os lances são validados pelas regras oficiais da FIDE, incluindo roque curto e longo, captura en passant, promoção de peão com seletor de peça, xeque, xeque-mate, afogamento e empates oficiais.',
        },
      ],
    },
    howToPlay: {
      title: 'Como Jogar Xadrez 3D Online - Regras e Controles | 3DChess',
      description:
        'Aprenda a jogar xadrez 3D no navegador. Domine os controles de câmera, jogadas válidas, roque, níveis de dificuldade da IA e modo 2 jogadores.',
      h1: 'Como Jogar Xadrez 3D — Câmera, Modos e Regras',
      intro:
        'O 3DChess combina peças Staunton clássicas com controles WebGL fluidos e validação completa das regras FIDE. Confira os controles e recursos abaixo.',
      startPlayingCta: 'Jogar 3DChess Agora',
      sections: [
        {
          title: '1. Controles de Câmera e Tabuleiro 3D',
          description: 'Observe cada diagonal e combinação tática de qualquer perspectiva.',
          items: [
            {
              label: 'Orbitar e Girar',
              detail: 'Clique e arraste com o mouse, ou deslize um dedo no celular, para rotacionar livremente ao redor do tabuleiro.',
            },
            {
              label: 'Zoom Preciso',
              detail: 'Use a roda do mouse ou o gesto de pinça com dois dedos para aproximar ou afastar a câmera.',
            },
            {
              label: 'Atalhos de Câmera',
              detail: 'Alterne em um toque entre visão das Brancas, Pretas, Vista Superior e Ângulo Lateral usando os botões ou as teclas 1–4.',
            },
            {
              label: 'Mover Peças',
              detail: 'Clique em uma peça sua para iluminar casas válidas e capturas, depois toque no destino. Você também pode digitar lances como e2e4 ou Nf3 pelo teclado.',
            },
          ],
        },
        {
          title: '2. Modos de Jogo e Dificuldade da IA',
          description: 'Treine sozinho ou transforme sua tela em um tabuleiro portátil para dois.',
          items: [
            {
              label: 'Contra a IA (4 Níveis)',
              detail: 'Escolha Fácil para começar, Médio para partidas casuais, Difícil para tática apurada ou Especialista para busca Alpha-Beta profunda rodando em Web Worker a 60fps.',
            },
            {
              label: 'Jogue de Brancas ou Pretas',
              detail: 'Comece atacando com as Brancas ou teste suas defesas com as Pretas; a câmera se ajusta automaticamente.',
            },
            {
              label: '2 Jogadores Local',
              detail: 'Alterne turnos com um amigo no mesmo dispositivo usando a vista superior ou alternando a câmera entre lances.',
            },
            {
              label: 'Dicas, Desfazer e Áudio',
              detail: 'Peça uma dica quando precisar de inspiração, desfaça jogadas para testar linhas diferentes e controle o som suave de madeira.',
            },
          ],
        },
        {
          title: '3. Regras Oficiais e Lances Especiais',
          description: 'Todas as regras do xadrez são validadas automaticamente em tempo real.',
          items: [
            {
              label: 'Roque Curto e Longo',
              detail: 'Com Rei e Torre intactos e caminho livre de ataques, selecione o Rei e clique duas casas em direção à Torre.',
            },
            {
              label: 'Captura En Passant',
              detail: 'Quando o oponente avança um peão duas casas ao lado do seu na quinta fileira, a captura diagonal aparece destacada imediatamente.',
            },
            {
              label: 'Promoção de Peão',
              detail: 'Ao alcançar a última fileira, escolha entre Rainha, Torre, Bispo ou Cavalo no seletor acessível.',
            },
            {
              label: 'Xeque, Mate e Empates',
              detail: 'Um brilho carmesim destaca o Rei em xeque. Xeque-mate, afogamento, tripla repetição e material insuficiente são detectados automaticamente.',
            },
          ],
        },
      ],
    },
    hireMe: {
      title: 'Contrate Kishara Dilshan - Dev Astro, React e 3D | 3DChess',
      description:
        'Precisa de um site ultrarrápido em Astro, React ou Next.js ou ferramenta WebAssembly? Contrate Kishara Dilshan para soluções de TI com SEO.',
      badge: 'Disponível para Projetos Freelance',
      heading: 'Precisa de uma Solução de TI Personalizada?',
      intro: 'Olá, eu sou Kishara Dilshan, o desenvolvedor por trás do 3DChess.',
      subcopy:
        'Se você gosta desta ferramenta rápida executada no navegador e precisa de uma solução de TI de alto nível para o seu negócio, estou disponível para projetos freelance. Sou especialista em:',
      specialties: [
        {
          title: 'Aplicações web ultrarrápidas e otimizadas para SEO',
          description:
            'Astro, React, Next.js — projetadas para carregamento instantâneo, SEO técnico e escalabilidade limpa.',
        },
        {
          title: 'Processamento no cliente e ferramentas WebAssembly (WASM)',
          description:
            'Utilitários de mídia, PDF e dados sem servidor que rodam com total privacidade no navegador.',
        },
        {
          title: 'Design UI/UX e landing pages de alta conversão',
          description:
            'Interfaces minimalistas e acessíveis criadas para converter visitantes no desktop e no celular.',
        },
      ],
      ctaHeading: 'Vamos construir algo incrível juntos.',
      email: 'kisharadilshan007@gmail.com',
      emailLabel: 'Envie um e-mail direto: kisharadilshan007@gmail.com',
      copyButtonLabel: 'Copiar E-mail',
      copiedLabel: 'Copiado!',
      playChessCta: 'Voltar ao Tabuleiro 3D',
    },
    footer: {
      tagline: 'Xadrez 3D WebGL 100% no navegador. Instantâneo, offline e gratuito.',
      builtBy: 'Desenvolvido por Kishara Dilshan',
      supportLink: 'Apoiar o Desenvolvedor',
      openSource: 'Código Aberto MIT no GitHub',
    },
    game: {
      newGame: 'Novo Jogo',
      modeLabel: 'Modo',
      modeAi: 'vs IA',
      modeLocal: '2 Jogadores Local',
      playAsLabel: 'Jogar de',
      white: 'Brancas',
      black: 'Pretas',
      difficultyLabel: 'Nível IA',
      diffEasy: 'Fácil',
      diffMedium: 'Médio',
      diffHard: 'Difícil',
      diffExpert: 'Especialista',
      cameraLabel: 'Câmera',
      camWhite: 'Brancas',
      camBlack: 'Pretas',
      camTop: 'Superior',
      camSide: 'Lateral',
      camWhiteAria: 'Mudar câmera para visão das Brancas',
      camBlackAria: 'Mudar câmera para visão das Pretas',
      camTopAria: 'Mudar câmera para visão superior',
      camSideAria: 'Mudar câmera para visão lateral',
      hint: 'Dica',
      hintAria: 'Mostrar dica de melhor lance',
      undo: 'Desfazer',
      undoAria: 'Desfazer último lance',
      soundOn: 'Som Ligado',
      soundOff: 'Som Mudo',
      soundToggleAria: 'Alternar efeitos sonoros de madeira',
      turnWhite: 'Vez das Brancas',
      turnBlack: 'Vez das Pretas',
      aiThinking: 'IA pensando…',
      inCheck: 'Xeque!',
      checkmateWhiteWins: 'Xeque-mate — Brancas vencem!',
      checkmateBlackWins: 'Xeque-mate — Pretas vencem!',
      stalemate: 'Empate — Afogamento',
      drawRepetition: 'Empate — Tripla repetição',
      drawInsufficient: 'Empate — Material insuficiente',
      drawGeneral: 'Empate',
      playAgain: 'Jogar Novamente',
      dismissOverlay: 'Ver Tabuleiro',
      promotionTitle: 'Promover Peão',
      promotionSubtitle: 'Escolha a peça para substituir seu peão:',
      queen: 'Rainha',
      rook: 'Torre',
      bishop: 'Bispo',
      knight: 'Cavalo',
      pawn: 'Peão',
      king: 'Rei',
      capturedByWhite: 'Capturas das Brancas',
      capturedByBlack: 'Capturas das Pretas',
      movesLabel: 'Lances',
      noMovesYet: 'Clique em uma peça no tabuleiro 3D para fazer o primeiro lance.',
      keyboardMoveLabel: 'Lance por teclado',
      keyboardMovePlaceholder: 'ex. e2e4 ou Nf3',
      keyboardMoveSubmit: 'Mover',
      keyboardMoveInvalid: 'Lance inválido. Tente notação como e2e4 ou Nf3.',
      boardControlsTip: 'Arraste para girar • Roda/pinça para zoom • Clique na peça para mover',
      hintSuggested: 'Lance sugerido',
      canvasAriaLabel: 'Tabuleiro de xadrez 3D interativo',
      loading3D: 'Preparando tabuleiro 3D…',
      webglFallbackTitle: 'Visualização 3D WebGL indisponível',
      webglFallbackBody: 'O WebGL está desativado no seu navegador. Ative a aceleração de hardware para visualizar o tabuleiro 3D.',
      fullscreenEnter: 'Tela Cheia',
      fullscreenExit: 'Sair da Tela Cheia',
      fullscreenToggleAria: 'Alternar modo de tela cheia',
    },
  },

  de: {
    locale: 'de',
    siteName: '3DChess',
    ogImageAlt: 'Interaktives 3D-Holzschachbrett mit Staunton-Figuren direkt im Browser',
    nav: {
      home: 'Start',
      howToPlay: 'Anleitung',
      hireMe: 'Beauftragen',
      languageAria: 'Sprache auswählen',
      themeToggleAria: 'Helles und dunkles Design umschalten',
      installApp: 'Zum Startbildschirm',
      installAppAria: '3DChess zum Startbildschirm hinzufügen für Offline-Spiele',
      installedLabel: 'App installiert',
      supportDev: 'Entwickler unterstützen',
      supportDevAria: 'Entwickler auf Gumroad unterstützen',
      githubAria: 'Quellcode auf GitHub ansehen',
      skipToContent: 'Zum Hauptinhalt springen',
      iosInstallTitle: '3DChess zum Startbildschirm hinzufügen',
      iosInstallStep1: 'Tippe in Safari oder deinem Browser auf die Teilen-Schaltfläche.',
      iosInstallStep2: 'Scrolle nach unten und wähle „Zum Home-Bildschirm“.',
      iosInstallStep3: 'Tippe auf „Hinzufügen“, um 3DChess jederzeit offline im Vollbild zu spielen.',
      close: 'Schließen',
    },
    breadcrumbs: {
      ariaLabel: 'Brotkrümelnavigation',
      home: 'Start',
      howToPlay: 'Anleitung',
      hireMe: 'Beauftragen',
    },
    home: {
      title: '3D Schach Online - Kostenlos gegen KI & Freunde spielen',
      description:
        'Spiele 3D-Schach kostenlos im Browser gegen KI oder lokal mit Freunden. Brett drehen, Zughinweise nutzen und offline spielen — ohne Anmeldung.',
      h1: '3D Schach Online — Kostenlos gegen KI oder Freunde spielen',
      heroSubtitle:
        'Drehe ein hochwertiges 3D-Holzschachbrett direkt im Browser. Fordere vier intelligente KI-Stufen heraus oder spiele lokal zu zweit — sofort spielbereit, offline-fähig und ohne Konto.',
      faqHeading: 'Häufig gestellte Fragen',
      faqSubheading: 'Alles Wichtige rund um 3DChess direkt im Browser.',
      faqs: [
        {
          question: 'Kann ich 3D-Schach ohne Konto gegen den Computer oder Freunde spielen?',
          answer:
            'Ja. 3DChess startet sofort spielbereit ohne Registrierung oder Download. Spiele gegen die KI in vier Stufen (Leicht, Mittel, Schwer, Experte) mit Weiß oder Schwarz oder wechsle zum lokalen 2-Spieler-Modus am selben Gerät.',
        },
        {
          question: 'Funktioniert 3DChess offline auf Smartphone und Desktop?',
          answer:
            'Ja. Alle 3D-Figuren, Schachregeln und KI-Berechnungen laufen vollständig lokal im Browser. Über „Zum Startbildschirm“ installierst du das Spiel als schlanke Offline-App für iOS, Android, Windows und macOS.',
        },
        {
          question: 'Wie drehe, zoome oder resette ich die 3D-Schachbrett-Kamera?',
          answer:
            'Ziehe mit der Maus (oder streiche mit einem Finger auf Touchscreens) über das Brett, um die Kamera frei zu drehen. Zoome mit dem Mausrad oder zwei Fingern oder wechsle per Klick zwischen Weiß-, Schwarz-, Draufsicht- und Seitenkamera.',
        },
        {
          question: 'Unterstützt das Spiel alle Schachregeln wie Rochade, En Passant und Umwandlung?',
          answer:
            'Ja. Jeder Zug folgt den vollständigen FIDE-Regeln — einschließlich kurzer und langer Rochade, En-Passant-Schlag, Bauernumwandlung per Auswahlmenü, Schach, Schachmatt, Patt, dreifacher Stellungswiederholung und ungenügendem Material.',
        },
      ],
    },
    howToPlay: {
      title: '3D Schach Anleitung - Regeln & Steuerung | 3DChess',
      description:
        'Lerne 3D-Schach direkt im Browser. Meistere Kamerasteuerung, legale Zugmarkierungen, Rochade, vier KI-Schwierigkeitsstufen und lokalen 2-Spieler-Modus.',
      h1: '3D Schach Anleitung — Kamerasteuerung, Modi & Regeln',
      intro:
        '3DChess verbindet klassische Staunton-Figuren mit flüssiger WebGL-Kamerasteuerung und präziser FIDE-Regelprüfung. Hier findest du alle Steuerungen und Spielregeln.',
      startPlayingCta: 'Jetzt 3DChess spielen',
      sections: [
        {
          title: '1. 3D-Kamera & Brettsteuerung',
          description: 'Behalte jede Diagonale und taktische Drohung aus jeder Perspektive im Blick.',
          items: [
            {
              label: 'Drehen & Schwenken',
              detail: 'Klicke und ziehe mit der Maus — oder wische mit einem Finger auf dem Touchscreen — um sanft um das Brett zu kreisen.',
            },
            {
              label: 'Zoomen',
              detail: 'Nutze das Mausrad oder die Zwei-Finger-Geste, um näher heranzuzoomen oder das gesamte Brett zu überblicken.',
            },
            {
              label: 'Kamera-Presets',
              detail: 'Wechsle per Klick oder mit den Tasten 1–4 sofort zwischen Weiß-Sicht, Schwarz-Sicht, Draufsicht und Seitenansicht.',
            },
            {
              label: 'Figuren ziehen',
              detail: 'Klicke eine eigene Figur an, um legale Zielfelder und Schlagzüge aufleuchten zu lassen, und wähle dein Ziel. Alternativ kannst du Züge wie e2e4 oder Nf3 per Tastatur eingeben.',
            },
          ],
        },
        {
          title: '2. Spielmodi & KI-Stufen',
          description: 'Trainiere allein gegen die KI oder teile das Brett lokal mit einem Freund.',
          items: [
            {
              label: 'Gegen KI (4 Stufen)',
              detail: 'Wähle Leicht zum Einstieg, Mittel für ausgewogene Partien, Schwer für starke Taktik oder Experte für tiefe Alpha-Beta-Suche im Hintergrund-Web-Worker bei flüssigen 60fps.',
            },
            {
              label: 'Weiß oder Schwarz wählen',
              detail: 'Spiele den ersten Zug mit Weiß oder übe Verteidigungen mit Schwarz — die Kamera richtet sich passend aus.',
            },
            {
              label: '2-Spieler Lokal',
              detail: 'Wechsle in den 2-Spieler-Modus für gemeinsame Partien an einem Gerät, ideal mit Draufsicht oder schnellem Perspektivwechsel.',
            },
            {
              label: 'Hinweis, Rückgängig & Klang',
              detail: 'Nutze Zughinweise in kniffligen Stellungen, nimm Züge zum Ausprobieren zurück und schalte den dezenten Holzklang nach Wunsch ein oder aus.',
            },
          ],
        },
        {
          title: '3. Vollständige Schachregeln & Sonderzüge',
          description: 'Alle offiziellen FIDE-Regeln werden automatisch geprüft.',
          items: [
            {
              label: 'Rochade (kurz & lang)',
              detail: 'Sind König und Turm ungezogen und die Felder dazwischen frei und unbedroht, wähle den König und klicke zwei Felder Richtung Turm.',
            },
            {
              label: 'En Passant',
              detail: 'Zieht ein gegnerischer Bauer zwei Felder neben deinen Bauern auf der fünften Reihe, leuchtet das diagonale Schlagfeld im nächsten Zug sofort auf.',
            },
            {
              label: 'Bauernumwandlung',
              detail: 'Erreicht ein Bauer die gegnerische Grundreihe, öffnet sich ein klares Menü zur Wahl von Dame, Turm, Läufer oder Springer.',
            },
            {
              label: 'Schach, Matt & Remis',
              detail: 'Ein roter Lichtring markiert einen König im Schach. Schachmatt, Patt, dreifache Wiederholung und ungenügendes Material werden automatisch erkannt.',
            },
          ],
        },
      ],
    },
    hireMe: {
      title: 'Kishara Dilshan engagieren - Astro, React & 3D | 3DChess',
      description:
        'Du brauchst eine blitzschnelle Astro-, React- oder Next.js-Web-App oder ein WebAssembly-Tool? Engagiere Kishara Dilshan für SEO-starke IT-Lösungen.',
      badge: 'Verfügbar für Freelance-Projekte',
      heading: 'Benötigst du eine maßgeschneiderte IT-Lösung?',
      intro: 'Hallo, ich bin Kishara Dilshan, der Entwickler hinter 3DChess.',
      subcopy:
        'Wenn dir dieses schnelle, clientseitige Tool gefällt und du eine erstklassige IT-Lösung für dein eigenes Unternehmen brauchst, stehe ich für Freelance-Projekte zur Verfügung. Meine Schwerpunkte:',
      specialties: [
        {
          title: 'Ultraschnelle, SEO-optimierte Webanwendungen',
          description:
            'Astro, React, Next.js — entwickelt für blitzschnelle Ladezeiten, technisches SEO und saubere Skalierbarkeit.',
        },
        {
          title: 'Clientseitige Verarbeitung & WebAssembly-Tools (WASM)',
          description:
            'Serverlose Medien-, PDF- und Daten-Tools, die vollständig privat direkt im Browser laufen.',
        },
        {
          title: 'UI/UX-Design & konversionsstarke Landingpages',
          description:
            'Minimalistische, barrierefreie Oberflächen, die Besucher auf Desktop und Mobilgeräten mühelos überzeugen.',
        },
      ],
      ctaHeading: 'Lass uns gemeinsam etwas Großartiges bauen.',
      email: 'kisharadilshan007@gmail.com',
      emailLabel: 'Schreib mir direkt: kisharadilshan007@gmail.com',
      copyButtonLabel: 'E-Mail kopieren',
      copiedLabel: 'Kopiert!',
      playChessCta: 'Zurück zum 3D-Schachbrett',
    },
    footer: {
      tagline: '100% clientseitiges WebGL-3D-Schach. Sofort spielbereit, offline-fähig und kostenlos.',
      builtBy: 'Entwickelt von Kishara Dilshan',
      supportLink: 'Entwickler unterstützen',
      openSource: 'MIT Open Source auf GitHub',
    },
    game: {
      newGame: 'Neues Spiel',
      modeLabel: 'Modus',
      modeAi: 'gegen KI',
      modeLocal: '2-Spieler Lokal',
      playAsLabel: 'Spielen als',
      white: 'Weiß',
      black: 'Schwarz',
      difficultyLabel: 'KI-Stufe',
      diffEasy: 'Leicht',
      diffMedium: 'Mittel',
      diffHard: 'Schwer',
      diffExpert: 'Experte',
      cameraLabel: 'Kamera',
      camWhite: 'Weiß',
      camBlack: 'Schwarz',
      camTop: 'Oben',
      camSide: 'Seite',
      camWhiteAria: 'Kamera auf Weiß-Ansicht stellen',
      camBlackAria: 'Kamera auf Schwarz-Ansicht stellen',
      camTopAria: 'Kamera auf Draufsicht stellen',
      camSideAria: 'Kamera auf Seitenansicht stellen',
      hint: 'Hinweis',
      hintAria: 'Besten Zughinweis anzeigen',
      undo: 'Zurück',
      undoAria: 'Letzten Zug rückgängig machen',
      soundOn: 'Ton An',
      soundOff: 'Ton Aus',
      soundToggleAria: 'Holz-Schachgeräusche umschalten',
      turnWhite: 'Weiß am Zug',
      turnBlack: 'Schwarz am Zug',
      aiThinking: 'KI denkt nach…',
      inCheck: 'Schach!',
      checkmateWhiteWins: 'Schachmatt — Weiß gewinnt!',
      checkmateBlackWins: 'Schachmatt — Schwarz gewinnt!',
      stalemate: 'Remis — Patt',
      drawRepetition: 'Remis — Dreifache Wiederholung',
      drawInsufficient: 'Remis — Ungenügendes Material',
      drawGeneral: 'Unentschieden',
      playAgain: 'Nochmal spielen',
      dismissOverlay: 'Brett ansehen',
      promotionTitle: 'Bauernumwandlung',
      promotionSubtitle: 'Wähle die Figur für deinen Bauern:',
      queen: 'Dame',
      rook: 'Turm',
      bishop: 'Läufer',
      knight: 'Springer',
      pawn: 'Bauer',
      king: 'König',
      capturedByWhite: 'Von Weiß geschlagen',
      capturedByBlack: 'Von Schwarz geschlagen',
      movesLabel: 'Züge',
      noMovesYet: 'Klicke eine Figur auf dem 3D-Brett an, um den ersten Zug zu machen.',
      keyboardMoveLabel: 'Tastaturzug',
      keyboardMovePlaceholder: 'z. B. e2e4 oder Nf3',
      keyboardMoveSubmit: 'Ziehen',
      keyboardMoveInvalid: 'Ungültiger Zug. Nutze Notation wie e2e4 oder Nf3.',
      boardControlsTip: 'Ziehen zum Drehen • Scrollen/Pinch zum Zoomen • Klick auf Figur zum Ziehen',
      hintSuggested: 'Empfohlener Zug',
      canvasAriaLabel: 'Interaktives 3D-Schachbrett',
      loading3D: '3D-Schachbrett wird vorbereitet…',
      webglFallbackTitle: '3D-WebGL-Ansicht nicht verfügbar',
      webglFallbackBody: 'WebGL ist in deinem Browser deaktiviert. Aktiviere die Hardwarebeschleunigung, um das 3D-Brett anzuzeigen.',
      fullscreenEnter: 'Vollbild',
      fullscreenExit: 'Vollbild beenden',
      fullscreenToggleAria: 'Vollbildmodus umschalten',
    },
  },

  fr: {
    locale: 'fr',
    siteName: '3DChess',
    ogImageAlt: 'Échiquier 3D en bois interactif avec pièces Staunton sculptées dans le navigateur',
    nav: {
      home: 'Accueil',
      howToPlay: 'Comment Jouer',
      hireMe: 'Me Recruter',
      languageAria: 'Choisir la langue',
      themeToggleAria: 'Basculer entre thème clair et sombre',
      installApp: "Ajouter à l'écran d'accueil",
      installAppAria: "Ajouter 3DChess à l'écran d'accueil pour jouer hors ligne",
      installedLabel: 'App installée',
      supportDev: 'Soutenir le développeur',
      supportDevAria: 'Soutenir le développeur sur Gumroad',
      githubAria: 'Voir le code source sur GitHub',
      skipToContent: 'Aller au contenu principal',
      iosInstallTitle: "Ajouter 3DChess à l'écran d'accueil",
      iosInstallStep1: "Appuyez sur le bouton Partager dans Safari ou la barre d'outils.",
      iosInstallStep2: "Faites défiler et choisissez « Sur l'écran d'accueil ».",
      iosInstallStep3: 'Appuyez sur « Ajouter » pour jouer à 3DChess hors ligne en plein écran.',
      close: 'Fermer',
    },
    breadcrumbs: {
      ariaLabel: "Fil d'Ariane",
      home: 'Accueil',
      howToPlay: 'Comment Jouer',
      hireMe: 'Me Recruter',
    },
    home: {
      title: 'Échecs 3D en Ligne - Jeu Gratuit contre IA et Amis',
      description:
        "Jouez aux échecs 3D en ligne dans votre navigateur contre l'IA ou un ami. Faites pivoter le plateau, obtenez des indices et jouez hors ligne.",
      h1: 'Échecs 3D en Ligne — Jouez Gratuitement contre l’IA ou un Ami',
      heroSubtitle:
        'Faites pivoter un échiquier 3D en bois directement dans votre navigateur. Défiez quatre niveaux d’IA ou jouez en local avec un ami — chargement instantané, hors ligne et sans inscription.',
      faqHeading: 'Questions Fréquentes',
      faqSubheading: 'Tout ce qu’il faut savoir pour jouer à 3DChess dans votre navigateur.',
      faqs: [
        {
          question: "Puis-je jouer aux échecs 3D contre l'ordinateur ou un ami sans créer de compte ?",
          answer:
            "Oui. 3DChess démarre prêt à jouer sans inscription ni téléchargement. Affrontez l'IA sur quatre niveaux (Facile, Moyen, Difficile, Expert) avec les Blancs ou les Noirs, ou passez en mode 2 Joueurs local sur le même écran.",
        },
        {
          question: '3DChess fonctionne-t-il hors ligne sur mobile et ordinateur ?',
          answer:
            "Oui. Les pièces 3D, les règles d'échecs et le moteur d'IA tournent à 100% dans votre navigateur sans serveur. Cliquez sur « Ajouter à l'écran d'accueil » pour l'installer comme application hors ligne sur iOS, Android, Windows ou macOS.",
        },
        {
          question: "Comment faire pivoter, zoomer ou réinitialiser la caméra de l'échiquier 3D ?",
          answer:
            'Cliquez et faites glisser (ou balayez avec un doigt sur écran tactile) pour orbiter autour du plateau. Utilisez la molette ou pincez avec deux doigts pour zoomer, ou choisissez une vue instantanée : Blancs, Noirs, Dessus ou Côté.',
        },
        {
          question: 'Le jeu gère-t-il toutes les règles comme le roque, la prise en passant et la promotion ?',
          answer:
            'Oui. Chaque coup respecte les règles officielles FIDE : petit et grand roque, prise en passant, promotion de pion avec choix de pièce, échec, échec et mat, pat, triple répétition et matériel insuffisant.',
        },
      ],
    },
    howToPlay: {
      title: 'Comment Jouer aux Échecs 3D - Règles & Contrôles | 3DChess',
      description:
        "Apprenez à jouer aux échecs 3D dans votre navigateur. Maîtrisez la caméra orbitale, les coups légaux, le roque, les niveaux d'IA et le mode 2 joueurs.",
      h1: 'Comment Jouer aux Échecs 3D — Caméra, Modes & Règles',
      intro:
        '3DChess allie des pièces Staunton classiques à une caméra WebGL fluide et une validation complète des règles FIDE. Découvrez comment maîtriser le jeu.',
      startPlayingCta: 'Jouer à 3DChess',
      sections: [
        {
          title: '1. Contrôles de Caméra et du Plateau 3D',
          description: 'Examinez chaque diagonale et menace tactique sous tous les angles.',
          items: [
            {
              label: 'Orbiter et Pivoter',
              detail: 'Cliquez et glissez avec la souris — ou glissez un doigt sur mobile — pour tourner librement autour du plateau.',
            },
            {
              label: 'Zoomer et Dézoomer',
              detail: 'Utilisez la molette ou le pincement à deux doigts pour ajuster le cadrage avec précision.',
            },
            {
              label: 'Vues Rapides',
              detail: 'Basculez en un clic ou via les touches 1 à 4 entre les vues Blancs, Noirs, Vue de Dessus et Profil.',
            },
            {
              label: 'Déplacer les Pièces',
              detail: 'Cliquez sur une pièce pour afficher les cases légales et les captures, puis cliquez sur la cible. La saisie au clavier (ex. e2e4 ou Nf3) est également prise en charge.',
            },
          ],
        },
        {
          title: "2. Modes de Jeu et Niveaux d'IA",
          description: "Entraînez-vous seul contre l'IA ou partagez une partie conviviale à deux.",
          items: [
            {
              label: "Contre l'IA (4 Niveaux)",
              detail: "Choisissez Facile pour débuter, Moyen pour un défi équilibré, Difficile pour aiguiser votre tactique ou Expert pour une recherche Alpha-Beta rapide dans un Web Worker à 60fps.",
            },
            {
              label: 'Blancs ou Noirs',
              detail: 'Jouez les Blancs pour lancer l’attaque ou les Noirs pour contre-attaquer — la caméra s’oriente automatiquement.',
            },
            {
              label: '2 Joueurs Local',
              detail: 'Passez en mode 2 Joueurs pour alterner sur le même appareil avec la vue de dessus ou le basculement rapide de caméra.',
            },
            {
              label: 'Indices, Annuler et Son',
              detail: 'Demandez un indice dans une position tendue, annulez un coup pour explorer une variante et activez ou coupez les sons boisés.',
            },
          ],
        },
        {
          title: '3. Règles Officielles et Coups Spéciaux',
          description: 'Toutes les règles officielles FIDE sont vérifiées automatiquement.',
          items: [
            {
              label: 'Petit et Grand Roque',
              detail: 'Lorsque le Roi et la Tour n’ont pas bougé et que le chemin est libre et sûr, cliquez sur le Roi puis deux cases vers la Tour.',
            },
            {
              label: 'Prise en Passant',
              detail: 'Si un pion adverse avance de deux cases à côté du vôtre sur la 5e rangée, la case diagonale de capture s’illumine au tour suivant.',
            },
            {
              label: 'Promotion du Pion',
              detail: 'En atteignant la dernière rangée, choisissez Dame, Tour, Fou ou Cavalier via la fenêtre dédiée.',
            },
            {
              label: 'Échec, Mat et Nulles',
              detail: 'Un halo cramoisi signale un Roi en échec. Échec et mat, pat, triple répétition et matériel insuffisant sont annoncés automatiquement.',
            },
          ],
        },
      ],
    },
    hireMe: {
      title: 'Engager Kishara Dilshan - Dev Astro, React & 3D | 3DChess',
      description:
        "Besoin d'une app web rapide en Astro, React ou Next.js ou d'un outil WebAssembly ? Engagez Kishara Dilshan pour des solutions IT prêtes pour le SEO.",
      badge: 'Disponible pour Projets Freelance',
      heading: "Besoin d'une Solution IT sur Mesure ?",
      intro: 'Bonjour, je suis Kishara Dilshan, le développeur derrière 3DChess.',
      subcopy:
        'Si vous appréciez cet outil rapide côté client et recherchez une solution IT d’excellence pour votre entreprise, je suis disponible en freelance. Mes spécialités :',
      specialties: [
        {
          title: 'Applications web ultra-rapides et optimisées SEO',
          description:
            'Astro, React, Next.js — conçues pour des chargements instantanés, un SEO technique solide et une architecture évolutive.',
        },
        {
          title: 'Traitement côté client & outils WebAssembly (WASM)',
          description:
            'Utilitaires média, PDF et données sans serveur exécutés en toute confidentialité dans le navigateur.',
        },
        {
          title: 'Design UI/UX & pages de destination à forte conversion',
          description:
            'Interfaces minimalistes et accessibles pensées pour convertir vos visiteurs sur ordinateur et mobile.',
        },
      ],
      ctaHeading: 'Construisons quelque chose d’exceptionnel ensemble.',
      email: 'kisharadilshan007@gmail.com',
      emailLabel: 'Écrivez-moi directement : kisharadilshan007@gmail.com',
      copyButtonLabel: "Copier l'e-mail",
      copiedLabel: 'Copié !',
      playChessCta: "Retour à l'échiquier 3D",
    },
    footer: {
      tagline: 'Échecs 3D WebGL 100% navigateur. Chargement instantané, hors ligne et gratuit.',
      builtBy: 'Créé par Kishara Dilshan',
      supportLink: 'Soutenir le développeur',
      openSource: 'Open Source MIT sur GitHub',
    },
    game: {
      newGame: 'Nouvelle Partie',
      modeLabel: 'Mode',
      modeAi: 'vs IA',
      modeLocal: '2 Joueurs Local',
      playAsLabel: 'Jouer avec',
      white: 'Blancs',
      black: 'Noirs',
      difficultyLabel: 'Niveau IA',
      diffEasy: 'Facile',
      diffMedium: 'Moyen',
      diffHard: 'Difficile',
      diffExpert: 'Expert',
      cameraLabel: 'Caméra',
      camWhite: 'Blancs',
      camBlack: 'Noirs',
      camTop: 'Dessus',
      camSide: 'Côté',
      camWhiteAria: 'Passer la caméra côté Blancs',
      camBlackAria: 'Passer la caméra côté Noirs',
      camTopAria: 'Passer la caméra en vue de dessus',
      camSideAria: 'Passer la caméra en vue de côté',
      hint: 'Indice',
      hintAria: 'Afficher un indice de meilleur coup',
      undo: 'Annuler',
      undoAria: 'Annuler le dernier coup',
      soundOn: 'Son Activé',
      soundOff: 'Son Coupé',
      soundToggleAria: 'Activer ou couper les effets sonores en bois',
      turnWhite: 'Trait aux Blancs',
      turnBlack: 'Trait aux Noirs',
      aiThinking: 'L’IA réfléchit…',
      inCheck: 'Échec !',
      checkmateWhiteWins: 'Échec et mat — Les Blancs gagnent !',
      checkmateBlackWins: 'Échec et mat — Les Noirs gagnent !',
      stalemate: 'Nulle — Pat',
      drawRepetition: 'Nulle — Triple répétition',
      drawInsufficient: 'Nulle — Matériel insuffisant',
      drawGeneral: 'Partie nulle',
      playAgain: 'Rejouer',
      dismissOverlay: 'Voir le Plateau',
      promotionTitle: 'Promotion du Pion',
      promotionSubtitle: 'Choisissez la pièce pour remplacer votre pion :',
      queen: 'Dame',
      rook: 'Tour',
      bishop: 'Fou',
      knight: 'Cavalier',
      pawn: 'Pion',
      king: 'Roi',
      capturedByWhite: 'Captures des Blancs',
      capturedByBlack: 'Captures des Noirs',
      movesLabel: 'Coups',
      noMovesYet: 'Cliquez sur une pièce du plateau 3D pour jouer le premier coup.',
      keyboardMoveLabel: 'Coup au clavier',
      keyboardMovePlaceholder: 'ex. e2e4 ou Nf3',
      keyboardMoveSubmit: 'Jouer',
      keyboardMoveInvalid: 'Coup invalide. Essayez une notation comme e2e4 ou Nf3.',
      boardControlsTip: 'Glissez pour pivoter • Molette/pincement pour zoomer • Cliquez une pièce pour jouer',
      hintSuggested: 'Coup conseillé',
      canvasAriaLabel: 'Échiquier 3D interactif',
      loading3D: 'Préparation de l’échiquier 3D…',
      webglFallbackTitle: 'Vue 3D WebGL indisponible',
      webglFallbackBody: 'WebGL est désactivé sur votre navigateur. Activez l’accélération matérielle pour afficher l’échiquier 3D.',
      fullscreenEnter: 'Plein Écran',
      fullscreenExit: 'Quitter le Plein Écran',
      fullscreenToggleAria: 'Activer ou quitter le mode plein écran',
    },
  },

  ja: {
    locale: 'ja',
    siteName: '3DChess',
    ogImageAlt: 'ブラウザで遊べる木製3Dチェス盤とスタントン駒のインタラクティブ画面',
    nav: {
      home: 'ホーム',
      howToPlay: '遊び方',
      hireMe: '開発依頼',
      languageAria: '言語を選択',
      themeToggleAria: 'ライトテーマとダークテーマを切り替え',
      installApp: 'ホーム画面に追加',
      installAppAria: '3DChessをホーム画面に追加してオフラインで遊ぶ',
      installedLabel: '追加済み',
      supportDev: '開発者を応援',
      supportDevAria: 'Gumroadで開発者を応援する',
      githubAria: 'GitHubでソースコードを見る',
      skipToContent: 'メインコンテンツへ移動',
      iosInstallTitle: '3DChessをホーム画面に追加',
      iosInstallStep1: 'Safariまたはブラウザの共有ボタンをタップします。',
      iosInstallStep2: '下にスクロールして「ホーム画面に追加」を選びます。',
      iosInstallStep3: '「追加」をタップすると、いつでもオフライン・全画面で遊べます。',
      close: '閉じる',
    },
    breadcrumbs: {
      ariaLabel: 'パンくずリスト',
      home: 'ホーム',
      howToPlay: '遊び方',
      hireMe: '開発依頼',
    },
    home: {
      title: '3Dチェスオンライン - AIや友達と無料で遊べるブラウザ3Dチェスゲーム',
      description:
        'ブラウザで遊べる無料3Dチェス。AI対局やローカル2人対戦に対応し、自由なカメラ回転、ヒント機能、オフラインプレイまで登録不要で楽しめます。',
      h1: '3Dチェスオンライン — AIや友達と無料で対戦',
      heroSubtitle:
        '木製の3Dチェス盤をブラウザ上で自在に回転。4段階のAI対局とローカル2人対戦に対応し、登録不要ですぐ遊べてオフラインでも快適に動作します。',
      faqHeading: 'よくある質問',
      faqSubheading: 'ブラウザで3DChessを楽しむためのポイントをご紹介します。',
      faqs: [
        {
          question: 'アカウント登録なしでAIや友達と3Dチェスを遊べますか？',
          answer:
            'はい。ログインやダウンロードは不要で、ページを開いてすぐ対局できます。4段階のAI（初級・中級・上級・エキスパート）と白黒どちらでも対戦でき、ローカル2人対戦にもすぐ切り替えられます。',
        },
        {
          question: 'スマホやPCでオフラインプレイは可能ですか？',
          answer:
            'はい。3Dの駒モデル、ルール判定、AI思考エンジンまですべてブラウザ内で完結しています。「ホーム画面に追加」からインストールすれば、iOS・Android・PCで完全オフライン対局ができます。',
        },
        {
          question: '3Dチェス盤のカメラ回転・ズーム・視点リセットの方法は？',
          answer:
            '盤面をドラッグ（スマホでは1本指でスワイプ）すると自由にカメラを回転できます。マウスホイールや2本指ピンチでズームでき、白視点・黒視点・真上・サイドのプリセットもワンタップで切り替え可能です。',
        },
        {
          question: 'キャスリング、アンパッサン、昇格などの公式ルールに対応していますか？',
          answer:
            'はい。キング側・クイーン側のキャスリング、アンパッサン、ポーンの昇格選択、チェック・チェックメイト・ステイルメイト・千日手・戦力不足引き分けまでFIDE公式ルールに完全対応しています。',
        },
      ],
    },
    howToPlay: {
      title: '3Dチェスの遊び方 - カメラ操作・ルール・対戦モード解説 | 3DChess',
      description:
        'ブラウザ版3Dチェスの遊び方をわかりやすく解説。カメラの回転・ズーム操作、合法手ハイライト、キャスリング、4段階AI、2人対戦のコツを紹介します。',
      h1: '3Dチェスの遊び方 — カメラ操作・モード・ルール',
      intro:
        '3DChessは伝統的なスタントン駒の造形と滑らかなWebGL視点操作、完全なFIDEルール判定を組み合わせたブラウザチェスです。基本操作と機能をご紹介します。',
      startPlayingCta: '3Dチェスをプレイする',
      sections: [
        {
          title: '1. 3Dカメラと盤面の操作',
          description: 'あらゆる角度から盤面を見渡し、斜めの利きや戦術を正確に把握できます。',
          items: [
            {
              label: '視点の回転（オービット）',
              detail: 'マウスドラッグ、またはスマホの1本指スワイプで盤面の周囲を滑らかに回転できます。',
            },
            {
              label: 'ズームイン・ズームアウト',
              detail: 'マウスホイールや2本指ピンチ操作で、盤面に近づいたり全体を見渡したりできます。',
            },
            {
              label: 'ワンタップ視点プリセット',
              detail: '白視点・黒視点・真上（読みやすい2D感覚）・サイド視点をボタンまたは数字キー1〜4で瞬時に切り替えられます。',
            },
            {
              label: '駒の選択と移動',
              detail: '自分の駒をクリックすると移動可能なマスと取れる駒が光ります。移動先を選ぶと駒が滑らかに動きます。キーボード入力（例：e2e4、Nf3）にも対応しています。',
            },
          ],
        },
        {
          title: '2. 対戦モードと4段階AI',
          description: '1人での実力アップから、友達との対局まで柔軟に楽しめます。',
          items: [
            {
              label: 'AI対局（4レベル）',
              detail: '初級・中級・上級・エキスパートの4段階を用意。AI思考はWeb Workerで並列処理されるため、3D描画は常に60fpsで快適です。',
            },
            {
              label: '白番・黒番の選択',
              detail: '先手の白番でも後手の黒番でも対局でき、カメラは自動的に自分の側に切り替わります。',
            },
            {
              label: 'ローカル2人対戦',
              detail: '同じ画面を共有して2人で交互に指せます。真上視点や視点切替ボタンを使えば対面対局も快適です。',
            },
            {
              label: 'ヒント・待った・木製サウンド',
              detail: '迷ったときはヒントで好手を表示でき、待った（Undo）で別の変化を試したり、落ち着いた木駒の効果音をオン／オフできます。',
            },
          ],
        },
        {
          title: '3. FIDE公式ルールと特殊手',
          description: 'チェスの公式ルールはすべて自動で正確に判定されます。',
          items: [
            {
              label: 'キャスリング',
              detail: 'キングとルークが未移動で間が空いており安全なら、キングを選んでルーク方向に2マス先をクリックするだけで両方同時に動きます。',
            },
            {
              label: 'アンパッサン',
              detail: '相手のポーンが2マス進み自分のポーンの横に並んだ直後の手番では、斜め後ろの捕獲マスが自動でハイライトされます。',
            },
            {
              label: 'ポーンの昇格（プロモーション）',
              detail: '最終段に到達すると昇格メニューが開き、クイーン・ルーク・ビショップ・ナイトから選べます。',
            },
            {
              label: 'チェック・メイト・引き分け',
              detail: '王手がかかったキングには赤い光が表示されます。チェックメイト、ステイルメイト、同一局面3回、駒不足引き分けも自動判定されます。',
            },
          ],
        },
      ],
    },
    hireMe: {
      title: 'Kishara Dilshanへ開発依頼 - Astro・React・3D Web制作 | 3DChess',
      description:
        '高速なAstro・React・Next.jsアプリやブラウザ完結型WebAssemblyツールの開発が必要ですか？SEO対応のカスタムIT開発を承ります。',
      badge: 'フリーランス案件のご相談受付中',
      heading: 'カスタムITソリューションが必要ですか？',
      intro: 'こんにちは、3DChessを開発した Kishara Dilshan です。',
      subcopy:
        'この高速なクライアントサイド製ツールを気に入っていただき、ビジネス向けの本格的なITソリューションが必要でしたら、フリーランスとしてご相談を承っています。専門分野：',
      specialties: [
        {
          title: '超高速・SEO最適化Webアプリケーション',
          description:
            'Astro、React、Next.jsを用い、1秒未満の高速表示、テクニカルSEO、クリーンな拡張性を実現します。',
        },
        {
          title: 'クライアントサイド処理 & WebAssembly (WASM) ツール',
          description:
            'サーバー不要でブラウザ内にてプライベートに動作するメディア・PDF・データ処理ツールを開発します。',
        },
        {
          title: 'UI/UXデザイン & 高コンバージョンLP制作',
          description:
            'PC・モバイル問わず直感的でアクセシブルなミニマル設計により、高い成果につなげます。',
        },
      ],
      ctaHeading: '素晴らしいプロダクトを一緒に創りましょう。',
      email: 'kisharadilshan007@gmail.com',
      emailLabel: '直接メールでご連絡ください: kisharadilshan007@gmail.com',
      copyButtonLabel: 'メールをコピー',
      copiedLabel: 'コピーしました！',
      playChessCta: '3Dチェス盤に戻る',
    },
    footer: {
      tagline: '100%ブラウザ完結のWebGL 3Dチェス。高速起動・オフライン対応・完全無料。',
      builtBy: '開発: Kishara Dilshan',
      supportLink: '開発者を応援',
      openSource: 'GitHubでMITオープンソース公開中',
    },
    game: {
      newGame: '新規対局',
      modeLabel: 'モード',
      modeAi: 'vs AI',
      modeLocal: 'ローカル2人対戦',
      playAsLabel: '手番側',
      white: '白',
      black: '黒',
      difficultyLabel: 'AI強さ',
      diffEasy: '初級',
      diffMedium: '中級',
      diffHard: '上級',
      diffExpert: 'エキスパート',
      cameraLabel: '視点',
      camWhite: '白視点',
      camBlack: '黒視点',
      camTop: '真上',
      camSide: 'サイド',
      camWhiteAria: 'カメラを白側視点に切り替え',
      camBlackAria: 'カメラを黒側視点に切り替え',
      camTopAria: 'カメラを真上視点に切り替え',
      camSideAria: 'カメラをサイド視点に切り替え',
      hint: 'ヒント',
      hintAria: 'おすすめの手をヒント表示',
      undo: '待った',
      undoAria: '一手戻す',
      soundOn: '効果音オン',
      soundOff: 'ミュート',
      soundToggleAria: '木製チェス効果音を切り替え',
      turnWhite: '白の番',
      turnBlack: '黒の番',
      aiThinking: 'AI思考中…',
      inCheck: 'チェック！',
      checkmateWhiteWins: 'チェックメイト — 白の勝ち！',
      checkmateBlackWins: 'チェックメイト — 黒の勝ち！',
      stalemate: '引き分け — ステイルメイト',
      drawRepetition: '引き分け — 同一局面3回',
      drawInsufficient: '引き分け — 戦力不足',
      drawGeneral: '引き分け',
      playAgain: 'もう一度遊ぶ',
      dismissOverlay: '盤面を見る',
      promotionTitle: 'ポーンの昇格',
      promotionSubtitle: '昇格させる駒を選んでください：',
      queen: 'クイーン',
      rook: 'ルーク',
      bishop: 'ビショップ',
      knight: 'ナイト',
      pawn: 'ポーン',
      king: 'キング',
      capturedByWhite: '白が取った駒',
      capturedByBlack: '黒が取った駒',
      movesLabel: '棋譜',
      noMovesYet: '3D盤面の駒をクリックして初手を指してください。',
      keyboardMoveLabel: 'キーボード入力',
      keyboardMovePlaceholder: '例: e2e4 または Nf3',
      keyboardMoveSubmit: '指す',
      keyboardMoveInvalid: '不正な手です。e2e4 や Nf3 のように入力してください。',
      boardControlsTip: 'ドラッグで回転 • スクロール/ピンチでズーム • 駒をクリックして移動',
      hintSuggested: '推奨手',
      canvasAriaLabel: 'インタラクティブ3Dチェス盤',
      loading3D: '3Dチェス盤を準備中…',
      webglFallbackTitle: '3D WebGL表示を利用できません',
      webglFallbackBody: 'ブラウザでWebGLが無効になっています。ハードウェアアクセラレーションを有効にしてください。',
      fullscreenEnter: '全画面',
      fullscreenExit: '全画面を終了',
      fullscreenToggleAria: '全画面モードを切り替え',
    },
  },

  zh: {
    locale: 'zh',
    siteName: '3DChess',
    ogImageAlt: '浏览器中可自由旋转的木质3D国际象棋棋盘与斯汤顿立体棋子',
    nav: {
      home: '首页',
      howToPlay: '玩法指南',
      hireMe: '雇佣合作',
      languageAria: '选择语言',
      themeToggleAria: '切换浅色与深色主题',
      installApp: '添加到主屏幕',
      installAppAria: '将3DChess添加到主屏幕以支持离线畅玩',
      installedLabel: '已安装应用',
      supportDev: '支持开发者',
      supportDevAria: '在 Gumroad 支持开发者',
      githubAria: '在 GitHub 查看源代码',
      skipToContent: '跳至主要内容',
      iosInstallTitle: '将 3DChess 添加到主屏幕',
      iosInstallStep1: '点击 Safari 或浏览器工具栏中的“分享”按钮。',
      iosInstallStep2: '向下滚动并选择“添加到主屏幕”。',
      iosInstallStep3: '点击“添加”，即可随时全屏离线畅玩 3DChess。',
      close: '关闭',
    },
    breadcrumbs: {
      ariaLabel: '面包屑导航',
      home: '首页',
      howToPlay: '玩法指南',
      hireMe: '雇佣合作',
    },
    home: {
      title: '在线3D国际象棋 - 免费浏览器人机AI与双人3D象棋游戏 | 3DChess',
      description:
        '在浏览器中免费畅玩3D国际象棋，支持4档智能AI对战与本地双人同屏模式。自由旋转视角、获取走法提示，并支持离线畅玩，无需注册。',
      h1: '在线3D国际象棋 — 免费挑战AI或与好友对弈',
      heroSubtitle:
        '在浏览器中自由旋转极具质感的木质3D棋盘。挑战4档智能AI或与朋友本地双人对弈——瞬间加载、支持离线畅玩，无需注册账号。',
      faqHeading: '常见问题',
      faqSubheading: '快速了解如何在浏览器中畅玩 3DChess。',
      faqs: [
        {
          question: '无需注册账号就能和电脑AI或朋友下3D国际象棋吗？',
          answer:
            '完全可以。3DChess 打开即玩，无需注册、登录或下载客户端。你可以执白或执黑挑战4档难度AI（简单、中等、困难、专家），或切换至“双人同屏”模式与身边的朋友对弈。',
        },
        {
          question: '3DChess 在手机和电脑上支持离线游玩吗？',
          answer:
            '支持。所有3D立体棋子、国际象棋规则校验以及AI计算均100%在本地浏览器完成。点击“添加到主屏幕”即可在 iOS、Android、Windows 或 macOS 上离线畅玩。',
        },
        {
          question: '如何旋转、缩放或重置3D棋盘视角？',
          answer:
            '按住鼠标拖动（触屏设备单指滑动）即可围绕棋盘自由旋转视角；滚动鼠标滚轮或双指捏合可缩放远近；也可一键切换白方视角、黑方视角、俯视视角和侧面视角。',
        },
        {
          question: '游戏支持王车易位、吃过路兵和兵底线升变等完整规则吗？',
          answer:
            '完全支持。每一步棋均严格遵循 FIDE 国际象棋完整规则，涵盖短易位与长易位、吃过路兵、兵升变选棋弹窗、将军提示、将杀、逼和、三次重复局面以及子力不足和棋。',
        },
      ],
    },
    howToPlay: {
      title: '3D国际象棋玩法指南 - 视角控制、模式与规则详解 | 3DChess',
      description:
        '全面掌握在线3D国际象棋玩法：学习3D镜头旋转与缩放、合法落子高亮、王车易位、吃过路兵、AI难度选择以及本地双人模式操作。',
      h1: '3D国际象棋玩法指南 — 镜头控制、模式与规则',
      intro:
        '3DChess 将经典斯汤顿木质棋子工艺、流畅的 WebGL 镜头操控与严谨的 FIDE 规则融为一体。通过本指南轻松掌握各项操作。',
      startPlayingCta: '立即开始对弈',
      sections: [
        {
          title: '1. 3D 镜头与棋盘操作',
          description: '从任意角度审视斜线进攻与战术组合，全局一目了然。',
          items: [
            {
              label: '自由旋转视角',
              detail: '用鼠标按住拖拽，或在手机上单指滑动，即可平滑环绕3D棋盘观察局势。',
            },
            {
              label: '镜头缩放',
              detail: '使用鼠标滚轮或双指缩放手势拉近特写或拉远纵览全局。',
            },
            {
              label: '一键切换预设视角',
              detail: '点击视角按钮或按键盘数字键 1–4，即可在白方、黑方、俯视（适合快速计算）与侧面视角间顺滑切换。',
            },
            {
              label: '选子与落子',
              detail: '点击己方棋子即可高亮显示所有合法落点与可吃子格，点击目标格棋子便会优雅滑落。还支持在键盘输入栏直接输入 e2e4 或 Nf3 走棋。',
            },
          ],
        },
        {
          title: '2. 游戏模式与 AI 难度',
          description: '无论是单人精进棋艺，还是好友线下切磋，皆可轻松应对。',
          items: [
            {
              label: '人机对战（4档难度）',
              detail: '提供简单、中等、困难和专家4个等级。AI 搜索在独立 Web Worker 后台运行，确保 3D 渲染始终稳定在 60fps。',
            },
            {
              label: '自由选择执白或执黑',
              detail: '执白抢占先手或执黑稳健反击，棋盘视角会自动对准你的阵营。',
            },
            {
              label: '本地双人同屏模式',
              detail: '切换双人模式即可在同一设备轮流落子，搭配俯视视角或快捷换边按钮，体验如实体棋盘般自然。',
            },
            {
              label: '走法提示、悔棋与木质音效',
              detail: '遇到复杂局面可点击“提示”高亮推荐着法，随时“悔棋”复盘不同变化，并可自由开关清脆的木质落子音效。',
            },
          ],
        },
        {
          title: '3. 完整国际象棋规则与特殊着法',
          description: '系统自动校验所有官方国际象棋规则，让你专注于策略本身。',
          items: [
            {
              label: '王车易位（短易位与长易位）',
              detail: '当王和车均未移动且中间无子阻挡、路径不受攻击时，选中王并点击向车方向移动两格的位置，王与车将同步完成易位动画。',
            },
            {
              label: '吃过路兵',
              detail: '若对手的兵首次前进两格并停在你的兵身旁，紧接着的下一回合系统会立即高亮斜后方的吃过路兵格位。',
            },
            {
              label: '兵的升变',
              detail: '兵抵达对方底线时会自动弹出升变选择器，可自由升变为后、车、象或马。',
            },
            {
              label: '将军、将杀与和棋判定',
              detail: '被将军的王脚下会亮起醒目的绯红光环；将杀、逼和、三次重复局面与子力不足和棋均会自动识别并播报。',
            },
          ],
        },
      ],
    },
    hireMe: {
      title: '雇佣 Kishara Dilshan - Astro、React 与 3D Web 开发 | 3DChess',
      description:
        '需要超快的 Astro、React、Next.js 网站应用或纯前端 WebAssembly 工具？联系 Kishara Dilshan 定制高转化且 SEO 友好的 IT 解决方案。',
      badge: '开放自由职业项目合作',
      heading: '需要定制化 IT 解决方案？',
      intro: '你好，我是 Kishara Dilshan，3DChess 的开发者。',
      subcopy:
        '如果你喜欢这款极速的纯客户端工具，并希望为自己的业务打造一流的 IT 解决方案，欢迎与我展开自由职业项目合作。我专注于：',
      specialties: [
        {
          title: '超高速、深度 SEO 优化的 Web 应用',
          description:
            '精通 Astro、React、Next.js —— 专为亚秒级加载、技术 SEO 与优雅的可扩展架构而打造。',
        },
        {
          title: '浏览器端处理与 WebAssembly (WASM) 工具',
          description:
            '无需后端服务器的音视频、PDF 与数据处理工具，完全在用户浏览器内私密运行。',
        },
        {
          title: 'UI/UX 设计与高转化着陆页',
          description:
            '极简且注重无障碍体验的界面设计，在桌面端与移动端皆能轻松提升访客转化率。',
        },
      ],
      ctaHeading: '让我们一起打造令人惊艳的作品。',
      email: 'kisharadilshan007@gmail.com',
      emailLabel: '直接发送邮件：kisharadilshan007@gmail.com',
      copyButtonLabel: '复制邮箱',
      copiedLabel: '已复制！',
      playChessCta: '返回 3D 棋盘',
    },
    footer: {
      tagline: '100% 浏览器端 WebGL 3D 国际象棋。极速启动、离线畅玩、永久免费。',
      builtBy: '由 Kishara Dilshan 匠心打造',
      supportLink: '支持开发者',
      openSource: 'GitHub MIT 开源项目',
    },
    game: {
      newGame: '新对局',
      modeLabel: '模式',
      modeAi: '人机 AI',
      modeLocal: '本地双人',
      playAsLabel: '执子',
      white: '白方',
      black: '黑方',
      difficultyLabel: 'AI 难度',
      diffEasy: '简单',
      diffMedium: '中等',
      diffHard: '困难',
      diffExpert: '专家',
      cameraLabel: '视角',
      camWhite: '白方',
      camBlack: '黑方',
      camTop: '俯视',
      camSide: '侧面',
      camWhiteAria: '切换至白方视角',
      camBlackAria: '切换至黑方视角',
      camTopAria: '切换至顶视俯瞰视角',
      camSideAria: '切换至侧面观赏视角',
      hint: '提示',
      hintAria: '显示最佳走法提示',
      undo: '悔棋',
      undoAria: '撤销上一步棋',
      soundOn: '音效开',
      soundOff: '静音',
      soundToggleAria: '切换木质落子音效',
      turnWhite: '轮到白方行棋',
      turnBlack: '轮到黑方行棋',
      aiThinking: 'AI 思考中…',
      inCheck: '将军！',
      checkmateWhiteWins: '将杀 — 白方获胜！',
      checkmateBlackWins: '将杀 — 黑方获胜！',
      stalemate: '和棋 — 逼和',
      drawRepetition: '和棋 — 三次重复局面',
      drawInsufficient: '和棋 — 子力不足',
      drawGeneral: '双方和棋',
      playAgain: '再来一局',
      dismissOverlay: '查看棋盘',
      promotionTitle: '兵的升变',
      promotionSubtitle: '请选择要升变成的棋子：',
      queen: '后',
      rook: '车',
      bishop: '象',
      knight: '马',
      pawn: '兵',
      king: '王',
      capturedByWhite: '白方吃子',
      capturedByBlack: '黑方吃子',
      movesLabel: '着法记录',
      noMovesYet: '点击3D棋盘上的棋子走出第一步。',
      keyboardMoveLabel: '键盘走棋',
      keyboardMovePlaceholder: '例如 e2e4 或 Nf3',
      keyboardMoveSubmit: '落子',
      keyboardMoveInvalid: '无效着法，请输入如 e2e4 或 Nf3 的记谱。',
      boardControlsTip: '拖拽旋转视角 • 滚轮/双指缩放 • 点击棋子落子',
      hintSuggested: '推荐走法',
      canvasAriaLabel: '交互式3D国际象棋棋盘',
      loading3D: '正在加载3D棋盘…',
      webglFallbackTitle: '无法启用 3D WebGL 视图',
      webglFallbackBody: '当前浏览器已禁用 WebGL，请开启硬件加速以浏览3D棋盘。',
      fullscreenEnter: '全屏模式',
      fullscreenExit: '退出全屏',
      fullscreenToggleAria: '切换全屏棋盘模式',
    },
  },

  ru: {
    locale: 'ru',
    siteName: '3DChess',
    ogImageAlt: 'Интерактивная деревянная 3D шахматная доска с фигурами Стаунтон в браузере',
    nav: {
      home: 'Главная',
      howToPlay: 'Как играть',
      hireMe: 'Нанять меня',
      languageAria: 'Выбрать язык',
      themeToggleAria: 'Переключить светлую и тёмную тему',
      installApp: 'На главный экран',
      installAppAria: 'Добавить 3DChess на главный экран для игры офлайн',
      installedLabel: 'Установлено',
      supportDev: 'Поддержать автора',
      supportDevAria: 'Поддержать разработчика на Gumroad',
      githubAria: 'Открыть исходный код на GitHub',
      skipToContent: 'Перейти к основному содержимому',
      iosInstallTitle: 'Добавить 3DChess на экран «Домой»',
      iosInstallStep1: 'Нажмите кнопку «Поделиться» в Safari или панели браузера.',
      iosInstallStep2: 'Прокрутите вниз и выберите «На экран «Домой»».',
      iosInstallStep3: 'Нажмите «Добавить», чтобы запускать 3DChess офлайн на весь экран.',
      close: 'Закрыть',
    },
    breadcrumbs: {
      ariaLabel: 'Навигационная цепочка',
      home: 'Главная',
      howToPlay: 'Как играть',
      hireMe: 'Нанять меня',
    },
    home: {
      title: '3D Шахматы Онлайн - Бесплатно с ИИ и Другом в Браузере',
      description:
        'Играйте в 3D шахматы онлайн в браузере против ИИ или с другом на одном экране. Вращайте доску, берите подсказки и играйте офлайн без регистрации.',
      h1: '3D Шахматы Онлайн — Играйте Бесплатно с ИИ или Другом',
      heroSubtitle:
        'Вращайте деревянную 3D шахматную доску прямо в браузере. Испытайте четыре уровня ИИ или сыграйте вдвоём локально — мгновенный запуск, работа офлайн и без регистрации.',
      faqHeading: 'Часто задаваемые вопросы',
      faqSubheading: 'Всё, что нужно знать об игре в 3DChess в вашем браузере.',
      faqs: [
        {
          question: 'Можно ли играть в 3D шахматы против компьютера или друга без аккаунта?',
          answer:
            'Да. 3DChess открывается сразу готовым к партии без регистрации и скачивания. Сразитесь с ИИ на четырёх уровнях сложности (Лёгкий, Средний, Сложный, Эксперт) белыми или чёрными либо переключитесь на локальный режим для двоих.',
        },
        {
          question: 'Работает ли 3DChess офлайн на телефоне и компьютере?',
          answer:
            'Да. Все 3D-фигуры, правила шахмат и вычисления ИИ выполняются на 100% в браузере без сервера. Нажмите «На главный экран», чтобы установить игру как лёгкое офлайн-приложение на iOS, Android, Windows или macOS.',
        },
        {
          question: 'Как вращать, приближать и сбрасывать камеру 3D-доски?',
          answer:
            'Зажмите и перетащите мышью (или проведите одним пальцем на экране), чтобы облететь доску со всех сторон. Приближайте колесом мыши или щипком двумя пальцами и переключайтесь одним нажатием на виды Белых, Чёрных, Сверху и Сбоку.',
        },
        {
          question: 'Поддерживаются ли полные правила: рокировка, взятие на проходе и превращение пешки?',
          answer:
            'Да. Все ходы проверяются по полным правилам ФИДЕ: короткая и длинная рокировка, взятие на проходе, превращение пешки с выбором фигуры, шах, мат, пат, троекратное повторение позиции и недостаточность материала.',
        },
      ],
    },
    howToPlay: {
      title: 'Как Играть в 3D Шахматы - Правила и Управление | 3DChess',
      description:
        'Узнайте, как играть в 3D шахматы в браузере: управление камерой, подсветка ходов, рокировка, 4 уровня сложности ИИ и локальный режим для двоих.',
      h1: 'Как Играть в 3D Шахматы — Камера, Режимы и Правила',
      intro:
        '3DChess сочетает классические деревянные фигуры Стаунтон с плавной WebGL-камерой и строгой проверкой правил ФИДЕ. Ознакомьтесь с управлением и режимами игры.',
      startPlayingCta: 'Начать партию в 3DChess',
      sections: [
        {
          title: '1. Управление 3D-камерой и доской',
          description: 'Оценивайте диагонали и тактические угрозы с любого удобного ракурса.',
          items: [
            {
              label: 'Вращение камеры',
              detail: 'Зажмите кнопку мыши и перетащите (или проведите одним пальцем на смартфоне), чтобы плавно вращать камеру вокруг доски.',
            },
            {
              label: 'Масштабирование',
              detail: 'Используйте колесо мыши или жест сведения/разведения двух пальцев для приближения и отдаления.',
            },
            {
              label: 'Быстрые ракурсы',
              detail: 'Мгновенно переключайтесь между видами Белых, Чёрных, Сверху (удобно для точного расчёта) и Сбоку кнопками или клавишами 1–4.',
            },
            {
              label: 'Выбор и ход фигурами',
              detail: 'Нажмите на свою фигуру, чтобы подсветить допустимые клетки и взятия, затем выберите цель. Также поддерживается ввод ходов с клавиатуры (например, e2e4 или Nf3).',
            },
          ],
        },
        {
          title: '2. Режимы игры и уровни ИИ',
          description: 'Тренируйтесь в одиночку или играйте с другом на одном устройстве.',
          items: [
            {
              label: 'Против ИИ (4 уровня)',
              detail: 'Выбирайте Лёгкий для знакомства, Средний для равной игры, Сложный для тактических задач или Эксперт с глубоким альфа-бета поиском в Web Worker при плавных 60fps.',
            },
            {
              label: 'Выбор цвета',
              detail: 'Начинайте атаку белыми или тренируйте защиту чёрными — камера автоматически развернётся к вашей стороне.',
            },
            {
              label: '2 игрока на одном экране',
              detail: 'Переключитесь в локальный режим для двоих и используйте вид сверху или быстрое переключение стороны.',
            },
            {
              label: 'Подсказки, Отмена и Звук',
              detail: 'Запрашивайте подсказку сильного хода, отменяйте ходы для разбора вариантов и управляйте мягким звуком деревянных фигур.',
            },
          ],
        },
        {
          title: '3. Полные шахматные правила и особые ходы',
          description: 'Все официальные правила ФИДЕ контролируются автоматически.',
          items: [
            {
              label: 'Рокировка (короткая и длинная)',
              detail: 'Если король и ладья не ходили, а поля между ними свободны и не под боем, выберите короля и нажмите на две клетки в сторону ладьи.',
            },
            {
              label: 'Взятие на проходе',
              detail: 'Когда пешка соперника проходит сразу на две клетки мимо вашей пешки на пятой горизонтали, диагональная клетка взятия подсветится на следующем ходу.',
            },
            {
              label: 'Превращение пешки',
              detail: 'Достигнув последней горизонтали, пешка откроет окно выбора новой фигуры: ферзя, ладьи, слона или коня.',
            },
            {
              label: 'Шах, мат и ничья',
              detail: 'Король под шахом подсвечивается алым свечением. Мат, пат, троекратное повторение и недостаточность материала определяются автоматически.',
            },
          ],
        },
      ],
    },
    hireMe: {
      title: 'Нанять Kishara Dilshan - Astro, React и 3D Web | 3DChess',
      description:
        'Нужно быстрое веб-приложение на Astro, React, Next.js или клиентский WebAssembly-инструмент? Наймите Kishara Dilshan для SEO-готовых IT-решений.',
      badge: 'Открыт для фриланс-проектов',
      heading: 'Нужно индивидуальное IT-решение?',
      intro: 'Привет! Я Kishara Dilshan, разработчик 3DChess.',
      subcopy:
        'Если вам понравился этот быстрый браузерный инструмент и вашему бизнесу нужно первоклассное IT-решение, я доступен для фриланс-проектов. Мои специализации:',
      specialties: [
        {
          title: 'Сверхбыстрые веб-приложения с SEO-оптимизацией',
          description:
            'Astro, React, Next.js — созданы для мгновенной загрузки, технического SEO и чистой масштабируемости.',
        },
        {
          title: 'Клиентская обработка и инструменты WebAssembly (WASM)',
          description:
            'Бессерверные утилиты для медиа, PDF и данных, работающие приватно прямо в браузере.',
        },
        {
          title: 'UI/UX-дизайн и высококонверсионные лендинги',
          description:
            'Минималистичные и доступные интерфейсы, эффективно превращающие посетителей в клиентов на ПК и мобильных.',
        },
      ],
      ctaHeading: 'Давайте создадим что-то впечатляющее вместе.',
      email: 'kisharadilshan007@gmail.com',
      emailLabel: 'Напишите мне напрямую: kisharadilshan007@gmail.com',
      copyButtonLabel: 'Скопировать Email',
      copiedLabel: 'Скопировано!',
      playChessCta: 'Вернуться к 3D-доске',
    },
    footer: {
      tagline: '3D-шахматы на WebGL прямо в браузере. Мгновенный запуск, офлайн и бесплатно.',
      builtBy: 'Разработал Kishara Dilshan',
      supportLink: 'Поддержать автора',
      openSource: 'Открытый код MIT на GitHub',
    },
    game: {
      newGame: 'Новая партия',
      modeLabel: 'Режим',
      modeAi: 'против ИИ',
      modeLocal: '2 игрока локально',
      playAsLabel: 'Играть за',
      white: 'Белые',
      black: 'Чёрные',
      difficultyLabel: 'Уровень ИИ',
      diffEasy: 'Лёгкий',
      diffMedium: 'Средний',
      diffHard: 'Сложный',
      diffExpert: 'Эксперт',
      cameraLabel: 'Камера',
      camWhite: 'Белые',
      camBlack: 'Чёрные',
      camTop: 'Сверху',
      camSide: 'Сбоку',
      camWhiteAria: 'Переключить камеру на сторону Белых',
      camBlackAria: 'Переключить камеру на сторону Чёрных',
      camTopAria: 'Переключить камеру на вид сверху',
      camSideAria: 'Переключить камеру на вид сбоку',
      hint: 'Подсказка',
      hintAria: 'Показать подсказку лучшего хода',
      undo: 'Отменить',
      undoAria: 'Отменить последний ход',
      soundOn: 'Звук Вкл',
      soundOff: 'Без звука',
      soundToggleAria: 'Переключить звуки деревянных шахмат',
      turnWhite: 'Ход Белых',
      turnBlack: 'Ход Чёрных',
      aiThinking: 'ИИ думает…',
      inCheck: 'Шах!',
      checkmateWhiteWins: 'Мат — Белые победили!',
      checkmateBlackWins: 'Мат — Чёрные победили!',
      stalemate: 'Ничья — Пат',
      drawRepetition: 'Ничья — Троекратное повторение',
      drawInsufficient: 'Ничья — Недостаточно материала',
      drawGeneral: 'Ничья',
      playAgain: 'Сыграть снова',
      dismissOverlay: 'Смотреть доску',
      promotionTitle: 'Превращение пешки',
      promotionSubtitle: 'Выберите фигуру для замены пешки:',
      queen: 'Ферзь',
      rook: 'Ладья',
      bishop: 'Слон',
      knight: 'Конь',
      pawn: 'Пешка',
      king: 'Король',
      capturedByWhite: 'Взято Белыми',
      capturedByBlack: 'Взято Чёрными',
      movesLabel: 'Ходы',
      noMovesYet: 'Нажмите на фигуру на 3D-доске, чтобы сделать первый ход.',
      keyboardMoveLabel: 'Ход с клавиатуры',
      keyboardMovePlaceholder: 'напр. e2e4 или Nf3',
      keyboardMoveSubmit: 'Ход',
      keyboardMoveInvalid: 'Недопустимый ход. Попробуйте формат e2e4 или Nf3.',
      boardControlsTip: 'Тяните для вращения • Колесо/щипок для зума • Клик по фигуре для хода',
      hintSuggested: 'Рекомендуемый ход',
      canvasAriaLabel: 'Интерактивная 3D шахматная доска',
      loading3D: 'Подготовка 3D-доски…',
      webglFallbackTitle: '3D-вид WebGL недоступен',
      webglFallbackBody: 'В вашем браузере отключён WebGL. Включите аппаратное ускорение для отображения 3D-доски.',
      fullscreenEnter: 'На весь экран',
      fullscreenExit: 'Выйти из полного экрана',
      fullscreenToggleAria: 'Переключить полноэкранный режим',
    },
  },
};

export function getTranslations(locale: LocaleCode): TranslationBundle {
  return TRANSLATIONS[locale] ?? TRANSLATIONS.en;
}
