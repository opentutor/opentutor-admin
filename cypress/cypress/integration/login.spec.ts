/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { lessons } from '../fixtures/lesson';
import { cySetup, cyMockDefault, mockGQL } from '../support/functions';

describe('Login', () => {
  it('loads home page', () => {
    cySetup(cy);
    cy.visit('/');
    cy.contains('Welcome to OpenTutor');
    cy.get('[data-cy=login-menu]').find('[data-cy=login-button]');
  });

  it('login disabled if missing GOOGLE_CLIENT_ID', () => {
    cySetup(cy);
    cy.visit('/');
    cy.get('[data-cy=login-menu]')
      .find('[data-cy=login-button]')
      .should('be.disabled');
  });

  it('login enabled if GOOGLE_CLIENT_ID is set', () => {
    cySetup(cy);
    cyMockDefault(cy, {
      noLogin: true,
    });
    cy.visit('/');
    cy.get('[data-cy=login-menu]')
      .find('[data-cy=login-button]')
      .should('not.be.disabled');
  });

  it('redirects to lesson page after logging in', () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL('lessons', lessons, true)],
    });
    cy.visit('/');
    cy.location('pathname').should('contain', 'lessons');
    cy.get('[data-cy=lessons]').children().should('have.length', 2);
  });

  it('redirects to home page after logging out', () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL('lessons', lessons, true)],
    });
    cy.visit('/');
    cy.location('pathname').should('contain', 'lessons');
    cy.get('[data-cy=lessons]').children().should('have.length', 2);
    cy.get('[data-cy=login-option]')
      .find('[data-cy=login-button]')
      .trigger('mouseover')
      .click();
    cy.get('[data-cy=logout]').trigger('mouseover').click();
    cy.location('pathname').should('not.contain', 'lessons');
    cy.contains('Welcome to OpenTutor');
  });

  it('cannot view lessons list if not logged in', () => {
    cySetup(cy);
    cy.visit('/lessons');
    cy.contains('Please login to view lessons.');
  });

  it('cannot view lesson page if not logged in', () => {
    cySetup(cy);
    cy.visit('/lessons/edit?lessonId=q1');
    cy.contains('Please login to view lesson.');
  });

  it('cannot view sessions list if not logged in', () => {
    cySetup(cy);
    cy.visit('/sessions');
    cy.contains('Please login to view sessions.');
  });

  it('cannot view session page if not logged in', () => {
    cySetup(cy);
    cy.visit('/sessions/session?sessionId=session1');
    cy.contains('Please login to view session.');
  });
});
