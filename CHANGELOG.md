## v0.86.0 (2023-10-05)

## LPDC
#### :rocket: Enhancement
* [#336](https://github.com/lblod/frontend-loket/pull/336) Remove the LPDC module ([@Windvis](https://github.com/Windvis))
* [#341](https://github.com/lblod/frontend-loket/pull/341) Update the LPDC user manual links ([@Windvis](https://github.com/Windvis))

## Toezicht
#### :bug: Bug Fix
* [#331](https://github.com/lblod/frontend-loket/pull/331) Fix an issue when reopening a supervision submission in the controle environment ([@Windvis](https://github.com/Windvis))

## v0.85.0 (2023-09-11)

#### :rocket: Enhancement
* [#334](https://github.com/lblod/frontend-loket/pull/334) Add a "global system notification" bar ([@Windvis](https://github.com/Windvis))

## v0.84.1 (2023-07-19)

### LPDC
#### :bug: Bug Fix
* [#323](https://github.com/lblod/frontend-loket/pull/323) Fix getter used to toggle archive vs concept updated ([@cecemel](https://github.com/cecemel))

## v0.84.0 (2023-06-22)

### General
#### :house: Internal
* [#321](https://github.com/lblod/frontend-loket/pull/321) Update to ember-submission-form-fields v2.11.0 ([@Poltergeistz](https://github.com/Poltergeistz))

### LPDC
#### :rocket: Enhancement
* [#319](https://github.com/lblod/frontend-loket/pull/319) Add a `lpdc-external` feature flag ([@Windvis](https://github.com/Windvis))

#### :bug: Bug Fix
* [#320](https://github.com/lblod/frontend-loket/pull/320) Fix the save and submit buttons ([@Windvis](https://github.com/Windvis))

## v0.83.1 (2023-06-14)

### LPDC
#### :bug: Bug Fix
* [#318](https://github.com/lblod/frontend-loket/pull/318) Fix a modal issue in Chromium-based browsers when `prefers-reduced-motion` is set ([@Windvis](https://github.com/Windvis))

## v0.83.0 (2023-06-14)

### General
#### :rocket: Enhancement
* [#239](https://github.com/lblod/frontend-loket/pull/239) Integrate the Sentry client ([@Windvis](https://github.com/Windvis))

### LPDC
#### :rocket: Enhancement
* [#311](https://github.com/lblod/frontend-loket/pull/311) Add support for concept archiving ([@Windvis](https://github.com/Windvis))

#### :bug: Bug Fix
* [#317](https://github.com/lblod/frontend-loket/pull/317) Disable the submit and save buttons if the form isn't loaded ([@Windvis](https://github.com/Windvis))
* [#316](https://github.com/lblod/frontend-loket/pull/316) Don't focus the rich-text editor window when setting the initial value ([@Windvis](https://github.com/Windvis))
* [#315](https://github.com/lblod/frontend-loket/pull/315) Fix the spacing between pills in table rows ([@Windvis](https://github.com/Windvis))

## v0.82.0 (2023-06-08)

### General
#### :rocket: Enhancement
* [#314](https://github.com/lblod/frontend-loket/pull/314) Update the submit button text in the Toezicht module ([@Windvis](https://github.com/Windvis))
* [#312](https://github.com/lblod/frontend-loket/pull/312) Replace links to the old website with the new equivalents ([@Windvis](https://github.com/Windvis))

### LPDC
#### :bug: Bug Fix
* [#313](https://github.com/lblod/frontend-loket/pull/313) Don't show the unsaved changes modal for read-only forms ([@Windvis](https://github.com/Windvis))

### Subsidies 
#### :rocket: Enhancement
* [#310](https://github.com/lblod/frontend-loket/pull/310) Add support for handling external subsidies ([@Riadabd](https://github.com/Riadabd))

## v0.81.0 (2023-05-31)

### LPDC
#### :rocket: Enhancement
* [#290](https://github.com/lblod/frontend-loket/pull/290) Implement the concept label and filtering functionality ([@Windvis](https://github.com/Windvis))


## v0.80.0 (2023-05-17)

### General
#### :house: Internal
* [#308](https://github.com/lblod/frontend-loket/pull/308) Remove the -prod image builds ([@Windvis](https://github.com/Windvis))
* [#307](https://github.com/lblod/frontend-loket/pull/307) Remove feature flags for shipped features ([@Windvis](https://github.com/Windvis))

### Worshipservices
#### :rocket: Enhancement
* [#309](https://github.com/lblod/frontend-loket/pull/309) set default status for new worship mandatees to "effectief" ([@aatauil](https://github.com/aatauil))


## v0.79.4 (2023-06-14)

### LPDC
#### :bug: Bug Fix
* [#318](https://github.com/lblod/frontend-loket/pull/318) Fix a modal issue in Chromium-based browsers when `prefers-reduced-motion` is set ([@Windvis](https://github.com/Windvis))


## v0.79.3 (2023-05-04)

### LPDC
#### :bug: Bug Fix
* [#306](https://github.com/lblod/frontend-loket/pull/306) Fix the formatting of the rich-text editor contents in read-only mode ([@Windvis](https://github.com/Windvis))


## v0.79.2 (2023-05-03)

### General
#### :bug: Bug Fix
* [#305](https://github.com/lblod/frontend-loket/pull/305) Fix a `<AuDateInput>` autofill issue ([@Windvis](https://github.com/Windvis))
* [#304](https://github.com/lblod/frontend-loket/pull/304) Fix validations for sub forms in LPDC and subsidies ([@Windvis](https://github.com/Windvis))


## v0.79.1 (2023-04-27)

### General
#### :bug: Bug Fix
* [#302](https://github.com/lblod/frontend-loket/pull/302) Fix a semantic forms regression ([@Windvis](https://github.com/Windvis))


## v0.79.0 (2023-04-24)

### General
#### :rocket: Enhancement
* [#301](https://github.com/lblod/frontend-loket/pull/301) Update to ember-submission-form-fields v2.10.0 ([@Windvis](https://github.com/Windvis))

### LPDC
#### :rocket: Enhancement
* [#297](https://github.com/lblod/frontend-loket/pull/297) Allow users to link an instance to a concept ([@Windvis](https://github.com/Windvis))
* [#296](https://github.com/lblod/frontend-loket/pull/296) Allow users to unlink an instance from a concept ([@Windvis](https://github.com/Windvis))

#### :bug: Bug Fix
* [#298](https://github.com/lblod/frontend-loket/pull/298) Fix the rich text editor field validations ([@Windvis](https://github.com/Windvis))
* [#299](https://github.com/lblod/frontend-loket/pull/299) Fix a LDPC form teardown issue ([@Windvis](https://github.com/Windvis))


## v0.78.0 (2023-04-14)

### Worshipservices 
#### :rocket: Enhancement
* [#291](https://github.com/lblod/frontend-loket/pull/291) [Eredienst mandatenbeheer] Begin and End date should be limited to the period bounds ([@Poltergeistz](https://github.com/Poltergeistz))

### LPDC 
#### :rocket: Enhancement
* [#293](https://github.com/lblod/frontend-loket/pull/293) Update to ember-rdfa-editor v3 ([@Windvis](https://github.com/Windvis))

### Subsidies 
#### :rocket: Enhancement
* [#295](https://github.com/lblod/frontend-loket/pull/295) Subsidy form improvements ([@Windvis](https://github.com/Windvis))
* [#294](https://github.com/lblod/frontend-loket/pull/294) Add a `UrbanRenewal::FinancingTotals` custom field component ([@Windvis](https://github.com/Windvis))

### General 
#### :house: Internal
* [#292](https://github.com/lblod/frontend-loket/pull/292) Merge "batch-edit" back into the main branch setup ([@Windvis](https://github.com/Windvis))


## v0.77.1 (2023-03-22)

### Worshipservices 
#### :bug: Bug Fix
* [#289](https://github.com/lblod/frontend-loket/pull/289) Fix end date prefill warning logic ([@Windvis](https://github.com/Windvis))

## v0.77.0 (2023-03-07)

### General 
#### :rocket: Enhancement
* [#282](https://github.com/lblod/frontend-loket/pull/282) Update to @lblod/ember-acmidm-login v2 ([@Windvis](https://github.com/Windvis))

### Worshipservices 
#### :rocket: Enhancement
* [#283](https://github.com/lblod/frontend-loket/pull/283) Prefill the endDate based on the expectedEndDate ([@Poltergeistz](https://github.com/Poltergeistz))


## v0.76.0 (2023-02-28)

### General 
#### :rocket: Enhancement
* [#280](https://github.com/lblod/frontend-loket/pull/280) Remove the "Jos" placeholder ([@Windvis](https://github.com/Windvis))

### LPDC 
#### :rocket: Enhancement
* [#281](https://github.com/lblod/frontend-loket/pull/281) Display the "IPDC product ID" in the public services module ([@Riadabd](https://github.com/Riadabd))
* [#284](https://github.com/lblod/frontend-loket/pull/284) Ensure the order is maintained when creating multiple listing items ([@Windvis](https://github.com/Windvis))

#### :bug: Bug Fix
* [#286](https://github.com/lblod/frontend-loket/pull/286) Fix a LPDC styling issue ([@Windvis](https://github.com/Windvis))
