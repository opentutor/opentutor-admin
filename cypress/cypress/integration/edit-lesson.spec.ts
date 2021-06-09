/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { cySetup, cyMockDefault, mockGQL } from '../support/functions';
import { lesson } from '../fixtures/lesson';

const lessons = {
  edges: [
    {
      cursor: 'cursor 1',
      node: {
        lessonId: 'q1',
        name: 'lesson',
        intro: 'introduction',
        question: 'question',
        image: null,
        conclusion: ['conclusion'],
        expectations: [
          {
            expectation: 'expectation 1',
            hints: [
              {
                text: 'hint 1.1',
              },
            ],
            features: {
              bad: ['bad1', 'bad2'],
            },
          },
        ],
        createdBy: 'opentutor',
        createdByName: 'OpenTutor',
      },
    },
  ],
  pageInfo: {
    hasNextPage: false,
    endCursor: 'cursor 2',
  },
};

describe('edit lesson screen', () => {
  describe('permissions', () => {
    it('cannot view lesson page if not logged in', () => {
      cySetup(cy);
      cy.visit('/lessons/edit?lessonId=q1');
      cy.contains('Please login to view lesson.');
    });

    it('cannot view lesson page if user does not have permission to edit', () => {
      cySetup(cy);
      cyMockDefault(cy, {
        gqlQueries: [mockGQL('lesson', lesson, true)],
      });
      cy.visit('/lessons/edit?lessonId=q1');
      cy.contains('You do not have permission to view this lesson.');
    });

    it('can view lesson page if user created lesson', () => {
      cySetup(cy);
      cyMockDefault(cy, {
        gqlQueries: [
          mockGQL(
            'lesson',
            {
              ...lesson,
              createdBy: 'kayla',
              createdByName: 'Kayla',
            },
            true
          ),
        ],
      });
      cy.visit('/lessons/edit?lessonId=q1');
      cy.get('[data-cy=lesson-creator]').within(($input) => {
        cy.get('input').should('have.value', 'Kayla');
      });
    });

    it('can view lesson page if user is admin', () => {
      cySetup(cy);
      cyMockDefault(cy, {
        gqlQueries: [mockGQL('lesson', lesson, true)],
        userRole: 'admin',
      });
      cy.visit('/lessons/edit?lessonId=q1');
      cy.get('[data-cy=lesson-creator]').within(($input) => {
        cy.get('input').should('have.value', 'OpenTutor');
      });
    });

    it('can view lesson page if user is content manager', () => {
      cySetup(cy);
      cyMockDefault(cy, {
        gqlQueries: [mockGQL('lesson', lesson, true)],
        userRole: 'contentManager',
      });
      cy.visit('/lessons/edit?lessonId=q1');
      cy.get('[data-cy=lesson-creator]').within(($input) => {
        cy.get('input').should('have.value', 'OpenTutor');
      });
    });
  });

  describe('new lesson', () => {
    it('new lesson has default values', () => {
      cySetup(cy);
      cyMockDefault(cy);
      cy.visit('/lessons/edit');
      cy.get('[data-cy=lesson-name]').within(($input) => {
        cy.get('input').should('have.value', 'Display name for the lesson');
      });
      cy.get('[data-cy=lesson-creator]').within(($input) => {
        cy.get('input').should('have.value', 'Kayla');
      });
      cy.get('[data-cy=intro]').within(($input) => {
        cy.get('textarea').should(
          'have.value',
          "Introduction to the lesson,  e.g. 'This is a lesson about RGB colors'"
        );
      });
      cy.get('[data-cy=question]').within(($input) => {
        cy.get('textarea').should(
          'have.value',
          "Question the student needs to answer, e.g. 'What are the colors in RGB?'"
        );
      });
      cy.get('[data-cy=image]').should('have.value', '');
      cy.get('[data-cy=expectations]').children().should('have.length', 1);
      cy.get('[data-cy=expectation-0]')
        .find('[data-cy=edit-expectation]')
        .within(($input) => {
          cy.get('input').should(
            'have.value',
            "Add a short ideal answer for an expectation, e.g. 'Red'"
          );
        });
      cy.get('[data-cy=expectation-0]')
        .find('[data-cy=hints]')
        .children()
        .should('have.length', 1);
      cy.get('[data-cy=hint-0]')
        .find('[data-cy=edit-hint]')
        .within(($input) => {
          cy.get('textarea').should(
            'have.value',
            "Add a hint to help for the expectation, e.g. 'One of them starts with R'"
          );
        });
      cy.get('[data-cy=conclusions]').children().should('have.length', 1);
      cy.get('[data-cy=conclusion-0]')
        .find('[data-cy=edit-conclusion]')
        .within(($input) => {
          cy.get('textarea').should(
            'have.value',
            "Add a conclusion statement, e.g. 'In summary,  RGB colors are red, green, and blue'"
          );
        });
    });

    it('edits a new lesson', () => {
      cySetup(cy);
      cyMockDefault(cy);
      cy.visit('/lessons/edit');
      cy.get('[data-cy=lesson-name]').within(($input) => {
        cy.get('input').fill('Review Diode Current Flow');
      });
      cy.get('[data-cy=lesson-id]').within(($input) => {
        cy.get('input').fill('review-diode-current-flow');
      });
      cy.get('[data-cy=intro]').within(($input) => {
        cy.get('textarea').fill(
          'This is a warm up question on the behavior of P-N junction diodes.'
        );
      });
      cy.get('[data-cy=question]').within(($input) => {
        cy.get('textarea').fill(
          'With a DC input source, does current flow in the same or the opposite direction of the diode arrow?'
        );
      });
      cy.get('[data-cy=image]').within(($input) => {
        cy.get('textarea').fill(
          'https://cdn.jpegmini.com/user/images/slider_puffin_before_mobile.jpg'
        );
      });
      cy.get('[data-cy=expectation-0]')
        .find('[data-cy=edit-expectation]')
        .within(($input) => {
          cy.get('input').fill(
            'Current flows in the same direction as the arrow.'
          );
        });
      cy.get('[data-cy=expectation-0]')
        .find('[data-cy=hint-0]')
        .find('[data-cy=edit-hint]')
        .within(($input) => {
          cy.get('textarea').fill(
            'What is the current direction through the diode when the input signal is DC input?'
          );
        });
      cy.get('[data-cy=conclusion-0]')
        .find('[data-cy=edit-conclusion]')
        .within(($input) => {
          cy.get('textarea').fill(
            'Summing up, this diode is forward biased. Positive current flows in the same direction of the arrow, from anode to cathode.'
          );
        });
      cy.get('[data-cy=lesson-name]').within(($input) => {
        cy.get('input').should('have.value', 'Review Diode Current Flow');
      });
      cy.get('[data-cy=lesson-id]').within(($input) => {
        cy.get('input').should('have.value', 'review-diode-current-flow');
      });
      cy.get('[data-cy=lesson-creator]').within(($input) => {
        cy.get('input').should('have.value', 'Kayla');
      });
      cy.get('[data-cy=intro]').within(($input) => {
        cy.get('textarea').should(
          'have.value',
          'This is a warm up question on the behavior of P-N junction diodes.'
        );
      });
      cy.get('[data-cy=question]').within(($input) => {
        cy.get('textarea').should(
          'have.value',
          'With a DC input source, does current flow in the same or the opposite direction of the diode arrow?'
        );
      });
      cy.get('[data-cy=image]').within(($input) => {
        cy.get('textarea').should(
          'have.value',
          'https://cdn.jpegmini.com/user/images/slider_puffin_before_mobile.jpg'
        );
      });
      cy.get('[data-cy=expectation-0]')
        .find('[data-cy=edit-expectation]')
        .within(($input) => {
          cy.get('input').should(
            'have.value',
            'Current flows in the same direction as the arrow.'
          );
        });
      cy.get('[data-cy=expectation-0]')
        .find('[data-cy=hint-0]')
        .find('[data-cy=edit-hint]')
        .within(($input) => {
          cy.get('textarea').should(
            'have.value',
            'What is the current direction through the diode when the input signal is DC input?'
          );
        });
      cy.get('[data-cy=conclusion-0]')
        .find('[data-cy=edit-conclusion]')
        .within(($input) => {
          cy.get('textarea').should(
            'have.value',
            'Summing up, this diode is forward biased. Positive current flows in the same direction of the arrow, from anode to cathode.'
          );
        });
    });

    it('launch lesson is disabled if new lesson', () => {
      cySetup(cy);
      cyMockDefault(cy);
      cy.visit('/lessons/edit');
      cy.get('[data-cy=launch-button]').should('be.disabled');
    });
  });

  describe('copy lesson', () => {
    it('loads a copy of the lesson', () => {
      cySetup(cy);
      cyMockDefault(cy, {
        gqlQueries: [mockGQL('lesson', lesson, true)],
        userRole: 'admin',
      });
      cy.visit('/lessons/edit?copyLesson=q1');
      cy.get('[data-cy=intro]').within(($input) => {
        cy.get('textarea').should('have.value', 'introduction');
      });
      cy.get('[data-cy=question]').within(($input) => {
        cy.get('textarea').should('have.value', 'question');
      });
      cy.get('[data-cy=image]').should('have.value', '');
      cy.get('[data-cy=expectations]').children().should('have.length', 1);
      cy.get('[data-cy=expectation-0]')
        .find('[data-cy=edit-expectation]')
        .within(($input) => {
          cy.get('input').should('have.value', 'expectation 1');
        });
      cy.get('[data-cy=expectation-0] .jsoneditor').contains('bad1');
      cy.get('[data-cy=expectation-0] .jsoneditor').contains('bad2');
      cy.get('[data-cy=expectation-0]')
        .find('[data-cy=hints]')
        .children()
        .should('have.length', 1);
      cy.get('[data-cy=hint-0]')
        .find('[data-cy=edit-hint]')
        .within(($input) => {
          cy.get('textarea').should('have.value', 'hint 1.1');
        });
      cy.get('[data-cy=conclusions]').children().should('have.length', 1);
      cy.get('[data-cy=conclusion-0]')
        .find('[data-cy=edit-conclusion]')
        .within(($input) => {
          cy.get('textarea').should('have.value', 'conclusion');
        });
    });

    it('lesson copy has a new id, name, and creator', () => {
      cySetup(cy);
      cyMockDefault(cy, {
        gqlQueries: [mockGQL('lesson', lesson, true)],
        userRole: 'admin',
      });
      cy.visit('/lessons/edit?copyLesson=q1');
      cy.get('[data-cy=lesson-name]').within(($input) => {
        cy.get('input').should('have.value', 'Copy of lesson');
      });
      cy.get('[data-cy=lesson-id]').should('not.have.value', 'q1');
      cy.get('[data-cy=lesson-creator]').should('not.have.value', 'OpenTutor');
    });
  });

  describe('validates lessonId', () => {
    it('lessonId is invalid if it contains symbols', () => {
      cySetup(cy);
      cyMockDefault(cy, {
        gqlQueries: [mockGQL('lesson', lesson, true)],
        userRole: 'admin',
      });
      cy.visit('/lessons/edit?lessonId=q1');
      cy.get('[data-cy=lesson-id]').clear().type('~');
      cy.get('#lesson-id-helper-text').contains(
        'id must be lower-case and alpha-numeric.'
      );
      cy.get('[data-cy=save-button]').should('be.disabled');
      cy.get('[data-cy=launch-button]').should('be.disabled');
    });

    it('lessonId is invalid if it contains capital letters', () => {
      cySetup(cy);
      cyMockDefault(cy, {
        gqlQueries: [mockGQL('lesson', lesson, true)],
        userRole: 'admin',
      });
      cy.visit('/lessons/edit?lessonId=q1');
      cy.get('[data-cy=lesson-id]').clear().type('A');
      cy.get('#lesson-id-helper-text').contains(
        'id must be lower-case and alpha-numeric.'
      );
      cy.get('[data-cy=save-button]').should('be.disabled');
      cy.get('[data-cy=launch-button]').should('be.disabled');
    });

    it('lessonId is invalid if another lesson is already using the lessonId', () => {
      cySetup(cy);
      cyMockDefault(cy, {
        gqlQueries: [
          mockGQL('lesson', lesson, true),
          mockGQL('lessons', lessons, true),
        ],
        userRole: 'admin',
      });
      cy.visit('/lessons/edit');
      cy.get('[data-cy=lesson-id]').clear().type('q1');
      cy.get('#lesson-id-helper-text').contains(
        'id is already being used for another lesson.'
      );
      cy.get('[data-cy=save-button]').should('be.disabled');
      cy.get('[data-cy=launch-button]').should('be.disabled');
    });

    it('lessonId is valid if it is unique, lower-case, and alpha-numeric', () => {
      cySetup(cy);
      cyMockDefault(cy, {
        userRole: 'admin',
      });
      cy.visit('/lessons/edit');
      cy.get('[data-cy=lesson-id]').clear().type('q0');
      cy.get('[data-cy=lesson-name]').clear().type('{backspace}');
      cy.get('[data-cy=save-button]').should('be.visible');
    });
  });

  it('loads a lesson', () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL('lesson', lesson, true)],
      userRole: 'admin',
    });
    cy.visit('/lessons/edit?lessonId=q1');

    cy.get('[data-cy=lesson-id]').within(($input) => {
      cy.get('input').should('have.value', 'q1');
    });
    cy.get('[data-cy=lesson-name]').within(($input) => {
      cy.get('input').should('have.value', 'lesson');
    });
    cy.get('[data-cy=lesson-creator]').within(($input) => {
      cy.get('input').should('have.value', 'OpenTutor');
    });
    cy.get('[data-cy=intro]').within(($input) => {
      cy.get('textarea').should('have.value', 'introduction');
    });
    cy.get('[data-cy=question]').within(($input) => {
      cy.get('textarea').should('have.value', 'question');
    });
    cy.get('[data-cy=image]').should('have.value', '');
    cy.get('[data-cy=expectations]').children().should('have.length', 1);
    cy.get('[data-cy=expectation-0]')
      .find('[data-cy=edit-expectation]')
      .within(($input) => {
        cy.get('input').should('have.value', 'expectation 1');
      });
    cy.get('[data-cy=expectation-0] .jsoneditor').contains('bad1');
    cy.get('[data-cy=expectation-0] .jsoneditor').contains('bad2');
    cy.get('[data-cy=expectation-0]')
      .find('[data-cy=hints]')
      .children()
      .should('have.length', 1);
    cy.get('[data-cy=hint-0]')
      .find('[data-cy=edit-hint]')
      .within(($input) => {
        cy.get('textarea').should('have.value', 'hint 1.1');
      });
    cy.get('[data-cy=conclusions]').children().should('have.length', 1);
    cy.get('[data-cy=conclusion-0]')
      .find('[data-cy=edit-conclusion]')
      .within(($input) => {
        cy.get('textarea').should('have.value', 'conclusion');
      });
  });

  it('can expand and collapse an expectation', () => {
    cySetup(cy);
    cyMockDefault(cy);
    cy.visit('/lessons/edit');
    // expectation is expanded by default
    cy.get('[data-cy=expectation-0]').find('[data-cy=edit-expectation]');
    cy.get('[data-cy=expectation-0]').find('[data-cy=hints]');
    cy.get('[data-cy=hint-0]').find('[data-cy=edit-hint]');
    // collapsing an expectation hides hints
    cy.get('[data-cy=expectation-0]')
      .find('[data-cy=expand]')
      .trigger('mouseover')
      .click();
    cy.get('[data-cy=expectation-0]').find('[data-cy=edit-expectation]');
    cy.get('[data-cy=expectation-0]')
      .find('[data-cy=hints]')
      .should('not.exist');
    // expanding an expectation reveals hints
    cy.get('[data-cy=expectation-0]')
      .find('[data-cy=expand]')
      .trigger('mouseover')
      .click();
    cy.get('[data-cy=expectation-0]').find('[data-cy=edit-expectation]');
    cy.get('[data-cy=expectation-0]').find('[data-cy=hints]');
    cy.get('[data-cy=hint-0]').find('[data-cy=edit-hint]');
  });

  it('adds and deletes an expectation', () => {
    cySetup(cy);
    cyMockDefault(cy);
    cy.visit('/lessons/edit');
    // must have at least 1 expectation
    cy.get('[data-cy=expectations]').children().should('have.length', 1);
    cy.get('[data-cy=expectation-0]')
      .find('[data-cy=delete]')
      .should('not.exist');
    // add and delete
    cy.get('[data-cy=add-expectation]').trigger('mouseover').click();
    cy.get('[data-cy=expectations]').children().should('have.length', 2);
    cy.get('[data-cy=expectation-0]')
      .find('[data-cy=delete]')
      .trigger('mouseover')
      .click();
    cy.get('[data-cy=expectations]').children().should('have.length', 1);
  });

  it('adds and deletes a hint', () => {
    cySetup(cy);
    cyMockDefault(cy);
    cy.visit('/lessons/edit');
    // must have at least 1 hint
    cy.get('[data-cy=hints]').children().should('have.length', 1);
    cy.get('[data-cy=hint-0]').find('[data-cy=delete]').should('not.exist');
    // add and delete
    cy.get('[data-cy=add-hint]').trigger('mouseover').click();
    cy.get('[data-cy=hints]').children().should('have.length', 2);
    cy.get('[data-cy=hint-0]')
      .find('[data-cy=delete]')
      .trigger('mouseover')
      .click();
    cy.get('[data-cy=hints]').children().should('have.length', 1);
  });

  it('adds and deletes a conclusion', () => {
    cySetup(cy);
    cyMockDefault(cy);
    cy.visit('/lessons/edit');
    // must have at least 1 conclusion
    cy.get('[data-cy=conclusions]').children().should('have.length', 1);
    cy.get('[data-cy=conclusion-0]')
      .find('[data-cy=delete]')
      .should('not.exist');
    // add and delete
    cy.get('[data-cy=add-conclusion]').trigger('mouseover').click();
    cy.get('[data-cy=conclusions]').children().should('have.length', 2);
    cy.get('[data-cy=conclusion-0]')
      .find('[data-cy=delete]')
      .trigger('mouseover')
      .click();
    cy.get('[data-cy=conclusions]').children().should('have.length', 1);
  });

  it('save button is hidden if no edits were made', () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL('lesson', lesson, true)],
      userRole: 'admin',
    });
    cy.visit('/lessons/edit?lessonId=q1');
    cy.get('[data-cy=save-button]').should('not.exist');
  });

  it('save button is visible after making an edit', () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL('lesson', lesson, true)],
      userRole: 'admin',
    });
    cy.visit('/lessons/edit?lessonId=q1');
    cy.get('[data-cy=lesson-name]').clear().type('{backspace}');
    cy.get('[data-cy=save-button]').should('be.visible');
  });

  it('makes an edit and clicks on save', () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL('lesson', lesson, true)],
      userRole: 'admin',
    });
    cy.visit('/lessons/edit?lessonId=q1');
    cy.get('[data-cy=lesson-name]').clear().type('{backspace}');
    cy.get('[data-cy=save-button]').trigger('mouseover').click();
  });

  it('launches lesson', () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL('lesson', lesson, true)],
      userRole: 'admin',
    });
    cy.visit('/lessons/edit?lessonId=q1');
    cy.get('[data-cy=launch-button]').trigger('mouseover').click();
    cy.location('pathname').should('eq', '/tutor');
  });
});
