// One timeline for the picture and the checks. Silent film: a 120 bpm grid (0.5 s a beat) keeps the hits on a pulse.
export const DUR = 10.0;
export const BEAT = 0.5;
export const T = {
  open: 0.0,      // frame 0 = the thumbnail: the field sharp, title on glass, camera already creeping
  title: 2.4,     // the title panel lifts away
  dive: 2.3,      // the dive begins
  land: 3.5,      // lands (beat 7), focal sweep
  dim: 3.6,       // dimension line on the rod
  arc: 3.65,      // arc round the chain
  med: 5.0,       // a short pull to the counting frame
  circ: 5.25,     // the circle is drawn (beat 10)
  scan: 5.55,     // the scan front starts
  reading: 6.95,   // the reading lands (~beat 14)
  climb: 7.4,     // the climb (beat 15)
  end: 7.85,      // the end title is written on the glass (beat 17)
};
// captions: one line each, never wrapped
export const CAPS = [
  { id: 'c2', t0: 0.6, t1: 4.2, text: 'Rods and beads: lactic acid bacteria.' },
  { id: 'c3', t0: 4.3, t1: 7.35, text: 'They turn milk sugar into acid.' },
  { id: 'c4', t0: 7.45, t1: 10.0, text: 'Acid sets milk protein into a gel.' },
];
