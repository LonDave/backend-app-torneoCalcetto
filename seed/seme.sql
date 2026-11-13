INSERT INTO squadre (id, nome, quartiere) VALUES
  (1, 'Tigri',   'Porto'),
  (2, 'Aquile',  'Centro'),
  (3, 'Delfini', 'Stazione'),
  (4, 'Lupi',    'Collina');

INSERT INTO giocatori (id, nome, ruolo, numero, squadra_id) VALUES
  (1, 'Andrea Greco',  'attaccante',      9, 1),
  (2, 'Marco Rossi',   'portiere',        1, 1),
  (3, 'Luca Bianchi',  'difensore',       5, 1),
  (4, 'Matteo Ricci',  'portiere',       12, 2),
  (5, 'Stefano Gallo', 'centrocampista',  8, 2),
  (6, 'Davide Costa',  'attaccante',     10, 3);
