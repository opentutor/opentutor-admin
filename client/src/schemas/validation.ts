/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import Ajv from "ajv";
import { Features } from "types";

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
export const expectationFeatureSchema = require("schemas/expectation-feature-schema.json");

// the validator should be private to the module
// and global (only created once at most
let _expectationFeaturesValidator: Ajv.ValidateFunction;

function getExpectationFeaturesValidator(): Ajv.ValidateFunction {
  if (!_expectationFeaturesValidator) {
    _expectationFeaturesValidator = new Ajv({
      allErrors: true,
      verbose: true,
    }).compile(expectationFeatureSchema);
  }
  return _expectationFeaturesValidator;
}

export function validateExpectationFeatures(json: Features): boolean {
  return getExpectationFeaturesValidator()(json) === true;
}
