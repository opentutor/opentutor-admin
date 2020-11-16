/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
describe("Navigation bar", () => {
    beforeEach(() => {
        cy.server();
        cy.visit("/");
        cy.route({
            method: "POST",
            url: "**/graphql",
            status: 200,
            response: {
                data: {
                    login: {
                        name: "Kayla",
                        email: "kayla@opentutor.com"
                    },
                },
                errors: null,
            },
            headers: {
                "Content-Type": "application/json",
            },
        });
        cy.route("**/config", {
            GOOGLE_CLIENT_ID: "test"
        });
        cy.setCookie("accessToken", "accessToken");
    });

    it("shows page title", () => {
        cy.get("#nav-bar").get("#title").contains("Lessons");
        cy.visit("/lessons/edit?lessonId=new");
        cy.get("#nav-bar").get("#title").contains("Edit Lesson");
        cy.visit("/sessions");
        cy.get("#nav-bar").get("#title").contains("Grading");
        cy.visit("/sessions/session");
        cy.get("#nav-bar").get("#title").contains("Grade Session");
    });

    it("opens drawer menu", () => {
        cy.get("#drawer").should("not.exist");
        cy.get("#nav-bar").get("#menu-button").trigger('mouseover').click();
        cy.get("#drawer");
    });

    it("navigates with menu", () => {
        cy.get("#nav-bar").get("#menu-button").trigger('mouseover').click();
        cy.get("#drawer a").eq(1).contains("Grading");
        cy.get("#drawer a").eq(1).trigger('mouseover').click();
        cy.location("pathname").should("contain", "/sessions");
    });
});