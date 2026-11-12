# Episode 1 review — "Bijli Gayi!"

- **Why it was rewritten:** the earlier Ep 1 ("Sabzi Kaun Banega?", kept in
  `episodes/_old/`) was three vegetables standing on a shelf talking: no goal you could see, no
  escalation, no physical comedy, and an ending Mummy solved for them.
- **This one:** a want (survive a scary night), an escalating threat (dark → story → eyes in the
  drawer → eyes right next to you), physical gags (bhoot scare, hiding behind skinny Bhindi,
  fainting, the flying torch, the sneeze), a reveal that flips the fear into a friend, and a
  final gag that teaches the series rule. Introduces Mirchi; the end card teases "Fridge Ka Raja".
- **Formats:** wide 16:9 in `wide/` (the YouTube Kids episode) and vertical 9:16 at the root.
- **Measured:** `hyperframes check` 0 errors. Remaining `line_unread` warnings come from
  samples the checker drops mid-bubble (`opacity: null` gaps); every bubble is on screen for at
  least 0.5 s + 0.3 s a word. The sound was measured, not heard.
- **Still to add:** a music bed (needs `npx hyperframes auth login` for the HeyGen catalog); a real
  power-down hum sound (the bundled set has none; a low glitch stands in).
- **Weakest spots:** fainted Aloo is a dark squashed shape in the blackout; the torch is held at
  head height rather than clearly in Bhindi's hand.
