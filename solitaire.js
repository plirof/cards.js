cards.init({table: '#card-table'});

deck = new cards.Deck();
//puts it slightly to the side
deck.x -= 50;
//all cards in deck
deck.addCards(cards.all);
//put deck on table
deck.render({immediate:true})

upperhand = new cards.Hand({faceUp: false});
lowerhand = new cards.Hand({faceUp: true});

discardPile = new cards.Deck({faceUp: true});
discardPile.x += 50;
//deal when button pressed
$('#deal').click(() => {
  $('#deal').hide();
  deck.deal(5, [upperhand, lowerhand], 50, () => {
    discardPile.addCard(deck.topCard());
    discardPile.render();
  })
})
//click top card add card to hand
deck.click(card => {
  if (card === deck.topCard()){
    lowerhand.addCard(deck.topCard());
    lowerhand.render();
  }
})

//click card in your hand if its the same suit or rank as the top card of the discard pile then its added to it
lowerhand.click(card => {
  if (card.suit == discardPile.topCard().suit || card.rank == discardPile.topCard().rank){
    discardPile.addCard(card);
    discardPile.render();
    lowerhand.render()
  }
})

//when new game button clicked create a new game
$('#new-game').click(() => {
  console.log('new game clicked')
})