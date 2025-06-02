# ADR 01: Refactoring project structure to improve Scalability and Maintainability

## Context

The application was developed as a mini-project for selection to school purposes, focused on the quick implementation of basic functionality. Due to limited timeframes and requirements, the project structure was not carefully thought out, and decisions were made in favor of development speed rather than long-term maintainability.

In case of further development of the project as a full-fledged application, critical non-functional qualities are scalability and maintainability. The current architecture hinders functionality expansion, support, and testing.

---

## Decision

I decided to carry out a structural refactoring of the application to improve scalability and maintainability. This includes:

### Transition to feature-based structural organization:

- Components (TrackList, GenreSelect, Modal, Audio) and logic are grouped by features.
- Large components (Track, TrackControls) are divided into subcomponents.

### Transition to Redux Toolkit 2.0 syntax:

- Using the new API to define reducers (including asynchronous ones) in `createSlice`.
- Centralized storage of all reducers within a single slice file.
- Abandoning `createAsyncThunk` in favor of integrating asynchronous reducers directly into `createSlice`.

---

## Rationale

- **Scalability**: the new structure enables more efficient project scaling without chaotic growth of dependencies.
- **Maintainability**: centralization of logic in one place makes the code less scattered and easier to support.
- **Consistency**: using modern RTK 2.0 syntax standardizes the approach to writing state logic.
- **Best practices**: feature-based structure and the new RTK syntax are recommended approaches in modern SPAs.

---

## Status

`Proposed`

---

## Consequences

### Positive:

- **Improved scalability:** the structure makes it easier to add new features.
- **Single point of state logic management:** all reducers — including asynchronous — are stored in slice files.
- **Better testability:** smaller independent parts of the code are easier to test.
- **Less boilerplate:** the new RTK 2.0 syntax reduces the amount of template code.
- **Better onboarding for new developers:в** consistent approach across all parts of the project.

### Negative:

- **Increased structural complexity:** new levels of abstraction may initially complicate understanding of the project.
- **Time for refactoring:** significant time must be allocated to restructuring logic and architecture.
- **Larger slice files:** centralization of all reducers may reduce readability.
- **Need to learn RTK 2.0:** time is required to adapt to the new paradigm, which may slow down development at the initial stage.
