# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


### Purpose
Purpose is to predict serum methanol concentrations (both a point estimate and a 95% confidence interval range of likely values) by extrapolating from a measured, known concentration into the near future (<24 hours) allowing for:
1. the start stop hemodialisys interval(s)
2. the (instantaneous) hemodialysis intensity
3. the dosing/presence of antidotes (i.e. either fomepizole or ethanol)

# Uses:
  - to facilitate (and possibly improve the accurage of) predictions of when to discontinue hemodialysis
  - to assist with fomepizol dosing calculations

# Inputs:
(no patient identifiers allowed)
 - pseudonym (for retrieval, do not use patient identifier)
 - estimated weight/mass (kg or lb)
    - // TODO ASK [1.5 (10-150) 400kg]
 - timed serum methanol concentrations (mmol/L or mg/dL or possibly g/L): [MeOH]<sub>```i```</sub> @ date/time<sub>```i```</sub>, ```i```>=1
    - // TODO ASK [0 - 100) 200mM]
 - timed fomepizole doses (mg): 4-MP<sub>```i```</sub> @ date/time<sub>```i```</sub>, ```i```>=0
    - // TODO ASK [0.1(5-15)20 mg/kg]
 - time ethanol serum concentrations (same units as [MeOH]): [EtOH]<sub>```i```</sub> @ date/time<sub>```i```</sub>, ```i```>=0
 - estimated time of last drink of ethanol (only if [EtOH], 2 mmol/L)
 - if ethanol given as an antidote, Inf<sub>EtOH</sub> start date/time = end date/time
 - hemodialysis start and end times for y to how intervals HD, start date/time and end date/time HD<sub>4</sub>
    - // TODO ASK is this english?
 - hemodialysis blood flow (mL/min)
    - for each minute of each HD interval
    - carry last value forward until changed
    - set to zero before/between/after each HD interval

## Conventions
 - rate constants , 0 (i.e. are all negative), per hour
 - for any input [MeOH] or [EtOH] of 0, assign value of 0.1 mmol/L to allow logarithmic transformation
 - work in 24hr (military time)
 - default date/time are near current date/time (i.e. realtime for central patient care)
   - if dated input > 7 days in past, verify being used for a case in the past and not for an actual care (still alow, e/g/ for research/teaching, but check)
   - do not allow input of date/time > 48 hr into future
 - limit extrapulation to < 24 hr beyond most recent [MeOH] value
 - verify if <ins>no treatment</ins> of any kind (i/e/ no antidote, ?? EtOH and no HD) for > 12hr beyond most recent [MeOH] and post warning to this effect (continue to calculate however)
   - // TODO ASK subthergreatic??
 - verify that most recent methanol concentration (the one being used for extrapolation) if at least 1 hour post injestion
   - else warn

## Extrapolate
(if convention above hold)
1. Build time array, one minute per line, beginning with most recent [MeOH] x 24hr
   - set this ```t=0```
2. Estimate initial conditions
   - for [MeOH]<sub>```t=0```</sub>, use measured, most recent [MeOH]<sub>```i```</sub>
   - for [EtOH]<sub>```t=0```</sub>, see later
   - for [4-MP]<sub>```t=0```</sub>, see later
3. Begin loop to extrapolate one minute into future
   - Test for presence of antidote
     - If [EtOH]<sub>```t```</sub> $\ge$ AntidotalThresholdRatioEtOHtoMeOH x [MeOH]<sub>```t```</sub>
     - OR if [4-MP]<sub>```t```</sub> $\ge$ AntidotalThreshold4MP
     - THEN AntidotePresent = Yes, else No
   - Calculate elimination Rate<sub>t</sub> for MeOH
     - = RateConstantBaseline
     - + RateConstantADHActive (if AntidoePresent = No)
     - + RateConstantHD (see below)
   - ln[MeOH]<sub>`t+1`</sub> = ln[MeOH]<sub>`t`</sub> + EliminationRate<sub>`t`</sub> x (1/60 hour)
     - TODO ASK hour??
   - ln[EtOH]<sub>`t+1`</sub> = ln[EtOH]<sub>`t`</sub> + [EthanolElimRate + RateConstantHD] x (1/60 hour) + Dose (if given)
   - ln[4-MP]<sub>`t+1`</sub> = ln[4-MP]<sub>`t`</sub> + 4MPElimZeroOrder x (1/60 hour) + Dose (if given)


# Display
## Graph Results
 - Show every measure [MeOH] within 24 hr prior to most recent including most recent (mark as special)
 - Show when 4-MP doesed
 - Show when EtOH dosed
 - Show HD interval(s)
 - Show with dotted line point estimates of [MeOH] extrapolated into future
   - Add uncertainty bars - 5% of band for lat error
   - then up by 10%/hour for now
    - // TODO ASK for english translation of above

## Output
 - Display time and dose of next recommended 4-MP dose
 - Display time when [MeOH] reaches threshold MeOH (default is 3 mmol/L)
 - Rate Content HD
   - if no HD this minute, use V<sub>b</sub> = 0mL/min