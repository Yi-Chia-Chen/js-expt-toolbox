# js-expt-toolbox
This is a tiny js/jQuery toolbox for psychological experiment by Yi-Chia Chen.
You may find more resource I collected for online experiment here: https://ycc.vision/Resource/
The example experiment can be viewed here: https://cvlstudy.psych.ucla.edu/ycc/tool/example/?id=1234


## Version History
- 5.0.2 (2022.08.25): Replace var to let
                      Add repeat trial at the end of the trial list rather than the beginning
                      Simplify sound loading function
                      Adjust instruction reading timer for easier customization
                      Rename subj.submitQ() to subj.submitAnswers()

- 5.0.1 (2022.07.01): Make sure functions and methods are using duplicated lists

- 5.0.0b (2022.01.18): Break down expt.js to subj.js, instr.js, & task.js
                       Fix function and class naming
                       Update example experiment
                       Use array instead of dictionary for instructions
                       Update to for of/in loop wherever possible
                       Break down some functions

- 4.3.1 (2021.01.07): Add subject number callback function in expt.js

- 4.2.1 (2020.12.08): Fix a bug in function RECURSIVE_COMBINE in func.js
                      Fix a bug in example experiment open-ended response saving (replacing linebreak)

- 4.2.0 (2020.11.05): Fix a bug in function FACTORIAL_COND in func.js

- 4.1.1 (2020.10.06): Update example experiment
                      Rename instrObject attribute qConditions & qAttemptN to quizConditions & quizeAttemptN

- 4.1.0b (2020.10.05): Remove personalized default values for attributes,
                       Change how instruction text is input into instrObject,
                       Add POSITIVE_MOD function in func.js

- 4.0.0b (2020.10.02): Add many new functions to and reorganize func.js,
                       Add instruction elements as attribute of instrObject,
                       Get rid of invalidIDFunc and validIDFunc in subjObject,
                       Hide and show instructions for each page

- 3.2.0 (2020.09.11): Add TO_DEGREES in func.js
                      Add new example experiment

- 3.1.4 (2020.08.19): Fix a bug

- 3.1.3 (2020.08.12): Clean up the reading time code

- 3.1.2 (2020.07.28): Change how instructions reading time is saved

- 3.1.1 (2020.06.01): Rest method updated and tested

- 3.1.0 (2020.05.22): Add buffer video function to func.js,
                      Delete redundant code in expt.js

- 3.0.0 (2020.05.18): Add tab switching detection,
                      Add rest (untested),
                      Add instruction reading time recording,
                      Add visit recording besides attrition recording,
                      Add CAPITALIZE() to func.js,
                      Delete ID recording for privacy reasons,
                      Update the example experiment to include space key detection, hCaptcha, directory/file creation, and sona credit granting,
                      Clean up syntax

- 2.0.1 (2020.04.09): Fix a bug

- 2.0.0 (2020.04.06): Add a progress indicator,
                      Add detection for elements in full view,
                      Split trial.end() into trial.end() and trial.save(),
                      Separate obtain subject ID into its own method,
                      Add subj.obtainCondition(),
                      Add an example experiment,
                      Fixed some formatting (but not all...)

- 1.1.0 (2020.01.20): Renamed the files and fixed formatting style

- 1.0.2 (2019.07.02): Fixed some bugs

- 1.0.2b (2019.07.01): Added CHECK_IF_RESPONDED function

- 1.0.1 (2019.06.13): Fixed some bugs

- 1.0.0 (2019.06.13): First version


## Planned Improvements
- End the experiment if people refresh after a certain point in formal experiment (Wait for Safari to support PerformanceNavigationTiming)
- Add method to restart a block
- Write unit tests