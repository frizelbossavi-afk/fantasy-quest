export interface Inputs {
    moveForward: boolean;
    moveBackward: boolean;
    moveLeft: boolean;
    moveRight: boolean;
    attack: boolean;
    skill1: boolean;
    skill2: boolean;
    inventory: boolean;
    quests: boolean;
    pause: boolean;
}

export class InputManager {
    private inputs: Inputs = {
        moveForward: false,
        moveBackward: false,
        moveLeft: false,
        moveRight: false,
        attack: false,
        skill1: false,
        skill2: false,
        inventory: false,
        quests: false,
        pause: false,
    };

    constructor(canvas: HTMLCanvasElement) {
        this.setupEventListeners(canvas);
    }

    private handleKeyDown(event: KeyboardEvent): void {
        // On utilise code pour ignorer le type de clavier (AZERTY/QWERTY)
        const code = event.code; 
        
        // Éviter la répétition automatique des touches système (Inventaire, Quêtes)
        if (event.repeat && (code === 'KeyI' || code === 'KeyQ' || code === 'Escape')) return;
    
        switch (code) {
            case 'KeyW': // Touche 'Z' sur AZERTY
            case 'ArrowUp':
                this.inputs.moveForward = true;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.inputs.moveBackward = true;
                break;
            case 'KeyA': // Touche 'Q' sur AZERTY
            case 'ArrowLeft':
                if (event.shiftKey) {
                    this.inputs.quests = true;
                } else {
                    this.inputs.moveLeft = true;
                }
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.inputs.moveRight = true;
                break;
            case 'KeyE':
                this.inputs.skill1 = true;
                break;
            case 'KeyR':
                this.inputs.skill2 = true;
                break;
            case 'KeyI':
                this.inputs.inventory = true;
                break;
            case 'Space': // On rajoute le saut !
                this.inputs.jump = true; // N'oublie pas de rajouter 'jump' dans ton interface Inputs
                break;
            case 'Escape':
                this.inputs.pause = true;
                break;
        }
    }
    private handleKeyUp(event: KeyboardEvent): void {
        const key = event.key.toLowerCase();
        
        switch (key) {
            case 'z':
            case 'arrowup':
                this.inputs.moveForward = false;
                break;
            case 's':
            case 'arrowdown':
                this.inputs.moveBackward = false;
                break;
            case 'q':
                this.inputs.moveLeft = false;
                this.inputs.quests = false;
                break;
            case 'd':
            case 'arrowright':
                this.inputs.moveRight = false;
                break;
            case 'e':
                this.inputs.skill1 = false;
                break;
            case 'r':
                this.inputs.skill2 = false;
                break;
            case 'i':
                this.inputs.inventory = false;
                break;
            case 'escape':
                this.inputs.pause = false;
                break;
        }
    }

    private handleMouseClick(event: MouseEvent): void {
        this.inputs.attack = true;
        setTimeout(() => {
            this.inputs.attack = false;
        }, 100);
    }

    public getInputs(): Inputs {
        return { ...this.inputs };
    }

    export class InputManager {
        private inputs: Inputs = { /* ... tes variables ... */ };
        public isGuiOpen: boolean = false; // Flag pour savoir si un menu est ouvert
    
        // ... (constructor et setup) ...
    
        public getInputs(): Inputs {
            // Si l'UI est ouverte, on renvoie des inputs "vides" pour le mouvement
            if (this.isGuiOpen) {
                return {
                    ...this.inputs,
                    moveForward: false,
                    moveBackward: false,
                    moveLeft: false,
                    moveRight: false,
                    attack: false
                    // On laisse passer 'pause' ou 'inventory' pour pouvoir fermer le menu !
                };
            }
            return { ...this.inputs };
        }
    }
}
