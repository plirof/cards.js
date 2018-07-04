
$clicked_cards=1;
$clicked_cards_pl2=1;
$player1_turn=true;
$player1_attack=true; //if false pl2 attacks Stage2
$player1_completed_move=false;
$player2_completed_move=false;
$cards_in_hand=6;
$dice_last_value=0;

var $player_score=new Array(3);
$player_score[1]=0;
$player_score[2]=0;

$stage1=true;
$stage2=false; 
$stage3=false; //roll dice to check if attack & we click and compare

//Tell the library which element to use for the table
cards.init({table:'#card-table'});
$('#dice').hide();


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

//Let's deal when the Deal button is pressed:
$('#dice').click(function() {
	//Deck has a built in method to deal to hands.
	$('#dice').hide();
	$dice_last_value=rollDiceLocal(3);
	//console.log("dice_last_value="+$dice_last_value);
	$stage2=false;
	if($dice_last_value==3){$stage3=true; console.log("dice rolled == ATTACK (3)");} // ATTACK enabled now select card
	if($dice_last_value<3) {$stage1=true; console.log("dice rolled == 1,2 - Lost turn"); $player1_attack=false;stage1_init_round() ;}
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
//console.log("109 lowerhand.click player1_turn="+$player1_turn +" ,stage1 "+$stage1);
	//STAGE 1+++++++++++++++++++
	if($player1_turn && $stage1){
		//console.log("112 lowerhand.click");
		var slot_filled=false;
		for(i=1;i<4;i++){
			if(pl1_slot[i].isDeckEmpty()  && !slot_filled) {
			//if(null==(pl1_slot[i].topCard()) && !slot_filled){
				pl1_slot[i].addCard(card);
				pl1_slot[i].render();
				lowerhand.addCard(deck.topCard());
				lowerhand.render();	
				$clicked_cards=i+1;
				if($clicked_cards==4)$clicked_cards=1;
				slot_filled=true;
				i=4;
				break;			
			}
		}// end of for(i=1;i<4;i++){
		
	}
	if (((!pl1_slot[1].isDeckEmpty() && !pl1_slot[2].isDeckEmpty() && !pl1_slot[3].isDeckEmpty())) && $player2_completed_move==false && $stage1)	 {
		//console.log("131 lowerhand.click");
		$player1_turn=false;
		$player1_completed_move=true;
		enemy_turn();
	} ;//else stage1_init_round();



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
  	if ($stage3){
		//console.log("PL_slot("+i+"] CLICKED card="+card+"  -suit="+card.suit+" aaa pl2="+pl2_slot[i].topCard().suit+"  att_player="+att_player);
		//console.log("pl1slot-COMPARE="+compare_cards(card,pl2_slot[i].topCard()));
		if(att_player==1)scored=compare_cards(card,pl2_slot[i].topCard());
		if(att_player==2)scored=compare_cards(card,pl1_slot[i].topCard());
		//console.log("createCallback BEF  isDeckEmpty "+pl1_slot[i].isDeckEmpty());
		discardPile.addCard(pl1_slot[i].topCard());
		discardPile.render();
		discardPile.addCard(pl2_slot[i].topCard());
		discardPile.render();
		if(scored) {
			$player_score[att_player]++;
			alert (" GOAAAL!!!!!!!   Score : Player 1-Player 2 : "+$player_score[1]+"-"+$player_score[2]);
		}
		//console.log("createCallback AFTER  isDeckEmpty "+pl1_slot[i].isDeckEmpty());
		console.log("createCallback   att_player="+att_player+" score="+scored);
		$player1_attack=false;
		stage1_init_round();
	}

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
	//console.log("225 ENEMY TURN");
	if(!$player1_turn){
		//console.log("227 ENEMY TURN");
		//console.log("ENEMY TURN , card from hand ("+current_dice+")="+upperhand.getCardById(current_dice)+", ALLHAND="+upperhand.getAllCardsInHand());

		for (i=1;i<4;i++){
			if(pl2_slot[i].isDeckEmpty()) {
				pl2_slot[i].addCard(upperhand.getCardById(rollDiceLocal(6)));
				pl2_slot[i].render();
				//console.log("TOP CARD pl2sl1=".pl2_slot[1].topCardFromThisDeck());
				upperhand.addCard(deck.topCard());
				upperhand.render();
				$clicked_cards_pl2++;
			}
		}//for (i=1;i<4;i++){

		$clicked_cards_pl2=1;

		//}else {$clicked_cards_pl2=1;}	
		
		$player2_completed_move=true;
		$player1_turn=true;
		//console.log("247 player12_completed_move"+$player1_completed_move+$player2_completed_move);
		if ($player1_completed_move && $player2_completed_move)
		{//console.log("stage2_rolling()");
			stage2_rolling();
		}
		//alert ("ENEMY TURN");
	}
}

//here we roll the dice
function stage2_rolling(){
	console.log("====STAGE 2_rolling()");
	$stage1=false;
	$stage2=true;
	$player1_turn=true;	
	if ($player1_attack) {$('#dice').show();
	} else { stage2_pl2_roll_attack();}


}

//here we check if we have scored
function stage3_check_result(){
	console.log("====STAGE 3");
	$('#dice').hide();
	$stage1=false;
	$stage2=false;	
	$stage3=true;	
}

//here we check if we have scored
function stage2_pl2_roll_attack(){
	console.log("====STAGE 2 & 3 -player2 rolls & attacks");
	$player1_attack=true;
	$dice_last_value=rollDiceLocal(3);
	//console.log("dice_last_value="+$dice_last_value);
	if($dice_last_value==3){
		$stage3=true; 
		console.log("PL2 dice rolled == ATTACK (3)");
		//console.log("PL_slot("+i+"] CLICKED card="+card+"  -suit="+card.suit+" aaa pl2="+pl2_slot[i].topCard().suit+"  att_player="+att_player);
		//console.log("pl1slot-COMPARE="+compare_cards(card,pl2_slot[i].topCard()));
		$random_slot=rollDiceLocal(3);
		scored=compare_cards(pl2_slot[$random_slot].topCard(),pl1_slot[$random_slot].topCard());
		//console.log("createCallback BEF  isDeckEmpty "+pl1_slot[i].isDeckEmpty());
		discardPile.addCard(pl1_slot[$random_slot].topCard());
		discardPile.render();
		discardPile.addCard(pl2_slot[$random_slot].topCard());
		discardPile.render();
		if(scored) {
			$player_score[2]++;
			alert (" GOAAAL!!!!!!!   Score : Player 1-Player 2 : "+$player_score[1]+"-"+$player_score[2]);
			console.log(" GOAAAL!!!!!!!   Score : Player 1-Player 2 : "+$player_score[1]+"-"+$player_score[2]);
		}
		//console.log("createCallback AFTER  isDeckEmpty "+pl1_slot[i].isDeckEmpty());
		//console.log("createCallback   att_player="+att_player+" score="+scored);
		
		stage1_init_round();
	

	} // ATTACK enabled now select card
	if($dice_last_value<3) {
		$stage1=true; console.log("PL2 dice rolled == 1,2 - Lost turn"); 
		stage1_init_round() ;}

	//$('#dice').hide();
	$stage1=true;
	$stage2=false;	
	$stage3=false;	
}

//here we start a new round
function stage1_init_round(){
	console.log("====STAGE 1");
	if (deck.isDeckEmpty()){
		alert ("END OF MATCH score : player1 Vs Player2 :"+$player_score[1]+"-"+$player_score[2]);
		console.log("END OF MATCH score : player1 Vs Player2 :"+$player_score[1]+"-"+$player_score[2]);
		location.reload();

	}
	$stage1=true;
	$stage2=false;	
	$stage3=false;	
	$player1_turn=true;
	$player1_completed_move=false;
	$player2_completed_move=false;
	if (((  pl1_slot[1].isDeckEmpty() || pl1_slot[2].isDeckEmpty() || pl1_slot[3].isDeckEmpty())) 
		&& (pl2_slot[1].isDeckEmpty() || pl2_slot[2].isDeckEmpty() || pl2_slot[3].isDeckEmpty()))
		 {
		 	$('#dice').hide(); 
		 } else {
		 	stage2_rolling();
		 }
}

function rollDiceLocal($size){ // 1 - $size dice
	var randomDice = Math.floor($size*Math.random())+1;  
	return randomDice;
}

function compare_cards($card_att,$card_def=null){ // 1 - $size dice
	var goal=false;
	console.log("compare_cards ATT_suit="+$card_att.suit+" DEF_suit="+$card_def.suit)
	if ($card_att.suit==$card_def.suit) goal=true;
	// extra rules :
	if($card_def.rank==11 /*Q= BAD player*/) 	goal=true;
	if($card_att.rank==12 /*J= star attacker*/) goal=true;
	if($card_def.rank==13 /*K= goalkeeper*/) 	goal=false;
	return goal;
}