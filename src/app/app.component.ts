import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import axios from 'axios';
import { Subject } from 'rxjs';
import { Channel, Message, StreamChat } from 'stream-chat';
import { environment } from './../environments/environment';
import { WindowService } from './window.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {

  @ViewChild('characterNameModal')
  characterNameModal: TemplateRef<any> | undefined;

  @ViewChild('confirmRemoveResultModal')
  confirmRemoveResultModal: TemplateRef<any> | undefined;

  @ViewChild('successRollToast')
  successRollToast: TemplateRef<any> | undefined;

  @ViewChild('diceRollerTooltip')
  diceRollerTooltip: NgbTooltip | undefined;

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent): void {
    if (this.diceRollerTooltip?.isOpen()) {
      this.diceRollerTooltip?.close();
    }

    this.setVh100StyleProperty((event.target as Window).innerHeight);
  }

  DieEnum = Object.assign({}, Die);
  ModifierSignEnum = Object.assign({}, ModifierSign);

  characterProfileFormGroup: FormGroup;
  diceRollerFormGroup: FormGroup;

  characterId: string;
  characterName: string;
  diceRollResultsList: DiceRollResult[];
  diceRollResultsListForCurrentCharacter: DiceRollResult[];
  hiddenDiceRoll: boolean;

  diceRollerChatChannel: Channel | undefined;
  diceRollerChatChannelNewMessageSubscription: { unsubscribe: () => void } | undefined;
  diceRollerChatChannelMessageDeletedSubscription: { unsubscribe: () => void } | undefined;

  toastsSubjectObservable = new Subject<Toast>();
  toasts: Toast[] = [];

  constructor(
    private windowService: WindowService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private elementRef: ElementRef
  ) {
    const nomadCharacterId = localStorage.getItem('nomadCharacterId') || '';
    const nomadCharacterName = localStorage.getItem('nomadCharacterName') || '';

    this.characterId = nomadCharacterId;
    this.characterName = nomadCharacterName;
    this.diceRollResultsList = [];
    this.diceRollResultsListForCurrentCharacter = [];
    this.hiddenDiceRoll = false;

    this.characterProfileFormGroup = this.formBuilder.group({
      name: new FormControl(nomadCharacterName, Validators.required)
    });

    this.diceRollerFormGroup = this.formBuilder.group({
      numberOfDice: '',
      numberOfFaces: Die.D20,
      modifierSign: ModifierSign.Plus,
      modifierValue: ''
    });

    this.toastsSubjectObservable.subscribe(toast => this.toasts.push(toast));
  }

  ngAfterViewInit(): void {
    this.setVh100StyleProperty(this.windowService.windowRef.innerHeight);

    if (this.characterId) {
      this.joinChat();
    } else {
      this.openCharacterNameModal();
    }
  }

  ngOnDestroy(): void {
    this.toastsSubjectObservable.unsubscribe();

    this.diceRollerChatChannelNewMessageSubscription?.unsubscribe();
    this.diceRollerChatChannelMessageDeletedSubscription?.unsubscribe();
  }

  openCharacterNameModal(): void {
    const characterNameModalRef: NgbModalRef = this.modalService.open(
      this.characterNameModal,
      {
        size: 'sm',
        centered: true,
        backdropClass: 'bg-light',
        beforeDismiss: () => !!this.characterId
      }
    );

    characterNameModalRef.result.then(characterName => {
      const characterId = this.getCharacterIdFromCharacterName(characterName);

      this.characterProfileFormGroup.controls.name.setValue(characterName);
      this.characterId = characterId;
      this.characterName = characterName;

      localStorage.setItem('nomadCharacterId', characterId);
      localStorage.setItem('nomadCharacterName', characterName);

      this.joinChat();
    });
  }

  async roll(): Promise<void> {
    const { characterId, characterName, hiddenDiceRoll } = this;
    const diceRollerFormGroupControls = this.diceRollerFormGroup.controls;
    const numberOfDice = parseInt(diceRollerFormGroupControls.numberOfDice.value) || 1;
    const numberOfFaces = parseInt(diceRollerFormGroupControls.numberOfFaces.value);
    const modifierSign = diceRollerFormGroupControls.modifierSign.value;
    const modifierValue = parseInt(diceRollerFormGroupControls.modifierValue.value);

    const modifierExpression = Object.values(ModifierSign).includes(modifierSign as ModifierSign) && modifierValue
      ? `${modifierSign}${modifierValue}`
      : '';

    const diceNotation = `${numberOfDice > 1 ? numberOfDice : ''}d${numberOfFaces}${modifierExpression}`;

    const response = await axios.post<GenerateIntegersResult>(
      'https://api.random.org/json-rpc/4/invoke',
      {
        jsonrpc: '2.0',
        method: 'generateIntegers',
        params: { apiKey: environment.randomApiKey, n: numberOfDice, min: 1, max: numberOfFaces },
        id: 1
      }
    );

    const fullDiceRollResult = response.data.result.random.data;
    const reducedDiceRollResult = fullDiceRollResult.reduce((sum, current) => sum + current, 0);
    const reducedDiceRollResultWithModifiers = eval(`${reducedDiceRollResult}${modifierExpression}`);

    const diceRollResult: DiceRollResult = {
      messageId: '',
      characterId,
      characterName,
      diceNotation,
      fullDiceRollResult,
      reducedDiceRollResultWithModifiers,
      hiddenDiceRoll
    };
    await this.diceRollerChatChannel?.sendMessage({ text: JSON.stringify(diceRollResult) });
  }

  isDiceRollResultForCurrentCharacter(diceRollResult: DiceRollResult): boolean {
    return diceRollResult.characterId === this.characterId;
  }

  keyvaluePipeCompareFn(): number {
    return 0;
  }

  openConfirmRemoveResultModal(diceRollResult: DiceRollResult): void {
    const { messageId } = diceRollResult;

    const confirmRemoveResultModalRef: NgbModalRef = this.modalService.open(
      this.confirmRemoveResultModal,
      {
        size: 'sm',
        centered: true,
        backdropClass: 'bg-light'
      }
    );

    confirmRemoveResultModalRef.result
      .then(async () => await axios.post(`${environment.apiUrl}/delete-message`, { messageId }))
      .catch(() => { });
  }

  removeToast(toast: Toast): void {
    this.toasts.splice(this.toasts.indexOf(toast), 1)
  }

  private setVh100StyleProperty(innerHeight: number): void {
    this.elementRef.nativeElement.style.setProperty('--vh100', `${innerHeight}px`);
  }

  private getCharacterIdFromCharacterName(characterName: string): string {
    return characterName.replace(/\s/g, '--')
  }

  private async joinChat(): Promise<void> {
    const { characterId, characterName } = this;

    try {
      const response = await axios.post(`${environment.apiUrl}/join`, { characterId, characterName });

      const { token } = response.data;
      const apiKey = response.data.api_key;

      const chatClient = new StreamChat(apiKey);

      await chatClient.connectUser({ id: characterId, name: characterName }, token);

      const channel = chatClient.channel('team', 'dicerollerchatchannel');
      await channel.watch();

      this.diceRollerChatChannel = channel;

      this.diceRollResultsList.length = 0;
      this.diceRollResultsListForCurrentCharacter.length = 0;

      const diceRollerChatMessages = channel.state.messages as Message[];
      diceRollerChatMessages.forEach(diceRollerChatMessage => this.addDiceRollResult(diceRollerChatMessage, false));

      if (this.diceRollerChatChannelNewMessageSubscription) {
        this.diceRollerChatChannelNewMessageSubscription.unsubscribe();
      }

      this.diceRollerChatChannelNewMessageSubscription = channel.on(
        'message.new',
        event => this.addDiceRollResult(event.message as Message)
      );

      if (this.diceRollerChatChannelMessageDeletedSubscription) {
        this.diceRollerChatChannelMessageDeletedSubscription.unsubscribe();
      }

      this.diceRollerChatChannelMessageDeletedSubscription = channel.on(
        'message.deleted',
        event => this.removeDiceRollResult(event.message as Message)
      );
    } catch (err) {
      console.log(err);
      return;
    }
  }

  private addDiceRollResult(message: Message, emitAlert = true): void {
    const diceRollResult: DiceRollResult = { ...JSON.parse(message.text as string), messageId: message.id };
    const diceRollResultForCurrentCharacter = this.isDiceRollResultForCurrentCharacter(diceRollResult);

    if (diceRollResultForCurrentCharacter) {
      this.diceRollResultsListForCurrentCharacter.unshift(diceRollResult);
    }

    if (diceRollResultForCurrentCharacter || !diceRollResult.hiddenDiceRoll) {
      this.diceRollResultsList.unshift(diceRollResult);

      if (emitAlert) {
        this.toastsSubjectObservable.next({
          characterId: diceRollResult.characterId,
          characterName: diceRollResult.characterName,
          classname: `bg-${diceRollResultForCurrentCharacter ? 'info' : 'secondary'} text-light`,
          text: String(diceRollResult.reducedDiceRollResultWithModifiers),
          template: this.successRollToast
        });
      }
    }
  }

  private removeDiceRollResult(message: Message): void {
    const messageId = message.id;
    const diceRollResultIndex = this.diceRollResultsList.findIndex(
      diceRollResult => diceRollResult.messageId === messageId
    );

    if (diceRollResultIndex !== -1) {
      const diceRollResult: DiceRollResult = this.diceRollResultsList.splice(diceRollResultIndex, 1)[0];

      if (this.isDiceRollResultForCurrentCharacter(diceRollResult)) {
        this.diceRollResultsListForCurrentCharacter.splice(
          this.diceRollResultsListForCurrentCharacter.indexOf(diceRollResult),
          1
        );

        this.toastsSubjectObservable.next({
          characterId: diceRollResult.characterId,
          characterName: diceRollResult.characterName,
          classname: 'bg-success text-light',
          text: 'Result deleted successfully'
        });
      }
    }
  }
}

enum Die {
  D4 = '4',
  D6 = '6',
  D8 = '8',
  D10 = '10',
  D12 = '12',
  D20 = '20',
  D100 = '100'
}

enum ModifierSign {
  Plus = '+',
  Minus = '-'
}

interface DiceRollResult {
  messageId: string,
  characterId: string,
  characterName: string,
  diceNotation: string;
  fullDiceRollResult: number[];
  reducedDiceRollResultWithModifiers: number;
  hiddenDiceRoll: boolean;
}

interface GenerateIntegersResultDataRandom {
  data: number[]
}

interface GenerateIntegersResultData {
  random: GenerateIntegersResultDataRandom;
}

interface GenerateIntegersResult {
  result: GenerateIntegersResultData;
}

interface Toast {
  characterId: string;
  characterName: string;
  classname: string;
  text: string;
  template?: TemplateRef<any>;
}