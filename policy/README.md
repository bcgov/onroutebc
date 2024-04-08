A JSON-based rules engine to validate onRouteBC permit applications against commercial vehicle policy.

## Synopsis
```orbc-policy-engine``` is a library designed to compare a commercial vehicle permit application against policy expressed in JSON format, and return a list of policy violations as well as other informational policy messages related to the permit.

```orbc-policy-engine``` makes use of https://github.com/CacheControl/json-rules-engine for rules engine functionality. Complex rules are modeled by extending the core ```json-rules-engine``` operators and other capabilities.

## Usage
```js
import Policy from 'orbc-policy-engine';

// policyConfiguration is a JSON object of type PolicyDefinition
const policy: Policy = new Policy(policyDefinition);
// permitApplication is a JSON object of type PermitApplication
// results is an object of type ValidationResult
const results = policy.validate(permitApplication);
```