/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import {
  cySetup,
  cyMockDefault,
  mockGQL,
  cyMockModelStatus,
} from "../support/functions";
import { lesson, videoLesson } from "../fixtures/lesson";

describe("edit lesson screen", () => {
  describe("permissions", () => {
    it("cannot view lesson page if not logged in", () => {
      cySetup(cy);
      cyMockModelStatus(cy);
      cy.visit("/cogeneration");
    });

    it("cannot view lesson page if user does not have permission to edit", () => {
      cySetup(cy);
      cyMockModelStatus(cy);
      cyMockDefault(cy, {
        gqlQueries: [mockGQL("FetchLesson", { me: { lesson } })],
      });
      cy.visit("/cogeneration");
    });
  });
});
