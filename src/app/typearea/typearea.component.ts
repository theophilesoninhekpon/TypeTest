import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-typearea',
  templateUrl: './typearea.component.html',
  styleUrls: ['./typearea.component.css']
})
export class TypeareaComponent implements OnInit{

  chronoState: number = 4;
  firstState: boolean = false;
  secondState: boolean = false;
  thirdState: boolean = false;
  start : boolean= false;
  loading: boolean = true;
  showChrono!: number;

  textWords: string[] = [
                          'avoir ', 
                          'une ', 
                          'bonne ', 
                          'posture ', 
                          'améliore ', 
                          'ta ', 
                          'concentration ', 
                          'et ', 
                          'te ', 
                          'permet ', 
                          'de ', 
                          'travailler ', 
                          'mieux ', 
                          'et ', 
                          'plus ', 
                          'longtemps ', 
                          '; ', 
                          'ça ', 
                          'nous ', 
                          'permet ', 
                          'aussi ', 
                          'de ', 
                          'limiter ', 
                          'les ', 
                          'courbatures '
                        ];

  /**
   * 
   * @param word le mot à convertir en tableau de caractères
   * @returns un tableau des caractères du mot
   */
  splitWord(word: string){
    return word.split('');
  }

  /**
   * Fonction de gestion du chronomètre
   */
  startChrono(){
    let interval = setInterval(() => {

      this.chronoState--;

      if(this.chronoState > 0){
        this.showChrono = this.chronoState;
      }
      
      switch (this.chronoState) {
        case 3:
          this.firstState = true;
          this.secondState = false;
          this.thirdState = false;
          break;
        
        case 2:
          this.firstState = false;
          this.secondState = true;
          this.thirdState = false;
          break;
        
        case 1:
          this.firstState = false;
          this.secondState = false;
          this.thirdState = true;
          break;
        
        default:
          clearInterval(interval);
          this.start = true;
          this.firstState = false;
          this.secondState = false;
          this.thirdState = false;
          this.loading = false;
     
      }

    }, 1000);
  }


  /**
   * Fonction de gestion de la saisie de l'utilisateur
   */

  verifyUserTyping(){

    let userKeyDownEvent = fromEvent<KeyboardEvent>(document, 'keydown');
    let userCharacter: string;
    let wordCount = 0;
    let characterCount = 0;
    let currentWord = "";
    let currentCharacter:string;
    
    userKeyDownEvent.subscribe((event) => {
      let testCharacters = document.querySelectorAll(".character");
      
      console.log(testCharacters);

      userCharacter = event.key;

      currentWord = this.textWords[wordCount];
      currentCharacter = currentWord.split('')[characterCount];

      if(userCharacter === currentCharacter){
        characterCount++;
      }

    }
  );


  }

  ngOnInit(): void {

      // Démarre le chrono
      this.startChrono();
      this.verifyUserTyping()
  }

}

