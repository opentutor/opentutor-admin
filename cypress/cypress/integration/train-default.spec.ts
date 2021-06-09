/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { TrainState } from "../support/dtos";
import {
  cySetup,
  cyMockDefault,
  mockGQL,
  cyMockTrainDefault,
  cyMockTrainStatusSeq,
} from "../support/functions";

function snapname(n) {
  return `lesson-page-${n}`;
}

describe("settings screen - training default", () => {

  it("show loading indicator on train", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      userRole: "admin"
    })
    cy.visit("/settings");
    const waitTrainDefault = cyMockTrainDefault(cy);
    const waitComplete = cyMockTrainStatusSeq(cy, [
      { status: { state: TrainState.PENDING } },
    ]);
    cy.get('[data-cy=train-default-button]').trigger("mouseover").click();
    waitTrainDefault();
    waitComplete();
    cy.get('[data-cy=loading]').should("exist");
  })

  it("fails for state FAILURE", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      userRole: "admin"
    })
    cy.visit("/settings");
    const waitTrainDefault = cyMockTrainDefault(cy);
    const waitComplete = cyMockTrainStatusSeq(cy, [
      { status: { state: TrainState.PENDING } },
      { status: { state: TrainState.STARTED } },
      { status: { state: TrainState.FAILURE } },
    ]);
    cy.get('[data-cy=train-default-button]').trigger("mouseover").click();
    waitTrainDefault();
    waitComplete();
    cy.get('[data-cy=train-failure]').should("contain", "TRAINING FAILED");
  });

  it("fails for http error on start", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      userRole: "admin"
    })
    cy.visit("/settings");
    const waitTrainDefault = cyMockTrainDefault(cy, { responseStatus: 500 });
    cy.get('[data-cy=train-default-button]').trigger("mouseover").click();
    waitTrainDefault();
    cy.get('[data-cy=train-failure]').should("contain", "TRAINING FAILED");
  });

  it("fails for http error on poll status", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      userRole: "admin"
    })
    cy.visit("/settings");
    const waitTrainDefault = cyMockTrainDefault(cy);
    const waitComplete = cyMockTrainStatusSeq(cy, [
      { status: { state: TrainState.PENDING } },
      { status: { state: TrainState.STARTED } },
      {
        status: {
          state: TrainState.FAILURE,
        },
        responseStatusCode: 500,
      },
    ]);
    cy.get('[data-cy=train-default-button]').trigger("mouseover").click();
    waitTrainDefault();
    waitComplete();
    cy.get('[data-cy=train-failure]').should("contain", "TRAINING FAILED");
  });

  it("show success message on successful train", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      userRole: "admin"
    })
    cy.visit("/settings");
    const waitTrainDefault = cyMockTrainDefault(cy);
    const waitComplete = cyMockTrainStatusSeq(cy, [
      { status: { state: TrainState.PENDING } },
      { status: { state: TrainState.STARTED } },
      { status: { state: TrainState.SUCCESS } },
    ]);
    cy.get('[data-cy=train-default-button]').trigger("mouseover").click();
    waitTrainDefault();
    waitComplete();
    cy.get('[data-cy=train-success]').should("contain", "TRAINING SUCCEEDED");
  })
});
