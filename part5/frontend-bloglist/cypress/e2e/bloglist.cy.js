describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.createUser({
      username: Cypress.env('TESTNAME'),
      name: Cypress.env('TESTNAME'),
      password: Cypress.env('TESTPASSWORD'),
    })
    cy.visit('')
  })

  it('front page can be opened', function() {
    cy.contains('Bloglist')
  })

  it('Login form is shown', function() {
    cy.contains('log in').click()
    cy.contains('username')
    cy.contains('password')
    cy.get('input#login-username-input')
    cy.get('input#login-password-input')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('log in').click()
      cy.get('input#login-username-input').type(Cypress.env('TESTNAME'))
      cy.get('input#login-password-input').type(Cypress.env('TESTPASSWORD'))
      cy.get('[type=submit]').click()
      cy.contains(`Hello ${Cypress.env('TESTNAME')}`)
    })

    it('fails with wrong credentials', function() {
      cy.contains('log in').click()
      cy.get('input#login-username-input').type(Cypress.env('TESTSTRING'))
      cy.get('input#login-password-input').type(Cypress.env('TESTSTRING'))
      cy.get('[type=submit]').click()
      cy.contains('Wrong credentials')
      cy.get('.notification.fail').should('have.css', 'color', 'rgb(255, 0, 0)')
    })

    describe('When logged in', function() {
      beforeEach(function() {
        cy.login({
          username: Cypress.env('TESTNAME'),
          password: Cypress.env('TESTPASSWORD'),
        })
      })

      describe('Blog interactions', function() {
        it('A blog can be created', function() {
          cy.createBlog(Cypress.env('TESTSTRING'))
          cy.contains(
            `a new blog ${Cypress.env('TESTSTRING')} by ${Cypress.env('TESTSTRING')} added`
          )
          cy.get('.bloglist')
            .contains(`${Cypress.env('TESTSTRING')} by ${Cypress.env('TESTSTRING')}`)
        })

        it('A blog can be liked', function() {
          cy.createBlog(Cypress.env('TESTSTRING'))
          cy.contains('view').click()
          cy.contains('likes 0')
          cy.get('button.like').click()
          cy.contains('likes 1')
        })

        it('A blog can be deleted by its creator', function() {
          cy.createBlog(Cypress.env('TESTSTRING'))
          cy.get('.bloglist').find('.blog').should('have.length', 1)
          cy.contains('view').click()
          cy.contains(Cypress.env('TESTNAME'))
          cy.get('button.delete').click()
          cy.get('.bloglist').find('.blog').should('have.length', 0)
        })

        it('Only the creator can see the delete button', function() {
          const testString = Cypress.env('TESTSTRING')
          cy.createBlog(Cypress.env('TESTSTRING'))
          cy.get('.bloglist').find('.blog').should('have.length', 1)
          cy.contains('view').click()
          cy.contains(Cypress.env('TESTNAME'))
          cy.get('button.delete')
          cy.createUser({
            username: Cypress.env('TESTSTRING'),
            name: Cypress.env('TESTSTRING'),
            password: Cypress.env('TESTPASSWORD'),
          })
          cy.contains('logout').click()
          cy.login({
            username: Cypress.env('TESTSTRING'),
            password: Cypress.env('TESTPASSWORD'),
          })
          cy.contains('view').click()
          cy.get('button.delete').should('not.exist')
        })
      })

      it.only('Blogs are ordered by number of likes', function() {
        const maxBlogs = 3
        let i = 0
        while (i < maxBlogs) {
          const blogName = `${Cypress.env('TESTSTRING')}${i}`
          cy.createBlog(blogName)
          cy.get('.blog').contains(blogName)
          cy.contains('view').click()
          let j = 0
          while (j < i) {
            cy.get(`#${blogName}`).get('.like').eq(i).click()
            j += 1
          }
          i += 1
        }
        cy.reload()
        i = maxBlogs - 1
        while (i >= 0) {
          cy.get('.blog').eq(maxBlogs - i - 1).contains('view').click()
          cy.get('.blog').contains(`likes ${i}`)
          i -= 1
        }
      })
    })
  })
})