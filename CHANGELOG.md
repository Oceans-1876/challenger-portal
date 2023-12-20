# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [unreleased]

### Fixed

- Error in displaying temperatures at depths in station details.

## [1.0.0] - 2023-12-04

### Added

- Added station grouping based on ocean regions.
- Added inset map.
- Added left panel to view FAO areas and group stations for comfortable browsing.

### Fixed

- Re-enabled station clustering.

### Changed

- Major UI updates based on the v1.0 design.
- Replaced asset loaders with webpack 5 Asset Modules.
- Updated TS build configurations.
- Replaced HashRouter with BrowserRouter.

### Removed

- Removed unused components.
- Removed dependency on `maplibre-gl-basemaps`.

## [0.1.0] - 2022-12-21

- The initial release of the Challenger-Portal.
