
$clicked_cards=1;

//Tell the library which element to use for the table
cards.init({table:'#card-table'});

//Create a new deck of cards
deck = new cards.Deck(); 
//By default it's in the middle of the container, put it slightly to the side
deck.x -= 50;

//cards.all contains all cards, put them all in the deck
deck.addCards(cards.all); 
//No animation here, just get the deck onto the table.
deck.render({immediate:true});

//Now lets create a couple of hands, one face down, one face up.
upperhand = new cards.Hand({faceUp:false, y:60});
lowerhand = new cards.Hand({faceUp:true, y:340});
lowerhand.x-=300;
upperhand.x-=300;

//Lets add a discard pile
discardPile = new cards.Deck({faceUp:true});
discardPile.x += 50;

pl1_slot1 = new cards.Deck({faceUp:true});
pl1_slot1.y+=240;
pl1_slot1.x+=0;
pl1_slot2 = new cards.Deck({faceUp:true});
pl1_slot2.y+=240;
pl1_slot2.x+=80;
pl1_slot3 = new cards.Deck({faceUp:true});
pl1_slot3.y+=240;
pl1_slot3.x+=160;

//Let's deal when the Deal button is pressed:
$('#deal').click(function() {
	//Deck has a built in method to deal to hands.
	$('#deal').hide();
	deck.deal(5, [upperhand, lowerhand], 50, function() {
		//This is a callback function, called when the dealing
		//is done.
		discardPile.addCard(deck.topCard());
		discardPile.render();
		pl1_slot1.render();
	});
});


//When you click on the top card of a deck, a card is added
//to your hand
deck.click(function(card){
	if (card === deck.topCard()) {
		lowerhand.addCard(deck.topCard());
		lowerhand.render();
	}
});

//Finally, when you click a card in your hand, if it's
//the same suit or rank as the top card of the discard pile
//then it's added to it
lowerhand.click(function(card){
	
	if($clicked_cards==1) {
		pl1_slot1.addCard(card);
		pl1_slot1.render();
		$clicked_cards++;
	}else
	if($clicked_cards==2) {
		pl1_slot2.addCard(card);
		pl1_slot2.render();
		$clicked_cards++;
	}else	
	if($clicked_cards==3) {
		pl1_slot3.addCard(card);
		pl1_slot3.render();
		$clicked_cards=1;
	}else {$clicked_cards=1;}	
/*
	if (card.suit == discardPile.topCard().suit 
		|| card.rank == discardPile.topCard().rank) {

		discardPile.addCard(card);
		discardPile.render();
		lowerhand.render();
	}
	*/
});


//So, that should give you some idea about how to render a card game.
//Now you just need to write some logic around who can play when etc...
//Good luck :)
