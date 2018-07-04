
$clicked_cards=1;
$clicked_cards_pl2=1;
$player1_turn=true;
$player2_completed_move=false;
$cards_in_hand=6;

var $player_score=new Array(3);
$player_score[1]=0;
$player_score[2]=0;

$stage1=true;
$stage2=false; 
$stage3=false; //roll dice to check if attack & we click and compare

//Tell the library which element to use for the table
cards.init({table:'#card-table'});



//Create a new deck of cards
deck = new cards.Deck(); 
//By default it's in the middle of the container, put it slightly to the side
deck.x -= 300;

//cards.all contains all cards, put them all in the deck
deck.addCards(cards.all); 
//No animation here, just get the deck onto the table.
deck.render({immediate:true});

//Now lets create a couple of hands, one face down, one face up.
upperhand = new cards.Hand({faceUp:true, y:60});
upperhand.x-=300;
lowerhand = new cards.Hand({faceUp:true, y:340});
lowerhand.x-=300;


//Lets add a discard pile
discardPile = new cards.Deck({faceUp:true});
discardPile.x -= 200;

var pl1_slot=new Array(3);
pl1_y=40;
pl1_slot[1] = new cards.Deck({faceUp:true});
pl1_slot[1].y+=pl1_y;
pl1_slot[1].x+=0;
pl1_slot[2] = new cards.Deck({faceUp:true});
pl1_slot[2].y+=pl1_y;
pl1_slot[2].x+=80;
pl1_slot[3] = new cards.Deck({faceUp:true});
pl1_slot[3].y+=pl1_y;
pl1_slot[3].x+=160;

var pl2_slot=new Array(3);
pl2_y=-100;
pl2_slot[1] = new cards.Deck({faceUp:true});
pl2_slot[1].y+=pl2_y;
pl2_slot[1].x+=0;
pl2_slot[2] = new cards.Deck({faceUp:false});
pl2_slot[2].y+=pl2_y;
pl2_slot[2].x+=80;
pl2_slot[3] = new cards.Deck({faceUp:true});
pl2_slot[3].y+=pl2_y;
pl2_slot[3].x+=160;

init_slots_click_events();

//Let's deal when the Deal button is pressed:
$('#deal').click(function() {
	//Deck has a built in method to deal to hands.
	$('#deal').hide();
	deck.deal($cards_in_hand, [upperhand, lowerhand], 50, function() {
		//This is a callback function, called when the dealing
		//is done.
		discardPile.addCard(deck.topCard());
		discardPile.render();
		pl1_slot[1].render();
	});
});


//When you click on the top card of a deck, a card is added
//to your hand
/*
deck.click(function(card){
	if (card === deck.topCard()) {
		lowerhand.addCard(deck.topCard());
		lowerhand.render();
	}
});
*/

//Finally, when you click a card in your hand, if it's
//the same suit or rank as the top card of the discard pile
//then it's added to it
lowerhand.click(function(card){
	
	if($player1_turn){
		if($clicked_cards==1) {
			pl1_slot[1].addCard(card);
			pl1_slot[1].render();
			lowerhand.addCard(deck.topCard());
			lowerhand.render();
			$clicked_cards++;
		}else
		if($clicked_cards==2) {
			pl1_slot[2].addCard(card);
			pl1_slot[2].render();
			lowerhand.addCard(deck.topCard());
			lowerhand.render();		
			$clicked_cards++;
		}else	
		if($clicked_cards==3) {
			pl1_slot[3].addCard(card);
			pl1_slot[3].render();
			lowerhand.addCard(deck.topCard());
			lowerhand.render();		
			$clicked_cards=1;
		}else {$clicked_cards=1;$player1_turn=false;}	
	}
	if ($clicked_cards==1 && $player2_completed_move==false)	 {
		$player1_turn=false;
		enemy_turn();
	} else stage1_init_round();


/*
	if (card.suit == discardPile.topCard().suit 
		|| card.rank == discardPile.topCard().rank) {

		discardPile.addCard(card);
		discardPile.render();
		lowerhand.render();
	}
	*/
});

