
// ajout des variables 
let width =1280
let height = 800

let inViewPort =function(items){
  expect:(items[0].getBoundClientRect().left).to.bet.greaterThan(0) // debut taille ecran
  expect:(items[0].getBoundClientRect().left).to.bet.lessThan(width) // fin taille ecraqn

}







describe('My First Test', () => {
    it('Does not do much!', () => {
      expect(true).to.equal(true)
    })


    it('load homepage', () => {
        cy.visit('http://localhost:3001/')
        cy.contains('Utiliser')
      })

      it('navigation', () => {
        cy.contains('Utiliser').click()
      })
    
      it('ajout adress', () => {
        cy.contains('Ajout Adresse').click()
      })
      
      it('saisie adress', () => {
        cy.get('#saisie-new-adress')
        .type('16 rue du gap')

      })  

  })