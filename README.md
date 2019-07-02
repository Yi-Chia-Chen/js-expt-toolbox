# js-expt-toolbox
This is a tiny js/jQuery toolbox for psychological experiment by Yi-Chia Chen.

## Version History
- 1.0.2b (2019.07.01): Added CHECK_IF_RESPONDED function
- 1.0.1 (2019.06.13): Fixed some bugs
    - Used in New Texform Recognition Free Response Pretest
- 1.0.0 (2019.06.13): First version

## Planned Improvements

### Features
- "Press space bar to continue" to limit access from phones
- End the experiment if people refresh after a certain point in formal experiment
- Add a progress bar
- Show alert with a customized floating div in the center that dim everything else
- Listen to tab switching and add instructions about it
- Add detection for whether elements are in view when responses were made
- Add rest (to let them know how much they've completed)

### Cleaning up
- Make all functions do one thing only
- Write unit tests
- Split trial.end() into trial.end() and trial.run() by adding trial.complete attribute
- Add subj.obtainSubjCond() for getting subject number and get subject condition right after succeed
- Allow creating subjObj instances before asking for id (call a method later instead)