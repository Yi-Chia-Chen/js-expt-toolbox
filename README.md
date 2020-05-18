# js-expt-toolbox
This is a tiny js/jQuery toolbox for psychological experiment by Yi-Chia Chen.

## Version History
- 3.0.0 (2020.05.18): Add tab switching detection,
                      Add rest (untested),
                      Add instruction reading time recording,
                      Add visit recording besides attrition recording,
                      Add CAPITALIZE() to func.js,
                      Delete ID recording for privacy reasons,
                      Update the example experiment to include space key detection, hCaptcha, directory/file creation, and sona credit granting,
                      Clean up syntax
    - Used in Autistic Traits & Aesthetic Taste
- 2.0.1 (2020.04.09): Fix a bug
- 2.0.0 (2020.04.06): Add a progress indicator,
                      Add detection for elements in full view,
                      Split trial.end() into trial.end() and trial.save(),
                      Separate obtain subject ID into its own method,
                      Add subj.obtainCondition(),
                      Add an example experiment,
                      Fixed some formatting (but not all...)
    - Used in Aesthetic Versus Attractiveness
- 1.1.0 (2020.01.20): Renamed the files and fixed formatting style
    - Used in Future Bias Ball on Hill
- 1.0.2 (2019.07.02): Fixed some bugs
    - Used in New Texform Recognition Response Evaluation
    - Used in Deza New Texform Recognition Response Evaluation
- 1.0.2b (2019.07.01): Added CHECK_IF_RESPONDED function
- 1.0.1 (2019.06.13): Fixed some bugs
    - Used in New Texform Recognition Free Response Pretest
    - Used in Deza New Texform Recognition Free Response Pretest
- 1.0.0 (2019.06.13): First version

## Planned Improvements

### Features
- End the experiment if people refresh after a certain point in formal experiment

### Cleaning up
- Make all functions do one thing only
- Write unit tests