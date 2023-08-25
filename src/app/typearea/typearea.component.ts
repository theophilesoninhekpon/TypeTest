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
  speed!: number;
  precision!: number;
  errors!: number;
  seconds: number = 0;
  duration: string = ''
  textWords: string = 'avoir une bonne posture améliore ta concentration et te permet de travailler mieux et plus longtemps ; ça nous permet aussi de limiter les courbatures'; 
  textWords2: string = 'La clé du succès pour taper rapidement et avec précision consiste à utiliser tous ses doigts! Pour apprendre la bonne technique de frappe, utilisez une méthode adaptée à votre clavier.'
  raccourcis: string[] = ['ShiftLeft','ShiftRight','CapsLock']
  textWordsArray: string[] = this.textWords2.split(" ");
  testCharacters!: NodeList;
  results: boolean = false;
  space: string = " ";
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

          setTimeout(()=>{
            this.start = false;
          }, 2000)
          
          this.testCharacters= document.querySelectorAll<HTMLSpanElement>(".character");
          
          let firstElement = this.testCharacters[0];

          document.querySelector(".sentence")?.removeChild(this.testCharacters[this.testCharacters.length - 1]);
     
          this.highlight(firstElement);

      }

    }, 1000);
  }

  // Faire surbriller l'élément
  highlight(element : Node ){
    let convertedElement = element as HTMLElement;
    console.log(convertedElement);
    convertedElement.classList.add('current');
  }

  block(element: Element){
    element.classList.add("blocked");
  }

  removeHighlight(element: Element){
    element.classList.remove("current");
  }

  unblockElement(element: Element){
    element.classList.remove("blocked");
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
    let isBlocked = false;
    let numberOfGoodKeystrokes = 0;
    let numberOfBadKeystrokes = 0;
    let numberOfKeyStrokes = 0;
    
    userKeyDownEvent.subscribe((event) => {
      
      let currentElement: Element;
      userCharacter = event.key;
      console.log(event)
      currentWord = this.textWordsArray[wordCount];
      currentElement = this.testCharacters[characterCount] as HTMLElement;
      currentCharacter = currentElement.innerHTML;
      numberOfKeyStrokes++;
      let durationInterval;

      if(numberOfKeyStrokes === 1){

        durationInterval = setInterval(()=>{
          this.seconds++;
        }, 1000)

      }

      // quand le caractère que l'utilisateur saisi correspond au caractère actuel dans le test
      if(userCharacter === currentCharacter){

        numberOfGoodKeystrokes++;

        if(isBlocked){
          this.unblockElement(currentElement);
        }

        this.removeHighlight(currentElement);
        characterCount++;
        this.highlight(this.testCharacters[characterCount] as HTMLElement);

        // Quand l'utilisateur atteint la fin

        if(numberOfGoodKeystrokes === Array.from(this.testCharacters).indexOf(this.testCharacters[this.testCharacters.length -1])){
          
          if(this.seconds >= 59) {
            let minutes = 0;
            let rest = 0;
            minutes = 1;
            rest = this.seconds - 59;
            this.duration = `${minutes}min ${rest}s`;
          } else {
            this.duration = `${this.seconds}s`;
          }

          // Calcul de la vitesse
          this.speed = Math.floor((this.textWordsArray.length - 1) * 60 / this.seconds); 
          
          // Calcul de la précision
          this.precision = 100 - Math.floor(((numberOfBadKeystrokes) * 100) / numberOfKeyStrokes);

          // Erreurs lors de la saisie
          this.errors = numberOfBadKeystrokes;

          // autorise l'affichage des résultats
          this.results = true;

          clearInterval(durationInterval);

        }

      } else {       // quand le caractère que l'utilisateur saisi  ne correspond pas au caractère actuel dans le test

        console.log(event.shiftKey)
          if(!event.shiftKey && event.key !== 'CapsLock') {
            console.log("Pas Caps Lock")
            isBlocked = true;
            numberOfBadKeystrokes++;
            this.removeHighlight(currentElement);
            this.block(currentElement);
            
          }
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