/*
upperhand.click(function(card){
	
	if($clicked_cards_pl2==1) {
		pl2_slot[1].addCard(card);
		pl2_slot[1].render();
		$clicked_cards_pl2++;
	}else
	if($clicked_cards_pl2==2) {
		pl2_slot[2].addCard(card);
		pl2_slot[2].render();
		$clicked_cards_pl2++;
	}else	
	if($clicked_cards_pl2==3) {
		pl2_slot[3].addCard(card);
		pl2_slot[3].render();
		$clicked_cards_pl2=1;
	}else {$clicked_cards_pl2=1;}


});

*/

function init_slots_click_events(){
	console.log("init_slots_click_events");

	for(var i=1;i<=3;i++) {
		
		pl1_slot[i].click(createCallback( i ,1 ));
		/*
	    pl1_slot[i].click(function(card){
	        console.log("pl1_slot("+i+"] CLICKED card="+card+"  -suit="+card.suit+" aaa pl2="+pl2_slot[i].topCard().suit);
	        console.log("pl1slot-COMPARE="+compare_cards(card,pl2_slot[i]));
	    });
	    */
	    // Following is considered cheating :)
	    pl2_slot[i].click(createCallback( i ,2 ));
	    /*
	    pl2_slot[i].click(function(card){
	        console.log("pl2_slot("+i+"] CLICKED card="+card+"  -suit="+card.suit);
	    });	    
	    */
	}
}

//click handler
function createCallback( i , att_player){
  return function(card){
  	var scored=false;
	//console.log("PL_slot("+i+"] CLICKED card="+card+"  -suit="+card.suit+" aaa pl2="+pl2_slot[i].topCard().suit+"  att_player="+att_player);
	//console.log("pl1slot-COMPARE="+compare_cards(card,pl2_slot[i].topCard()));
	if(att_player==1)scored=compare_cards(card,pl2_slot[i].topCard());
	if(att_player==2)scored=compare_cards(card,pl1_slot[i].topCard());
	console.log("createCallback   att_player="+att_player+" score="+scored);
	return scored;
  }
}

/*
pl1_slot[1].click(function(card){
	console.log("slot clicke - "+card);
	//alert("hello");
});
*/

//So, that should give you some idea about how to render a card game.
//Now you just need to write some logic around who can play when etc...
//Good luck :)

function enemy_turn(){
	console.log("ENEMY TURN");
	if(!$player1_turn){
		current_dice=rollDiceLocal(6);
		console.log("ENEMY TURN , card from hand ("+current_dice+")="+upperhand.getCardById(current_dice)+", ALLHAND="+upperhand.getAllCardsInHand());



		//if($clicked_cards_pl2==1) {
			pl2_slot[1].addCard(upperhand.getCardById(rollDiceLocal(6)));
			pl2_slot[1].render();
			//console.log("TOP CARD pl2sl1=".pl2_slot[1].topCardFromThisDeck());
			upperhand.addCard(deck.topCard());
			upperhand.render();
			$clicked_cards_pl2++;
		//}else
		//if($clicked_cards_pl2==2) {
			console.log("ENEMY TURN slot2");
			pl2_slot[2].addCard(upperhand.getCardById(rollDiceLocal(6)));
			pl2_slot[2].render();
			upperhand.addCard(deck.topCard());
			upperhand.render();		
			$clicked_cards_pl2++;
		//}else	
		//if($clicked_cards_pl2==3) {
			console.log("ENEMY TURN slot3");
			pl2_slot[3].addCard(upperhand.getCardById(rollDiceLocal(6)));
			pl2_slot[3].render();
			upperhand.addCard(deck.topCard());
			upperhand.render();		
			$clicked_cards_pl2=1;
		//}else {$clicked_cards_pl2=1;}	

		$player2_completed_move==true;
		//alert ("ENEMY TURN");
	}
}

//here we roll the dice
function stage2_rolling(){


}

//here we check if we have scored
function stage3_check_result(){


}

//here we start a new round
function stage1_init_round(){


}

function rollDiceLocal($size){ // 1 - $size dice
	var randomDice = Math.floor($size*Math.random())+1;  
	return randomDice;
}

function compare_cards($card_att,$card_def=null){ // 1 - $size dice
	var goal=false;
	console.log("compare_cards ATT_suit="+$card_att.suit+" DEF_suit="+$card_def.suit)
	if ($card_att.suit==$card_def.suit) goal=true;
	return goal;
}